<template>
  <div class="agent-page">
    <!-- 侧栏：会话 + 快捷动作 -->
    <aside class="agent-side">
      <div class="side-brand">
        <div class="avatar-lg">算</div>
        <div class="brand-text">
          <strong>算法哥</strong>
          <span class="brand-sub">竞赛刷题 · 在线判题 · 学情教练</span>
        </div>
      </div>

      <div class="llm-state" :class="{ off: !llmReady }">
        <span class="dot"></span>
        {{ llmReady ? `已接入大模型（${llmModel}）` : '大模型未接入，只能给原始数据' }}
      </div>

      <el-button class="new-chat" type="primary" @click="startNewSession">
        <el-icon><Plus /></el-icon>&nbsp;新的对话
      </el-button>

      <div class="side-block">
        <div class="block-title">快捷动作</div>
        <div class="quick-list">
          <button class="quick" @click="send('每日一题')">
            <el-icon><Calendar /></el-icon> 每日一题
          </button>
          <button class="quick" @click="send('给我做一次学情分析，指出我的短板和处方')">
            <el-icon><DataAnalysis /></el-icon> 学情诊断
          </button>
          <button class="quick" @click="send('给我排一份刷题计划，每天 3 题，练 7 天')">
            <el-icon><List /></el-icon> 刷题题单
          </button>
          <button class="quick" @click="send('我现在的排名怎么样')">
            <el-icon><Trophy /></el-icon> 排名播报
          </button>
          <button class="quick" @click="send('我刚才那次提交为什么没过')">
            <el-icon><WarningFilled /></el-icon> 判题讲解
          </button>
        </div>
      </div>

      <div class="side-block memory-block">
        <div class="block-title">
          他对你的记忆
          <span v-if="memory" class="mem-clear" @click="forgetMemory">让他忘掉</span>
        </div>
        <div v-if="memory" class="memory-text">{{ memory }}</div>
        <div v-else class="empty-tip">还不太了解你，多聊几句他就记住了</div>
      </div>

      <div class="side-block sessions">
        <div class="block-title">历史对话</div>
        <div v-if="!sessions.length" class="empty-tip">还没有对话，问点什么吧</div>
        <div
          v-for="item in sessions"
          :key="item.id"
          class="session-item"
          :class="{ active: item.id === currentSessionId }"
          @click="selectSession(item.id)"
        >
          <span class="session-title">{{ item.title }}</span>
          <el-icon class="session-del" @click.stop="removeSession(item.id)"><Delete /></el-icon>
        </div>
      </div>
    </aside>

    <!-- 主区：对话 -->
    <main class="agent-main">
      <header class="chat-head">
        <div class="head-left">
          <span class="head-title">和算法哥聊</span>
          <el-tag v-if="currentProblem" size="small" effect="dark" class="problem-chip" closable @close="clearProblem">
            #{{ currentProblem.id }} {{ currentProblem.title }}
          </el-tag>
        </div>
        <div class="head-right">
          <el-button size="small" :disabled="!currentProblem" @click="openOj">
            <el-icon><Monitor /></el-icon>&nbsp;在聊天里写代码
          </el-button>
          <el-button size="small" text @click="$router.push('/problems')">题库</el-button>
          <el-button size="small" text @click="$router.push('/home')">返回地图</el-button>
        </div>
      </header>

      <div ref="scrollRef" class="chat-body" @click="onBodyClick">
        <div v-if="!messages.length" class="welcome">
          <div class="avatar-lg">算</div>
          <h3>我是算法哥</h3>
          <p>
            刷题、判题、看代码是我的活。把你的代码交上来真跑一遍，错了我给你说清错在哪一类；
            不会做我给你台阶，一级一级往上走，不直接甩答案。
          </p>
          <p class="welcome-tip">
            也可以直接支使我：说「来道简单题」「找道动态规划的题」「打开两数之和」，我自己去题库翻；
            说「打开题库」「我的收藏」「提交记录」我就带你过去。
          </p>
          <div class="welcome-actions">
            <button v-for="tip in suggestions" :key="tip" class="suggest" @click="send(tip)">{{ tip }}</button>
          </div>
        </div>

        <template v-for="message in messages" :key="message.id">
          <div class="msg" :class="message.role">
            <div class="msg-avatar">{{ message.role === 'user' ? userInitial : '算' }}</div>
            <div class="msg-bubble">
              <div class="msg-meta">
                <span>{{ message.role === 'user' ? (userStore.user?.nickname || userStore.user?.username || '我') : '算法哥' }}</span>
                <el-tag v-if="message.intent && message.role === 'assistant'" size="small" class="intent-tag">
                  {{ intentLabel(message.intent) }}
                </el-tag>
              </div>
              <div class="msg-content" :class="{ error: message.error }" v-html="renderMarkdown(message.content)"></div>

              <!-- 题目卡片 -->
              <div v-if="message.payload && message.payload.type === 'problem'" class="card problem-card">
                <div class="card-line">
                  <span class="card-id">#{{ message.payload.problemId }}</span>
                  <span class="card-title">{{ message.payload.title }}</span>
                  <span class="diff" :class="message.payload.difficulty">{{ difficultyCn(message.payload.difficulty) }}</span>
                </div>
                <div class="card-tags">
                  <span v-for="tag in message.payload.tags || []" :key="tag" class="tag">{{ tag }}</span>
                </div>
                <div class="card-actions">
                  <el-button size="small" type="primary" @click="openOjWith(message.payload)">打开 OJ 写这道题</el-button>
                  <el-button size="small" @click="askHint(1)">先来 L1 提示</el-button>
                </div>
              </div>

              <!-- 题单卡片 -->
              <div v-if="message.payload && message.payload.type === 'plan'" class="card plan-card">
                <div class="plan-head">
                  <strong>{{ message.payload.plan.goal }}</strong>
                  <span>{{ message.payload.plan.days }} 天 × 每天 {{ message.payload.plan.dailyCount }} 题</span>
                </div>
                <p class="plan-summary">{{ message.payload.plan.summary }}</p>
                <div v-for="day in message.payload.plan.dayList" :key="day.dayIndex" class="plan-day">
                  <div class="day-title">
                    <span class="day-badge">第 {{ day.dayIndex }} 天</span>
                    <span class="day-focus">{{ day.focus }}</span>
                  </div>
                  <div v-for="item in day.items" :key="item.itemId" class="plan-item" :class="{ done: item.done }">
                    <div class="item-main">
                      <span class="card-id">#{{ item.problemId }}</span>
                      <span class="card-title" @click="openOjWith(item, item.title)">{{ item.title }}</span>
                      <span class="diff" :class="item.difficulty">{{ difficultyCn(item.difficulty) }}</span>
                    </div>
                    <div class="item-reason">{{ item.reason }}</div>
                    <div class="item-actions">
                      <el-button size="small" text type="primary" @click="openOjWith(item, item.title)">去写</el-button>
                      <el-button size="small" text @click="togglePlanItem(item)">
                        {{ item.done ? '标记未完成' : '标记已完成' }}
                      </el-button>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 学情数字卡 -->
              <div v-if="message.payload && message.payload.type === 'analysis'" class="card stats-card">
                <div class="stat">
                  <b>{{ message.payload.analysis.solvedCount }}</b>
                  <span>通过题目</span>
                </div>
                <div class="stat">
                  <b>{{ message.payload.analysis.solveRate }}%</b>
                  <span>题目通过率</span>
                </div>
                <div class="stat">
                  <b>{{ message.payload.analysis.acceptRate }}%</b>
                  <span>提交通过率</span>
                </div>
                <div class="stat">
                  <b>{{ message.payload.analysis.rank }}</b>
                  <span>全局排名</span>
                </div>
                <div class="stat">
                  <b>{{ message.payload.analysis.maxStreak }}</b>
                  <span>最长连续天数</span>
                </div>
                <div class="weak-line">
                  薄弱标签：
                  <span v-if="!message.payload.analysis.weakTags.length">暂无明显短板</span>
                  <span v-for="tag in message.payload.analysis.weakTags" :key="tag" class="tag warn">{{ tag }}</span>
                </div>
              </div>

              <!-- 排名卡 -->
              <div v-if="message.payload && message.payload.type === 'rank'" class="card rank-card">
                <div class="rank-me">
                  榜单累计 AC <b>{{ message.payload.accepted }}</b> 次 · 去重通过
                  {{ message.payload.solvedDistinct }} 题 · 第
                  <b>{{ message.payload.rank }}</b> / {{ message.payload.totalUsers }} 人
                </div>
                <div class="rank-top">
                  <div v-for="(row, index) in message.payload.top" :key="row.userId" class="rank-row">
                    <span class="rank-no" :class="{ me: row.userId === userStore.user?.id }">{{ index + 1 }}</span>
                    <span class="rank-name">{{ row.nickname || row.username }}</span>
                    <span class="rank-score">{{ row.acceptedProblems }} 题</span>
                  </div>
                </div>
                <div v-if="message.payload.tagRanks && message.payload.tagRanks.length" class="rank-tags">
                  <span v-for="row in message.payload.tagRanks" :key="row.tag" class="tag">
                    {{ row.tag }}：{{ row.rank ? '第 ' + row.rank + ' / ' + row.total : '还没 AC' }}
                  </span>
                </div>
              </div>

              <!-- 提示档位标记 -->
              <div v-if="message.payload && message.payload.type === 'hint'" class="card hint-card">
                <span class="hint-badge">L{{ message.payload.level }}</span>
                第 {{ message.payload.level }} 级提示 · #{{ message.payload.problemId }} {{ message.payload.problemTitle }}
                <div class="hint-actions">
                  <el-button size="small" text type="primary" :disabled="message.payload.level >= 4" @click="askHint(message.payload.level + 1)">
                    要下一级（L{{ Math.min(message.payload.level + 1, 4) }}）
                  </el-button>
                  <el-button size="small" text @click="send('我还是不会，把关键那一步讲透')">我还是不会</el-button>
                </div>
              </div>

              <!-- 错题本卡片：点题名直接进去重做，或点「找类似的」拿同类型题 -->
              <div v-if="message.payload && message.payload.type === 'wrong'" class="card wrong-card">
                <div class="stack-head">
                  错题本 · 还有 <b>{{ message.payload.problems.length }}</b> 道没过
                </div>
                <div v-for="item in message.payload.problems" :key="item.id" class="plan-item">
                  <div class="item-main" @click="gotoProblem(item)">
                    <span class="card-id">#{{ item.id }}</span>
                    <span class="card-title">{{ item.title }}</span>
                    <span class="diff" :class="item.difficulty">{{ difficultyCn(item.difficulty) }}</span>
                    <span v-if="item.category" class="tag">{{ item.category }}</span>
                    <span class="fail-count">栽了 {{ item.failCount }} 次</span>
                  </div>
                  <div class="item-actions">
                    <el-button size="small" text type="primary" @click="gotoProblem(item)">去重做</el-button>
                    <el-button size="small" text @click="askSimilar(item)">找类似的</el-button>
                  </div>
                </div>
              </div>

              <!-- 相似题卡片：同类型题目清单，可继续顺着找下去 -->
              <div v-if="message.payload && message.payload.type === 'similar'" class="card similar-card">
                <div class="stack-head">
                  和「{{ message.payload.baseTitle }}」同一路的题
                </div>
                <div v-for="item in message.payload.problems" :key="item.id" class="plan-item">
                  <div class="item-main" @click="gotoProblem(item)">
                    <span class="card-id">#{{ item.id }}</span>
                    <span class="card-title">{{ item.title }}</span>
                    <span class="diff" :class="item.difficulty">{{ difficultyCn(item.difficulty) }}</span>
                    <span v-if="item.category" class="tag">{{ item.category }}</span>
                  </div>
                  <div v-if="item.reason" class="item-reason">{{ item.reason }}</div>
                  <div class="item-actions">
                    <el-button size="small" text type="primary" @click="gotoProblem(item)">去做这题</el-button>
                    <el-button size="small" text @click="askSimilar(item)">再找类似的</el-button>
                  </div>
                </div>
                <!-- 联网结果（配了搜索 key 才有；没配就整块不出现） -->
                <div v-if="message.payload.web && message.payload.web.length" class="web-results">
                  <div class="web-head">网上翻到的相关内容</div>
                  <a
                    v-for="(row, index) in message.payload.web"
                    :key="index"
                    class="web-row"
                    :href="row.link"
                    target="_blank"
                    rel="noopener"
                  >{{ row.title }}</a>
                </div>
              </div>
            </div>
          </div>
        </template>

        <div v-if="sending" class="msg assistant">
          <div class="msg-avatar">算</div>
          <div class="msg-bubble typing">
            <span></span><span></span><span></span>
          </div>
        </div>
      </div>

      <footer class="composer">
        <div v-if="currentProblem" class="composer-context">
          当前题目：<b>#{{ currentProblem.id }} {{ currentProblem.title }}</b>
          <span class="hint-btns" v-if="currentProblem">
            <button class="mini" @click="askHint(1)">L1 方向</button>
            <button class="mini" @click="askHint(2)">L2 步骤</button>
            <button class="mini" @click="askHint(3)">L3 伪代码</button>
            <button class="mini" @click="askHint(4)">L4 代码</button>
            <button class="mini" @click="send('我完全不会，把关键步骤讲透')">我不会</button>
          </span>
        </div>
        <div class="composer-row">
          <textarea
            v-model="input"
            class="composer-input"
            rows="2"
            placeholder="问算法哥：为什么我这个 TLE？给我一道 DP 的题？分析一下我的短板……（Enter 发送，Shift+Enter 换行）"
            @keydown.enter.exact.prevent="send()"
          ></textarea>
          <el-button type="primary" class="send-btn" :loading="sending" @click="send()">发送</el-button>
        </div>
      </footer>
    </main>

    <!-- OJ 编辑器：在聊天界面之内打开，不另起站点 -->
    <el-drawer v-model="ojOpen" title="OJ 编辑器（在算法哥这里写、这里判）" size="60%" direction="rtl">
      <div class="oj">
        <div class="oj-bar">
          <el-select
            v-model="ojProblemId"
            filterable
            remote
            :remote-method="searchProblems"
            placeholder="选一道题"
            style="width: 320px"
            @change="onOjProblemChange"
          >
            <el-option
              v-for="item in problemOptions"
              :key="item.id"
              :label="`#${item.id} ${item.title}`"
              :value="item.id"
            />
          </el-select>
          <el-button size="small" @click="runCode" :loading="judging">运行样例</el-button>
          <el-button size="small" type="primary" @click="submitCode" :loading="judging">提交判题</el-button>
        </div>

        <div ref="editorRef" class="oj-editor"></div>

        <div v-if="judgeResult" class="oj-result" :class="judgeResult.status">
          <div class="result-head">
            <b>{{ statusText(judgeResult.status) }}</b>
            <span v-if="judgeResult.timeUsed != null">用时 {{ judgeResult.timeUsed }} ms</span>
            <span v-if="judgeResult.memoryUsed != null">内存 {{ judgeResult.memoryUsed }} KB</span>
          </div>
          <pre v-if="judgeResult.message" class="result-block">{{ judgeResult.message }}</pre>
          <div v-if="judgeResult.output" class="result-pair">
            <div><span>实际输出</span><pre>{{ judgeResult.output }}</pre></div>
            <div v-if="judgeResult.expectedOutput"><span>期望输出</span><pre>{{ judgeResult.expectedOutput }}</pre></div>
          </div>
          <el-button size="small" type="primary" @click="askJudgeExplain">让算法哥讲讲这次判题</el-button>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script setup>
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import * as monaco from 'monaco-editor'
import { useUserStore } from '@/stores/user'
import { getProblemDetail, getProblemList } from '@/api/problem'
import { compileAndJudge } from '@/api/judge'
import {
  chatWithAgent,
  clearAgentMemory,
  deleteSession,
  getAgentMemory,
  getAgentStatus,
  getMessages,
  getSessions,
  markPlanItemDone
} from '@/api/agent'
import { handleMarkdownClick, renderMarkdown } from '@/utils/markdown'
import { setupPixelTheme } from '@/utils/monacoTheme'
import { parseAction, findProblem } from '@/utils/agentActions'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const isAdmin = computed(() => userStore.user?.role === 'ADMIN')

