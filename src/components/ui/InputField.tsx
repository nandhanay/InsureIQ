import React from 'react'

interface InputFieldProps {
  label: string
  type?: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  error?: string
  disabled?: boolean
  id?: string
  className?: string
}

export default function InputField({
  label,
  type = 'text',
  value,
  onChange,
  placeholder = '',
  error,
  disabled = false,
  id,
  className = '',
}: InputFieldProps) {
  const inputId = id || label.toLowerCase().replace(/\s+/g, '-')

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <label
        htmlFor={inputId}
        className="text-[13px] text-white/50 font-medium tracking-wide"
      >
        {label}
      </label>
      <input
        id={inputId}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className={`
          w-full px-4 py-3 rounded-[var(--radius-md)]
          bg-white/[0.06] border text-white text-[14px]
          placeholder:text-white/25
          transition-all duration-200
          focus:outline-none focus:bg-white/[0.08] focus:border-white/30
          disabled:opacity-40 disabled:cursor-not-allowed
          ${error ? 'border-red-400/60' : 'border-white/10'}
        `}
      />
      {error && (
        <span className="text-[12px] text-red-400/80">{error}</span>
      )}
    </div>
  )
}
