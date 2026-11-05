import request from '@/utils/request'

export const getAdminUserList = (params) => {
  return request({
    url: '/admin/user/list',
    method: 'get',
    params
  })
}

export const updateUserStatus = (userId, status) => {
  return request({
    url: '/admin/user/status',
    method: 'put',
    params: { userId, status }
  })
}

export const getAdminProblemList = (params) => {
  return request({
    url: '/admin/problem/list',
    method: 'get',
    params
  })
}

export const addProblem = (data) => {
  return request({
    url: '/admin/problem/add',
    method: 'post',
    data
  })
}

export const updateProblem = (data) => {
  return request({
    url: '/admin/problem/update',
    method: 'put',
    data
  })
}

export const deleteProblem = (id) => {
  return request({
    url: '/admin/problem/delete',
    method: 'delete',
    params: { id }
  })
}

export const getAdminCategoryList = (params) => {
  return request({
    url: '/admin/category/list',
    method: 'get',
    params
  })
}

export const addCategory = (data) => {
  return request({
    url: '/admin/category/add',
    method: 'post',
    data
  })
}

export const updateCategory = (data) => {
  return request({
    url: '/admin/category/update',
    method: 'put',
    data
  })
}

export const deleteCategory = (id) => {
  return request({
    url: '/admin/category/delete',
    method: 'delete',
    params: { id }
  })
}

export const getAdminSubmitList = (params) => {
  return request({
    url: '/admin/submit/list',
    method: 'get',
    params
  })
}
