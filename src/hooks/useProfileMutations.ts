import { useMutation, useQueryClient } from '@tanstack/react-query'
import { profileAPI } from '../services/api'
import { useProfileStore } from '../stores/profileStore'

export function useProfileMutations() {
  const queryClient = useQueryClient()
  const setProfile = useProfileStore((state) => state.setProfile)

  const createMutation = useMutation({
    mutationFn: (data: Record<string, unknown>) => profileAPI.createProfile(data),
    onSuccess: (data) => {
      setProfile({
        name: data.full_name,
        age: data.age,
        gender: data.gender,
        city: data.city,
        state: data.state,
        maritalStatus: data.maritalStatus,
        dependants: data.dependants,
        incomeBracket: data.incomeBracket,
        existingCoverage: data.existingCoverage,
        monthlyBudget: data.monthlyBudget,
        height: data.height,
        weight: data.weight,
        bmi: data.bmi,
        smoking: data.smoking_status,
        alcohol: data.alcohol_consumption,
        chronicConditions: data.chronicConditions,
        familyHistory: data.familyHistory,
        pastSurgeries: data.pastSurgeries,
        riskScore: data.riskScore,
        riskTier: data.riskTier,
        riskFactors: data.riskFactors,
        extractedValues: data.extractedValues,
      })
      queryClient.invalidateQueries({ queryKey: ['profile'] })
      queryClient.invalidateQueries({ queryKey: ['recommendations'] })
      queryClient.invalidateQueries({ queryKey: ['forecasts'] })
    },
  })

  const updateMutation = useMutation({
    mutationFn: (data: Record<string, unknown>) => profileAPI.updateProfile(data),
    onSuccess: (data) => {
      setProfile({
        name: data.full_name,
        age: data.age,
        gender: data.gender,
        city: data.city,
        state: data.state,
        maritalStatus: data.maritalStatus,
        dependants: data.dependants,
        incomeBracket: data.incomeBracket,
        existingCoverage: data.existingCoverage,
        monthlyBudget: data.monthlyBudget,
        height: data.height,
        weight: data.weight,
        bmi: data.bmi,
        smoking: data.smoking_status,
        alcohol: data.alcohol_consumption,
        chronicConditions: data.chronicConditions,
        familyHistory: data.familyHistory,
        pastSurgeries: data.pastSurgeries,
        riskScore: data.riskScore,
        riskTier: data.riskTier,
        riskFactors: data.riskFactors,
        extractedValues: data.extractedValues,
      })
      queryClient.invalidateQueries({ queryKey: ['profile'] })
      queryClient.invalidateQueries({ queryKey: ['recommendations'] })
      queryClient.invalidateQueries({ queryKey: ['forecasts'] })
    },
  })

  return {
    createProfile: createMutation,
    updateProfile: updateMutation,
  }
}
