import React from 'react'
import { Navigate } from 'react-router-dom'

interface ProtectedRouteProps {
  children: React.ReactNode
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const isAuth = sessionStorage.getItem('insuriq_auth') === 'true'

  if (!isAuth) {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}
