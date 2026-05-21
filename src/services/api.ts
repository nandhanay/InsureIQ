import axios from 'axios'

const API_BASE_URL = 'http://localhost:5000'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor to handle token refresh
let isRefreshing = false
let failedQueue: Array<{ resolve: (value: unknown) => void; reject: (reason?: unknown) => void }> = []

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token)
    }
  })
  failedQueue = []
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`
            return api(originalRequest)
          })
          .catch((err) => Promise.reject(err))
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        const refreshToken = localStorage.getItem('refresh_token')
        if (refreshToken) {
          const response = await axios.post(`${API_BASE_URL}/api/auth/refresh`, {
            refresh_token: refreshToken,
          })

          const { access_token, refresh_token: new_refresh_token } = response.data
          localStorage.setItem('access_token', access_token)
          localStorage.setItem('refresh_token', new_refresh_token)

          processQueue(null, access_token)
          originalRequest.headers.Authorization = `Bearer ${access_token}`
          return api(originalRequest)
        }
      } catch (refreshError) {
        processQueue(refreshError, null)
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        window.location.href = '/'
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  }
)

// ═══════════════════════════════════════
// Auth API
// ═══════════════════════════════════════
export const authAPI = {
  register: async (full_name: string, email: string, password: string) => {
    const response = await api.post('/api/auth/register', { full_name, email, password })
    return response.data
  },
  login: async (email: string, password: string) => {
    const response = await api.post('/api/auth/login', { email, password })
    return response.data
  },
  logout: async () => {
    try {
      await api.post('/api/auth/logout')
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
    }
  },
  getMe: async () => {
    const response = await api.get('/api/auth/me')
    return response.data
  },
}

// ═══════════════════════════════════════
// Profile & Intake API
// ═══════════════════════════════════════
export const profileAPI = {
  submitIntake: async (data: Record<string, unknown>) => {
    const payload = {
      name: data.name,
      age: Number(data.age),
      gender: data.gender,
      city: data.city,
      state: data.state,
      marital_status: data.maritalStatus,
      dependants: Number(data.dependants) || 0,
      income_bracket: data.incomeBracket,
      existing_coverage: data.existingCoverage,
      monthly_budget: Number(data.monthlyBudget) || 1500,
      height: Number(data.height),
      weight: Number(data.weight),
      smoking: Boolean(data.smoking),
      alcohol: Boolean(data.alcohol),
      chronic_conditions: data.chronicConditions || [],
      family_history: data.familyHistory || [],
      past_surgeries: data.pastSurgeries || '',
      documents_uploaded: Boolean(data.documentsUploaded),
    }
    const response = await api.post('/api/profile/intake', payload)
    return response.data
  },
  getProfile: async () => {
    const response = await api.get('/api/profile/me')
    return response.data
  },
}

// ═══════════════════════════════════════
// Plans API
// ═══════════════════════════════════════
export const plansAPI = {
  listPlans: async () => {
    const response = await api.get('/api/plans')
    return response.data
  },
  getPlan: async (id: string) => {
    const response = await api.get(`/api/plans/${id}`)
    return response.data
  },
}

// ═══════════════════════════════════════
// Recommendations API
// ═══════════════════════════════════════
export const recommendationsAPI = {
  getRecommendations: async () => {
    const response = await api.get('/api/recommendations')
    return response.data
  },
}

// ═══════════════════════════════════════
// Documents API
// ═══════════════════════════════════════
export const documentsAPI = {
  extractDocument: async (file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    const response = await api.post('/api/documents/extract', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 60000, // 60s timeout for Gemini processing
    })
    return response.data
  },
}

// ═══════════════════════════════════════
// Forecast API
// ═══════════════════════════════════════
export const forecastAPI = {
  getForecasts: async () => {
    const response = await api.get('/api/forecast')
    return response.data
  },
  simulate: async (params: { income: string; new_condition: string; coverage_increase: number }) => {
    const response = await api.post('/api/forecast/simulate', params)
    return response.data
  },
}

// ═══════════════════════════════════════
// Compare API
// ═══════════════════════════════════════
export const compareAPI = {
  comparePlans: async (planIds: string[]) => {
    const response = await api.get('/api/compare', {
      params: { plan_ids: planIds.join(',') },
    })
    return response.data
  },
}

// ═══════════════════════════════════════
// Watchlist API
// ═══════════════════════════════════════
export const watchlistAPI = {
  getWatchlist: async () => {
    const response = await api.get('/api/watchlist')
    return response.data
  },
  toggleWatchlist: async (planId: string) => {
    const response = await api.post('/api/watchlist/toggle', { plan_id: planId })
    return response.data
  },
}

export default api
