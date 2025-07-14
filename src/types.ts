import { z } from 'zod';

// === Authentication ===
export const AuthRequestSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});
export type AuthRequest = z.infer<typeof AuthRequestSchema>;

export const AuthResponseSchema = z.object({
  authcode: z.string(),
  ssoCookieValue: z.string(),
  custId: z.number(),
  email: z.string().email(),
});
export type AuthResponse = z.infer<typeof AuthResponseSchema>;

// === Hosted ===
export const HostedCombinedSessionsParamsSchema = z.object({
  package_id: z.number().optional(),
});
export type HostedCombinedSessionsParams = z.infer<typeof HostedCombinedSessionsParamsSchema>;

// === League ===
export const LeagueCustLeagueSessionsParamsSchema = z.object({
  mine: z.boolean().optional(),
  package_id: z.number().optional(),
});
export type LeagueCustLeagueSessionsParams = z.infer<typeof LeagueCustLeagueSessionsParamsSchema>;

export const LeagueDirectoryParamsSchema = z.object({
  search: z.string().optional(),
  tag: z.string().optional(),
  restrict_to_member: z.boolean().optional(),
  restrict_to_recruiting: z.boolean().optional(),
  restrict_to_friends: z.boolean().optional(),
  restrict_to_watched: z.boolean().optional(),
  minimum_roster_count: z.number().optional(),
  maximum_roster_count: z.number().optional(),
  lowerbound: z.number().optional(),
  upperbound: z.number().optional(),
  sort: z.string().optional(),
  order: z.string().optional(),
});
export type LeagueDirectoryParams = z.infer<typeof LeagueDirectoryParamsSchema>;

export const LeagueGetParamsSchema = z.object({
  league_id: z.number(),
  include_licenses: z.boolean().optional(),
});
export type LeagueGetParams = z.infer<typeof LeagueGetParamsSchema>;

export const LeaguePointsSystemsParamsSchema = z.object({
  league_id: z.number(),
  season_id: z.number().optional(),
});
export type LeaguePointsSystemsParams = z.infer<typeof LeaguePointsSystemsParamsSchema>;

export const LeagueMembershipParamsSchema = z.object({
  cust_id: z.number().optional(),
  include_league: z.boolean().optional(),
});
export type LeagueMembershipParams = z.infer<typeof LeagueMembershipParamsSchema>;

export const LeagueRosterParamsSchema = z.object({
  league_id: z.number(),
  include_licenses: z.boolean().optional(),
});
export type LeagueRosterParams = z.infer<typeof LeagueRosterParamsSchema>;

export const LeagueSeasonsParamsSchema = z.object({
  league_id: z.number(),
  retired: z.boolean().optional(),
});
export type LeagueSeasonsParams = z.infer<typeof LeagueSeasonsParamsSchema>;

export const LeagueSeasonStandingsParamsSchema = z.object({
  league_id: z.number(),
  season_id: z.number(),
  car_class_id: z.number().optional(),
  car_id: z.number().optional(),
});
export type LeagueSeasonStandingsParams = z.infer<typeof LeagueSeasonStandingsParamsSchema>;

export const LeagueSeasonSessionsParamsSchema = z.object({
  league_id: z.number(),
  season_id: z.number(),
  results_only: z.boolean().optional(),
});
export type LeagueSeasonSessionsParams = z.infer<typeof LeagueSeasonSessionsParamsSchema>;

// === Lookup ===
export const LookupDriversParamsSchema = z.object({
  search_term: z.string(),
  league_id: z.number().optional(),
});
export type LookupDriversParams = z.infer<typeof LookupDriversParamsSchema>;

// === Member ===
export const MemberGetParamsSchema = z.object({
  cust_ids: z.array(z.number()).transform((arr) => arr.join(',')),
  include_licenses: z.boolean().optional(),
});

// Input type for getMembers method (before transformation)
export interface MemberGetParams {
  cust_ids: number[];
  include_licenses?: boolean;
}

export const MemberAwardsParamsSchema = z.object({
  cust_id: z.number().optional(),
});
export type MemberAwardsParams = z.infer<typeof MemberAwardsParamsSchema>;

export const MemberAwardInstancesParamsSchema = z.object({
  cust_id: z.number().optional(),
  award_id: z.number(),
});
export type MemberAwardInstancesParams = z.infer<typeof MemberAwardInstancesParamsSchema>;

export const MemberChartDataParamsSchema = z.object({
  cust_id: z.number().optional(),
  category_id: z.number(),
  chart_type: z.number(),
});
export type MemberChartDataParams = z.infer<typeof MemberChartDataParamsSchema>;

export const MemberProfileParamsSchema = z.object({
  cust_id: z.number().optional(),
});
export type MemberProfileParams = z.infer<typeof MemberProfileParamsSchema>;

// === Results ===
export const ResultsGetParamsSchema = z.object({
  subsession_id: z.number(),
  include_licenses: z.boolean().optional(),
});
export type ResultsGetParams = z.infer<typeof ResultsGetParamsSchema>;

export const EventLogParamsSchema = z.object({
  subsession_id: z.number(),
  simsession_number: z.number(),
});
export type EventLogParams = z.infer<typeof EventLogParamsSchema>;

export const LapChartDataParamsSchema = z.object({
  subsession_id: z.number(),
  simsession_number: z.number(),
});
export type LapChartDataParams = z.infer<typeof LapChartDataParamsSchema>;

export const LapDataParamsSchema = z.object({
  subsession_id: z.number(),
  simsession_number: z.number(),
  cust_id: z.number().optional(),
  team_id: z.number().optional(),
});
export type LapDataParams = z.infer<typeof LapDataParamsSchema>;

export const ResultsSearchHostedParamsSchema = z.object({
  start_range_begin: z.string().optional(),
  start_range_end: z.string().optional(),
  finish_range_begin: z.string().optional(),
  finish_range_end: z.string().optional(),
  cust_id: z.number().optional(),
  team_id: z.number().optional(),
  host_cust_id: z.number().optional(),
  session_name: z.string().optional(),
  league_id: z.number().optional(),
  league_season_id: z.number().optional(),
  car_id: z.number().optional(),
  track_id: z.number().optional(),
  category_ids: z.array(z.number()).transform((arr) => arr.join(',')).optional(),
});
// Input type for ResultsSearchHosted method (before transformation)
export interface ResultsSearchHostedParams {
  start_range_begin?: string;
  start_range_end?: string;
  finish_range_begin?: string;
  finish_range_end?: string;
  cust_id?: number;
  team_id?: number;
  host_cust_id?: number;
  session_name?: string;
  league_id?: number;
  league_season_id?: number;
  car_id?: number;
  track_id?: number;
  category_ids?: number[];
}

