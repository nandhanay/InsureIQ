import React from 'react'
import GlassCard from '../../../components/ui/GlassCard'
import SelectField from '../../../components/ui/SelectField'
import InputField from '../../../components/ui/InputField'

interface Props {
  formData: any
  updateField: (field: string, value: any) => void
}

export default function FinancialProfile({ formData, updateField }: Props) {
  return (
    <div className="animate-slide-up">
      <h2 className="text-[22px] font-medium text-white mb-2">Financial Profile</h2>
      <p className="text-[14px] text-white/40 mb-8">Help us understand your budget for better plan matching</p>

      <GlassCard className="p-6 space-y-5">
        <SelectField
          label="Annual Income Bracket"
          value={formData.incomeBracket}
          onChange={(v) => updateField('incomeBracket', v)}
          options={[
            { value: 'below-3', label: 'Below ₹3 Lakh' },
            { value: '3-5', label: '₹3 — ₹5 Lakh' },
            { value: '5-10', label: '₹5 — ₹10 Lakh' },
            { value: '10-20', label: '₹10 — ₹20 Lakh' },
            { value: '20-50', label: '₹20 — ₹50 Lakh' },
            { value: 'above-50', label: 'Above ₹50 Lakh' },
          ]}
        />

        <SelectField
          label="Existing Health Coverage"
          value={formData.existingCoverage}
          onChange={(v) => updateField('existingCoverage', v)}
          options={[
            { value: 'none', label: 'None' },
            { value: 'employer-3', label: 'Employer (up to ₹3 Lakh)' },
            { value: 'employer-5', label: 'Employer (up to ₹5 Lakh)' },
            { value: 'employer-10', label: 'Employer (up to ₹10 Lakh)' },
            { value: 'personal', label: 'Personal Policy' },
            { value: 'both', label: 'Employer + Personal' },
          ]}
        />

        {/* Budget slider */}
        <div className="space-y-3">
          <label className="text-[13px] text-white/50 font-medium tracking-wide">
            Monthly Insurance Budget
          </label>
          <div className="flex items-center gap-4">
            <input
              type="range"
              min={500}
              max={5000}
              step={100}
              value={formData.monthlyBudget}
              onChange={(e) => updateField('monthlyBudget', Number(e.target.value))}
              className="flex-1"
            />
            <div className="glass-sm px-4 py-2 min-w-[100px] text-center">
              <span className="text-[16px] font-medium text-white">₹{formData.monthlyBudget.toLocaleString()}</span>
              <span className="text-[11px] text-white/30 block">/month</span>
            </div>
          </div>
          <div className="flex justify-between text-[11px] text-white/20">
            <span>₹500</span>
            <span>₹5,000</span>
          </div>
        </div>
      </GlassCard>
    </div>
  )
}
