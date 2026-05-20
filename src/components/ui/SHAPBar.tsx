import React from 'react'

interface SHAPBarProps {
  label: string
  value: number // -1 to 1
  className?: string
}

export default function SHAPBar({ label, value, className = '' }: SHAPBarProps) {
  const isPositive = value >= 0
  const absValue = Math.abs(value)
  const widthPercent = Math.min(absValue * 100, 100)

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Label */}
      <span className="text-[12px] text-white/50 w-28 text-right truncate flex-shrink-0">
        {label}
      </span>

      {/* Bar container */}
      <div className="flex-1 flex items-center h-5 relative">
        {/* Center line */}
        <div className="absolute left-1/2 w-[1px] h-full bg-white/10" />

        {/* Bar */}
        <div className="w-full flex items-center">
          {/* Left half (negative) */}
          <div className="w-1/2 flex justify-end">
            {!isPositive && (
              <div
                className="h-4 rounded-l-sm bg-red-400/40 transition-all duration-500"
                style={{ width: `${widthPercent}%` }}
              />
            )}
          </div>
          {/* Right half (positive) */}
          <div className="w-1/2 flex justify-start">
            {isPositive && (
              <div
                className="h-4 rounded-r-sm bg-emerald-400/40 transition-all duration-500"
                style={{ width: `${widthPercent}%` }}
              />
            )}
          </div>
        </div>
      </div>

      {/* Value */}
      <span
        className={`text-[12px] font-medium w-12 text-right flex-shrink-0 ${
          isPositive ? 'text-emerald-400/80' : 'text-red-400/80'
        }`}
      >
        {isPositive ? '+' : ''}{value.toFixed(2)}
      </span>
    </div>
  )
}
