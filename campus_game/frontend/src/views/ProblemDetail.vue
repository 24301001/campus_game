<template>
  <div class="problem-detail">
    <el-container>
      <el-header>
        <div class="header-content">
          <div class="logo" @click="$router.push('/home')">
            <el-icon><Edit /></el-icon>
            <span>在线编程刷题系统</span>
          </div>
          <div class="nav">
            <el-button @click="$router.push('/home')">首页</el-button>
            <el-button @click="$router.push('/problems')">题库</el-button>
            <template v-if="userStore.user">
              <el-button @click="$router.push('/profile')">个人中心</el-button>
              <el-button v-if="userStore.user.role === 'ADMIN'" @click="$router.push('/admin/dashboard')">管理后台</el-button>
              <el-button type="danger" @click="handleLogout">退出</el-button>
            </template>
            <template v-else>
              <el-button type="primary" @click="$router.push('/login')">登录</el-button>
            </template>
          </div>
        </div>
      </el-header>
      <el-main>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-card>
              <template #header>
                <div class="card-header">
                  <h2>{{ problem.title || '加载中...' }}</h2>
                  <div class="tags">
                    <el-tag v-if="problem.difficulty === 'EASY'" type="success">简单</el-tag>
                    <el-tag v-else-if="problem.difficulty === 'MEDIUM'" type="warning">中等</el-tag>
                    <el-tag v-else type="danger">困难</el-tag>
                  </div>
                </div>
              </template>
              <div class="problem-content">
                <h3>题目描述</h3>
                <p>{{ problem.description }}</p>
                
                <h3>输入描述</h3>
                <p>{{ problem.inputDescription }}</p>
                
                <h3>输出描述</h3>
                <p>{{ problem.outputDescription }}</p>
                
                <h3>示例输入</h3>
                <pre>{{ problem.sampleInput }}</pre>
                
                <h3>示例输出</h3>
                <pre>{{ problem.sampleOutput }}</pre>
              </div>
              
              <el-divider />
              
              <!-- 互动区域 -->
              <div class="interaction-section">
                <el-button @click="handleLike" :type="liked ? 'primary' : 'default'" icon="Star">
                  {{ liked ? '已点赞' : '点赞' }} ({{ likeCount }})
                </el-button>
                <el-button @click="showComments = !showComments" icon="ChatDotRound">
                  评论 ({{ commentCount }})
                </el-button>
                <el-button 
                  @click="handleCollect" 
                  :type="collected ? 'warning' : 'default'"
                  icon="Collection"
                >
                  {{ collected ? '已收藏' : '收藏' }}
                </el-button>
                <el-button @click="showSolution = !showSolution" icon="Reading">
                  题解
                </el-button>
              </div>
              
              <!-- 评论区域 -->
              <div v-if="showComments" class="comments-section">
                <el-divider content-position="left">评论区</el-divider>
                <div class="comment-input">
                  <el-avatar :size="40" :src="currentUserAvatar" />
                  <el-input 
                    v-model="commentContent" 
                    placeholder="发表你的看法..." 
                    @keyup.enter="submitComment"
                    style="flex: 1"
                  />
                  <el-button @click="submitComment" type="primary">发表</el-button>
                </div>
                <div class="comments-list">
                  <div v-for="comment in comments" :key="comment.id" class="comment-item">
                    <div class="comment-left">
                      <el-avatar 
                        :size="36" 
                        :src="comment.avatar || defaultAvatar"
                        @click="goToProfile(comment.userId)"
                        class="avatar-clickable"
                      />
                    </div>
                    <div class="comment-right">
                      <div class="comment-header">
                        <span 
                          class="comment-author"
                          @click="goToProfile(comment.userId)"
                        >
                          {{ comment.username }}
                        </span>
                        <span class="comment-time">{{ comment.createTime }}</span>
                      </div>
                      <p class="comment-content">{{ comment.content }}</p>
                      <div class="comment-actions">
                        <button 
                          class="like-btn"
                          :class="{ liked: comment.isLiked }"
                          @click="handleCommentLike(comment)"
                        >
                          <el-icon><Star /></el-icon>
                          {{ comment.likeCount || 0 }}
                        </button>
                        <button class="reply-btn">
                          <el-icon><ChatDotRound /></el-icon>
                          回复
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- 题解区域 -->
              <div v-if="showSolution" class="solution-section">
                <el-divider content-position="left">官方题解</el-divider>
                <div class="solution-content" @click="handleMarkdownClick($event)" v-html="solutionHtml"></div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="12">
            <el-card>
              <template #header>
                <div class="editor-header">
                  <span>代码编辑</span>
                  <div class="editor-actions">
                    <!-- 语言切换：不可用的语言直接灰掉并写明原因（比如本机没装 Python） -->
                    <el-select
                      v-model="language"
                      size="small"
                      style="width: 132px"
                      @change="onLanguageChange"
                    >
                      <el-option
                        v-for="item in languages"
                        :key="item.key"
                        :label="item.label"
                        :value="item.key"
                        :disabled="!item.available"
                      >
                        <span>{{ item.label }}</span>
                        <span v-if="!item.available" class="lang-off">{{ item.reason }}</span>
                      </el-option>
                    </el-select>
                    <el-button @click="askAgent">
                      <el-icon><ChatDotRound /></el-icon>&nbsp;问算法哥
                    </el-button>
                    <el-button-group>
                      <el-button @click="runCode" :loading="judging" type="success">运行</el-button>
                      <el-button @click="submitCode" :loading="judging" type="primary">提交</el-button>
                    </el-button-group>
                  </div>
                </div>
              </template>
              <div class="editor-container" ref="editorContainer"></div>
              <el-divider />
              <div class="result-section" v-if="judgeResult">
                <h3>运行结果</h3>
                <el-alert :title="getStatusText(judgeResult.status)" :type="getAlertType(judgeResult.status)" :closable="false" />
                <div class="result-details">
                  <div class="result-metrics">
                    <div class="metric-item">
                      <span class="metric-label">运行时间</span>
                      <span class="metric-value">{{ judgeResult.timeUsed || 0 }}ms</span>
                    </div>
                    <div class="metric-item">
                      <span class="metric-label">内存占用</span>
                      <span class="metric-value">{{ judgeResult.memoryUsed || 0 }}KB</span>
                    </div>
                  </div>
                  <div v-if="judgeResult.message">
                    <strong>信息：</strong>
                    <pre>{{ judgeResult.message }}</pre>
                  </div>
                  <div v-if="judgeResult.output">
                    <strong>实际输出：</strong>
                    <pre>{{ judgeResult.output }}</pre>
                  </div>
                  <div v-if="judgeResult.expectedOutput">
                    <strong>预期输出：</strong>
                    <pre>{{ judgeResult.expectedOutput }}</pre>
                  </div>
                  <div v-if="judgeResult.errorMessage">
                    <strong>错误信息：</strong>
                    <pre>{{ judgeResult.errorMessage }}</pre>
                  </div>
                  <el-button class="ask-agent-btn" type="primary" plain @click="askAgentExplain">
                    让算法哥讲讲这次判题
                  </el-button>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </el-main>
    </el-container>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { useUserStore } from '@/stores/user'
