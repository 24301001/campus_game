import request from '@/utils/request'

export const login = (data) => {
  return request({
    url: '/auth/login',
    method: 'post',
    data
  })
}

export const register = (data) => {
  return request({
    url: '/auth/register',
    method: 'post',
    data
  })
}

export const sendVerificationEmail = (data) => {
  return request({
    url: '/auth/send-verification-email',
    method: 'post',
    data
  })
}

export const verifyEmail = (data) => {
  return request({
    url: '/auth/verify-email',
    method: 'post',
    data
  })
}

export const checkVerificationStatus = (email) => {
  return request({
    url: '/auth/check-verification-status',
    method: 'get',
    params: { email }
  })
}

export const getUserInfo = () => {
  return request({
    url: '/user/info',
    method: 'get'
  })
}

export const updateUser = (data) => {
  return request({
    url: '/user/update',
    method: 'put',
    data
  })
}

export const updatePassword = (data) => {
  return request({
    url: '/user/password',
    method: 'post',
    data
  })
}

export const getUserStats = () => {
  return request({
    url: '/user/stats',
    method: 'get'
  })
}

export const uploadAvatar = (file) => {
  const formData = new FormData()
  formData.append('file', file)
  return request({
    url: '/file/upload/avatar',
    method: 'post',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}
