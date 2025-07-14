# iRacing Data API SDK

A comprehensive TypeScript SDK for the iRacing Data API with **complete coverage of all 71 documented endpoints**. This professional-grade SDK provides type-safe access to all iRacing data including cars, tracks, series, results, statistics, leagues, and more.

## Features

- ✅ **Complete API Coverage**: All 71 iRacing Data API endpoints implemented (100% coverage)
- ✅ **Strict TypeScript Support**: Full type safety with comprehensive return types for all endpoints
- ✅ **Chunked Data Handling**: Automatic fetching and combining of large datasets from Amazon S3
- ✅ **Runtime Validation**: Zod schema validation for parameters and responses
- ✅ **Authentication**: Handles iRacing SHA256 authentication with automatic session management
- ✅ **Rate Limiting**: Automatic rate limit detection and intelligent waiting
- ✅ **Modern Architecture**: ESM and CommonJS support, built with tsup and modern tooling
- ✅ **Comprehensive Testing**: Complete test suite with Vitest including chunked response tests
- ✅ **Professional Quality**: Clean architecture with proper error handling and logging
- ✅ **Cross-Platform**: Works in both Node.js and browser environments

## Installation

```bash
# npm
npm install iracing-data-api

# yarn
yarn add iracing-data-api

# pnpm
pnpm add iracing-data-api
```

### Requirements

- Node.js 16.0.0 or higher
- TypeScript 4.5.0 or higher (for TypeScript projects)

## Quick Start

```typescript
import { iRacingSDK } from 'iracing-data-api';

const sdk = new iRacingSDK();

// Authenticate with your iRacing credentials
await sdk.authenticate({
  email: 'your-email@example.com',
  password: 'your-password'
});

// Get all cars with full type safety
const cars = await sdk.getCars(); // Returns CarsResponse
console.log(`Found ${cars.cars.length} cars`);

// Get your member information
const memberInfo = await sdk.getMemberInfo(); // Returns MemberInfoResponse
console.log(`Welcome, ${memberInfo.display_name}!`);

// Get your recent races
const recentRaces = await sdk.getStatsMemberRecentRaces(); // Returns StatsMemberRecentRacesResponse
console.log(`You have ${recentRaces.races.length} recent races`);

// Search for series results (supports chunked data automatically)
const results = await sdk.getResultsSearchSeries({
  season_year: 2024,
  season_quarter: 1,
  cust_id: memberInfo.cust_id
}); // Returns ResultsSearchResponse
console.log(`Found ${results.data.length} race results`);
```

### CommonJS Usage

```javascript
const { iRacingSDK } = require('iracing-data-api');

const sdk = new iRacingSDK();

// Same API as above
sdk.authenticate({ email: 'your-email', password: 'your-password' })
  .then(() => sdk.getCars())
  .then(cars => console.log('Cars:', cars));
```

## Authentication

The SDK handles iRacing's SHA256 authentication automatically with session management. You only need to authenticate once per session:

```typescript
const sdk = new iRacingSDK();

try {
  const authResult = await sdk.authenticate({
    email: 'your-email@example.com',
    password: 'your-password'
  });
  
  console.log('Authenticated successfully:', authResult);
  
  // Now you can make API calls
  const memberInfo = await sdk.getMemberInfo();
  
} catch (error) {
  console.error('Authentication failed:', error.message);
}
```

### Environment Variables

For security, consider using environment variables:

```typescript
import { iRacingSDK } from 'iracing-data-api';

const sdk = new iRacingSDK();

await sdk.authenticate({
  email: process.env.IRACING_EMAIL!,
  password: process.env.IRACING_PASSWORD!
});
```

## TypeScript Support

The SDK provides **strict type safety** with comprehensive TypeScript support:

### Fully Typed Responses

Every API method returns properly typed responses with IntelliSense support:

```typescript
// All methods have specific return types
const cars: CarsResponse = await sdk.getCars();
const memberInfo: MemberInfoResponse = await sdk.getMemberInfo();
const results: ResultsSearchResponse = await sdk.getResultsSearchSeries({
  season_year: 2024,
  season_quarter: 1
});

// Access typed properties with full autocomplete
console.log(cars.cars[0].car_name);           // string
console.log(memberInfo.display_name);         // string
console.log(results.data[0].series_name);     // string
```

