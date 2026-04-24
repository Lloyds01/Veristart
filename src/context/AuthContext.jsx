import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { login as apiLogin, signup as apiSignup, logout as apiLogout } from '../api/auth'

const AuthContext = createContext(null)

// Decode JWT and check expiry without any library
const isTokenValid = (token) => {
  if (!token) return false
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    // exp is in seconds, Date.now() is in ms — add 10s buffer
    return payload.exp * 1000 > Date.now() + 10000
  } catch {
    return false
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedToken = localStorage.getItem('access_token')
    const storedUser = localStorage.getItem('user')

    if (storedToken && isTokenValid(storedToken)) {
      // Token exists and is not expired — restore session
      setToken(storedToken)
      if (storedUser) {
        try { setUser(JSON.parse(storedUser)) } catch { /* ignore */ }
      }
    } else {
      // Token missing or expired — clear everything
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
      localStorage.removeItem('user')
    }
    // Always set loading false after check — no flash possible
    setLoading(false)
  }, [])

  const login = useCallback(async (credentials) => {
    const { data } = await apiLogin(credentials)
    // Backend returns { status, access, refresh, user: { id, first_name, last_name, email, user_type, bussiness_name } }
    if (!data.access || !data.user) {
      throw new Error('Invalid login response from server')
    }
    localStorage.setItem('access_token', data.access)
    localStorage.setItem('refresh_token', data.refresh)
    const user = {
      ...data.user,
      full_name: `${data.user.first_name || ''} ${data.user.last_name || ''}`.trim(),
      role: data.user.user_type,
    }
    localStorage.setItem('user', JSON.stringify(user))
    setToken(data.access)
    setUser(user)
    return user
  }, [])

  const signup = useCallback(async (payload) => {
    const { data } = await apiSignup(payload)
    return data
  }, [])

  const logout = useCallback(async () => {
    try { await apiLogout() } catch { /* ignore */ }
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('user')
    setToken(null)
    setUser(null)
  }, [])

  const updateUser = useCallback((updates) => {
    const updated = { ...user, ...updates }
    setUser(updated)
    localStorage.setItem('user', JSON.stringify(updated))
  }, [user])

  return (
    <AuthContext.Provider value={{ user, token, loading, login, signup, logout, updateUser, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
