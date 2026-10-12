/**
 * 算法哥的「观察器」：把你在平台上的操作变成事件，报给后端。
 *
 * 分工：**前端负责计时与采样，后端负责该不该开口、说什么**。
 * 停留多久、多久没敲键盘、深夜几点 —— 这些只有前端知道，所以在这里判定；
 * 该不该说、语气、频率，全部由后端的规则引擎决定（前端不做"要不要说"的判断，
 * 否则规则会散在两端）。
 *
 * 关键约束：
 * · 一切上报都要**在你真的在操作**时才发；页面切到后台（document.hidden）不发。
 * · 同一类事件前端先粗筛一道（15 秒内不重复），别把后端当垃圾桶。
 * · 任何失败都静默吞掉 —— 观察层挂了不能影响你写代码。
 */
import { reportEvent, followEvent } from '@/api/agent'

/** 事件类型，必须和后端 AgentWatchService 里的常量一致 */
export const EV = {
  OPEN_PROBLEM: 'OPEN_PROBLEM',
  IDLE_LEAVE_PROBLEM: 'IDLE_LEAVE_PROBLEM',
  BROWSE_TOO_LONG: 'BROWSE_TOO_LONG',
  FIRST_LOGIN: 'FIRST_LOGIN',
  START_CODING: 'START_CODING',
  PASTE_CODE: 'PASTE_CODE',
  NO_INPUT: 'NO_INPUT',
  HEAVY_EDIT: 'HEAVY_EDIT',
  CODE_TOO_LONG: 'CODE_TOO_LONG',
  RUN: 'RUN',
  SUBMIT_AC: 'SUBMIT_AC',
  SUBMIT_WA: 'SUBMIT_WA',
  SUBMIT_CE: 'SUBMIT_CE',
  SUBMIT_TLE: 'SUBMIT_TLE',
  SUBMIT_RE: 'SUBMIT_RE',
  SUBMIT_OTHER: 'SUBMIT_OTHER',
  WA_STREAK_3: 'WA_STREAK_3',
  CE_STREAK_2: 'CE_STREAK_2',
  AC_NEXT_QUICK: 'AC_NEXT_QUICK',
  LONG_SESSION: 'LONG_SESSION',
  NO_PRACTICE_TODAY: 'NO_PRACTICE_TODAY',
  LATE_NIGHT: 'LATE_NIGHT',
  STUCK_30MIN: 'STUCK_30MIN',
  DAILY_NOT_DONE: 'DAILY_NOT_DONE',
  PLAN_DAY_DONE: 'PLAN_DAY_DONE',
  WEAK_TAG_AGAIN: 'WEAK_TAG_AGAIN',
  RANK_UP: 'RANK_UP',
  USER_OPENED_CHAT: 'USER_OPENED_CHAT'
}

// 本地偏好按账号分开存：同一台电脑换个账号登录，话痨档、今日寒暄这些
// 也该是「他自己那份」，不能跟上个账号共用。
const MODES = ['quiet', 'normal', 'chatty']

const currentUserId = () => {
  try {
    const u = JSON.parse(localStorage.getItem('user') || 'null')
    return (u && (u.id || u.userId)) || 'anon'
  } catch (e) {
    return 'anon'
  }
}
const LS_MODE = () => `agent_watch_mode_${currentUserId()}`
const LS_DAY = () => `agent_watch_day_${currentUserId()}`

// ---------- 话痨档位 ----------
export const getMode = () => {
  const raw = localStorage.getItem(LS_MODE())
  return MODES.includes(raw) ? raw : 'normal'
}
export const setMode = (next) => {
  const value = MODES.includes(next) ? next : 'normal'
  localStorage.setItem(LS_MODE(), value)
  return value
}

// ---------- 说话回调 ----------
const listeners = new Set()
/** 订阅「算法哥开口」：回调收到 { text, tone, followUp, eventType } */
export function onSpeak(fn) {
  listeners.add(fn)
  return () => listeners.delete(fn)
}

// ---------- 内部状态 ----------
const TICK_MS = 20000
const IDLE_INPUT_MS = 3 * 60 * 1000      // 3 分钟没敲键盘
const STUCK_MS = 30 * 60 * 1000          // 同一道题卡 30 分钟
const BROWSE_MS = 5 * 60 * 1000          // 题库页挑了 5 分钟
const SESSION_MS = 60 * 60 * 1000        // 连续在线 1 小时
const SEND_GAP_MS = 8000                   // 前端粗筛：同类事件 8 秒内不重发（低于后端同类冷却，不抢戏）

