import React, { useState } from 'react'
import { NavLink, useNavigate, useLocation } from 'react-router-dom'
import {
  Shield, LayoutDashboard, Search, GitCompare, TrendingUp,
  Bookmark, Sparkles, LogOut, Menu, X,
} from 'lucide-react'
import CopilotDrawer from '../../pages/Copilot/CopilotDrawer'

interface AppShellProps {
  children: React.ReactNode
}

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/plans', icon: Search, label: 'Explore Plans' },
  { to: '/compare', icon: GitCompare, label: 'Compare' },
  { to: '/forecast', icon: TrendingUp, label: 'Forecast' },
  { to: '/watchlist', icon: Bookmark, label: 'Watchlist' },
]

export default function AppShell({ children }: AppShellProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const [copilotOpen, setCopilotOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleLogout = () => {
    sessionStorage.removeItem('insuriq_auth')
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-black flex">
      {/* Sidebar — Desktop */}
      <aside className="hidden lg:flex flex-col w-[240px] border-r border-white/[0.06] bg-black/50 sticky top-0 h-screen">
        {/* Logo */}
        <div className="flex items-center gap-2.5 px-6 py-6">
          <Shield className="w-6 h-6 text-white" strokeWidth={1.5} />
          <span className="text-[18px] font-medium text-white tracking-tight">
            Insur<span className="text-white/40">IQ</span>
          </span>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 space-y-1">
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `
                flex items-center gap-3 px-4 py-2.5 rounded-[var(--radius-md)]
                text-[13px] font-medium transition-all duration-200
                ${isActive
                  ? 'bg-white/[0.08] text-white'
                  : 'text-white/40 hover:text-white/60 hover:bg-white/[0.04]'
                }
              `}
            >
              <item.icon className="w-4 h-4" strokeWidth={1.5} />
              {item.label}
            </NavLink>
          ))}

          {/* Copilot */}
          <button
            onClick={() => setCopilotOpen(true)}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-[var(--radius-md)] text-[13px] font-medium text-white/40 hover:text-white/60 hover:bg-white/[0.04] transition-all duration-200"
          >
            <Sparkles className="w-4 h-4" strokeWidth={1.5} />
            AI Copilot
          </button>
        </nav>

        {/* Bottom */}
        <div className="px-3 py-4 border-t border-white/[0.06]">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-[var(--radius-md)] text-[13px] font-medium text-white/30 hover:text-red-400/70 hover:bg-red-400/[0.04] transition-all"
          >
            <LogOut className="w-4 h-4" strokeWidth={1.5} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-30 border-b border-white/[0.06] bg-black/90 backdrop-blur-xl">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-white" strokeWidth={1.5} />
            <span className="text-[16px] font-medium text-white">Insur<span className="text-white/40">IQ</span></span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setCopilotOpen(true)} className="p-2 text-white/40">
              <Sparkles className="w-5 h-5" />
            </button>
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 text-white/40">
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        {mobileMenuOpen && (
          <nav className="px-4 pb-4 space-y-1 animate-fade-in">
            {navItems.map(item => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) => `
                  flex items-center gap-3 px-4 py-2.5 rounded-[var(--radius-md)]
                  text-[13px] font-medium transition-all
                  ${isActive ? 'bg-white/[0.08] text-white' : 'text-white/40'}
                `}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </NavLink>
            ))}
            <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2.5 text-[13px] text-white/30">
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </nav>
        )}
      </div>

      {/* Main content */}
      <main className="flex-1 lg:overflow-y-auto lg:h-screen pt-14 lg:pt-0">
        {children}
      </main>

      {/* Copilot drawer */}
      <CopilotDrawer isOpen={copilotOpen} onClose={() => setCopilotOpen(false)} />
    </div>
  )
}