import { useRouter, useRoute } from 'vue-router'
import * as agentWatcher from '@/utils/agentWatcher'
import { setupPixelTheme } from '@/utils/monacoTheme'
import { renderMarkdown, handleMarkdownClick } from '@/utils/markdown'
import { getProblemDetail } from '@/api/problem'
import { compileAndJudge, getJudgeLanguages } from '@/api/judge'
import { solveProblem } from '@/api/agent'
import { recordView, likeComment } from '@/api/profile'
import { addCollect, removeCollect, checkCollect } from '@/api/collect'
import { saveNote, getNoteList } from '@/api/note'
import { ElMessage } from 'element-plus'
import * as monaco from 'monaco-editor'

const userStore = useUserStore()
const router = useRouter()
const route = useRoute()

const problem = ref({})
const code = ref('')
const judging = ref(false)
const judgeResult = ref(null)
const editorContainer = ref(null)
let editor = null

const defaultAvatar = 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png'
const currentUserAvatar = userStore.user?.avatar || defaultAvatar

// 互动状态
const liked = ref(false)
const likeCount = ref(0)
const collected = ref(false)
const showComments = ref(false)
const commentCount = ref(0)
const comments = ref([])
const commentContent = ref('')
const showSolution = ref(false)

// 题解按 markdown 渲染：里面常带 **加粗**、`行内代码`、列表和缩进，纯文本会把标记原样显示出来
const solutionHtml = computed(() => renderMarkdown(problem.value.solution || '暂无官方题解'))

