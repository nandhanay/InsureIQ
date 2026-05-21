import { create } from 'zustand'
import { PlanCardData } from '../components/ui/PlanCard'

interface RecoState {
  recommendations: PlanCardData[]
  riskScore: number
  riskTier: string
  riskFactors: { label: string; value: number }[]
  isLoaded: boolean
  setRecommendations: (data: {
    recommendations: PlanCardData[]
    riskScore: number
    riskTier: string
    riskFactors: { label: string; value: number }[]
  }) => void
  clearRecommendations: () => void
}

export const useRecoStore = create<RecoState>((set) => ({
  recommendations: [],
  riskScore: 0,
  riskTier: 'Low',
  riskFactors: [],
  isLoaded: false,
  setRecommendations: (data) =>
    set({
      recommendations: data.recommendations,
      riskScore: data.riskScore,
      riskTier: data.riskTier,
      riskFactors: data.riskFactors,
      isLoaded: true,
    }),
  clearRecommendations: () =>
    set({ recommendations: [], riskScore: 0, riskTier: 'Low', riskFactors: [], isLoaded: false }),
}))