const sessions = ref([])
const currentSessionId = ref(null)
const messages = ref([])
const input = ref('')
const sending = ref(false)
const scrollRef = ref(null)
const currentProblem = ref(null)
const llmReady = ref(false)
const llmModel = ref('')

const ojOpen = ref(false)
const ojProblemId = ref(null)
const problemOptions = ref([])
const editorRef = ref(null)
const judgeResult = ref(null)
const judging = ref(false)
let editor = null

const suggestions = [
  '每日一题',
  '给我做一次学情分析，指出我的短板和处方',
  '给我排一份刷题计划，每天 3 题，练 7 天',
  '我现在的排名怎么样',
  '我刚才那次提交为什么没过'
]

/** 「今天做了啥」这类问法统一走这句提问，让他的回答盯在当日数据上，而不是自由发挥 */
const TODAY_ASK = '用你手上的真实数据，给我一份今天的战报：今天交了几次、AC 几次、做了哪几道题、'
  + '大概几点做的、有没有同一题连着交好几次。五句话以内，别客套。'

const userInitial = computed(() => {
  const name = userStore.user?.nickname || userStore.user?.username || '我'
  return name.slice(0, 1)
})

const INTENT_LABELS = {
  HINT: '分级提示',
  JUDGE_REPORT: '判题播报',
  ANALYZE: '学情诊断',
  PLAN: '题单',
  RANK: '排名',
  DAILY: '每日一题',
  RECOMMEND: '推荐题目',
  CHAT: '聊天'
}

