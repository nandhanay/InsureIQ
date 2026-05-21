import { useQuery } from '@tanstack/react-query'
import { forecastAPI } from '../services/api'

export function useForecast() {
  return useQuery({
    queryKey: ['forecasts'],
    queryFn: forecastAPI.getForecasts,
  })
}
