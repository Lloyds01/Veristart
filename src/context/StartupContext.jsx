import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { getProfile, updateProfile, getHealthScore } from '../api/startup'

const StartupContext = createContext(null)

export function StartupProvider({ children }) {
  const [startup, setStartup] = useState(null)
  const [healthScore, setHealthScore] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const refresh = useCallback(async () => {
    setLoading(true)
    try {
      const [profileRes, healthRes] = await Promise.all([
        getProfile(),
        getHealthScore(),
      ])
      setStartup(profileRes.data)
      setHealthScore(healthRes.data?.health_score ?? 0)
      setError(null)
    } catch (err) {
      // 404 means the founder hasn't created a profile yet — that's OK
      if (err?.response?.status !== 404) setError(err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  const update = useCallback(async (data) => {
    const { data: updated } = await updateProfile(data)
    setStartup(updated)
    return updated
  }, [])

  const patchLocal = useCallback((updates) => {
    setStartup((prev) => (prev ? { ...prev, ...updates } : updates))
  }, [])

  return (
    <StartupContext.Provider value={{
      startup,
      startupId: startup?.id ?? null,
      healthScore,
      loading,
      error,
      update,
      patchLocal,
      refresh,
    }}>
      {children}
    </StartupContext.Provider>
  )
}

export const useStartup = () => {
  const ctx = useContext(StartupContext)
  if (!ctx) throw new Error('useStartup must be used within StartupProvider')
  return ctx
}
