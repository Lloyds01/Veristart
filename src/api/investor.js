import client from './client'

export const getInvestorStats = () => client.get('/investor/stats/')
export const listSavedStartups = () => client.get('/investor/saved-startups/')
export const saveStartup = (startupId) => client.post('/investor/saved-startups/', { startup_id: startupId })
export const unsaveStartup = (savedId) => client.delete(`/investor/saved-startups/${savedId}/`)
export const getPortfolio = () => client.get('/investor/portfolio/')
export const expressInterest = (startupId, data) => client.post('/investor/interests/', { startup_id: startupId, ...data })
export const getStartupFinancials = (startupId) => client.get(`/startups/${startupId}/financials/summary/`)
export const downloadStartupPitch = (startupId) => client.get(`/startups/${startupId}/pitches/latest/download/`, { responseType: 'blob' })
