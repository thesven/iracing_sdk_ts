import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { iRacingSDK } from '../iracingApi';
import { ApiEndpoints } from '../endpoints';
import * as types from '../types';

// Mock node-fetch and fetch-cookie
vi.mock('node-fetch');
vi.mock('fetch-cookie');
vi.mock('tough-cookie');

describe('iRacingSDK', () => {
  let sdk: iRacingSDK;
  let mockFetch: ReturnType<typeof vi.fn>;
  let mockResponse: any;

  beforeEach(() => {
    mockFetch = vi.fn();
    mockResponse = {
      ok: true,
      json: vi.fn(),
      headers: {
        get: vi.fn(),
      },
    };
    mockFetch.mockResolvedValue(mockResponse);
    
    sdk = new iRacingSDK({
      fetchImpl: mockFetch as any,
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('constructor', () => {
    it('should create instance with default options', () => {
      const sdkDefault = new iRacingSDK();
      expect(sdkDefault).toBeInstanceOf(iRacingSDK);
    });

    it('should create instance with custom options', () => {
      const customSdk = new iRacingSDK({
        baseUrl: 'https://custom.iracing.com',
        fetchImpl: mockFetch as any,
      });
      expect(customSdk).toBeInstanceOf(iRacingSDK);
    });
  });

  describe('authentication', () => {
    it('should authenticate successfully', async () => {
      const authResponse = {
        authcode: 'test-authcode',
        ssoCookieValue: 'test-sso-cookie',
        custId: 12345,
        email: 'test@example.com',
      };
      mockResponse.json.mockResolvedValue(authResponse);

      const result = await sdk.authenticate({
        email: 'test@example.com',
        password: 'password123',
      });

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining(ApiEndpoints.AUTH),
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
          }),
          body: expect.stringContaining('"email":"test@example.com"'),
        })
      );
      expect(result).toEqual(authResponse);
    });

    it('should throw error for invalid credentials', async () => {
      mockResponse.ok = false;
      mockResponse.status = 401;
      mockFetch.mockResolvedValue(mockResponse);

      await expect(
        sdk.authenticate({
          email: 'test@example.com',
          password: 'wrongpassword',
        })
      ).rejects.toThrow('HTTP error! status: 401');
    });

    it('should validate authentication request', async () => {
      await expect(
        sdk.authenticate({
          email: 'invalid-email',
          password: 'password123',
        })
      ).rejects.toThrow();
    });
  });

  describe('car endpoints', () => {
    it('should get car assets', async () => {
      const carAssets = [{ car_id: 1, logo: 'logo.png' }];
      mockResponse.json.mockResolvedValue(carAssets);

      const result = await sdk.getCarAssets();

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining(ApiEndpoints.CAR_ASSETS),
        expect.any(Object)
      );
      expect(result).toEqual(carAssets);
    });

    it('should get all cars', async () => {
      const cars = [{ car_id: 1, car_name: 'Test Car' }];
      mockResponse.json.mockResolvedValue(cars);

      const result = await sdk.getCars();

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining(ApiEndpoints.CAR_GET),
        expect.any(Object)
      );
      expect(result).toEqual(cars);
    });

    it('should get car classes', async () => {
      const carClasses = [{ car_class_id: 1, name: 'Test Class' }];
      mockResponse.json.mockResolvedValue(carClasses);

      const result = await sdk.getCarClasses();

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining(ApiEndpoints.CARCLASS_GET),
        expect.any(Object)
      );
      expect(result).toEqual(carClasses);
    });
  });

  describe('constants endpoints', () => {
    it('should get categories', async () => {
      const categories = [{ category_id: 1, category: 'Oval' }];
      mockResponse.json.mockResolvedValue(categories);

      const result = await sdk.getCategories();

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining(ApiEndpoints.CONSTANTS_CATEGORIES),
        expect.any(Object)
      );
      expect(result).toEqual(categories);
    });

    it('should get divisions', async () => {
      const divisions = [{ division: 0, division_name: 'Division 1' }];
      mockResponse.json.mockResolvedValue(divisions);

      const result = await sdk.getDivisions();

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining(ApiEndpoints.CONSTANTS_DIVISIONS),
        expect.any(Object)
      );
      expect(result).toEqual(divisions);
    });

    it('should get event types', async () => {
      const eventTypes = [{ event_type: 5, event_type_name: 'Race' }];
      mockResponse.json.mockResolvedValue(eventTypes);

      const result = await sdk.getEventTypes();

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining(ApiEndpoints.CONSTANTS_EVENT_TYPES),
        expect.any(Object)
      );
      expect(result).toEqual(eventTypes);
    });
  });

  describe('hosted sessions endpoints', () => {
    it('should get hosted combined sessions without parameters', async () => {
      const sessions = [{ session_id: 1, session_name: 'Test Session' }];
      mockResponse.json.mockResolvedValue(sessions);

      const result = await sdk.getHostedCombinedSessions();

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining(ApiEndpoints.HOSTED_COMBINED_SESSIONS),
        expect.any(Object)
      );
      expect(result).toEqual(sessions);
    });

    it('should get hosted combined sessions with parameters', async () => {
      const sessions = [{ session_id: 1, session_name: 'Test Session' }];
      mockResponse.json.mockResolvedValue(sessions);

      const result = await sdk.getHostedCombinedSessions({ package_id: 123 });

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining(ApiEndpoints.HOSTED_COMBINED_SESSIONS),
        expect.any(Object)
      );
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('package_id=123'),
        expect.any(Object)
      );
      expect(result).toEqual(sessions);
    });

    it('should get hosted sessions', async () => {
      const sessions = [{ session_id: 1, session_name: 'Test Session' }];
      mockResponse.json.mockResolvedValue(sessions);

      const result = await sdk.getHostedSessions();

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining(ApiEndpoints.HOSTED_SESSIONS),
        expect.any(Object)
      );
      expect(result).toEqual(sessions);
    });
  });

  describe('league endpoints', () => {
    it('should get league information', async () => {
      const league = { league_id: 1, league_name: 'Test League' };
      mockResponse.json.mockResolvedValue(league);

      const result = await sdk.getLeague({ league_id: 1 });

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining(ApiEndpoints.LEAGUE_GET),
        expect.any(Object)
      );
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('league_id=1'),
        expect.any(Object)
      );
      expect(result).toEqual(league);
    });

    it('should validate league parameters', async () => {
      await expect(
        sdk.getLeague({ league_id: 'invalid' as any })
      ).rejects.toThrow();
    });

    it('should get league directory with search parameters', async () => {
      const leagues = [{ league_id: 1, league_name: 'Test League' }];
      mockResponse.json.mockResolvedValue(leagues);

      const result = await sdk.getLeagueDirectory({
        search: 'test',
        restrict_to_recruiting: true,
      });

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining(ApiEndpoints.LEAGUE_DIRECTORY),
        expect.any(Object)
      );
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('search=test'),
        expect.any(Object)
      );
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('restrict_to_recruiting=true'),
        expect.any(Object)
      );
      expect(result).toEqual(leagues);
    });
  });

  describe('member endpoints', () => {
    it('should get member information', async () => {
      const members = [{ cust_id: 1, display_name: 'Test User' }];
      mockResponse.json.mockResolvedValue(members);

      const result = await sdk.getMembers({ cust_ids: [1, 2, 3] });

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining(ApiEndpoints.MEMBER_GET),
        expect.any(Object)
      );
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('cust_ids=1%2C2%2C3'),
        expect.any(Object)
      );
      expect(result).toEqual(members);
    });

    it('should get member info for authenticated user', async () => {
      const memberInfo = { cust_id: 1, display_name: 'Test User' };
      mockResponse.json.mockResolvedValue(memberInfo);

      const result = await sdk.getMemberInfo();

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining(ApiEndpoints.MEMBER_INFO),
        expect.any(Object)
      );
      expect(result).toEqual(memberInfo);
    });

    it('should get member chart data', async () => {
      const chartData = { chart_data: [{ x: 1, y: 2 }] };
      mockResponse.json.mockResolvedValue(chartData);

      const result = await sdk.getMemberChartData({
        category_id: 1,
        chart_type: 2,
      });

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining(ApiEndpoints.MEMBER_CHART_DATA),
        expect.any(Object)
      );
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('category_id=1'),
        expect.any(Object)
      );
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('chart_type=2'),
        expect.any(Object)
      );
      expect(result).toEqual(chartData);
    });
  });

  describe('results endpoints', () => {
    it('should get subsession results', async () => {
      const results = { subsession_id: 12345, results: [] };
      mockResponse.json.mockResolvedValue(results);

      const result = await sdk.getResults({ subsession_id: 12345 });

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining(ApiEndpoints.RESULTS_GET),
        expect.any(Object)
      );
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('subsession_id=12345'),
        expect.any(Object)
      );
      expect(result).toEqual(results);
    });

    it('should get event log', async () => {
      const eventLog = { events: [] };
      mockResponse.json.mockResolvedValue(eventLog);

      const result = await sdk.getResultsEventLog({
        subsession_id: 12345,
        simsession_number: 0,
      });

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining(ApiEndpoints.RESULTS_EVENT_LOG),
        expect.any(Object)
      );
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('subsession_id=12345'),
        expect.any(Object)
      );
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('simsession_number=0'),
        expect.any(Object)
      );
      expect(result).toEqual(eventLog);
    });

    it('should search hosted results', async () => {
      const searchResults = { results: [] };
      mockResponse.json.mockResolvedValue(searchResults);

      const result = await sdk.getResultsSearchHosted({
        start_range_begin: '2023-01-01T00:00:00Z',
        cust_id: 12345,
        category_ids: [1, 2],
      });

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining(ApiEndpoints.RESULTS_SEARCH_HOSTED),
        expect.any(Object)
      );
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('start_range_begin=2023-01-01T00%3A00%3A00Z'),
        expect.any(Object)
      );
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('cust_id=12345'),
        expect.any(Object)
      );
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('category_ids=1%2C2'),
        expect.any(Object)
      );
      expect(result).toEqual(searchResults);
    });
  });

  describe('season endpoints', () => {
    it('should get season list', async () => {
      const seasons = [{ season_id: 1, season_name: 'Test Season' }];
      mockResponse.json.mockResolvedValue(seasons);

      const result = await sdk.getSeasonList({
        season_year: 2023,
        season_quarter: 1,
      });

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining(ApiEndpoints.SEASON_LIST),
        expect.any(Object)
      );
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('season_year=2023'),
        expect.any(Object)
      );
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('season_quarter=1'),
        expect.any(Object)
      );
      expect(result).toEqual(seasons);
    });

    it('should get season race guide', async () => {
      const raceGuide = { sessions: [] };
      mockResponse.json.mockResolvedValue(raceGuide);

      const result = await sdk.getSeasonRaceGuide({
        from: '2023-01-01T00:00:00Z',
        include_end_after_from: true,
      });

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining(ApiEndpoints.SEASON_RACE_GUIDE),
        expect.any(Object)
      );
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('from=2023-01-01T00%3A00%3A00Z'),
        expect.any(Object)
      );
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('include_end_after_from=true'),
        expect.any(Object)
      );
      expect(result).toEqual(raceGuide);
    });
  });

  describe('stats endpoints', () => {
    it('should get member best times', async () => {
      const bestTimes = { best_times: [] };
      mockResponse.json.mockResolvedValue(bestTimes);

      const result = await sdk.getStatsMemberBests({
        cust_id: 12345,
        car_id: 1,
      });

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining(ApiEndpoints.STATS_MEMBER_BESTS),
        expect.any(Object)
      );
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('cust_id=12345'),
        expect.any(Object)
      );
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('car_id=1'),
        expect.any(Object)
      );
      expect(result).toEqual(bestTimes);
    });

    it('should get season driver standings', async () => {
      const standings = { standings: [] };
      mockResponse.json.mockResolvedValue(standings);

      const result = await sdk.getStatsSeasonDriverStandings({
        season_id: 1,
        car_class_id: 1,
        division: 0,
      });

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining(ApiEndpoints.STATS_SEASON_DRIVER_STANDINGS),
        expect.any(Object)
      );
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('season_id=1'),
        expect.any(Object)
      );
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('car_class_id=1'),
        expect.any(Object)
      );
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('division=0'),
        expect.any(Object)
      );
      expect(result).toEqual(standings);
    });

    it('should get world records', async () => {
      const worldRecords = { records: [] };
      mockResponse.json.mockResolvedValue(worldRecords);

      const result = await sdk.getStatsWorldRecords({
        car_id: 1,
        track_id: 1,
        season_year: 2023,
      });

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining(ApiEndpoints.STATS_WORLD_RECORDS),
        expect.any(Object)
      );
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('car_id=1'),
        expect.any(Object)
      );
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('track_id=1'),
        expect.any(Object)
      );
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('season_year=2023'),
        expect.any(Object)
      );
      expect(result).toEqual(worldRecords);
    });
  });

  describe('rate limiting', () => {
    it('should handle rate limiting headers', async () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
      
      mockResponse.headers.get.mockImplementation((header: string) => {
        if (header === 'x-ratelimit-limit') return '100';
        if (header === 'x-ratelimit-remaining') return '5';
        if (header === 'x-ratelimit-reset') return String(Math.floor(Date.now() / 1000) + 60);
        return null;
      });

      // Mock response for getCars method
      mockResponse.json.mockResolvedValue([{ car_id: 1, car_name: 'Test Car' }]);

      await sdk.getCars();

      expect(consoleSpy).toHaveBeenCalledWith('[iRacing Rate Limit]', expect.any(Object));
      
      consoleSpy.mockRestore();
    });

    it('should wait when rate limit is reached', async () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      const setTimeoutSpy = vi.spyOn(global, 'setTimeout').mockImplementation((fn: Function) => {
        fn();
        return 1 as any;
      });

      mockResponse.headers.get.mockImplementation((header: string) => {
        if (header === 'x-ratelimit-remaining') return '0';
        if (header === 'x-ratelimit-reset') return String(Math.floor(Date.now() / 1000) + 1);
        return null;
      });

      // Mock response for getCars method
      mockResponse.json.mockResolvedValue([{ car_id: 1, car_name: 'Test Car' }]);

      await sdk.getCars();

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('[iRacingSDK] Rate limit reached')
      );
      
      consoleSpy.mockRestore();
      setTimeoutSpy.mockRestore();
    });
  });

  describe('chunked response handling', () => {
    it('should handle chunked responses automatically', async () => {
      // Mock the initial API response with chunk_info
      const apiResponse = {
        success: true,
        data: [],
        chunk_info: {
          base_download_url: 'https://example.com/',
          chunk_file_name: 'chunk_0.json',
          total_chunks: 1,
          chunk_size: 1000,
          rows: 500
        }
      };
      
      // Mock the chunk data response
      const chunkData = [
        { subsession_id: 1, series_name: 'Test Series 1' },
        { subsession_id: 2, series_name: 'Test Series 2' }
      ];
      
      mockResponse.json.mockResolvedValueOnce(apiResponse);
      
      // Mock the fetch for the chunk
      const chunkResponse = {
        ok: true,
        json: vi.fn().mockResolvedValue(chunkData)
      };
      
      mockFetch
        .mockResolvedValueOnce(mockResponse) // Initial API call
        .mockResolvedValueOnce(chunkResponse); // Chunk call
      
      const result = await sdk.getResultsSearchSeries({
        season_year: 2024,
        season_quarter: 1
      });
      
      expect(mockFetch).toHaveBeenCalledTimes(2);
      expect(mockFetch).toHaveBeenCalledWith('https://example.com/chunk_0.json');
      expect(result.data).toEqual(chunkData);
      expect(result.chunk_info).toBeDefined();
    });

    it('should handle non-chunked responses normally', async () => {
      const normalResponse = {
        success: true,
        data: [{ subsession_id: 1, series_name: 'Test Series' }]
      };
      
      mockResponse.json.mockResolvedValue(normalResponse);
      
      const result = await sdk.getResultsSearchSeries({
        season_year: 2024,
        season_quarter: 1
      });
      
      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(result).toEqual(normalResponse);
    });

    it('should respect autoHandleChunkedResponses configuration', async () => {
      // Create SDK with chunking disabled
      const sdkNoChunking = new iRacingSDK({ 
        autoHandleChunkedResponses: false,
        fetchImpl: mockFetch as any
      });
      
      const apiResponse = {
        success: true,
        data: [],
        chunk_info: {
          base_download_url: 'https://example.com/',
          chunk_file_name: 'chunk_0.json',
          total_chunks: 1,
          chunk_size: 1000,
          rows: 500
        }
      };
      
      mockResponse.json.mockResolvedValue(apiResponse);
      
      const result = await sdkNoChunking.getResultsSearchSeries({
        season_year: 2024,
        season_quarter: 1
      });
      
      // Should only make one call (no chunk fetching)
      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(result.data).toEqual([]); // Original empty data
      expect(result.chunk_info).toBeDefined();
    });
  });

  describe('error handling', () => {
    it('should throw error for HTTP failures', async () => {
      mockResponse.ok = false;
      mockResponse.status = 500;

      await expect(sdk.getCars()).rejects.toThrow('HTTP error! status: 500');
    });

    it('should throw error for network failures', async () => {
      mockFetch.mockRejectedValue(new Error('Network error'));

      await expect(sdk.getCars()).rejects.toThrow('Network error');
    });
  });

  describe('backward compatibility', () => {
    it('should support deprecated getAllCars method', async () => {
      const cars = [{ car_id: 1, car_name: 'Test Car' }];
      mockResponse.json.mockResolvedValue(cars);

      const result = await sdk.getAllCars();

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining(ApiEndpoints.CAR_GET),
        expect.any(Object)
      );
      expect(result).toEqual(cars);
    });

    it('should support deprecated getAllCarClasses method', async () => {
      const carClasses = [{ car_class_id: 1, name: 'Test Class' }];
      mockResponse.json.mockResolvedValue(carClasses);

      const result = await sdk.getAllCarClasses();

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining(ApiEndpoints.CARCLASS_GET),
        expect.any(Object)
      );
      expect(result).toEqual(carClasses);
    });
  });
});