const intentLabel = (intent) => INTENT_LABELS[intent] || '聊天'

const difficultyCn = (difficulty) => ({ EASY: '简单', MEDIUM: '中等', HARD: '困难' }[difficulty] || '未知')

const statusText = (status) => ({
  ACCEPTED: '通过',
  WRONG_ANSWER: '答案错误',
  COMPILE_ERROR: '编译错误',
  RUNTIME_ERROR: '运行错误',
  TIME_LIMIT_EXCEEDED: '超时',
  ERROR: '出错'
}[status] || status)

/** 卡片/回话里的一行 → 直接跳进题目页去做（不是就地弹编辑器，是正经跳转） */
const gotoProblem = (item) => router.push(`/problem/${item.id}`)

const onBodyClick = (event) => {
  if (handleMarkdownClick(event)) {
    return
  }
  // 算法哥回话里的站内链接（题名 → /problem/5 这种）在当前页签里跳，
  // 别新开一个标签页——点了名字就该直接进题。
  const link = event.target.closest && event.target.closest('a')
  if (link) {
    const href = link.getAttribute('href') || ''
    if (href.startsWith('/')) {
      event.preventDefault()
      router.push(href)
    }
  }
}

const scrollToBottom = async () => {
  await nextTick()
  if (scrollRef.value) {
    scrollRef.value.scrollTop = scrollRef.value.scrollHeight
  }
}

