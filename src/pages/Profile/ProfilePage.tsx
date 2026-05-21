import React, { useState, useEffect } from 'react'
import { Activity, Shield, User, Heart, AlertCircle, CheckCircle2, RefreshCw, Upload, Trash2, Edit3, ChevronDown, ChevronUp, FileText } from 'lucide-react'
import GlassCard from '../../components/ui/GlassCard'
import InputField from '../../components/ui/InputField'
import PrimaryButton from '../../components/ui/PrimaryButton'
import RiskMeter from '../../components/ui/RiskMeter'
import SHAPBar from '../../components/ui/SHAPBar'
import { useProfile } from '../../hooks/useProfile'
import { useProfileMutations } from '../../hooks/useProfileMutations'
import { useDocuments } from '../../hooks/useDocuments'

const CHRONIC_OPTIONS = [
  'Type 2 Diabetes',
  'Hypertension (BP)',
  'High Cholesterol',
  'Asthma / COPD',
  'Thyroid Disorder',
  'Heart Disease',
  'Chronic Kidney Disease',
]

const FAMILY_OPTIONS = [
  'Diabetes',
  'Hypertension',
  'Heart Disease',
  'Cancer',
  'Stroke',
]

const GENDER_OPTIONS = ['Male', 'Female', 'Other']

const MARITAL_OPTIONS = ['Single', 'Married', 'Divorced', 'Widowed']

const INCOME_OPTIONS = [
  { value: 'below-3', label: 'Below ₹3 Lakh' },
  { value: '3-5', label: '₹3 — ₹5 Lakh' },
  { value: '5-10', label: '₹5 — ₹10 Lakh' },
  { value: '10-20', label: '₹10 — ₹20 Lakh' },
  { value: '20-50', label: '₹20 — ₹50 Lakh' },
  { value: 'above-50', label: 'Above ₹50 Lakh' },
]

const COVERAGE_OPTIONS = ['None', 'Basic', 'Premium']

const STATUS_COLOR: Record<string, string> = {
  normal: 'text-emerald-400',
  elevated: 'text-amber-400',
  high: 'text-red-400',
  low: 'text-amber-400',
}

const METRIC_LABEL_MAP: Record<string, string> = {
  hba1c: 'HbA1c',
  glucose: 'Glucose',
  bloodPressure: 'Blood Pressure',
  cholesterol: 'Cholesterol',
  hdl: 'HDL',
  ldl: 'LDL',
  creatinine: 'Creatinine',
  haemoglobin: 'Haemoglobin',
}

