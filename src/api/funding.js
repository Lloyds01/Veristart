import client from './client'

export const listProviders = (params) => client.get('/funding/providers/', { params })
export const applyForFunding = (providerId, data) => client.post(`/funding/providers/${providerId}/apply/`, data)
export const getApplications = () => client.get('/funding/applications/')
export const getApplication = (id) => client.get(`/funding/applications/${id}/`)
