import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Shield } from 'lucide-react'
import GlassCard from '../../components/ui/GlassCard'
import InputField from '../../components/ui/InputField'
import PrimaryButton from '../../components/ui/PrimaryButton'

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    // Simulate auth
    setTimeout(() => {
      sessionStorage.setItem('insuriq_auth', 'true')
      navigate('/dashboard')
    }, 800)
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6">
      <div className="w-full max-w-[400px] animate-scale-in">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-10">
          <Shield className="w-8 h-8 text-white" strokeWidth={1.5} />
          <h1 className="text-[24px] font-medium text-white tracking-tight">
            Insur<span className="text-white/50">IQ</span>
          </h1>
        </div>

        <GlassCard className="p-8">
          <h2 className="text-[18px] font-medium text-white mb-1">Welcome back</h2>
          <p className="text-[13px] text-white/40 mb-8">Sign in to your account</p>

          <form onSubmit={handleLogin} className="space-y-5">
            <InputField
              label="Email"
              type="email"
              value={email}
              onChange={setEmail}
              placeholder="you@example.com"
              id="login-email"
            />

            <InputField
              label="Password"
              type="password"
              value={password}
              onChange={setPassword}
              placeholder="••••••••"
              id="login-password"
            />

            <PrimaryButton
              type="submit"
              fullWidth
              disabled={loading || !email || !password}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </PrimaryButton>
          </form>

          <div className="mt-6 text-center">
            <span className="text-[13px] text-white/30">
              Don't have an account?{' '}
              <Link
                to="/register"
                className="text-white/70 hover:text-white transition-colors underline underline-offset-2"
              >
                Create one
              </Link>
            </span>
          </div>
        </GlassCard>

        {/* Demo hint */}
        <div className="mt-6 text-center">
          <button
            onClick={() => {
              setEmail('rajesh@demo.com')
              setPassword('demo1234')
            }}
            className="text-[12px] text-white/20 hover:text-white/40 transition-colors"
          >
            Use demo credentials
          </button>
        </div>
      </div>
    </div>
  )
}
