import classnames from 'classnames'
import React from 'react'
import { getTimeZone, PROPEL_GRAPHQL_API_ENDPOINT, useCombinedRefs, useCounterQuery } from '../../helpers'
import themes from '../../themes/themes.module.css'
import { useAccessToken } from '../AccessTokenProvider/useAccessToken'
import { ErrorFallback } from '../ErrorFallback'
import { Loader } from '../Loader'
import { useTheme } from '../ThemeProvider'
import { withContainer } from '../withContainer'
import componentStyles from './Counter.module.css'
import type { CounterProps } from './Counter.types'
import { getValueWithPrefixAndSufix } from './utils'

export const CounterComponent = React.forwardRef<HTMLSpanElement, CounterProps>(
  (
    {
      value: staticValue,
      query,
      prefixValue,
      sufixValue,
      loading: isLoadingStatic = false,
      localize,
      className,
      loaderProps,
      errorFallbackProps,
      timeZone,
      ...rest
    },
    forwardedRef
  ) => {
    const theme = useTheme()
    const innerRef = React.useRef<HTMLSpanElement>(null)
    const combinedRefs = useCombinedRefs(forwardedRef, innerRef)

    /**
     * If the user passes `value` attribute, it
     * should behave as a static component without any GraphQL operation performed
     */
    const isStatic = !query

    const [propsMismatch, setPropsMismatch] = React.useState(false)

    const {
      isInitialLoading: isLoadingQuery,
      error,
      data: fetchedValue
    } = useCounterQuery(
      {
        endpoint: query?.propelApiUrl ?? PROPEL_GRAPHQL_API_ENDPOINT,
        fetchParams: {
          headers: {
            'content-type': 'application/graphql-response+json',
            authorization: `Bearer ${query?.accessToken}`
          }
        }
      },
      {
        counterInput: {
          metricName: query?.metric,
          timeZone: timeZone ?? getTimeZone(),
          timeRange: {
            relative: query?.timeRange?.relative ?? null,
            n: query?.timeRange?.n ?? null,
            start: query?.timeRange?.start ?? null,
            stop: query?.timeRange?.stop ?? null
          },
          filters: query?.filters ?? []
        }
      },
      {
        refetchInterval: query?.refetchInterval,
        retry: query?.retry,
        enabled: !isStatic
      }
    )

    const value = isStatic ? staticValue : fetchedValue?.counter?.value

    React.useEffect(() => {
      function handlePropsMismatch() {
        if (isStatic && !value) {
          // console.error('InvalidPropsError: You must pass either `value` or `query` props') we will set logs as a feature later
          setPropsMismatch(true)
          return
        }

        if (!isStatic && (!query?.accessToken || !query?.metric || !query?.timeRange)) {
          // console.error(
          //   'InvalidPropsError: When opting for fetching data you must pass at least `accessToken`, `metric` and `timeRange` in the `query` prop'
          // ) we will set logs as a feature later
          setPropsMismatch(true)
          return
        }

        setPropsMismatch(false)
      }

      if (!isLoadingStatic) {
        handlePropsMismatch()
      }
    }, [isStatic, value, query, isLoadingStatic])

    if (error || propsMismatch) {
      return <ErrorFallback error={null} {...errorFallbackProps} />
    }

    if (((isStatic && isLoadingStatic) || (!isStatic && isLoadingQuery)) && !innerRef.current) {
      return <Loader {...loaderProps} isText />
    }

    return (
      <span
        ref={combinedRefs}
        className={classnames(
          !theme?.themeClassName && themes.lightTheme,
          componentStyles.rootCounter,
          (isLoadingQuery || isLoadingStatic) && componentStyles.loading,
          className
        )}
        {...rest}
      >
        {getValueWithPrefixAndSufix({
          prefix: prefixValue,
          value,
          sufix: sufixValue,
          localize
        })}
      </span>
    )
  }
)

CounterComponent.displayName = 'CounterComponent'

export const Counter = withContainer(CounterComponent, ErrorFallback) as typeof CounterComponent
