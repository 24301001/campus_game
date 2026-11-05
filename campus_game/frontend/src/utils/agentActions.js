/**
 * 算法哥的「动手」能力
 * ------------------------------------------------------------------
 * 你说一句「打开题库」「看我的收藏」「给我排个题单」，
 * 这里负责把它翻译成一个动作：跳到哪个页面、要不要顺便把活干了。
 *
 * 取舍：本地关键词匹配为主，不调大模型。
 * 好处是零延迟、零成本、断网也能用，而且行为可预期（不会猜歪）；
 * 代价是说法得沾点边——所以同一件事尽量把常见说法都列进 words。
 * 没命中就返回 null，交回给大模型正常聊天。
 *
 * 唯一要联网的是「找题」：难度、类型、题目名这三种得去题库里翻，
 * 由 findProblem() 负责，翻到了就返回题号让他跳过去。
 */
import { getProblemList } from '@/api/problem'
import { getTagList } from '@/api/tag'

const MAX_LEN = 40          // 超过这个长度多半是在聊天，不是在指挥他干活

const ACTIONS = [
  // ---------- 今日战报：不跳页，就在对话里用真实数据给你报一遍 ----------
  { id: 'today-report', reply: '行，今天干了啥我给你翻一遍。',
    words: [
      '今天的做题情况', '今日做题情况', '我的做题情况', '最近做题情况', '做题情况', '刷题情况',
      '今天的战绩', '今天战绩', '今日战绩', '战绩', '今天的战况', '今天战况', '今日战况', '战况',
      '战报', '今天的表现', '今日表现', '今天咋样', '今天咋样了',
      '今天干了啥', '今天干了什么', '今天干了点啥', '今天搞了几道', '今天做了啥',
      '今天有提交吗', '我今天交了吗', '今天的战果', '我今天的战果',
      '今天做了几道', '今天做了多少', '今天做', '今天刷了', '今天刷', '今天练', '今天过了几道',
      '今天交了', '今天交', '今天提交', '今日提交', '今天的提交', '今天的数据', '今日数据',
      '今天的记录', '今天的进度', '今日进度', '打卡', '连续打卡', '我今天怎么样', '我最近怎么样',
      '今天表现怎么样', '今天怎么样'
    ] },

  // ---------- 去完整界面把活干了（题单/排名这类有卡片，界面里看更清楚）----------
  { id: 'daily', path: '/agent?ask=daily', reply: '每日一题，进去给你挑一道，别挑食。',
    words: ['每日一题', '今日一题', '今天做什么题', '今天做什么', '今天刷什么', '今天练什么', '今天该做',
      '今天做啥题', '今天做啥', '来道题', '来一题', '来一道', '整一道', '整道题', '给我一道题',
      '随便来一题', '随便来道', '推荐一道', '推荐一题', '出个题', '出道题', '出题', '给道题练练'] },
  { id: 'plan', path: '/agent?ask=plan', reply: '题单我来排，每天几道、练几天，你说了算。',
    words: ['刷题计划', '刷题题单', '题单', '刷题安排', '安排刷题', '计划刷题', '学习计划', '做题计划',
      '训练计划', '练习计划', '排个计划', '给我排一排', '帮我安排一下', '刷题规划', '给我规划',
      '安排个计划', '给我安排', '怎么练', '如何安排'] },
  { id: 'analysis', path: '/agent?ask=analysis', reply: '走，把你哪块虚翻出来晒晒。',
    words: ['学情分析', '学情诊断', '学情报告', '我的短板', '分析一下我', '分析下我', '学习报告',
      '我的水平', '我的能力', '哪块弱', '哪里差', '弱项', '提升方向', '怎么提高', '怎么提升',
      '我的强弱', '能力评估', '给我做个诊断', '我菜在哪', '我弱在哪', '我哪块不行', '哪块不行',
      '我什么水平', '看看我的水平', '我水平怎么样'] },
  { id: 'rank', path: '/agent?ask=rank', reply: '排名在里头，我给你调出来。',
    words: ['排名', '排行榜', '榜单', '我第几', '第几名', '我排第几', '多少人比我强', '我的名次',
      '我的位次', '升了几名', '掉了几名', '我在哪一档', 'rating', '我排多少', '排多少名',
      '我排名咋样', '名次怎么样'] },
  { id: 'judge', path: '/agent?ask=judge', reply: '去里头，这次判题我给你掰开讲。',
    words: ['为什么没过', '为什么错', '错哪了', '我错哪', '判题结果', '讲讲判题', '判题报告',
      '刚才那次提交', '刚才这次提交', '看看这次提交', '为什么wa', '为什么超时', '为什么编译错误',
      '为什么答案错误', '这次判题', '帮我看看判题', '为啥没过', '为啥错了', '错哪儿了', '这题为啥错',
      '为什么过不了', '刚才那个提交', '刚刚那次提交'] },

  // ---------- 页面导航 ----------
  { id: 'problems', path: '/problems', reply: '题库开了。挑有难度的，别又捡最顺手的刷。',
    words: ['题库', '题目列表', '我要刷题', '去刷题', '刷题去', '找题', '做题去', '打开题目', '所有题目',
      '有哪些题', '有什么题', '有啥题', '题目大全', '刷题页面', '去做题', '开始刷题', '看看题', '看题去',
      '开题库', '去题库'] },
  { id: 'home', path: '/home', reply: '回地图了，随便逛。',
    words: ['首页', '回首页', '返回首页', '回地图', '校园地图', '回大厅', '回学校', '回校园', '主页'] },
  { id: 'submissions', path: '/profile?tab=recent', reply: '你交过的都在个人主页「最近通过」里，自己翻。',
    words: ['提交记录', '我的提交', '我交过', '判题记录', '提交历史', '提交列表', '我交了哪些', '看提交',
      '我的提交记录', '都交了啥'] },
  { id: 'favorites', path: '/profile?tab=favorites', reply: '收藏夹在个人主页。光收不做等于没收藏。',
    words: ['收藏夹', '我的收藏', '我收藏的', '收藏的题', '收藏', '收藏的题目'] },
  { id: 'dashboard', path: '/profile', reply: '数据都在个人主页：雷达、热力图、难度分布，一眼看出虚在哪。',
    words: ['学情看板', '数据看板', '数据统计', '我的数据', '做题统计', '通过率', '统计图', '趋势图',
      '我的曲线', '看看我的数据', '我的统计'] },
  { id: 'settings', path: '/profile?settings=1', reply: '设置给你弹出来了，头像、昵称、密码都在里头。',
    words: ['账号设置', '个人设置', '改密码', '修改密码', '账号安全', '设置'] },
  { id: 'profile', path: '/profile', reply: '个人主页给你开着了。',
    words: ['个人中心', '个人资料', '我的主页', '我的资料', '我的账号', '我的信息', '资料页', '个人主页'] },
  { id: 'agent', path: '/agent', reply: '进完整界面，题目、题单、排名都在这儿。',
    words: ['完整界面', '算法哥界面', '聊天界面', '对话界面', '完整对话', '工具箱', '打开算法哥'] },

  // ---------- 管理后台（只有管理员进得去）----------
  { id: 'admin-users', path: '/admin/users', admin: true, reply: '用户管理开了，下手轻点。',
    words: ['用户管理', '管理用户'] },
  { id: 'admin-problems', path: '/admin/problems', admin: true, reply: '题目管理开了。',
    words: ['题目管理', '管理题目'] },
  { id: 'admin-submissions', path: '/admin/submissions', admin: true, reply: '提交管理开了。',
    words: ['提交管理', '管理提交'] },
  { id: 'admin', path: '/admin/dashboard', admin: true, reply: '管理后台开了。',
    words: ['管理后台', '后台', 'admin'] }
]

