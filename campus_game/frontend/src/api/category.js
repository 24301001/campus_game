import request from '@/utils/request'

export const getCategoryList = () => {
  return request({
    url: '/category/list',
    method: 'get'
  })
}