export const ResultsSearchSeriesParamsSchema = z.object({
  season_year: z.number().optional(),
  season_quarter: z.number().optional(),
  start_range_begin: z.string().optional(),
  start_range_end: z.string().optional(),
  finish_range_begin: z.string().optional(),
  finish_range_end: z.string().optional(),
  cust_id: z.number().optional(),
  team_id: z.number().optional(),
  series_id: z.number().optional(),
  race_week_num: z.number().optional(),
  official_only: z.boolean().optional(),
  event_types: z.array(z.number()).transform((arr) => arr.join(',')).optional(),
  category_ids: z.array(z.number()).transform((arr) => arr.join(',')).optional(),
});
// Input type for ResultsSearchSeries method (before transformation)
export interface ResultsSearchSeriesParams {
  season_year?: number;
  season_quarter?: number;
  start_range_begin?: string;
  start_range_end?: string;
  finish_range_begin?: string;
  finish_range_end?: string;
  cust_id?: number;
  team_id?: number;
  series_id?: number;
  race_week_num?: number;
  official_only?: boolean;
  event_types?: number[];
  category_ids?: number[];
}

export const SeasonResultsParamsSchema = z.object({
  season_id: z.number(),
  event_type: z.number().optional(),
  race_week_num: z.number().optional(),
});
export type SeasonResultsParams = z.infer<typeof SeasonResultsParamsSchema>;

// === Season ===
export const SeasonListParamsSchema = z.object({
  season_year: z.number(),
  season_quarter: z.number(),
});
export type SeasonListParams = z.infer<typeof SeasonListParamsSchema>;

export const SeasonRaceGuideParamsSchema = z.object({
  from: z.string().optional(),
  include_end_after_from: z.boolean().optional(),
});
export type SeasonRaceGuideParams = z.infer<typeof SeasonRaceGuideParamsSchema>;

export const SeasonSpectatorSubsessionIdsParamsSchema = z.object({
  event_types: z.array(z.number()).transform((arr) => arr.join(',')).optional(),
});
// Input type for SeasonSpectatorSubsessionIds method (before transformation)
export interface SeasonSpectatorSubsessionIdsParams {
  event_types?: number[];
}

export const SeasonSpectatorSubsessionIdsDetailParamsSchema = z.object({
  event_types: z.array(z.number()).transform((arr) => arr.join(',')).optional(),
  season_ids: z.array(z.number()).transform((arr) => arr.join(',')).optional(),
});
// Input type for SeasonSpectatorSubsessionIdsDetail method (before transformation)
export interface SeasonSpectatorSubsessionIdsDetailParams {
  event_types?: number[];
  season_ids?: number[];
}

// === Series ===
export const SeriesPastSeasonsParamsSchema = z.object({
  series_id: z.number(),
});
export type SeriesPastSeasonsParams = z.infer<typeof SeriesPastSeasonsParamsSchema>;

export const SeriesSeasonsParamsSchema = z.object({
  include_series: z.boolean().optional(),
  season_year: z.number().optional(),
  season_quarter: z.number().optional(),
});
export type SeriesSeasonsParams = z.infer<typeof SeriesSeasonsParamsSchema>;

export const SeriesSeasonListParamsSchema = z.object({
  include_series: z.boolean().optional(),
  season_year: z.number().optional(),
  season_quarter: z.number().optional(),
});
export type SeriesSeasonListParams = z.infer<typeof SeriesSeasonListParamsSchema>;

export const SeriesSeasonScheduleParamsSchema = z.object({
  season_id: z.number(),
});
export type SeriesSeasonScheduleParams = z.infer<typeof SeriesSeasonScheduleParamsSchema>;

// === Stats ===
export const StatsMemberBestsParamsSchema = z.object({
  cust_id: z.number().optional(),
  car_id: z.number().optional(),
});
export type StatsMemberBestsParams = z.infer<typeof StatsMemberBestsParamsSchema>;

export const StatsMemberCareerParamsSchema = z.object({
  cust_id: z.number().optional(),
});
export type StatsMemberCareerParams = z.infer<typeof StatsMemberCareerParamsSchema>;

export const StatsMemberDivisionParamsSchema = z.object({
  season_id: z.number(),
  event_type: z.number(),
});
export type StatsMemberDivisionParams = z.infer<typeof StatsMemberDivisionParamsSchema>;

export const StatsMemberRecapParamsSchema = z.object({
  cust_id: z.number().optional(),
  year: z.number().optional(),
  season: z.number().optional(),
});
export type StatsMemberRecapParams = z.infer<typeof StatsMemberRecapParamsSchema>;

export const StatsMemberRecentRacesParamsSchema = z.object({
  cust_id: z.number().optional(),
});
export type StatsMemberRecentRacesParams = z.infer<typeof StatsMemberRecentRacesParamsSchema>;

export const StatsMemberSummaryParamsSchema = z.object({
  cust_id: z.number().optional(),
});
export type StatsMemberSummaryParams = z.infer<typeof StatsMemberSummaryParamsSchema>;

export const StatsMemberYearlyParamsSchema = z.object({
  cust_id: z.number().optional(),
});
export type StatsMemberYearlyParams = z.infer<typeof StatsMemberYearlyParamsSchema>;

export const StatsSeasonDriverStandingsParamsSchema = z.object({
  season_id: z.number(),
  car_class_id: z.number(),
  division: z.number().optional(),
  race_week_num: z.number().optional(),
});
export type StatsSeasonDriverStandingsParams = z.infer<typeof StatsSeasonDriverStandingsParamsSchema>;

export const StatsSeasonSupersessionStandingsParamsSchema = z.object({
  season_id: z.number(),
  car_class_id: z.number(),
  division: z.number().optional(),
  race_week_num: z.number().optional(),
});
export type StatsSeasonSupersessionStandingsParams = z.infer<typeof StatsSeasonSupersessionStandingsParamsSchema>;

export const StatsSeasonTeamStandingsParamsSchema = z.object({
  season_id: z.number(),
  car_class_id: z.number(),
  race_week_num: z.number().optional(),
});
export type StatsSeasonTeamStandingsParams = z.infer<typeof StatsSeasonTeamStandingsParamsSchema>;

export const StatsSeasonTTStandingsParamsSchema = z.object({
  season_id: z.number(),
  car_class_id: z.number(),
  division: z.number().optional(),
  race_week_num: z.number().optional(),
});
export type StatsSeasonTTStandingsParams = z.infer<typeof StatsSeasonTTStandingsParamsSchema>;

export const StatsSeasonTTResultsParamsSchema = z.object({
  season_id: z.number(),
  car_class_id: z.number(),
  race_week_num: z.number(),
  division: z.number().optional(),
});
export type StatsSeasonTTResultsParams = z.infer<typeof StatsSeasonTTResultsParamsSchema>;