let timer = null
let problemId = null
let problemEnteredAt = 0
let lastTypingAt = 0
let typedCount = 0
let lineCount = 0
let submittedThisProblem = false
let startedCoding = false
let browseEnteredAt = 0
let sessionStartAt = Date.now()
let waStreak = 0
let ceStreak = 0
let acAt = 0
let lastSubmitToday = 0
const lastSentAt = new Map()
const firedOnce = new Set()

const todayKey = () => new Date().toISOString().slice(0, 10)
const isHidden = () => typeof document !== 'undefined' && document.hidden

function once(key) {
  if (firedOnce.has(key)) return false
  firedOnce.add(key)
  return true
}

/** 上报一个事件；force 用于判题这种必须让后端知道的场合 */
export function report(type, extra = {}, force = false) {
  if (!force) {
    const last = lastSentAt.get(type) || 0
    if (Date.now() - last < SEND_GAP_MS) {
      // 前端粗筛就拦掉了（同类 15 秒内不重发）—— 这里也留一条日志，
      // 否则控制台里连"请求都没发"都看不出来，最容易误判成功能坏了
      if (import.meta.env.DEV) {
        console.debug(`[算法哥] ${type} → 不上报：前端粗筛（同类 15 秒内不重发）`)
      }
      return
    }
  }
  lastSentAt.set(type, Date.now())

  reportEvent({
    type,
    problemId: extra.problemId !== undefined ? extra.problemId : problemId,
    value: extra.value,
    detail: extra.detail,
    mode: getMode()
  })
    .then(res => {
      const data = res.data
      if (!data) return
      if (!data.speak || !data.text) {
        /* 「他没说话」的原因只在这里看得到：控制台搜 [算法哥] 即可。
           没这条日志的话，用户在界面上只能看到沉默，分不清是没触发还是在冷却。 */
        if (import.meta.env.DEV) {
          console.debug(`[算法哥] ${type} → 不说：${data.reason || '无原因'}`)
        }
        return
      }
      if (import.meta.env.DEV) {
        console.debug(`[算法哥] ${type} → [${data.tone}] ${data.text}`)
      }
      listeners.forEach(fn => fn({
        text: data.text,
        tone: data.tone,
        followUp: data.followUp,
        eventType: data.eventType
      }))
    })
    .catch(() => { /* 观察层出错不影响刷题 */ })
}

/** 慢通道：拿一句大模型写的点评（可能几秒后才回来） */
export function follow(type, targetProblemId) {
  return followEvent({ type, problemId: targetProblemId })
    .then(res => (res.data || '').trim())
    .catch(() => '')
}

// ---------- 页面生命周期 ----------

export function enterProblem(id) {
  if (String(id) === String(problemId)) return
  problemId = id
  problemEnteredAt = Date.now()
  lastTypingAt = Date.now()
  typedCount = 0
  lineCount = 0
  startedCoding = false
  submittedThisProblem = false
  waStreak = 0
  ceStreak = 0
  report(EV.OPEN_PROBLEM, { problemId: id, force: true })
  // AC 之后 5 秒内就开下一题 → 连刷
  if (acAt && Date.now() - acAt < 5000) report(EV.AC_NEXT_QUICK, { problemId: id })
}

export function leaveProblem() {
  if (!problemId) return
  if (!submittedThisProblem && typedCount < 5) {
    // 进来一个字没写就走了
    report(EV.IDLE_LEAVE_PROBLEM, { problemId })
  }
  problemId = null
  problemEnteredAt = 0
}

export function enterBrowse() {
  browseEnteredAt = Date.now()
  report(EV.NO_PRACTICE_TODAY, { force: true })   // 今天有没有交过由后端算
}

export function leaveBrowse() {
  browseEnteredAt = 0
}

/** 编辑器有输入（由题目页调用） */
export function typing(lines) {
  if (!problemId) return
  lastTypingAt = Date.now()
  typedCount++
  if (typeof lines === 'number') lineCount = lines
  if (!startedCoding && typedCount >= 3) {
    startedCoding = true
    report(EV.START_CODING)
  }
}

/** 粘贴（窗口级监听，只在题目页算数） */
export function pasted(chars) {
  if (!problemId) return
  report(EV.PASTE_CODE, { value: chars }, true)
}

