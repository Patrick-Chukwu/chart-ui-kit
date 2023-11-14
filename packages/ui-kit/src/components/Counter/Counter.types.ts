import type { FilterInput, ThemeCSSProperties, TimeRangeInput } from '../../helpers'
import type { ErrorFallbackProps } from '../ErrorFallback'
import type { LoaderProps } from '../Loader'
import type { DefaultThemes } from '../ThemeProvider'

export type CounterQueryProps = {
  /** Time range that the chart will respond to. Will be ignored when value is passed */
  timeRange?: TimeRangeInput
  /**
   * Access token used for the query. While you can pass this one to each component, we recommend wrapping components in the `AccessTokenProvider` instead:
   * @example
   * ```jsx
   * <AccessTokenProvider fetchToken={fetchToken}>
   *   <Counter />
   *   <TimeSeries />
   *   <Leaderboard />
   * </AccessTokenProvider>
   * ```
   * */
  accessToken?: string
  /** Metric unique name will be ignored when value is passed */
  metric?: string
  /** Filters that the chart will respond to */
  filters?: FilterInput[]
  /** Interval in milliseconds for refetching the data */
  refetchInterval?: number
  /** Whether to retry on errors. */
  retry?: boolean
  /** This prop allows you to override the URL for Propel's GraphQL API. You shouldn't need to set this unless you are testing. */
  propelApiUrl?: string
}

export interface CounterProps extends React.ComponentProps<'span'> {
  style?: ThemeCSSProperties
  baseTheme?: DefaultThemes

  /** If passed, the component will ignore the built-in GraphQL operations */
  value?: string
  /** Symbol to be shown before the value text */
  prefixValue?: string
  /** Symbol to be shown after the value text */
  sufixValue?: string
  /** When true, formats value to locale string */
  localize?: boolean
  /** Time zone to use (for example, "America/Los_Angeles", "Europe/Berlin", or "UTC"). Defaults to the client's local time zone. */
  timeZone?: string
  /** Counter query props */
  query?: CounterQueryProps
  /** When true, shows a skeleton loader */
  loading?: boolean
  /** Optional porps that are used to configure the Loader component. */
  loaderProps?: LoaderProps
  /** Optional porps that are used to configure the ErrorFallback component. */
  errorFallbackProps?: ErrorFallbackProps
}