// ---------------- 去题库里找题 ----------------
// 难度、类型、题目名这三种得真去翻题库，所以解析出来的动作只带条件，
// 由 findProblem() 拿着条件去查接口、挑一道、把题号返回回来。

const DIFFICULTIES = [
  // 注意别有「基础」这种词：题库里有道题就叫「二分查找基础」，会被误判成难度
  { level: 'EASY', words: ['简单', '容易', '入门', '新手'] },
  { level: 'MEDIUM', words: ['中等', '适中', '进阶'] },
  { level: 'HARD', words: ['困难', '难题', '难', '挑战'] }
]
const DIFF_LABEL = { EASY: '简单', MEDIUM: '中等', HARD: '困难' }

/** 题库里的标签（跟数据库里那份对齐；解析时按名字认，查题时再换成 id） */
const TAG_WORDS = [
  '数组', '字符串', '哈希表', '链表', '双指针', '栈', '队列', '树',
  '动态规划', '数学', '二分查找', '贪心', '回溯', '排序', '堆', '位运算', '图论',
  // 题库里还有一半是 SQL / 计网 / 操作系统这类，同样能这么找
  'SQL', '计算机网络', '操作系统', '设计模式', 'Java 基础', '并发编程', '系统设计', '面试软技能'
]

/** 别名：用户不一定说标准标签名 */
const TAG_ALIAS = {
  树: ['二叉树'],
  图论: ['图'],
  位运算: ['位操作'],
  二分查找: ['二分', '二分法'],
  动态规划: ['动规', 'dp'],
  哈希表: ['哈希'],
  计算机网络: ['计网', '网络'],
  操作系统: ['os'],
  并发编程: ['并发', '多线程'],
  系统设计: ['架构设计', '系统架构', '架构'],
  面试软技能: ['面试题', '软技能', '八股'],
  设计模式: ['模式'],
  SQL: ['数据库']
}

