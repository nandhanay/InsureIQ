import { useMutation } from '@tanstack/react-query'
import { forecastAPI } from '../services/api'

interface SimulateParams {
  income: string
  new_condition: string
  coverage_increase: number
}

export function useSimulate() {
  return useMutation({
    mutationFn: (params: SimulateParams) => forecastAPI.simulate(params),
  })
}
