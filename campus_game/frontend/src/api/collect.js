import request from '@/utils/request'

export const addCollect = (problemId) => {
  return request({
    url: '/collect/add',
    method: 'post',
    params: { problemId }
  })
}

export const removeCollect = (problemId) => {
  return request({
    url: '/collect/remove',
    method: 'delete',
    params: { problemId }
  })
}

export const checkCollect = (problemId) => {
  return request({
    url: '/collect/check',
    method: 'get',
    params: { problemId }
  })
}

export const getCollectList = (params) => {
  return request({
    url: '/collect/list',
    method: 'get',
    params
  })
}