export const StatsSeasonQualifyResultsParamsSchema = z.object({
  season_id: z.number(),
  car_class_id: z.number(),
  race_week_num: z.number(),
  division: z.number().optional(),
});
export type StatsSeasonQualifyResultsParams = z.infer<typeof StatsSeasonQualifyResultsParamsSchema>;

export const StatsWorldRecordsParamsSchema = z.object({
  car_id: z.number(),
  track_id: z.number(),
  season_year: z.number().optional(),
  season_quarter: z.number().optional(),
});
export type StatsWorldRecordsParams = z.infer<typeof StatsWorldRecordsParamsSchema>;

// === Team ===
export const TeamGetParamsSchema = z.object({
  team_id: z.number(),
  include_licenses: z.boolean().optional(),
});
export type TeamGetParams = z.infer<typeof TeamGetParamsSchema>;

// === Time Attack ===
export const TimeAttackMemberSeasonResultsParamsSchema = z.object({
  ta_comp_season_id: z.number(),
});
export type TimeAttackMemberSeasonResultsParams = z.infer<typeof TimeAttackMemberSeasonResultsParamsSchema>;

// === RESPONSE TYPES ===

// === Base Types ===

/**
 * License information structure used across multiple endpoints
 */
export interface License {
  category_id: number;
  category: string;
  license_level: number;
  safety_rating: number;
  cpi: number;
  irating: number;
  tt_rating: number;
  mpr_num_races: number;
}

/**
 * Track configuration information
 */
export interface TrackConfig {
  track_id: number;
  config_name: string;
  track_name: string;
  category_id: number;
  category: string;
  config_length_km: number;
  pkg_id: number;
  recently_added: boolean;
}

/**
 * Car information structure
 */
export interface Car {
  car_id: number;
  car_name: string;
  car_name_abbreviated: string;
  car_dirpath: string;
  car_rules_category: string;
  car_weight: number;
  car_power: number;
  car_max_fuel_pct: number;
  car_types: CarType[];
  pkg_id: number;
  sku: number;
  recently_added: boolean;
  car_make: string;
  car_model: string;
  hp: number;
  price: number;
  price_display: string;
  free_with_subscription: boolean;
}

export interface CarType {
  car_type: string;
}

/**
 * Standard pagination response wrapper
 */
export interface PaginatedResponse<T> {
  data: T;
  success: boolean;
  chunk_info?: ChunkInfo;
  rate_limit_remaining?: number;
  rate_limit_reset?: number;
}

export interface ChunkInfo {
  chunk_size: number;
  total_chunks: number;
  chunk_file_name: string;
  rows: number;
  base_download_url: string;
  chunk_file_names?: string[];
}

// === Car Data Response Types ===

/**
 * Response containing car asset information including images and logos
 * Image paths are relative to https://images-static.iracing.com/
 */
export interface CarAssetsResponse {
  /** Car asset rules organized by category */
  car_rules: CarRule[];
  /** Whether the request was successful */
  success: boolean;
}

/**
 * Car asset rule containing cars grouped by category
 */
export interface CarRule {
  /** Category identifier */
  category_id: number;
  /** Category name */
  category: string;
  /** Array of car assets in this category */
  cars: CarAsset[];
}

/**
 * Car asset containing image and logo information
 */
export interface CarAsset {
  /** Unique car identifier */
  car_id: number;
  /** Full car name */
  car_name: string;
  /** Abbreviated car name */
  car_name_abbreviated: string;
  /** Path to car logo image */
  logo: string;
  /** Path to small car image */
  small_image: string;
  /** Path to large car image */
  large_image: string;
  /** Car directory path */
  car_dirpath: string;
}

/**
 * Response containing all available cars
 */
export interface CarsResponse {
  /** Array of all cars */
  cars: Car[];
  /** Whether the request was successful */
  success: boolean;
}

/**
 * Response containing all car classes
 */
export interface CarClassesResponse {
  /** Array of car classes */
  carclass: CarClass[];
  /** Whether the request was successful */
  success: boolean;
}

/**
 * Car class containing multiple cars with similar performance
 */
export interface CarClass {
  /** Unique car class identifier */
  car_class_id: number;
  /** Array of cars in this class */
  cars_in_class: CarInClass[];
  /** Full car class name */
  name: string;
  /** Relative speed compared to other classes */
  relative_speed: number;
  /** Short car class name */
  short_name: string;
}

/**
 * Car reference within a car class
 */
export interface CarInClass {
  /** Car directory path */
  car_dirpath: string;
  /** Unique car identifier */
  car_id: number;
}

// === Constants Response Types ===

/**
 * Response containing track categories (constant data)
 */
export interface CategoriesResponse {
  /** Array of track categories */
  categories: Category[];
  /** Whether the request was successful */
  success: boolean;
}

/**
 * Track category definition
 */
export interface Category {
  /** Unique category identifier */
  category_id: number;
  /** Category name */
  category: string;
}

/**
 * Response containing license divisions (constant data)
 */
export interface DivisionsResponse {
  /** Array of license divisions */
  divisions: Division[];
  /** Whether the request was successful */
  success: boolean;
}

/**
 * License division definition
 */
export interface Division {
  /** Division number */
  division: number;
  /** Division name */
  division_name: string;
}

/**
 * Response containing event types (constant data)
 */
export interface EventTypesResponse {
  /** Array of event types */
  event_types: EventType[];
  /** Whether the request was successful */
  success: boolean;
}

/**
 * Event type definition
 */
export interface EventType {
  /** Event type identifier */
  event_type: number;
  /** Event type name */
  event_type_name: string;
}

// === Driver Stats Response Types ===

/**
 * Response containing driver statistics by category
 */
export interface DriverStatsResponse {
  /** Array of driver statistics */
  stats: DriverStats[];
  /** Whether the request was successful */
  success: boolean;
}

/**
 * Driver statistics for a specific category
 */
export interface DriverStats {
  /** Customer ID */
  cust_id: number;
  /** Driver display name */
  display_name: string;
  /** Driver helmet configuration */
  helmet: Helmet;
  /** Last login timestamp */
  last_login: string;
  /** Member since timestamp */
  member_since: string;
  /** Club ID */
  club_id: number;
  /** Club name */
  club_name: string;
  /** Country code */
  country_code: string;
  /** Country name */
  country: string;
  /** Array of licenses */
  licenses: License[];
}

/**
 * Driver helmet configuration
 */
export interface Helmet {
  /** Helmet pattern ID */
  pattern: number;
  /** Primary color */
  color1: string;
  /** Secondary color */
  color2: string;
  /** Tertiary color */
  color3: string;
  /** Face type ID */
  face_type: number;
  /** Helmet type ID */
  helmet_type: number;
}

