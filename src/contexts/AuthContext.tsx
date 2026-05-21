import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { authAPI } from '../services/api'

interface User {
  id: number
  email: string
  full_name: string
  created_at: string
  updated_at?: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (full_name: string, email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    const token = localStorage.getItem('access_token')
    if (token) {
      try {
        const userData = await authAPI.getMe()
        setUser(userData)
      } catch (error) {
        console.error('Auth check failed:', error)
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
      }
    }
    setIsLoading(false)
  }

  const login = async (email: string, password: string) => {
    const { access_token, refresh_token } = await authAPI.login(email, password)
    localStorage.setItem('access_token', access_token)
    localStorage.setItem('refresh_token', refresh_token)
    const userData = await authAPI.getMe()
    setUser(userData)
  }

  const register = async (full_name: string, email: string, password: string) => {
    await authAPI.register(full_name, email, password)
    const { access_token, refresh_token } = await authAPI.login(email, password)
    localStorage.setItem('access_token', access_token)
    localStorage.setItem('refresh_token', refresh_token)
    const userData = await authAPI.getMe()
    setUser(userData)
  }

  const logout = async () => {
    await authAPI.logout()
    setUser(null)
  }

  const refreshUser = async () => {
    const userData = await authAPI.getMe()
    setUser(userData)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
