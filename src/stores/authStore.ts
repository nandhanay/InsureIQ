import { create } from 'zustand'

interface AuthState {
  token: string | null
  email: string | null
  userId: number | null
  fullName: string | null
  isAuthenticated: boolean
  setAuth: (token: string, email: string, userId: number, fullName: string) => void
  clearAuth: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  token: localStorage.getItem('access_token'),
  email: null,
  userId: null,
  fullName: null,
  isAuthenticated: !!localStorage.getItem('access_token'),
  setAuth: (token, email, userId, fullName) => {
    localStorage.setItem('access_token', token)
    set({ token, email, userId, fullName, isAuthenticated: true })
  },
  clearAuth: () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    set({ token: null, email: null, userId: null, fullName: null, isAuthenticated: false })
  },
}))