/** 比对用的归一化：去掉空格、转小写（「Java 基础」在输入里会变成「java基础」） */
function normWord(text) {
  return String(text).replace(/\s+/g, '').toLowerCase()
}

/* ---------------- 按题库分类「筛」题 ----------------
   题库页顶上那排分类标签（算法 / 数据结构 / 动态规划…）点一下就能筛。
   这里让「打开算法题」这类话等价于点那个标签：跳到题库并把该分类选中，
   而不是随便挑一道题打开（挑单题是 parseFind 的活儿）。 */
const CATEGORY_WORDS = [
  '算法', '数据结构', 'SQL', 'Java基础', '系统设计', '面试真题',
  '树', '图论', '动态规划', '贪心算法', '回溯算法', '二分查找', '排序算法', '堆',
  '位运算', '数学', '设计模式', '网络', '操作系统', '并发编程', '分布式系统'
]

/** 别名：用户不一定说标准分类名 */
const CATEGORY_ALIAS = {
  数据结构: ['结构'],
  动态规划: ['dp', '动规'],
  Java基础: ['java'],
  网络: ['计算机网络', '计网'],
  操作系统: ['os'],
  位运算: ['位操作'],
  二分查找: ['二分', '二分法'],
  排序算法: ['排序'],
  并发编程: ['并发', '多线程'],
  系统设计: ['架构设计', '系统架构'],
  面试真题: ['面经']
}

const CATEGORY_INTENT_RE = /(打开|看看|看下|浏览|筛选|筛一下|过滤|切到|切成|换到|跳到|只看|只要|只显示|显示|列出|我要|我想|给我|来点|来一批|来几道|刷|做|练)/
const CATEGORY_STRIP_RE = /(打开|看看|看下|浏览|筛选|筛一下|过滤|切到|切成|换到|跳到|只看|只要|只显示|显示|列出|我要|我想|给我|来点|来一批|来几道|刷|做|练|题目|题库|题|分类|类|的|一下|一点|一些|些|点|几道|一道|吧|了)/g
/** 「给我一道动态规划的题」是想要一道题，不是要筛选 */
const ONE_PROBLEM_RE = /(一道|一题|几道|推荐|出题|随便来|挑一道)/
/** 「讲一下算法题」是在问知识，不是在筛题 */
const EXPLAIN_RE = /(讲|说说|解释|介绍|科普|为什么|是什么|区别|怎么学|如何学)/

function matchCategory(word) {
  const w = normWord(word)
  if (!w) return null
  const exact = CATEGORY_WORDS.filter((n) => normWord(n) === w).sort((a, b) => b.length - a.length)[0]
  if (exact) return exact
  for (const name of CATEGORY_WORDS) {
    const alias = CATEGORY_ALIAS[name]
    if (alias && alias.some((a) => normWord(a) === w)) return name
  }
  // 退一步：包含关系（「帮我打开算法题」剥完还剩个「帮我算法」）
  return CATEGORY_WORDS.filter((n) => w.includes(normWord(n))).sort((a, b) => b.length - a.length)[0] || null
}

