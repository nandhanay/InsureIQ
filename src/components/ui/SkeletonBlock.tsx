import React from 'react'

interface SkeletonBlockProps {
  className?: string
  lines?: number
}

export default function SkeletonBlock({ className = '', lines = 3 }: SkeletonBlockProps) {
  return (
    <div className={`animate-pulse space-y-3 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="h-3 bg-white/[0.06] rounded-full"
          style={{ width: `${100 - i * 15}%` }}
        />
      ))}
    </div>
  )
}