const loadStatus = async () => {
  try {
    const res = await getAgentStatus()
    llmReady.value = !!res.data.llmReady
    llmModel.value = res.data.model || ''
  } catch (e) {
    llmReady.value = false
  }
}

const loadSessions = async () => {
  const res = await getSessions()
  sessions.value = res.data || []
}

/* 算法哥对这个账号的长期记忆：只属于当前登录的账号，
   换个账号登录看到的是那个账号自己的记忆（会话历史同理，本来就按账号隔离）。 */
const memory = ref('')

const loadMemory = async () => {
  try {
    const res = await getAgentMemory()
    memory.value = (res.data || '').trim()
  } catch (e) {
    memory.value = ''
  }
}

const forgetMemory = async () => {
  try {
    await ElMessageBox.confirm('让他忘掉对你的所有记忆？历史对话不会删除。', '确认', { type: 'warning' })
  } catch (e) {
    return
  }
  try {
    await clearAgentMemory()
    memory.value = ''
    ElMessage.success('他已经把你忘了')
  } catch (e) {
    ElMessage.error('没清掉，过会儿再试')
  }
}

/** 算法哥用对话改了资料（性别/位置/加入时间/昵称/简介）→ 刷新缓存的用户信息 */
const syncProfileIfChanged = (payload) => {
  if (payload && payload.type === 'profile') {
    userStore.fetchUserInfo().catch(() => {})
  }
}

const loadMessages = async (sessionId) => {
  const res = await getMessages(sessionId)
  messages.value = (res.data || []).map((item) => ({
    id: item.id,
    role: item.role,
    content: item.content,
    intent: item.intent
  }))
  await scrollToBottom()
}

const startNewSession = () => {
  currentSessionId.value = null
  messages.value = []
  input.value = ''
}

const selectSession = async (sessionId) => {
  if (sessionId === currentSessionId.value) {
    return
  }
  currentSessionId.value = sessionId
  await loadMessages(sessionId)
}

const removeSession = async (sessionId) => {
  try {
    await ElMessageBox.confirm('删掉这段对话？算法哥就不记得这段了。', '删除对话', {
      type: 'warning',
      confirmButtonText: '删除',
      cancelButtonText: '算了'
    })
  } catch (e) {
    return
  }
  await deleteSession(sessionId)
  if (currentSessionId.value === sessionId) {
    startNewSession()
  }
  await loadSessions()
  ElMessage.success('已删除')
}

const send = async (text, options = {}) => {
  const content = (text === undefined || text === null ? input.value : text).trim()
  if (!content || sending.value) {
    return
  }
  messages.value.push({ id: `local-${Date.now()}`, role: 'user', content })
  input.value = ''

  // 先看这句是不是在支使他干活（切页面 / 顺带出题单）。
  // skipAction 是给「从外面带 ask 参数跳进来」用的，否则会自己跳自己、绕成死循环。
  if (!options.skipAction) {
    const action = parseAction(content, { isAdmin: isAdmin.value })
    if (action) {
      // 「今天做了啥」：不跳页，用真实数据直接报一遍
      if (action.id === 'today-report') {
        sending.value = true
        await scrollToBottom()
        try {
          const res = await chatWithAgent({
            sessionId: currentSessionId.value,
            content: TODAY_ASK,
            problemId: currentProblem.value ? currentProblem.value.id : null
          })
          currentSessionId.value = res.data.sessionId
          messages.value.push({ id: res.data.messageId, role: 'assistant', content: res.data.reply })
          loadSessions()
        } catch (e) {
          messages.value.push({
            id: `err-${Date.now()}`, role: 'assistant', content: '今天的账没算出来，过会儿再问我。'
          })
        } finally {
          sending.value = false
          await scrollToBottom()
        }
        return
      }
      // 「帮我写这道题」：定下是哪道题，跳到题目页让他把代码敲进去
      if (action.id === 'write-code') {
        let problemId = currentProblem.value ? currentProblem.value.id : null
        if (action.title || action.tag || action.difficulty) {
          const found = await findProblem(action)
          if (!found.path) {
            messages.value.push({ id: `act-${Date.now()}`, role: 'assistant', content: found.reply })
            await scrollToBottom()
            return
          }
          problemId = found.path.split('/').pop()
        }
        if (!problemId) {
          messages.value.push({
            id: `act-${Date.now()}`, role: 'assistant',
            content: '哪道题？给我个题名或者题号，我这就写。'
          })
          await scrollToBottom()
          return
        }
        messages.value.push({
          id: `act-${Date.now()}`, role: 'assistant',
          content: '行，我写。你看着，别眨眼。'
        })
        await scrollToBottom()
        const langQuery = action.language ? `&lang=${action.language}` : ''
        setTimeout(() => router.push(`/problem/${problemId}?agentSolve=${Date.now()}${langQuery}`), 420)
        return
      }
      // 找题：真去题库翻一道，翻到了再跳过去
      if (action.id === 'find-problem') {
        const found = await findProblem(action)
        messages.value.push({ id: `act-${Date.now()}`, role: 'assistant', content: found.reply })
        await scrollToBottom()
        if (found.path) {
          setTimeout(() => router.push(found.path), 420)
        }
        return
      }
      const askKind = action.path && action.path.indexOf('/agent?ask=') === 0
        ? action.path.split('=')[1]
        : null
      // 已经站在完整界面里，而这件事本来就该在这儿办 → 什么都不用做，让这句话正常往下问
      // （否则会多出一条重复的用户消息，还会自己跳自己）
      const stayHere = askKind && route.path === '/agent'
      if (!stayHere) {
        messages.value.push({ id: `act-${Date.now()}`, role: 'assistant', content: action.reply })
        await scrollToBottom()
        if (action.path) {
          setTimeout(() => router.push(action.path), 420)
        }
        return
      }
    }
  }

  sending.value = true
  await scrollToBottom()

  try {
    const res = await chatWithAgent({
      sessionId: currentSessionId.value,
      content,
      problemId: currentProblem.value ? currentProblem.value.id : null,
      level: options.level ?? null
    })
    const data = res.data
    currentSessionId.value = data.sessionId
    messages.value.push({
      id: data.messageId,
      role: 'assistant',
      content: data.reply,
      intent: data.intent,
      payload: data.payload
    })
    syncProfileIfChanged(data.payload)
    loadSessions()
  } catch (e) {
    messages.value.push({
      id: `err-${Date.now()}`,
      role: 'assistant',
      content: '我这边出了点问题。检查一下后端服务，或者 `agent.llm.api-key` 有没有配上。',
      error: true
    })
  } finally {
    sending.value = false
    await scrollToBottom()
  }
}

