import React from 'react'
import { PieChart } from '@propeldata/ui-kit'

import { useFakeData } from 'hooks/useFakeData'

const mockData1 = {
  headers: ['Instagram', 'value'],
  rows: [
    ['Likes', '9'],
    ['Follow', '1'],
    ['Test', '4'],
    ['Other', '7']
  ]
}

const mockData2 = {
  headers: ['Instagram', 'value'],
  rows: [
    ['Likes', '43'],
    ['Follow', '21'],
    ['Test', '125'],
    ['Other', '68']
  ]
}

export function PieChartStaticTest() {
  const [mockData, setMockData] = React.useState(mockData1)
  const [barsColor, setBarsColor] = React.useState('#ccc')
  const [chartType, setChartType] = React.useState('pie')

  const { data, isLoading, setIsLoading } = useFakeData(mockData)

  const handleReFetchMock = () => {
    setIsLoading(true)
    setTimeout(() => {
      setMockData(mockData2)
      setIsLoading(false)
    }, 2000)
  }

  return (
    <div className="m-6">
      <h2 className="text-2xl">PieChart Static</h2>
      <div className="my-5">
        <PieChart
          card
          headers={data?.headers}
          rows={data?.rows}
          variant={chartType}
          loading={isLoading}
          styles={{
            bar: { backgroundColor: barsColor },
            table: { height: '200px', backgroundColor: '#f5f5f5', header: { backgroundColor: '#f5f5f5' } },
            canvas: { backgroundColor: '#f5f5f5' }
          }}
        />
      </div>
      <div className="flex items-center gap-2 mt-1">
        <button
          className="border-2 p-1 h-9"
          onClick={() => setMockData(mockData === mockData1 ? mockData2 : mockData1)}
        >
          Switch mock data
        </button>
        <select className="border-2 p-1 h-9" value={chartType} onChange={(event) => setChartType(event.target.value)}>
          <option value="pie">Pie</option>
          <option value="doughnut">Doughnut</option>
        </select>
        <button className="border-2 p-1 h-9" onClick={handleReFetchMock}>
          Refetch Mock
        </button>
      </div>
    </div>
  )
}
