import axios from 'axios'

const client = axios.create({
  baseURL: import.meta.env.DEV ? '' : (import.meta.env.VITE_API_URL || 'http://208.68.37.100'),
  headers: { 'Content-Type': 'application/json' },
})

client.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  if (import.meta.env.DEV) console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`)
  return config
})

client.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default client
