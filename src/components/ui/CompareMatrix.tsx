import React from 'react'
import { Check, X, AlertTriangle } from 'lucide-react'

interface PlanColumn {
  id: string
  planName: string
  insurer: string
  suitabilityScore: number
  premium: string
  coverage: string
  waitingPeriod: string
  roomRent: string
  coPay: string
  csr: number
  day1Conditions: string[]
  exclusions: string[]
  pros: string[]
  cons: string[]
}

interface CompareMatrixProps {
  plans: PlanColumn[]
  userConditions?: string[]
  className?: string
}

export default function CompareMatrix({ plans, userConditions = [], className = '' }: CompareMatrixProps) {
  const rows: { label: string; key: keyof PlanColumn; type?: 'score' | 'list' | 'check-list' | 'text' }[] = [
    { label: 'Suitability Score', key: 'suitabilityScore', type: 'score' },
    { label: 'Premium', key: 'premium', type: 'text' },
    { label: 'Sum Insured', key: 'coverage', type: 'text' },
    { label: 'Waiting Period', key: 'waitingPeriod', type: 'text' },
    { label: 'Room Rent', key: 'roomRent', type: 'text' },
    { label: 'Co-Pay', key: 'coPay', type: 'text' },
    { label: 'CSR', key: 'csr', type: 'score' },
    { label: 'Day-1 Conditions', key: 'day1Conditions', type: 'check-list' },
    { label: 'Exclusions', key: 'exclusions', type: 'list' },
    { label: 'Pros', key: 'pros', type: 'list' },
    { label: 'Cons', key: 'cons', type: 'list' },
  ]

  const hasConflict = (exclusions: string[]) => {
    return userConditions.some(c =>
      exclusions.some(e => e.toLowerCase().includes(c.toLowerCase()))
    )
  }

  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="text-left p-4 text-[12px] text-white/30 font-medium uppercase tracking-wider w-40" />
            {plans.map((plan) => (
              <th key={plan.id} className="p-4 text-left min-w-[240px]">
                <div className="space-y-1">
                  <h3 className="text-[14px] font-medium text-white">{plan.planName}</h3>
                  <p className="text-[12px] text-white/40">{plan.insurer}</p>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.key} className="border-t border-white/[0.06]">
              <td className="p-4 text-[12px] text-white/40 font-medium">
                {row.label}
              </td>
              {plans.map((plan) => {
                const val = plan[row.key]

                return (
                  <td key={plan.id} className="p-4">
                    {row.type === 'score' ? (
                      <span className="text-[15px] font-medium text-white">
                        {typeof val === 'number' ? (row.key === 'csr' ? `${val}%` : `${val}/100`) : val}
                      </span>
                    ) : row.type === 'list' ? (
                      <ul className="space-y-1">
                        {(val as string[]).map((item, i) => {
                          const isConflict = row.key === 'exclusions' && userConditions.some(c =>
                            item.toLowerCase().includes(c.toLowerCase())
                          )
                          return (
                            <li key={i} className={`text-[12px] flex items-start gap-1.5 ${isConflict ? 'text-red-400' : 'text-white/50'}`}>
                              {isConflict && <AlertTriangle className="w-3 h-3 mt-0.5 flex-shrink-0" />}
                              <span>{item}</span>
                            </li>
                          )
                        })}
                      </ul>
                    ) : row.type === 'check-list' ? (
                      <ul className="space-y-1">
                        {(val as string[]).map((item, i) => (
                          <li key={i} className="text-[12px] text-white/50 flex items-center gap-1.5">
                            <Check className="w-3 h-3 text-emerald-400" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <span className="text-[13px] text-white/60">{String(val)}</span>
                    )}
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Conflict warning */}
      {plans.some(p => hasConflict(p.exclusions)) && (
        <div className="mt-4 flex items-center gap-2 px-4 py-2.5 rounded-[10px] bg-red-400/[0.06] border border-red-400/20">
          <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0" />
          <span className="text-[12px] text-red-400">
            Some plans have exclusions that conflict with your health conditions
          </span>
        </div>
      )}
    </div>
  )
}