/* ---------------- 多语言支持 ----------------
   语言列表（含可用性）由后端 /judge/languages 给，前端不硬编码：
   装了新工具链后端探测到就能用，没装的会灰掉并写明原因。 */
const languages = ref([])
const language = ref('JAVA')
let templateInUse = ''            // 当前编辑器里那份「模板原文」，用户改过就不算

/* 题库里 template_code 为空的兜底：判题机把代码写成 Main.java 编译，类名必须是 Main */
const DEFAULT_TEMPLATE = `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);

        // TODO 1：按题目要求读入数据
        // int n = sc.nextInt();

        // TODO 2：在这里写你的算法

        // TODO 3：输出结果
        // System.out.println(ans);

        sc.close();
    }
}
`

const MONACO_LANG = {
  JAVA: 'java', CPP: 'cpp', C: 'c', PYTHON: 'python', JAVASCRIPT: 'javascript'
}

const loadLanguages = async () => {
  try {
    const res = await getJudgeLanguages()
    languages.value = res.data || []
    const first = languages.value.find(item => item.available)
    if (first) {
      language.value = first.key
      templateInUse = first.template || ''
    }
  } catch (e) {
    // 拉不到语言列表就退回「Java + 内置模板」，至少能判题
    console.log('获取判题语言列表失败，回退 Java')
    templateInUse = DEFAULT_TEMPLATE
  }
}

const templateOf = (key) => {
  const found = languages.value.find(item => item.key === key)
  return (found && found.template) || (key === 'JAVA' ? DEFAULT_TEMPLATE : '')
}

/** 切语言：只换高亮和模板；用户已经改过的代码不许冲掉 */
const applyLanguage = (key) => {
  const template = templateOf(key)
  const current = editor ? editor.getValue() : code.value
  const untouched = !current || current === templateInUse
  templateInUse = template
  if (untouched && template) {
    code.value = template
    if (editor) editor.setValue(template)
  }
  if (editor && editor.getModel()) {
    monaco.editor.setModelLanguage(editor.getModel(), MONACO_LANG[key] || 'plaintext')
  }
}

const onLanguageChange = (key) => {
  const found = languages.value.find(item => item.key === key)
  if (found && !found.available) {
    ElMessage.warning(`${found.label} 在这台机器上不可用：${found.reason}`)
    return
  }
  applyLanguage(key)
}

const loadProblem = async () => {
  try {
    const res = await getProblemDetail(route.params.id)
    problem.value = res.data
    /* ⚠️ 题库这批题（100 道）的 template_code 全是 NULL —— 直接填空串的话编辑器是空白的，
       用户点提交只会拿到 400「代码不能为空」，什么反馈都没有，看着就像"编译坏了"。
       所以没有模板时按当前语言给一份能编过的骨架。 */
    code.value = problem.value.templateCode || templateOf(language.value)
    
    if (userStore.user) {
      recordView(route.params.id).catch(() => {})
      
      try {
        const collectRes = await checkCollect(route.params.id)
        collected.value = collectRes.data === true || collectRes.data === 'true'
      } catch (e) {
        console.log('检查收藏状态失败')
      }
    }
    
    likeCount.value = Math.floor(Math.random() * 100) + 10
    
    try {
      const noteRes = await getNoteList(route.params.id)
      if (noteRes.data && Array.isArray(noteRes.data)) {
        comments.value = noteRes.data.map(note => ({
          id: note.id,
          userId: note.userId,
          username: note.nickname || note.username || '用户',
          avatar: note.avatar,
          content: note.content,
          createTime: new Date(note.createTime).toLocaleString('zh-CN'),
          likeCount: note.likeCount || 0,
          isLiked: false
        }))
        commentCount.value = comments.value.length
      } else {
        comments.value = []
        commentCount.value = 0
      }
    } catch (e) {
      console.log('加载评论失败', e)
      comments.value = []
      commentCount.value = 0
    }
    
    nextTick(() => {
      initEditor()
    })
  } catch (e) {
    ElMessage.error('加载失败')
  }
}

