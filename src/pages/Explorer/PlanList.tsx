import React, { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, SlidersHorizontal } from 'lucide-react'
import GlassCard from '../../components/ui/GlassCard'
import Badge from '../../components/ui/Badge'
import WatchlistButton from '../../components/ui/WatchlistButton'
import { usePlans } from '../../hooks/usePlans'
import { useWatchlist } from '../../hooks/useWatchlist'
import { useToggleWatchlist } from '../../hooks/useToggleWatchlist'
import { useWatchlistStore } from '../../stores/watchlistStore'

export default function PlanList() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState<string>('')
  const [premiumRange, setPremiumRange] = useState(25000)
  const [csrMin, setCsrMin] = useState(0)

  const { data: plansData = [], isLoading, error } = usePlans()
  // Ensure watchlist query is active so watchlistPlanIds gets populated in Zustand
  useWatchlist()
  const watchlistPlanIds = useWatchlistStore((state) => state.watchlistPlanIds)
  const toggleWatchlist = useToggleWatchlist()

  const filtered = useMemo(() => {
    return plansData.filter((p: any) => {
      if (search && !p.name.toLowerCase().includes(search.toLowerCase()) && !p.insurer.toLowerCase().includes(search.toLowerCase())) return false
      if (typeFilter && p.planType !== typeFilter) return false
      if (p.premiumMin > premiumRange) return false
      if (p.csr < csrMin) return false
      return true
    })
  }, [search, typeFilter, premiumRange, csrMin, plansData])

  const planTypes = useMemo(() => [...new Set(plansData.map((p: any) => p.planType))] as string[], [plansData])


  return (
    <div className="min-h-screen p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-[26px] font-medium text-white">Plan Explorer</h1>
        <p className="text-[14px] text-white/40 mt-1">{filtered.length} plans available</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Filters */}
        <div className="lg:w-64 flex-shrink-0">
          <GlassCard className="p-5 space-y-6 lg:sticky lg:top-6">
            <div className="flex items-center gap-2 text-white/50 mb-1">
              <SlidersHorizontal className="w-4 h-4" />
              <span className="text-[13px] font-medium">Filters</span>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search plans..."
                className="w-full pl-9 pr-4 py-2.5 rounded-[var(--radius-md)] bg-white/[0.04] border border-white/[0.08] text-white text-[13px] placeholder:text-white/20 focus:outline-none focus:border-white/20"
              />
            </div>

            {/* Coverage Type */}
            <div>
              <label className="text-[11px] text-white/40 font-medium uppercase tracking-wider">Type</label>
              <div className="mt-2 space-y-1.5">
                <button
                  onClick={() => setTypeFilter('')}
                  className={`w-full text-left px-3 py-2 rounded-[8px] text-[12px] transition-all ${!typeFilter ? 'bg-white/[0.10] text-white' : 'text-white/40 hover:text-white/60'}`}
                >
                  All Types
                </button>
                {planTypes.map(t => (
                  <button
                    key={t}
                    onClick={() => setTypeFilter(typeFilter === t ? '' : t)}
                    className={`w-full text-left px-3 py-2 rounded-[8px] text-[12px] transition-all ${typeFilter === t ? 'bg-white/[0.10] text-white' : 'text-white/40 hover:text-white/60'}`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Premium Range */}
            <div>
              <label className="text-[11px] text-white/40 font-medium uppercase tracking-wider">Max Premium</label>
              <input type="range" min={3000} max={25000} step={500} value={premiumRange} onChange={(e) => setPremiumRange(Number(e.target.value))} className="w-full mt-3" />
              <p className="text-[12px] text-white/50 mt-1">Up to ₹{premiumRange.toLocaleString()}/yr</p>
            </div>

            {/* CSR */}
            <div>
              <label className="text-[11px] text-white/40 font-medium uppercase tracking-wider">Min CSR</label>
              <input type="range" min={0} max={100} step={5} value={csrMin} onChange={(e) => setCsrMin(Number(e.target.value))} className="w-full mt-3" />
              <p className="text-[12px] text-white/50 mt-1">{csrMin}%+</p>
            </div>
          </GlassCard>
        </div>

         {/* Plan Grid */}
        <div className="flex-1">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 bg-white/[0.02] border border-white/[0.06] rounded-[var(--radius-lg)]">
              <div className="w-10 h-10 rounded-full border-2 border-white/10 border-t-white/80 animate-spin mb-4" />
              <p className="text-[14px] text-white/40">Loading Plan Catalog...</p>
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <p className="text-[14px] text-red-400">Failed to load plan catalog. Please check connection.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filtered.map((plan) => (
                <GlassCard
                  key={plan.id}
                  className="p-5 cursor-pointer"
                  interactive
                  onClick={() => navigate(`/plans/${plan.id}`)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-[14px] font-medium text-white">{plan.name}</h3>
                      <p className="text-[12px] text-white/40">{plan.insurer}</p>
                    </div>
                    <WatchlistButton
                      isWatchlisted={watchlistPlanIds.includes(plan.id)}
                      onToggle={() => toggleWatchlist.mutate(plan.id)}
                    />
                  </div>

                  <div className="flex items-center gap-2 mb-3 flex-wrap">
                    <Badge>{plan.planType}</Badge>
                    <Badge variant="info">CSR {plan.csr}%</Badge>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-[12px]">
                      <span className="text-white/40">Premium</span>
                      <span className="text-white/70">₹{plan.premiumMin.toLocaleString()} — ₹{plan.premiumMax.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-[12px]">
                      <span className="text-white/40">Coverage</span>
                      <span className="text-white/70">{plan.coverage}</span>
                    </div>
                    <div className="flex justify-between text-[12px]">
                      <span className="text-white/40">Waiting Period</span>
                      <span className="text-white/70">{plan.waitingPeriodDays} days</span>
                    </div>
                  </div>
                </GlassCard>
              ))}
            </div>
          )}

          {!isLoading && !error && filtered.length === 0 && (
            <div className="text-center py-20">
              <p className="text-[14px] text-white/30">No plans match your filters</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