const askHint = (level) => {
  if (!currentProblem.value) {
    ElMessage.warning('先在题目页点「问算法哥」，或者在下面选一道题')
    return
  }
  send(`给我第 L${level} 级提示`, { level })
}

const clearProblem = () => {
  currentProblem.value = null
}

const togglePlanItem = async (item) => {
  await markPlanItemDone(item.itemId, !item.done)
  item.done = !item.done
  ElMessage.success(item.done ? '记下了，这道算完成' : '已改回未完成')
}

// ------------------------------------------------------------------ OJ

const loadProblemOptions = async (keyword = '') => {
  const res = await getProblemList({ pageNum: 1, pageSize: 50, keyword: keyword || undefined })
  problemOptions.value = res.data.records || []
  return problemOptions.value
}

const searchProblems = (keyword) => {
  loadProblemOptions(keyword)
}

const openOjWith = async (payload, title) => {
  ojOpen.value = true
  judgeResult.value = null
  const options = await loadProblemOptions()
  ojProblemId.value = payload.problemId
  const found = options.find((item) => item.id === payload.problemId)
  await setupEditor(found || { id: payload.problemId, title: title || payload.title, templateCode: '' })
}

const openOj = async () => {
  if (!currentProblem.value) {
    ElMessage.warning('先选一道题')
    return
  }
  await openOjWith({ problemId: currentProblem.value.id, title: currentProblem.value.title }, currentProblem.value.title)
}

/** 从错题/相似题卡片追问同类型题：把题名带上，算法哥靠题名认题。
    注意别用「给我几道…题」的说法——那句会被本地 parseAction 当成「找一道题」，
    在到算法哥之前就被拦下了。 */
const askSimilar = (item) => send(`有没有和「${item.title}」类似的题`)

const onOjProblemChange = async (problemId) => {
  const found = problemOptions.value.find((item) => item.id === problemId)
  await setupEditor(found || { id: problemId })
}

const setupEditor = async (problem) => {
  let detail = problem
  if (!detail.templateCode && detail.id) {
    const res = await getProblemDetail(detail.id)
    detail = res.data || detail
  }
  currentProblem.value = {
    id: detail.id,
    title: detail.title,
    difficulty: detail.difficulty
  }
  await nextTick()
  if (!editor && editorRef.value) {
    editor = monaco.editor.create(editorRef.value, {
      value: detail.templateCode || '',
      language: 'java',
      theme: setupPixelTheme(monaco),
      fontSize: 14,
      automaticLayout: true,
      minimap: { enabled: false },
      scrollBeyondLastLine: false
    })
  } else {
    editor.setValue(detail.templateCode || '')
  }
}

const runCode = async () => {
  await judge(false)
}

const submitCode = async () => {
  await judge(true)
}

const judge = async (isSubmit) => {
  if (!editor || !ojProblemId.value) {
    ElMessage.warning('先选一道题')
    return
  }
  judging.value = true
  try {
    const res = await compileAndJudge({
      problemId: ojProblemId.value,
      code: editor.getValue(),
      language: 'JAVA'
    })
    judgeResult.value = res.data
    if (isSubmit && res.data.status === 'ACCEPTED') {
      window.dispatchEvent(new CustomEvent('problemCompleted'))
    }
  } finally {
    judging.value = false
  }
}

const askJudgeExplain = () => {
  ojOpen.value = false
  send(currentProblem.value
    ? `我刚提交了 #${currentProblem.value.id} ${currentProblem.value.title}，判题结果是「${statusText(judgeResult.value.status)}」，为什么？`
    : `刚才那次判题结果是「${statusText(judgeResult.value.status)}」，为什么？`)
}

// ------------------------------------------------------------------ 初始化

/** 从别处（地图里的悬浮对话、题目页）跳进来时带的 ask 参数 → 自动把这句话问出去 */
const ASK_TEXT = {
  daily: '每日一题',
  plan: '给我排一份刷题计划，每天 3 题，练 7 天',
  analysis: '给我做一次学情分析，指出我的短板和处方',
  rank: '我现在的排名怎么样',
  judge: '这道题我刚才那次提交，判题结果帮我看看，为什么是这个结果？'
}

