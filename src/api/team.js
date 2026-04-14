import client from './client'

export const listMembers = () => client.get('/startup/team/')
export const addMember = (data) => client.post('/startup/team/add/', data)
export const updateMemberHeadshot = (memberId, data) => client.patch(`/startup/team/${memberId}/headshot/`, data)
