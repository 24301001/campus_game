import request from '@/utils/request'

export const getProblemList = (params) => {
  return request({
    url: '/problem/list',
    method: 'get',
    params
  })
}

export const getProblemDetail = (id) => {
  return request({
    url: `/problem/detail/${id}`,
    method: 'get'
  })
}
