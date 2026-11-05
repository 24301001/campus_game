import request from '@/utils/request'

export const compileAndJudge = (data) => {
  return request({
    url: '/judge/compile',
    method: 'post',
    data
  })
}

// 判题机支持的语言（含这台机器上是否真能跑 + 默认模板）
export const getJudgeLanguages = () => {
  return request({
    url: '/judge/languages',
    method: 'get'
  })
}