/** 「打开算法题」「筛选一下数据结构」「只看 SQL」→ 跳题库并按该分类筛 */
function parseCategoryFilter(raw) {
  // 「算法哥」是算法哥本人，不是分类
  const text = raw.replace(/算法哥/g, '')
  if (!CATEGORY_INTENT_RE.test(text)) return null
  if (ONE_PROBLEM_RE.test(raw) || EXPLAIN_RE.test(text)) return null
  const rest = text.replace(CATEGORY_STRIP_RE, '').trim()
  if (!rest || rest.length > 8) return null
  const name = matchCategory(rest)
  if (!name) return null
  return {
    id: 'filter-category',
    category: name,
    path: `/problems?category=${encodeURIComponent(name)}`,
    reply: `题库切到「${name}」了，筛选结果直接给你摊开。`
  }
}

/** 要题的说法得带这些动词，免得把「这题好难」这种抱怨当成指令 */
const ASK_VERBS = ['来', '给', '找', '换', '要', '推荐', '挑']

/** 「让他替我写」的说法（长的排前面，剥词时先剥长的） */
const WRITE_PHRASES = [
  '你给我写', '帮我实现', '写一下这题', '做一下这题', '帮我写', '帮我做', '帮我编', '帮我搞',
  '替我写', '你写吧', '你来写', '直接写', '直接给', '给我写', '给我代码',
  '写一份', '写出来', '实现一下'
]
/** 「投降」的说法：配上题目上下文，也算让他写 */
const GIVE_UP_PHRASES = [
  '我不会', '不会做', '不会写', '不会这道', '不会这题', '不会这道题',
  '这题不会', '这道题不会', '这个题不会', '写不出来', '做不出来', '做不来', '写不出'
]
/** 光提「代码 / 答案」也算要代码 */
const WRITE_HINTS = ['代码', '答案']

/** 平台支持的编程语言 + 常见叫法。
    顺序就是优先级：单独的 c 放最后 —— 它太短，「javascript」「cpp」里都有 c，
    得先让长名字匹配上，否则「用 js 写」会被当成 C。 */
const LANG_WORDS = [
  { key: 'JAVASCRIPT', words: ['javascript', 'js', 'node'] },
  { key: 'PYTHON', words: ['python', 'py'] },
  { key: 'CPP', words: ['c++', 'cpp'] },
  { key: 'C', words: ['c语言', 'c'] },
  { key: 'JAVA', words: ['java'] }
]

const LANG_TOKEN = 'javascript|python|c\\+\\+|cpp|c语言|js|node|java|py|c'
/** 「用 Python 写」「c 写」里的语言部分 —— 先剥掉，剩下的才是「帮我写 + 题名」。
    第一支也顺手覆盖平台不支持的语言（「用 go 写」），免得残渣污染题名。 */
const LANG_STRIP_RE = new RegExp(
  '(用|使用|拿|以)\\s*[a-z+#]{1,12}(语言)?|(' + LANG_TOKEN + ')(语言)?\\s*(写|来写|实现)',
  'gi'
)

/** 这句话里指定了哪种语言？没指定返回 null（那就跟随编辑器当前语言） */
function pickLanguage(raw) {
  const t = normWord(raw)
  for (const item of LANG_WORDS) {
    for (const word of item.words) {
      if (word === 'c') {
        // 单个 c 太短，只认「用 c 写」「c 语言」这种紧挨着的写法，免得句子里随便一个 c 都被当语言
        if (/(用|使用|拿|以)c(写|实现|语言)/.test(t)) return 'C'
        continue
      }
      if (t.includes(normWord(word))) return item.key
    }
  }
  return null
}
/** 「打开某某题」的动词，用来从整句里剥出题目名（长的排前面） */
const TITLE_VERBS = [
  '打开', '去做', '开始做', '做一下', '写一下', '练一下',
  '我想做', '我要做', '我想', '我要', '给我', '帮我',
  '做', '写', '练', '刷', '看', '看看', '来'
]

/** 从「打开两数之和」里剥出「两数之和」。
    题目名本身可能带「题」字（背包问题、约瑟夫问题），但「这题 / 一道题」这种指代词不是题名，
    所以只挡指代结构，不挡「题」字本身。 */
