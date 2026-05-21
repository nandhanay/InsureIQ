import { create } from 'zustand'

interface RiskFactor {
  label: string
  value: number
}

interface ProfileState {
  name: string
  age: number
  gender: string
  city: string
  state: string
  maritalStatus: string
  dependants: number
  incomeBracket: string
  existingCoverage: string
  monthlyBudget: number
  height: number
  weight: number
  bmi: number
  smoking: boolean
  alcohol: boolean
  chronicConditions: string[]
  familyHistory: string[]
  pastSurgeries: string
  riskScore: number
  riskTier: 'Low' | 'Moderate' | 'High'
  riskFactors: RiskFactor[]
  extractedValues: Record<string, { value: string; confidence: number; status: string }>
  hasProfile: boolean
  setProfile: (data: Partial<ProfileState>) => void
  clearProfile: () => void
}

const defaultState = {
  name: '',
  age: 0,
  gender: '',
  city: '',
  state: '',
  maritalStatus: '',
  dependants: 0,
  incomeBracket: '',
  existingCoverage: '',
  monthlyBudget: 1500,
  height: 0,
  weight: 0,
  bmi: 0,
  smoking: false,
  alcohol: false,
  chronicConditions: [] as string[],
  familyHistory: [] as string[],
  pastSurgeries: '',
  riskScore: 0,
  riskTier: 'Low' as const,
  riskFactors: [] as RiskFactor[],
  extractedValues: {},
  hasProfile: false,
}

export const useProfileStore = create<ProfileState>((set) => ({
  ...defaultState,
  setProfile: (data) => set((state) => ({ ...state, ...data, hasProfile: true })),
  clearProfile: () => set(defaultState),
}))
