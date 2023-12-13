import classnames from 'classnames'
import React from 'react'
import {
  CounterQuery,
  getTimeZone,
  PROPEL_GRAPHQL_API_ENDPOINT,
  useCombinedRefsCallback,
  useCounterQuery
} from '../../helpers'
import { useAccessToken } from '../AccessTokenProvider/useAccessToken'
import { ErrorFallback } from '../ErrorFallback'
import { Loader } from '../Loader'
import { useSetupTheme } from '../ThemeProvider'
import { withContainer } from '../withContainer'
import componentStyles from './Counter.module.scss'
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
      baseTheme,
      loaderProps,
      errorFallbackProps,
      timeZone,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      card,
      ...rest
    },
    forwardedRef
  ) => {
    const { accessToken: accessTokenFromProvider, isLoading: isLoadingAccessToken } = useAccessToken()
    const accessToken = query?.accessToken ?? accessTokenFromProvider
    const innerRef = React.useRef<HTMLSpanElement>(null)
    const { componentContainer, setRef, ref } = useCombinedRefsCallback({ forwardedRef, innerRef })
    useSetupTheme({ componentContainer, baseTheme })

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
    } = useCounterQuery<CounterQuery, Error>(
      {
        endpoint: query?.propelApiUrl ?? PROPEL_GRAPHQL_API_ENDPOINT,
        fetchParams: {
          headers: {
            'content-type': 'application/graphql-response+json',
            authorization: `Bearer ${accessToken}`
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
        enabled: !isStatic && accessToken != null
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

        if (
          !isStatic &&
          ((!query?.accessToken && !accessTokenFromProvider && !isLoadingAccessToken) ||
            !query?.metric ||
            !query?.timeRange)
        ) {
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
    }, [isStatic, value, query, isLoadingStatic, accessTokenFromProvider, isLoadingAccessToken])

    if (error || propsMismatch) {
      return <ErrorFallback error={null} {...errorFallbackProps} />
    }

    if (((isStatic && isLoadingStatic) || (!isStatic && (isLoadingQuery || isLoadingAccessToken))) && !ref.current) {
      return <Loader className={componentStyles.loader} {...loaderProps} isText />
    }

    return (
      <span
        ref={setRef}
        className={classnames(
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