// === Hosted Sessions Response Types ===

/**
 * Response containing hosted sessions that can be joined
 */
export interface HostedSessionsResponse {
  /** Array of hosted sessions */
  sessions: HostedSession[];
  /** Whether the request was successful */
  success: boolean;
}

/**
 * Hosted session information
 */
export interface HostedSession {
  /** Subsession ID */
  subsession_id: number;
  /** Session ID */
  session_id: number;
  /** Session name */
  session_name: string;
  /** Host customer ID */
  host_id: number;
  /** Host display name */
  host_name: string;
  /** Session creation timestamp */
  created_time: string;
  /** Session start time */
  start_time: string;
  /** Session end time */
  end_time: string;
  /** Launch timestamp */
  launch_at: string;
  /** Registration opens timestamp */
  registration_opens: string;
  /** Registration closes timestamp */
  registration_closes: string;
  /** Session status */
  status: number;
  /** Current number of drivers */
  num_drivers: number;
  /** Maximum number of drivers */
  max_drivers: number;
  /** Whether telemetry recording is enabled */
  telemetry_recording_enabled: boolean;
  /** Telemetry force to disk setting */
  telemetry_force_to_disk: number;
  /** Order ID */
  order_id: number;
  /** Session price */
  price: number;
  /** Whether to skip car painting */
  do_not_paint_cars: boolean;
  /** Whether session is private */
  private_session: boolean;
  /** Season ID */
  season_id: number;
  /** Series ID */
  series_id: number;
  /** Array of car class IDs */
  car_class_ids: number[];
  /** Array of car types */
  car_types: CarType[];
  /** Track configuration */
  track: TrackConfig;
  /** Weather settings */
  weather: Weather;
  /** Track state */
  track_state: TrackState;
  /** League ID (optional) */
  league_id?: number;
  /** League name (optional) */
  league_name?: string;
  /** League season ID (optional) */
  league_season_id?: number;
  /** Entry count */
  entry_count: number;
  /** Whether user can spot */
  can_spot: boolean;
  /** Whether user can watch */
  can_watch: boolean;
  /** Whether user can drive */
  can_drive: boolean;
  /** Team entry count */
  team_entry_count: number;
}

export interface Weather {
  type: number;
  temp_units: number;
  temp_value: number;
  rel_humidity: number;
  fog: number;
  wind_dir: number;
  wind_units: number;
  wind_value: number;
  skies: number;
  weather_var_initial: number;
  weather_var_ongoing: number;
  time_of_day: number;
  simulated_start_time: string;
  simulated_time_multiplier: number;
  simulated_time_offsets: number[];
}

export interface TrackState {
  leave_marbles: boolean;
  practice_rubber: number;
  qualify_rubber: number;
  warmup_rubber: number;
  race_rubber: number;
  practice_grip_compound: number;
  qualify_grip_compound: number;
  warmup_grip_compound: number;
  race_grip_compound: number;
}

// === League Response Types ===

/**
 * Response containing league information
 */
export interface LeagueResponse {
  /** League data */
  league: League;
  /** Whether the request was successful */
  success: boolean;
}

export interface League {
  league_id: number;
  league_name: string;
  owner_id: number;
  owner_display_name: string;
  created: string;
  url: string;
  club_id: number;
  club_name: string;
  about: string;
  logo: string;
  description: string;
  max_drivers: number;
  min_drivers: number;
  laps_for_solo_race: number;
  laps_for_team_race: number;
  max_team_drivers: number;
  min_team_drivers: number;
  max_weekly_race_entries: number;
  min_weekly_race_entries: number;
  fixed_setup: boolean;
  enable_passworded_sessions: boolean;
  private_wall_postings: boolean;
  private_roster: boolean;
  league_rules: string;
  roster_count: number;
  applicant_count: number;
  recruiting: boolean;
  is_admin: boolean;
  is_member: boolean;
  pending_application: boolean;
  pending_invitation: boolean;
  cancelled_application: boolean;
  rejected_application: boolean;
  seasons?: LeagueSeason[];
  roster?: LeagueMember[];
}

export interface LeagueSeason {
  season_id: number;
  season_name: string;
  active: boolean;
  car_class_ids: number[];
  car_restrictions: CarRestriction[];
  complete: boolean;
  driver_changes: boolean;
  driver_change_rule: number;
  drops: number;
  green_flag_finish_rule: boolean;
  ignore_license_for_practice: boolean;
  invisible_reserved_setup: boolean;
  max_ai_drivers: number;
  max_team_drivers: number;
  min_team_drivers: number;
  multiclass: boolean;
  must_use_diff_tire_types_in_race: boolean;
  next_race_session: string;
  num_opt_laps: number;
  op_duration: number;
  open_practice: boolean;
  points_system_id: number;
  points_system_name: string;
  practice_length: number;
  private_qualifying: boolean;
  private_scoring: boolean;
  qualify_laps: number;
  race_laps: number;
  race_length: number;
  reg_user_count: number;
  restrict_results: boolean;
  restrict_viewing: boolean;
  schedule_description: string;
  send_to_open_practice: boolean;
  short_parade_lap: boolean;
  start_date: string;
  telemetry_force_to_disk: number;
  telemetry_recording_enabled: boolean;
  unsport_conduct_rule_mode: number;
  fixed_setup: boolean;
  hardcore_level: number;
  lucky_dog: boolean;
  max_weeks: number;
  season_quarter: number;
  season_year: number;
  series_id: number;
  track_types: TrackType[];
}

export interface CarRestriction {
  car_id: number;
}

export interface TrackType {
  track_type: string;
}

export interface LeagueMember {
  cust_id: number;
  display_name: string;
  helmet: Helmet;
  league_member_type: number;
  league_admin: boolean;
  league_owner: boolean;
  can_spot: boolean;
  can_chat: boolean;
  can_coach: boolean;
  owner: boolean;
  admin: boolean;
  licenses?: License[];
}

export interface LeagueDirectoryResponse {
  leagues: LeagueDirectoryEntry[];
  success: boolean;
}

export interface LeagueDirectoryEntry {
  league_id: number;
  league_name: string;
  owner_id: number;
  owner_display_name: string;
  created: string;
  url: string;
  club_id: number;
  club_name: string;
  description: string;
  max_drivers: number;
  min_drivers: number;
  private_roster: boolean;
  roster_count: number;
  recruiting: boolean;
  tags: string[];
}

export interface LeaguePointsSystemsResponse {
  points_systems: PointsSystem[];
  success: boolean;
}

