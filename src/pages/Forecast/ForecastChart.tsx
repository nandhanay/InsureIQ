import React, { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, PointElement, LineElement,
  Title, Tooltip, Legend, Filler,
} from 'chart.js'
import GlassCard from '../../components/ui/GlassCard'
import GhostButton from '../../components/ui/GhostButton'
import { mockForecasts } from '../../data/mockForecast'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler)

export default function ForecastChart() {
  const navigate = useNavigate()
  const [yearRange, setYearRange] = useState<1 | 3 | 5>(5)
  const [enabledPlans, setEnabledPlans] = useState<string[]>(mockForecasts.map(f => f.planId))

  const togglePlan = (id: string) => {
    setEnabledPlans(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    )
  }

  const chartData = useMemo(() => {
    const labels = Array.from({ length: yearRange + 1 }, (_, i) => `Year ${i}`)
    const datasets = mockForecasts
      .filter(f => enabledPlans.includes(f.planId))
      .map(f => ({
        label: f.planName,
        data: f.data.slice(0, yearRange + 1).map(d => d.premium),
        borderColor: f.color,
        backgroundColor: f.color + '15',
        tension: 0.3,
        pointRadius: 4,
        pointBackgroundColor: f.color,
        pointBorderColor: 'transparent',
        borderWidth: 2,
        fill: false,
      }))

    return { labels, datasets }
  }, [yearRange, enabledPlans])

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(0,0,0,0.85)',
        borderColor: 'rgba(255,255,255,0.1)',
        borderWidth: 1,
        titleFont: { family: 'Inter', size: 12, weight: '500' as const },
        bodyFont: { family: 'Inter', size: 12 },
        padding: 12,
        cornerRadius: 10,
        callbacks: {
          label: (ctx: any) => `${ctx.dataset.label}: ₹${ctx.parsed.y.toLocaleString()}`,
        },
      },
    },
    scales: {
      x: {
        grid: { color: 'rgba(255,255,255,0.04)' },
        ticks: { color: 'rgba(255,255,255,0.3)', font: { family: 'Inter', size: 11 } },
      },
      y: {
        grid: { color: 'rgba(255,255,255,0.04)' },
        ticks: {
          color: 'rgba(255,255,255,0.3)',
          font: { family: 'Inter', size: 11 },
          callback: (val: any) => `₹${(val / 1000).toFixed(0)}K`,
        },
      },
    },
  }

  return (
    <div className="min-h-screen p-6 lg:p-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-[26px] font-medium text-white">Premium Forecast</h1>
        <p className="text-[14px] text-white/40 mt-1">Projected premium growth for your shortlisted plans</p>
      </div>

      {/* Year tabs */}
      <div className="flex gap-2 mb-6">
        {([1, 3, 5] as const).map(y => (
          <button
            key={y}
            onClick={() => setYearRange(y)}
            className={`px-4 py-2 rounded-full text-[13px] font-medium border transition-all ${
              yearRange === y
                ? 'bg-white text-black border-white'
                : 'bg-transparent text-white/40 border-white/10 hover:text-white/60'
            }`}
          >
            {y} Year{y > 1 ? 's' : ''}
          </button>
        ))}
      </div>

      {/* Chart */}
      <GlassCard className="p-6 mb-6">
        <div className="h-[400px]">
          <Line data={chartData} options={chartOptions} />
        </div>
      </GlassCard>

      {/* Plan toggles */}
      <GlassCard className="p-5">
        <h3 className="text-[12px] text-white/40 font-medium uppercase tracking-wider mb-3">Toggle Plans</h3>
        <div className="flex flex-wrap gap-3">
          {mockForecasts.map(f => (
            <button
              key={f.planId}
              onClick={() => togglePlan(f.planId)}
              className={`flex items-center gap-2 px-3 py-2 rounded-full text-[12px] font-medium border transition-all ${
                enabledPlans.includes(f.planId)
                  ? 'bg-white/[0.08] border-white/15 text-white'
                  : 'bg-transparent border-white/[0.06] text-white/25'
              }`}
            >
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: f.color, opacity: enabledPlans.includes(f.planId) ? 1 : 0.3 }} />
              {f.planName}
            </button>
          ))}
        </div>
      </GlassCard>

      {/* Simulator CTA */}
      <div className="mt-6 text-center">
        <GhostButton onClick={() => navigate('/forecast/simulator')}>
          Open What-If Simulator →
        </GhostButton>
      </div>
    </div>
  )
}
