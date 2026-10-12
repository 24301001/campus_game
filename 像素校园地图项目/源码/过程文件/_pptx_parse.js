const fs = require('fs');
const path = process.argv[2];
const xml = fs.readFileSync(path, 'utf8');

const EMU = 914400;

function unescapeXml(s) {
  return s.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"')
          .replace(/&apos;/g, "'").replace(/&amp;/g, '&');
}

const tokens = [];
const re = /<([\/\?]?)([A-Za-z0-9_:.\-]+)((?:\s+[A-Za-z0-9_:.\-]+\s*=\s*"[^"]*")*)\s*(\/?)>|([^<]+)/g;
let m;
while ((m = re.exec(xml)) !== null) {
  if (m[5] !== undefined) { tokens.push({ t: 'text', v: unescapeXml(m[5]) }); continue; }
  const attrs = {};
  const ar = /([A-Za-z0-9_:.\-]+)\s*=\s*"([^"]*)"/g;
  let a;
  while ((a = ar.exec(m[3] || '')) !== null) attrs[a[1]] = unescapeXml(a[2]);
  tokens.push({ t: 'tag', close: m[1] === '/', self: m[4] === '/', name: m[2], attrs });
}

const root = { name: '#root', children: [] };
const stack = [root];
for (const tk of tokens) {
  if (tk.t === 'text') {
    const cur = stack[stack.length - 1];
    if (cur && tk.v.trim()) cur.__txt = (cur.__txt || '') + tk.v;
    continue;
  }
  if (tk.close) { if (stack.length > 1) stack.pop(); continue; }
  const node = { name: tk.name, attrs: tk.attrs, children: [] };
  stack[stack.length - 1].children.push(node);
  if (!tk.self) stack.push(node);
}

const find = (n, name) => (n.children || []).filter(c => c.name === name);
const find1 = (n, name) => find(n, name)[0];

function collectText(node) {
  let s = '';
  const walk = n => {
    for (const c of n.children) {
      if (c.name === 'a:t') s += c.__txt || '';
      walk(c);
    }
  };
  walk(node);
  return s;
}

function xfrmOf(n) {
  const spPr = find1(n, 'p:spPr') || find1(n, 'a:spPr');
  const gf = find1(n, 'p:xfrm');
  return (spPr && find1(spPr, 'a:xfrm')) || gf || null;
}

function colorOf(fillNode) {
  if (!fillNode) return null;
  const c = fillNode.children[0];
  if (!c) return null;
  if (c.name === 'a:srgbClr') return '#' + c.attrs.val;
  if (c.name === 'a:schemeClr') return 'scheme:' + c.attrs.val;
  if (c.name === 'a:prstClr') return 'prst:' + c.attrs.val;
  if (c.name === 'a:noFill') return null;
  return c.name;
}
function alphaOf(fillNode) {
  if (!fillNode) return 1;
  const c = fillNode.children[0];
  if (!c) return 1;
  const a = find1(c, 'a:alpha');
  return a ? parseInt(a.attrs.val, 10) / 100000 : 1;
}

const out = [];
let idx = 0;

function geomInfo(n) {
  const spPr = find1(n, 'p:spPr');
  if (!spPr) return {};
  const pg = find1(spPr, 'a:prstGeom');
  const cg = find1(spPr, 'a:custGeom');
  const ln = find1(spPr, 'a:ln');
  const fill = find1(spPr, 'a:solidFill') || find1(spPr, 'a:noFill') || find1(spPr, 'a:gradFill');
  let line = null, lineW = null;
  if (ln) {
    line = colorOf(find1(ln, 'a:solidFill'));
    lineW = ln.attrs.w ? parseInt(ln.attrs.w, 10) : 9525;
  }
  return {
    prst: pg ? pg.attrs.prst : (cg ? 'custGeom' : null),
    fill: colorOf(fill), alpha: alphaOf(fill), line, lineW,
    hasBG: !!find1(spPr, 'a:noFill')
  };
}

