import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Shield, ArrowRight, Compass, Cpu, Layers } from 'lucide-react'
import BusinessCard from '../../components/landing/BusinessCard'

export default function HeroLanding() {
  const [loadingPhase, setLoadingPhase] = useState<'loading' | 'reveal' | 'active'>('loading')
  const [progress, setProgress] = useState(0)
  const [statusText, setStatusText] = useState('Initializing risk engines...')

  useEffect(() => {
    if (loadingPhase === 'loading') {
      const interval = setInterval(() => {
        setProgress((prev) => {
          const next = prev + 1.5
          if (next >= 100) {
            clearInterval(interval)
            setStatusText('Securing ledger access...')
            setTimeout(() => {
              setLoadingPhase('reveal')
            }, 600)
            return 100
          }
          
          // Dynamic loading status messages matching InsureIQ dashboard themes
          if (next < 30) {
            setStatusText('Initializing suitability analysis...')
          } else if (next >= 30 && next < 60) {
            setStatusText('Loading risk mitigation schemas...')
          } else if (next >= 60 && next < 85) {
            setStatusText('Connecting to global medical watchlists...')
          } else {
            setStatusText('Generating secure access tokens...')
          }

          return next
        })
      }, 25)
      return () => clearInterval(interval)
    }
  }, [loadingPhase])

  // Transition from shutter reveal to active hero page
  useEffect(() => {
    if (loadingPhase === 'reveal') {
      const timer = setTimeout(() => {
        setLoadingPhase('active')
      }, 1000) // matches shutter slide duration
      return () => clearTimeout(timer)
    }
  }, [loadingPhase])

  return (
    <div className="relative min-h-screen w-full bg-black text-white overflow-hidden font-sans">
      {/* ── PHASE 1: UNIFIED LOADING SCREEN & PHASE 2: CINEMATIC SPLIT SHUTTER ── */}
      <AnimatePresence>
        {loadingPhase !== 'active' && (
          <div className="fixed inset-0 z-50 flex flex-col justify-between pointer-events-none">
            {/* Shutter Top Panel */}
            <motion.div
              initial={{ y: '0%' }}
              exit={{ y: '-100%' }}
              transition={{ duration: 1.0, ease: [0.85, 0, 0.15, 1] }}
              className="w-full h-1/2 bg-[#040407] border-b border-white/[0.02] pointer-events-auto"
            />

            {/* Floating Unified Loader content (Centered, floats above the shutters and is faded out BEFORE shutter split to prevent any clipping) */}
            {loadingPhase === 'loading' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="absolute inset-0 flex flex-col items-center justify-center p-6 z-50 pointer-events-none"
              >
                {/* Subtle back ambient glow behind the logo */}
                <div className="absolute w-[280px] h-[280px] rounded-full bg-emerald-500/5 blur-[80px] -z-10" />

                {/* Larger Logo */}
                <div className="flex items-center gap-4 mb-8">
                  <Shield className="w-12 h-12 text-white animate-pulse" strokeWidth={1.5} />
                  <span className="text-[36px] font-medium tracking-tight text-white">
                    Insur<span className="text-white/50">IQ</span>
                  </span>
                </div>

                {/* Progress Bar Container */}
                <div className="w-[280px] flex flex-col items-center gap-4">
                  {/* Ultra-thin loading progress bar with soft glow */}
                  <div className="w-full h-[2px] bg-white/10 rounded-full overflow-hidden relative">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-400 via-blue-400 to-indigo-400 rounded-full transition-all duration-75 shadow-[0_0_8px_rgba(52,211,153,0.5)]"
                      style={{ width: `${progress}%` }}
                    />
                  </div>

                  {/* Status Indicator & Percentage */}
                  <div className="w-full flex justify-between items-center px-0.5 text-white/40 font-mono text-[11px] tracking-wide">
                    <span className="transition-all duration-300">{statusText}</span>
                    <span className="text-white/80 font-bold">{Math.round(progress)}%</span>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Shutter Bottom Panel */}
            <motion.div
              initial={{ y: '0%' }}
              exit={{ y: '100%' }}
              transition={{ duration: 1.0, ease: [0.85, 0, 0.15, 1] }}
              className="w-full h-1/2 bg-[#040407] pointer-events-auto"
            />
          </div>
        )}
      </AnimatePresence>

      {/* ── PHASE 3 & 4: HERO CONTENT & ATMOSPHERIC ENVIRONMENT ── */}
      {loadingPhase !== 'loading' && (
        <motion.div
          initial={{ scale: 1.2, opacity: 0 }}
          animate={{
            scale: loadingPhase === 'active' ? 1.0 : 1.15,
            opacity: loadingPhase === 'active' ? 1 : 0.5,
          }}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
          className="relative min-h-screen w-full flex flex-col"
        >
          {/* Atmospheric Mesh Gradients / Background glows */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none -z-30">
            {/* Dark background base */}
            <div className="absolute inset-0 bg-[#020204]" />

            {/* Futuristic Grid Overlay */}
            <div
              className="absolute inset-0 opacity-[0.03]"
              style={{
                backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
                backgroundSize: '40px 40px',
              }}
            />

            {/* Glowing orbs using Dashboard Reference Colors: Emerald (#34D399), Info Blue (#60A5FA), Indigo */}
            <div className="absolute top-[-15%] left-[-10%] w-[55%] h-[55%] rounded-full bg-emerald-500/10 blur-[130px]" />
            <div className="absolute bottom-[5%] right-[-10%] w-[60%] h-[60%] rounded-full bg-blue-600/10 blur-[160px]" />
            <div className="absolute top-[30%] left-[50%] -translate-x-1/2 w-[45%] h-[45%] rounded-full bg-indigo-500/5 blur-[140px]" />

            {/* Subtle Yellow/Moderate Risk glow overlay for extra color depth */}
            <div className="absolute bottom-[-10%] left-[10%] w-[35%] h-[35%] rounded-full bg-amber-500/5 blur-[120px]" />

            {/* Radial mask to darken outer edges */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_45%,#020204_95%)]" />
          </div>

          {/* Minimalist Top Navigation Bar */}
          <motion.header
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="w-full max-w-7xl mx-auto px-6 py-6 flex justify-between items-center z-10"
          >
            <div className="flex items-center gap-2.5">
              <Shield className="w-5 h-5 text-white" strokeWidth={1.5} />
              <span className="text-[18px] font-medium tracking-tight text-white">
                Insur<span className="text-white/50">IQ</span>
              </span>
            </div>

            <nav className="hidden md:flex items-center gap-8 text-[13px] text-white/50 font-medium">
              <a href="#features" className="hover:text-white transition-colors tracking-wide">
                Features
              </a>
              <a href="#card" className="hover:text-white transition-colors tracking-wide">
                The Card
              </a>
              <a href="#features" className="hover:text-white transition-colors tracking-wide">
                Risk assessment
              </a>
            </nav>

            <div className="flex items-center gap-4">
              <Link to="/login" className="text-[13px] text-white/60 hover:text-white transition-colors tracking-wide px-3 py-1.5 font-medium">
                Sign In
              </Link>
              <Link
                to="/register"
                className="text-[12px] bg-white text-black font-semibold px-4 py-2 rounded-full hover:bg-white/90 transition-all shadow-[0_4px_20px_rgba(255,255,255,0.15)]"
              >
                Get Started
              </Link>
            </div>
          </motion.header>

          {/* Hero Section Container */}
          <main className="flex-1 w-full max-w-7xl mx-auto px-6 flex flex-col justify-center py-12 md:py-20 z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
              {/* Left Column: Premium Copy & CTAs */}
              <div className="lg:col-span-7 flex flex-col items-start text-left">
                {/* Micro-badge with Emerald/Green dot indicator */}
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                  className="mb-6 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/[0.08]"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]" />
                  <span className="text-[11px] font-mono tracking-widest text-white/60 uppercase">
                    AI-Powered Insurance Suitability
                  </span>
                </motion.div>

                {/* Main Cinematic Headline (Vibrant Emerald/Blue gradient) */}
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7, duration: 0.8 }}
                  className="text-[40px] sm:text-[54px] lg:text-[68px] font-light leading-[1.1] tracking-tight text-white mb-6"
                >
                  Explore borderless <br />
                  <span className="font-normal text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-blue-400 to-indigo-400 drop-shadow-[0_2px_10px_rgba(52,211,153,0.15)]">
                    coverage everyday
                  </span>
                </motion.h1>

                {/* Subtext */}
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9, duration: 0.8 }}
                  className="text-[15px] sm:text-[18px] text-white/50 font-light leading-relaxed max-w-[540px] mb-10"
                >
                  Unlock advanced AI-powered health and business insurance intelligence. Get instant
                  custom plan recommendations, automated risk assessment, and claim projections in
                  real time. Built for tech founders, creators, and modern enterprises.
                </motion.p>

                {/* CTA Buttons - Delayed reveal */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.1, duration: 0.8 }}
                  className="flex flex-wrap gap-4 items-center"
                >
                  <Link
                    to="/register"
                    className="group relative flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-400 hover:to-blue-400 text-white font-semibold text-[14px] px-7 py-4 rounded-xl transition-all shadow-[0_10px_35px_-5px_rgba(52,211,153,0.3)] hover:shadow-[0_12px_40px_-5px_rgba(52,211,153,0.4)] hover:translate-y-[-2px] duration-300"
                  >
                    Get Started
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>

                  <a
                    href="#features"
                    className="flex items-center justify-center text-white font-medium text-[14px] px-7 py-4 rounded-xl border border-white/[0.08] backdrop-blur-[12px] bg-white/[0.02] hover:bg-white/[0.06] hover:border-white/[0.2] hover:text-emerald-300 transition-all hover:translate-y-[-2px] duration-300"
                  >
                    Learn More
                  </a>
                </motion.div>
              </div>

              {/* Right Column: 3D Debit Card Presentation */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9, rotateY: 10 }}
                animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                transition={{ delay: 0.8, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                className="lg:col-span-5 flex justify-center items-center relative py-12 lg:py-0"
              >
                {/* 3D Debit Card Component */}
                <div className="relative z-10" id="card">
                  <BusinessCard />
                </div>

                {/* Backlighting background grid panel with matching emerald/blue glow */}
                <div className="absolute w-[440px] h-[300px] border border-white/[0.02] rounded-3xl -rotate-12 bg-gradient-to-br from-emerald-500/5 to-blue-500/5 backdrop-blur-[1px] pointer-events-none -z-10 flex items-center justify-center shadow-[0_0_50px_rgba(52,211,153,0.05)]">
                  <div className="w-[85%] h-[85%] border border-dashed border-white/[0.04] rounded-2xl" />
                </div>
              </motion.div>
            </div>
          </main>

          {/* ── Sub-hero Features List (Branded for InsureIQ with color-accented Icons) ── */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.3, duration: 1.0 }}
            id="features"
            className="w-full max-w-7xl mx-auto px-6 py-12 md:py-20 border-t border-white/[0.05]"
          >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="flex flex-col gap-3 group">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/5 border border-emerald-500/10 flex items-center justify-center group-hover:bg-emerald-500/10 group-hover:border-emerald-500/25 transition-all">
                  <Shield className="w-5 h-5 text-emerald-400" strokeWidth={1.5} />
                </div>
                <h3 className="text-[14px] font-semibold text-white tracking-wide group-hover:text-emerald-300 transition-colors">AI Risk Analyzer</h3>
                <p className="text-[12px] text-white/40 leading-relaxed">
                  Advanced ML models analyze your medical history and lifestyle to identify suitability gaps.
                </p>
              </div>

              <div className="flex flex-col gap-3 group">
                <div className="w-10 h-10 rounded-lg bg-blue-500/5 border border-blue-500/10 flex items-center justify-center group-hover:bg-blue-500/10 group-hover:border-blue-500/25 transition-all">
                  <Layers className="w-5 h-5 text-blue-400" strokeWidth={1.5} />
                </div>
                <h3 className="text-[14px] font-semibold text-white tracking-wide group-hover:text-blue-300 transition-colors">Instant Compare</h3>
                <p className="text-[12px] text-white/40 leading-relaxed">
                  Compare plan deductibles, premiums, copays, and limits side-by-side in real time.
                </p>
              </div>

              <div className="flex flex-col gap-3 group">
                <div className="w-10 h-10 rounded-lg bg-indigo-500/5 border border-indigo-500/10 flex items-center justify-center group-hover:bg-indigo-500/10 group-hover:border-indigo-500/25 transition-all">
                  <Cpu className="w-5 h-5 text-indigo-400" strokeWidth={1.5} />
                </div>
                <h3 className="text-[14px] font-semibold text-white tracking-wide group-hover:text-indigo-300 transition-colors">Claim Projections</h3>
                <p className="text-[12px] text-white/40 leading-relaxed">
                  Simulate future events (age, surgeries, chronic illnesses) to model future premium costs.
                </p>
              </div>

              <div className="flex flex-col gap-3 group">
                <div className="w-10 h-10 rounded-lg bg-amber-500/5 border border-amber-500/10 flex items-center justify-center group-hover:bg-amber-500/10 group-hover:border-amber-500/25 transition-all">
                  <Compass className="w-5 h-5 text-amber-400" strokeWidth={1.5} />
                </div>
                <h3 className="text-[14px] font-semibold text-white tracking-wide group-hover:text-amber-300 transition-colors">Watchlist Alerts</h3>
                <p className="text-[12px] text-white/40 leading-relaxed">
                  Bookmark selected plans and receive push notifications on benefit or rate changes.
                </p>
              </div>
            </div>
          </motion.section>
        </motion.div>
      )}
    </div>
  )
}
