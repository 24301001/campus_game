import request from '@/utils/request'

export const getTagList = () => {
  return request({
    url: '/tag/list',
    method: 'get'
  })
}
