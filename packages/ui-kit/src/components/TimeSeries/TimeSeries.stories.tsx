import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import axiosInstance from '../../../../../app/storybook/src/axios'
import {
  quotedStringRegex,
  RelativeTimeRange,
  storybookCodeTemplate,
  TimeSeriesGranularity,
  useStorybookAccessToken
} from '../../helpers'
import { TimeSeries as TimeSeriesSource, TimeSeriesComponent } from './TimeSeries'

const meta: Meta<typeof TimeSeriesComponent> = {
  title: 'Components/TimeSeries',
  component: TimeSeriesComponent,
  argTypes: {
    baseTheme: {
      table: {
        disable: true
      }
    },
    // @TODO: fix it
    variant: {
      table: {
        disable: true
      }
    }
  },
  parameters: {
    controls: { sort: 'alpha' },
    imports: 'TimeSeries, RelativeTimeRange, TimeSeriesGranularity',
    transformBody: (body: string) =>
      body
        .replace(quotedStringRegex('LAST_N_DAYS'), 'RelativeTimeRange.LastNDays')
        .replace(quotedStringRegex('WEEK'), 'TimeSeriesGranularity.Week'),
    codeTemplate: storybookCodeTemplate
  }
}

export default meta

type Story = StoryObj<typeof TimeSeriesComponent>

const dataset = {
  labels: [
    '2022-01-01T00:00:00.000Z',
    '2022-02-01T00:00:00.000Z',
    '2022-03-01T00:00:00.000Z',
    '2022-04-01T00:00:00.000Z',
    '2022-05-01T00:00:00.000Z',
    '2022-06-01T00:00:00.000Z',
    '2022-07-01T00:00:00.000Z',
    '2022-08-01T00:00:00.000Z',
    '2022-09-01T00:00:00.000Z',
    '2022-10-01T00:00:00.000Z',
    '2022-11-01T00:00:00.000Z',
    '2022-12-01T00:00:00.000Z',
    '2023-01-01T00:00:00.000Z',
    '2023-02-01T00:00:00.000Z',
    '2023-03-01T00:00:00.000Z',
    '2023-04-01T00:00:00.000Z',
    '2023-05-01T00:00:00.000Z',
    '2023-06-01T00:00:00.000Z',
    '2023-07-01T00:00:00.000Z',
    '2023-08-01T00:00:00.000Z'
  ],
  values: [809, 984, 673, 530, 522, 471, 872, 578, 825, 619, 38, 326, 128, 615, 844, 58, 576, 28, 663, 189]
}

const connectedParams = {
  accessToken: '<PROPEL_ACCESS_TOKEN>',
  metric: process.env.STORYBOOK_METRIC_UNIQUE_NAME_1,
  timeRange: {
    relative: RelativeTimeRange.LastNDays,
    n: 30
  },
  granularity: TimeSeriesGranularity.Week
}

const TimeSeries = (args: Story['args']) => {
  const { accessToken } = useStorybookAccessToken(axiosInstance)

  if (!accessToken && args?.query) {
    return null
  }

  return (
    <TimeSeriesSource
      {...{
        ...args,
        query: args?.query
          ? {
              ...args?.query,
              accessToken
            }
          : undefined
      }}
    />
  )
}

export const LineStory: Story = {
  name: 'Line',
  args: {
    variant: 'line',
    query: connectedParams,
    card: true
  },
  render: (args) => <TimeSeries {...args} />
}

export const LineAreaStory: Story = {
  name: 'Line Area',
  args: {
    variant: 'line',
    query: connectedParams,
    card: true,
    chartProps: {
      fillArea: true
    }
  },
  render: (args) => <TimeSeries {...args} />
}

export const BarStory: Story = {
  name: 'Bar',
  args: {
    variant: 'bar',
    card: true,
    query: {
      ...connectedParams,
      timeRange: {
        ...connectedParams.timeRange,
        n: 90
      }
    }
  },
  render: (args) => <TimeSeries {...args} />
}

export const BarGridStory: Story = {
  name: 'Grid',
  args: {
    variant: 'bar',
    card: true,
    chartProps: {
      grid: true
    },
    query: {
      ...connectedParams,
      timeRange: {
        ...connectedParams.timeRange,
        n: 90
      }
    }
  },
  render: (args) => <TimeSeries {...args} />
}

export const CustomChartStory: Story = {
  name: 'Custom chart',
  tags: ['pattern'],
  args: {
    variant: 'line',
    query: connectedParams,
    chartConfigProps: (config) => {
      // Change the line style
      config.data.datasets[0] = {
        ...config.data.datasets[0],
        tension: 0.1,
        borderColor: '#17B897',
        borderWidth: 3,
        pointStyle: false
      }

      // Hide the axes
      config.options = {
        ...config.options,
        scales: {
          x: {
            display: false
          },
          y: {
            display: false
          }
        }
      }

      // Style the canvas
      const backgroundColorPlugin = {
        id: 'backgroundColorPlugin',
        beforeDraw: (chart) => {
          const ctx = chart.canvas.getContext('2d')
          ctx.save()
          ctx.fillStyle = 'lightblue'
          ctx.fillRect(0, 0, chart.width, chart.height)
          ctx.restore()
        }
      }
      config.plugins = [...(config.plugins || []), backgroundColorPlugin]

      return config
    },
    style: {
      width: '100px',
      height: '45px'
    }
  },
  render: (args) => <TimeSeries {...args} />
}

export const CustomStyleStory: Story = {
  name: 'Custom style',
  tags: ['pattern'],
  args: {
    variant: 'bar',
    query: connectedParams,
    // Style the component
    style: {
      border: '1px solid #532AB4',
      borderRadius: '4px'
    },
    // Style the chart
    chartConfigProps: (config) => {
      config.data.datasets[0] = {
        ...config.data.datasets[0],
        backgroundColor: '#532AB4'
      }
      return config
    }
  },
  render: (args) => <TimeSeries {...args} />
}

export const ChartOnClickStory: Story = {
  name: 'Chart onClick event',
  tags: ['pattern'],
  args: {
    variant: 'bar',
    query: connectedParams,
    chartConfigProps: (config) => ({
      ...config,
      options: {
        ...config.options,
        onClick: (event, elements) => {
          console.log('chartOnClickStory', event, elements)
        }
      }
    })
  },
  render: (args) => <TimeSeries {...args} />
}

export const ChartFormatYLabelsStory: Story = {
  name: 'Chart format yAxis labels',
  tags: ['pattern'],
  args: {
    variant: 'bar',
    query: connectedParams,
    chartConfigProps: (config) => ({
      ...config,
      options: {
        ...config.options,
        scales: {
          ...config.options?.scales,
          y: {
            ...config.options?.scales?.y,
            ticks: {
              ...config.options?.scales?.y?.ticks,
              // Format the yAxis labels as currency
              callback: (dataLabel) => `$${dataLabel.toLocaleString()}`
            }
          }
        }
      }
    })
  },
  render: (args) => <TimeSeries {...args} />
}

export const StaticStory: Story = {
  name: 'Static',
  parameters: { imports: 'TimeSeries' },
  args: {
    variant: 'line',
    card: true,
    ...dataset
  },
  render: (args) => <TimeSeries {...args} />
}

export const ErrorStory: Story = {
  name: 'Error',
  tags: ['pattern'],
  parameters: { imports: 'TimeSeries' },
  args: {
    errorFallbackProps: {
      error: {
        title: 'Unable to connect',
        body: 'Sorry we are not able to connect at this time due to a technical error.'
      }
    }
  },
  render: (args) => <TimeSeries {...args} />
}
