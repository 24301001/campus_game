/**
 * 二期 §3.1.2：本平台被像素校园地图用 iframe 嵌进抽屉时，**绝不弹自己的登录页**。
 *
 * 病因（用户原话）：「登录一次打开别的对话还需要登录的 bug」。全局只该有一张登录门，
 * 它在地图上。抽屉里认不出票，就把这件事报给宿主，让宿主去换票，
 * 而不是在这里再摆一个登录框。
 *
 * ⚠️ 只 `postMessage`、**不去动 `window.top.location`**：401 常常只是某一条请求的
 *    票过期，直接把整个地图页刷走会把玩家的走动状态、开着的别的抽屉一起带走，
 *    比弹一个登录框糟得多。宿主收到消息会静默换票，换不上由地图那张门自己处理。
 */

/** 本平台是不是被嵌在别人页面里（抽屉里）。 */
export function isEmbedded() {
  try {
    return typeof window !== 'undefined' && window.self !== window.top
  } catch (e) {
    return true // 连 window.top 都读不到 ⇒ 一定在被嵌着
  }
}

/**
 * 把「这张票认不出」交回宿主。
 * @param {string} reason 给宿主看的一句话，仅用于日志
 * @returns {boolean} 是否已经接管（true 时调用方**别再** router.push('/login')）
 */
export function handBackToHost(reason = '') {
  if (!isEmbedded()) return false
  try {
    window.parent.postMessage({ type: 'pixelcampus:need-ticket', from: 'agent', reason }, '*')
  } catch (e) {
    /* 宿主没在听、或消息被拦 —— 落到调用方的兜底分支就行。 */
  }
  return true
}

/**
 * 「用户自己按了退出」交回宿主 —— 与 `handBackToHost` 是两条不同的路：
 * 那条是「票认不出，请宿主补一张」，这条是「人主动要走，别再往下面摆页面」。
 *
 * 病因（用户原话）：「点击右上角的退出登录，它会显示『这里不登录』，
 * 但我不希望有这个标识，退出登录就应该直接回大厅」。§3.1.2 之后本平台已经没有
 * 登录页可去，`router.push('/home')` 只会把一张退登后的落地页杵在抽屉里。
 * 宿主（地图）收到这条会收起抽屉、摘掉 iframe，并把四家的票一起作废（§9.2 铁律 4）。
 *
 * @returns {boolean} 是否已交回宿主（true 时调用方不必再 router.push）
 */
export function handExitToHost() {
  if (!isEmbedded()) return false
  try {
    window.parent.postMessage({ type: 'pixelcampus:exit', from: 'agent' }, window.location.origin)
    return true
  } catch (e) {
    /* 宿主没在听 / 消息被拦 —— 落回调用方原来的 router.push('/home')。 */
    return false
  }
}

/**
 * 「要做这事得先登录」那句提示的文案。
 * 抽屉里没有登录页（§3.1.2），所以光说「请先登录」是把人问住 —— 得说清去哪儿登。
 */
export function loginHint() {
  return isEmbedded() ? '按 Esc 退出，在地图上登录一次，再回来。' : '请先登录'
}
