import client from './client'

export const listLenders = (params) => client.get('/lending/providers/', { params })
export const applyForLoan = (lenderId, data) => client.post(`/lending/providers/${lenderId}/apply/`, data)
export const getLoanApplications = () => client.get('/lending/applications/')
export const getLoanApplication = (id) => client.get(`/lending/applications/${id}/`)