function pickTitle(raw) {
  for (const verb of TITLE_VERBS) {
    if (raw.indexOf(verb) !== 0) continue
    let rest = raw.slice(verb.length).replace(/^(一下|一道|一题|个|这|那)/, '')
    rest = rest.replace(/(这道题|这题|那道题|那题)$/, '')
    if (rest.length < 2 || rest.length > 20) continue
    if (/(这道题|这题|那道题|那题|一道题|一题|道题|个题)/.test(rest)) continue
    return rest
  }
  return null
}

function parseFind(raw, t) {
  // 「换一道」这种不带条件的
  if (/(换一道|换一题|再来一题|再来一道|随便来一道|随便来一题|随便一道|随便一题)/.test(t)) {
    return { id: 'find-problem', difficulty: null, tag: null, title: null }
  }

  const diff = DIFFICULTIES.find((d) => d.words.some((w) => t.includes(w)))
  let tag = TAG_WORDS.find((w) => t.includes(normWord(w)))
  if (!tag) {
    for (const name of Object.keys(TAG_ALIAS)) {
      if (TAG_ALIAS[name].some((a) => t.includes(normWord(a)))) { tag = name; break }
    }
  }
  const asks = ASK_VERBS.some((v) => t.includes(v))

  // 说了难度或类型 → 按条件去翻
  if (asks && (diff || tag)) {
    return { id: 'find-problem', difficulty: diff ? diff.level : null, tag, title: null }
  }

  // 「打开两数之和」→ 按题目名找（已经指定难度/类型时就不当题名了）
  const title = diff || tag ? null : pickTitle(raw)
  if (title) {
    return { id: 'find-problem', difficulty: null, tag: null, title }
  }
  return null
}

/** 从「帮我写爬楼梯问题」里剥出题名：动词、指代、量词、后缀统统去掉。
    题目名本身可能带「题」字（背包问题、二分查找基础），所以只剥这些结构词。 */
function pickWriteTarget(raw, hit) {
  let rest = raw.split(hit).join('')
  rest = rest.replace(/[，。！？、,.!?~：:；;\s]/g, '')
  // 前面粘着的「我不会 / 帮我 / 给我 / 麻烦」
  rest = rest.replace(/^(不会|没能|没|不|帮我|替我|给我|麻烦|请|来|要|想|我|你)+/g, '')
  // 动词残留：「我不会写爬楼梯」里剩下的那个「写」
  rest = rest.replace(/^(写|做|编|实现|完成|给出|来|搞)+/g, '')
  // 后面的指代和量词
  rest = rest.replace(/(这道题|这个题目|这个题|这题|这道|一道题|一道|一个|一下|一份|问题|题目|题|吧|了|的)+$/g, '')
  rest = rest.replace(/^(这道题|这个题目|这个题|这题|这道|一道题|一道|一个|一下|一份|的)+/g, '')
  // 「用 c 写」剥完语言后会剩个「写」尾巴（「最长递增写」），去掉
  rest = rest.replace(/(写|做|实现|编|来写)+$/g, '')
  rest = rest.replace(/的$/g, '')
  if (rest.length < 2 || rest.length > 20) return null
  return rest
}

/** 「帮我写 / 我不会这题」→ 让他把这道题的代码直接写出来。
    也可以顺带指定语言：「用 Python 写爬楼梯」。 */
function parseWrite(raw, t) {
  // 先把「用 python」这类语言片段摘掉，剩下的才是「帮我写 + 题名」
  const cleaned = raw.replace(LANG_STRIP_RE, '')
  const hit = WRITE_PHRASES.find((w) => cleaned.includes(w))
    || GIVE_UP_PHRASES.find((w) => cleaned.includes(w))
    || WRITE_HINTS.find((w) => cleaned.includes(w))
    || (/^(写|做|实现)(一下|一份|个)?(?!的|完|了)/.test(cleaned) ? '写' : null)
  if (!hit) return null

  const base = { id: 'write-code', language: pickLanguage(raw), difficulty: null, tag: null, title: null }
  const target = pickWriteTarget(cleaned, hit)
  if (!target) {
    // 没点名哪道题 → 就用他当前打开的那道（组件里补）
    return base
  }
  const norm = normWord(target)
  const diff = DIFFICULTIES.find((d) => d.words.some((w) => norm.includes(normWord(w))))
  let tag = TAG_WORDS.find((w) => norm.includes(normWord(w)))
  if (!tag) {
    for (const name of Object.keys(TAG_ALIAS)) {
      if (TAG_ALIAS[name].some((a) => norm.includes(normWord(a)))) { tag = name; break }
    }
  }
  // 题名照样带着：查题时先拿它去题库里精确匹配，匹配不上才退化成标签 / 难度
  // （否则「二分查找基础」这种既是题名又含标签的说法会被当成标签，随机开一道二分题）
  return { ...base, difficulty: diff ? diff.level : null, tag, title: target }
}

