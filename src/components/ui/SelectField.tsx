import React from 'react'

interface SelectFieldProps {
  label: string
  value: string
  onChange: (value: string) => void
  options: { value: string; label: string }[]
  placeholder?: string
  id?: string
  className?: string
}

export default function SelectField({
  label,
  value,
  onChange,
  options,
  placeholder = 'Select...',
  id,
  className = '',
}: SelectFieldProps) {
  const selectId = id || label.toLowerCase().replace(/\s+/g, '-')

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <label
        htmlFor={selectId}
        className="text-[13px] text-white/50 font-medium tracking-wide"
      >
        {label}
      </label>
      <select
        id={selectId}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="
          w-full px-4 py-3 rounded-[var(--radius-md)]
          bg-white/[0.06] border border-white/10 text-white text-[14px]
          transition-all duration-200 appearance-none
          focus:outline-none focus:bg-white/[0.08] focus:border-white/30
          cursor-pointer
        "
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1.5L6 6.5L11 1.5' stroke='rgba(255,255,255,0.4)' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right 14px center',
        }}
      >
        <option value="" disabled className="bg-black text-white/50">
          {placeholder}
        </option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-black text-white">
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  )
}
