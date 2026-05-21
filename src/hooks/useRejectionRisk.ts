import { useQuery } from '@tanstack/react-query'
import { recommendationsAPI } from '../services/api'

export function useRejectionRisk(planId: string | undefined) {
  return useQuery({
    queryKey: ['recommendations'],
    queryFn: recommendationsAPI.getRecommendations,
    select: (data) => {
      if (!planId || !data || !data.recommendations) return null
      const planReco = data.recommendations.find((r: any) => r.id === planId)
      return planReco ? planReco.rejectionRisk : null
    },
    enabled: !!planId,
  })
}