const initEditor = () => {
  if (!editorContainer.value || editor) return
  
  editor = monaco.editor.create(editorContainer.value, {
    value: code.value,
    language: MONACO_LANG[language.value] || 'java',
    theme: setupPixelTheme(monaco),
    fontSize: 14,
    fontFamily: 'Consolas, Monaco, "Courier New", monospace',
    lineNumbers: 'on',
    scrollBeyondLastLine: false,
    automaticLayout: true,
    minimap: { enabled: true },
    tabSize: 4,
    insertSpaces: true,
    wordWrap: 'on',
    padding: { top: 16, bottom: 16 },
    cursorBlinking: 'smooth',
    cursorSmoothCaretAnimation: 'on',
    smoothScrolling: true,
    folding: true,
    foldingHighlight: true,
    bracketPairColorization: { enabled: true }
  })
  
  editor.onDidChangeModelContent(() => {
    code.value = editor.getValue()
  })

  /* 算法哥的观察点：只认「真的在敲」和「真的粘贴」，
     用 onDidType / onDidPaste 而不是 onDidChangeModelContent ——
     后者连程序 setValue（切题时自动填入模板）都会触发，会误判成你在写代码。 */
  editor.onDidType(() => {
    agentWatcher.typing(editor.getModel() ? editor.getModel().getLineCount() : 0)
  })
  editor.onDidPaste(() => {
    agentWatcher.pasted(0)
  })
}

const runCode = async () => {
  judging.value = true
  judgeResult.value = null
  try {
    const res = await compileAndJudge({
      problemId: route.params.id,
      code: code.value,
      language: language.value
    })
    judgeResult.value = res.data
    agentWatcher.ran()                       // 只试跑样例，不算提交
  } catch (e) {
    /* 不能空吞：请求失败（比如代码为空返回 400）时把原因显示在结果区，
       否则界面上毫无反应，用户只会以为"判题坏了"。 */
    judgeResult.value = { status: 'ERROR', message: (e && e.message) || '判题请求失败，检查后端是否在运行' }
  } finally {
    judging.value = false
  }
}

const submitCode = async () => {
  judging.value = true
  judgeResult.value = null
  try {
    const res = await compileAndJudge({
      problemId: route.params.id,
      code: code.value,
      language: language.value
    })
    judgeResult.value = res.data

    // 让算法哥知道你交上去了、结果是什么（他会据此点评）
    agentWatcher.judged(res.data.status)

    // 如果提交成功（ACCEPTED），标记今日为完成
    if (res.data.status === 'ACCEPTED') {
      // 发送事件通知Problems页面更新
      window.dispatchEvent(new CustomEvent('problemCompleted'))
    }
  } catch (e) {
    judgeResult.value = { status: 'ERROR', message: (e && e.message) || '判题请求失败，检查后端是否在运行' }
  } finally {
    judging.value = false
  }
}

// 从题目直接找算法哥：带上题号，登录后由聊天页承接
const askAgent = () => {
  router.push({ path: '/agent', query: { problemId: route.params.id } })
}

const askAgentExplain = () => {
  router.push({ path: '/agent', query: { problemId: route.params.id, ask: 'judge' } })
}

const getStatusText = (status) => {
  const map = {
    'ACCEPTED': '通过',
    'WRONG_ANSWER': '答案错误',
    'COMPILE_ERROR': '编译错误',
    'RUNTIME_ERROR': '运行错误',
    'TIME_LIMIT_EXCEEDED': '超时',
    'ERROR': '提交失败'
  }
  return map[status] || status
}

const getAlertType = (status) => {
  const map = {
    'ACCEPTED': 'success',
    'WRONG_ANSWER': 'warning',
    'COMPILE_ERROR': 'error',
    'RUNTIME_ERROR': 'error',
    'TIME_LIMIT_EXCEEDED': 'warning',
    'ERROR': 'error'
  }
  return map[status] || 'info'
}

const handleLogout = () => {
  userStore.logout()
  ElMessage.success('退出成功')
  router.push('/home')
}

const handleLike = () => {
  if (!userStore.user) {
    ElMessage.warning('请先登录')
    return
  }
  liked.value = !liked.value
  likeCount.value += liked.value ? 1 : -1
  ElMessage.success(liked.value ? '点赞成功' : '取消点赞')
}