export interface PointsSystem {
  points_system_id: number;
  points_system_name: string;
  formula: string;
  method: number;
  rounding: number;
}

export interface LeagueMembershipResponse {
  memberships: LeagueMembership[];
  success: boolean;
}

export interface LeagueMembership {
  league_id: number;
  league_name: string;
  owner_id: number;
  owner_display_name: string;
  roster_count: number;
  recruiting: boolean;
  league?: League;
}

export interface LeagueRosterResponse {
  roster: LeagueMember[];
  success: boolean;
}

export interface LeagueSeasonsResponse {
  seasons: LeagueSeason[];
  success: boolean;
}

export interface LeagueSeasonStandingsResponse {
  standings: LeagueStanding[];
  success: boolean;
  chunk_info?: ChunkInfo;
}

export interface LeagueStanding {
  cust_id: number;
  display_name: string;
  division: number;
  position: number;
  points: number;
  wins: number;
  week_dropped: boolean;
  starts: number;
  helmet: Helmet;
  car_class_id: number;
  club_id: number;
  club_name: string;
  club_shortname: string;
  country_code: string;
  country: string;
  license: License;
}

export interface LeagueSeasonSessionsResponse {
  sessions: LeagueSeasonSession[];
  success: boolean;
}

export interface LeagueSeasonSession {
  subsession_id: number;
  session_id: number;
  session_name: string;
  created_time: string;
  start_time: string;
  end_time: string;
  num_drivers: number;
  series_name: string;
  session_results: SessionResult[];
}

export interface SessionResult {
  cust_id: number;
  display_name: string;
  finish_position: number;
  laps_complete: number;
  laps_lead: number;
  points: number;
  starting_position: number;
  car_class_id: number;
  car_class_name: string;
  division: number;
}

// === Lookup Response Types ===

export interface LookupCountriesResponse {
  countries: Country[];
  success: boolean;
}

export interface Country {
  country_code: string;
  country_name: string;
}

export interface LookupDriversResponse {
  drivers: LookupDriver[];
  success: boolean;
}

export interface LookupDriver {
  cust_id: number;
  display_name: string;
  helmet: Helmet;
  club_id: number;
  club_name: string;
  country_code: string;
  country: string;
  licenses: License[];
}

export interface LookupFlairsResponse {
  flairs: Flair[];
  success: boolean;
}

export interface Flair {
  flair_id: number;
  flair_name: string;
  image: string;
}

export interface LookupGetResponse {
  lookup_groups: LookupGroup[];
  success: boolean;
}

export interface LookupGroup {
  group_name: string;
  lookup_values: LookupValue[];
}

export interface LookupValue {
  lookup_value: any;
  lookup_display: string;
}

export interface LookupLicensesResponse {
  licenses: LicenseLevel[];
  success: boolean;
}

export interface LicenseLevel {
  license_id: number;
  license_name: string;
  license_color: string;
  license_short_name: string;
  min_sr: number;
  min_races: number;
  participated_in_race: boolean;
  group: number;
}

// === Member Response Types ===

/**
 * Response containing authenticated member information
 */
export interface MemberInfoResponse {
  cust_id: number;
  email: string;
  display_name: string;
  first_name: string;
  last_name: string;
  on_car_name: string;
  member_since: string;
  last_login: string;
  read_comp_rules: string;
  read_pp: string;
  read_tos: string;
  helmet: Helmet;
  club_id: number;
  club_name: string;
  country_code: string;
  country: string;
  ai_usage: boolean;
  max_ai_roster_count: number;
  flags: number;
  twenty_four_hours: boolean;
  account_credits: number;
  success: boolean;
}

/**
 * Response containing member information by customer IDs
 */
export interface MembersResponse {
  /** Array of member data */
  members: Member[];
  /** Whether the request was successful */
  success: boolean;
}

export interface Member {
  cust_id: number;
  display_name: string;
  helmet: Helmet;
  last_login: string;
  member_since: string;
  club_id: number;
  club_name: string;
  country_code: string;
  country: string;
  licenses?: License[];
}

/**
 * Response containing member awards
 */
export interface MemberAwardsResponse {
  /** Array of awards */
  awards: Award[];
  /** Whether the request was successful */
  success: boolean;
}

export interface Award {
  award_id: number;
  award_name: string;
  award_desc: string;
  award_image: string;
  times_earned: number;
}

export interface MemberAwardInstancesResponse {
  award_instances: AwardInstance[];
  success: boolean;
}

export interface AwardInstance {
  award_id: number;
  award_name: string;
  award_desc: string;
  award_image: string;
  earned_date: string;
  context: string;
}

export interface MemberChartDataResponse {
  category_id: number;
  chart_type: number;
  success: boolean;
  data: ChartDataPoint[];
}

export interface ChartDataPoint {
  when: string;
  value: number;
}

export interface MemberProfileResponse {
  cust_id: number;
  member_info: ProfileMemberInfo;
  member_stats_by_category: ProfileMemberStats[];
  recent_awards: ProfileAward[];
  favorite_car_class: string;
  favorite_track: string;
  success: boolean;
}

export interface ProfileMemberInfo {
  cust_id: number;
  display_name: string;
  helmet: Helmet;
  last_login: string;
  member_since: string;
  club_id: number;
  club_name: string;
  country_code: string;
  country: string;
  occupation: string;
  about: string;
  interests: string;
  connection_type: number;
  download_server: number;
  ai_usage: boolean;
  drivable_car_count: number;
  owned_car_count: number;
  flags: number;
  annual_auto_renew: boolean;
  auto_renew_date: string;
  credits: number;
}

export interface ProfileMemberStats {
  category: string;
  category_id: number;
  starts: number;
  wins: number;
  top5: number;
  poles: number;
  avg_start_position: number;
  avg_finish_position: number;
  laps: number;
  laps_led: number;
  total_club_points: number;
  year_club_points: number;
  career_wins: number;
  career_poles: number;
  career_starts: number;
  career_laps: number;
  career_laps_led: number;
}

export interface ProfileAward {
  award_id: number;
  award_name: string;
  award_desc: string;
  award_image: string;
  earned_date: string;
  context: string;
}

export interface MemberParticipationCreditsResponse {
  participation_credits: ParticipationCredit[];
  success: boolean;
}

export interface ParticipationCredit {
  season_id: number;
  series_name: string;
  credits: number;
  credits_remaining: number;
}

// === Results Response Types ===

export interface ResultsResponse {
  session_info: SessionInfo;
  session_results: SessionResult[];
  success: boolean;
}

