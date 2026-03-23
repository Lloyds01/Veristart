import { useState, useEffect } from 'react'
import { getMyProfile, updateProfile } from '../api/startup'

export function useStartup() {
  const [startup, setStartup] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    getMyProfile()
      .then(({ data }) => setStartup(data))
      .catch((err) => setError(err))
      .finally(() => setLoading(false))
  }, [])

  const update = async (data) => {
    const { data: updated } = await updateProfile(startup.id, data)
    setStartup(updated)
    return updated
  }

  return { startup, loading, error, update, setStartup }
}
