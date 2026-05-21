import { useQuery } from '@tanstack/react-query'
import { recommendationsAPI } from '../services/api'
import { useRecoStore } from '../stores/recoStore'
import { useEffect } from 'react'

export function useRecommendations() {
  const setRecommendations = useRecoStore((state) => state.setRecommendations)

  const query = useQuery({
    queryKey: ['recommendations'],
    queryFn: recommendationsAPI.getRecommendations,
    staleTime: 5 * 60 * 1000, // 5 minutes stale time
  })

  useEffect(() => {
    if (query.data) {
      setRecommendations({
        recommendations: query.data.recommendations,
        riskScore: query.data.riskScore,
        riskTier: query.data.riskTier,
        riskFactors: query.data.riskFactors,
      })
    }
  }, [query.data, setRecommendations])

  return query
}
