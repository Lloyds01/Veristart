import client from './client'

export const listMembers = (startupId) => client.get(`/startups/${startupId}/team/`)
export const addMember = (startupId, data) => client.post(`/startups/${startupId}/team/`, data)
export const updateMember = (startupId, memberId, data) => client.patch(`/startups/${startupId}/team/${memberId}/`, data)
export const removeMember = (startupId, memberId) => client.delete(`/startups/${startupId}/team/${memberId}/`)