/** 判题结果（由题目页调用） */
export function judged(status, extra = {}) {
  if (!problemId) return
  submittedThisProblem = true
  const now = Date.now()

  if (status === 'ACCEPTED') {
    acAt = now
    waStreak = 0
    ceStreak = 0
    report(EV.SUBMIT_AC, { force: true })
    report(EV.PLAN_DAY_DONE)
    report(EV.RANK_UP)
    lastSubmitToday++
    return
  }

  if (status === 'WRONG_ANSWER') {
    waStreak++
    report(waStreak >= 3 ? EV.WA_STREAK_3 : EV.SUBMIT_WA, { force: true })
    report(EV.WEAK_TAG_AGAIN)
    return
  }

  if (status === 'COMPILE_ERROR') {
    ceStreak++
    report(ceStreak >= 2 ? EV.CE_STREAK_2 : EV.SUBMIT_CE, { force: true })
    return
  }

  if (status === 'TIME_LIMIT_EXCEEDED') { report(EV.SUBMIT_TLE, { force: true }); return }
  if (status === 'RUNTIME_ERROR') { report(EV.SUBMIT_RE, { force: true }); return }
  report(EV.SUBMIT_OTHER, { force: true })
}

/** 只试跑样例，不算提交 */
export function ran() {
  report(EV.RUN)
}

/** 他打开了对话栏 —— 用来让后端解除"降频" */
export function openedChat() {
  report(EV.USER_OPENED_CHAT, { force: true })
}

// ---------- 全局监听与定时器 ----------

function tick() {
  if (isHidden()) return
  const now = Date.now()

  // 今天第一次进来 → 打个招呼（每天只报一次）
  if (localStorage.getItem(LS_DAY()) !== todayKey()) {
    localStorage.setItem(LS_DAY(), todayKey())
    report(EV.FIRST_LOGIN, { force: true })
  }

  // 深夜
  const hour = new Date().getHours()
  if (hour >= 23 && once('late-night-' + todayKey())) {
    report(EV.LATE_NIGHT, { value: hour })
  }

  // 连续在线过久
  if (now - sessionStartAt > SESSION_MS && once('long-session-' + todayKey())) {
    report(EV.LONG_SESSION, { value: Math.round((now - sessionStartAt) / 60000) })
  }

  if (problemId) {
    // 卡住不动
    if (startedCoding && now - lastTypingAt > IDLE_INPUT_MS && once('no-input-' + problemId)) {
      report(EV.NO_INPUT)
    }
    // 反复改
    if (typedCount > 60 && !submittedThisProblem && once('heavy-edit-' + problemId)) {
      report(EV.HEAVY_EDIT, { value: typedCount })
    }
    // 写太长
    if (lineCount > 80 && once('too-long-' + problemId)) {
      report(EV.CODE_TOO_LONG, { value: lineCount })
    }
    // 卡题 30 分钟
    if (now - problemEnteredAt > STUCK_MS && !submittedThisProblem && once('stuck-' + problemId)) {
      report(EV.STUCK_30MIN, { value: Math.round((now - problemEnteredAt) / 60000) })
    }
  } else if (browseEnteredAt && now - browseEnteredAt > BROWSE_MS && once('browse-' + todayKey())) {
    report(EV.BROWSE_TOO_LONG, { value: Math.round((now - browseEnteredAt) / 60000) })
  }

  // 傍晚了今天还一题没交
  if (hour >= 18 && once('no-practice-' + todayKey())) {
    report(EV.NO_PRACTICE_TODAY)
    report(EV.DAILY_NOT_DONE)
  }
}

export function start() {
  if (timer) return
  sessionStartAt = Date.now()
  timer = setInterval(tick, TICK_MS)

  // 粘贴：Monaco 的隐藏输入框会把 paste 冒泡出来
  window.addEventListener('paste', (e) => {
    if (!problemId) return
    const text = (e.clipboardData && e.clipboardData.getData('text')) || ''
    pasted(text.length)
  })

  tick()
}

export function stop() {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
}

/** 退出登录时清干净，别把上一个人的状态带给下一个人 */
export function reset() {
  stop()
  problemId = null
  typedCount = 0
  submittedThisProblem = false
  startedCoding = false
  waStreak = 0
  ceStreak = 0
  firedOnce.clear()
  lastSentAt.clear()
}
