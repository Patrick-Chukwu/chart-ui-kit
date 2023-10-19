import { render, waitFor } from '@testing-library/react'
import { Chart } from 'chart.js'
import { rest } from 'msw'
import React from 'react'
import { RelativeTimeRange } from '../../helpers'
import { Dom, mockLeaderboardQuery, setupTestHandlers } from '../../testing'
import { Leaderboard } from './Leaderboard'

const mockData = {
  headers: ['header-1', 'header-2', 'header-3'],
  rows: [
    ['dim-1', 'dim-2', '30'],
    ['dim1', 'dim-2', '60'],
    ['dim-1', 'dim-2', '90']
  ]
}

const handlers = [
  mockLeaderboardQuery((req, res, ctx) => {
    const { metricName } = req.variables.leaderboardInput

    if (metricName === 'should-fail') {
      return res(
        ctx.errors([
          {
            message: 'Something went wrong'
          }
        ])
      )
    }

    return res(
      ctx.data({
        leaderboard: mockData
      })
    )
  }),

  rest.post('https://api.us-east-2.propeldata.com/graphql', async (req, res, ctx) => {
    const body = await req.json()
    const variables = body.variables
    const { metricName } = variables.leaderboardInput

    if (metricName === 'should-fail') {
      return res(
        ctx.status(500),
        ctx.json([
          {
            message: 'Something went wrong'
          }
        ])
      )
    }

    return res(
      ctx.json({
        leaderboard: mockData
      })
    )
  })
]

describe('Leaderboard', () => {
  let dom: Dom

  beforeEach(() => {
    setupTestHandlers(handlers)
  })

  it('should render the leaderboard with static data', () => {
    dom = render(<Leaderboard headers={mockData.headers} rows={mockData.rows} />)

    const chartElement = dom.getByRole('img') as HTMLCanvasElement
    const chartInstance = Chart.getChart(chartElement)

    const chartData = chartInstance?.data.datasets[0].data
    const chartLabels = chartInstance?.data.labels

    const resultingRows = mockData.rows.map((row) => parseInt(row[row.length - 1]))
    const resultingLabels = mockData.rows.map((row) => row[0])

    expect(chartData).toEqual(resultingRows)
    expect(chartLabels).toEqual(resultingLabels)
  })

  it('should render the leaderboard with server data', async () => {
    dom = render(
      <Leaderboard
        query={{
          accessToken: 'test-token',
          metric: 'test-metric',
          dimensions: [
            {
              columnName: 'test-column'
            }
          ],
          rowLimit: 10,
          timeRange: {
            relative: RelativeTimeRange.LastNDays,
            n: 30
          }
        }}
      />
    )

    const chartElement = (await dom.findByRole('img')) as HTMLCanvasElement
    const chartInstance = Chart.getChart(chartElement)

    const chartData = chartInstance?.data.datasets[0].data
    const chartLabels = chartInstance?.data.labels

    const resultingRows = mockData.rows.map((row) => parseInt(row[row.length - 1]))
    const resultingLabels = mockData.rows.map((row) => row[0])

    expect(chartData).toEqual(resultingRows)
    expect(chartLabels).toEqual(resultingLabels)
  })

  it('should show error fallback when query fails', async () => {
    console.error = jest.fn()
    dom = render(
      <Leaderboard
        query={{
          accessToken: 'test-token',
          metric: 'should-fail',
          dimensions: [
            {
              columnName: 'test-column'
            }
          ],
          rowLimit: 10,
          timeRange: {
            relative: RelativeTimeRange.LastNDays,
            n: 30
          },
          retry: false
        }}
      />
    )

    await dom.findByText('Unable to connect')

    await dom.findByText('Sorry we are not able to connect at this time due to a technical error.')

    expect(console.error).toHaveBeenCalled()
  })

  it('should show error fallback on props mismatch', async () => {
    dom = render(<Leaderboard headers={['a', 'b', 'c']} />)

    await waitFor(async () => {
      await dom.findByText('Unable to connect')

      // TODO: this message suggests that the error is due to a network issue when it's not, maybe we should think about changing the message depending on the error
      await dom.findByText('Sorry we are not able to connect at this time due to a technical error.')
    })
  })

  it('should render static data with custom labelFormatter', () => {
    dom = render(
      <Leaderboard
        headers={mockData.headers}
        rows={mockData.rows}
        labelFormatter={(labels) => labels.map((label) => label.replace('-', '.'))}
      />
    )

    const chartElement = dom.getByRole('img') as HTMLCanvasElement
    const chartInstance = Chart.getChart(chartElement)

    const chartLabels = chartInstance?.data.labels
    const resultingLabels = mockData.rows.map((row) => row[0])

    expect(chartLabels).toEqual(resultingLabels.map((label) => label.replace('-', '.')))
  })
})