### Parameter Validation

All parameters are validated at both compile-time and runtime:

```typescript
// TypeScript catches parameter errors
await sdk.getResults({ subsession_id: "invalid" }); // Error: Expected number

// Runtime validation with helpful messages
await sdk.getLeague({ league_id: 123, include_licenses: true }); // ✅ Valid
```

### Comprehensive Type Definitions

The SDK includes 100+ TypeScript interfaces covering:
- **Request Parameters**: All endpoint parameters with proper types
- **Response Types**: Complete response structures for all 71 endpoints
- **Data Models**: Car, Track, Member, League, and other data structures
- **API Enums**: Categories, divisions, event types, and more

## Chunked Data Handling

Some iRacing API endpoints return large datasets that are split into chunks stored on Amazon S3. The SDK automatically handles this complexity:

### Automatic Chunk Processing

```typescript
// Large datasets are automatically fetched and combined
const standings = await sdk.getStatsSeasonDriverStandings({
  season_id: 3840,
  car_class_id: 1
});

// The SDK automatically:
// 1. Detects chunked responses
// 2. Fetches all chunks from S3
// 3. Combines data into a single response
console.log(`Found ${standings.standings.length} drivers`);
```

### Chunked Endpoints

The following endpoints support automatic chunked data handling:

**Search Results (High Priority)**:
- `getResultsSearchHosted()` - Hosted/league session results (90-day max)
- `getResultsSearchSeries()` - Official series results (90-day max)

**Statistics & Standings (Medium Priority)**:
- `getStatsSeasonDriverStandings()` - Season driver standings
- `getStatsSeasonSupersessionStandings()` - Supersession standings
- `getStatsSeasonTeamStandings()` - Team standings
- `getStatsSeasonTTStandings()` - Time trial standings
- `getStatsSeasonTTResults()` - Time trial results
- `getStatsSeasonQualifyResults()` - Qualifying results
- `getResultsSeasonResults()` - Season results
- `getLeagueSeasonStandings()` - League standings

### Configuration Options

Control chunking behavior per SDK instance:

```typescript
// Enable automatic chunking (default)
const sdk = new iRacingSDK({
  autoHandleChunkedResponses: true
});

// Disable automatic chunking (get raw responses)
const sdk = new iRacingSDK({
  autoHandleChunkedResponses: false
});

// With chunking disabled, you get raw responses with chunk_info
const response = await sdk.getResultsSearchSeries({
  season_year: 2024,
  season_quarter: 1
});

if (response.chunk_info) {
  console.log(`Data is chunked: ${response.chunk_info.total_chunks} chunks`);
  // Handle chunks manually if needed
}
```

## Complete API Coverage

This SDK implements **all 71 iRacing Data API endpoints** organized by category, providing 100% coverage of the official API specification:

### Car Data (3 endpoints)
- `getCars()` - Get all available cars
- `getCarAssets()` - Get car images and logos (paths relative to https://images-static.iracing.com/)
- `getCarClasses()` - Get all car classes

### Constants (3 endpoints)
- `getCategories()` - Get track categories (constant data)
- `getDivisions()` - Get license divisions (constant data)
- `getEventTypes()` - Get event types (constant data)

### Driver Stats by Category (6 endpoints)
- `getDriverStatsOval()` - Oval category driver statistics
- `getDriverStatsSportsCar()` - Sports car category driver statistics
- `getDriverStatsFormulaCar()` - Formula car category driver statistics
- `getDriverStatsRoad()` - Road category driver statistics
- `getDriverStatsDirtOval()` - Dirt oval category driver statistics
- `getDriverStatsDirtRoad()` - Dirt road category driver statistics

### Hosted Sessions (2 endpoints)
- `getHostedCombinedSessions(params?)` - Sessions that can be joined as driver or spectator
- `getHostedSessions()` - Sessions that can be joined as driver only

### League Data (9 endpoints)
- `getLeague(params)` - Get league information by ID
- `getLeagueDirectory(params?)` - Search league directory with filters
- `getLeagueCustSessions(params?)` - Get customer league sessions
- `getLeaguePointsSystems(params)` - Get league points systems
- `getLeagueMembership(params?)` - Get league membership information
- `getLeagueRoster(params)` - Get league roster with member details
- `getLeagueSeasons(params)` - Get league seasons (active and retired)
- `getLeagueSeasonStandings(params)` - Get league season standings
- `getLeagueSeasonSessions(params)` - Get league season sessions

### Lookup Data (5 endpoints)
- `getLookupCountries()` - Get countries lookup data
- `getLookupDrivers(params)` - Search for drivers by name or ID
- `getLookupFlairs()` - Get flairs/flags (icons from flag-icons)
- `getLookupGet()` - Get general lookup data (weather, license levels)
- `getLookupLicenses()` - Get licenses lookup data

### Member Data (7 endpoints)
- `getMemberInfo()` - Get authenticated member information
- `getMembers(params)` - Get member information by customer IDs
- `getMemberAwards(params?)` - Get member awards
- `getMemberAwardInstances(params)` - Get specific award instances
- `getMemberChartData(params)` - Get member chart data (iRating, TT Rating, License/SR)
- `getMemberProfile(params?)` - Get member profile information
- `getMemberParticipationCredits()` - Get participation credits for authenticated member

### Results Data (7 endpoints)
- `getResults(params)` - Get subsession results if authorized
- `getResultsEventLog(params)` - Get event log for a subsession
- `getResultsLapChartData(params)` - Get lap chart data for a subsession
- `getResultsLapData(params)` - Get lap data for a subsession
- `getResultsSearchHosted(params)` - Search hosted and league session results (90 day max)
- `getResultsSearchSeries(params)` - Search official series results (90 day max)
- `getResultsSeasonResults(params)` - Get season results by season ID

### Season Data (4 endpoints)
- `getSeasonList(params)` - Get season list by year and quarter
- `getSeasonRaceGuide(params?)` - Get race guide with upcoming sessions
- `getSeasonSpectatorSubsessionIds(params?)` - Get spectator subsession IDs
- `getSeasonSpectatorSubsessionIdsDetail(params?)` - Get detailed spectator subsession data

### Series Data (7 endpoints)
- `getSeries()` - Get all series information
- `getSeriesAssets()` - Get series images/logos (paths relative to https://images-static.iracing.com/)
- `getSeriesPastSeasons(params)` - Get all seasons for a series
- `getSeriesSeasons(params?)` - Get series seasons (active or by year/quarter)
- `getSeriesSeasonList(params?)` - Get series season list
- `getSeriesSeasonSchedule(params)` - Get season schedule by season ID
- `getSeriesStats()` - Get series statistics (filter by official:true for standings)

### Statistics (14 endpoints)
- `getStatsMemberBests(params?)` - Get member best times by car
- `getStatsMemberCareer(params?)` - Get member career statistics
- `getStatsMemberDivision(params)` - Get member division standings (authenticated member only)
- `getStatsMemberRecap(params?)` - Get member recap by year/season
- `getStatsMemberRecentRaces(params?)` - Get member recent races
- `getStatsMemberSummary(params?)` - Get member summary statistics
- `getStatsMemberYearly(params?)` - Get member yearly statistics
- `getStatsSeasonDriverStandings(params)` - Get season driver standings
- `getStatsSeasonSupersessionStandings(params)` - Get season supersession standings
- `getStatsSeasonTeamStandings(params)` - Get season team standings
- `getStatsSeasonTTStandings(params)` - Get season time trial standings
- `getStatsSeasonTTResults(params)` - Get season time trial results
- `getStatsSeasonQualifyResults(params)` - Get season qualifying results
- `getStatsWorldRecords(params)` - Get world records for car/track combination

### Team Data (1 endpoint)
- `getTeam(params)` - Get team information by team ID

### Time Attack (1 endpoint)
- `getTimeAttackMemberSeasonResults(params)` - Get time attack results for authenticated member

### Track Data (2 endpoints)
- `getTracks()` - Get all tracks information
- `getTrackAssets()` - Get track images/logos (paths relative to https://images-static.iracing.com/)

## Advanced Usage

### Custom Configuration

```typescript
const sdk = new iRacingSDK({
  baseUrl: 'https://members-ng.iracing.com', // Default
  fetchImpl: customFetch, // Custom fetch implementation
});
```

### Error Handling

```typescript
try {
  const results = await sdk.getResults({ subsession_id: 12345 });
} catch (error) {
  if (error.message.includes('HTTP error! status: 401')) {
    // Handle authentication error
    await sdk.authenticate({ email, password });
  } else {
    // Handle other errors
    console.error('API Error:', error);
  }
}
```

### Rate Limiting

The SDK automatically handles rate limiting:

```typescript
// The SDK will automatically wait when rate limits are reached
const cars = await sdk.getCars();
const tracks = await sdk.getTracks();
const series = await sdk.getSeries();
```

### TypeScript Support

All methods are fully typed with parameter validation:

```typescript
// TypeScript will catch this error
await sdk.getResults({ subsession_id: 'invalid' }); // Error: Expected number

// Correct usage
await sdk.getResults({ subsession_id: 12345 });

// Parameters are validated at runtime using Zod
await sdk.getLeague({ league_id: 123, include_licenses: true });
```

## Comprehensive Examples

### Member Information and Statistics

```typescript
// Get your member information
const memberInfo = await sdk.getMemberInfo();
console.log(`Welcome, ${memberInfo.display_name}!`);

// Get your recent races
const recentRaces = await sdk.getStatsMemberRecentRaces();
console.log(`You have ${recentRaces.length} recent races`);

// Get your best times
const bestTimes = await sdk.getStatsMemberBests();
console.log(`Personal best times across ${bestTimes.length} cars`);

// Get your career statistics
const careerStats = await sdk.getStatsMemberCareer();
console.log('Career statistics:', careerStats);

// Get your yearly statistics
const yearlyStats = await sdk.getStatsMemberYearly();
console.log('Yearly statistics:', yearlyStats);
```

### Series and Season Data

```typescript
// Get all series
const allSeries = await sdk.getSeries();
console.log(`Found ${allSeries.length} series`);

// Get current season list
const currentSeasons = await sdk.getSeasonList({
  season_year: 2024,
  season_quarter: 1
});

// Get race guide (upcoming races)
const raceGuide = await sdk.getSeasonRaceGuide();
console.log('Upcoming races:', raceGuide);

// Get season standings
const standings = await sdk.getStatsSeasonDriverStandings({
  season_id: 3840,
  car_class_id: 1,
  division: 0 // Division 1 (0-indexed)
});
```

### Results and Historical Data

```typescript
// Search for your recent series results
const myResults = await sdk.getResultsSearchSeries({
  season_year: 2024,
  season_quarter: 1,
  cust_id: memberInfo.cust_id
});

// Search for hosted sessions
const hostedResults = await sdk.getResultsSearchHosted({
  start_range_begin: '2024-01-01T00:00:00Z',
  finish_range_end: '2024-01-31T23:59:59Z',
  cust_id: memberInfo.cust_id
});

// Get detailed results for a specific subsession
const detailedResults = await sdk.getResults({
  subsession_id: 12345,
  include_licenses: true
});

// Get lap data for a subsession
const lapData = await sdk.getResultsLapData({
  subsession_id: 12345,
  simsession_number: 0, // Main event
  cust_id: memberInfo.cust_id
});
```

### League Management

```typescript
// Search for leagues
const leagues = await sdk.getLeagueDirectory({
  search: 'GT3',
  restrict_to_recruiting: true
});

// Get league information
const leagueInfo = await sdk.getLeague({
  league_id: 123,
  include_licenses: true
});

// Get league roster
const roster = await sdk.getLeagueRoster({
  league_id: 123,
  include_licenses: true
});

// Get league season standings
const leagueStandings = await sdk.getLeagueSeasonStandings({
  league_id: 123,
  season_id: 456
});
```

### World Records and Best Times

```typescript
// Get world records for a car/track combination
const worldRecords = await sdk.getStatsWorldRecords({
  car_id: 1,      // Car ID
  track_id: 1,    // Track ID
  season_year: 2024
});

// Get time trial results
const ttResults = await sdk.getStatsSeasonTTResults({
  season_id: 3840,
  car_class_id: 1,
  race_week_num: 0
});

// Get qualifying results
const qualResults = await sdk.getStatsSeasonQualifyResults({
  season_id: 3840,
  car_class_id: 1,
  race_week_num: 0
});
```

### Asset Management

```typescript
// Get car images and information
const carAssets = await sdk.getCarAssets();
const cars = await sdk.getCars();

// Get track images and information
const trackAssets = await sdk.getTrackAssets();
const tracks = await sdk.getTracks();

// Get series images and information
const seriesAssets = await sdk.getSeriesAssets();
const series = await sdk.getSeries();

// Note: Image paths are relative to https://images-static.iracing.com/
```

## Development

### Setup

```bash
git clone https://github.com/your-org/iracing-data-api.git
cd iracing-data-api
npm install
```

### Available Scripts

```bash
# Development
npm run dev          # Watch mode building with tsup
npm run build        # Build for production (generates CJS, ESM, and .d.ts files)
npm run typecheck    # TypeScript type checking

# Testing
npm run test         # Run tests with Vitest
npm run test:watch   # Watch mode testing
npm run test:coverage # Generate coverage report with @vitest/coverage-v8
npm run test:ui      # Visual test UI with @vitest/ui
npm run test:endpoints # Test all 71 API endpoints
npm run test:chunked # Comprehensive chunked data endpoint testing
npm run test:chunked-simple # Simple focused chunked data test
npm run test:chunked-basic # Basic chunked test with better error handling

# Quality & Linting
npm run lint         # ESLint checking
npm run lint:fix     # Fix ESLint issues automatically

# Documentation
npm run docs         # Generate API documentation with TypeDoc

# Publishing
npm run prepare      # Runs automatically before publishing
npm run prepublishOnly # Runs tests, typecheck, and lint before publishing
npm run release      # Build and publish to npm
```

### Project Structure

```
src/
├── index.ts              # Main entry point and exports
├── iracingApi.ts         # Main SDK class with all API methods
├── endpoints.ts          # API endpoints enum
├── types.ts              # TypeScript types and Zod schemas
└── __tests__/
    └── iracingApi.test.ts # Comprehensive test suite
```

### Building

The project uses `tsup` for building:

```bash
npm run build
```

This generates:
- `dist/index.js` - CommonJS build
- `dist/index.mjs` - ESM build
- `dist/index.d.ts` - TypeScript declarations

### Testing

Tests are written with Vitest:

```bash
npm run test:coverage
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## Key Features Summary

- **Complete Coverage**: All 71 official iRacing Data API endpoints implemented
- **Strict Type Safety**: Comprehensive TypeScript support with 100+ response interfaces
- **Chunked Data Handling**: Automatic fetching and combining of large datasets from S3
- **Runtime Validation**: Full parameter and response validation using Zod schemas
- **Modern Architecture**: Clean, maintainable code with proper separation of concerns
- **Authentication**: Handles SHA256 password hashing and session management
- **Rate Limiting**: Automatic detection and intelligent waiting
- **Error Handling**: Comprehensive error handling with meaningful messages
- **Testing**: Complete test suite with mocking, chunking tests, and coverage reporting
- **Documentation**: Extensive TSDoc/JSDoc comments throughout
- **Dual Module Support**: Both ESM and CommonJS builds included
- **Cross-Platform**: Works in Node.js and browser environments

## Support

- **Issues**: [GitHub Issues](https://github.com/your-org/iracing-data-api/issues)
- **Documentation**: [API Documentation](https://your-org.github.io/iracing-data-api/)
- **iRacing API**: [Official iRacing Data API](https://forums.iracing.com/discussion/15068/general-availability-of-data-api/)

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for version history.

## License

MIT License. See [LICENSE](LICENSE) for details.

---

**Note**: This is an unofficial SDK and is not affiliated with iRacing.com Motorsport Simulations, LLC.