export interface SessionInfo {
  subsession_id: number;
  session_id: number;
  series_id: number;
  series_name: string;
  series_short_name: string;
  session_name: string;
  race_week_num: number;
  event_type: number;
  event_type_name: string;
  driver_changes: boolean;
  green_flag_finish_rule: boolean;
  private_session: boolean;
  start_date: string;
  end_date: string;
  num_drivers: number;
  num_cautions: number;
  num_caution_laps: number;
  num_lead_changes: number;
  time_of_day: number;
  damage_model: number;
  can_protest: boolean;
  cooldown_minutes: number;
  limit_minutes: number;
  track: TrackConfig;
  weather: Weather;
  track_state: TrackState;
  session_results_count: number;
  series_logo: string;
  event_strength_of_field: number;
  event_average_lap: number;
  event_laps_complete: number;
  num_opt_laps: number;
  has_opt_path: boolean;
  can_protest_after_end: boolean;
  special_event_type: number;
  special_event_type_text: string;
  season_id: number;
  season_name: string;
  season_short_name: string;
  season_year: number;
  season_quarter: number;
  license_category_id: number;
  license_category: string;
  car_class_ids: number[];
}

export interface EventLogResponse {
  chunk_info: ChunkInfo;
  success: boolean;
}

export interface LapChartDataResponse {
  chunk_info: ChunkInfo;
  success: boolean;
}

export interface LapDataResponse {
  chunk_info: ChunkInfo;
  success: boolean;
}

export interface ResultsSearchResponse {
  data: SearchResult[];
  success: boolean;
  chunk_info?: ChunkInfo;
}

export interface SearchResult {
  subsession_id: number;
  session_id: number;
  series_id: number;
  series_name: string;
  session_name: string;
  start_time: string;
  end_time: string;
  num_drivers: number;
  track: TrackConfig;
  winner_group_id: number;
  winner_name: string;
  winner_helmet: Helmet;
  event_type: number;
  event_type_name: string;
  license_category: string;
  license_category_id: number;
  race_week_num: number;
  season_id: number;
  season_name: string;
  season_short_name: string;
  season_quarter: number;
  season_year: number;
  event_strength_of_field: number;
  event_average_lap: number;
  event_laps_complete: number;
  caution_type: number;
  corners_per_lap: number;
  damage_model: number;
  driver_change_rule: number;
  driver_changes: boolean;
  lucky_dog: boolean;
  max_weeks: number;
  num_cautions: number;
  num_caution_laps: number;
  num_lead_changes: number;
  official_session: boolean;
  points_type: string;
  private_session: boolean;
  qual_attached: boolean;
  race_summary: RaceSummary;
  results_restricted: boolean;
  special_event_type_text: string;
  special_event_type: number;
  time_of_day: number;
  weather: Weather;
}

export interface RaceSummary {
  subsession_id: number;
  average_lap: number;
  laps_complete: number;
  num_cautions: number;
  num_caution_laps: number;
  num_lead_changes: number;
  field_strength: number;
  num_drivers: number;
}

// === Season Response Types ===

export interface SeasonListResponse {
  seasons: Season[];
  success: boolean;
}

export interface Season {
  season_id: number;
  season_name: string;
  series_id: number;
  series_name: string;
  official: boolean;
  season_year: number;
  season_quarter: number;
  license_category: string;
  license_category_id: number;
  rookie_season: string;
  driver_changes: boolean;
  min_license_level: number;
  max_license_level: number;
  active: boolean;
  complete: boolean;
  car_class_ids: number[];
  car_types: CarType[];
  schedule: SeasonSchedule[];
  track_types: TrackType[];
}

export interface SeasonSchedule {
  race_week_num: number;
  session_id: number;
  series_id: number;
  season_id: number;
  race_week_name: string;
  track: TrackConfig;
  session_times: string[];
  special_event_type: number;
  start_date: string;
  end_date: string;
  race_lap_limit: number;
  race_time_limit: number;
  time_of_day: number;
  simsession_types: SimSessionType[];
}

export interface SimSessionType {
  simsession_type: number;
  simsession_type_name: string;
}

export interface SeasonRaceGuideResponse {
  races: RaceGuideEntry[];
  success: boolean;
}

export interface RaceGuideEntry {
  series_id: number;
  series_name: string;
  race_week_num: number;
  session_id: number;
  season_id: number;
  license_category: string;
  license_category_id: number;
  start_time: string;
  registration_opens: string;
  registration_closes: string;
  track: TrackConfig;
  weather: Weather;
  track_state: TrackState;
  max_drivers: number;
  reg_count: number;
  entries: RaceGuideEntryDetail[];
}

export interface RaceGuideEntryDetail {
  car_id: number;
  car_name: string;
  reg_count: number;
}

export interface SeasonSpectatorSubsessionIdsResponse {
  subsession_ids: number[];
  success: boolean;
}

export interface SeasonSpectatorSubsessionIdsDetailResponse {
  subsessions: SpectatorSubsession[];
  success: boolean;
}

export interface SpectatorSubsession {
  subsession_id: number;
  session_id: number;
  series_id: number;
  series_name: string;
  season_id: number;
  season_name: string;
  license_category: string;
  license_category_id: number;
  race_week_num: number;
  session_name: string;
  start_time: string;
  track: TrackConfig;
  num_drivers: number;
  event_type: number;
  event_type_name: string;
}

// === Series Response Types ===

export interface SeriesAssetsResponse {
  series_assets: SeriesAsset[];
  success: boolean;
}

export interface SeriesAsset {
  series_id: number;
  series_name: string;
  logo: string;
  small_image: string;
  large_image: string;
}

export interface SeriesResponse {
  series: Series[];
  success: boolean;
}

export interface Series {
  series_id: number;
  series_name: string;
  series_short_name: string;
  publisher: string;
  publisher_id: number;
  category: string;
  category_id: number;
  max_starters: number;
  min_starters: number;
  oval_caution_type: number;
  road_caution_type: number;
  short_parade_lap: number;
  start_on_qual_tire: boolean;
  enable_pitlane_collisions: boolean;
  open_reg_expires: number;
  min_pre_qual_minutes: number;
  cars_left_right: boolean;
  max_ai_drivers: number;
  ignore_license_for_practice: boolean;
  start_zone: boolean;
  enable_driver_swaps: boolean;
  driver_swap_rule: number;
  max_drivers: number;
  pace_car_class_id: number;
  allowed_licenses: License[];
  car_class_ids: number[];
  car_types: CarType[];
  track_types: TrackType[];
}

export interface SeriesPastSeasonsResponse {
  seasons: PastSeason[];
  success: boolean;
}

export interface PastSeason {
  season_id: number;
  season_name: string;
  series_id: number;
  official: boolean;
  season_year: number;
  season_quarter: number;
  license_category: string;
  license_category_id: number;
  rookie_season: string;
  driver_changes: boolean;
  min_license_level: number;
  max_license_level: number;
  active: boolean;
  complete: boolean;
  fixed_setup: boolean;
  car_class_ids: number[];
  car_types: CarType[];
  schedule_name: string;
  series_name: string;
  start_date: string;
  end_date: string;
}

