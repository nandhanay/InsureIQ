import React from 'react'

interface RiskMeterProps {
  score: number // 0-100
  tier: 'Low' | 'Moderate' | 'High'
  size?: number
}

export default function RiskMeter({ score, tier, size = 180 }: RiskMeterProps) {
  const radius = (size - 20) / 2
  const circumference = Math.PI * radius // semicircle
  const progress = (score / 100) * circumference
  const center = size / 2

  const tierColor = {
    Low: '#34D399',
    Moderate: '#FBBF24',
    High: '#F87171',
  }[tier]

  return (
    <div className="flex flex-col items-center gap-3">
      <svg width={size} height={size / 2 + 20} viewBox={`0 0 ${size} ${size / 2 + 20}`}>
        {/* Background arc */}
        <path
          d={`M 10 ${center} A ${radius} ${radius} 0 0 1 ${size - 10} ${center}`}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="8"
          strokeLinecap="round"
        />
        {/* Progress arc */}
        <path
          d={`M 10 ${center} A ${radius} ${radius} 0 0 1 ${size - 10} ${center}`}
          fill="none"
          stroke={tierColor}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={`${circumference}`}
          strokeDashoffset={`${circumference - progress}`}
          style={{ transition: 'stroke-dashoffset 1s ease-out' }}
        />
        {/* Score text */}
        <text
          x={center}
          y={center - 10}
          textAnchor="middle"
          fill="white"
          fontSize="32"
          fontWeight="500"
          fontFamily="Inter, sans-serif"
        >
          {score}
        </text>
        <text
          x={center}
          y={center + 14}
          textAnchor="middle"
          fill="rgba(255,255,255,0.4)"
          fontSize="12"
          fontFamily="Inter, sans-serif"
        >
          / 100
        </text>
      </svg>

      {/* Tier label */}
      <div className="flex items-center gap-2">
        <div
          className="w-2 h-2 rounded-full"
          style={{ backgroundColor: tierColor }}
        />
        <span className="text-[13px] font-medium" style={{ color: tierColor }}>
          {tier} Risk
        </span>
      </div>
    </div>
  )
}