async function runAsk(kind, customText) {
  const text = customText || ASK_TEXT[kind]
  if (!text || sending.value) return
  await send(text, { skipAction: true })
  // 把参数清掉，免得刷新页面又问一遍
  router.replace({ path: '/agent' })
}

onMounted(async () => {
  await loadStatus()
  await loadSessions()
  await loadProblemOptions()

  const queryProblemId = route.query.problemId
  if (queryProblemId) {
    try {
      const res = await getProblemDetail(queryProblemId)
      if (res.data) {
        currentProblem.value = { id: res.data.id, title: res.data.title, difficulty: res.data.difficulty }
      }
    } catch (e) {
      // 题目不存在就忽略
    }
  }
  await loadMemory()
  if (sessions.value.length) {
    currentSessionId.value = sessions.value[0].id
    await loadMessages(currentSessionId.value)
  }

  // 从地图的悬浮对话 / 题目页跳过来，带着 ask 参数，直接把话说出去
  if (route.query.ask) {
    await runAsk(route.query.ask)
  }
})

// 已经站在 /agent 里、又被要求干另一件事（比如从悬浮对话点了「题单」）时，这里接住
watch(() => route.query.ask, (kind) => {
  if (kind) runAsk(kind)
})

onUnmounted(() => {
  if (editor) {
    editor.dispose()
    editor = null
  }
})
</script>

<style scoped>
.agent-page {
  display: flex;
  height: 100vh;
  background: #0d1117;
  color: #e6edf3;
  font-family: ui-sans-serif, system-ui, "PingFang SC", "Microsoft YaHei", sans-serif;
}

/* ---------------- 侧栏 ---------------- */
.agent-side {
  width: 268px;
  flex: 0 0 268px;
  background: #131a24;
  border-right: 1px solid #1f2a37;
  display: flex;
  flex-direction: column;
  padding: 16px 14px;
  gap: 14px;
  overflow-y: auto;
}

.side-brand {
  display: flex;
  align-items: center;
  gap: 10px;
}

.avatar-lg {
  width: 42px;
  height: 42px;
  flex: 0 0 42px;
  border-radius: 12px;
  display: grid;
  place-items: center;
  font-weight: 700;
  font-size: 18px;
  color: #052e16;
  background: linear-gradient(135deg, #4ade80, #22d3ee);
  box-shadow: 0 0 16px rgba(74, 222, 128, 0.35);
}

.brand-text {
  display: flex;
  flex-direction: column;
  line-height: 1.35;
}

.brand-text strong {
  font-size: 16px;
}

.brand-sub {
  font-size: 11px;
  color: #7d8da1;
}

.llm-state {
  font-size: 11px;
  color: #86efac;
  display: flex;
  align-items: center;
  gap: 6px;
  background: rgba(74, 222, 128, 0.08);
  border: 1px solid rgba(74, 222, 128, 0.25);
  border-radius: 8px;
  padding: 6px 8px;
}

.llm-state.off {
  color: #fca5a5;
  background: rgba(248, 113, 113, 0.08);
  border-color: rgba(248, 113, 113, 0.3);
}

.llm-state .dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
  box-shadow: 0 0 8px currentColor;
}

.new-chat {
  width: 100%;
}

.side-block {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.block-title {
  font-size: 11px;
  letter-spacing: 1px;
  color: #64748b;
}

.quick-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.quick {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 10px;
  border-radius: 8px;
  border: 1px solid #1f2a37;
  background: #17202b;
  color: #cbd5e1;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.18s ease;
}

.quick:hover {
  border-color: #4ade80;
  color: #fff;
  transform: translateX(3px);
}

.sessions {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
}

.empty-tip {
  font-size: 12px;
  color: #55637a;
}

/* 账号级记忆：只在当前账号里显示，换个账号就是另一份 */
.memory-block .block-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.mem-clear {
  cursor: pointer;
  color: #7f8ea3;
  letter-spacing: 0;
  transition: color 0.15s;
}

.mem-clear:hover {
  color: #f87171;
}

.memory-text {
  font-size: 12px;
  line-height: 1.7;
  color: #a9b8cc;
  white-space: pre-wrap;
  max-height: 190px;
  overflow-y: auto;
  padding: 8px 10px;
  border-radius: 8px;
  border: 1px solid #263041;
  background: #131a24;
}

.session-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 6px;
  padding: 8px 10px;
  border-radius: 8px;
  font-size: 13px;
  color: #b6c2d1;
  cursor: pointer;
  transition: background 0.15s ease;
}

.session-item:hover {
  background: #1a2430;
}

.session-item.active {
  background: #1d2a38;
  color: #fff;
  border-left: 2px solid #4ade80;
}

