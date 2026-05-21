import { useMutation, useQueryClient } from '@tanstack/react-query'
import { profileAPI } from '../services/api'
import { useProfileStore } from '../stores/profileStore'

export function useIntakeSubmit() {
  const queryClient = useQueryClient()
  const setProfile = useProfileStore((state) => state.setProfile)

  return useMutation({
    mutationFn: (data: Record<string, unknown>) => profileAPI.submitIntake(data),
    onSuccess: (data) => {
      // Save profile variables to store
      setProfile({
        riskScore: data.risk_score,
        riskTier: data.risk_tier,
        riskFactors: data.risk_factors,
      })
      // Invalidate recommendations & forecasts queries
      queryClient.invalidateQueries({ queryKey: ['recommendations'] })
      queryClient.invalidateQueries({ queryKey: ['forecasts'] })
      queryClient.invalidateQueries({ queryKey: ['profile'] })
    },
  })
}
