export interface ForecastDataPoint {
  year: number
  premium: number
}

export interface PlanForecast {
  planId: string
  planName: string
  insurer: string
  color: string
  data: ForecastDataPoint[]
}

export const mockForecasts: PlanForecast[] = [
  {
    planId: 'plan-010', planName: 'Diabetes Safe', insurer: 'Star Health',
    color: '#34D399',
    data: [
      { year: 0, premium: 13500 }, { year: 1, premium: 14850 }, { year: 2, premium: 15700 },
      { year: 3, premium: 16200 }, { year: 4, premium: 18100 }, { year: 5, premium: 19800 },
    ],
  },
  {
    planId: 'plan-001', planName: 'Star Comprehensive', insurer: 'Star Health',
    color: '#60A5FA',
    data: [
      { year: 0, premium: 10500 }, { year: 1, premium: 11400 }, { year: 2, premium: 12200 },
      { year: 3, premium: 13200 }, { year: 4, premium: 14800 }, { year: 5, premium: 16800 },
    ],
  },
  {
    planId: 'plan-007', planName: 'Care Supreme', insurer: 'Care Health',
    color: '#FBBF24',
    data: [
      { year: 0, premium: 11200 }, { year: 1, premium: 12100 }, { year: 2, premium: 13400 },
      { year: 3, premium: 14800 }, { year: 4, premium: 16900 }, { year: 5, premium: 19200 },
    ],
  },
  {
    planId: 'plan-005', planName: 'Activ Health Platinum', insurer: 'Aditya Birla',
    color: '#F87171',
    data: [
      { year: 0, premium: 18000 }, { year: 1, premium: 19800 }, { year: 2, premium: 21500 },
      { year: 3, premium: 23400 }, { year: 4, premium: 26800 }, { year: 5, premium: 30200 },
    ],
  },
  {
    planId: 'plan-006', planName: 'iHealth Plus', insurer: 'Bajaj Allianz',
    color: '#A78BFA',
    data: [
      { year: 0, premium: 9200 }, { year: 1, premium: 10100 }, { year: 2, premium: 10900 },
      { year: 3, premium: 11800 }, { year: 4, premium: 13500 }, { year: 5, premium: 15400 },
    ],
  },
]

export const mockWatchlistChanges = [
  {
    planName: 'Diabetes Safe',
    insurer: 'Star Health Insurance',
    changes: [
      { type: 'premium' as const, direction: 'up' as const, label: 'Premium increase', detail: '₹13,500 → ₹14,850 (+10%)', timestamp: '2d ago' },
      { type: 'csr' as const, direction: 'down' as const, label: 'CSR improved', detail: '72% → 74%', timestamp: '1w ago' },
    ],
  },
  {
    planName: 'Care Supreme',
    insurer: 'Care Health Insurance',
    changes: [
      { type: 'exclusion' as const, direction: 'neutral' as const, label: 'Exclusion update', detail: 'Mental health OPD now partially covered', timestamp: '3d ago' },
      { type: 'metric' as const, direction: 'up' as const, label: 'Claim TAT increased', detail: 'Average 18 days → 22 days', timestamp: '5d ago' },
    ],
  },
]