const handleCollect = async () => {
  if (!userStore.user) {
    ElMessage.warning('请先登录')
    return
  }
  
  try {
    if (collected.value) {
      await removeCollect(route.params.id)
      collected.value = false
      ElMessage.success('取消收藏成功')
    } else {
      await addCollect(route.params.id)
      collected.value = true
      ElMessage.success('收藏成功')
    }
  } catch (error) {
    ElMessage.error(error.message || '操作失败')
  }
}

const submitComment = async () => {
  if (!userStore.user) {
    ElMessage.warning('请先登录')
    return
  }
  if (!commentContent.value.trim()) {
    ElMessage.warning('请输入评论内容')
    return
  }
  
  try {
    await saveNote({
      problemId: route.params.id,
      content: commentContent.value
    })
    
    comments.value.unshift({
      id: Date.now(),
      userId: userStore.user.id,
      username: userStore.user.nickname || userStore.user.username,
      avatar: userStore.user.avatar,
      content: commentContent.value,
      createTime: new Date().toLocaleString('zh-CN'),
      likeCount: 0,
      isLiked: false
    })
    commentCount.value++
    commentContent.value = ''
    ElMessage.success('评论成功')
  } catch (error) {
    ElMessage.error(error.message || '评论失败')
  }
}

const handleCommentLike = async (comment) => {
  if (!userStore.user) {
    ElMessage.warning('请先登录')
    return
  }
  
  try {
    await likeComment(comment.id)
    comment.isLiked = !comment.isLiked
    comment.likeCount += comment.isLiked ? 1 : -1
    ElMessage.success(comment.isLiked ? '点赞成功' : '取消点赞')
  } catch (e) {
    ElMessage.error(e.message || '操作失败')
  }
}

const goToProfile = (userId) => {
  router.push('/profile/' + userId)
}

watch(() => code.value, (newCode) => {
  if (editor && editor.getValue() !== newCode) {
    editor.setValue(newCode)
  }
})

/* ---------------- 算法哥代写：把代码一个字符一个字符敲进编辑器 ----------------
   两个入口：
   1) 在别处说「帮我写爬楼梯题目」→ 跳到本页并带 ?agentSolve=<时间戳>
   2) 已经站在本页说「我不会这题」→ 只把 query 换成新时间戳，靠 watch 接住 */
const agentWriting = ref(false)

function typeIntoEditor(fullCode) {
  if (!editor) {
    initEditor()
  }
  if (!editor) {
    code.value = fullCode
    return Promise.resolve()
  }
  const model = editor.getModel()
  model.setValue('')
  let i = 0
  // 一次敲几个字符：代码长的时候不至于让人干等
  const step = Math.max(1, Math.round(fullCode.length / 260))
  return new Promise((resolve) => {
    const timer = setInterval(() => {
      i = Math.min(fullCode.length, i + step)
      model.setValue(fullCode.slice(0, i))
      editor.revealLine(model.getLineCount())
      if (i >= fullCode.length) {
        clearInterval(timer)
        code.value = fullCode      // 同步给 vue，判题用的是这份
        resolve()
      }
    }, 18)
  })
}

async function startAgentWrite() {
  if (agentWriting.value) return
  agentWriting.value = true
  try {
    // 他说了「用 Python 写」就听他的（先切编辑器语言）；没说就跟随编辑器当前语言
    const wanted = route.query.lang ? String(route.query.lang) : null
    const wantedSpec = wanted ? languages.value.find(item => item.key === wanted) : null
    const useLang = wantedSpec && wantedSpec.available ? wanted : language.value
    if (useLang !== language.value) {
      language.value = useLang
      if (editor && editor.getModel()) {
        monaco.editor.setModelLanguage(editor.getModel(), MONACO_LANG[useLang] || 'plaintext')
      }
    }
    const res = await solveProblem({ problemId: route.params.id, language: useLang })
    const data = res.data || {}
    if (!data.code) {
      // 八股文概念题 / SQL 题没有能跑的代码 —— 把讲解或 SQL 交给算法哥原样讲出来
      if (data.note) {
        window.dispatchEvent(new CustomEvent('agent-explain', { detail: { text: data.note } }))
      } else {
        ElMessage.warning('算法哥这次没写出来')
      }
      return
    }
    // 万一带回来的语言跟当前不一致，也切过去
    if (data.language && data.language !== language.value && languages.value.some(item => item.key === data.language)) {
      language.value = data.language
      if (editor && editor.getModel()) {
        monaco.editor.setModelLanguage(editor.getModel(), MONACO_LANG[data.language] || 'plaintext')
      }
    }
    await typeIntoEditor(data.code)
    // 告诉算法哥「写完了」，他接着问要不要讲解
    window.dispatchEvent(new CustomEvent('agent-code-done', {
      detail: {
        problemId: route.params.id,
        title: problem.value.title,
        language: data.language || language.value,
        code: data.code,
        note: data.note
      }
    }))
  } catch (e) {
    ElMessage.error('算法哥写的时候卡住了：' + (e.message || e))
  } finally {
    agentWriting.value = false
  }
}