export default function ProfilePage() {
  const { data: profile, isLoading, isError, refetch } = useProfile()
  const { updateProfile } = useProfileMutations()

  // Document Manager state
  const { documents, uploadDocument, deleteDocument, replaceDocument } = useDocuments()
  const [isDocDragging, setIsDocDragging] = useState(false)
  const [expandedDocId, setExpandedDocId] = useState<number | null>(null)
  const [replacingId, setReplacingId] = useState<number | null>(null)
  const [deletingId, setDeletingId] = useState<number | null>(null)

  // Form Fields State
  const [fullName, setFullName] = useState('')
  const [age, setAge] = useState('')
  const [gender, setGender] = useState('')
  const [height, setHeight] = useState('')
  const [weight, setWeight] = useState('')
  const [smoking, setSmoking] = useState(false)
  const [alcohol, setAlcohol] = useState(false)
  const [chronicConditions, setChronicConditions] = useState<string[]>([])
  const [familyHistory, setFamilyHistory] = useState<string[]>([])
  
  // Supplementary fields
  const [city, setCity] = useState('')
  const [state, setState] = useState('')
  const [maritalStatus, setMaritalStatus] = useState('')
  const [dependants, setDependants] = useState('')
  const [incomeBracket, setIncomeBracket] = useState('')
  const [existingCoverage, setExistingCoverage] = useState('')
  const [monthlyBudget, setMonthlyBudget] = useState('')
  const [pastSurgeries, setPastSurgeries] = useState('')

  // Notifications
  const [successMsg, setSuccessMsg] = useState('')
  const [errorMsg, setErrorMsg] = useState('')

  // Live BMI calculation
  const [bmi, setBmi] = useState<number>(0)
  const [bmiCategory, setBmiCategory] = useState({ label: 'Normal', color: 'text-emerald-400' })

  const [isInitialized, setIsInitialized] = useState(false)

  // Initialize form fields when profile is loaded
  useEffect(() => {
    if (profile && !isInitialized) {
      setFullName(profile.name || profile.fullName || '')
      setAge(profile.age?.toString() || '')
      setGender(profile.gender || '')
      setHeight(profile.height?.toString() || '')
      setWeight(profile.weight?.toString() || '')
      setSmoking(!!(profile.smoking || profile.smoking_status))
      setAlcohol(!!(profile.alcohol || profile.alcohol_consumption))
      setChronicConditions(profile.chronicConditions || profile.chronic_conditions || [])
      setFamilyHistory(profile.familyHistory || profile.family_history || [])
      setCity(profile.city || '')
      setState(profile.state || '')
      setMaritalStatus(profile.maritalStatus || profile.marital_status || '')
      setDependants(profile.dependants?.toString() || '0')
      setIncomeBracket(profile.incomeBracket || profile.income_bracket || '')
      setExistingCoverage(profile.existingCoverage || profile.existing_coverage || '')
      setMonthlyBudget(profile.monthlyBudget?.toString() || '1500')
      setPastSurgeries(profile.pastSurgeries || profile.past_surgeries || '')
      setIsInitialized(true)
    }
  }, [profile, isInitialized])

  // BMI effect
  useEffect(() => {
    const h = parseFloat(height)
    const w = parseFloat(weight)
    if (h > 0 && w > 0) {
      const calculatedBmi = w / ((h / 100) * (h / 100))
      setBmi(parseFloat(calculatedBmi.toFixed(1)))
      
      if (calculatedBmi < 18.5) {
        setBmiCategory({ label: 'Underweight', color: 'text-blue-400' })
      } else if (calculatedBmi >= 18.5 && calculatedBmi < 25) {
        setBmiCategory({ label: 'Normal Weight', color: 'text-emerald-400' })
      } else if (calculatedBmi >= 25 && calculatedBmi < 30) {
        setBmiCategory({ label: 'Overweight', color: 'text-amber-400' })
      } else {
        setBmiCategory({ label: 'Obese', color: 'text-red-400' })
      }
    } else {
      setBmi(0)
    }
  }, [height, weight])

  const toggleChronic = (cond: string) => {
    if (chronicConditions.includes(cond)) {
      setChronicConditions(chronicConditions.filter(c => c !== cond))
    } else {
      setChronicConditions([...chronicConditions, cond])
    }
  }

  const toggleFamily = (cond: string) => {
    if (familyHistory.includes(cond)) {
      setFamilyHistory(familyHistory.filter(f => f !== cond))
    } else {
      setFamilyHistory([...familyHistory, cond])
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSuccessMsg('')
    setErrorMsg('')

    if (!fullName.trim() || !age || !gender || !height || !weight) {
      setErrorMsg('Please fill out all required fields with valid details.')
      return
    }

    const payload = {
      full_name: fullName,
      age: parseInt(age, 10),
      gender,
      height: parseFloat(height),
      weight: parseFloat(weight),
      smoking_status: smoking,
      alcohol_consumption: alcohol,
      chronic_conditions: chronicConditions,
      family_history: familyHistory,
      city: city || 'Bangalore',
      state: state || 'Karnataka',
      marital_status: maritalStatus || 'Single',
      dependants: parseInt(dependants, 10) || 0,
      income_bracket: incomeBracket || 'below-3',
      existing_coverage: existingCoverage || 'None',
      monthly_budget: parseFloat(monthlyBudget) || 1500.0,
      past_surgeries: pastSurgeries || '',
    }

    try {
      await updateProfile.mutateAsync(payload)
      setSuccessMsg('Profile saved successfully. Risk scoring and premium factors recalculated!')
      setIsInitialized(false)
      window.scrollTo({ top: 0, behavior: 'smooth' })
      // Auto clear alert after 5s
      setTimeout(() => setSuccessMsg(''), 5000)
    } catch (err: any) {
      setErrorMsg(err.response?.data?.detail || 'Failed to update profile. Please try again.')
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handleReset = () => {
    if (profile) {
      setFullName(profile.name || profile.fullName || '')
      setAge(profile.age?.toString() || '')
      setGender(profile.gender || '')
      setHeight(profile.height?.toString() || '')
      setWeight(profile.weight?.toString() || '')
      setSmoking(!!(profile.smoking || profile.smoking_status))
      setAlcohol(!!(profile.alcohol || profile.alcohol_consumption))
      setChronicConditions(profile.chronicConditions || profile.chronic_conditions || [])
      setFamilyHistory(profile.familyHistory || profile.family_history || [])
      setCity(profile.city || '')
      setState(profile.state || '')
      setMaritalStatus(profile.maritalStatus || profile.marital_status || '')
      setDependants(profile.dependants?.toString() || '0')
      setIncomeBracket(profile.incomeBracket || profile.income_bracket || '')
      setExistingCoverage(profile.existingCoverage || profile.existing_coverage || '')
      setMonthlyBudget(profile.monthlyBudget?.toString() || '1500')
      setPastSurgeries(profile.pastSurgeries || profile.past_surgeries || '')
      setErrorMsg('')
      setSuccessMsg('')
    }
  }

  const handleUploadDoc = async (file: File) => {
    setSuccessMsg('')
    setErrorMsg('')
    try {
      await uploadDocument.mutateAsync(file)
      setSuccessMsg(`Successfully uploaded and analyzed ${file.name}. Profile risk score updated!`)
      refetch()
      setTimeout(() => setSuccessMsg(''), 5000)
    } catch (err: any) {
      setErrorMsg(err.response?.data?.detail || 'Failed to upload medical report.')
    }
  }

  const handleDeleteDoc = async (id: number) => {
    setSuccessMsg('')
    setErrorMsg('')
    setDeletingId(id)
    try {
      await deleteDocument.mutateAsync(id)
      setSuccessMsg('Successfully deleted medical report. Profile risk score updated!')
      refetch()
      setTimeout(() => setSuccessMsg(''), 5000)
    } catch (err: any) {
      setErrorMsg(err.response?.data?.detail || 'Failed to delete medical report.')
    } finally {
      setDeletingId(null)
    }
  }

  const handleReplaceClick = (id: number) => {
    setReplacingId(id)
    setTimeout(() => {
      document.getElementById('replace-upload-input')?.click()
    }, 50)
  }

  const handleReplaceDoc = async (id: number, file: File) => {
    setSuccessMsg('')
    setErrorMsg('')
    try {
      await replaceDocument.mutateAsync({ id, file })
      setSuccessMsg(`Successfully replaced report with ${file.name}. Profile risk score updated!`)
      refetch()
      setTimeout(() => setSuccessMsg(''), 5000)
    } catch (err: any) {
      setErrorMsg(err.response?.data?.detail || 'Failed to replace medical report.')
    } finally {
      setReplacingId(null)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 rounded-full border-2 border-white/10 border-t-white animate-spin" />
        <p className="text-[14px] text-white/40 animate-pulse">Loading profile data...</p>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center">
        <GlassCard className="p-8 max-w-[400px] flex flex-col items-center gap-4">
          <AlertCircle className="w-12 h-12 text-red-400" />
          <h2 className="text-[18px] font-medium text-white">Failed to Load Profile</h2>
          <p className="text-[13px] text-white/40">
            We couldn't connect to the server to fetch your profile settings.
          </p>
          <button
            onClick={() => refetch()}
            className="flex items-center gap-2 px-4 py-2.5 rounded-[12px] bg-white/[0.08] text-white text-[13px] hover:bg-white/[0.12] transition-all"
          >
            <RefreshCw className="w-4 h-4" />
            Retry
          </button>
        </GlassCard>
      </div>
    )
  }

  const riskScore = profile?.riskScore ?? profile?.risk_score ?? 0
  const riskTier = profile?.riskTier ?? profile?.risk_tier ?? 'Low'
  const riskFactors = profile?.riskFactors ?? profile?.risk_factors ?? []

  return (
    <div className="min-h-screen p-6 lg:p-8 text-white relative">
      {/* Background Mesh Glows */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[10%] right-[5%] w-[40%] h-[40%] rounded-full bg-emerald-500/5 blur-[120px]" />
        <div className="absolute bottom-[10%] left-[5%] w-[40%] h-[40%] rounded-full bg-blue-500/5 blur-[120px]" />
      </div>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-[26px] font-medium text-white">Profile Settings</h1>
        <p className="text-[14px] text-white/40 mt-1">
          Manage your personal demographics, health metrics, habits, and risk evaluation variables.
        </p>
      </div>

      {/* Success and Error Banners */}
      {successMsg && (
        <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-start gap-3 animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-[14px] text-emerald-300 font-semibold">Success</p>
            <p className="text-[13px] text-emerald-400/80 mt-0.5">{successMsg}</p>
          </div>
        </div>
      )}

      {errorMsg && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-start gap-3 animate-fade-in">
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-[14px] text-red-300 font-semibold">Error</p>
            <p className="text-[13px] text-red-400/80 mt-0.5">{errorMsg}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left/Center Columns: Edit Profile Form */}
        <div className="lg:col-span-2 space-y-6">
          <form onSubmit={handleSave} className="space-y-6">
            
            {/* Section 1: Demographics */}
            <GlassCard className="p-6 space-y-5">
              <div className="flex items-center gap-2 text-white/80 border-b border-white/[0.04] pb-3 mb-2">
                <User className="w-4.5 h-4.5 text-emerald-400" />
                <h3 className="text-[15px] font-semibold">1. Demographic Profile</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                  label="Full Name"
                  value={fullName}
                  onChange={setFullName}
                  placeholder="Sarah Jenkins"
                  id="profile-fullname"
                  required
                />
                <InputField
                  label="Age"
                  type="number"
                  value={age}
                  onChange={setAge}
                  placeholder="35"
                  id="profile-age"
                  min="1"
                  max="120"
                  required
                />
              </div>

              {/* Gender selector */}
              <div className="flex flex-col gap-2">
                <label className="text-[13px] text-white/60 font-medium">Gender</label>
                <div className="grid grid-cols-3 gap-3">
                  {GENDER_OPTIONS.map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setGender(g)}
                      className={`py-2.5 rounded-xl border text-[13px] font-medium transition-all ${
                        gender === g
                          ? 'bg-emerald-500/10 border-emerald-500 text-emerald-300 shadow-[0_0_15px_rgba(52,211,153,0.1)]'
                          : 'bg-white/[0.02] border-white/[0.08] text-white/60 hover:border-white/20'
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              {/* Location details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                  label="City"
                  value={city}
                  onChange={setCity}
                  placeholder="Bangalore"
                  id="profile-city"
                />
                <InputField
                  label="State"
                  value={state}
                  onChange={setState}
                  placeholder="Karnataka"
                  id="profile-state"
                />
              </div>

              {/* Personal Status Info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[13px] text-white/60 font-medium">Marital Status</label>
                  <select
                    value={maritalStatus}
                    onChange={(e) => setMaritalStatus(e.target.value)}
                    className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-3 text-[13px] text-white outline-none focus:border-white/30 transition-all"
                  >
                    {MARITAL_OPTIONS.map((opt) => (
                      <option key={opt} value={opt} className="bg-neutral-900 text-white">
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>

                <InputField
                  label="Dependents Count"
                  type="number"
                  value={dependants}
                  onChange={setDependants}
                  placeholder="0"
                  id="profile-dependents"
                  min="0"
                />

                <div className="flex flex-col gap-1.5">
                  <label className="text-[13px] text-white/60 font-medium">Income Bracket</label>
                  <select
                    value={incomeBracket}
                    onChange={(e) => setIncomeBracket(e.target.value)}
                    className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-3 text-[13px] text-white outline-none focus:border-white/30 transition-all"
                  >
                    {INCOME_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value} className="bg-neutral-900 text-white">
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Insurance variables */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[13px] text-white/60 font-medium">Existing Coverage</label>
                  <select
                    value={existingCoverage}
                    onChange={(e) => setExistingCoverage(e.target.value)}
                    className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-3 text-[13px] text-white outline-none focus:border-white/30 transition-all"
                  >
                    {COVERAGE_OPTIONS.map((opt) => (
                      <option key={opt} value={opt} className="bg-neutral-900 text-white">
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>

                <InputField
                  label="Monthly Premium Budget (INR)"
                  type="number"
                  value={monthlyBudget}
                  onChange={setMonthlyBudget}
                  placeholder="1500"
                  id="profile-budget"
                  min="0"
                />
              </div>
            </GlassCard>

            {/* Section 2: Body Vitals */}
            <GlassCard className="p-6 space-y-5">
              <div className="flex items-center gap-2 text-white/80 border-b border-white/[0.04] pb-3 mb-2">
                <Activity className="w-4.5 h-4.5 text-blue-400" />
                <h3 className="text-[15px] font-semibold">2. Physical Vitals</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                  label="Height (cm)"
                  type="number"
                  value={height}
                  onChange={setHeight}
                  placeholder="170"
                  id="profile-height"
                  required
                />
                <InputField
                  label="Weight (kg)"
                  type="number"
                  value={weight}
                  onChange={setWeight}
                  placeholder="70"
                  id="profile-weight"
                  required
                />
              </div>

              {/* Real-time BMI Display */}
              {bmi > 0 && (
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-between">
                  <div>
                    <span className="text-[12px] text-white/40 block font-mono">CALCULATED BMI</span>
                    <span className="text-[26px] font-mono font-bold text-white mt-1 block">
                      {bmi}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[12px] text-white/40 block font-mono">HEALTH RANGE</span>
                    <span className={`text-[15px] font-bold ${bmiCategory.color} mt-1 block`}>
                      {bmiCategory.label}
                    </span>
                  </div>
                </div>
              )}
            </GlassCard>

            {/* Section 3: Lifestyle & History */}
            <GlassCard className="p-6 space-y-5">
              <div className="flex items-center gap-2 text-white/80 border-b border-white/[0.04] pb-3 mb-2">
                <Heart className="w-4.5 h-4.5 text-red-400" />
                <h3 className="text-[15px] font-semibold">3. Habits & Medical History</h3>
              </div>

              {/* Toggles */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setSmoking(!smoking)}
                  className={`p-4 rounded-xl border text-left transition-all duration-200 ${
                    smoking
                      ? 'bg-amber-500/10 border-amber-500/60 text-amber-300'
                      : 'bg-white/[0.02] border-white/[0.08] text-white/60 hover:border-white/20'
                  }`}
                >
                  <span className="text-[13px] font-semibold block mb-0.5">Tobacco Smoker</span>
                  <span className="text-[11px] text-white/40 block">
                    {smoking ? 'Active smoker / tobacco user' : 'No tobacco usage'}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setAlcohol(!alcohol)}
                  className={`p-4 rounded-xl border text-left transition-all duration-200 ${
                    alcohol
                      ? 'bg-blue-500/10 border-blue-500/60 text-blue-300'
                      : 'bg-white/[0.02] border-white/[0.08] text-white/60 hover:border-white/20'
                  }`}
                >
                  <span className="text-[13px] font-semibold block mb-0.5">Consume Alcohol</span>
                  <span className="text-[11px] text-white/40 block">
                    {alcohol ? 'Regular / social drinker' : 'Rarely / do not consume'}
                  </span>
                </button>
              </div>

              {/* Chronic Conditions Selection */}
              <div className="flex flex-col gap-2">
                <label className="text-[13px] text-white/60 font-medium">Chronic Conditions</label>
                <div className="flex flex-wrap gap-2">
                  {CHRONIC_OPTIONS.map((c) => {
                    const isSelected = chronicConditions.includes(c)
                    return (
                      <button
                        key={c}
                        type="button"
                        onClick={() => toggleChronic(c)}
                        className={`px-3.5 py-2 rounded-lg border text-[12px] font-medium transition-all duration-150 ${
                          isSelected
                            ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                            : 'bg-white/[0.02] border-white/[0.06] text-white/50 hover:border-white/20'
                        }`}
                      >
                        {c}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Family Medical History */}
              <div className="flex flex-col gap-2">
                <label className="text-[13px] text-white/60 font-medium">Family Medical History</label>
                <div className="flex flex-wrap gap-2">
                  {FAMILY_OPTIONS.map((f) => {
                    const isSelected = familyHistory.includes(f)
                    return (
                      <button
                        key={f}
                        type="button"
                        onClick={() => toggleFamily(f)}
                        className={`px-3.5 py-2 rounded-lg border text-[12px] font-medium transition-all duration-150 ${
                          isSelected
                            ? 'bg-blue-500/20 border-blue-500 text-blue-300'
                            : 'bg-white/[0.02] border-white/[0.06] text-white/50 hover:border-white/20'
                        }`}
                      >
                        {f}
                      </button>
                    )
                  })}
                </div>
              </div>

              <InputField
                label="Past Surgeries / Notes"
                value={pastSurgeries}
                onChange={setPastSurgeries}
                placeholder="E.g. Appendectomy in 2018; Laser eye surgery in 2021"
                id="profile-surgeries"
              />
            </GlassCard>

            {/* Action Bar */}
            <div className="flex justify-end items-center gap-4 bg-white/[0.01] border border-white/[0.04] p-4 rounded-xl">
              <button
                type="button"
                onClick={handleReset}
                className="px-5 py-3 rounded-xl border border-white/[0.08] hover:border-white/20 hover:bg-white/[0.02] text-[13px] font-semibold transition-all duration-200"
              >
                Reset Changes
              </button>
              <PrimaryButton
                type="submit"
                disabled={updateProfile.isPending}
                className="bg-gradient-to-r from-emerald-500 to-blue-500 text-white font-semibold text-[13px] px-6 py-3 rounded-xl hover:shadow-[0_0_20px_rgba(52,211,153,0.3)] transition-all duration-200"
              >
                {updateProfile.isPending ? 'Saving...' : 'Save Changes'}
              </PrimaryButton>
            </div>

          </form>

          {/* Medical Document Manager */}
          <GlassCard className="p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-white/[0.04] pb-3 mb-2">
              <div className="flex items-center gap-2 text-white/80">
                <FileText className="w-4.5 h-4.5 text-blue-400" />
                <h3 className="text-[15px] font-semibold">Medical Document Manager</h3>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-white/[0.06] text-white/60 text-[11px] font-mono">
                {documents.length} {documents.length === 1 ? 'document' : 'documents'}
              </span>
            </div>

            {/* Dropzone */}
            <div
              onDragOver={(e) => { e.preventDefault(); setIsDocDragging(true); }}
              onDragLeave={() => setIsDocDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDocDragging(false);
                const file = e.dataTransfer.files[0];
                if (file) handleUploadDoc(file);
              }}
              onClick={() => document.getElementById('doc-upload-input')?.click()}
              className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all duration-200 ${
                isDocDragging ? 'border-emerald-500/40 bg-emerald-500/[0.02]' : 'border-white/10 hover:border-white/20 hover:bg-white/[0.01]'
              }`}
            >
              <Upload className={`w-8 h-8 ${uploadDocument.isPending ? 'animate-bounce text-emerald-400' : 'text-white/20'}`} strokeWidth={1.5} />
              <div className="text-center">
                <p className="text-[13px] text-white/60">
                  {uploadDocument.isPending ? 'Processing with Gemini...' : 'Drag & drop new medical reports here, or click to browse'}
                </p>
                <p className="text-[11px] text-white/30 mt-0.5">PDF, JPG, or PNG (Max 10MB)</p>
              </div>
              <input
                id="doc-upload-input"
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleUploadDoc(file);
                }}
                className="hidden"
              />
            </div>

            {/* Document List */}
            {documents.length > 0 ? (
              <div className="space-y-3">
                {documents.map((doc: any) => {
                  const isExpanded = expandedDocId === doc.id;
                  const avgConfidence = doc.confidence_score || 0;
                  return (
                    <div
                      key={doc.id}
                      className="border border-white/[0.06] rounded-xl overflow-hidden bg-white/[0.01] transition-all"
                    >
                      <div className="flex items-center justify-between p-4 hover:bg-white/[0.02] cursor-pointer" onClick={() => setExpandedDocId(isExpanded ? null : doc.id)}>
                        <div className="flex items-center gap-3">
                          <FileText className="w-5 h-5 text-white/40 flex-shrink-0" />
                          <div>
                            <p className="text-[13px] font-medium text-white max-w-[200px] md:max-w-[300px] truncate">{doc.filename}</p>
                            <p className="text-[11px] text-white/40 mt-0.5">
                              Uploaded {new Date(doc.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-4" onClick={(e) => e.stopPropagation()}>
                          <div className="hidden sm:block text-right">
                            <span className="text-[11px] text-white/40 block">Confidence</span>
                            <span className="text-[12px] font-mono font-medium text-emerald-400">{avgConfidence}%</span>
                          </div>

                          <div className="flex items-center gap-1.5">
                            {/* Replace / Edit Button */}
                            <button
                              onClick={() => handleReplaceClick(doc.id)}
                              disabled={replaceDocument.isPending || deleteDocument.isPending}
                              className="p-1.5 rounded-lg bg-white/[0.04] text-white/60 hover:text-white hover:bg-white/[0.08] transition-all"
                              title="Replace file"
                            >
                              {replacingId === doc.id && replaceDocument.isPending ? (
                                <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-400" />
                              ) : (
                                <Edit3 className="w-3.5 h-3.5" />
                              )}
                            </button>
                            {/* Delete Button */}
                            <button
                              onClick={() => handleDeleteDoc(doc.id)}
                              disabled={deleteDocument.isPending || replaceDocument.isPending}
                              className="p-1.5 rounded-lg bg-white/[0.04] text-red-400/80 hover:text-red-400 hover:bg-red-500/10 transition-all"
                              title="Delete document"
                            >
                              {deletingId === doc.id && deleteDocument.isPending ? (
                                <RefreshCw className="w-3.5 h-3.5 animate-spin text-red-400" />
                              ) : (
                                <Trash2 className="w-3.5 h-3.5" />
                              )}
                            </button>

                            <button
                              onClick={() => setExpandedDocId(isExpanded ? null : doc.id)}
                              className="p-1.5 rounded-lg text-white/40 hover:text-white transition-all ml-1"
                            >
                              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Collapsible Details */}
                      {isExpanded && (
                        <div className="border-t border-white/[0.06] bg-black/[0.15] p-4 animate-fade-in">
                          <p className="text-[12px] font-semibold text-white/60 mb-3 uppercase tracking-wider font-mono">Gemini Extracted Vitals</p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                            {Object.entries(METRIC_LABEL_MAP).map(([key, label]) => {
                              const detail = doc.extracted_values?.[key];
                              const valText = detail?.value || 'Not found';
                              const valConf = detail?.confidence || 0;
                              const valStatus = detail?.status || 'normal';
                              
                              return (
                                <div key={key} className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                                  <div>
                                    <span className="text-[11px] text-white/30 block">{label}</span>
                                    <span className={`text-[13px] font-medium block mt-0.5 ${valText === 'Not found' ? 'text-white/20' : STATUS_COLOR[valStatus] || 'text-white'}`}>
                                      {valText}
                                    </span>
                                  </div>
                                  {valText !== 'Not found' && valConf > 0 && (
                                    <div className="text-right">
                                      <span className="text-[10px] text-white/25 block">Confidence</span>
                                      <span className="text-[11px] font-mono text-emerald-400/80">{valConf}%</span>
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
                {/* Hidden inputs for replacing */}
                <input
                  id="replace-upload-input"
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file && replacingId !== null) {
                      handleReplaceDoc(replacingId, file);
                    }
                  }}
                  className="hidden"
                />
              </div>
            ) : (
              <div className="text-center py-8 border border-white/[0.04] rounded-xl bg-white/[0.01]">
                <FileText className="w-8 h-8 text-white/10 mx-auto mb-2" strokeWidth={1.5} />
                <p className="text-[13px] text-white/40">No medical reports uploaded yet</p>
                <p className="text-[11px] text-white/20 mt-0.5">Upload files to run advanced AI diagnostic risk analysis</p>
              </div>
            )}
          </GlassCard>
        </div>

        {/* Right Column: Real-time Health Risk Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Risk Meter Card */}
          <GlassCard className="p-6 relative overflow-hidden">
            <div className="absolute top-[-10%] right-[-10%] w-[30%] h-[30%] rounded-full bg-emerald-500/10 blur-[30px]" />
            <h3 className="text-[14px] font-medium text-white/60 mb-6 flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-400" />
              Calculated Health Risk
            </h3>
            <div className="flex justify-center my-4">
              <RiskMeter score={riskScore} tier={riskTier} />
            </div>
            <div className="border-t border-white/[0.06] pt-4 mt-6 text-center">
              <p className="text-[11px] text-white/30 italic">
                Evaluated in real-time by InsureIQ's AI scoring engine. Adjusting height, weight, smoking habits, or history affects this instantly.
              </p>
            </div>
          </GlassCard>

          {/* Risk Factors Explanation */}
          <GlassCard className="p-6">
            <h3 className="text-[14px] font-medium text-white/60 mb-5">
              Contributing Risk Factors (SHAP)
            </h3>
            <div className="space-y-3.5">
              {riskFactors.length > 0 ? (
                riskFactors.map((f: any, i: number) => (
                  <SHAPBar key={i} label={f.label} value={f.value} />
                ))
              ) : (
                <div className="text-center py-6">
                  <p className="text-[12px] text-white/30">No active impact factors identified</p>
                </div>
              )}
            </div>
          </GlassCard>

        </div>
      </div>
    </div>
  )
}
