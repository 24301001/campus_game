import request from '@/utils/request'

export const getUserProfile = (userId) => {
  return request({
    url: '/profile/' + userId,
    method: 'get'
  })
}

export const followUser = (targetUserId) => {
  return request({
    url: '/profile/follow/' + targetUserId,
    method: 'post'
  })
}

export const recordView = (problemId) => {
  return request({
    url: '/profile/view/' + problemId,
    method: 'post'
  })
}

export const likeComment = (noteId) => {
  return request({
    url: '/profile/comment/like/' + noteId,
    method: 'post'
  })
}

export const getRankings = (page = 1, size = 20) => {
  return request({
    url: '/profile/rankings',
    method: 'get',
    params: { page, size }
  })
}