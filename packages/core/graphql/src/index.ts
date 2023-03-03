export {
  RelativeTimeRange,
  TimeSeriesGranularity,
  TimeSeriesDocument,
  CounterDocument,
  LeaderboardDocument,
  Sort
} from './generated'
export type { TimeRangeInput, FilterInput, Propeller, LeaderboardInput } from './generated'

// export const PROPEL_GRAPHQL_API_ENDPOINT = process.env.PROPEL_GRAPHQL_API_ENDPOINT as string
export const PROPEL_GRAPHQL_API_ENDPOINT = 'https://api.us-east-2.propeldata.com/graphql'
