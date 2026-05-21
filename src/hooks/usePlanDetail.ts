import { useQuery } from '@tanstack/react-query'
import { plansAPI } from '../services/api'

export function usePlanDetail(id: string | undefined) {
  return useQuery({
    queryKey: ['plan', id],
    queryFn: () => {
      if (!id) return Promise.reject(new Error('No plan ID specified'))
      return plansAPI.getPlan(id)
    },
    enabled: !!id,
  })
}