// ---------------- 真正去题库翻 ----------------

let tagCache = null
let recentPicked = []

async function tagIdOf(name) {
  if (!tagCache) {
    try {
      const res = await getTagList()
      tagCache = res.data || []
    } catch (e) {
      tagCache = []
    }
  }
  const hit = tagCache.find((item) => item.name === name)
  return hit ? hit.id : null
}

/** 题库全量缓存：一共 100 道题，一次拉下来在前端做模糊匹配，比一遍 LIKE 宽容得多 */
let problemCache = null

async function allProblems() {
  if (!problemCache) {
    const res = await getProblemList({ pageNum: 1, pageSize: 200 })
    problemCache = (res.data && res.data.records) || []
  }
  return problemCache
}

/** 按题名找：从「完全相等」一路放宽到「互相包含」——少字、多字、带「问题/题目」都能认 */
async function pickByTitle(title) {
  const list = await allProblems()
  const key = normWord(title)
  if (!key) return null
  const bare = key.replace(/(问题|题目|这道题|这题)$/, '')
  const needles = bare && bare !== key && bare.length >= 2 ? [key, bare] : [key]

  for (const needle of needles) {
    const same = list.find((item) => normWord(item.title) === needle)
    if (same) return same
  }
  for (const needle of needles) {
    const contains = list.find((item) => normWord(item.title).includes(needle))
    if (contains) return contains
  }
  // 反过来：他说得比标题还啰嗦（「那个爬楼梯的题」）
  return list.find((item) => key.includes(normWord(item.title))) || null
}

/**
 * 拿着 parseFind / parseWrite 给的条件去题库翻一道题
 * @returns {Promise<{path: string|null, reply: string}>} path 有值就跳过去，没值就只回一句话
 */
export async function findProblem(action) {
  if (!action) return { path: null, reply: '没听清你要找什么题，再说具体点。' }

  // 1) 有题名就先按题名找 —— 题名比标签、难度都具体
  if (action.title) {
    try {
      const hit = await pickByTitle(action.title)
      if (hit) {
        return {
          path: `/problem/${hit.id}`,
          reply: `第 ${hit.id} 题「${hit.title}」，${DIFF_LABEL[hit.difficulty] || '难度未知'}。写吧。`
        }
      }
    } catch (e) {
      // 题库拉不动就继续往下走标签/难度那条路
    }
    if (!action.tag && !action.difficulty) {
      return {
        path: null,
        reply: `题库里没有「${action.title}」这道题。换个题名，或者说个标签（动态规划、字符串…）、难度，我按类给你找。`
      }
    }
  }

  // 2) 标签 / 难度
  const params = { pageNum: 1, pageSize: 30 }
  if (action.difficulty) params.difficulty = action.difficulty
  if (action.tag) {
    const id = await tagIdOf(action.tag)
    if (!id) return { path: null, reply: `题库里没有「${action.tag}」这一类，换个说法。` }
    params.tagIds = [id]
  }

  let records = []
  try {
    const res = await getProblemList(params)
    records = (res.data && res.data.records) || []
  } catch (e) {
    return { path: null, reply: '题库没翻动，后端可能没起来。' }
  }

  if (!records.length) {
    return { path: null, reply: '这个条件下题库里是空的，换个难度或者换个类型。' }
  }

  // 随机一道，尽量避开刚给过的，免得一直推同一题
  const fresh = records.filter((item) => recentPicked.indexOf(item.id) < 0)
  const pool = (fresh.length ? fresh : records).slice(0, 20)
  const pick = pool[Math.floor(Math.random() * pool.length)]
  recentPicked = [pick.id].concat(recentPicked).slice(0, 8)

  return {
    path: `/problem/${pick.id}`,
    reply: `第 ${pick.id} 题「${pick.title}」，${DIFF_LABEL[pick.difficulty] || '难度未知'}。写吧。`
  }
}

