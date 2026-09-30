<template>
  <div v-if="visible" class="watch" :class="{ sleeping: faceState === 'sleep', dragging }" :style="watchStyle">
    <!-- 左下角舞台：他主动搭话时、或你点开了对话时出现。
         左边是算法哥的立绘，右边跟着"完整对话面板"或"一张字幕"——
         他自动说话时只给字幕，不弹对话框；点右上角头像才展开完整对话。 -->
    <transition name="rise">
      <section v-if="stageOpen" class="stage">
        <div class="stand">
          <!-- 半身立绘：四张图放在 frontend/public/agent/ 下（常态 / 说话1 / 说话2 / 生气），
               换图不用改代码；没放图也不报错，走下面的剪影兜底。 -->
          <div class="portrait" :class="{ talking: isSpeaking, angry: isAngry }">
            <img
              v-if="!portraitFailed"
              :src="portraitSrc"
              alt="算法哥"
              @error="portraitFailed = true"
            />
            <svg v-else class="silhouette" viewBox="0 0 100 130" role="img" aria-label="算法哥">
              <circle cx="50" cy="40" r="22" fill="#4a5364" />
              <path d="M12 130c0-25 17-42 38-42s38 17 38 42z" fill="#4a5364" />
              <rect x="33" y="30" width="34" height="6" fill="#ffd76e" />
            </svg>
            <span v-if="portraitFailed" class="portrait-hint">未放立绘<br>public/agent/</span>
          </div>
          <div class="plate">
            <b>算法哥</b>
            <i>{{ llmReady ? '在线 · 已接大模型' : '在线 · 未接大模型' }}</i>
          </div>
        </div>

        <!-- 你点开了对话 → 完整的台词面板；他只是插一嘴 → 只给一张字幕 -->
        <div v-if="panelOpen" class="talk">
          <header class="panel-head">
            <span class="talk-hint">{{ headHint }}</span>
            <button class="panel-btn" title="打开完整界面（题目、题单、排名都在那）" @click="openFull">完整界面</button>
            <button class="panel-btn close" title="收起" @click="panelOpen = false">✕</button>
          </header>

          <div ref="msgsRef" class="panel-body" @click="onBodyClick">
            <div v-if="!thread.length" class="panel-welcome">
              我是算法哥。刷题、判题、看代码都是我的活。<br>
              直接说要什么：「来道简单题」「找道动态规划的题」「打开两数之和」，我自己去题库翻。
            </div>
            <div
              v-for="message in thread"
              :key="message.id"
              class="wm"
              :class="[message.role, message.tone ? 'tone-' + message.tone : '']"
            >
              <div class="wm-bd" v-html="renderMarkdown(message.content)"></div>
            </div>
            <div v-if="sending" class="wm assistant">
              <div class="wm-bd typing"><span></span><span></span><span></span></div>
            </div>
          </div>

          <div class="panel-quick">
            <button v-for="tip in quick" :key="tip.q" @click="send(tip.q)">{{ tip.t }}</button>
          </div>

          <div class="panel-input">
            <textarea
              ref="inputRef"
              v-model="input"
              rows="1"
              placeholder="问算法哥：这题为什么超时？分析一下我的短板…"
              @keydown.enter.exact.prevent="send()"
            ></textarea>
            <button class="send" :disabled="sending" @click="send()">发送</button>
          </div>
        </div>

        <!-- 他只是插一嘴 → 只有这张字幕，点一下才展开对话 -->
        <div v-else class="bubble speech" :class="bubbleTone" @click="openPanel">
          <div class="bubble-text">{{ bubble }}</div>
          <div v-if="thinking" class="bubble-thinking">
            <span></span><span></span><span></span>
            <em>正在细看你的代码…</em>
          </div>
          <div class="bubble-foot">点我接着说 →</div>
        </div>
      </section>
    </transition>

    <!-- 头像（动漫头部：点它开对话、双击拍拍他、按住能拖到屏幕任意位置） -->
    <button class="avatar" :class="[`tone-${ringTone}`, { talking: avatarTalking, patted }]"
            :title="title" @click="onAvatarClick" @dblclick="onPat" @pointerdown="onDragStart">
      <span class="ring"></span>
      <img class="face" :src="avatarSrc" alt="算法哥"
           @error="$event.target.style.visibility = 'hidden'" />
      <span v-if="unread && !panelOpen" class="badge">{{ unread }}</span>
    </button>

    <!-- 拖着走 / 被拍时他念叨的那句：挂在头像旁边，跟着一起动 -->
    <div v-if="quip" class="quip-bubble" :class="{ flip: quipFlip }">{{ quip }}</div>

    <!-- 话痨档 + 在线状态点 -->
    <div class="meta">
      <button class="mode" :title="'话痨档：' + MODE_HINT[mode] + '（点击切换）'" @click="cycleMode">
        {{ MODE_LABEL[mode] }}
      </button>
      <span class="dot" :class="{ off: !llmReady }"></span>
    </div>
  </div>
</template>