export interface SeriesSeasonsResponse {
  seasons: Season[];
  success: boolean;
}

export interface SeriesSeasonListResponse {
  season_list: SeasonListEntry[];
  success: boolean;
}

export interface SeasonListEntry {
  season_id: number;
  season_name: string;
  series_id: number;
  series_name: string;
  official: boolean;
  season_year: number;
  season_quarter: number;
  license_category: string;
  license_category_id: number;
  active: boolean;
  complete: boolean;
  car_class_ids: number[];
}

export interface SeriesSeasonScheduleResponse {
  season_id: number;
  series_id: number;
  season_name: string;
  series_name: string;
  official: boolean;
  race_weeks: RaceWeek[];
  success: boolean;
}

export interface RaceWeek {
  race_week_num: number;
  session_id: number;
  series_id: number;
  season_id: number;
  race_week_name: string;
  track: TrackConfig;
  layout: string;
  start_date: string;
  end_date: string;
  qual_attached: boolean;
  race_lap_limit: number;
  race_time_limit: number;
  restart_type: number;
  zone_flag: boolean;
  time_of_day: number;
  green_flag_finish_rule: boolean;
  unofficial: boolean;
  heat_info: HeatInfo;
  practice_length: number;
  qualify_length: number;
  warmup_length: number;
  lone_qualify: boolean;
  start_on_qual_tire: boolean;
  car_class_ids: number[];
  car_types: CarType[];
  simsession_types: SimSessionType[];
}

export interface HeatInfo {
  heat_info_id: number;
  heat_info_name: string;
  max_entrants: number;
  race_style: number;
  open_practice: number;
  pre_qual_practice_length_minutes: number;
  pre_qual_num_to_transfer: number;
  qual_style: number;
  qual_length_minutes: number;
  qual_num_to_transfer: number;
  heat_length_minutes: number;
  heat_laps: number;
  heat_max_field_size: number;
  heat_num_position_to_invert: number;
  heat_caution_type: number;
  heat_num_from_each_to_transfer: number;
  heat_scores_champ_points: boolean;
  consolation_num_to_transfer: number;
  consolation_laps: number;
  consolation_length_minutes: number;
  consolation_first_max_field_size: number;
  consolation_first_session_winner_goes_to_rear: boolean;
  consolation_num_position_to_invert: number;
  consolation_scores_champ_points: boolean;
  consolation_run_always: boolean;
  pre_main_practice_length_minutes: number;
  main_length_minutes: number;
  main_laps: number;
  main_max_field_size: number;
  main_num_position_to_invert: number;
  main_caution_type: number;
  heat_session_minutes_estimate: number;
}

export interface SeriesStatsResponse {
  stats: SeriesStats[];
  success: boolean;
}

export interface SeriesStats {
  series_id: number;
  series_name: string;
  series_short_name: string;
  publisher: string;
  publisher_id: number;
  category: string;
  category_id: number;
  max_starters: number;
  min_starters: number;
  official: boolean;
  fixed_setup: boolean;
  rookie_season: string;
  min_license_level: number;
  max_license_level: number;
  allowed_licenses: License[];
  car_class_ids: number[];
  car_types: CarType[];
  seasons: SeriesStatsSeason[];
}

export interface SeriesStatsSeason {
  season_id: number;
  season_name: string;
  series_id: number;
  official: boolean;
  season_year: number;
  season_quarter: number;
  license_category: string;
  license_category_id: number;
  active: boolean;
  complete: boolean;
  car_class_ids: number[];
}

// === Statistics Response Types ===

export interface StatsMemberBestsResponse {
  cust_id: number;
  cars_driven: CarDriven[];
  success: boolean;
}

export interface CarDriven {
  car_id: number;
  car_name: string;
  category: string;
  category_id: number;
  best_qual_time: number;
  best_race_time: number;
  tracks_driven: TrackDriven[];
}

export interface TrackDriven {
  track_id: number;
  track_name: string;
  config_name: string;
  category: string;
  category_id: number;
  best_qual_time: number;
  best_race_time: number;
  best_qual_time_formatted: string;
  best_race_time_formatted: string;
}

export interface StatsMemberCareerResponse {
  stats: MemberCareerStats[];
  success: boolean;
}

export interface MemberCareerStats {
  category: string;
  category_id: number;
  starts: number;
  wins: number;
  top5: number;
  poles: number;
  avg_start_position: number;
  avg_finish_position: number;
  laps: number;
  laps_led: number;
  total_club_points: number;
  year_club_points: number;
}

export interface StatsMemberDivisionResponse {
  division: number;
  event_type: number;
  season_id: number;
  success: boolean;
}

export interface StatsMemberRecapResponse {
  year: number;
  season: number;
  race_weeks: RaceWeekRecap[];
  success: boolean;
}

export interface RaceWeekRecap {
  series_name: string;
  series_id: number;
  season_name: string;
  season_id: number;
  car_class_name: string;
  car_class_id: number;
  race_week_num: number;
  start_date: string;
  end_date: string;
  track: TrackConfig;
  num_entries: number;
  points: number;
  club_points: number;
  max_club_points: number;
  dropped: boolean;
}

export interface StatsMemberRecentRacesResponse {
  races: RecentRace[];
  success: boolean;
}

export interface RecentRace {
  subsession_id: number;
  series_name: string;
  series_id: number;
  season_name: string;
  season_id: number;
  license_category: string;
  license_category_id: number;
  session_name: string;
  start_time: string;
  track: TrackConfig;
  car_class_name: string;
  car_class_id: number;
  car_id: number;
  aggregate_champ_points: number;
  base_champ_points: number;
  champ_points: number;
  club_points: number;
  division: number;
  finish_position: number;
  finish_position_in_class: number;
  laps_complete: number;
  laps_lead: number;
  new_i_rating: number;
  new_license_level: number;
  new_safety_rating: number;
  new_sub_level: number;
  new_tt_rating: number;
  old_i_rating: number;
  old_license_level: number;
  old_safety_rating: number;
  old_sub_level: number;
  old_tt_rating: number;
  starting_position: number;
  starting_position_in_class: number;
  weight_penalty_kg: number;
  event_type: number;
  event_type_name: string;
  driver_results: DriverResult[];
}

