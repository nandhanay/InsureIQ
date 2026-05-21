import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { useProfile } from '../../hooks/useProfile'
import { useProfileStore } from '../../stores/profileStore'

interface ProtectedRouteProps {
  children: React.ReactNode
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth()
  const location = useLocation()
  
  // Fetch profile status
  const { isLoading: isProfileLoading, isError } = useProfile()
  const hasProfile = useProfileStore((state) => state.hasProfile)

  const isProfileSetupPath = location.pathname === '/profile-setup'
  const isIntakePath = location.pathname === '/intake'

  if (isAuthLoading || (isAuthenticated && isProfileLoading && !hasProfile && !isError && !isProfileSetupPath && !isIntakePath)) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  // User must complete profile before accessing other pages
  if (!hasProfile && !isProfileSetupPath && !isIntakePath) {
    return <Navigate to="/profile-setup" replace />
  }

  // If already setup, redirect away from setup
  if (hasProfile && isProfileSetupPath) {
    return <Navigate to="/dashboard" replace />
  }

  return <>{children}</>
}

