/**
 * 轻量 Markdown 渲染：算法哥的回话要能显示标题、表格、列表和代码块。
 * 项目里没装 markdown 库，这里自己实现一份够用的（先转义再渲染，避免 XSS）。
 */

const escapeHtml = (value) =>
  String(value).replace(/[&<>"']/g, (char) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }[char]))

const inline = (text) =>
  text
    .replace(/`([^`]+)`/g, '<code class="md-inline">$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/(^|[^*\w])\*([^*\n]+)\*/g, '$1<em>$2</em>')
    .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>')

const renderCodeBlock = (block) => {
  const lang = escapeHtml(block.lang || 'code')
  return `<div class="md-code"><div class="md-code-head"><span>${lang}</span>`
    + '<button type="button" class="md-copy">复制</button></div>'
    + `<pre><code>${escapeHtml(block.code)}</code></pre></div>`
}

const renderTable = (rows) => {
  const parseRow = (row) => row.replace(/^\s*\|/, '').replace(/\|\s*$/, '').split('|').map((cell) => cell.trim())
  const head = parseRow(rows[0])
  const body = rows.slice(1).map(parseRow)
  return '<table class="md-table"><thead><tr>'
    + head.map((cell) => `<th>${inline(cell)}</th>`).join('')
    + '</tr></thead><tbody>'
    + body.map((cells) => '<tr>' + cells.map((cell) => `<td>${inline(cell)}</td>`).join('') + '</tr>').join('')
    + '</tbody></table>'
}

const isTableSeparator = (line) => /^\s*\|?[\s:|-]+\|[\s:|-]*$/.test(line || '')

export function renderMarkdown(source) {
  if (!source) {
    return ''
  }
  let text = String(source).replace(/\r\n?/g, '\n')

  // 先把代码块抽出来，避免里面的内容被后续规则破坏
  const codeBlocks = []
  text = text.replace(/```([^\n`]*)\n?([\s\S]*?)```/g, (match, lang, code) => {
    const index = codeBlocks.length
    codeBlocks.push({ lang: (lang || '').trim(), code: String(code).replace(/\n+$/, '') })
    return `\u0000CODE${index}\u0000`
  })

  text = escapeHtml(text)

  const lines = text.split('\n')
  const html = []
  let listTag = null
  let paragraph = []

  const flushParagraph = () => {
    if (paragraph.length) {
      html.push('<p>' + inline(paragraph.join('<br>')) + '</p>')
      paragraph = []
    }
  }
  const closeList = () => {
    if (listTag) {
      html.push(`</${listTag}>`)
      listTag = null
    }
  }
  const openList = (tag) => {
    if (listTag !== tag) {
      closeList()
      html.push(`<${tag}>`)
      listTag = tag
    }
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].replace(/\s+$/, '')

    if (!line.trim()) {
      flushParagraph()
      closeList()
      continue
    }

    const codeMatch = line.trim().match(/^\u0000CODE(\d+)\u0000$/)
    if (codeMatch) {
      flushParagraph()
      closeList()
      html.push(renderCodeBlock(codeBlocks[Number(codeMatch[1])]))
      continue
    }

    if (line.includes('|') && isTableSeparator(lines[i + 1])) {
      flushParagraph()
      closeList()
      const rows = [line]
      i += 1
      while (i + 1 < lines.length && lines[i + 1].includes('|')) {
        rows.push(lines[i + 1])
        i += 1
      }
      html.push(renderTable(rows))
      continue
    }

    let match
    if ((match = line.match(/^(#{1,6})\s+(.*)$/))) {
      flushParagraph()
      closeList()
      const level = Math.min(match[1].length, 4)
      html.push(`<h${level}>${inline(match[2])}</h${level}>`)
      continue
    }
    if (/^\s*(-{3,}|\*{3,}|_{3,})\s*$/.test(line)) {
      flushParagraph()
      closeList()
      html.push('<hr>')
      continue
    }
    if ((match = line.match(/^>\s?(.*)$/))) {
      flushParagraph()
      closeList()
      html.push(`<blockquote>${inline(match[1])}</blockquote>`)
      continue
    }
    if ((match = line.match(/^\s*[-*+]\s+(.*)$/))) {
      flushParagraph()
      openList('ul')
      html.push(`<li>${inline(match[1])}</li>`)
      continue
    }
    if ((match = line.match(/^\s*\d+[.)]\s+(.*)$/))) {
      flushParagraph()
      openList('ol')
      html.push(`<li>${inline(match[1])}</li>`)
      continue
    }

    paragraph.push(line)
  }

  flushParagraph()
  closeList()
  return html.join('\n')
}

/** 复制文本，优先用剪贴板 API，失败时退回 execCommand */
export async function copyText(text) {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text)
      return true
    }
  } catch (e) {
    // 继续走兜底方案
  }
  try {
    const area = document.createElement('textarea')
    area.value = text
    area.style.position = 'fixed'
    area.style.opacity = '0'
    document.body.appendChild(area)
    area.select()
    const ok = document.execCommand('copy')
    document.body.removeChild(area)
    return ok
  } catch (e) {
    return false
  }
}

/** 代码块「复制」按钮的统一代理：在容器上监听 click 即可 */
export function handleMarkdownClick(event) {
  const button = event.target.closest('.md-copy')
  if (!button) {
    return false
  }
  const block = button.closest('.md-code')
  const code = block ? block.querySelector('code') : null
  if (code) {
    copyText(code.innerText).then((ok) => {
      button.textContent = ok ? '已复制' : '复制失败'
      setTimeout(() => { button.textContent = '复制' }, 1500)
    })
  }
  return true
}
