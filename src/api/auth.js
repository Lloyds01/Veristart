import client from './client'

export const login = (data) => client.post('/auth/login/', data)
export const signup = (data) => client.post('/auth/register/', data)
export const verifyOTP = (data) => client.post('/auth/verify-email/', data)
export const resendOTP = (data) => client.post('/auth/resend-otp/', data)
export const refreshToken = (data) => client.post('/auth/token/refresh/', data)
export const logout = () => client.post('/auth/logout/')
export const googleAuth = (token) => client.post('/auth/google/', { token })