function walk(node, depth, ox, oy, sx, sy) {
  for (const ch of node.children) {
    if (ch.name === 'p:grpSp') {
      const gx = find1(ch, 'p:grpSpPr');
      const xf = gx && find1(gx, 'a:xfrm');
      let nox = ox, noy = oy, nsx = sx, nsy = sy;
      if (xf) {
        const off = find1(xf, 'a:off'), ext = find1(xf, 'a:ext');
        const cho = find1(xf, 'a:chOff'), che = find1(xf, 'a:chExt');
        if (off && ext && cho && che) {
          const x0 = +off.attrs.x, y0 = +off.attrs.y, cx0 = +ext.attrs.cx, cy0 = +ext.attrs.cy;
          const chx = +cho.attrs.x, chy = +cho.attrs.y, chcx = +che.attrs.cx, chcy = +che.attrs.cy;
          const kx = chcx ? cx0 / chcx : 1, ky = chcy ? cy0 / chcy : 1;
          nox = ox + (x0 - chx * kx) * sx;
          noy = oy + (y0 - chy * ky) * sy;
          nsx = sx * kx; nsy = sy * ky;
        }
      }
      walk(ch, depth + 1, nox, noy, nsx, nsy);
      continue;
    }
    if (ch.name !== 'p:sp' && ch.name !== 'p:cxnSp' && ch.name !== 'p:pic' && ch.name !== 'p:graphicFrame') continue;
    const xf = xfrmOf(ch);
    if (!xf) continue;
    const off = find1(xf, 'a:off'), ext = find1(xf, 'a:ext');
    if (!off || !ext) continue;
    const x = ox + +off.attrs.x * sx, y = oy + +off.attrs.y * sy;
    const w = +ext.attrs.cx * sx, h = +ext.attrs.cy * sy;
    const gi = geomInfo(ch);
    const txt = collectText(ch).replace(/\s+/g, ' ').trim();
    out.push({
      i: idx++, kind: ch.name.replace('p:', ''), depth,
      x: +(x / EMU).toFixed(4), y: +(y / EMU).toFixed(4),
      w: +(w / EMU).toFixed(4), h: +(h / EMU).toFixed(4),
      rot: xf.attrs.rot ? (+xf.attrs.rot / 60000) : 0,
      flipH: xf.attrs.flipH === '1', flipV: xf.attrs.flipV === '1',
      ...gi, text: txt || undefined
    });
  }
}

const spTree = (function seek(n) {
  if (n.name === 'p:spTree') return n;
  for (const c of n.children) { const r = seek(c); if (r) return r; }
  return null;
})(root);
walk(spTree, 0, 0, 0, 1, 1);

const presPath = path.replace(/slides[\\\/]slide1\.xml$/, 'presentation.xml');
const pres = fs.readFileSync(presPath, 'utf8');
const sz = /<p:sldSz([^>]*)\/>/.exec(pres);
console.log('SLIDE:' + (sz ? sz[1].trim() : '?'));

const colorCount = {};
for (const o of out) if (o.fill) colorCount[o.fill] = (colorCount[o.fill] || 0) + 1;
console.log('FILL_STATS:' + JSON.stringify(colorCount));

if (process.argv[3] === '--json') {
  fs.writeFileSync(process.argv[4], JSON.stringify(out, null, 1), 'utf8');
  console.log('JSON_WRITTEN:' + process.argv[4]);
  return;
}

console.log('COUNT:' + out.length);
for (const o of out) {
  const parts = [`#${o.i}`, o.kind, `d${o.depth}`,
    `x=${o.x}`, `y=${o.y}`, `w=${o.w}`, `h=${o.h}`,
    o.rot ? `rot=${o.rot}` : '', o.flipH ? 'fH' : '', o.flipV ? 'fV' : '',
    o.prst || '', o.fill ? `fill=${o.fill}` : '', o.alpha !== 1 ? `a=${o.alpha}` : '',
    o.line ? `ln=${o.line}/${o.lineW}` : '', o.text ? `"${o.text}"` : ''
  ].filter(Boolean);
  console.log(parts.join(' | '));
}
