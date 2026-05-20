import React, { useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import GlassCard from '../../components/ui/GlassCard'
import CompareMatrix from '../../components/ui/CompareMatrix'
import Badge from '../../components/ui/Badge'
import { mockPlans } from '../../data/mockPlans'
import { currentUser } from '../../data/mockUser'

export default function CompareView() {
  const navigate = useNavigate()
  const [selectedIds, setSelectedIds] = useState<string[]>(['plan-010', 'plan-001', 'plan-007'])

  const togglePlan = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(x => x !== id))
    } else if (selectedIds.length < 3) {
      setSelectedIds([...selectedIds, id])
    }
  }

  const comparePlans = selectedIds.map(id => {
    const p = mockPlans.find(x => x.id === id)!
    return {
      id: p.id,
      planName: p.name,
      insurer: p.insurer,
      suitabilityScore: 0,
      premium: `₹${p.premiumMin.toLocaleString()} — ₹${p.premiumMax.toLocaleString()}`,
      coverage: p.coverage,
      waitingPeriod: `${p.waitingPeriodDays} days`,
      roomRent: p.roomRent,
      coPay: p.coPay,
      csr: p.csr,
      day1Conditions: p.day1Conditions,
      exclusions: p.exclusions,
      pros: p.pros,
      cons: p.cons,
    }
  })

  return (
    <div className="min-h-screen p-6 lg:p-8">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-white/40 hover:text-white/60 transition-colors mb-6">
        <ArrowLeft className="w-4 h-4" />
        <span className="text-[13px]">Back</span>
      </button>

      <div className="mb-8">
        <h1 className="text-[26px] font-medium text-white">Compare Plans</h1>
        <p className="text-[14px] text-white/40 mt-1">Select up to 3 plans to compare side-by-side</p>
      </div>

      {/* Plan selector */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          {mockPlans.map(p => (
            <button
              key={p.id}
              onClick={() => togglePlan(p.id)}
              className={`px-3 py-1.5 rounded-full text-[12px] font-medium border transition-all ${
                selectedIds.includes(p.id)
                  ? 'bg-white/[0.12] border-white/20 text-white'
                  : 'bg-white/[0.03] border-white/[0.06] text-white/40 hover:text-white/60'
              } ${selectedIds.length >= 3 && !selectedIds.includes(p.id) ? 'opacity-30 cursor-not-allowed' : ''}`}
              disabled={selectedIds.length >= 3 && !selectedIds.includes(p.id)}
            >
              {p.name}
            </button>
          ))}
        </div>
        <p className="text-[11px] text-white/25 mt-2">{selectedIds.length}/3 selected</p>
      </div>

      {/* Compare Matrix */}
      {selectedIds.length >= 2 ? (
        <GlassCard className="p-2 overflow-hidden">
          <CompareMatrix
            plans={comparePlans}
            userConditions={currentUser.chronicConditions}
          />
        </GlassCard>
      ) : (
        <div className="text-center py-20">
          <p className="text-[14px] text-white/30">Select at least 2 plans to compare</p>
        </div>
      )}
    </div>
  )
}
