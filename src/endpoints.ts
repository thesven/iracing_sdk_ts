/**
 * iRacing API endpoint URLs
 * Generated from official API documentation
 */
export enum ApiEndpoints {
  // Auth
  AUTH = '/auth',
  
  // Car
  CAR_ASSETS = '/data/car/assets',
  CAR_GET = '/data/car/get',
  
  // Car Class
  CARCLASS_GET = '/data/carclass/get',
  
  // Constants
  CONSTANTS_CATEGORIES = '/data/constants/categories',
  CONSTANTS_DIVISIONS = '/data/constants/divisions',
  CONSTANTS_EVENT_TYPES = '/data/constants/event_types',
  
  // Driver Stats by Category
  DRIVER_STATS_OVAL = '/data/driver_stats_by_category/oval',
  DRIVER_STATS_SPORTS_CAR = '/data/driver_stats_by_category/sports_car',
  DRIVER_STATS_FORMULA_CAR = '/data/driver_stats_by_category/formula_car',
  DRIVER_STATS_ROAD = '/data/driver_stats_by_category/road',
  DRIVER_STATS_DIRT_OVAL = '/data/driver_stats_by_category/dirt_oval',
  DRIVER_STATS_DIRT_ROAD = '/data/driver_stats_by_category/dirt_road',
  
  // Hosted
  HOSTED_COMBINED_SESSIONS = '/data/hosted/combined_sessions',
  HOSTED_SESSIONS = '/data/hosted/sessions',
  
  // League
  LEAGUE_CUST_LEAGUE_SESSIONS = '/data/league/cust_league_sessions',
  LEAGUE_DIRECTORY = '/data/league/directory',
  LEAGUE_GET = '/data/league/get',
  LEAGUE_GET_POINTS_SYSTEMS = '/data/league/get_points_systems',
  LEAGUE_MEMBERSHIP = '/data/league/membership',
  LEAGUE_ROSTER = '/data/league/roster',
  LEAGUE_SEASONS = '/data/league/seasons',
  LEAGUE_SEASON_STANDINGS = '/data/league/season_standings',
  LEAGUE_SEASON_SESSIONS = '/data/league/season_sessions',
  
  // Lookup
  LOOKUP_COUNTRIES = '/data/lookup/countries',
  LOOKUP_DRIVERS = '/data/lookup/drivers',
  LOOKUP_FLAIRS = '/data/lookup/flairs',
  LOOKUP_GET = '/data/lookup/get',
  LOOKUP_LICENSES = '/data/lookup/licenses',
  
  // Member
  MEMBER_AWARDS = '/data/member/awards',
  MEMBER_AWARD_INSTANCES = '/data/member/award_instances',
  MEMBER_CHART_DATA = '/data/member/chart_data',
  MEMBER_GET = '/data/member/get',
  MEMBER_INFO = '/data/member/info',
  MEMBER_PARTICIPATION_CREDITS = '/data/member/participation_credits',
  MEMBER_PROFILE = '/data/member/profile',
  
  // Results
  RESULTS_GET = '/data/results/get',
  RESULTS_EVENT_LOG = '/data/results/event_log',
  RESULTS_LAP_CHART_DATA = '/data/results/lap_chart_data',
  RESULTS_LAP_DATA = '/data/results/lap_data',
  RESULTS_SEARCH_HOSTED = '/data/results/search_hosted',
  RESULTS_SEARCH_SERIES = '/data/results/search_series',
  RESULTS_SEASON_RESULTS = '/data/results/season_results',
  
  // Season
  SEASON_LIST = '/data/season/list',
  SEASON_RACE_GUIDE = '/data/season/race_guide',
  SEASON_SPECTATOR_SUBSESSIONIDS = '/data/season/spectator_subsessionids',
  SEASON_SPECTATOR_SUBSESSIONIDS_DETAIL = '/data/season/spectator_subsessionids_detail',
  
  // Series
  SERIES_ASSETS = '/data/series/assets',
  SERIES_GET = '/data/series/get',
  SERIES_PAST_SEASONS = '/data/series/past_seasons',
  SERIES_SEASONS = '/data/series/seasons',
  SERIES_SEASON_LIST = '/data/series/season_list',
  SERIES_SEASON_SCHEDULE = '/data/series/season_schedule',
  SERIES_STATS_SERIES = '/data/series/stats_series',
  
  // Stats
  STATS_MEMBER_BESTS = '/data/stats/member_bests',
  STATS_MEMBER_CAREER = '/data/stats/member_career',
  STATS_MEMBER_DIVISION = '/data/stats/member_division',
  STATS_MEMBER_RECAP = '/data/stats/member_recap',
  STATS_MEMBER_RECENT_RACES = '/data/stats/member_recent_races',
  STATS_MEMBER_SUMMARY = '/data/stats/member_summary',
  STATS_MEMBER_YEARLY = '/data/stats/member_yearly',
  STATS_SEASON_DRIVER_STANDINGS = '/data/stats/season_driver_standings',
  STATS_SEASON_SUPERSESSION_STANDINGS = '/data/stats/season_supersession_standings',
  STATS_SEASON_TEAM_STANDINGS = '/data/stats/season_team_standings',
  STATS_SEASON_TT_STANDINGS = '/data/stats/season_tt_standings',
  STATS_SEASON_TT_RESULTS = '/data/stats/season_tt_results',
  STATS_SEASON_QUALIFY_RESULTS = '/data/stats/season_qualify_results',
  STATS_WORLD_RECORDS = '/data/stats/world_records',
  
  // Team
  TEAM_GET = '/data/team/get',
  
  // Time Attack
  TIME_ATTACK_MEMBER_SEASON_RESULTS = '/data/time_attack/member_season_results',
  
  // Track
  TRACK_ASSETS = '/data/track/assets',
  TRACK_GET = '/data/track/get',
}