export interface DriverResult {
  cust_id: number;
  display_name: string;
  helmet: Helmet;
  finish_position: number;
  finish_position_in_class: number;
  laps_complete: number;
  laps_lead: number;
  car_class_id: number;
  car_class_name: string;
  car_id: number;
  aggregate_champ_points: number;
  champ_points: number;
  club_points: number;
  division: number;
  new_i_rating: number;
  new_license_level: number;
  new_safety_rating: number;
  new_sub_level: number;
  new_tt_rating: number;
  old_i_rating: number;
  old_license_level: number;
  old_safety_rating: number;
  old_sub_level: number;
  old_tt_rating: number;
  starting_position: number;
  starting_position_in_class: number;
}

export interface StatsMemberSummaryResponse {
  cust_id: number;
  stats: MemberSummaryStats[];
  success: boolean;
}

export interface MemberSummaryStats {
  category: string;
  category_id: number;
  starts: number;
  wins: number;
  top5: number;
  poles: number;
  avg_start_position: number;
  avg_finish_position: number;
  laps: number;
  laps_led: number;
  total_club_points: number;
  year_club_points: number;
}

export interface StatsMemberYearlyResponse {
  stats: MemberYearlyStats[];
  success: boolean;
}

export interface MemberYearlyStats {
  year: number;
  category: string;
  category_id: number;
  starts: number;
  wins: number;
  top5: number;
  poles: number;
  avg_start_position: number;
  avg_finish_position: number;
  laps: number;
  laps_led: number;
  total_club_points: number;
  year_club_points: number;
}

export interface StatsSeasonStandingsResponse {
  season_id: number;
  car_class_id: number;
  chunk_info?: ChunkInfo;
  standings: SeasonStanding[];
  success: boolean;
}

export interface SeasonStanding {
  rank: number;
  cust_id: number;
  display_name: string;
  helmet: Helmet;
  club_id: number;
  club_name: string;
  club_shortname: string;
  division: number;
  old_license_level: number;
  old_safety_rating: number;
  old_cpi: number;
  license: License;
  weeks_counted: number;
  starts: number;
  wins: number;
  top5: number;
  top10: number;
  base_points: number;
  bonus_points: number;
  points: number;
  week_dropped: boolean;
  country_code: string;
  country: string;
}

export interface StatsWorldRecordsResponse {
  world_records: WorldRecord[];
  success: boolean;
}

export interface WorldRecord {
  subsession_id: number;
  cust_id: number;
  display_name: string;
  helmet: Helmet;
  club_id: number;
  club_name: string;
  best_lap_time: number;
  best_lap_num: number;
  best_qual_lap_time: number;
  best_qual_lap_num: number;
  reason_out: string;
  session_start_time: string;
  country_code: string;
  country: string;
}

// === Team Response Types ===

export interface TeamResponse {
  team_id: number;
  team_name: string;
  created: string;
  owner_id: number;
  owner_display_name: string;
  roster: TeamMember[];
  success: boolean;
}

export interface TeamMember {
  cust_id: number;
  display_name: string;
  helmet: Helmet;
  team_owner: boolean;
  team_admin: boolean;
  team_member: boolean;
  licenses?: License[];
}

// === Time Attack Response Types ===

export interface TimeAttackMemberSeasonResultsResponse {
  ta_comp_season_id: number;
  results: TimeAttackResult[];
  success: boolean;
}

export interface TimeAttackResult {
  rank: number;
  rank_in_class: number;
  car_class_id: number;
  car_class_name: string;
  car_id: number;
  display_name: string;
  helmet: Helmet;
  club_id: number;
  club_name: string;
  division: number;
  license: License;
  best_lap_time: number;
  best_lap_num: number;
  attacks: number;
  weeks_counted: number;
  points: number;
  country_code: string;
  country: string;
}

// === Track Response Types ===

export interface TrackAssetsResponse {
  track_assets: TrackAsset[];
  success: boolean;
}

export interface TrackAsset {
  track_id: number;
  track_name: string;
  logo: string;
  small_image: string;
  large_image: string;
  config_name: string;
  corners: number;
  created: string;
  first_sale: string;
  folder: string;
  fully_lit: boolean;
  gridstalls: number;
  has_opt_path: boolean;
  has_short_parade_lap: boolean;
  has_svg_map: boolean;
  is_dirt: boolean;
  is_oval: boolean;
  lap_scoring: number;
  latitude: number;
  longitude: number;
  max_cars: number;
  night_lighting: boolean;
  nominal_lap_time: number;
  number_pitstalls: number;
  opens: string;
  package_id: number;
  pit_road_speed_limit: number;
  price: number;
  priority: number;
  purchasable: boolean;
  qualify_laps: number;
  restart_on_left: boolean;
  retired: boolean;
  search_filters: string;
  site_url: string;
  sku: number;
  solo_laps: number;
  start_skew: number;
  supports_grip_compound: boolean;
  tech_track: boolean;
  time_zone: string;
  track_config_length: number;
  track_dirpath: string;
  track_types: TrackType[];
  banking: string;
  category: string;
  category_id: number;
  closes: string;
  free_with_subscription: boolean;
  price_display: string;
}

export interface TracksResponse {
  tracks: Track[];
  success: boolean;
}

export interface Track {
  track_id: number;
  track_name: string;
  config_name: string;
  category_id: number;
  category: string;
  pkg_id: number;
  recently_added: boolean;
  track_types: TrackType[];
  corners: number;
  created: string;
  first_sale: string;
  folder: string;
  fully_lit: boolean;
  gridstalls: number;
  has_opt_path: boolean;
  has_short_parade_lap: boolean;
  has_svg_map: boolean;
  is_dirt: boolean;
  is_oval: boolean;
  lap_scoring: number;
  latitude: number;
  longitude: number;
  max_cars: number;
  night_lighting: boolean;
  nominal_lap_time: number;
  number_pitstalls: number;
  opens: string;
  package_id: number;
  pit_road_speed_limit: number;
  price: number;
  priority: number;
  purchasable: boolean;
  qualify_laps: number;
  restart_on_left: boolean;
  retired: boolean;
  search_filters: string;
  site_url: string;
  sku: number;
  solo_laps: number;
  start_skew: number;
  supports_grip_compound: boolean;
  tech_track: boolean;
  time_zone: string;
  track_config_length: number;
  track_dirpath: string;
  banking: string;
  closes: string;
  free_with_subscription: boolean;
  price_display: string;
}

// === Backward compatibility types ===
export type MemberCareerParams = StatsMemberCareerParams;
export type MemberDivisionParams = StatsMemberDivisionParams;
export type MemberRecentRacesParams = StatsMemberRecentRacesParams;
export type MemberSummaryParams = StatsMemberSummaryParams;
export type MemberYearlyParams = StatsMemberYearlyParams;
export type SeasonStandingsParams = StatsSeasonDriverStandingsParams;
export type TimeAttackSeasonStandingsParams = StatsSeasonDriverStandingsParams;