import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import StepIndicator from '../../components/ui/StepIndicator'
import PrimaryButton from '../../components/ui/PrimaryButton'
import GhostButton from '../../components/ui/GhostButton'
import Demographics from './steps/Demographics'
import FinancialProfile from './steps/FinancialProfile'
import HealthProfile from './steps/HealthProfile'
import DocumentUpload from './steps/DocumentUpload'

const STEPS = ['Demographics', 'Financial', 'Health', 'Documents']

export default function IntakeWizard() {
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [formData, setFormData] = useState({
    // Demographics
    name: '', age: '', gender: '', city: '', state: '', maritalStatus: '', dependants: '0',
    // Financial
    incomeBracket: '', existingCoverage: '', monthlyBudget: 1500,
    // Health
    height: '', weight: '', smoking: false, alcohol: false,
    chronicConditions: [] as string[], familyHistory: [] as string[], pastSurgeries: '',
    // Documents
    documentsUploaded: false,
  })

  const updateField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleNext = () => {
    if (step < STEPS.length - 1) {
      setStep(step + 1)
    } else {
      navigate('/dashboard')
    }
  }

  const handleBack = () => {
    if (step > 0) setStep(step - 1)
  }

  const renderStep = () => {
    const props = { formData, updateField }
    switch (step) {
      case 0: return <Demographics {...props} />
      case 1: return <FinancialProfile {...props} />
      case 2: return <HealthProfile {...props} />
      case 3: return <DocumentUpload {...props} />
      default: return null
    }
  }

  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* Header */}
      <div className="pt-10 pb-8 px-6">
        <StepIndicator steps={STEPS} currentStep={step} />
      </div>

      {/* Content */}
      <div className="flex-1 flex items-start justify-center px-6 pb-32">
        <div className="w-full max-w-2xl animate-fade-in" key={step}>
          {renderStep()}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="fixed bottom-0 left-0 right-0 border-t border-white/[0.06] bg-black/80 backdrop-blur-xl">
        <div className="max-w-2xl mx-auto flex items-center justify-between px-6 py-4">
          <GhostButton onClick={handleBack} disabled={step === 0}>
            Back
          </GhostButton>
          <PrimaryButton onClick={handleNext}>
            {step === STEPS.length - 1 ? 'Get Recommendations' : 'Continue'}
          </PrimaryButton>
        </div>
      </div>
    </div>
  )
}