<script setup>
import { computed, nextTick, onUnmounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/user'
import { chatWithAgent, getAgentStatus, getMessages, getSessions } from '@/api/agent'
import { handleMarkdownClick, renderMarkdown } from '@/utils/markdown'
import {
  follow, getMode, onSpeak, openedChat, setMode, start, stop, reset,
  enterProblem, leaveProblem, enterBrowse, leaveBrowse
} from '@/utils/agentWatcher'
import { parseAction, findProblem } from '@/utils/agentActions'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const isAdmin = computed(() => userStore.user?.role === 'ADMIN')

// ---- 外层：气泡 + 头像 ----
const bubble = ref('')
const bubbleTone = ref('remind')
const thinking = ref(false)
const unread = ref(0)
const idleAt = ref(Date.now())
const now = ref(Date.now())
const mode = ref(getMode())
const llmReady = ref(false)

// ---- 面板：对话 ----
const panelOpen = ref(false)
const thread = ref([])
const input = ref('')
const sending = ref(false)
const sessionId = ref(null)
const msgsRef = ref(null)
const inputRef = ref(null)

const quick = [
  { t: '每日一题', q: '每日一题' },
  { t: '学情诊断', q: '给我做一次学情分析，指出我的短板和处方' },
  { t: '刷题题单', q: '给我排一份刷题计划，每天 3 题，练 7 天' },
  { t: '排名', q: '我现在的排名怎么样' },
  { t: '这题为什么错', q: '我刚才那次提交为什么没过' }
]

/** 被 iframe 嵌进来时不显示（地图里的刷题抽屉自带入口） */
const visible = computed(() =>
  !!userStore.token
  && window.self === window.top
  && !route.path.startsWith('/login')
  && !route.path.startsWith('/register')
  && route.path !== '/agent'
)

/** 当前题目（面板里提问时带上，他才知道你在说哪道题） */
const currentProblemId = computed(() => {
  const matched = route.path.match(/^\/problem\/(\d+)/)
  return matched ? matched[1] : null
})

const MODE_LABEL = { quiet: '安静', normal: '克制', chatty: '活跃' }
const MODE_HINT = {
  quiet: '安静（只在判题时开口，两次间隔约 20 秒）',
  normal: '克制（判题 + 关键提醒，两次间隔约 10 秒）',
  chatty: '活跃（连敲代码都点评，两次间隔约 5 秒）'
}
const title = computed(() =>
  panelOpen.value ? '收起对话' : `点我聊两句 · 话痨档：${MODE_HINT[mode.value]}`)

/** 睡着：5 分钟没说话也没理他（面板开着就不睡） */
const faceState = computed(() => {
  if (bubble.value || panelOpen.value) return 'speak'
  return now.value - idleAt.value > 5 * 60 * 1000 ? 'sleep' : 'idle'
})
const ringTone = computed(() => (thinking.value ? 'thinking' : bubbleTone.value))

/* ---------------- 半身立绘 ----------------
   图片是「资源」不是「代码」：四张立绘放 frontend/public/agent/，换图同名覆盖即可。
   - algo-bro.png        常态（抱着书）
   - algo-bro-talk1.png  说话 · 扶眼镜
   - algo-bro-talk2.png  说话 · 抬手比划（和 talk1 轮流用，嘴不会一直同一个姿势）
   - algo-bro-angry.png  生气（你反复问同一个问题、或同一道题反复错）
   四张都已经裁成同一尺寸、头部对齐，切换时人物不会跳。 */
const PORTRAIT = {
  idle: '/agent/algo-bro.png',
  talk: ['/agent/algo-bro-talk1.png', '/agent/algo-bro-talk2.png'],
  angry: '/agent/algo-bro-angry.png'
}
const portraitFailed = ref(false)
const talkFlip = ref(0)
const isAngry = ref(false)

/** 他正在说话：面板在等回复、慢通道在想、或者他正在冒话 */
const isSpeaking = computed(() => sending.value || thinking.value || !!bubble.value)

const portraitSrc = computed(() => {
  if (isAngry.value) return PORTRAIT.angry
  if (isSpeaking.value) return PORTRAIT.talk[talkFlip.value % 2]
  return PORTRAIT.idle
})

/** 每开一次口换一张说话的图，两张轮流 */
watch(isSpeaking, (value) => {
  if (value) talkFlip.value++
})

/* 生气：接下来这段时间都用生气的样子说话。
   只有两种情况会让他翻脸——同一道题连着错够多次，或同一个问题原样问第 3 遍。 */
let angryTimer = null
function makeAngry(ms = 5000) {
  isAngry.value = true
  clearTimeout(angryTimer)
  angryTimer = setTimeout(() => { isAngry.value = false }, ms)
}

/** 舞台什么时候在：他冒话时、或你点开了对话 */
const stageOpen = computed(() => panelOpen.value || !!bubble.value)

/* ---------------- 代写代码：他写完之后的「要不要讲解」 ---------------- */

/** 最近一次替他写的代码 —— 他说「要」的时候拿这份去问讲解 */
const lastWritten = ref(null)
/** 「要 / 讲讲 / 好」这类回应；只有在刚写完代码时才当成"我要听讲解" */
const WANT_EXPLAIN = /^(要|好|行|嗯|可以|好呀|要的|来吧|讲讲|讲一下|讲一讲|讲|说说|解释|解释下|解释一下)/

const LANG_TAG = { JAVA: 'java', CPP: 'cpp', C: 'c', PYTHON: 'python', JAVASCRIPT: 'javascript' }

/** 「今天做了啥」这类问法统一走这句提问，让他的回答盯在当日数据上，而不是自由发挥 */
const TODAY_ASK = '用你手上的真实数据，给我一份今天的战报：今天交了几次、AC 几次、做了哪几道题、'
  + '大概几点做的、有没有同一题连着交好几次。五句话以内，别客套。'

/** 台词区顶部一行小字：让他看起来"正在做事" */
const headHint = computed(() => {
  if (sending.value) return '正在翻你的提交记录…'
  if (currentProblemId.value) return `正在看第 ${currentProblemId.value} 题`
  return '刷题、判题、看代码都是我的活'
})

// ---------------- 头像 ----------------
/* 头像就是从立绘上裁出来的头部（frontend/public/agent/avatar*.png）。
   平时是常态那张；点开对话、或他正在说话时换成"说话的样子"，两张轮流。 */
const AVATAR = {
  idle: '/agent/avatar.png',
  talk: ['/agent/avatar-talk1.png', '/agent/avatar-talk2.png'],
  angry: '/agent/avatar-angry.png'
}

/** 头像什么时候切成说话的样子：对话面板开着，或他正在说话 */
const avatarTalking = computed(() => panelOpen.value || isSpeaking.value)

const avatarSrc = computed(() => {
  if (isAngry.value) return AVATAR.angry
  return avatarTalking.value ? AVATAR.talk[talkFlip.value % 2] : AVATAR.idle
})

/** 提前把立绘和头像拉进缓存，切换表情时不会闪一下白 */
function preloadFaces() {
  [...Object.values(PORTRAIT).flat(), ...Object.values(AVATAR).flat()].forEach((src) => {
    const img = new Image()
    img.src = src
  })
}

// ---------------- 主动说话（观察层） ----------------

let hideTimer = null
let clockTimer = null

/** 他主动开口：面板开着就直接进对话，否则冒气泡。
    holdMs 可以单独指定气泡停留时长（讲概念题时内容长，要多留一会儿）。 */
function say(text, tone, isFollowUp = false, holdMs = null) {
  idleAt.value = Date.now()
  if (panelOpen.value) {
    push('assistant', text, tone)
    return
  }
  bubble.value = text
  bubbleTone.value = tone || 'remind'
  unread.value++
  thinking.value = false
  clearTimeout(hideTimer)
  hideTimer = setTimeout(() => {
    bubble.value = ''
    idleAt.value = Date.now()
  }, holdMs || (isFollowUp ? 12000 : 8000))
}

function push(role, content, tone) {
  thread.value.push({ id: `${role}-${Date.now()}-${thread.value.length}`, role, content, tone })
  scrollToBottom()
}

async function scrollToBottom() {
  await nextTick()
  if (msgsRef.value) msgsRef.value.scrollTop = msgsRef.value.scrollHeight
}

// ---------------- 拖着走 / 拍一拍 ----------------
/* 按住头像能把他拎到屏幕上任意位置，松手后位置记进 localStorage，刷新后还在原处。
   双击头像 = 拍拍他，他会晃一下并回你一句。
   拖动和点击必须分开：位移没超过阈值就算点击（照常开对话），超过了才算拖。
   拖的过程中他嘴里不停念叨——被拎着走的是他，总得有点反应。 */

const POS_KEY = 'px-agent-watch-pos'
/** 位移超过这个像素数才算「拖」，否则当成点了一下 */
const DRAG_THRESHOLD = 4

/** 拖动中轮着说的，都是短句——他是被拎着的那个，话说长了没气势 */
const DRAG_LINES = [
  '哎，慢点，脑袋晃晕了。',
  '你晃我干嘛？',
  '轻拿轻放——我脑子里还在跑 DP。',
  '别转圈，转久了我就 O(∞) 了。',
  '行行行，你想搁哪儿就搁哪儿。',
  '稳住，别把我甩出去。'
]

/** 松手落位时说的：位置真存下来了，所以「下次还在这儿」不是空话 */
const DRAG_DONE_LINES = [
  '就这儿吧，视野还行。',
  '行，安家了。',
  '位置记下了，下次还在这儿。'
]

/** 双击拍他时说的：他没真生气，就是嘴上不能输 */
const PAT_LINES = [
  '拍我干嘛？我又不会掉 AC。',
  '在呢。有事说事，没事我继续盯着你的提交记录。',
  '手感不错吧？可惜就是屏幕上一个头。',
  '别拍了——再拍我就当你要问问题了。',
  '拍一下能多过一个用例，你就使劲拍。',
  '轻点，我脑袋里还装着你的错题呢。'
]

/** 拍超过这个数他就翻脸（第 9 下开始） */
const PAT_LIMIT = 8

/** 翻脸时说的：一边生气一边给你派题，说完就把你拎到题目页去 */
const SNAP_LINES = [
  '拍够了没有？手这么闲，那题肯定做得很好——这道归你了。',
  '拍上瘾了是吧？行，我不陪你玩了，给你挑了一道，去写。',
  '行，你赢了。但你也没好果子吃——这题拿去。'
]

const pos = ref(loadPos())
const dragging = ref(false)
const patted = ref(false)
/** 被拍了多少下（累计，够 PAT_LIMIT+1 下就翻脸） */
let patCount = 0
/** 他此刻嘴边那句话（拖动念叨的、或被拍之后回的） */
const quip = ref('')

/** 没拖过就返回空对象，继续走 CSS 里默认的右上角 */
const watchStyle = computed(() => (pos.value
  ? { left: pos.value.left + 'px', top: pos.value.top + 'px', right: 'auto' }
  : {}))

/** 拖到屏幕左半边时，台词翻到头像右边去，别顶出屏幕（最长那句约 224px 宽） */
const quipFlip = computed(() => !!pos.value && pos.value.left < 260)

function loadPos() {
  try {
    const raw = localStorage.getItem(POS_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    return (parsed && typeof parsed.left === 'number' && typeof parsed.top === 'number')
      ? parsed
      : null
  } catch (e) {
    return null
  }
}

function savePos(value) {
  try {
    localStorage.setItem(POS_KEY, JSON.stringify(value))
  } catch (e) {
    /* 存不下就算了，下次回到默认位置而已 */
  }
}

/** 别让他被拖出视口（窗口变小也拉回来） */
function clampPos(value) {
  const width = 62
  const height = 82
  return {
    left: Math.min(Math.max(0, value.left), Math.max(0, window.innerWidth - width)),
    top: Math.min(Math.max(0, value.top), Math.max(0, window.innerHeight - height))
  }
}

/** 不连着说同一句，免得像卡带 */
let lastLine = ''
function pickLine(list) {
  let line = list[Math.floor(Math.random() * list.length)]
  if (list.length > 1 && line === lastLine) {
    line = list[(list.indexOf(line) + 1) % list.length]
  }
  lastLine = line
  return line
}

let lineTimer = null
let dropTimer = null
let patTimer = null

function startLines() {
  quip.value = pickLine(DRAG_LINES)
  lineTimer = setInterval(() => { quip.value = pickLine(DRAG_LINES) }, 900)
}

function stopLines() {
  clearInterval(lineTimer)
  lineTimer = null
}

/** 让一句台词露个脸再收走 */
function showQuip(lines, holdMs) {
  quip.value = pickLine(lines)
  clearTimeout(dropTimer)
  dropTimer = setTimeout(() => { quip.value = '' }, holdMs)
}

/* ---------------- 拍拍他 ----------------
   双击头像 = 拍一下：他晃一晃，回你一句。
   单击要开对话、双击要拍他，两者会抢同一个 click —— 所以单击先压一下（SINGLE_DELAY），
   双击来了就把那个待办撤掉。代价是开对话慢一点点，但总比拍他被弹一屏对话框强。 */
const SINGLE_DELAY = 220
let clickTimer = null

function onAvatarClick() {
  // 刚拖完那一下，浏览器还会补一个 click —— 那不是「点他」，别顺手把对话打开
  if (Date.now() - dragEndedAt < 350) return
  if (clickTimer) return          // 已经排上了，等着看是不是双击
  clickTimer = setTimeout(() => {
    clickTimer = null
    togglePanel()
  }, SINGLE_DELAY)
}

function onPat() {
  clearTimeout(clickTimer)
  clickTimer = null
  idleAt.value = Date.now()       // 拍一下他就醒了，别还挂着"睡着"的半透明
  // 先把上一次的动画停掉，才能再播一遍（同一个 class 连着加是不会重播的）
  patted.value = false
  requestAnimationFrame(() => { patted.value = true })
  clearTimeout(patTimer)
  patTimer = setTimeout(() => { patted.value = false }, 460)

  patCount++
  if (patCount > PAT_LIMIT) {
    snapAndAssign()
    return
  }
  showQuip(PAT_LINES, 2200)
}

/** 拍太多下他就翻脸：顶着生气的脸给你派一道题，然后把你送到题目页去 */
async function snapAndAssign() {
  patCount = 0                    // 从头再数——想再惹他一次，还得再拍够那么多下
  makeAngry(9000)
  // 这句长，用左下角那块带立绘的舞台说（头像旁边的气泡是单行的，放不下）
  say(pickLine(SNAP_LINES), 'warn', true, 9000)
  try {
    // 真去题库里挑一道（不指定难度/标签），挑到了再跳
    const found = await findProblem({ id: 'find-problem', difficulty: null, tag: null, title: null })
    if (!found.path) {
      say('……题库这会儿没翻开，先饶你一回。', 'warn', true, 5000)
      return
    }
    setTimeout(() => { router.push(found.path) }, 900)
  } catch (e) {
    /* 题库拉不动就算了，气已经生过了 */
  }
}

let dragStart = null
let moved = false
/** 刚拖完的那一下会跟着冒出一个 click，用时间戳把它挡掉 */
let dragEndedAt = 0

function onDragStart(event) {
  if (event.button && event.button !== 0) return      // 只认左键
  const host = event.currentTarget.closest('.watch')
  const rect = host.getBoundingClientRect()
  dragStart = { x: event.clientX, y: event.clientY, left: rect.left, top: rect.top }
  moved = false
  try {
    event.currentTarget.setPointerCapture(event.pointerId)
  } catch (e) {
    /* 不支持捕获也能拖，靠 window 上的监听 */
  }
  window.addEventListener('pointermove', onDragMove)
  window.addEventListener('pointerup', onDragEnd)
}

function onDragMove(event) {
  if (!dragStart) return
  const dx = event.clientX - dragStart.x
  const dy = event.clientY - dragStart.y
  if (!moved && Math.abs(dx) + Math.abs(dy) < DRAG_THRESHOLD) return
  if (!moved) {
    moved = true
    dragging.value = true
    startLines()
  }
  pos.value = clampPos({ left: dragStart.left + dx, top: dragStart.top + dy })
}

function onDragEnd() {
  window.removeEventListener('pointermove', onDragMove)
  window.removeEventListener('pointerup', onDragEnd)
  dragStart = null
  if (moved) {
    savePos(pos.value)
    stopLines()
    dragEndedAt = Date.now()
    // 松手再说最后一句，让他「落地」有交代
    showQuip(DRAG_DONE_LINES, 1800)
  }
  dragging.value = false
}

/** 窗口尺寸变了，把存下来的位置重新夹回可视区 */
function onResize() {
  if (pos.value) {
    pos.value = clampPos(pos.value)
    savePos(pos.value)
  }
}

// ---------------- 面板 ----------------

async function togglePanel() {
  panelOpen.value = !panelOpen.value
  if (!panelOpen.value) return
  talkFlip.value++          // 每点开一次换一张"说话的样子"，两张轮流
  bubble.value = ''
  unread.value = 0
  openedChat()
  refreshStatus()
  await loadThread()
  await nextTick()
  if (inputRef.value) inputRef.value.focus()
}

function openPanel() {
  if (!panelOpen.value) togglePanel()
}

function openFull() {
  panelOpen.value = false
  openedChat()
  router.push('/agent')
}

async function refreshStatus() {
  try {
    const res = await getAgentStatus()
    llmReady.value = !!res.data.llmReady
  } catch (e) {
    llmReady.value = false
  }
}

/** 打开面板时接着最近那段对话，跟完整界面共用同一份记录 */
async function loadThread() {
  if (thread.value.length) return
  try {
    const res = await getSessions()
    const list = res.data || []
    if (!list.length) return
    sessionId.value = list[0].id
    const history = await getMessages(sessionId.value)
    thread.value = (history.data || []).slice(-8).map((item) => ({
      id: `h-${item.id}`,
      role: item.role === 'user' ? 'user' : 'assistant',
      content: item.content
    }))
    await scrollToBottom()
  } catch (e) {
    /* 拉不到历史不影响聊天 */
  }
}

/** 同一个问题反复问 → 他会不耐烦，接着说话就换成生气的样子。
    只认「一字不差的重复」：问过两遍又来一遍（第 3 次）才算，别问点沾边的就翻脸。 */
const askedList = ref([])
const REPEAT_ASK_TIMES = 3

function normalizeQuestion(text) {
  return text.replace(/[\s，。？！、,.?!~;；:：（）()【】[\]"“”'‘’·…\-]/g, '').toLowerCase()
}

async function send(text) {
  const content = (text === undefined ? input.value : text).trim()
  if (!content || sending.value) return
  const normalized = normalizeQuestion(content)
  const askedTimes = askedList.value.filter((item) => item === normalized).length + 1
  askedList.value = [...askedList.value, normalized].slice(-30)
  if (askedTimes >= REPEAT_ASK_TIMES) makeAngry()
  input.value = ''

  // 刚替他写完代码，他说「要 / 讲讲」——那是要听讲解，把那份代码一起递过去
  if (lastWritten.value && WANT_EXPLAIN.test(content)) {
    const item = lastWritten.value
    lastWritten.value = null
    push('user', content)
    sending.value = true
    try {
      const ask = `讲讲这道题（#${item.problemId} ${item.title}）的解法。代码是你刚帮我写的这份：\n`
        + '```' + (LANG_TAG[item.language] || '') + '\n' + item.code + '\n```\n'
        + '讲思路和关键点，别复述代码。'
      const res = await chatWithAgent({ sessionId: sessionId.value, content: ask, problemId: item.problemId })
      sessionId.value = res.data.sessionId
      push('assistant', res.data.reply)
    } catch (e) {
      push('assistant', '讲解的时候卡住了，过会儿再问我。')
    } finally {
      sending.value = false
    }
    return
  }

  push('user', content)

  // 先看这句是不是在支使他干活（切页面 / 找题 / 代写 / 顺带出题单），是的话他直接动手，不用问大模型
  const action = parseAction(content, { isAdmin: isAdmin.value })
  if (action) {
    // 「今天做了啥」：就在这儿用真实数据报一遍，不跳页
    if (action.id === 'today-report') {
      sending.value = true
      try {
        const res = await chatWithAgent({
          sessionId: sessionId.value,
          content: TODAY_ASK,
          problemId: currentProblemId.value
        })
        sessionId.value = res.data.sessionId
        push('assistant', res.data.reply)
      } catch (e) {
        push('assistant', '今天的账没算出来，过会儿再问我。')
      } finally {
        sending.value = false
      }
      return
    }
    // 「帮我写这道题」：先把题定下来，再跳过去让他把代码敲进编辑器
    if (action.id === 'write-code') {
      let problemId = currentProblemId.value
      if (action.title || action.tag || action.difficulty) {
        const found = await findProblem(action)
        if (!found.path) {
          push('assistant', found.reply, 'hint')
          return
        }
        problemId = found.path.split('/').pop()
      }
      if (!problemId) {
        push('assistant', '哪道题？给我个题名或者题号，我这就写。', 'hint')
        return
      }
      push('assistant', '行，我写。你看着，别眨眼。', 'hint')
      // 他要是指定了语言（「用 Python 写」），一起带过去
      const langQuery = action.language ? `&lang=${action.language}` : ''
      const target = `/problem/${problemId}?agentSolve=${Date.now()}${langQuery}`
      if (currentProblemId.value === problemId) {
        router.replace(target)     // 就在这题：只换 query，题目页那个 watch 会接住
      } else {
        router.push(target)
      }
      return
    }
    // 找题得真去题库翻（按难度 / 类型 / 题目名），翻到了再把题摊开
    if (action.id === 'find-problem') {
      const found = await findProblem(action)
      push('assistant', found.reply, 'hint')
      if (found.path) {
        setTimeout(() => router.push(found.path), 420)
      }
      return
    }
    push('assistant', action.reply, 'hint')
    // 判题报告得知道是哪道题，把当前这道题的题号一起带过去
    const target = action.id === 'judge' && currentProblemId.value
      ? `/agent?problemId=${currentProblemId.value}&ask=judge`
      : action.path
    if (target) {
      // 让台词先露个脸，再切页面
      setTimeout(() => router.push(target), 420)
    }
    return
  }

  sending.value = true
  try {
    const res = await chatWithAgent({
      sessionId: sessionId.value,
      content,
      problemId: currentProblemId.value
    })
    sessionId.value = res.data.sessionId
    push('assistant', res.data.reply)
    // 他用对话改了个人资料 → 刷新缓存的用户信息，右上角昵称立刻跟上
    if (res.data.payload && res.data.payload.type === 'profile') {
      userStore.fetchUserInfo().catch(() => {})
    }
  } catch (e) {
    push('assistant', '我这边出了点问题，检查一下后端服务或者 `agent.llm.api-key`。')
  } finally {
    sending.value = false
    await nextTick()
    if (inputRef.value) inputRef.value.focus()
  }
}

function cycleMode() {
  const order = ['quiet', 'normal', 'chatty']
  const next = order[(order.indexOf(mode.value) + 1) % order.length]
  mode.value = setMode(next)
  ElMessage({ message: `话痨档：${MODE_HINT[mode.value]}`, type: 'info', duration: 2500 })
}

const onBodyClick = (event) => handleMarkdownClick(event)

// ---------------- 生命周期 ----------------

let offSpeak = null

/** 题目页把代码敲完了 → 他冒出来问一句要不要讲解 */
function onCodeDone(event) {
  const detail = event.detail || {}
  lastWritten.value = detail
  const note = (detail.note || '写完了').trim()
  say(`${note} 要不要我讲一遍为什么这么写？`, 'hint', true)
}

/** 八股文概念题 / SQL 题没有可运行的代码 → 把讲解或 SQL 原样讲出来 */
function onExplain(event) {
  const text = ((event.detail && event.detail.text) || '').trim()
  if (text) say(text, 'hint', true, 60000)
}

watch(visible, (value) => {
  if (value) {
    preloadFaces()
    start()
    refreshStatus()
    window.addEventListener('agent-code-done', onCodeDone)
    window.addEventListener('agent-explain', onExplain)
    // 一分钟推一次时钟，用来判断「他是不是睡着了」
    clockTimer = setInterval(() => { now.value = Date.now() }, 60000)
    window.addEventListener('resize', onResize)
    offSpeak = offSpeak || onSpeak(async ({ text, tone, followUp, eventType }) => {
      // 同一道题连着错 3 次 → 他也没耐心了（弱项再犯那种跨题的不算，别动不动就翻脸）
      if (eventType === 'WA_STREAK_3') makeAngry()
      say(text, tone, false)
      if (!followUp) return
      // 慢通道：先让模板台词顶上，大模型的点评回来再替换
      if (!panelOpen.value) thinking.value = true
      const better = await follow(eventType, currentProblemId.value)
      if (better) say(better, tone, true)
      else thinking.value = false
    })
  } else {
    bubble.value = ''
    thinking.value = false
    panelOpen.value = false
    window.removeEventListener('agent-code-done', onCodeDone)
    window.removeEventListener('agent-explain', onExplain)
    window.removeEventListener('resize', onResize)
    clearInterval(clockTimer)
    clockTimer = null
    if (offSpeak) { offSpeak(); offSpeak = null }
    reset()
  }
}, { immediate: true })

// 路由 → 事件：进题 / 离开 / 逛题库 / 打开对话
watch(() => route.fullPath, (to) => {
  if (!userStore.token) return
  const matched = to.match(/^\/problem\/(\d+)/)
  if (matched) enterProblem(matched[1])
  else leaveProblem()
  if (to.startsWith('/problems')) enterBrowse()
  else leaveBrowse()
  if (to.startsWith('/agent')) openedChat()
}, { immediate: true })

onUnmounted(() => {
  clearTimeout(hideTimer)
  clearTimeout(angryTimer)
  clearTimeout(dropTimer)
  clearTimeout(patTimer)
  clearTimeout(clickTimer)
  clearInterval(clockTimer)
  stopLines()
  window.removeEventListener('pointermove', onDragMove)
  window.removeEventListener('pointerup', onDragEnd)
  window.removeEventListener('resize', onResize)
  if (offSpeak) offSpeak()
  stop()
})
</script>

<style scoped>
.watch {
  position: fixed;
  top: 78px;
  right: 22px;
  z-index: 2100;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  font-family: ui-monospace, Consolas, "Courier New", monospace;
}

.avatar {
  position: relative;
  width: 42px;
  height: 42px;
  padding: 0;              /* 头像图直接填满这个方块 */
  border-radius: 12px;
  border: 1px solid #2f3947;
  background: #131a24;
  cursor: grab;            /* 能拎走 */
  touch-action: none;      /* 触屏拖动时别顺手把页面滚了 */
  display: grid;
  place-items: center;
  box-shadow: 0 8px 22px rgba(0, 0, 0, 0.32);
  transition: transform 0.18s ease, border-color 0.18s ease, opacity 0.3s ease;
}

.avatar:hover {
  transform: translateY(-2px);
  border-color: #7aa2ff;
}

/* 拖动中：关掉 hover 的小动作，手感要跟手 */
.watch.dragging {
  user-select: none;
  z-index: 2200;
}

.watch.dragging .avatar {
  cursor: grabbing;
  transform: none;
  border-color: #7aa2ff;
}

/* 被拎着走 / 被拍时他念叨的那句：贴在头像左边，跟着一起走 */
.quip-bubble {
  position: absolute;
  right: calc(100% + 12px);
  top: 2px;
  padding: 6px 10px;
  border-radius: 10px;
  border: 1px solid #2f3947;
  background: #131a24;
  color: #e3ecf6;
  font-size: 12px;
  line-height: 1.4;
  white-space: nowrap;
  font-family: ui-sans-serif, system-ui, "PingFang SC", "Microsoft YaHei", sans-serif;
  box-shadow: 3px 3px 0 rgba(0, 0, 0, .45);
  pointer-events: none;    /* 别挡住拖动 */
}

/* 拖到屏幕左半边时翻到头像右边去，免得顶出屏幕 */
.quip-bubble.flip {
  right: auto;
  left: calc(100% + 12px);
}

/* 被拍了一下：晃一晃，让人知道「他感觉到了」 */
.avatar.patted {
  animation: patWobble 0.42s ease-out;
}

@keyframes patWobble {
  0% { transform: scale(0.92) rotate(0deg); }
  30% { transform: scale(1.06) rotate(-5deg); }
  60% { transform: scale(0.98) rotate(4deg); }
  100% { transform: scale(1) rotate(0deg); }
}

.watch.sleeping .avatar {
  opacity: 0.55;
}

.face {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
  object-position: center top;   /* 头顶优先，别把下巴切掉 */
  border-radius: 11px;
}

/* 状态光环：语气决定颜色 */
.ring {
  position: absolute;
  inset: -4px;
  border-radius: 15px;
  border: 2px solid transparent;
  transition: border-color 0.2s ease;
}

.avatar.tone-praise .ring { border-color: #34d399; }
.avatar.tone-tease .ring { border-color: #fbbf24; }
.avatar.tone-warn .ring { border-color: #f87171; }
.avatar.tone-hint .ring { border-color: #38bdf8; }
.avatar.tone-remind .ring { border-color: #7aa2ff; }
.avatar.tone-thinking .ring { border-color: #a78bfa; }

.avatar.talking .ring {
  animation: pulse 1.6s infinite ease-out;
}

.badge {
  position: absolute;
  top: -6px;
  right: -6px;
  min-width: 17px;
  height: 17px;
  padding: 0 4px;
  border-radius: 9px;
  background: #f87171;
  color: #fff;
  font-size: 10px;
  line-height: 17px;
  text-align: center;
  font-family: inherit;
}

.meta {
  display: flex;
  align-items: center;
  gap: 6px;
}

.mode {
  padding: 2px 9px;
  border-radius: 9px;
  border: 1px solid #2f3947;
  background: #131a24;
  color: #8b9bb0;
  font-size: 10px;
  font-family: inherit;
  cursor: pointer;
  transition: all 0.16s ease;
}

.mode:hover {
  border-color: #7aa2ff;
  color: #cfe0ff;
}

.dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #34d399;
  box-shadow: 0 0 7px #34d399;
}

.dot.off {
  background: #f87171;
  box-shadow: 0 0 7px #f87171;
}

/* ---------------- 气泡 ---------------- */

.bubble {
  position: absolute;
  right: 54px;
  top: 0;
  width: 268px;
  padding: 10px 12px;
  border-radius: 12px;
  border: 1px solid #2f3947;
  background: #131a24;
  color: #e3ecf6;
  font-family: ui-sans-serif, system-ui, "PingFang SC", "Microsoft YaHei", sans-serif;
  font-size: 13px;
  line-height: 1.65;
  cursor: pointer;
  box-shadow: 0 14px 34px rgba(0, 0, 0, 0.4);
}

.bubble::after {
  content: "";
  position: absolute;
  right: -6px;
  top: 15px;
  width: 10px;
  height: 10px;
  background: #131a24;
  border-right: 1px solid #2f3947;
  border-bottom: 1px solid #2f3947;
  transform: rotate(-45deg);
}

.bubble.praise { border-color: #2f6f56; }
.bubble.tease { border-color: #6f5f2f; }
.bubble.warn { border-color: #6f3030; }
.bubble.hint { border-color: #2f5a6f; }

.bubble-text {
  word-break: break-word;
}

.bubble-foot {
  margin-top: 6px;
  font-size: 11px;
  color: #6b7d92;
  font-family: ui-monospace, Consolas, monospace;
}

/* 舞台里的字幕：他自动搭话时，只给这一张，不弹对话框。
   定位从"右上角绝对定位"改成舞台里的普通一列（人在左、字幕在右）。 */
.bubble.speech {
  position: static;
  order: 2;
  width: auto;
  max-width: min(520px, calc(100vw - 320px));
  border-radius: 0;
  box-shadow: 3px 3px 0 rgba(0, 0, 0, .45);
}

/* 小箭头换个方向，指向左边的立绘 */
.bubble.speech::after {
  left: -6px;
  right: auto;
  top: 24px;
  width: 0;
  height: 0;
  background: transparent;
  border: 6px solid transparent;
  border-right: 7px solid #131a24;
  transform: none;
}

.bubble-thinking {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-top: 6px;
  color: #a78bfa;
  font-size: 11px;
}

.bubble-thinking span {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: #a78bfa;
  animation: blink 1.2s infinite ease-in-out;
}

.bubble-thinking span:nth-child(2) { animation-delay: 0.2s; }
.bubble-thinking span:nth-child(3) { animation-delay: 0.4s; }

.bubble-thinking em {
  font-style: normal;
  margin-left: 4px;
}

/* ---------------- 对话面板 ---------------- */

/* ---------------- 对话舞台（左下角） ----------------
   人物在左、台词在右，fixed 挂在视口左下角。
   和右上角的头像一起构成"他在屏幕左下角跟你说话"的感觉。 */
.stage {
  position: fixed;
  left: 18px;
  bottom: 18px;
  z-index: 40;
  display: flex;
  /* 人物对台词面板垂直居中——要的是"在对话框左侧"，不是"顶在左上角" */
  align-items: center;
  gap: 18px;
  max-width: calc(100vw - 36px);
  /* 脚底那块名牌是绝对定位的、不参与居中计算，
     所以这里预留出它的高度，人物才能真正和台词面板对齐 */
  padding-bottom: 48px;
}

.stand {
  position: relative; /* 名牌的定位基准 */
  display: flex;
  flex: 0 0 auto;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

/* 半身立绘。
   图片是抠掉背景的透明 PNG（frontend/public/agent/ 下那四张），
   所以这里不给底色也不给边框，让人物直接"站"在页面上；
   用 drop-shadow 沿人物轮廓压一层硬阴影，既贴合像素风又把他从背景里拎出来。
   四张图都是 675×900（3:4），这里跟着同比例，换图不会变形。 */
.portrait {
  position: relative;
  flex: 0 0 auto;
  height: 322px;
  aspect-ratio: 3 / 4;
  display: flex;
  align-items: flex-end;
  justify-content: center;
}

.portrait img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: contain;
  filter: drop-shadow(3px 3px 0 rgba(0, 0, 0, .5));
  transition: filter .2s ease;
}

.portrait .silhouette {
  display: block;
  width: 100%;
  height: 100%;
}

/* 还没放图时的提示（放上图就自动消失） */
.portrait-hint {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 10px;
  text-align: center;
  color: #6b7d92;
  font-size: 10px;
  line-height: 1.5;
}

/* 说话时轻微起伏 + 一圈黄色轮廓光，静态插画也能有"在说话"的感觉 */
.portrait.talking {
  animation: talkBob 1.2s ease-in-out infinite;
}

.portrait.talking img {
  filter: drop-shadow(3px 3px 0 rgba(0, 0, 0, .5)) drop-shadow(0 0 9px rgba(255, 215, 110, .55));
}

/* 生气（反复问同一个问题 / 同一题反复错）时说这句话的样子：换成红光 */
.portrait.angry img {
  filter: drop-shadow(3px 3px 0 rgba(0, 0, 0, .5)) drop-shadow(0 0 10px rgba(248, 113, 113, .6));
}

@keyframes talkBob {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-3px); }
}

/* 人物脚下的名牌。绝对定位贴着立绘底边，这样它不占布局高度，
   立绘才能和右侧台词面板真正垂直居中对齐。 */
.plate {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  margin-top: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  padding: 4px 10px;
  background: #1d2129;
  border: 1px solid #39404d;
  box-shadow: 2px 2px 0 rgba(0, 0, 0, .45);
}

.plate b {
  color: #ffd76e;
  font-size: 13px;
  letter-spacing: 1px;
}

.plate i {
  color: #9fb4d0;
  font-size: 10px;
  font-style: normal;
}

.talk {
  display: flex;
  flex-direction: column;
  /* 又扁又长：宽一点、矮一点，贴着屏幕底边横着铺，不挡视野 */
  width: min(820px, calc(100vw - 300px));
  max-width: 100%;
  height: min(34vh, 306px);
  overflow: hidden;
  border: 1px solid #39404d;
  background: #1d2129;
  color: #e9e5d8;
  box-shadow: 3px 3px 0 rgba(0, 0, 0, .45);
  font-family: ui-monospace, Consolas, "Courier New", monospace;
}

.talk-hint {
  flex: 1;
  overflow: hidden;
  color: #9fb4d0;
  font-size: 11px;
  white-space: nowrap;
  text-overflow: ellipsis;
}

/* 中等窗口：人物和台词都收一收，但仍是"人在左、话在右" */
@media (max-width: 1120px) {
  .portrait { height: 250px; }
  .talk { width: min(660px, calc(100vw - 250px)); }
}

/* 真的放不下了（手机宽度 / 很矮的窗口）才改成上下堆叠 */
@media (max-width: 760px), (max-height: 560px) {
  .stage {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
    padding-bottom: 0;
  }
  .plate { position: static; margin-top: 0; }
  .portrait { height: 168px; }
  .talk { width: calc(100vw - 36px); height: min(40vh, 280px); }
}

.panel-head {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 0 0 40px;
  padding: 0 10px;
  border-bottom: 1px solid #39404d;
  background: #22262f;
}

.panel-btn {
  flex: 0 0 auto;
  padding: 4px 8px;
  border: 1px solid #39404d;
  background: #1d2129;
  color: #9fb4d0;
  font-size: 11px;
  font-family: inherit;
  cursor: pointer;
  transition: none;
}

.panel-btn:hover {
  border-color: #ffd76e;
  color: #ffd76e;
}

.panel-btn.close:hover {
  border-color: #f87171;
  color: #fca5a5;
}

.panel-body {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.panel-body::-webkit-scrollbar { width: 7px; }
.panel-body::-webkit-scrollbar-thumb { background: #2f3947; border-radius: 4px; }

.panel-welcome {
  color: #7d8da1;
  font-size: 12.5px;
  line-height: 1.8;
}

.wm {
  display: flex;
  max-width: 100%;
}

.wm.user {
  justify-content: flex-end;
}

.wm-bd {
  max-width: 88%;
  padding: 9px 11px;
  border-radius: 11px;
  background: #17202b;
  border: 1px solid #26313d;
  font-size: 13px;
  line-height: 1.7;
  color: #dae4f0;
  word-break: break-word;
}

.wm.user .wm-bd {
  background: #1b2a44;
  border-color: #2f4a72;
}

.wm.tone-tease .wm-bd { border-color: #5c4d24; }
.wm.tone-praise .wm-bd { border-color: #2a5a45; }
.wm.tone-warn .wm-bd { border-color: #5c2b2b; }
.wm.tone-hint .wm-bd { border-color: #29506b; }

.wm-bd :deep(p) { margin: 0 0 6px; }
.wm-bd :deep(p:last-child) { margin-bottom: 0; }
.wm-bd :deep(h1),
.wm-bd :deep(h2),
.wm-bd :deep(h3),
.wm-bd :deep(h4) { margin: 10px 0 5px; font-size: 13.5px; color: #fff; }
.wm-bd :deep(ul),
.wm-bd :deep(ol) { margin: 5px 0 8px; padding-left: 20px; }
.wm-bd :deep(blockquote) {
  margin: 7px 0; padding: 5px 10px; border-left: 3px solid #38bdf8;
  background: rgba(56, 189, 248, 0.08); color: #a5b4c4; border-radius: 0 6px 6px 0;
}
.wm-bd :deep(hr) { border: none; border-top: 1px solid #26313d; margin: 10px 0; }
.wm-bd :deep(code) {
  background: #0d141d; border: 1px solid #26313d; border-radius: 3px;
  padding: 0 4px; color: #8fd0ff; font-family: ui-monospace, Consolas, monospace; font-size: 12px;
}
.wm-bd :deep(.md-code) {
  margin: 9px 0; border: 1px solid #26313d; border-radius: 8px;
  overflow: hidden; background: #0d141d;
}
.wm-bd :deep(.md-code-head) {
  display: flex; justify-content: space-between; padding: 4px 9px;
  background: #17202b; border-bottom: 1px solid #26313d; font-size: 10.5px; color: #7d8da1;
}
.wm-bd :deep(.md-copy) {
  border: none; background: transparent; color: #7d8da1;
  cursor: pointer; font-size: 10.5px;
}
.wm-bd :deep(.md-copy:hover) { color: #7aa2ff; }
.wm-bd :deep(.md-code pre) { margin: 0; padding: 10px; overflow-x: auto; }
.wm-bd :deep(.md-code code) {
  border: none; background: transparent; color: #cfd8e3; padding: 0;
  font-size: 12px; line-height: 1.6; white-space: pre;
}
.wm-bd :deep(.md-table) {
  border-collapse: collapse; width: 100%; margin: 8px 0; font-size: 12px;
}
.wm-bd :deep(.md-table th),
.wm-bd :deep(.md-table td) { border: 1px solid #26313d; padding: 5px 8px; }
.wm-bd :deep(.md-table th) { background: #17202b; color: #93c5fd; }

.typing { display: flex; gap: 4px; align-items: center; }
.typing span {
  width: 5px; height: 5px; border-radius: 50%; background: #7aa2ff;
  animation: blink 1.2s infinite ease-in-out;
}
.typing span:nth-child(2) { animation-delay: 0.2s; }
.typing span:nth-child(3) { animation-delay: 0.4s; }

.panel-quick {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  padding: 0 10px 8px;
}

.panel-quick button {
  padding: 4px 10px;
  border-radius: 20px;
  border: 1px solid #2f3947;
  background: #17202b;
  color: #8b9bb0;
  font-size: 11px;
  font-family: inherit;
  cursor: pointer;
  transition: all 0.16s ease;
}

.panel-quick button:hover {
  border-color: #7aa2ff;
  color: #cfe0ff;
}

.panel-input {
  display: flex;
  gap: 8px;
  padding: 9px 10px;
  border-top: 1px solid #26313d;
  background: #17202b;
}

.panel-input textarea {
  flex: 1;
  min-width: 0;
  height: 38px;
  resize: none;
  border-radius: 9px;
  border: 1px solid #2f3947;
  background: #0f1620;
  color: #e3ecf6;
  padding: 9px 10px;
  font-size: 12.5px;
  line-height: 1.5;
  font-family: inherit;
  outline: none;
  transition: border-color 0.16s ease;
}

.panel-input textarea:focus {
  border-color: #7aa2ff;
}

.send {
  padding: 0 14px;
  border-radius: 9px;
  border: 1px solid #2f4a72;
  background: #2b6cb0;
  color: #fff;
  font-size: 12.5px;
  font-family: inherit;
  font-weight: 600;
  cursor: pointer;
}

.send:disabled {
  opacity: 0.5;
  cursor: default;
}

/* ---------------- 过渡与动画 ---------------- */

/* 舞台从下方升起（原来是从上方展开的下拉面板，位置变了，动效也跟着换） */
.rise-enter-active,
.rise-leave-active {
  transition: all 0.22s cubic-bezier(0.34, 1.3, 0.64, 1);
}

.rise-enter-from,
.rise-leave-to {
  opacity: 0;
  transform: translateY(16px);
}

@keyframes pulse {
  0% { transform: scale(0.92); opacity: 0.9; }
  100% { transform: scale(1.28); opacity: 0; }
}

@keyframes blink {
  0%, 80%, 100% { opacity: 0.25; }
  40% { opacity: 1; }
}
</style>
