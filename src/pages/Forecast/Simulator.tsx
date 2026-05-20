import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, RefreshCw, TrendingUp, AlertCircle } from 'lucide-react'
import GlassCard from '../../components/ui/GlassCard'
import PrimaryButton from '../../components/ui/PrimaryButton'
import SelectField from '../../components/ui/SelectField'

export default function Simulator() {
  const navigate = useNavigate()
  const [income, setIncome] = useState('10-20')
  const [newCondition, setNewCondition] = useState('')
  const [coverageIncrease, setCoverageIncrease] = useState(0)
  const [simulated, setSimulated] = useState(false)

  const runSimulation = () => {
    setSimulated(true)
  }

  const simulatedResults = [
    { plan: 'Diabetes Safe', original: 13500, simulated: newCondition ? 16200 : 13500 + coverageIncrease * 8, change: newCondition ? '+20%' : `+${Math.round(coverageIncrease * 0.6)}%` },
    { plan: 'Star Comprehensive', original: 10500, simulated: newCondition ? 13100 : 10500 + coverageIncrease * 6, change: newCondition ? '+25%' : `+${Math.round(coverageIncrease * 0.5)}%` },
    { plan: 'Care Supreme', original: 11200, simulated: newCondition ? 14500 : 11200 + coverageIncrease * 7, change: newCondition ? '+29%' : `+${Math.round(coverageIncrease * 0.6)}%` },
  ]

  return (
    <div className="min-h-screen p-6 lg:p-8 max-w-3xl mx-auto">
      <button onClick={() => navigate('/forecast')} className="flex items-center gap-2 text-white/40 hover:text-white/60 transition-colors mb-6">
        <ArrowLeft className="w-4 h-4" />
        <span className="text-[13px]">Back to Forecast</span>
      </button>

      <div className="mb-8">
        <h1 className="text-[26px] font-medium text-white">What-If Simulator</h1>
        <p className="text-[14px] text-white/40 mt-1">See how changes affect your premiums and recommendations</p>
      </div>

      <div className="space-y-5">
        {/* Scenarios */}
        <GlassCard className="p-6 space-y-5">
          <h3 className="text-[14px] font-medium text-white/60 flex items-center gap-2">
            <RefreshCw className="w-4 h-4" />
            Simulation Parameters
          </h3>

          <SelectField
            label="Income Change"
            value={income}
            onChange={setIncome}
            options={[
              { value: 'below-3', label: 'Below ₹3 Lakh (decrease)' },
              { value: '5-10', label: '₹5 — ₹10 Lakh (decrease)' },
              { value: '10-20', label: '₹10 — ₹20 Lakh (current)' },
              { value: '20-50', label: '₹20 — ₹50 Lakh (increase)' },
              { value: 'above-50', label: 'Above ₹50 Lakh (increase)' },
            ]}
          />

          <SelectField
            label="New Medical Condition"
            value={newCondition}
            onChange={setNewCondition}
            options={[
              { value: '', label: 'None' },
              { value: 'diabetes', label: 'Type 2 Diabetes (diagnosed)' },
              { value: 'heart', label: 'Heart condition' },
              { value: 'thyroid', label: 'Thyroid disorder' },
            ]}
          />

          <div className="space-y-2">
            <label className="text-[13px] text-white/50 font-medium">Coverage Increase</label>
            <input
              type="range" min={0} max={500} step={50} value={coverageIncrease}
              onChange={(e) => setCoverageIncrease(Number(e.target.value))}
              className="w-full"
            />
            <p className="text-[12px] text-white/40">+₹{coverageIncrease.toLocaleString()} additional coverage (in thousands)</p>
          </div>

          <PrimaryButton onClick={runSimulation} fullWidth icon={<TrendingUp className="w-4 h-4" />}>
            Run Simulation
          </PrimaryButton>
        </GlassCard>

        {/* Results */}
        {simulated && (
          <GlassCard className="p-6 animate-slide-up">
            <h3 className="text-[14px] font-medium text-white/60 mb-4">Simulation Results</h3>

            {newCondition && (
              <div className="flex items-start gap-2 px-4 py-3 rounded-[10px] bg-amber-400/[0.06] border border-amber-400/20 mb-4">
                <AlertCircle className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                <span className="text-[12px] text-amber-400">
                  Adding a new condition significantly impacts premium and may affect underwriting eligibility.
                </span>
              </div>
            )}

            <div className="space-y-3">
              {simulatedResults.map((r, i) => (
                <div key={i} className="flex items-center justify-between py-3 border-b border-white/[0.06] last:border-0">
                  <span className="text-[13px] text-white/70">{r.plan}</span>
                  <div className="flex items-center gap-4">
                    <span className="text-[12px] text-white/30 line-through">₹{r.original.toLocaleString()}</span>
                    <span className="text-[14px] text-white font-medium">₹{r.simulated.toLocaleString()}</span>
                    <span className="text-[12px] text-red-400">{r.change}</span>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        )}
      </div>
    </div>
  )
}
