import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Shield } from 'lucide-react'
import GlassCard from '../../components/ui/GlassCard'
import InputField from '../../components/ui/InputField'
import PrimaryButton from '../../components/ui/PrimaryButton'
import { useAuth } from '../../contexts/AuthContext'

export default function Register() {
  const navigate = useNavigate()
  const { register } = useAuth()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const passwordsMatch = password === confirm || confirm === ''
  const passwordValid = password.length >= 8 && password.length <= 72
  const canSubmit = name && email && password && confirm && passwordsMatch && passwordValid && !loading

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!passwordsMatch) return
    setLoading(true)
    setError('')
    try {
      await register(name, email, password)
      navigate('/profile-setup')
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
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
          <h2 className="text-[18px] font-medium text-white mb-1">Create account</h2>
          <p className="text-[13px] text-white/40 mb-8">Start your insurance intelligence journey</p>

          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
              <p className="text-[13px] text-red-400">{error}</p>
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-5">
            <InputField label="Full Name" value={name} onChange={setName} placeholder="Rajesh Kumar" id="reg-name" />
            <InputField label="Email" type="email" value={email} onChange={setEmail} placeholder="you@example.com" id="reg-email" />
            <InputField 
              label="Password" 
              type="password" 
              value={password} 
              onChange={setPassword} 
              placeholder="••••••••" 
              id="reg-password"
              error={password && !passwordValid ? 'Password must be 8-72 characters' : undefined}
            />
            <InputField
              label="Confirm Password"
              type="password"
              value={confirm}
              onChange={setConfirm}
              placeholder="••••••••"
              id="reg-confirm"
              error={!passwordsMatch ? 'Passwords do not match' : undefined}
            />

            <PrimaryButton type="submit" fullWidth disabled={!canSubmit}>
              {loading ? 'Creating account...' : 'Create Account'}
            </PrimaryButton>
          </form>

          <div className="mt-6 text-center">
            <span className="text-[13px] text-white/30">
              Already have an account?{' '}
              <Link to="/login" className="text-white/70 hover:text-white transition-colors underline underline-offset-2">
                Sign in
              </Link>
            </span>
          </div>
        </GlassCard>
      </div>
    </div>
  )
}
