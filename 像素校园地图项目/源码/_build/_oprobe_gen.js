
(function(){
  var R = [];
  function note(k, v){ R.push(k + '=' + v); }
  function flush(){ document.title = 'OP|' + R.join(' | '); }
  window.onerror = function(m, u, l, c){ note('ERR@' + l + ':' + c, m); flush(); return false; };

  /* ---------- ① 包浏览器 API：逐笔记 alpha ---------- */
  var REC = false;                 // 只在要判读的窗口里记，省内存也省判断
  var SEQ = {};                    // canvas -> [alpha,...]（用下标当键，避免 Map 迭代顺序问题）
  var KEYS = [];                   // 与 SEQ 对应的 canvas 列表
  var FRAME = 0, FIRSTA = [];      // 每帧第一笔 drawImage 的 alpha（那就是地面 mip）

  function slot(im){
    var i = KEYS.indexOf(im);
    if (i < 0) { KEYS.push(im); SEQ[KEYS.length - 1] = []; i = KEYS.length - 1; }
    return i;
  }
  function clearSeq(){ SEQ = {}; KEYS = []; FIRSTA = []; }

  var _di = CanvasRenderingContext2D.prototype.drawImage;
  CanvasRenderingContext2D.prototype.drawImage = function(){
    var main = this.canvas && this.canvas.id === 'cv';
    if (REC && main){
      if (FIRSTA[FRAME] === undefined) FIRSTA[FRAME] = this.globalAlpha;
      var i = slot(arguments[0]);
      SEQ[i].push(this.globalAlpha);
    }
    return _di.apply(this, arguments);
  };
  var _cr = CanvasRenderingContext2D.prototype.clearRect;
  CanvasRenderingContext2D.prototype.clearRect = function(){
    if (this.canvas && this.canvas.id === 'cv') FRAME++;
    return _cr.apply(this, arguments);
  };

  /* ---------- ② 认楼与选点（全部读产品既有的全局，不加后门） ---------- */
  function bldList(){
    var out = [];
    for (var i = 0; i < props.length; i++)
      if (BLD_IMGS.has(props[i].img)) out.push(props[i]);
    return out;
  }
  function label(b){
    return (b.tag || '-') + '#' + (b.img.width) + 'x' + (b.img.height)
         + '@' + (b.x | 0) + ',' + (b.y | 0);
  }
  /* 人精灵矩形中心落在楼的精灵矩形内，且楼画在人之后 ⇒ 这栋楼会盖住这个人。
     ⚠️ 判据与 parts/73_occl.js 的 occlTick **逐字同款** —— 探针不许自己发明一套。 */
  function occludedBy(x, y, b){
    if (b.baseY <= y) return false;
    var cx = x - CH_AX + CH_W / 2, cy = y - CH_AY + CH_H / 2;
    return cx >= b.x - b.ax && cx <= b.x - b.ax + b.img.width &&
           cy >= b.y - b.ay && cy <= b.y - b.ay + b.img.height;
  }
  /* 找一个人精灵矩形**不被任何楼盖住**的可走点（空对照用）。
     avoid/minD：再要一个离它足够远的（用来把小北支开 —— 她要是也站在某栋楼后，
     那栋楼就该为她变淡，P1/P4 的"全 1"判据会被搅浑）。 */
  function openSpot(B, avoid, minD){
    for (var y = 220; y < WORLD_H - 220; y += 37){
      for (var x = 220; x < WORLD_W - 220; x += 41){
        if (!canWalk(x, y) || blocked(x, y)) continue;
        if (avoid && Math.hypot(x - avoid[0], y - avoid[1]) < (minD || 0)) continue;
        var ok = true;
        for (var i = 0; i < B.length; i++) if (occludedBy(x, y, B[i])) { ok = false; break; }
        if (ok) return [x, y];
      }
    }
    return null;
  }
  /* 找目标楼**附近**一个可走、且不被任何楼盖住的点。
     ⚠️ 为什么非要"附近"而不是用全局空点：相机跟着玩家走，玩家跑远了这栋楼就被
        视口裁掉、根本不进 drawList ⇒ 判据会**假绿**（没画当然没有 alpha < 1）。
        P1/P4/P5/P7 全部要在这栋楼**正在被画**的前提下判。 */
  function nearSpot(B, b){
    for (var r = 120; r <= 480; r += 30){
      for (var a = 0; a < 16; a++){
        var x = b.x + r * Math.cos(a * Math.PI / 8);
        var y = b.baseY + r * Math.sin(a * Math.PI / 8);
        if (!canWalk(x, y) || blocked(x, y)) continue;
        var ok = true;
        for (var i = 0; i < B.length; i++) if (occludedBy(x, y, B[i])) { ok = false; break; }
        if (ok) return [x, y];
      }
    }
    return null;
  }
  /* 找一栋楼**正北**一个可走点（楼体碰撞盒深 34 + 人的半高，所以至少要让开 45px）。
     返回 [x, y, 这栋楼的 prop]。 */
  function behindSpot(B){
    for (var i = 0; i < B.length; i++){
      var b = B[i];
      for (var dy = 45; dy <= 260; dy += 5){
        for (var dx = -b.img.width / 2 + 6; dx <= b.img.width / 2 - 6; dx += 10){
          var x = b.x + dx, y = b.baseY - dy;
          if (!canWalk(x, y) || blocked(x, y)) continue;
          if (occludedBy(x, y, b)) return [x, y, b];
        }
      }
    }
    return null;
  }

  function fadedKeys(){
    var out = [];
    for (var i = 0; i < KEYS.length; i++){
      var v = SEQ[i];
      for (var j = 0; j < v.length; j++) if (v[j] < 1) { out.push(KEYS[i]); break; }
    }
    return out;
  }
  function minAlpha(im){
    var i = KEYS.indexOf(im);
    if (i < 0) return null;
    var v = SEQ[i], m = 1;
    for (var j = 0; j < v.length; j++) if (v[j] < m) m = v[j];
    return m;
  }
  function seqOf(im){
    var i = KEYS.indexOf(im);
    return i < 0 ? [] : SEQ[i];
  }
  function badInfo(B){
    var out = [];
    for (var i = 0; i < KEYS.length; i++){
      var v = SEQ[i], m = 1;
      for (var j = 0; j < v.length; j++) if (v[j] < m) m = v[j];
      if (m >= 1) continue;
      var lbl = '?';
      for (var k = 0; k < B.length; k++) if (B[k].img === KEYS[i]) lbl = label(B[k]);
      out.push(lbl + '|min=' + m.toFixed(3) + '|n=' + v.length);
    }
    return out.length ? out.join(' ') : 'none';
  }
  function allOne(){
    for (var i = 0; i < KEYS.length; i++)
      for (var j = 0; j < SEQ[i].length; j++) if (SEQ[i][j] !== 1) return false;
    return true;
  }
  /* ⚠️ "复原"**不能**用 allOne 判：从楼后走出来的那个窗口里，头几十帧本来就该
     是 0.34 往上爬的恢复斜坡 —— 拿 allOne 去卡，卡住的是**合法的中间态**，
     报出来的红是假红。要看的是**末尾有没有归位**（最后 10 笔必须全是 1）。 */
  function settled(){
    for (var i = 0; i < KEYS.length; i++){
      var v = SEQ[i], n = v.length;
      if (!n) continue;
      for (var j = Math.max(0, n - 10); j < n; j++) if (v[j] !== 1) return false;
    }
    return true;
  }
  function firstLast(im){
    var v = seqOf(im);
    if (!v.length) return '-';
    return v[0].toFixed(3) + '>' + v[v.length - 1].toFixed(3);
  }

  /* 把她挪走：免得她正好站在同一栋楼后面，把 P2/P3 的判据搅浑。 */
  function parkGuide(p){
    GUIDE.x = p[0]; GUIDE.y = p[1];
  }

  var S = { ph: 0, mark: 0, B: null, near: null, gpark: null, bld: null, spot: null };
  function wait(ms){ return Date.now() - S.mark >= ms; }

  function run(){
    switch (S.ph) {

    /* ---------- P0 登记表接上了没 ---------- */
    case 0: {
      S.B = bldList();
      var miss = 0;
      BLD_IMGS.forEach(function(c){
        var hit = false;
        for (var i = 0; i < props.length; i++) if (props[i].img === c) { hit = true; break; }
        if (!hit) miss++;
      });
      note('P0', 'bldImgs=' + BLD_IMGS.size + ' inProps=' + S.B.length + ' orphan=' + miss
        + ' props=' + props.length);
      var bs = behindSpot(S.B);
      if (bs){ S.spot = [bs[0], bs[1]]; S.bld = bs[2]; }
      S.near = S.bld ? nearSpot(S.B, S.bld) : null;
      S.gpark = openSpot(S.B, S.near || [0, 0], 400);
      note('P0b', 'near=' + (S.near ? (S.near[0] | 0) + ',' + (S.near[1] | 0) : 'NULL')
        + ' gpark=' + (S.gpark ? (S.gpark[0] | 0) + ',' + (S.gpark[1] | 0) : 'NULL')
        + ' behind=' + (S.spot ? (S.spot[0] | 0) + ',' + (S.spot[1] | 0) : 'NULL')
        + ' bld=' + (S.bld ? label(S.bld) : '-'));
      S.ph = 1; break;
    }

    /* ---------- P1 空地对照：所有 alpha 全 1 ---------- */
    case 1:
      if (S.near){
        player.x = S.near[0]; player.y = S.near[1];
        parkGuide(S.gpark || [S.near[0] + 40, S.near[1]]);
      }
      clearSeq(); REC = true;
      S.ph = 2; S.mark = Date.now(); break;

    case 2:
      if (!wait(600)) break;
      REC = false;
      note('P1', 'calls=' + (function(){ var n = 0; for (var i = 0; i < KEYS.length; i++) n += SEQ[i].length; return n; })()
        + ' canvases=' + KEYS.length
        + ' allOne=' + (allOne() ? 'Y' : 'N')
        + ' bad=' + fadedKeys().length);
      /* 挪到楼后 */
      if (S.spot){
        player.x = S.spot[0]; player.y = S.spot[1];
        parkGuide([S.near[0], S.near[1]]);
      }
      clearSeq(); REC = true;
      S.ph = 3; S.mark = Date.now(); break;

    /* ---------- P2 楼后触发 ---------- */
    case 3:
      if (!wait(900)) break;
      REC = false;
      note('P2', 'spot=' + (S.spot ? 'Y' : 'N')
        + ' occl=' + (S.spot ? occludedBy(S.spot[0], S.spot[1], S.bld) : '-')
        + ' minA=' + (S.bld ? minAlpha(S.bld.img) : '-')
        + ' fadedN=' + fadedKeys().length);
      S.ph = 4; break;

    /* ---------- P3 淡的正好是那一栋 ---------- */
    case 4: {
      var f = fadedKeys(), sa = 0, bad = [], tag = [];
      for (var i = 0; i < f.length; i++){
        if (BLD_IMGS.has(f[i])) sa++; else bad.push('NOTBLD');
        tag.push(f[i] === (S.bld && S.bld.img) ? 'TARGET' : 'OTHER');
      }
      var others = 0;
      for (var j = 0; j < tag.length; j++) if (tag[j] === 'OTHER') others++;
      note('P3', 'faded=' + f.length + ' allBld=' + (bad.length ? 'N(' + bad.join(',') + ')' : 'Y')
        + ' targetFaded=' + (S.bld && minAlpha(S.bld.img) !== null && minAlpha(S.bld.img) < 1 ? 'Y' : 'N')
        + ' others=' + others);
      /* 挪回空地：走出来就该复原 */
      player.x = S.near[0]; player.y = S.near[1];
      parkGuide(S.gpark || [S.near[0] + 40, S.near[1]]);
      clearSeq(); REC = true;
      S.ph = 5; S.mark = Date.now(); break;
    }

    /* ---------- P4 走出来就复原 ---------- */
    case 5:
      if (!wait(900)) break;
      REC = false;
      note('P4', 'settled=' + (settled() ? 'Y' : 'N')
        + ' tgtSeq=' + (S.bld ? firstLast(S.bld.img) : '-')
        + ' stillFaded=' + fadedKeys().length
        + ' pAt=' + (player.x | 0) + ',' + (player.y | 0)
        + ' gAt=' + (GUIDE.x | 0) + ',' + (GUIDE.y | 0)
        + ' who=' + badInfo(S.B));
      /* 玩家留空地，把小北挪到楼后 */
      if (S.spot){
        parkGuide([S.spot[0], S.spot[1]]);
      }
      clearSeq(); REC = true;
      S.ph = 6; S.mark = Date.now(); break;

    /* ---------- P5 小北也算 ---------- */
    case 6:
      if (!wait(900)) break;
      REC = false;
      note('P5', 'gAt=' + (GUIDE.x | 0) + ',' + (GUIDE.y | 0)
        + ' occl=' + (S.spot ? occludedBy(GUIDE.x, GUIDE.y, S.bld) : '-')
        + ' minA=' + (S.bld ? minAlpha(S.bld.img) : '-')
        + ' fadedN=' + fadedKeys().length);
      /* 收尾：小北挪回空地，玩家也回空地 —— 让 P7 在一个"干净"的基线上跑 */
      parkGuide(S.gpark || [S.near[0] + 40, S.near[1]]);
      player.x = S.near[0]; player.y = S.near[1];
      S.ph = 7; S.mark = Date.now(); break;

    /* ---------- P7 不泄漏：每帧第一笔（地面）恒为 1 ---------- */
    case 7:
      if (!wait(700)) break;
      note('P7a', 'frames=' + FIRSTA.length
        + ' badGround=' + (function(){
            var n = 0;
            for (var i = 0; i < FIRSTA.length; i++) if (FIRSTA[i] !== undefined && FIRSTA[i] !== 1) n++;
            return n;
          })());
      /* P6：连采淡入过程的 alpha 序列（不清 SEQ，专门盯那栋楼） */
      clearSeq(); REC = true;
      if (S.spot){ player.x = S.spot[0]; player.y = S.spot[1]; }
      S.ph = 8; S.mark = Date.now(); break;

    case 8: {
      /* ⚠️ 等"采够 12 笔"而不是等固定毫秒数：录制窗口按墙上时钟算的话，
         headless 的帧率一抖（实测同一张页两次跑，一次 28 笔一次 1 笔）
         就会采到空窗口，P6 判成"没插值"——那是**假红**。 */
      var v8 = S.bld ? seqOf(S.bld.img) : [];
      if (v8.length < 12 && !wait(2000)) break;
      REC = false;
      S.ph = 9; break;
    }

    /* ---------- P6 不闪：单调不增 + 中间值够多 ---------- */
    case 9: {
      var v = S.bld ? seqOf(S.bld.img) : [];
      var mono = true, up = 0, mn = 1, mx = 1;
      for (var i = 0; i < v.length; i++){
        if (v[i] < mn) mn = v[i];
        if (v[i] > mx) mx = v[i];
        if (i && v[i] > v[i - 1] + 1e-9) { up++; mono = false; }
      }
      var uniq = {};
      for (var j = 0; j < v.length; j++) uniq[v[j].toFixed(4)] = 1;
      var tot = 0;
      for (var q = 0; q < KEYS.length; q++) tot += SEQ[q].length;
      note('P6', 'n=' + v.length + ' canvases=' + KEYS.length + ' calls=' + tot
        + ' mono=' + (mono ? 'Y' : 'N') + ' ups=' + up
        + ' first=' + (v.length ? v[0].toFixed(3) : '-') + ' last=' + (v.length ? v[v.length - 1].toFixed(3) : '-')
        + ' min=' + mn.toFixed(3) + ' max=' + mx.toFixed(3)
        + ' uniq=' + Object.keys(uniq).length);
      /* 再跑一遍泄漏判据 —— 这次基线是"刚刚有过淡入"，最能逼出残留 */
      clearSeq(); FIRSTA = [];
      player.x = S.near[0]; player.y = S.near[1];
      parkGuide(S.gpark || [S.near[0] + 40, S.near[1]]);
      REC = true;
      S.ph = 10; S.mark = Date.now(); break;
    }

    case 10:
      if (!wait(700)) break;
      REC = false;
      note('P7b', 'frames=' + FIRSTA.length
        + ' badGround=' + (function(){
            var n = 0;
            for (var i = 0; i < FIRSTA.length; i++) if (FIRSTA[i] !== undefined && FIRSTA[i] !== 1) n++;
            return n;
          })()
        + ' settled=' + (settled() ? 'Y' : 'N')
        + ' tgtSeq=' + (S.bld ? firstLast(S.bld.img) : '-')
        + ' stillFaded=' + fadedKeys().length);
      S.ph = 99; break;
    }
  }

  var T = setInterval(function(){
    if (S.ph >= 99) { clearInterval(T); flush(); return; }
    try { run(); } catch (e) { note('THROW', e.message + ' @ph' + S.ph); S.ph = 99; }
    flush();
  }, 150);
})();
