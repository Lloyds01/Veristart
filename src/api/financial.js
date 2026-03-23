import client from './client'

export const uploadData = (startupId, data) => client.post(`/startups/${startupId}/financials/`, data)
export const getSummary = (startupId) => client.get(`/startups/${startupId}/financials/summary/`)
export const regenerateSummary = (startupId) => client.post(`/startups/${startupId}/financials/regenerate/`)
