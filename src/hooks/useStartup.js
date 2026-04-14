import { useState, useEffect } from 'react'
import { getProfile, updateProfile, getHealthScore } from '../api/startup'

export function useStartup() {
  const [startup, setStartup] = useState(null)
  const [healthScore, setHealthScore] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    Promise.all([getProfile(), getHealthScore()])
      .then(([profileRes, healthRes]) => {
        setStartup(profileRes.data)
        setHealthScore(healthRes.data.health_score)
      })
      .catch((err) => setError(err))
      .finally(() => setLoading(false))
  }, [])

  const update = async (data) => {
    const { data: updated } = await updateProfile(data)
    setStartup(updated)
    return updated
  }

  return { startup, healthScore, loading, error, update, setStartup }
}
