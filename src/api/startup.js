import client from './client'

export const getProfile = () => client.get('/startup/profile/')
export const updateProfile = (data) => client.patch('/startup/profile/update/', data)
export const getHealthScore = () => client.get('/startup/profile/health-score/')
export const listStartups = (params) => client.get('/startups/', { params })
