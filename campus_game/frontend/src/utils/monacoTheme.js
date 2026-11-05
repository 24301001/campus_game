/**
 * Monaco 编辑器的像素配色。
 *
 * vs-dark 的底色是 #1e1e1e（偏灰），和平台的面板色 #1d2129 / 下沉色 #15181e 不一致，
 * 放一起像两块不同的界面。这里定义一套对齐的配色。
 */
export function setupPixelTheme(monaco) {
  monaco.editor.defineTheme('px-dark', {
    base: 'vs-dark',
    inherit: true,
    rules: [
      { token: 'comment', foreground: '6b7d92', fontStyle: 'italic' },
      { token: 'keyword', foreground: 'ffd76e' },
      { token: 'string', foreground: '8fd0ff' },
      { token: 'number', foreground: 'f0a05a' },
      { token: 'type', foreground: '5eead4' }
    ],
    colors: {
      'editor.background': '#15181e',
      'editor.foreground': '#e9e5d8',
      'editorGutter.background': '#15181e',
      'editorLineNumber.foreground': '#4a5364',
      'editorLineNumber.activeForeground': '#ffd76e',
      'editor.lineHighlightBackground': '#1d2129',
      'editor.selectionBackground': '#39404d',
      'editorCursor.foreground': '#ffd76e',
      'editorWidget.background': '#1d2129',
      'editorWidget.border': '#39404d',
      'editorSuggestWidget.background': '#1d2129',
      'editorSuggestWidget.border': '#39404d',
      'minimap.background': '#101216',
      'scrollbarSlider.background': '#39404d88',
      'scrollbarSlider.hoverBackground': '#4a5364cc'
    }
  })
  return 'px-dark'
}
