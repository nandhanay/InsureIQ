import React from 'react'
import GlassCard from '../../../components/ui/GlassCard'
import InputField from '../../../components/ui/InputField'
import SelectField from '../../../components/ui/SelectField'

interface Props {
  formData: any
  updateField: (field: string, value: any) => void
}

export default function Demographics({ formData, updateField }: Props) {
  return (
    <div className="animate-slide-up">
      <h2 className="text-[22px] font-medium text-white mb-2">Demographics</h2>
      <p className="text-[14px] text-white/40 mb-8">Tell us about yourself to personalize recommendations</p>

      <GlassCard className="p-6 space-y-5">
        <InputField label="Full Name" value={formData.name} onChange={(v) => updateField('name', v)} placeholder="Rajesh Kumar" />

        <div className="grid grid-cols-2 gap-4">
          <InputField label="Age" type="number" value={formData.age} onChange={(v) => updateField('age', v)} placeholder="47" />
          <SelectField
            label="Gender"
            value={formData.gender}
            onChange={(v) => updateField('gender', v)}
            options={[
              { value: 'male', label: 'Male' },
              { value: 'female', label: 'Female' },
              { value: 'other', label: 'Other' },
            ]}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <InputField label="City" value={formData.city} onChange={(v) => updateField('city', v)} placeholder="Mumbai" />
          <SelectField
            label="State"
            value={formData.state}
            onChange={(v) => updateField('state', v)}
            options={[
              { value: 'MH', label: 'Maharashtra' }, { value: 'KA', label: 'Karnataka' },
              { value: 'DL', label: 'Delhi' }, { value: 'TN', label: 'Tamil Nadu' },
              { value: 'UP', label: 'Uttar Pradesh' }, { value: 'GJ', label: 'Gujarat' },
              { value: 'RJ', label: 'Rajasthan' }, { value: 'WB', label: 'West Bengal' },
              { value: 'KL', label: 'Kerala' }, { value: 'TS', label: 'Telangana' },
            ]}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <SelectField
            label="Marital Status"
            value={formData.maritalStatus}
            onChange={(v) => updateField('maritalStatus', v)}
            options={[
              { value: 'single', label: 'Single' },
              { value: 'married', label: 'Married' },
              { value: 'divorced', label: 'Divorced' },
              { value: 'widowed', label: 'Widowed' },
            ]}
          />
          <InputField
            label="Number of Dependants"
            type="number"
            value={formData.dependants}
            onChange={(v) => updateField('dependants', v)}
            placeholder="0"
          />
        </div>
      </GlassCard>
    </div>
  )
}
