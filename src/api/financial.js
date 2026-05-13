import client from './client'

export const uploadData = (startupId, formData) =>
  client.post(`/startups/${startupId}/financials/`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })

export const getSummary = (startupId) => client.get(`/startups/${startupId}/financials/summary/`)
export const regenerateSummary = (startupId) => client.post(`/startups/${startupId}/financials/regenerate/`)
