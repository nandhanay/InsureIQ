import React, { useMemo } from 'react'
import GlassCard from '../../../components/ui/GlassCard'
import InputField from '../../../components/ui/InputField'
import SelectField from '../../../components/ui/SelectField'

interface Props {
  formData: any
  updateField: (field: string, value: any) => void
}

const CONDITIONS = [
  'Diabetes', 'Pre-diabetes', 'Hypertension', 'Heart Disease', 'Asthma',
  'Thyroid', 'High Cholesterol', 'Kidney Disease', 'Cancer (Remission)', 'None',
]

const FAMILY_OPTIONS = [
  'Father: Diabetes', 'Mother: Diabetes', 'Father: Heart Disease', 'Mother: Heart Disease',
  'Father: Hypertension', 'Mother: Hypertension', 'Father: Cancer', 'Mother: Cancer', 'None',
]

export default function HealthProfile({ formData, updateField }: Props) {
  const bmi = useMemo(() => {
    const h = parseFloat(formData.height) / 100
    const w = parseFloat(formData.weight)
    if (h > 0 && w > 0) return (w / (h * h)).toFixed(1)
    return '—'
  }, [formData.height, formData.weight])

  const bmiCategory = useMemo(() => {
    const val = parseFloat(bmi)
    if (isNaN(val)) return ''
    if (val < 18.5) return 'Underweight'
    if (val < 25) return 'Normal'
    if (val < 30) return 'Overweight'
    return 'Obese'
  }, [bmi])

  const bmiColor = {
    '': 'text-white/30',
    Underweight: 'text-amber-400',
    Normal: 'text-emerald-400',
    Overweight: 'text-amber-400',
    Obese: 'text-red-400',
  }[bmiCategory] || 'text-white/30'

  const toggleCondition = (c: string) => {
    const current: string[] = formData.chronicConditions
    if (c === 'None') return updateField('chronicConditions', [])
    const next = current.includes(c) ? current.filter(x => x !== c) : [...current, c]
    updateField('chronicConditions', next)
  }

  const toggleFamily = (f: string) => {
    const current: string[] = formData.familyHistory
    if (f === 'None') return updateField('familyHistory', [])
    const next = current.includes(f) ? current.filter(x => x !== f) : [...current, f]
    updateField('familyHistory', next)
  }

  return (
    <div className="animate-slide-up">
      <h2 className="text-[22px] font-medium text-white mb-2">Health Profile</h2>
      <p className="text-[14px] text-white/40 mb-8">This data is used for risk assessment and never shared with insurers</p>

      <div className="space-y-5">
        {/* Body metrics */}
        <GlassCard className="p-6">
          <h3 className="text-[14px] font-medium text-white/60 mb-4">Body Metrics</h3>
          <div className="grid grid-cols-3 gap-4">
            <InputField label="Height (cm)" type="number" value={formData.height} onChange={(v) => updateField('height', v)} placeholder="170" />
            <InputField label="Weight (kg)" type="number" value={formData.weight} onChange={(v) => updateField('weight', v)} placeholder="92" />
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] text-white/50 font-medium tracking-wide">BMI (Auto)</label>
              <div className="flex-1 flex items-center justify-center rounded-[var(--radius-md)] bg-white/[0.03] border border-white/[0.06]">
                <div className="text-center py-2">
                  <span className="text-[18px] font-medium text-white">{bmi}</span>
                  {bmiCategory && (
                    <span className={`block text-[11px] font-medium ${bmiColor}`}>{bmiCategory}</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Lifestyle */}
        <GlassCard className="p-6">
          <h3 className="text-[14px] font-medium text-white/60 mb-4">Lifestyle</h3>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => updateField('smoking', !formData.smoking)}
              className={`flex items-center justify-between px-4 py-3 rounded-[var(--radius-md)] border transition-all ${
                formData.smoking ? 'bg-red-400/10 border-red-400/20 text-red-400' : 'bg-white/[0.03] border-white/[0.06] text-white/50'
              }`}
            >
              <span className="text-[13px]">Smoking</span>
              <span className="text-[12px] font-medium">{formData.smoking ? 'Yes' : 'No'}</span>
            </button>
            <button
              onClick={() => updateField('alcohol', !formData.alcohol)}
              className={`flex items-center justify-between px-4 py-3 rounded-[var(--radius-md)] border transition-all ${
                formData.alcohol ? 'bg-amber-400/10 border-amber-400/20 text-amber-400' : 'bg-white/[0.03] border-white/[0.06] text-white/50'
              }`}
            >
              <span className="text-[13px]">Alcohol</span>
              <span className="text-[12px] font-medium">{formData.alcohol ? 'Yes' : 'No'}</span>
            </button>
          </div>
        </GlassCard>

        {/* Conditions */}
        <GlassCard className="p-6">
          <h3 className="text-[14px] font-medium text-white/60 mb-4">Chronic Conditions</h3>
          <div className="flex flex-wrap gap-2">
            {CONDITIONS.map(c => (
              <button
                key={c}
                onClick={() => toggleCondition(c)}
                className={`px-3 py-1.5 rounded-full text-[12px] font-medium border transition-all ${
                  formData.chronicConditions.includes(c)
                    ? 'bg-white/[0.12] border-white/20 text-white'
                    : 'bg-white/[0.03] border-white/[0.06] text-white/40 hover:text-white/60'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </GlassCard>

        {/* Family history */}
        <GlassCard className="p-6">
          <h3 className="text-[14px] font-medium text-white/60 mb-4">Family Medical History</h3>
          <div className="flex flex-wrap gap-2">
            {FAMILY_OPTIONS.map(f => (
              <button
                key={f}
                onClick={() => toggleFamily(f)}
                className={`px-3 py-1.5 rounded-full text-[12px] font-medium border transition-all ${
                  formData.familyHistory.includes(f)
                    ? 'bg-white/[0.12] border-white/20 text-white'
                    : 'bg-white/[0.03] border-white/[0.06] text-white/40 hover:text-white/60'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </GlassCard>

        {/* Surgeries */}
        <GlassCard className="p-6">
          <InputField
            label="Past Surgeries (if any)"
            value={formData.pastSurgeries}
            onChange={(v) => updateField('pastSurgeries', v)}
            placeholder="e.g., Appendectomy (2018)"
          />
        </GlassCard>
      </div>
    </div>
  )
}
