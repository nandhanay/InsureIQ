export interface UserProfile {
  id: string
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
  pastSurgeries: string[]
  riskScore: number
  riskTier: 'Low' | 'Moderate' | 'High'
}

// Demo User 1: Pre-diabetic, high-risk profile
export const demoUser1: UserProfile = {
  id: 'user-001',
  name: 'Rajesh Kumar',
  age: 47,
  gender: 'Male',
  city: 'Mumbai',
  state: 'Maharashtra',
  maritalStatus: 'Married',
  dependants: 3,
  incomeBracket: '₹10-20 Lakh',
  existingCoverage: 'None',
  monthlyBudget: 1500,
  height: 170,
  weight: 92,
  bmi: 31.8,
  smoking: false,
  alcohol: true,
  chronicConditions: ['Pre-diabetes', 'Hypertension', 'High cholesterol'],
  familyHistory: ['Father: Type 2 Diabetes', 'Mother: Hypertension'],
  pastSurgeries: ['Appendectomy (2018)'],
  riskScore: 73,
  riskTier: 'High',
}

// Demo User 2: Healthy, low-risk profile
export const demoUser2: UserProfile = {
  id: 'user-002',
  name: 'Priya Sharma',
  age: 28,
  gender: 'Female',
  city: 'Bangalore',
  state: 'Karnataka',
  maritalStatus: 'Single',
  dependants: 0,
  incomeBracket: '₹5-10 Lakh',
  existingCoverage: 'Employer (₹3 Lakh)',
  monthlyBudget: 800,
  height: 162,
  weight: 55,
  bmi: 20.9,
  smoking: false,
  alcohol: false,
  chronicConditions: [],
  familyHistory: [],
  pastSurgeries: [],
  riskScore: 18,
  riskTier: 'Low',
}

export const currentUser = demoUser1
