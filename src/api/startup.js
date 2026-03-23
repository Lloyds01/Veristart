import client from './client'

export const createProfile = (data) => client.post('/startups/', data)
export const updateProfile = (id, data) => client.patch(`/startups/${id}/`, data)
export const getProfile = (id) => client.get(`/startups/${id}/`)
export const getMyProfile = () => client.get('/startups/me/')
export const listStartups = (params) => client.get('/startups/', { params })
