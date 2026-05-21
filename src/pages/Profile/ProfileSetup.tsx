import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Shield, ChevronRight, ChevronLeft, Check, Activity, Heart, User, CheckSquare, Upload } from 'lucide-react'
import GlassCard from '../../components/ui/GlassCard'
import InputField from '../../components/ui/InputField'
import PrimaryButton from '../../components/ui/PrimaryButton'
import { useProfileMutations } from '../../hooks/useProfileMutations'
import { useAuth } from '../../contexts/AuthContext'
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

export default function ProfileSetup() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { createProfile } = useProfileMutations()

  const [step, setStep] = useState(1)
  const [error, setError] = useState('')

  // Form Fields
  const [fullName, setFullName] = useState(user?.full_name || '')
  const [age, setAge] = useState('')
  const [gender, setGender] = useState('')
  const [height, setHeight] = useState('')
  const [weight, setWeight] = useState('')
  const [smoking, setSmoking] = useState(false)
  const [alcohol, setAlcohol] = useState(false)
  const [chronicConditions, setChronicConditions] = useState<string[]>([])
  const [familyHistory, setFamilyHistory] = useState<string[]>([])

  // Live BMI calculation
  const [bmi, setBmi] = useState<number>(0)
  const [bmiCategory, setBmiCategory] = useState({ label: 'Normal', color: 'text-emerald-400' })

  const { uploadDocument } = useDocuments()
  const [uploadedFile, setUploadedFile] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)

  const handleUpload = (file: File) => {
    setUploadedFile(file.name)
    uploadDocument.mutate(file, {
      onSuccess: () => {
        setError('')
      },
      onError: (err: any) => {
        setUploadedFile(null)
        setError(err.response?.data?.detail || 'Failed to upload document. Please try again.')
      }
    })
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleUpload(file)
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleUpload(file)
  }

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

  // Validation
  const validateStep = (s: number) => {
    if (s === 1) {
      return fullName.trim().length >= 2 && Number(age) >= 1 && Number(age) <= 120 && gender !== ''
    }
    if (s === 2) {
      return Number(height) >= 50 && Number(height) <= 250 && Number(weight) >= 10 && Number(weight) <= 300
    }
    return true
  }

  const handleNext = () => {
    if (validateStep(step)) {
      setError('')
      setStep(step + 1)
    } else {
      setError('Please fill in all required fields with valid details.')
    }
  }

  const handleBack = () => {
    setError('')
    setStep(step - 1)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateStep(1) || !validateStep(2)) {
      setError('Please review Steps 1 and 2 to ensure all metrics are filled out correctly.')
      setStep(1)
      return
    }

    setError('')
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
      // Default compatibility fields
      city: 'Bangalore',
      state: 'Karnataka',
      marital_status: 'Single',
      dependants: 0,
      income_bracket: 'below-3',
      existing_coverage: 'None',
      monthly_budget: 1500.0,
      past_surgeries: '',
    }

    try {
      await createProfile.mutateAsync(payload)
      navigate('/app') // will redirect to dashboard
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to submit profile. Please try again.')
    }
  }

  return (
    <div className="min-h-screen bg-black text-white relative flex flex-col justify-center items-center p-6 overflow-hidden">
      {/* Background Mesh Glows */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-emerald-500/10 blur-[130px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-600/10 blur-[150px]" />
      </div>

      <div className="w-full max-w-[550px] z-10 space-y-8">
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center">
          <div className="flex items-center gap-2 mb-3">
            <Shield className="w-6 h-6 text-emerald-400" strokeWidth={1.5} />
            <span className="text-[18px] font-medium tracking-tight text-white">
              Insur<span className="text-white/40">IQ</span>
            </span>
          </div>
          <h1 className="text-[24px] font-light tracking-tight text-white">Setup Your Profile</h1>
          <p className="text-[13px] text-white/40 mt-1">We need some general demographics & health data to build your risk model.</p>
        </div>

        {/* Form Container */}
        <GlassCard className="p-8 relative">
          {/* Step Progress Bar */}
          <div className="flex justify-between items-center mb-8 border-b border-white/[0.05] pb-4">
            {[1, 2, 3, 4].map((s) => (
              <div key={s} className="flex items-center gap-2">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-mono font-bold transition-all duration-300 ${
                    step === s
                      ? 'bg-emerald-500 text-black shadow-[0_0_12px_rgba(52,211,153,0.4)]'
                      : step > s
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-white/[0.04] text-white/30 border border-white/[0.08]'
                  }`}
                >
                  {step > s ? <Check className="w-3.5 h-3.5" /> : s}
                </div>
                <span
                  className={`text-[12px] font-medium ${
                    step === s ? 'text-white' : 'text-white/40'
                  }`}
                >
                  {s === 1 ? 'General' : s === 2 ? 'Health Vitals' : s === 3 ? 'History' : 'Documents'}
                </span>
                {s < 4 && <div className="w-6 h-[1px] bg-white/[0.06]" />}
              </div>
            ))}
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
              <p className="text-[13px] text-red-400">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* STEP 1: General Info */}
            {step === 1 && (
              <div className="space-y-5 animate-fade-in">
                <div className="flex items-center gap-2 mb-2 text-white/80 border-b border-white/[0.04] pb-2">
                  <User className="w-4 h-4 text-emerald-400" />
                  <span className="text-[14px] font-semibold">General Information</span>
                </div>

                <InputField
                  label="Full Name"
                  value={fullName}
                  onChange={setFullName}
                  placeholder="E.g. Sarah Jenkins"
                  id="setup-fullname"
                  required
                />

                <InputField
                  label="Age"
                  type="number"
                  value={age}
                  onChange={setAge}
                  placeholder="E.g. 35"
                  id="setup-age"
                  min="1"
                  max="120"
                  required
                />

                <div className="flex flex-col gap-2">
                  <label className="text-[13px] text-white/60 font-medium">Gender</label>
                  <div className="grid grid-cols-3 gap-3">
                    {['Male', 'Female', 'Other'].map((g) => (
                      <button
                        key={g}
                        type="button"
                        onClick={() => setGender(g)}
                        className={`py-3 rounded-xl border text-[13px] font-medium transition-all ${
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
              </div>
            )}

            {/* STEP 2: Body Vitals */}
            {step === 2 && (
              <div className="space-y-5 animate-fade-in">
                <div className="flex items-center gap-2 mb-2 text-white/80 border-b border-white/[0.04] pb-2">
                  <Activity className="w-4 h-4 text-blue-400" />
                  <span className="text-[14px] font-semibold">Body Metrics</span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <InputField
                    label="Height (cm)"
                    type="number"
                    value={height}
                    onChange={setHeight}
                    placeholder="E.g. 170"
                    id="setup-height"
                    required
                  />
                  <InputField
                    label="Weight (kg)"
                    type="number"
                    value={weight}
                    onChange={setWeight}
                    placeholder="E.g. 70"
                    id="setup-weight"
                    required
                  />
                </div>

                {/* Dynamic BMI calculator feedback card */}
                {bmi > 0 && (
                  <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-between">
                    <div>
                      <span className="text-[12px] text-white/40 block">Calculated BMI</span>
                      <span className="text-[24px] font-mono font-bold text-white mt-1 block">
                        {bmi}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-[12px] text-white/40 block">BMI Category</span>
                      <span className={`text-[15px] font-bold ${bmiCategory.color} mt-1 block`}>
                        {bmiCategory.label}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* STEP 3: Habits & Conditions */}
            {step === 3 && (
              <div className="space-y-5 animate-fade-in">
                <div className="flex items-center gap-2 mb-2 text-white/80 border-b border-white/[0.04] pb-2">
                  <Heart className="w-4 h-4 text-red-400" />
                  <span className="text-[14px] font-semibold">Habits & Medical History</span>
                </div>

                {/* Lifestyle Toggles */}
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setSmoking(!smoking)}
                    className={`p-4 rounded-xl border text-left transition-all ${
                      smoking
                        ? 'bg-amber-500/10 border-amber-500 text-amber-300'
                        : 'bg-white/[0.02] border-white/[0.08] text-white/60'
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
                    className={`p-4 rounded-xl border text-left transition-all ${
                      alcohol
                        ? 'bg-blue-500/10 border-blue-500 text-blue-300'
                        : 'bg-white/[0.02] border-white/[0.08] text-white/60'
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
                          className={`px-3.5 py-2 rounded-lg border text-[12px] font-medium transition-all ${
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

                {/* Family History */}
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
                          className={`px-3.5 py-2 rounded-lg border text-[12px] font-medium transition-all ${
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
              </div>
            )}

            {/* STEP 4: Medical Documents */}
            {step === 4 && (
              <div className="space-y-5 animate-fade-in">
                <div className="flex items-center gap-2 mb-2 text-white/80 border-b border-white/[0.04] pb-2">
                  <Activity className="w-4 h-4 text-emerald-400" />
                  <span className="text-[14px] font-semibold">Medical Documents (Optional)</span>
                </div>
                
                <p className="text-[13px] text-white/40">
                  Upload a recent medical lab report (PDF/JPG/PNG) to instantly populate your clinical parameters. You can skip this or add more reports later.
                </p>

                {uploadDocument.isPending ? (
                  <div className="p-8 rounded-xl border border-white/[0.08] bg-white/[0.02] text-center space-y-3">
                    <div className="w-8 h-8 rounded-full border-2 border-white/10 border-t-emerald-400 animate-spin mx-auto" />
                    <p className="text-[13px] text-white/60">Extracting clinical parameters with Gemini AI...</p>
                  </div>
                ) : uploadDocument.isSuccess ? (
                  <div className="p-5 rounded-xl border border-emerald-500/30 bg-emerald-500/5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                        <Check className="w-4 h-4 text-emerald-400" />
                      </div>
                      <div>
                        <p className="text-[13px] font-medium text-white">Report Extracted Successfully</p>
                        <p className="text-[11px] text-white/40">{uploadedFile}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setUploadedFile(null)
                        uploadDocument.reset()
                      }}
                      className="text-[12px] text-white/40 hover:text-white/60 underline"
                    >
                      Clear
                    </button>
                  </div>
                ) : (
                  <div
                    onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={handleDrop}
                    onClick={() => document.getElementById('setup-file-input')?.click()}
                    className={`
                      border-2 border-dashed rounded-xl p-8
                      flex flex-col items-center justify-center gap-3 cursor-pointer
                      transition-all duration-200
                      ${isDragging ? 'border-emerald-500/40 bg-emerald-500/[0.04]' : 'border-white/10 hover:border-emerald-500/20 bg-white/[0.01] hover:bg-emerald-500/[0.01]'}
                    `}
                  >
                    <div className="w-10 h-10 rounded-full bg-white/[0.04] flex items-center justify-center">
                      <Upload className="w-5 h-5 text-white/40" />
                    </div>
                    <div className="text-center">
                      <p className="text-[13px] text-white/60">Drag & drop your medical report here</p>
                      <p className="text-[11px] text-white/30 mt-1">PDF, JPG, or PNG — Max 10MB</p>
                    </div>
                    <input
                      id="setup-file-input"
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                  </div>
                )}
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center gap-4 pt-4 border-t border-white/[0.05]">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={handleBack}
                  className="flex items-center gap-2 px-5 py-3 rounded-xl border border-white/[0.08] hover:border-white/20 hover:bg-white/[0.02] text-[13px] font-semibold text-white transition-all"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Back
                </button>
              ) : (
                <div />
              )}

              {step < 4 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={!validateStep(step)}
                  className="flex items-center gap-2 bg-white text-black font-semibold text-[13px] px-6 py-3 rounded-xl hover:bg-white/90 transition-all disabled:opacity-40 disabled:hover:bg-white"
                >
                  Continue
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <PrimaryButton
                  type="submit"
                  disabled={createProfile.isPending || uploadDocument.isPending}
                  className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-blue-500 text-white font-semibold text-[13px] px-6 py-3 rounded-xl hover:shadow-[0_0_20px_rgba(52,211,153,0.3)] transition-all"
                >
                  {createProfile.isPending ? 'Saving profile...' : 'Complete Setup'}
                </PrimaryButton>
              )}
            </div>
          </form>
        </GlassCard>
      </div>
    </div>
  )
}