.session-title {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.session-del {
  opacity: 0;
  color: #64748b;
}

.session-item:hover .session-del {
  opacity: 1;
}

.session-del:hover {
  color: #f87171;
}

/* ---------------- 主区 ---------------- */
.agent-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.chat-head {
  height: 56px;
  flex: 0 0 56px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 18px;
  border-bottom: 1px solid #1f2a37;
  background: #101822;
}

.head-left,
.head-right {
  display: flex;
  align-items: center;
  gap: 10px;
}

.head-title {
  font-weight: 600;
}

.problem-chip {
  max-width: 320px;
  overflow: hidden;
  text-overflow: ellipsis;
}

.chat-body {
  flex: 1;
  overflow-y: auto;
  padding: 22px 24px 8px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  background-image: radial-gradient(rgba(74, 222, 128, 0.05) 1px, transparent 0);
  background-size: 22px 22px;
}

.welcome {
  margin: 40px auto;
  max-width: 620px;
  text-align: center;
  animation: fade-up 0.4s ease both;
}

.welcome h3 {
  margin: 14px 0 8px;
}

.welcome p {
  color: #93a4b8;
  line-height: 1.8;
  font-size: 14px;
}

.welcome-actions {
  margin-top: 18px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: center;
}

/* 提示「可以直接支使他切页面」的那行小字 */
.welcome-tip {
  margin-top: 8px;
  color: #7d8da1;
  font-size: 12.5px;
}

.suggest {
  padding: 7px 12px;
  border-radius: 999px;
  border: 1px solid #24313f;
  background: #141d27;
  color: #b6c2d1;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.18s ease;
}

.suggest:hover {
  border-color: #22d3ee;
  color: #fff;
  box-shadow: 0 0 12px rgba(34, 211, 238, 0.25);
}

.msg {
  display: flex;
  gap: 10px;
  max-width: 900px;
  animation: fade-up 0.28s ease both;
}

.msg.user {
  flex-direction: row-reverse;
  align-self: flex-end;
}

.msg-avatar {
  width: 34px;
  height: 34px;
  flex: 0 0 34px;
  border-radius: 10px;
  display: grid;
  place-items: center;
  font-size: 13px;
  font-weight: 700;
  color: #052e16;
  background: linear-gradient(135deg, #4ade80, #22d3ee);
}

.msg.user .msg-avatar {
  background: linear-gradient(135deg, #60a5fa, #818cf8);
  color: #0b1220;
}

.msg-bubble {
  background: #141c26;
  border: 1px solid #1f2a37;
  border-radius: 12px;
  padding: 12px 14px;
  min-width: 0;
  max-width: 100%;
}

.msg.user .msg-bubble {
  background: linear-gradient(135deg, #1e3a8a33, #0e749033);
  border-color: #2b4a63;
}

.msg-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 11px;
  color: #64748b;
  margin-bottom: 6px;
}

.intent-tag {
  transform: scale(0.85);
  transform-origin: left center;
}

.msg-content {
  font-size: 14px;
  line-height: 1.75;
  color: #d7e2ee;
  word-break: break-word;
}

.msg-content.error {
  color: #fca5a5;
}

.msg-content :deep(p) {
  margin: 0 0 8px;
}

.msg-content :deep(h1),
.msg-content :deep(h2),
.msg-content :deep(h3),
.msg-content :deep(h4) {
  margin: 12px 0 6px;
  font-size: 15px;
  color: #fff;
}

.msg-content :deep(ul),
.msg-content :deep(ol) {
  margin: 6px 0 10px;
  padding-left: 22px;
}

.msg-content :deep(li) {
  margin: 3px 0;
}

.msg-content :deep(blockquote) {
  margin: 8px 0;
  padding: 6px 12px;
  border-left: 3px solid #22d3ee;
  background: rgba(34, 211, 238, 0.07);
  color: #a5b4c4;
  border-radius: 0 6px 6px 0;
}

.msg-content :deep(hr) {
  border: none;
  border-top: 1px solid #24313f;
  margin: 12px 0;
}

.msg-content :deep(.md-inline) {
  background: #0b111a;
  border: 1px solid #24313f;
  border-radius: 4px;
  padding: 1px 5px;
  font-family: ui-monospace, Consolas, monospace;
  font-size: 12.5px;
  color: #7dd3fc;
}

.msg-content :deep(.md-code) {
  margin: 10px 0;
  border: 1px solid #24313f;
  border-radius: 10px;
  overflow: hidden;
  background: #0b111a;
}

.msg-content :deep(.md-code-head) {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 5px 10px;
  background: #131c27;
  font-size: 11px;
  color: #7d8da1;
  border-bottom: 1px solid #1f2a37;
}

.msg-content :deep(.md-copy) {
  border: none;
  background: transparent;
  color: #7d8da1;
  cursor: pointer;
  font-size: 11px;
}

.msg-content :deep(.md-copy:hover) {
  color: #4ade80;
}

.msg-content :deep(.md-code pre) {
  margin: 0;
  padding: 12px;
  overflow-x: auto;
}

.msg-content :deep(.md-code code) {
  font-family: ui-monospace, Consolas, "Courier New", monospace;
  font-size: 12.5px;
  line-height: 1.65;
  color: #cbd5e1;
  white-space: pre;
}

.msg-content :deep(.md-table) {
  border-collapse: collapse;
  width: 100%;
  margin: 10px 0;
  font-size: 12.5px;
}

.msg-content :deep(.md-table th),
.msg-content :deep(.md-table td) {
  border: 1px solid #24313f;
  padding: 6px 9px;
  text-align: left;
}

.msg-content :deep(.md-table th) {
  background: #16202c;
  color: #93c5fd;
}

.typing {
  display: flex;
  gap: 5px;
  align-items: center;
  padding: 14px 16px;
}

.typing span {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #4ade80;
  animation: blink 1.2s infinite ease-in-out;
}

.typing span:nth-child(2) {
  animation-delay: 0.2s;
}

.typing span:nth-child(3) {
  animation-delay: 0.4s;
}

/* ---------------- 卡片 ---------------- */
.card {
  margin-top: 10px;
  border: 1px solid #24313f;
  border-radius: 10px;
  background: #101823;
  padding: 12px;
  animation: fade-up 0.3s ease both;
}

.card-line {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.card-id {
  font-family: ui-monospace, monospace;
  color: #64748b;
  font-size: 12px;
}

.card-title {
  font-weight: 600;
  color: #e6edf3;
  cursor: pointer;
}

.card-title:hover {
  color: #4ade80;
}

.diff {
  font-size: 11px;
  padding: 1px 7px;
  border-radius: 999px;
}

.diff.EASY {
  color: #4ade80;
  background: rgba(74, 222, 128, 0.12);
}

.diff.MEDIUM {
  color: #fbbf24;
  background: rgba(251, 191, 36, 0.12);
}

.diff.HARD {
  color: #f87171;
  background: rgba(248, 113, 113, 0.12);
}

.card-tags,
.rank-tags {
  margin-top: 8px;
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.tag {
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 999px;
  background: #16202c;
  border: 1px solid #24313f;
  color: #9fb4d0;
}

.tag.warn {
  color: #fbbf24;
  border-color: rgba(251, 191, 36, 0.3);
}

.card-actions {
  margin-top: 10px;
  display: flex;
  gap: 8px;
}

.plan-head {
  display: flex;
  align-items: baseline;
  gap: 10px;
}

.plan-head span {
  font-size: 12px;
  color: #7d8da1;
}

.plan-summary {
  font-size: 12.5px;
  color: #93a4b8;
  margin: 6px 0 10px;
  line-height: 1.7;
}

.plan-day {
  border-top: 1px dashed #24313f;
  padding-top: 8px;
  margin-top: 8px;
}

.day-title {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
}

.day-badge {
  font-size: 11px;
  padding: 1px 8px;
  border-radius: 6px;
  background: rgba(34, 211, 238, 0.14);
  color: #67e8f9;
}

.day-focus {
  font-size: 11px;
  color: #7d8da1;
}

.plan-item {
  padding: 6px 8px;
  border-radius: 8px;
  transition: background 0.15s ease;
}

.plan-item:hover {
  background: #16202c;
}

.plan-item.done .card-title {
  text-decoration: line-through;
  color: #64748b;
}

.stack-head {
  font-size: 12.5px;
  color: #c3d0e0;
  margin-bottom: 6px;
}

/* 错题本 / 相似题卡片：整行都能点，点哪儿都进这道题 */
.wrong-card .item-main,
.similar-card .item-main {
  cursor: pointer;
}

.stack-head b {
  color: #4ade80;
}

.fail-count {
  font-size: 11px;
  color: #f87171;
  background: rgba(248, 113, 113, 0.1);
  padding: 1px 8px;
  border-radius: 999px;
}

.web-results {
  margin-top: 10px;
  border-top: 1px dashed #24313f;
  padding-top: 8px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.web-head {
  font-size: 11px;
  color: #7d8da1;
}

.web-row {
  font-size: 12.5px;
  color: #67e8f9;
  text-decoration: none;
}

.web-row:hover {
  text-decoration: underline;
}

.item-main {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.item-reason {
  font-size: 11.5px;
  color: #7d8da1;
  margin-top: 2px;
}

.item-actions {
  display: flex;
  gap: 4px;
  margin-top: 2px;
}

.stats-card {
  display: flex;
  flex-wrap: wrap;
  gap: 18px;
  align-items: center;
}

.stat {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat b {
  font-size: 18px;
  color: #4ade80;
}

.stat span {
  font-size: 11px;
  color: #7d8da1;
}

.weak-line {
  flex: 1 1 100%;
  font-size: 12px;
  color: #93a4b8;
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
}

.rank-me {
  font-size: 13px;
  color: #cbd5e1;
}

.rank-me b {
  color: #4ade80;
  font-size: 16px;
}

.rank-top {
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.rank-row {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 12.5px;
  color: #b6c2d1;
}

.rank-no {
  width: 18px;
  text-align: center;
  color: #64748b;
  font-family: ui-monospace, monospace;
}

.rank-no.me {
  color: #4ade80;
  font-weight: 700;
}

.rank-name {
  flex: 1;
}

.rank-score {
  color: #7d8da1;
}

.hint-card {
  font-size: 12.5px;
  color: #93a4b8;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.hint-badge {
  align-self: flex-start;
  padding: 1px 9px;
  border-radius: 6px;
  background: linear-gradient(135deg, #4ade80, #22d3ee);
  color: #052e16;
  font-weight: 700;
}

.hint-actions {
  display: flex;
  gap: 6px;
}

/* ---------------- 输入区 ---------------- */
.composer {
  border-top: 1px solid #1f2a37;
  background: #101822;
  padding: 10px 18px 14px;
}

.composer-context {
  font-size: 12px;
  color: #93a4b8;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.composer-context b {
  color: #4ade80;
}

.hint-btns {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.mini {
  font-size: 11px;
  padding: 2px 9px;
  border-radius: 999px;
  border: 1px solid #24313f;
  background: #16202c;
  color: #9fb4d0;
  cursor: pointer;
  transition: all 0.16s ease;
}

.mini:hover {
  border-color: #4ade80;
  color: #4ade80;
}

.composer-row {
  display: flex;
  gap: 10px;
  align-items: flex-end;
}

.composer-input {
  flex: 1;
  resize: none;
  border-radius: 10px;
  border: 1px solid #24313f;
  background: #0d1520;
  color: #e6edf3;
  padding: 10px 12px;
  font-size: 14px;
  line-height: 1.6;
  outline: none;
  font-family: inherit;
  transition: border-color 0.18s ease, box-shadow 0.18s ease;
}

.composer-input:focus {
  border-color: #4ade80;
  box-shadow: 0 0 0 3px rgba(74, 222, 128, 0.12);
}

.send-btn {
  height: 40px;
}

/* ---------------- OJ ---------------- */
.oj-bar {
  display: flex;
  gap: 10px;
  align-items: center;
  margin-bottom: 10px;
}

.oj-editor {
  height: 420px;
  border: 1px solid #24313f;
  border-radius: 8px;
  overflow: hidden;
}

.oj-result {
  margin-top: 12px;
  border-radius: 8px;
  border: 1px solid #24313f;
  padding: 12px;
  background: #0d1520;
}

.oj-result.ACCEPTED {
  border-color: rgba(74, 222, 128, 0.45);
}

.result-head {
  display: flex;
  gap: 14px;
  align-items: baseline;
  font-size: 13px;
}

.result-head b {
  font-size: 15px;
}

.result-block,
.result-pair pre {
  margin: 8px 0 0;
  background: #0a1017;
  border: 1px solid #1f2a37;
  border-radius: 6px;
  padding: 8px 10px;
  font-size: 12px;
  max-height: 160px;
  overflow: auto;
  white-space: pre-wrap;
}

.result-pair {
  display: flex;
  gap: 12px;
  margin-top: 8px;
}

.result-pair > div {
  flex: 1;
  font-size: 11px;
  color: #7d8da1;
}

@keyframes fade-up {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes blink {
  0%, 80%, 100% {
    opacity: 0.25;
    transform: translateY(0);
  }
  40% {
    opacity: 1;
    transform: translateY(-3px);
  }
}
</style>
