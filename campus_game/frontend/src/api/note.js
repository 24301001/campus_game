import request from '@/utils/request'

export const getNote = (problemId) => {
  return request({
    url: '/note/detail',
    method: 'get',
    params: { problemId }
  })
}

export const getNoteList = (problemId) => {
  return request({
    url: '/note/list',
    method: 'get',
    params: { problemId }
  })
}

export const saveNote = (data) => {
  return request({
    url: '/note/save',
    method: 'post',
    data
  })
}
