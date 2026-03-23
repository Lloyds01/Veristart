import client from './client'

export const generatePitch = (startupId, data) => client.post(`/startups/${startupId}/pitches/generate/`, data)
export const getPitch = (startupId, pitchId) => client.get(`/startups/${startupId}/pitches/${pitchId}/`)
export const listPitches = (startupId) => client.get(`/startups/${startupId}/pitches/`)
export const downloadPitch = (startupId, pitchId) => client.get(`/startups/${startupId}/pitches/${pitchId}/download/`, { responseType: 'blob' })
