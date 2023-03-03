/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
/* eslint-disable @typescript-eslint/no-non-null-assertion */

import React from 'react'
import { Chart, ChartConfiguration, ChartTypeRegistry, Scriptable, ScriptableTooltipContext, TextAlign } from 'chart.js'
import { customCanvasBackgroundColor } from '@propeldata/ui-kit-plugins'

import { CustomPlugins, LeaderboardData, Styles } from './types'
import { defaultStyles } from './defaults'

interface GenereateConfigOptions {
  styles?: Styles
  data: LeaderboardData
}

export function generateConfig(options: GenereateConfigOptions): ChartConfiguration {
  const { styles, data } = options

  const labels = data.rows?.map((row) => row[0])
  const values = data.rows?.map((row) => parseInt(row[row.length - 1]))

  const hideGridLines = styles?.canvas?.hideGridLines || false

  const customPlugins = {
    customCanvasBackgroundColor: {
      color: styles?.canvas?.backgroundColor
    }
  } as CustomPlugins

  const backgroundColor = styles?.bar?.backgroundColor || defaultStyles.bar?.backgroundColor
  const borderColor = styles?.bar?.borderColor || defaultStyles?.bar?.borderColor

  return {
    type: 'bar',
    data: {
      labels: labels || [],
      datasets: [
        {
          data: values || [],
          backgroundColor,
          borderColor
        }
      ]
    },
    options: {
      indexAxis: 'y',
      responsive: !styles?.canvas?.width,
      maintainAspectRatio: false,
      animation: false,
      layout: {
        padding: styles?.canvas?.padding
      },
      plugins: customPlugins,
      scales: {
        x: {
          display: !hideGridLines,
          grid: {
            drawOnChartArea: false
          },
          beginAtZero: true
        },
        y: {
          display: !hideGridLines,
          grid: { drawOnChartArea: true }
        }
      }
    },
    plugins: [customCanvasBackgroundColor]
  }
}

export function useSetupDefaultStyles(styles?: Styles) {
  React.useEffect(() => {
    async function setupDefaultStyles() {
      const font = {
        family: styles?.font?.family,
        size: styles?.font?.size as Scriptable<number | undefined, ScriptableTooltipContext<keyof ChartTypeRegistry>>,
        style: styles?.font?.style,
        lineHeight: styles?.font?.lineHeight,
        color: styles?.font?.color || defaultStyles.font?.color
      }

      Chart.defaults.color = styles?.font?.color || defaultStyles.font?.color!

      Chart.defaults.elements.bar.borderWidth = styles?.bar?.borderWidth || defaultStyles.bar?.borderWidth!
      Chart.defaults.elements.bar.borderRadius = styles?.bar?.borderRadius || defaultStyles.bar?.borderRadius!
      Chart.defaults.elements.bar.borderColor = styles?.bar?.borderColor || styles?.bar?.backgroundColor!
      Chart.defaults.elements.bar.hoverBackgroundColor =
        styles?.bar?.hoverBackgroundColor || styles?.bar?.backgroundColor!
      Chart.defaults.elements.bar.hoverBorderColor = styles?.bar?.hoverBorderColor || styles?.bar?.borderColor!

      Chart.defaults.plugins.tooltip.enabled =
        styles?.tooltip?.display !== undefined ? styles?.tooltip?.display : defaultStyles.tooltip?.display!
      Chart.defaults.plugins.tooltip.padding = styles?.tooltip?.padding || defaultStyles.tooltip?.padding!
      Chart.defaults.plugins.tooltip.backgroundColor =
        styles?.tooltip?.backgroundColor || defaultStyles.tooltip?.backgroundColor!
      Chart.defaults.plugins.tooltip.bodyColor =
        styles?.tooltip?.color || styles?.bar?.backgroundColor || defaultStyles.tooltip?.color!
      Chart.defaults.plugins.tooltip.titleColor =
        styles?.tooltip?.color || styles?.bar?.backgroundColor || defaultStyles.tooltip?.color!
      Chart.defaults.plugins.tooltip.borderColor =
        styles?.tooltip?.borderColor || styles?.bar?.borderColor || defaultStyles.tooltip?.borderColor!
      Chart.defaults.plugins.tooltip.borderWidth = styles?.tooltip?.borderWidth || defaultStyles.tooltip?.borderWidth!
      Chart.defaults.plugins.tooltip.caretSize = styles?.tooltip?.caretSize || defaultStyles.tooltip?.caretSize!
      Chart.defaults.plugins.tooltip.cornerRadius =
        styles?.tooltip?.borderRadius || defaultStyles.tooltip?.borderRadius!
      Chart.defaults.plugins.tooltip.titleFont = font
      Chart.defaults.plugins.tooltip.titleAlign = styles?.tooltip?.alignContent as Scriptable<
        TextAlign,
        ScriptableTooltipContext<keyof ChartTypeRegistry>
      >
      Chart.defaults.plugins.tooltip.bodyAlign = styles?.tooltip?.alignContent as Scriptable<
        TextAlign,
        ScriptableTooltipContext<keyof ChartTypeRegistry>
      >
    }

    setupDefaultStyles()
  }, [styles])
}

interface GetTableSettingsOptions {
  headers?: string[]
  rows?: string[][]
  styles?: Styles
}

export function getTableSettings(options: GetTableSettingsOptions) {
  const { headers, rows, styles } = options

  const headersWithoutValue = headers?.slice(0, headers.length - 1)
  const valueHeader = headers?.[headers.length - 1]

  const rowsWithoutValue = rows?.map((row) => row.slice(0, row.length - 1))

  const valuesByRow = rows?.map((row) => parseInt(row[row.length - 1]))
  const maxValue = Math.max(...(valuesByRow || []))

  const isOrdered = styles?.table?.isOrdered || defaultStyles.table?.isOrdered

  const hasValueBar = styles?.table?.hasValueBar || defaultStyles.table?.hasValueBar

  return { headersWithoutValue, valueHeader, valuesByRow, rowsWithoutValue, maxValue, isOrdered, hasValueBar }
}

interface getValueOptions {
  value: number
  localize?: boolean
}

const getValue = (options: getValueOptions) => {
  const { value, localize } = options

  const isInteger = Number.isInteger(value)

  if (isInteger) {
    return localize ? value.toLocaleString() : value
  }

  return localize ? value.toFixed(2).toLocaleString() : value.toFixed(2)
}

export const getValueWithPrefixAndSufix = (params: {
  prefix?: string
  value?: number
  sufix?: string
  localize?: boolean
}) => {
  const { prefix, value, sufix, localize } = params

  if (!value) return

  return (prefix ? prefix + ' ' : '') + getValue({ value, localize }) + (sufix ? ' ' + sufix : '')
}
