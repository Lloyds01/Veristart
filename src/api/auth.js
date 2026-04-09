import client from './client'

export const login = (data) => client.post('/auth/login/', data)
export const signup = (data) => client.post('/auth/register/', data)
export const verifyOTP = (data) => client.post('/auth/verify_otp/', { recipient: data.email, otp: data.otp })
export const resendOTP = (data) => client.post('/auth/resend-otp/', data)
export const forgotPassword = (data) => client.post('/auth/forgot-password/', data)
export const resetPassword = (data) => client.post('/auth/otp-reset-password/', data)
export const changePassword = (data) => client.post('/auth/change-password/', data)
export const refreshToken = (data) => client.post('/auth/token/refresh/', data)
export const logout = () => client.post('/auth/logout/')
export const joinWaitlist = (data) => client.post('/auth/waitlist/', data)