onMounted(async () => {
  // 先拿到语言列表（含默认模板与可用性），再加载题目 —— 否则编辑器会先按错误语言的模板初始化
  await loadLanguages()
  await loadProblem()
  if (route.query.agentSolve) {
    startAgentWrite()
  }
})

// 同一页里换题目时，query 不会重新触发 onMounted，靠这个接住「再写一遍」
watch(() => route.query.agentSolve, (value) => {
  if (value) startAgentWrite()
})

/* 还在这个页面里、只是换成另一道题时（算法哥帮你找题、或从别处跳过来），
   Vue 会复用同一个组件，onMounted 不会再跑，题面就会停在旧题上。
   所以盯住路由参数，换了题就重新拉一遍，顺便把上一题的判题结果、题解展开清掉。 */
watch(() => route.params.id, (id, oldId) => {
  if (!id || id === oldId) return
  judgeResult.value = null
  showSolution.value = false
  liked.value = false
  loadProblem()
})

onUnmounted(() => {
  if (editor) {
    editor.dispose()
  }
})
</script>

<style scoped>
.el-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
  max-width: 1600px;
  margin: 0 auto;
}

.logo {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
}

.nav {
  display: flex;
  gap: 8px;
}

.el-main {
  max-width: 1600px;
  margin: 0 auto;
  width: 100%;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.card-header h2 {
  margin: 0;
  font-size: 20px;
}

.tags {
  display: flex;
  gap: 8px;
}

.problem-content h3 {
  color: #333;
  margin-top: 20px;
  margin-bottom: 10px;
  font-size: 16px;
  font-weight: 600;
}

.problem-content p {
  line-height: 1.8;
  color: #444;
}

.problem-content pre {
  background: #f6f8fa;
  padding: 16px;
  border-radius: 6px;
  white-space: pre-wrap;
  font-family: 'Consolas', 'Monaco', monospace;
  font-size: 14px;
  color: #333;
  overflow-x: auto;
}

.editor-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.editor-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.lang-off {
  float: right;
  color: #f56c6c;
  font-size: 11px;
}

.ask-agent-btn {
  margin-top: 12px;
}

.editor-container {
  height: 500px;
  border-radius: 4px;
  overflow: hidden;
}

.result-section {
  min-height: 100px;
}

.result-metrics {
  display: flex;
  gap: 20px;
  margin-bottom: 15px;
  padding: 10px 15px;
  background: #f5f7fa;
  border-radius: 4px;
}

.metric-item {
  display: flex;
  align-items: center;
  gap: 10px;
}

.metric-label {
  color: #666;
  font-size: 14px;
}

.metric-value {
  font-weight: 600;
  color: #409eff;
  font-size: 14px;
}

.result-details pre {
  background: #1e1e1e;
  color: #d4d4d4;
  padding: 15px;
  border-radius: 4px;
  margin-top: 10px;
  white-space: pre-wrap;
  font-family: 'Consolas', 'Monaco', monospace;
  font-size: 13px;
  overflow-x: auto;
}

.interaction-section {
  display: flex;
  gap: 10px;
  padding-top: 15px;
  flex-wrap: wrap;
}

.comments-section {
  margin-top: 15px;
}

.comment-input {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  align-items: center;
}

.comments-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* 评论区：跟题解区一个道理，必须跟着像素深色主题走。
   原来 .comment-item 写死浅灰底 #fafafa，而正文颜色被全局主题统一成了米白 #e9e5d8，
   浅字压浅底，对比度只有 1.2:1，正文基本糊成水印。现在改成深底 + 米白正文。 */
.comment-item {
  display: flex;
  gap: 12px;
  padding: 16px;
  background: var(--px-sunken, #15181e);
  border: 1px solid var(--px-line-2, #2a2f39);
  border-radius: 8px;
  transition: all 0.25s ease;
}

.comment-item:hover {
  background: var(--px-panel-2, #22262f);
}

.comment-left {
  flex-shrink: 0;
}

.avatar-clickable {
  cursor: pointer;
  transition: transform 0.25s;
}

.avatar-clickable:hover {
  transform: scale(1.1);
}

.comment-right {
  flex: 1;
  min-width: 0;
}

.comment-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.comment-author {
  font-weight: 600;
  color: var(--px-info, #8fd0ff);
  cursor: pointer;
  transition: color 0.25s;
}

.comment-author:hover {
  color: #b9e2ff;
  text-decoration: underline;
}

.comment-time {
  font-size: 12px;
  color: var(--px-muted, #9fb4d0);
}

.comment-content {
  margin: 0 0 10px 0;
  color: var(--px-text, #e9e5d8);
  line-height: 1.6;
  word-break: break-word;
}

.comment-actions {
  display: flex;
  gap: 16px;
}

.like-btn, .reply-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  background: transparent;
  border: none;
  cursor: pointer;
  color: var(--px-muted, #9fb4d0);
  font-size: 13px;
  border-radius: 4px;
  transition: all 0.25s;
}

.like-btn:hover, .reply-btn:hover {
  background: rgba(143, 208, 255, 0.12);
  color: var(--px-info, #8fd0ff);
}

.like-btn.liked {
  color: #faad14;
}

.solution-section {
  margin-top: 15px;
}

/* 题解区：跟着像素深色主题走。
   原来是浅绿底 + 绿字，结果正文被全局主题色（米白 #e9e5d8）覆盖，落在浅绿上几乎看不见；
   现在改成深底 + 米白正文 + 绿色点缀，左侧一条绿线保留「题解」的辨识度。 */
.solution-content {
  padding: 15px;
  background: var(--px-sunken, #15181e);
  border: 1px solid var(--px-line-2, #2a2f39);
  border-left: 3px solid var(--px-ok, #4ade80);
  border-radius: 4px;
  line-height: 1.8;
  color: var(--px-text, #e9e5d8);
}

/* 题解是用 markdown 渲染的（v-html 进来的节点不带 scoped 标记，只能用 :deep 命中） */
.solution-content :deep(p) {
  margin: 0 0 8px;
  color: var(--px-text, #e9e5d8);
}

.solution-content :deep(p:last-child) {
  margin-bottom: 0;
}

.solution-content :deep(strong) {
  color: var(--px-ok, #4ade80);
}

.solution-content :deep(ul),
.solution-content :deep(ol) {
  margin: 6px 0;
  padding-left: 22px;
}

.solution-content :deep(li) {
  margin: 2px 0;
  color: var(--px-text, #e9e5d8);
}

.solution-content :deep(h1),
.solution-content :deep(h2),
.solution-content :deep(h3),
.solution-content :deep(h4) {
  margin: 10px 0 6px;
  font-size: 14px;
  color: var(--px-ok, #4ade80);
}

.solution-content :deep(code.md-inline) {
  padding: 1px 5px;
  border-radius: 3px;
  background: rgba(74, 222, 128, 0.14);
  color: var(--px-ok, #4ade80);
  font-family: ui-monospace, Consolas, monospace;
  font-size: 12.5px;
}

.solution-content :deep(blockquote) {
  margin: 6px 0;
  padding-left: 10px;
  border-left: 3px solid var(--px-line, #39404d);
  color: var(--px-muted, #9fb4d0);
}

:deep(.monaco-editor) {
  height: 100%;
}

/* ⚠️ 这三条原先硬编码成 vs-dark 的 #1e1e1e / #252526，还带 !important，
   把 Monaco 主题（utils/monacoTheme.js 里对齐平台的配色）整个盖住了 ——
   表现是外层容器和行号槽是新配色、代码区却还是旧的灰。这里跟着主题走。 */
:deep(.monaco-editor-background) {
  background-color: #15181e !important;
}

:deep(.monaco-editor .line-numbers) {
  background-color: #15181e !important;
  color: #4a5364;
}
</style>