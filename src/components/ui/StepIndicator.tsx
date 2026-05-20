import React from 'react'
import { Check } from 'lucide-react'

interface StepIndicatorProps {
  steps: string[]
  currentStep: number
}

export default function StepIndicator({ steps, currentStep }: StepIndicatorProps) {
  return (
    <div className="flex items-center justify-center gap-0 w-full max-w-xl mx-auto">
      {steps.map((step, index) => {
        const isCompleted = index < currentStep
        const isActive = index === currentStep
        const isLast = index === steps.length - 1

        return (
          <React.Fragment key={index}>
            <div className="flex flex-col items-center gap-2 min-w-0">
              {/* Circle */}
              <div
                className={`
                  w-9 h-9 rounded-full flex items-center justify-center
                  text-[13px] font-medium transition-all duration-300
                  ${isCompleted
                    ? 'bg-white text-black'
                    : isActive
                      ? 'bg-white/[0.15] text-white border-2 border-white/40'
                      : 'bg-white/[0.06] text-white/30 border border-white/10'
                  }
                `}
              >
                {isCompleted ? (
                  <Check className="w-4 h-4" strokeWidth={2.5} />
                ) : (
                  index + 1
                )}
              </div>
              {/* Label */}
              <span
                className={`
                  text-[11px] font-medium tracking-wide whitespace-nowrap
                  transition-colors duration-300
                  ${isActive ? 'text-white' : isCompleted ? 'text-white/60' : 'text-white/25'}
                `}
              >
                {step}
              </span>
            </div>

            {/* Connector line */}
            {!isLast && (
              <div className="flex-1 h-[1px] mx-3 mt-[-20px]">
                <div
                  className={`
                    h-full transition-all duration-500
                    ${isCompleted ? 'bg-white/40' : 'bg-white/10'}
                  `}
                />
              </div>
            )}
          </React.Fragment>
        )
      })}
    </div>
  )
}
