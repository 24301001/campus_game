import request from '@/utils/request'

/** 热门企业列表（带各企业在题库里的真实题目数） */
export const getCompanyList = (params) => {
  return request({
    url: '/company/list',
    method: 'get',
    params
  })
}
