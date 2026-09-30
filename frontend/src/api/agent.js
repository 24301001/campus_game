import request from '@/utils/request'

// 算法哥：所有接口都要求登录
export const getAgentStatus = () => {
  return request({ url: '/agent/status', method: 'get' })
}

export const getSessions = () => {
  return request({ url: '/agent/sessions', method: 'get' })
}

export const createSession = (title) => {
  return request({ url: '/agent/session', method: 'post', params: { title } })
}

export const deleteSession = (id) => {
  return request({ url: `/agent/session/${id}`, method: 'delete' })
}

export const getMessages = (sessionId) => {
  return request({ url: '/agent/messages', method: 'get', params: { sessionId } })
}

// 算法哥对当前账号的长期记忆（每个账号一份，互相看不到）
export const getAgentMemory = () => {
  return request({ url: '/agent/memory', method: 'get' })
}

export const clearAgentMemory = () => {
  return request({ url: '/agent/memory', method: 'delete' })
}

export const chatWithAgent = (data) => {
  return request({ url: '/agent/chat', method: 'post', data })
}

// 他不会这题、让算法哥直接写：拿到一份完整代码，前端在编辑器里逐字敲出来
export const solveProblem = (data) => {
  return request({ url: '/agent/solve', method: 'post', data })
}

export const getAnalysis = () => {
  return request({ url: '/agent/analysis', method: 'get' })
}

export const getDaily = () => {
  return request({ url: '/agent/daily', method: 'get' })
}

export const getRank = () => {
  return request({ url: '/agent/rank', method: 'get' })
}

// 错题本：当前账号交过、但一直没 AC 的题（和聊天里那张错题卡片同一份数据）
export const getWrongProblems = () => {
  return request({ url: '/agent/wrong-problems', method: 'get' })
}

export const getLatestPlan = () => {
  return request({ url: '/agent/plan/latest', method: 'get' })
}

export const createPlan = (data) => {
  return request({ url: '/agent/plan', method: 'post', data })
}

export const markPlanItemDone = (id, done = true) => {
  return request({ url: `/agent/plan/item/${id}/done`, method: 'post', params: { done } })
}

// 实时观察：把你的操作报给算法哥，由他决定要不要开口
export const reportEvent = (data) => {
  return request({ url: '/agent/event', method: 'post', data })
}

// 慢通道：AC / WA 这类值得细讲的事件，再要一句大模型写的点评
export const followEvent = (data) => {
  return request({ url: '/agent/event/follow', method: 'post', data })
}
