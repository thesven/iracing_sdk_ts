import * as types from './types';
import { ApiEndpoints } from './endpoints';
import nodeFetch from 'node-fetch';
import fetchCookie from 'fetch-cookie';
import { CookieJar } from 'tough-cookie';

/**
 * Configuration options for the iRacing API SDK
 */
export interface IracingApiOptions {
  /** Base URL for the iRacing API. Defaults to https://members-ng.iracing.com */
  baseUrl?: string;
  /** Custom fetch implementation. Defaults to node-fetch with cookie support */
  fetchImpl?: typeof fetch;
  /** Whether to automatically handle chunked responses. Defaults to true */
  autoHandleChunkedResponses?: boolean;
}

/**
 * iRacing API SDK
 * 
 * A comprehensive TypeScript SDK for the iRacing API with support for all documented endpoints.
 * Handles authentication, rate limiting, and provides type-safe access to all iRacing data.
 * 
 * @example
 * ```typescript
 * const sdk = new iRacingSDK();
 * await sdk.authenticate({ email: 'user@example.com', password: 'password' });
 * const cars = await sdk.getCars();
 * ```
 */
export class iRacingSDK {
  private baseUrl: string;
  private fetchImpl: typeof fetch;
  private cookieJar: CookieJar;
  private ssoCookieValue?: string;
  private authcode?: string;
  private autoHandleChunkedResponses: boolean;

  /**
   * Creates a new iRacing SDK instance
   * 
   * @param options - Configuration options for the SDK
   */
  constructor(options: IracingApiOptions = {}) {
    this.baseUrl = options.baseUrl || 'https://members-ng.iracing.com';
    this.cookieJar = new CookieJar();
    this.fetchImpl = options.fetchImpl || (fetchCookie(nodeFetch, this.cookieJar) as unknown as typeof fetch);
    this.autoHandleChunkedResponses = options.autoHandleChunkedResponses !== false;
  }

  /**
   * Internal request helper that handles authentication, rate limiting, and error handling
   * 
   * @param path - API endpoint path
   * @param options - Fetch options
   * @param query - Query parameters
   * @returns Promise resolving to the API response
   */
  private async request<T = any>(
    path: string,
    options: RequestInit = {},
    query?: Record<string, any>
  ): Promise<T> {
    let url = this.baseUrl + path;
    if (query && Object.keys(query).length > 0) {
      const params = new URLSearchParams();
      for (const [key, value] of Object.entries(query)) {
        if (value !== undefined) params.append(key, String(value));
      }
      url += `?${params.toString()}`;
    }

    console.log(`Requesting: ${url}`);
    
    let baseHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
    };
    
    if (options.headers) {
      if (options.headers instanceof Headers) {
        options.headers.forEach((value, key) => { baseHeaders[key] = value; });
      } else if (Array.isArray(options.headers)) {
        for (const [key, value] of options.headers) baseHeaders[key] = value;
      } else {
        baseHeaders = { ...baseHeaders, ...options.headers };
      }
    }
    
    const res = await this.fetchImpl(url, {
      ...options,
      headers: baseHeaders,
      credentials: 'include',
    });
    
    // Handle rate limiting
    const limit = res.headers.get('x-ratelimit-limit');
    const remaining = res.headers.get('x-ratelimit-remaining');
    const reset = res.headers.get('x-ratelimit-reset');
    
    if (limit || remaining || reset) {
      console.log('[iRacing Rate Limit]', {
        limit,
        remaining,
        reset,
        resetDate: reset ? new Date(Number(reset) * 1000).toISOString() : undefined,
      });
    }
    
