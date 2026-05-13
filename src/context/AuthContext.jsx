import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { login as apiLogin, signup as apiSignup, logout as apiLogout, getIndustries } from '../api/auth'

const AuthContext = createContext(null)

const decodeToken = (token) => {
  if (!token) return null
  try {
    return JSON.parse(atob(token.split('.')[1]))
  } catch {
    return null
  }
}

const isTokenValid = (token) => {
  const payload = decodeToken(token)
  if (!payload) return false
  // exp is seconds, Date.now() is ms — 10s buffer
  return payload.exp * 1000 > Date.now() + 10000
}

// Read role from the JWT itself, not from mutable localStorage user object.
// This prevents a user from changing their role by editing localStorage.
const getRoleFromToken = (token) => {
  const payload = decodeToken(token)
  return payload?.user_type || payload?.role || null
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [userRole, setUserRole] = useState(null)
  const [loading, setLoading] = useState(true)
  const [industries, setIndustries] = useState([])

  useEffect(() => {
    const storedToken = localStorage.getItem('access_token')
    const storedUser = localStorage.getItem('user')

    if (storedToken && isTokenValid(storedToken)) {
      setToken(storedToken)
      setUserRole(getRoleFromToken(storedToken))
      if (storedUser) {
        try { setUser(JSON.parse(storedUser)) } catch { /* ignore */ }
      }
    } else {
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
      localStorage.removeItem('user')
    }
    setLoading(false)

    getIndustries().then(({ data }) => setIndustries(data)).catch(() => {})
  }, [])

  const login = useCallback(async (credentials) => {
    const { data } = await apiLogin(credentials)
    if (!data.access || !data.user) {
      throw new Error('Invalid login response from server')
    }
    localStorage.setItem('access_token', data.access)
    localStorage.setItem('refresh_token', data.refresh)
    const role = getRoleFromToken(data.access) || data.user.user_type
    const user = {
      ...data.user,
      full_name: `${data.user.first_name || ''} ${data.user.last_name || ''}`.trim(),
      role,
    }
    localStorage.setItem('user', JSON.stringify(user))
    setToken(data.access)
    setUserRole(role)
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
    setUserRole(null)
    setUser(null)
  }, [])

  const updateUser = useCallback((updates) => {
    const updated = { ...user, ...updates }
    setUser(updated)
    localStorage.setItem('user', JSON.stringify(updated))
  }, [user])

  return (
    <AuthContext.Provider value={{
      user, token, userRole, loading,
      login, signup, logout, updateUser,
      isAuthenticated: !!token,
      industries,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
