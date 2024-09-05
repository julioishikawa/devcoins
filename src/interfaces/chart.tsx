interface ChartData {
  date: string
  value: number
  minValue: number
}

interface BarChartData {
  date: string
  value: number
  minValue: number
}

interface BarChartComponentProps {
  data: BarChartData[]
  config: Record<string, { color: string }>
  selectedCoin: string
}

interface DailyLineChartComponentProps {
  data: DailyData[]
  config: Record<string, { color: string }>
  selectedCoin: string
}

interface HourlyLineChartComponentProps {
  data: HourlyData[]
  config: Record<string, { color: string }>
  selectedCoin: string
}