    if (remaining !== null && reset && Number(remaining) <= 1) {
      const now = Date.now();
      const resetMs = Number(reset) * 1000;
      const waitMs = resetMs - now;
      if (waitMs > 0) {
        console.warn(`[iRacingSDK] Rate limit reached. Waiting ${(waitMs / 1000).toFixed(1)} seconds until reset...`);
        await new Promise(res => setTimeout(res, waitMs));
      }
    }
    
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    return res.json();
  }

  /**
   * Authenticate with iRacing and store session cookies
   * 
   * @param req - Authentication request with email and password
   * @returns Promise resolving to authentication response
   */
  async authenticate(req: types.AuthRequest): Promise<types.AuthResponse> {
    const parsed = types.AuthRequestSchema.safeParse(req);
    if (!parsed.success) throw parsed.error;

    const email = req.email.toLowerCase();
    const passwordConcat = `${req.password}${email}`;
    
    let hashBase64: string;
    if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
      const hashBuffer = await window.crypto.subtle.digest('SHA-256', new TextEncoder().encode(passwordConcat));
      const hashArray = new Uint8Array(hashBuffer);
      const hashString = Array.from(hashArray).map(b => String.fromCharCode(b)).join('');
      hashBase64 = btoa(hashString);
    } else if (typeof global !== 'undefined' && global.crypto && global.crypto.subtle) {
      const hashBuffer = await global.crypto.subtle.digest('SHA-256', new TextEncoder().encode(passwordConcat));
      hashBase64 = Buffer.from(hashBuffer).toString('base64');
    } else {
      const { createHash } = await import('crypto');
      const hashBuffer = createHash('sha256').update(passwordConcat).digest();
      hashBase64 = hashBuffer.toString('base64');
    }

    const res = await this.fetchImpl(this.baseUrl + ApiEndpoints.AUTH, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password: hashBase64 }),
      credentials: 'include',
    });
    
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const response = await res.json();
    
    console.log('Authentication response:', JSON.stringify(response, null, 2));
    
    if (response.ssoCookieValue) {
      this.ssoCookieValue = response.ssoCookieValue;
      if (response.authcode) {
        this.authcode = response.authcode;
      }
    } else {
      const setCookie = res.headers.get('set-cookie');
      if (setCookie) {
        const match = setCookie.match(/irsso_membersv2=([^;]+)/);
        if (match) {
          this.ssoCookieValue = match[1];
        }
      }
      if (response.authcode) {
        this.authcode = response.authcode;
      }
    }
    
    return response;
  }

  /**
   * Handle chunked responses by fetching data from S3
   * 
   * @param response - Response containing chunk_info
   * @returns Promise resolving to combined chunked data
   */
  private async handleChunkedResponse<T>(response: any): Promise<T> {
    // Handle direct link response (common for member info and some other endpoints)
    if (response.link && !response.chunk_info) {
      console.log(`[iRacingSDK] Processing direct link response: ${response.link}`);
      
      const linkResponse = await this.fetchImpl(response.link);
      if (!linkResponse.ok) {
        throw new Error(`Failed to fetch linked data: ${linkResponse.status}`);
      }
      
      const contentType = linkResponse.headers.get('content-type');
      
      // Handle CSV responses (like driver stats)
      if (contentType && contentType.includes('text/csv')) {
        console.log(`[iRacingSDK] Processing CSV response`);
        const csvText = await linkResponse.text();
        return csvText as T;
      }
      
      // Handle JSON responses
      const linkData = await linkResponse.json();
      console.log(`[iRacingSDK] Successfully fetched linked data`);
      
      return linkData;
    }
    
    // Handle nested data structure with chunk_info (like search_series_results)
    if (response.data && response.data.chunk_info) {
      const nestedData = response.data;
      
      if (nestedData.chunk_info.num_chunks === 0 || nestedData.chunk_info.rows === 0) {
        // No chunks needed, return the nested data structure
        console.log(`[iRacingSDK] No chunks needed (${nestedData.chunk_info.rows} rows)`);
        return nestedData;
      }
      
      if (nestedData.chunk_info.chunk_file_names && nestedData.chunk_info.chunk_file_names.length > 0) {
        console.log(`[iRacingSDK] Processing ${nestedData.chunk_info.num_chunks} chunks from nested response`);
        
        const chunks: any[] = [];
        for (const chunkFileName of nestedData.chunk_info.chunk_file_names) {
          const chunkUrl = `${nestedData.chunk_info.base_download_url}${chunkFileName}`;
          console.log(`[iRacingSDK] Fetching chunk: ${chunkUrl}`);
          
          const chunkResponse = await this.fetchImpl(chunkUrl);
          if (!chunkResponse.ok) {
            throw new Error(`Failed to fetch chunk: ${chunkResponse.status}`);
          }
          
          const chunkData = await chunkResponse.json();
          chunks.push(...chunkData);
          
          // Add a small delay between chunk requests
          await new Promise(resolve => setTimeout(resolve, 100));
        }
        
        console.log(`[iRacingSDK] Combined ${chunks.length} records from ${nestedData.chunk_info.num_chunks} chunks`);
        
        return {
          ...nestedData,
          data: chunks,
          chunk_info: nestedData.chunk_info
        };
      }
      
      // Return nested data as-is if no special processing needed
      return nestedData;
    }
    
    // Handle traditional chunk_info responses (for backward compatibility)
    if (!response.chunk_info) {
      return response;
    }

    const chunkInfo = response.chunk_info;
    const chunks: any[] = [];
    
    console.log(`[iRacingSDK] Processing chunked response with ${chunkInfo.total_chunks} chunks`);
    
    // If single chunk file name is provided
    if (chunkInfo.chunk_file_name && chunkInfo.total_chunks === 1) {
      const chunkUrl = `${chunkInfo.base_download_url}${chunkInfo.chunk_file_name}`;
      console.log(`[iRacingSDK] Fetching single chunk: ${chunkUrl}`);
      
      const chunkResponse = await this.fetchImpl(chunkUrl);
      if (!chunkResponse.ok) {
        throw new Error(`Failed to fetch chunk: ${chunkResponse.status}`);
      }
      
      const chunkData = await chunkResponse.json();
      chunks.push(...chunkData);
    }
    // If multiple chunk file names are provided
    else if (chunkInfo.chunk_file_names && chunkInfo.chunk_file_names.length > 0) {
      for (const chunkFileName of chunkInfo.chunk_file_names) {
        const chunkUrl = `${chunkInfo.base_download_url}${chunkFileName}`;
        console.log(`[iRacingSDK] Fetching chunk: ${chunkUrl}`);
        
        const chunkResponse = await this.fetchImpl(chunkUrl);
        if (!chunkResponse.ok) {
          throw new Error(`Failed to fetch chunk: ${chunkResponse.status}`);
        }
        
        const chunkData = await chunkResponse.json();
        chunks.push(...chunkData);
        
        // Add a small delay between chunk requests to be respectful
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }
    // If we need to construct chunk file names (fallback)
    else {
      for (let i = 0; i < chunkInfo.total_chunks; i++) {
        const chunkFileName = `${chunkInfo.chunk_file_name.replace(/\.\w+$/, '')}_${i}.json`;
        const chunkUrl = `${chunkInfo.base_download_url}${chunkFileName}`;
        console.log(`[iRacingSDK] Fetching chunk ${i + 1}/${chunkInfo.total_chunks}: ${chunkUrl}`);
        
        try {
          const chunkResponse = await this.fetchImpl(chunkUrl);
          if (!chunkResponse.ok) {
            console.warn(`[iRacingSDK] Failed to fetch chunk ${i}: ${chunkResponse.status}`);
            continue;
          }
          
          const chunkData = await chunkResponse.json();
          chunks.push(...chunkData);
          
          // Add a small delay between chunk requests to be respectful
          await new Promise(resolve => setTimeout(resolve, 100));
        } catch (error) {
          console.warn(`[iRacingSDK] Error fetching chunk ${i}: ${error}`);
        }
      }
    }
    
    console.log(`[iRacingSDK] Combined ${chunks.length} records from ${chunkInfo.total_chunks} chunks`);
    
    // Return the response with the data field populated from chunks
    return {
      ...response,
      data: chunks,
      chunk_info: chunkInfo
    };
  }

  /**
   * Enhanced request method that handles both regular and chunked responses
   * 
   * @param path - API endpoint path
   * @param options - Fetch options
   * @param query - Query parameters
   * @param handleChunks - Whether to automatically handle chunked responses
   * @returns Promise resolving to the API response
   */
  private async requestWithChunking<T = any>(
    path: string,
    options: RequestInit = {},
    query?: Record<string, any>,
    handleChunks?: boolean
  ): Promise<T> {
    const response = await this.request(path, options, query);
    
    const shouldHandleChunks = handleChunks !== undefined ? handleChunks : this.autoHandleChunkedResponses;
    
    if (shouldHandleChunks && (response.chunk_info || response.link)) {
      return this.handleChunkedResponse<T>(response);
    }
    
    return response;
  }

  // === Car Data ===
  
  /**
   * Get car assets including images and logos
   * Image paths are relative to https://images-static.iracing.com/
   * 
   * @returns Promise resolving to car assets data
   */
  async getCarAssets(): Promise<types.CarAssetsResponse> {
    return this.requestWithChunking(ApiEndpoints.CAR_ASSETS);
  }

  /**
   * Get all available cars
   * 
   * @returns Promise resolving to car data
   */
  async getCars(): Promise<types.CarsResponse> {
    return this.requestWithChunking(ApiEndpoints.CAR_GET);
  }

  // === Car Class Data ===
  
  /**
   * Get all car classes
   * 
   * @returns Promise resolving to car class data
   */
  async getCarClasses(): Promise<types.CarClassesResponse> {
    return this.requestWithChunking(ApiEndpoints.CARCLASS_GET);
  }

  // === Constants ===
  
  /**
   * Get track categories (constant data)
   * 
   * @returns Promise resolving to category data
   */
  async getCategories(): Promise<types.CategoriesResponse> {
    return this.request(ApiEndpoints.CONSTANTS_CATEGORIES);
  }

  /**
   * Get divisions (constant data)
   * 
   * @returns Promise resolving to division data
   */
  async getDivisions(): Promise<types.DivisionsResponse> {
    return this.request(ApiEndpoints.CONSTANTS_DIVISIONS);
  }

  /**
   * Get event types (constant data)
   * 
   * @returns Promise resolving to event type data
   */
  async getEventTypes(): Promise<types.EventTypesResponse> {
    return this.request(ApiEndpoints.CONSTANTS_EVENT_TYPES);
  }

  // === Driver Stats by Category ===
  
  /**
   * Get driver stats for oval category
   * 
   * @returns Promise resolving to oval driver stats
   */
  async getDriverStatsOval(): Promise<types.DriverStatsResponse> {
    return this.requestWithChunking(ApiEndpoints.DRIVER_STATS_OVAL);
  }

  /**
   * Get driver stats for sports car category
   * 
   * @returns Promise resolving to sports car driver stats
   */
  async getDriverStatsSportsCar(): Promise<types.DriverStatsResponse> {
    return this.requestWithChunking(ApiEndpoints.DRIVER_STATS_SPORTS_CAR);
  }

  /**
   * Get driver stats for formula car category
   * 
   * @returns Promise resolving to formula car driver stats
   */
  async getDriverStatsFormulaCar(): Promise<types.DriverStatsResponse> {
    return this.requestWithChunking(ApiEndpoints.DRIVER_STATS_FORMULA_CAR);
  }

  /**
   * Get driver stats for road category
   * 
   * @returns Promise resolving to road driver stats
   */
  async getDriverStatsRoad(): Promise<types.DriverStatsResponse> {
    return this.requestWithChunking(ApiEndpoints.DRIVER_STATS_ROAD);
  }

  /**
   * Get driver stats for dirt oval category
   * 
   * @returns Promise resolving to dirt oval driver stats
   */
  async getDriverStatsDirtOval(): Promise<types.DriverStatsResponse> {
    return this.requestWithChunking(ApiEndpoints.DRIVER_STATS_DIRT_OVAL);
  }

  /**
   * Get driver stats for dirt road category
   * 
   * @returns Promise resolving to dirt road driver stats
   */
  async getDriverStatsDirtRoad(): Promise<types.DriverStatsResponse> {
    return this.requestWithChunking(ApiEndpoints.DRIVER_STATS_DIRT_ROAD);
  }

  // === Hosted Sessions ===
  
  /**
   * Get hosted sessions that can be joined as driver or spectator
   * Also includes non-league pending sessions for the user
   * 
   * @param params - Optional parameters to filter sessions
   * @returns Promise resolving to hosted session data
   */
  async getHostedCombinedSessions(params?: types.HostedCombinedSessionsParams): Promise<types.HostedSessionsResponse> {
    if (params) {
      const parsed = types.HostedCombinedSessionsParamsSchema.safeParse(params);
      if (!parsed.success) throw parsed.error;
    }
    return this.requestWithChunking(ApiEndpoints.HOSTED_COMBINED_SESSIONS, {}, params);
  }

  /**
   * Get hosted sessions that can be joined as driver
   * Without spectator and non-league pending sessions
   * 
   * @returns Promise resolving to hosted session data
   */
  async getHostedSessions(): Promise<types.HostedSessionsResponse> {
    return this.requestWithChunking(ApiEndpoints.HOSTED_SESSIONS);
  }

  // === League Data ===
  
  /**
   * Get customer league sessions
   * 
   * @param params - Optional parameters to filter sessions
   * @returns Promise resolving to league session data
   */
  async getLeagueCustSessions(params?: types.LeagueCustLeagueSessionsParams): Promise<types.LeagueSeasonSessionsResponse> {
    if (params) {
      const parsed = types.LeagueCustLeagueSessionsParamsSchema.safeParse(params);
      if (!parsed.success) throw parsed.error;
    }
    return this.request(ApiEndpoints.LEAGUE_CUST_LEAGUE_SESSIONS, {}, params);
  }

  /**
   * Search league directory
   * 
   * @param params - Optional search parameters
   * @returns Promise resolving to league directory data
   */
  async getLeagueDirectory(params?: types.LeagueDirectoryParams): Promise<types.LeagueDirectoryResponse> {
    if (params) {
      const parsed = types.LeagueDirectoryParamsSchema.safeParse(params);
      if (!parsed.success) throw parsed.error;
    }
    return this.requestWithChunking(ApiEndpoints.LEAGUE_DIRECTORY, {}, params);
  }

  /**
   * Get league information
   * 
   * @param params - League parameters including league ID
   * @returns Promise resolving to league data
   */
  async getLeague(params: types.LeagueGetParams): Promise<types.LeagueResponse> {
    const parsed = types.LeagueGetParamsSchema.safeParse(params);
    if (!parsed.success) throw parsed.error;
    return this.request(ApiEndpoints.LEAGUE_GET, {}, params);
  }

  /**
   * Get league points systems
   * 
   * @param params - Parameters including league ID
   * @returns Promise resolving to points system data
   */
  async getLeaguePointsSystems(params: types.LeaguePointsSystemsParams): Promise<types.LeaguePointsSystemsResponse> {
    const parsed = types.LeaguePointsSystemsParamsSchema.safeParse(params);
    if (!parsed.success) throw parsed.error;
    return this.request(ApiEndpoints.LEAGUE_GET_POINTS_SYSTEMS, {}, params);
  }

  /**
   * Get league membership information
   * 
   * @param params - Optional membership parameters
   * @returns Promise resolving to membership data
   */
  async getLeagueMembership(params?: types.LeagueMembershipParams): Promise<types.LeagueMembershipResponse> {
    if (params) {
      const parsed = types.LeagueMembershipParamsSchema.safeParse(params);
      if (!parsed.success) throw parsed.error;
    }
    return this.request(ApiEndpoints.LEAGUE_MEMBERSHIP, {}, params);
  }

  /**
   * Get league roster
   * 
   * @param params - Parameters including league ID
   * @returns Promise resolving to roster data
   */
  async getLeagueRoster(params: types.LeagueRosterParams): Promise<types.LeagueRosterResponse> {
    const parsed = types.LeagueRosterParamsSchema.safeParse(params);
    if (!parsed.success) throw parsed.error;
    return this.request(ApiEndpoints.LEAGUE_ROSTER, {}, params);
  }

  /**
   * Get league seasons
   * 
   * @param params - Parameters including league ID
   * @returns Promise resolving to season data
   */
  async getLeagueSeasons(params: types.LeagueSeasonsParams): Promise<types.LeagueSeasonsResponse> {
    const parsed = types.LeagueSeasonsParamsSchema.safeParse(params);
    if (!parsed.success) throw parsed.error;
    return this.request(ApiEndpoints.LEAGUE_SEASONS, {}, params);
  }

  /**
   * Get league season standings
   * 
   * @param params - Parameters including league and season IDs
   * @returns Promise resolving to standings data
   */
  async getLeagueSeasonStandings(params: types.LeagueSeasonStandingsParams): Promise<types.LeagueSeasonStandingsResponse> {
    const parsed = types.LeagueSeasonStandingsParamsSchema.safeParse(params);
    if (!parsed.success) throw parsed.error;
    return this.requestWithChunking(ApiEndpoints.LEAGUE_SEASON_STANDINGS, {}, params);
  }

  /**
   * Get league season sessions
   * 
   * @param params - Parameters including league and season IDs
   * @returns Promise resolving to session data
   */
  async getLeagueSeasonSessions(params: types.LeagueSeasonSessionsParams): Promise<types.LeagueSeasonSessionsResponse> {
    const parsed = types.LeagueSeasonSessionsParamsSchema.safeParse(params);
    if (!parsed.success) throw parsed.error;
    return this.request(ApiEndpoints.LEAGUE_SEASON_SESSIONS, {}, params);
  }

  // === Lookup Data ===
  
  /**
   * Get countries lookup data
   * 
   * @returns Promise resolving to country data
   */
  async getLookupCountries(): Promise<types.LookupCountriesResponse> {
    return this.requestWithChunking(ApiEndpoints.LOOKUP_COUNTRIES);
  }

  /**
   * Search for drivers
   * 
   * @param params - Search parameters including search term
   * @returns Promise resolving to driver search results
   */
  async getLookupDrivers(params: types.LookupDriversParams): Promise<types.LookupDriversResponse> {
    const parsed = types.LookupDriversParamsSchema.safeParse(params);
    if (!parsed.success) throw parsed.error;
    return this.requestWithChunking(ApiEndpoints.LOOKUP_DRIVERS, {}, params);
  }

  /**
   * Get flairs lookup data
   * Icons are from https://github.com/lipis/flag-icons/
   * 
   * @returns Promise resolving to flair data
   */
  async getLookupFlairs(): Promise<types.LookupFlairsResponse> {
    return this.requestWithChunking(ApiEndpoints.LOOKUP_FLAIRS);
  }

  /**
   * Get general lookup data
   * 
   * @returns Promise resolving to lookup data
   */
  async getLookupGet(): Promise<types.LookupGetResponse> {
    return this.requestWithChunking(ApiEndpoints.LOOKUP_GET);
  }

  /**
   * Get licenses lookup data
   * 
   * @returns Promise resolving to license data
   */
  async getLookupLicenses(): Promise<types.LookupLicensesResponse> {
    return this.requestWithChunking(ApiEndpoints.LOOKUP_LICENSES);
  }

  // === Member Data ===
  
  /**
   * Get member awards
   * 
   * @param params - Optional parameters including customer ID
   * @returns Promise resolving to award data
   */
  async getMemberAwards(params?: types.MemberAwardsParams): Promise<types.MemberAwardsResponse> {
    if (params) {
      const parsed = types.MemberAwardsParamsSchema.safeParse(params);
      if (!parsed.success) throw parsed.error;
    }
    return this.request(ApiEndpoints.MEMBER_AWARDS, {}, params);
  }

  /**
   * Get member award instances
   * 
   * @param params - Parameters including award ID
   * @returns Promise resolving to award instance data
   */
  async getMemberAwardInstances(params: types.MemberAwardInstancesParams): Promise<types.MemberAwardInstancesResponse> {
    const parsed = types.MemberAwardInstancesParamsSchema.safeParse(params);
    if (!parsed.success) throw parsed.error;
    return this.request(ApiEndpoints.MEMBER_AWARD_INSTANCES, {}, params);
  }

  /**
   * Get member chart data
   * 
   * @param params - Parameters including category and chart type
   * @returns Promise resolving to chart data
   */
  async getMemberChartData(params: types.MemberChartDataParams): Promise<types.MemberChartDataResponse> {
    const parsed = types.MemberChartDataParamsSchema.safeParse(params);
    if (!parsed.success) throw parsed.error;
    return this.request(ApiEndpoints.MEMBER_CHART_DATA, {}, params);
  }

  /**
   * Get member information by customer IDs
   * 
   * @param params - Parameters including customer IDs
   * @returns Promise resolving to member data
   */
  async getMembers(params: types.MemberGetParams): Promise<types.MembersResponse> {
    const parsed = types.MemberGetParamsSchema.safeParse(params);
    if (!parsed.success) throw parsed.error;
    return this.requestWithChunking(ApiEndpoints.MEMBER_GET, {}, params);
  }

  /**
   * Get authenticated member information
   * 
   * @returns Promise resolving to member info
   */
  async getMemberInfo(): Promise<types.MemberInfoResponse> {
    return this.requestWithChunking(ApiEndpoints.MEMBER_INFO);
  }

  /**
   * Get member participation credits
   * 
   * @returns Promise resolving to participation credit data
   */
  async getMemberParticipationCredits(): Promise<types.MemberParticipationCreditsResponse> {
    return this.request(ApiEndpoints.MEMBER_PARTICIPATION_CREDITS);
  }

  /**
   * Get member profile
   * 
   * @param params - Optional parameters including customer ID
   * @returns Promise resolving to profile data
   */
  async getMemberProfile(params?: types.MemberProfileParams): Promise<types.MemberProfileResponse> {
    if (params) {
      const parsed = types.MemberProfileParamsSchema.safeParse(params);
      if (!parsed.success) throw parsed.error;
    }
    return this.requestWithChunking(ApiEndpoints.MEMBER_PROFILE, {}, params);
  }

  // === Results Data ===
  
  /**
   * Get results for a subsession
   * 
   * @param params - Parameters including subsession ID
   * @returns Promise resolving to result data
   */
  async getResults(params: types.ResultsGetParams): Promise<types.ResultsResponse> {
    const parsed = types.ResultsGetParamsSchema.safeParse(params);
    if (!parsed.success) throw parsed.error;
    return this.request(ApiEndpoints.RESULTS_GET, {}, params);
  }

  /**
   * Get event log for a subsession
   * 
   * @param params - Parameters including subsession and session number
   * @returns Promise resolving to event log data
   */
  async getResultsEventLog(params: types.EventLogParams): Promise<types.EventLogResponse> {
    const parsed = types.EventLogParamsSchema.safeParse(params);
    if (!parsed.success) throw parsed.error;
    return this.request(ApiEndpoints.RESULTS_EVENT_LOG, {}, params);
  }

  /**
   * Get lap chart data for a subsession
   * 
   * @param params - Parameters including subsession and session number
   * @returns Promise resolving to lap chart data
   */
  async getResultsLapChartData(params: types.LapChartDataParams): Promise<types.LapChartDataResponse> {
    const parsed = types.LapChartDataParamsSchema.safeParse(params);
    if (!parsed.success) throw parsed.error;
    return this.request(ApiEndpoints.RESULTS_LAP_CHART_DATA, {}, params);
  }

  /**
   * Get lap data for a subsession
   * 
   * @param params - Parameters including subsession and session number
   * @returns Promise resolving to lap data
   */
  async getResultsLapData(params: types.LapDataParams): Promise<types.LapDataResponse> {
    const parsed = types.LapDataParamsSchema.safeParse(params);
    if (!parsed.success) throw parsed.error;
    return this.request(ApiEndpoints.RESULTS_LAP_DATA, {}, params);
  }

  /**
   * Search hosted and league session results
   * Maximum time frame of 90 days
   * 
   * @param params - Search parameters
   * @returns Promise resolving to hosted session results
   */
  async getResultsSearchHosted(params: types.ResultsSearchHostedParams): Promise<types.ResultsSearchResponse> {
    const parsed = types.ResultsSearchHostedParamsSchema.safeParse(params);
    if (!parsed.success) throw parsed.error;
    return this.requestWithChunking(ApiEndpoints.RESULTS_SEARCH_HOSTED, {}, params);
  }

  /**
   * Search official series results
   * Maximum time frame of 90 days
   * 
   * @param params - Search parameters
   * @returns Promise resolving to series results
   */
  async getResultsSearchSeries(params: types.ResultsSearchSeriesParams): Promise<types.ResultsSearchResponse> {
    const parsed = types.ResultsSearchSeriesParamsSchema.safeParse(params);
    if (!parsed.success) throw parsed.error;
    return this.requestWithChunking(ApiEndpoints.RESULTS_SEARCH_SERIES, {}, params);
  }

  /**
   * Get season results
   * 
   * @param params - Parameters including season ID
   * @returns Promise resolving to season results
   */
  async getResultsSeasonResults(params: types.SeasonResultsParams): Promise<types.ResultsSearchResponse> {
    const parsed = types.SeasonResultsParamsSchema.safeParse(params);
    if (!parsed.success) throw parsed.error;
    return this.requestWithChunking(ApiEndpoints.RESULTS_SEASON_RESULTS, {}, params);
  }

  // === Season Data ===
  
  /**
   * Get season list
   * 
   * @param params - Parameters including season year and quarter
   * @returns Promise resolving to season list
   */
  async getSeasonList(params: types.SeasonListParams): Promise<types.SeasonListResponse> {
    const parsed = types.SeasonListParamsSchema.safeParse(params);
    if (!parsed.success) throw parsed.error;
    return this.requestWithChunking(ApiEndpoints.SEASON_LIST, {}, params);
  }

  /**
   * Get season race guide
   * 
   * @param params - Optional parameters for filtering
   * @returns Promise resolving to race guide data
   */
  async getSeasonRaceGuide(params?: types.SeasonRaceGuideParams): Promise<types.SeasonRaceGuideResponse> {
    if (params) {
      const parsed = types.SeasonRaceGuideParamsSchema.safeParse(params);
      if (!parsed.success) throw parsed.error;
    }
    return this.requestWithChunking(ApiEndpoints.SEASON_RACE_GUIDE, {}, params);
  }

  /**
   * Get spectator subsession IDs
   * 
   * @param params - Optional parameters for filtering
   * @returns Promise resolving to spectator subsession IDs
   */
  async getSeasonSpectatorSubsessionIds(params?: types.SeasonSpectatorSubsessionIdsParams): Promise<types.SeasonSpectatorSubsessionIdsResponse> {
    if (params) {
      const parsed = types.SeasonSpectatorSubsessionIdsParamsSchema.safeParse(params);
      if (!parsed.success) throw parsed.error;
    }
    return this.request(ApiEndpoints.SEASON_SPECTATOR_SUBSESSIONIDS, {}, params);
  }

  /**
   * Get detailed spectator subsession information
   * 
   * @param params - Optional parameters for filtering
   * @returns Promise resolving to detailed spectator subsession data
   */
  async getSeasonSpectatorSubsessionIdsDetail(params?: types.SeasonSpectatorSubsessionIdsDetailParams): Promise<types.SeasonSpectatorSubsessionIdsDetailResponse> {
    if (params) {
      const parsed = types.SeasonSpectatorSubsessionIdsDetailParamsSchema.safeParse(params);
      if (!parsed.success) throw parsed.error;
    }
    return this.request(ApiEndpoints.SEASON_SPECTATOR_SUBSESSIONIDS_DETAIL, {}, params);
  }

  // === Series Data ===
  
  /**
   * Get series assets including images and logos
   * Image paths are relative to https://images-static.iracing.com/
   * 
   * @returns Promise resolving to series assets
   */
  async getSeriesAssets(): Promise<types.SeriesAssetsResponse> {
    return this.requestWithChunking(ApiEndpoints.SERIES_ASSETS);
  }

  /**
   * Get all series
   * 
   * @returns Promise resolving to series data
   */
  async getSeries(): Promise<types.SeriesResponse> {
    return this.requestWithChunking(ApiEndpoints.SERIES_GET);
  }

  /**
   * Get all seasons for a series
   * Filter by official:true for seasons with standings
   * 
   * @param params - Parameters including series ID
   * @returns Promise resolving to past seasons data
   */
  async getSeriesPastSeasons(params: types.SeriesPastSeasonsParams): Promise<types.SeriesPastSeasonsResponse> {
    const parsed = types.SeriesPastSeasonsParamsSchema.safeParse(params);
    if (!parsed.success) throw parsed.error;
    return this.request(ApiEndpoints.SERIES_PAST_SEASONS, {}, params);
  }

  /**
   * Get series seasons
   * 
   * @param params - Optional parameters for filtering
   * @returns Promise resolving to series seasons
   */
  async getSeriesSeasons(params?: types.SeriesSeasonsParams): Promise<types.SeriesSeasonsResponse> {
    if (params) {
      const parsed = types.SeriesSeasonsParamsSchema.safeParse(params);
      if (!parsed.success) throw parsed.error;
    }
    return this.requestWithChunking(ApiEndpoints.SERIES_SEASONS, {}, params);
  }

  /**
   * Get series season list
   * 
   * @param params - Optional parameters for filtering
   * @returns Promise resolving to series season list
   */
  async getSeriesSeasonList(params?: types.SeriesSeasonListParams): Promise<types.SeriesSeasonListResponse> {
    if (params) {
      const parsed = types.SeriesSeasonListParamsSchema.safeParse(params);
      if (!parsed.success) throw parsed.error;
    }
    return this.requestWithChunking(ApiEndpoints.SERIES_SEASON_LIST, {}, params);
  }

  /**
   * Get series season schedule
   * 
   * @param params - Parameters including season ID
   * @returns Promise resolving to season schedule
   */
  async getSeriesSeasonSchedule(params: types.SeriesSeasonScheduleParams): Promise<types.SeriesSeasonScheduleResponse> {
    const parsed = types.SeriesSeasonScheduleParamsSchema.safeParse(params);
    if (!parsed.success) throw parsed.error;
    return this.request(ApiEndpoints.SERIES_SEASON_SCHEDULE, {}, params);
  }

  /**
   * Get series stats
   * Filter by official:true for series with standings
   * 
   * @returns Promise resolving to series stats
   */
  async getSeriesStats(): Promise<types.SeriesStatsResponse> {
    return this.requestWithChunking(ApiEndpoints.SERIES_STATS_SERIES);
  }

  // === Stats Data ===
  
  /**
   * Get member best times
   * 
   * @param params - Optional parameters including customer and car IDs
   * @returns Promise resolving to member best times
   */
  async getStatsMemberBests(params?: types.StatsMemberBestsParams): Promise<types.StatsMemberBestsResponse> {
    if (params) {
      const parsed = types.StatsMemberBestsParamsSchema.safeParse(params);
      if (!parsed.success) throw parsed.error;
    }
    return this.requestWithChunking(ApiEndpoints.STATS_MEMBER_BESTS, {}, params);
  }

  /**
   * Get member career statistics
   * 
   * @param params - Optional parameters including customer ID
   * @returns Promise resolving to member career data
   */
  async getStatsMemberCareer(params?: types.StatsMemberCareerParams): Promise<types.StatsMemberCareerResponse> {
    if (params) {
      const parsed = types.StatsMemberCareerParamsSchema.safeParse(params);
      if (!parsed.success) throw parsed.error;
    }
    return this.requestWithChunking(ApiEndpoints.STATS_MEMBER_CAREER, {}, params);
  }

  /**
   * Get member division standings
   * Always for the authenticated member
   * 
   * @param params - Parameters including season and event type
   * @returns Promise resolving to member division data
   */
  async getStatsMemberDivision(params: types.StatsMemberDivisionParams): Promise<types.StatsMemberDivisionResponse> {
    const parsed = types.StatsMemberDivisionParamsSchema.safeParse(params);
    if (!parsed.success) throw parsed.error;
    return this.request(ApiEndpoints.STATS_MEMBER_DIVISION, {}, params);
  }

  /**
   * Get member recap statistics
   * 
   * @param params - Optional parameters including customer ID and time period
   * @returns Promise resolving to member recap data
   */
  async getStatsMemberRecap(params?: types.StatsMemberRecapParams): Promise<types.StatsMemberRecapResponse> {
    if (params) {
      const parsed = types.StatsMemberRecapParamsSchema.safeParse(params);
      if (!parsed.success) throw parsed.error;
    }
    return this.requestWithChunking(ApiEndpoints.STATS_MEMBER_RECAP, {}, params);
  }

  /**
   * Get member recent races
   * 
   * @param params - Optional parameters including customer ID
   * @returns Promise resolving to recent races data
   */
  async getStatsMemberRecentRaces(params?: types.StatsMemberRecentRacesParams): Promise<types.StatsMemberRecentRacesResponse> {
    if (params) {
      const parsed = types.StatsMemberRecentRacesParamsSchema.safeParse(params);
      if (!parsed.success) throw parsed.error;
    }
    return this.requestWithChunking(ApiEndpoints.STATS_MEMBER_RECENT_RACES, {}, params);
  }

  /**
   * Get member summary statistics
   * 
   * @param params - Optional parameters including customer ID
   * @returns Promise resolving to member summary data
   */
  async getStatsMemberSummary(params?: types.StatsMemberSummaryParams): Promise<types.StatsMemberSummaryResponse> {
    if (params) {
      const parsed = types.StatsMemberSummaryParamsSchema.safeParse(params);
      if (!parsed.success) throw parsed.error;
    }
    return this.requestWithChunking(ApiEndpoints.STATS_MEMBER_SUMMARY, {}, params);
  }

  /**
   * Get member yearly statistics
   * 
   * @param params - Optional parameters including customer ID
   * @returns Promise resolving to yearly statistics
   */
  async getStatsMemberYearly(params?: types.StatsMemberYearlyParams): Promise<types.StatsMemberYearlyResponse> {
    if (params) {
      const parsed = types.StatsMemberYearlyParamsSchema.safeParse(params);
      if (!parsed.success) throw parsed.error;
    }
    return this.requestWithChunking(ApiEndpoints.STATS_MEMBER_YEARLY, {}, params);
  }

  /**
   * Get season driver standings
   * 
   * @param params - Parameters including season and car class IDs
   * @returns Promise resolving to driver standings
   */
  async getStatsSeasonDriverStandings(params: types.StatsSeasonDriverStandingsParams): Promise<types.StatsSeasonStandingsResponse> {
    const parsed = types.StatsSeasonDriverStandingsParamsSchema.safeParse(params);
    if (!parsed.success) throw parsed.error;
    return this.requestWithChunking(ApiEndpoints.STATS_SEASON_DRIVER_STANDINGS, {}, params);
  }

  /**
   * Get season supersession standings
   * 
   * @param params - Parameters including season and car class IDs
   * @returns Promise resolving to supersession standings
   */
  async getStatsSeasonSupersessionStandings(params: types.StatsSeasonSupersessionStandingsParams): Promise<types.StatsSeasonStandingsResponse> {
    const parsed = types.StatsSeasonSupersessionStandingsParamsSchema.safeParse(params);
    if (!parsed.success) throw parsed.error;
    return this.requestWithChunking(ApiEndpoints.STATS_SEASON_SUPERSESSION_STANDINGS, {}, params);
  }

  /**
   * Get season team standings
   * 
   * @param params - Parameters including season and car class IDs
   * @returns Promise resolving to team standings
   */
  async getStatsSeasonTeamStandings(params: types.StatsSeasonTeamStandingsParams): Promise<types.StatsSeasonStandingsResponse> {
    const parsed = types.StatsSeasonTeamStandingsParamsSchema.safeParse(params);
    if (!parsed.success) throw parsed.error;
    return this.requestWithChunking(ApiEndpoints.STATS_SEASON_TEAM_STANDINGS, {}, params);
  }

  /**
   * Get season time trial standings
   * 
   * @param params - Parameters including season and car class IDs
   * @returns Promise resolving to time trial standings
   */
  async getStatsSeasonTTStandings(params: types.StatsSeasonTTStandingsParams): Promise<types.StatsSeasonStandingsResponse> {
    const parsed = types.StatsSeasonTTStandingsParamsSchema.safeParse(params);
    if (!parsed.success) throw parsed.error;
    return this.requestWithChunking(ApiEndpoints.STATS_SEASON_TT_STANDINGS, {}, params);
  }

  /**
   * Get season time trial results
   * 
   * @param params - Parameters including season, car class, and race week
   * @returns Promise resolving to time trial results
   */
  async getStatsSeasonTTResults(params: types.StatsSeasonTTResultsParams): Promise<types.StatsSeasonStandingsResponse> {
    const parsed = types.StatsSeasonTTResultsParamsSchema.safeParse(params);
    if (!parsed.success) throw parsed.error;
    return this.requestWithChunking(ApiEndpoints.STATS_SEASON_TT_RESULTS, {}, params);
  }

  /**
   * Get season qualifying results
   * 
   * @param params - Parameters including season, car class, and race week
   * @returns Promise resolving to qualifying results
   */
  async getStatsSeasonQualifyResults(params: types.StatsSeasonQualifyResultsParams): Promise<types.StatsSeasonStandingsResponse> {
    const parsed = types.StatsSeasonQualifyResultsParamsSchema.safeParse(params);
    if (!parsed.success) throw parsed.error;
    return this.requestWithChunking(ApiEndpoints.STATS_SEASON_QUALIFY_RESULTS, {}, params);
  }

  /**
   * Get world records for a car and track combination
   * 
   * @param params - Parameters including car and track IDs
   * @returns Promise resolving to world records
   */
  async getStatsWorldRecords(params: types.StatsWorldRecordsParams): Promise<types.StatsWorldRecordsResponse> {
    const parsed = types.StatsWorldRecordsParamsSchema.safeParse(params);
    if (!parsed.success) throw parsed.error;
    return this.request(ApiEndpoints.STATS_WORLD_RECORDS, {}, params);
  }

  // === Team Data ===
  
  /**
   * Get team information
   * 
   * @param params - Parameters including team ID
   * @returns Promise resolving to team data
   */
  async getTeam(params: types.TeamGetParams): Promise<types.TeamResponse> {
    const parsed = types.TeamGetParamsSchema.safeParse(params);
    if (!parsed.success) throw parsed.error;
    return this.request(ApiEndpoints.TEAM_GET, {}, params);
  }

  // === Time Attack Data ===
  
  /**
   * Get time attack member season results
   * Results for the authenticated member, if any
   * 
   * @param params - Parameters including competition season ID
   * @returns Promise resolving to time attack results
   */
  async getTimeAttackMemberSeasonResults(params: types.TimeAttackMemberSeasonResultsParams): Promise<types.TimeAttackMemberSeasonResultsResponse> {
    const parsed = types.TimeAttackMemberSeasonResultsParamsSchema.safeParse(params);
    if (!parsed.success) throw parsed.error;
    return this.request(ApiEndpoints.TIME_ATTACK_MEMBER_SEASON_RESULTS, {}, params);
  }

  // === Track Data ===
  
  /**
   * Get track assets including images and logos
   * Image paths are relative to https://images-static.iracing.com/
   * 
   * @returns Promise resolving to track assets
   */
  async getTrackAssets(): Promise<types.TrackAssetsResponse> {
    return this.requestWithChunking(ApiEndpoints.TRACK_ASSETS);
  }

  /**
   * Get all tracks
   * 
   * @returns Promise resolving to track data
   */
  async getTracks(): Promise<types.TracksResponse> {
    return this.requestWithChunking(ApiEndpoints.TRACK_GET);
  }

  // === Backward compatibility methods ===
  
  /** @deprecated Use getCars() instead */
  async getAllCars(): Promise<types.CarsResponse> {
    return this.getCars();
  }

  /** @deprecated Use getCarClasses() instead */
  async getAllCarClasses(): Promise<types.CarClassesResponse> {
    return this.getCarClasses();
  }

  /** @deprecated Use getCategories() instead */
  async getConstantsCategories(): Promise<types.CategoriesResponse> {
    return this.getCategories();
  }

  /** @deprecated Use getEventTypes() instead */
  async getConstantsEventTypes(): Promise<types.EventTypesResponse> {
    return this.getEventTypes();
  }
}