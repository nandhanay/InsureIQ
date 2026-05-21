import React, { useState } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { Shield } from 'lucide-react'

export default function BusinessCard() {
  const [isHovered, setIsHovered] = useState(false)

  // Motion values for dynamic mouse-tilt effect
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  // Smooth springs for rotation
  const rotateXSpring = useSpring(x, { stiffness: 150, damping: 25 })
  const rotateYSpring = useSpring(y, { stiffness: 150, damping: 25 })

  // Scale map for mouse positions
  // By default (when mouse is not hovering), we maintain a fixed 3D tilt of rotateX: 12, rotateY: -15.
  // When hovering, we let the mouse movements tilt it dynamically.
  const rotateX = useTransform(rotateXSpring, [-0.5, 0.5], [20, 5])
  const rotateY = useTransform(rotateYSpring, [-0.5, 0.5], [-25, -5])

  // Soft reflection position based on mouse
  const rx = useTransform(x, [-0.5, 0.5], ['0%', '100%'])
  const ry = useTransform(y, [-0.5, 0.5], ['0%', '100%'])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget
    const rect = el.getBoundingClientRect()
    const width = rect.width
    const height = rect.height
    const mouseX = e.clientX - rect.left - width / 2
    const mouseY = e.clientY - rect.top - height / 2

    // Normalize values between -0.5 and 0.5
    x.set(mouseY / height)
    y.set(mouseX / width)
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    // Reset to the fixed premium 3D perspective tilt
    x.set(0)
    y.set(0)
  }

  const handleMouseEnter = () => {
    setIsHovered(true)
  }

  return (
    <div
      className="relative w-full max-w-[420px] h-[260px] cursor-pointer select-none"
      style={{ perspective: 1200 }}
    >
      {/* Ambient Outer Glow behind the card */}
      <motion.div
        className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-white/10 via-white/5 to-white/0 opacity-20 blur-2xl transition-opacity duration-500 pointer-events-none"
        animate={{
          scale: isHovered ? 1.15 : 1.0,
          opacity: isHovered ? 0.45 : 0.20,
        }}
        style={{
          transformStyle: 'preserve-3d',
          rotateX: isHovered ? rotateX : 12,
          rotateY: isHovered ? rotateY : -15,
          z: -20,
        }}
      />

      {/* Main Card */}
      <motion.div
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        animate={{
          y: isHovered ? -16 : 0,
        }}
        style={{
          transformStyle: 'preserve-3d',
          rotateX: isHovered ? rotateX : 12,
          rotateY: isHovered ? rotateY : -15,
        }}
        transition={{
          type: 'spring',
          stiffness: 200,
          damping: 20,
        }}
        className={`w-full h-full rounded-2xl relative p-6 flex flex-col justify-between overflow-hidden border border-white/[0.08] backdrop-blur-[16px] transition-all duration-300 ${
          isHovered
            ? 'shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9),0_0_40px_rgba(255,255,255,0.03)] border-white/[0.15]'
            : 'shadow-[0_15px_35px_-12px_rgba(0,0,0,0.8),0_0_20px_rgba(255,255,255,0.01)]'
        }`}
      >
        {/* Subtle Luxury Gradient Background Overlay */}
        <div className="absolute inset-0 bg-[#0c0c10] opacity-95 -z-20" />
        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] via-transparent to-white/[0.01] -z-10" />

        {/* Dynamic Light Reflection / Sheen */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.06] to-transparent pointer-events-none -z-10"
          style={{
            backgroundPosition: `${rx} ${ry}`,
            mixBlendMode: 'overlay',
          }}
        />

        {/* Card Header */}
        <div className="flex justify-between items-center" style={{ transform: 'translateZ(30px)' }}>
          {/* Company Logo: InsureIQ Shield */}
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-white" strokeWidth={1.5} />
            <span className="text-[14px] font-medium tracking-tight text-white">
              Insur<span className="text-white/50">IQ</span>
            </span>
          </div>
          <span className="text-[10px] uppercase font-bold tracking-[0.15em] text-white/50 bg-white/[0.04] px-2.5 py-1 rounded border border-white/[0.03]">
            Business Debit
          </span>
        </div>

        {/* Silver Smart Chip & Card Number */}
        <div className="flex flex-col gap-4 mt-2" style={{ transform: 'translateZ(40px)' }}>
          {/* Sleek Custom Silver Chip */}
          <div className="w-[36px] h-[26px] bg-gradient-to-r from-zinc-300 via-zinc-400 to-zinc-200 rounded-[4px] relative overflow-hidden border border-white/20 shadow-inner flex flex-wrap p-1">
            <div className="w-1/3 h-1/2 border-r border-b border-black/10" />
            <div className="w-1/3 h-1/2 border-r border-b border-black/10" />
            <div className="w-1/3 h-1/2 border-b border-black/10" />
            <div className="w-1/3 h-1/2 border-r border-black/10" />
            <div className="w-1/3 h-1/2 border-r border-black/10" />
            <div className="w-1/3 h-1/2" />
            {/* Chip contact lines */}
            <div className="absolute inset-0 bg-transparent flex items-center justify-center pointer-events-none">
              <div className="w-1.5 h-1.5 border border-black/15 rounded-full" />
            </div>
          </div>

          {/* Masked Card Number */}
          <div className="text-[18px] font-mono text-white/95 tracking-[0.2em] font-medium drop-shadow-sm">
            •••• &nbsp; •••• &nbsp; •••• &nbsp; 8829
          </div>
        </div>

        {/* Card Footer */}
        <div className="flex justify-between items-end mt-2" style={{ transform: 'translateZ(30px)' }}>
          <div>
            <div className="text-[9px] uppercase tracking-widest text-white/40 mb-1">Cardholder</div>
            <div className="text-[13px] font-medium text-white tracking-wide uppercase">
              Sarah Jenkins
            </div>
            <div className="text-[9px] uppercase tracking-widest text-white/30 font-medium">
              InsureIQ Inc
            </div>
          </div>

          {/* Visa logo styled elegantly in white */}
          <div className="flex flex-col items-end">
            <div className="text-[8px] font-mono tracking-widest text-white/40 mb-1">08/30</div>
            <svg
              width="45"
              height="15"
              viewBox="0 0 100 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-white opacity-85 hover:opacity-100 transition-opacity"
            >
              <path
                d="M37.89 2.53L29.34 29.47H22.52L16.29 8.84C15.93 7.42 14.88 6.47 13.56 5.8C11.16 4.54 6.8 3.2 2 2.11L2.17 1.47H17.78C19.74 1.47 21.46 2.76 21.9 4.77L26.11 24.32L32.22 1.47H39.2C39.2 1.47 37.89 2.53 37.89 2.53ZM61.02 18.96C61.09 12.33 52.6 11.95 52.66 8.5C52.7 7.45 53.72 6.36 55.93 6.08C57.03 5.95 60.05 5.86 63.2 7.29L64.44 1.63C61.05 0.44 57.71 0.02 54.41 0C47.88 0 43.19 3.42 43.12 9.87C43.05 17.22 51.52 17.63 51.44 21.31C51.38 22.42 50.19 23.51 47.78 23.77C45.24 24.05 42.14 23.55 39.02 22.13L37.76 27.87C41.22 29.35 44.8 29.98 48.33 30C55.08 30 60.94 26.54 61.02 18.96ZM80.67 29.47H86.99L81.42 1.47H75.69C73.91 1.47 72.39 2.52 71.74 4.09L61.42 29.47H68.22L69.58 25.68H77.92L80.67 29.47ZM71.5 20.31L74.88 10.87L76.83 20.31H71.5ZM98 1.47H92.29C90.58 1.47 89.23 2.47 88.58 4.01L79.93 29.47H86.73L88.08 25.68H96.42L97.77 29.47H100L98 1.47Z"
                fill="currentColor"
              />
            </svg>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
