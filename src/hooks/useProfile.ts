import { useQuery } from '@tanstack/react-query'
import { profileAPI } from '../services/api'
import { useProfileStore } from '../stores/profileStore'
import { useEffect } from 'react'

export function useProfile() {
  const setProfile = useProfileStore((state) => state.setProfile)

  const query = useQuery({
    queryKey: ['profile'],
    queryFn: profileAPI.getProfile,
    staleTime: 5 * 60 * 1000,
    retry: false, // Don't spam if user hasn't completed intake yet
  })

  useEffect(() => {
    if (query.data) {
      setProfile({
        name: query.data.name,
        age: query.data.age,
        gender: query.data.gender,
        city: query.data.city,
        state: query.data.state,
        maritalStatus: query.data.maritalStatus,
        dependants: query.data.dependants,
        incomeBracket: query.data.incomeBracket,
        existingCoverage: query.data.existingCoverage,
        monthlyBudget: query.data.monthlyBudget,
        height: query.data.height,
        weight: query.data.weight,
        bmi: query.data.bmi,
        smoking: query.data.smoking,
        alcohol: query.data.alcohol,
        chronicConditions: query.data.chronicConditions,
        familyHistory: query.data.familyHistory,
        pastSurgeries: query.data.pastSurgeries,
        riskScore: query.data.riskScore,
        riskTier: query.data.riskTier,
        riskFactors: query.data.riskFactors,
        extractedValues: query.data.extractedValues,
      })
    }
  }, [query.data, setProfile])

  return query
}