/**
 * 把一句话解析成一个动作，没命中返回 null。
 * @param {string} text 用户说的话
 * @param {{isAdmin?: boolean}} ctx 当前用户是不是管理员（决定后台那几个动作能不能用）
 */
export function parseAction(text, ctx = {}) {
  const raw = String(text || '').replace(/\s+/g, '')
  if (!raw || raw.length > MAX_LEN) return null
  const t = raw.toLowerCase()

  // 「把性别改成女」「改密码」「邮箱改成 x@y.com」「头像换成 https://…」这类改资料的话，
  // 交给后端算法哥去解析和落库，别被下面的「设置」「改密码」这些词抢去跳页面。
  if (/(性别|位置|所在地|地区|城市|加入时间|注册时间|入驻时间|昵称|简介|个性签名|签名|邮箱|头像|密码|用户名|账号名)/.test(t)
      && /(改成|改为|设为|设置为|变成|换成|换|填|修改|改|设置|更新|是|为)/.test(t)) {
    return null
  }

  // 「看看我的错题」「来几道类似的题」这类是在问自己的状态 / 要同类型题，
  // 不是叫他去翻某道题。本地是靠关键词猜的，很土：不拦的话「看看我的错题」会被
  // 拆成一道叫「看我的错题」的题，直接回你「题库里没这道题」。
  // 这些都放行给后端算法哥（他会结合上下文、必要时带大模型）去理解。
  if (/(错题|做错的题|做错了|错了哪些|没过的题|没过哪些|没过关|没做出来|栽跟头|翻车|搞不定|啃不动|没搞定|没ac|类似的题|类似题|相似的题|相似题|同类题|同类型的题)/.test(t)) {
    return null
  }

  // 「帮我把这题收藏了」「收藏一下第 5 题」是让算法哥动手收藏，放行给后端；
  // 「我的收藏 / 收藏夹」还是在看列表，照旧跳个人主页，所以把它们排除掉。
  if (/(收藏|收一下|加收藏)/.test(t)
      && /(帮我|替我|给我|把|给|收藏一下|收藏下|收一下|加收藏|取消收藏|收藏了|收藏第|收藏\d)/.test(t)
      && !/(我的收藏|收藏夹|收藏的题|收藏的题目|收藏列表|看收藏)/.test(t)) {
    return null
  }

  // 「发个讨论」也是让算法哥动手。不拦的话「帮我发个讨论」会被拆成一道叫
  // 「发个讨论」的题，回你「题库里没这道题」。
  if (/(讨论|评论|发帖|留言)/.test(t) && /(发|发布|写|留|帮我|替我|给我|来一条|来一段)/.test(t)) {
    return null
  }

  // 「打开第 207 题」「去做 12 号题」这种带题号的
  const num = t.match(/(\d{1,5})/)
  if (num && /(打开|做|写|去|来|切|进)/.test(t) && /(题|problem)/.test(t)) {
    return {
      id: 'open-problem',
      path: `/problem/${num[1]}`,
      reply: `第 ${num[1]} 题给你摊开了，写完直接交。`
    }
  }

  // 「打开算法题」「筛选一下数据结构」→ 等价于点题库顶上的分类标签
  const categoryFilter = parseCategoryFilter(raw)
  if (categoryFilter) return categoryFilter

  // 关键词匹配：长词优先，免得「刷题计划」被「刷题」抢走
  let best = null
  for (const item of ACTIONS) {
    for (const word of item.words) {
      const w = word.toLowerCase()
      if (!t.includes(w)) continue
      if (!best || w.length > best.word.length) best = { item, word: w }
    }
  }
  if (best) {
    if (best.item.admin && !ctx.isAdmin) {
      return { id: 'denied', path: null, reply: '那是管理后台，你这号进不去。' }
    }
    return best.item
  }

  // 固定动作都没命中 → 先看是不是让我「直接写」，再看是不是让我去题库里找题
  const write = parseWrite(raw, t)
  if (write) return write
  return parseFind(raw, t)
}
