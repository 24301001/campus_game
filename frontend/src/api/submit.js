import request from '@/utils/request'

export const getSubmitList = (params) => {
  return request({
    url: '/submit/list',
    method: 'get',
    params
  })
}

export const getSubmitDetail = (id) => {
  return request({
    url: `/submit/detail/${id}`,
    method: 'get'
  })
}
