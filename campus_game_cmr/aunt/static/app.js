(function () {
  "use strict";

  const $ = selector => document.querySelector(selector);
  const authScreen = $("#auth-screen");
  const appScreen = $("#app-screen");
  const chatForm = $("#chat-form");
  const messages = $("#messages");
  const chatInput = $("#chat-input");
  const voiceButton = $("#voice-button");
  const voiceStatus = $("#voice-status");
  let recognition = null;
  let voiceActive = false;
  let voiceBase = "";
  let voiceHadError = false;
  const map = new window.CanteenMap($("#floor-map"), selectStall);
  const state = {
    user: null, catalog: null, canteen: null, floor: null, ratings: {}, selectedStall: null,
    conversations: [], conversationId: null, loadVersion: 0,
    emotion: "neutral", talkUntil: 0, sending: false
  };

  function element(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text != null) node.textContent = text;
    return node;
  }

  // 挂进校园地图时网页地址是 /cmr/，所有接口都要补上这个前缀；独立运行时为空串。
  const PREFIX = window.AUNT_PREFIX || "";

  /* 服务端 JSON 把图片与原件链接写成根绝对路径（形如 /static/plan-sources/xxx.png）——
     `plans[].illustration` 与 `sources[].url` 都是。挂在地图 /cmr 下时，不带前缀的
     /static/... 会落到地图根上（既不过代理也找不到文件）而 404，所以在**唯一出口**这里
     集中补一次，六个消费点（楼层图 + 五处链接）一起修好，以后服务端再加同类字段也自动覆盖。
     独立运行时 PREFIX 是空串，原样返回。⚠️ 只动以 /static/ 开头的字符串，其余数据一个字不碰。 */
  function prefixStatic(value) {
    if (!PREFIX) return value;
    if (typeof value === "string") return value.indexOf("/static/") === 0 ? PREFIX + value : value;
    if (Array.isArray(value)) return value.map(prefixStatic);
    if (value && typeof value === "object") {
      for (const key of Object.keys(value)) value[key] = prefixStatic(value[key]);
      return value;
    }
    return value;
  }

  async function api(path, options = {}) {
    const response = await fetch(PREFIX + path, {
      credentials: "same-origin",
      cache: "no-store",
      headers: { "Content-Type": "application/json", ...(options.headers || {}) },
      ...options
    });
    let data;
    try { data = await response.json(); } catch (_) { data = {}; }
    if (!response.ok) {
      const error = new Error(typeof data.detail === "string" ? data.detail : "请求失败，请稍后再试");
      error.status = response.status;
      throw error;
    }
    return prefixStatic(data);
  }

  function setError(node, message) {
    node.textContent = message || "";
    node.hidden = !message;
  }

  /* ⭐ 第四十五轮：撤掉"被地图嵌着时的开机纱幕"（见 index.html 的 <head> 与 styles.css 末尾）。
     ⚠️ `showAuth` **也**必须撤：中途 401 时得把"回主站登录"那块提示露出来，
     不能把人冻在纱幕上。二期 §3.1.2 后这里**没有表单可填** —— 认不出票只报给宿主。 */
  function unembed() {
    try { document.documentElement.classList.remove("aunt-embed"); } catch (_) {}
  }

  /* ⭐⭐ 二期 §3.1.3：被地图嵌在抽屉里时，「认不出票」和「用户退出」两件事都**交回宿主**，
     而不是把「这里不登录」那张告示杵在人脸上 —— 宿主收到 `need-ticket` 会静默补一张票
     再把本页重载一次，收到 `exit` 会直接收起抽屉回大厅。独立开 :8020 没有宿主，返回 false，
     调用方各自落回原来的 `showAuth()`。
     ⚠️ `targetOrigin` 写死 `location.origin`（抽屉与本同源），别家的页面嵌不走这条消息。
     ⚠️ 与「← 返回校园」那颗按钮的 `aunt-exit` 是两回事：那条只是收起抽屉（会话还在），
        这条 `exit` 是**阿姨这边的会话已经作废**。 */
  function toHost(kind, reason) {
    try {
      if (window.self === window.top) return false;
      window.parent.postMessage({ type: "pixelcampus:" + kind, from: "cmr", reason: reason || "" }, location.origin);
      return true;
    } catch (_) { return false; }
  }

  function showAuth() {
    if (recognition && voiceActive) recognition.abort();
    map.clearControls();
    state.user = null;
    state.conversationId = null;
    state.conversations = [];
    unembed();
    authScreen.hidden = false;
    appScreen.hidden = true;
    setError($("#auth-error"), "");
  }

  function showAuntEmotion(value) {
    const emotion = ["neutral", "happy", "thinking", "concerned"].includes(value) ? value : "neutral";
    const labels = {
      neutral: ["正听你说", "食堂阿姨，平静倾听"],
      happy: ["有好消息", "食堂阿姨，开心微笑"],
      thinking: ["让我想想", "食堂阿姨，认真思考"],
      concerned: ["这条还需核对", "食堂阿姨，关切地看着你"]
    };
    const portrait = $("#aunt-portrait");
    portrait.dataset.emotion = emotion;
    portrait.setAttribute("aria-label", labels[emotion][1]);
    $("#aunt-mood").textContent = labels[emotion][0];
  }

  async function showApp(user) {
    const [catalog, ratings, conversations] = await Promise.all([
      api("/api/canteens"), api("/api/ratings"), api("/api/conversations")
    ]);
    state.user = user;
    $("#current-user").textContent = user.username;
    unembed();                       // ⭐ 会话到手 ⇒ 撤掉开机的纱幕（正常路径）
    authScreen.hidden = true;
    appScreen.hidden = false;
    state.catalog = catalog;
    state.ratings = ratings;
    state.conversations = conversations;
    $("#catalog-notice").textContent = catalog.notice;
    map.setRatings(ratings);
    const select = $("#canteen-select");
    select.replaceChildren();
    for (const canteen of catalog.canteens) {
      const option = element("option", "", canteen.name);
      option.value = canteen.id;
      select.append(option);
    }
    state.canteen = catalog.canteens[0];
    select.value = state.canteen.id;
    renderFloors();
    renderConversations();
    if (conversations.length) await openConversation(conversations[0].id);
    else await newConversation();
  }

  function renderConversations() {
    const list = $("#conversation-list");
    list.replaceChildren();
    for (const item of state.conversations) {
      const button = element("button", item.id === state.conversationId ? "active" : "");
      button.type = "button";
      button.append(element("span", "conversation-name", item.title));
      button.append(element("small", "", item.messageCount ? item.messageCount + " 条消息" : "空对话"));
      button.addEventListener("click", () => openConversation(item.id));
      list.append(button);
    }
  }

  async function refreshConversations() {
    state.conversations = await api("/api/conversations");
    renderConversations();
  }

  async function openConversation(id) {
    const version = ++state.loadVersion;
    state.conversationId = id;
    state.emotion = "neutral";
    showAuntEmotion("neutral");
    map.setEmotion("neutral");
    renderConversations();
    messages.replaceChildren();
    const history = await api("/api/conversations/" + id + "/messages");
    if (version !== state.loadVersion) return;
    if (history.length) history.forEach(item => appendMessage(item.role, item.content, item.evidence, item.ranking, item.recommendations));
    else appendMessage("assistant", "孩子，想吃什么？问我菜品、窗口或哪层有啥就行。");
    scrollMessages();
  }

  async function newConversation() {
    const conversation = await api("/api/conversations", { method: "POST" });
    await refreshConversations();
    await openConversation(conversation.id);
  }

  $("#new-conversation").addEventListener("click", async () => {
    try { await newConversation(); } catch (error) { setError($("#chat-error"), error.message); }
  });

  /* ⭐⭐ 二期 §3.1.2：这里的 setAuthMode / 表单提交 / 登录注册切换三块**整段删除**。
     阿姨不再自己收账号密码 —— 会话只认宿主（8081）签发的同源 HttpOnly cookie，
     开局 `start()` 里那一次 `/api/me` 认得出人就进值班室，认不出就露出
     index.html 那张「这边没有登录入口」的说明卡。 */

  $("#logout-button").addEventListener("click", async () => {
    try { await api("/api/logout", { method: "POST" }); }
    catch (_) { /* session may already have expired */ }
    /* 退出即回大厅：交回宿主收抽屉 + 摘 iframe，下次按 C 重新过闸门补票。 */
    if (!toHost("exit", "logout")) showAuth();
  });

  // 「← 返回校园」：只在被地图抽屉挂载时出现（那时 PREFIX 非空），独立运行时按钮一直藏着。
  // 收件人是地图父页 —— 它收到 `aunt-exit` 就把抽屉收起来（Esc 那条路也仍然有效）。
  if (PREFIX) {
    const backButton = $("#back-campus");
    if (backButton) {
      backButton.hidden = false;
      backButton.addEventListener("click", () => {
        if (window.parent && window.parent !== window) {
          window.parent.postMessage({ type: "aunt-exit" }, location.origin);
        }
      });
    }
  }

  function appendMessage(role, content, evidence = [], ranking = [], recommendations = [], emotion = "neutral") {
    const row = element("div", "message " + role);
    const avatar = element("div", "message-avatar", role === "assistant" ? "姨" : (state.user ? state.user.username.charAt(0) : "我"));
    avatar.setAttribute("aria-hidden", "true");
    if (role === "assistant") {
      avatar.textContent = "";
      avatar.classList.add("aunt-face");
      avatar.dataset.emotion = emotion;
    }
    const body = element("div", "message-body");
    body.append(element("p", "message-name", role === "assistant" ? "阿姨 · 丙" : "你"));
    body.append(element("p", "message-bubble", content));
    if (ranking && ranking.length) {
      const card = element("ol", "ranking-card");
      ranking.forEach(item => {
        const line = element("li", "");
        line.append(element("span", "", item.name));
        line.append(element("strong", "", item.score.toFixed(1) + " 分 · " + item.count + " 条"));
        card.append(line);
      });
      body.append(card);
    }
    if (recommendations && recommendations.length) {
      const shelf = element("div", "food-recommendations");
      shelf.append(element("p", "food-recommendations-title", "菜品线索 · 历史菜单，现售待核"));
      recommendations.forEach(item => {
        const card = element("article", "food-card");
        const canteen = state.catalog?.canteens.find(entry => entry.id === item.canteenId);
        card.append(element("strong", "food-card-dish", item.dish));
        card.append(element("span", "food-card-place",
          (canteen?.name || item.canteenId) + " " + item.floorLabel +
          (item.windowName ? " · " + item.windowName : " · 档口未核")));
        let price = "价格待核";
        if (item.priceValue != null) {
          const kind = item.priceType === "historical_promotion" ? "活动价" :
            item.priceType === "historical_student_report" ? "学生当次消费" : "历史标价";
          price = item.priceDate + " " + kind + " ¥" + item.priceValue + " · 现价待核";
        }
        card.append(element("span", "food-card-price", price));
        card.append(element("p", "food-card-summary", item.summary));
        shelf.append(card);
      });
      body.append(shelf);
    }
    // Evidence remains in the response data and the map's source disclosure.
    row.append(avatar, body);
    messages.append(row);
    return row;
  }

  function scrollMessages() { messages.scrollTop = messages.scrollHeight; }

  async function sendMessage(value, contextStallId = null) {
    const text = value.trim();
    if (voiceActive) {
      setVoiceStatus("先结束语音输入，再确认文字并发送。");
      return;
    }
    if (!text || state.sending) return;
    state.sending = true;
    $("#send-button").disabled = true;
    setError($("#chat-error"), "");
    const pending = appendMessage("user", text);
    chatInput.value = "";
    scrollMessages();
    try {
      const conversationId = state.conversationId;
      const result = await api("/api/chat", { method: "POST", body: JSON.stringify({
        message: text, conversation_id: conversationId, context_stall_id: contextStallId
      }) });
      state.emotion = result.emotion || "neutral";
      if (state.emotion === "thinking" && /没有可靠资料|无法确认|还需核对/.test(result.reply)) state.emotion = "concerned";
      if (state.conversationId === conversationId) appendMessage("assistant", result.reply, result.evidence, result.ranking, result.recommendations, state.emotion);
      showAuntEmotion(state.emotion);
      map.setEmotion(state.emotion);
      state.talkUntil = performance.now() + 2200;
      scrollMessages();
      await refreshConversations();
      if (result.ratingsChanged) {
        state.ratings = await api("/api/ratings");
        map.setRatings(state.ratings);
        renderStallList();
        if (state.selectedStall) selectStall(state.selectedStall);
      }
      return result;
    } catch (error) {
      pending.remove();
      chatInput.value = text;
      setError($("#chat-error"), error.message);
      /* 中途掉票：先让宿主补一张（它会重载本页），补不上宿主自己收抽屉。
         独立跑才落到 `showAuth()` 那张告示。 */
      if (error.status === 401 && !toHost("need-ticket", "401")) showAuth();
      return null;
    } finally {
      state.sending = false;
      $("#send-button").disabled = voiceActive;
      if (authScreen.hidden) (contextStallId ? $("#detail-question") : chatInput).focus();
    }
  }

  chatForm.addEventListener("submit", event => {
    event.preventDefault();
    sendMessage(chatInput.value);
  });
  chatInput.addEventListener("keydown", event => {
    if (event.key === "Enter" && !event.shiftKey && !event.isComposing) {
      event.preventDefault();
      sendMessage(chatInput.value);
    }
  });
  $("#suggestions").addEventListener("click", event => {
    const button = event.target.closest("button[data-prompt]");
    if (button) sendMessage(button.dataset.prompt);
  });

  function setVoiceStatus(message) {
    voiceStatus.textContent = message || "";
    voiceStatus.hidden = !message;
  }

  function setListening(active) {
    voiceActive = active;
    voiceButton.setAttribute("aria-pressed", String(active));
    voiceButton.setAttribute("aria-label", active ? "结束语音输入" : "开始语音输入");
    voiceButton.title = active ? "结束语音输入" : "语音输入";
    voiceButton.classList.toggle("listening", active);
    chatInput.readOnly = active;
    $("#send-button").disabled = active || state.sending;
  }

  function setupVoiceInput() {
    const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!Recognition || !window.isSecureContext) {
      setVoiceStatus("当前浏览器或访问方式不支持语音输入，请用键盘输入；本机访问可用 127.0.0.1。");
      return;
    }
    voiceButton.hidden = false;
    recognition = new Recognition();
    recognition.lang = "zh-CN";
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.onstart = () => setVoiceStatus("正在听… 说完后点击麦克风结束，识别文字会留在输入框。");
    recognition.onresult = event => {
      const finalParts = [], interimParts = [];
      for (let i = 0; i < event.results.length; i++) {
        const result = event.results[i];
        const transcript = result[0] && result[0].transcript ? result[0].transcript.trim() : "";
        if (!transcript) continue;
        (result.isFinal ? finalParts : interimParts).push(transcript);
      }
      const recognized = [...finalParts, ...interimParts].join("");
      chatInput.value = [voiceBase, recognized].filter(Boolean).join(voiceBase && recognized ? " " : "").slice(0, 1000);
      setVoiceStatus(interimParts.length ? "正在识别… 文字会继续更新。" : "已识别，请核对后发送。");
    };
    recognition.onerror = event => {
      voiceHadError = true;
      const messages = {
        "not-allowed": "麦克风权限未开启。允许当前页面使用麦克风后重试。",
        "service-not-allowed": "浏览器未允许语音识别服务，请检查设置或改用键盘。",
        "audio-capture": "没有找到可用麦克风，请检查设备连接。",
        "no-speech": "没有听到语音，请再试一次。",
        "network": "语音识别服务暂时无法连接，请稍后重试或使用键盘。"
      };
      setVoiceStatus(messages[event.error] || "语音识别未完成，请再试一次。");
    };
    recognition.onend = () => {
      setListening(false);
      if (authScreen.hidden) {
        if (!voiceHadError) setVoiceStatus(chatInput.value.trim() ? "已转成文字，请核对后发送。" : "没有识别到文字，请再试一次。");
        chatInput.focus();
      }
    };
    voiceButton.addEventListener("click", () => {
      if (voiceActive) {
        recognition.stop();
        setVoiceStatus("正在结束识别…");
        return;
      }
      voiceBase = chatInput.value.trim();
      voiceHadError = false;
      try {
        setListening(true);
        setVoiceStatus("正在启动麦克风…");
        recognition.start();
      } catch (_) {
        setListening(false);
        setVoiceStatus("麦克风暂时无法启动，请稍后重试。");
      }
    });
  }

  function renderFloors() {
    const buttons = $("#floor-buttons");
    buttons.replaceChildren();
    state.canteen.floors.forEach(floor => {
      const button = element("button", "", floor.label);
      button.type = "button";
      button.addEventListener("click", () => selectFloor(floor.level));
      buttons.append(button);
    });
    const preferred = state.canteen.id === "xuehuo"
      ? state.canteen.floors.find(floor => floor.level === 1) : null;
    selectFloor((preferred || state.canteen.floors[0]).level);
  }

  function resetDetailPanel() {
    state.selectedStall = null;
    map.setSelected(null);
    $("#detail-panel").classList.remove("open");
    $("#detail-close").hidden = true;
    $("#detail-tabs").querySelectorAll("button").forEach(button => { button.disabled = true; });
    $("#detail-question").disabled = true;
    $("#detail-ask-form button").disabled = true;
    $("#detail-question").value = "";
    $("#detail-chat-answer").textContent = "选中档口后，可以继续问阿姨。";
    const welcome = element("div", "detail-welcome");
    welcome.append(element("div", "welcome-pixel", "食"));
    welcome.append(element("strong", "", "点一个窗口看看"));
    welcome.append(element("p", "", "菜品、评价和近期排队反馈都会出现在这里。灰色窗口表示还没有可计算的评分。"));
    $("#stall-detail-content").replaceChildren(welcome);
    renderStallList();
  }

  function selectFloor(level) {
    state.floor = state.canteen.floors.find(item => item.level === level);
    Array.from($("#floor-buttons").children).forEach((button, index) => {
      button.classList.toggle("active", state.canteen.floors[index].level === level);
      button.setAttribute("aria-pressed", String(state.canteen.floors[index].level === level));
    });
    map.setFloor(state.floor);
    map.setRatings(state.ratings);
    const plan = state.floor.plan;
    const source = plan && state.catalog.sources[plan.sourceId];
    $("#plan-notice").textContent = plan && plan.status === "approximate"
      ? "依据「" + (source ? source.title : "用户提供的大概平面图") + "」描绘相对方位；格坐标和尺寸是交互示意，档口现状待现场确认。"
      : "这一层没有可定位的室内平面图。暂不绘制窗口和桌椅；下方保留有来源的窗口与菜品线索。";
    const sourceLink = $("#plan-source-link");
    sourceLink.hidden = !(source && source.url);
    if (source && source.url) sourceLink.href = source.url;
    $("#map-walk-status").textContent = map.statusText();
    renderFloorLeads();
    renderFloorReviewSummary();
    resetDetailPanel();
  }

  $("#canteen-select").addEventListener("change", event => {
    state.canteen = state.catalog.canteens.find(item => item.id === event.target.value);
    renderFloors();
  });

  function renderStallList() {
    if (!state.floor) return;
    const list = $("#stall-list");
    list.replaceChildren();
    for (const stall of state.floor.stalls) {
      const button = element("button", state.selectedStall === stall.id ? "selected" : "");
      button.type = "button";
      button.append(element("span", "", stall.name + (stall.kind === "window" && !stall.rect ? " · 待定位线索" :
        stall.kind === "window" ? " · 已见档口" :
        stall.kind === "placeholder" ? " · 位置示意" : " · 分区")));
      const score = state.ratings[stall.id] && state.ratings[stall.id].score;
      button.append(element("small", "", score == null ? "暂无评价" : score.toFixed(1) + " 分"));
      button.addEventListener("click", () => selectStall(stall.id));
      list.append(button);
    }
  }

  function renderFloorLeads() {
    const list = $("#floor-lead-list");
    list.replaceChildren();
    const leads = (state.catalog.foodLeads || []).filter(lead =>
      lead.canteenId === state.canteen.id && lead.floorLabel === state.floor.label);
    if (!leads.length) {
      list.append(element("p", "detail-empty", "这一层还没有可追溯的具体菜品资料。"));
      return;
    }
    for (const lead of leads) {
      const row = element("div", "floor-lead-row");
      row.append(element("strong", "", lead.dish));
      row.append(element("span", "", lead.windowName || "窗口归属待核"));
      row.append(element("small", "", lead.priceValue == null ? "现价待核" :
        lead.priceDate + (lead.priceType === "historical_promotion" ? " 活动价 ¥" : " 当次消费 ¥") + lead.priceValue + " · 现价待核"));
      if (lead.sourceUrl) {
        const link = element("a", "source-pill", lead.sourceTitle + " · " + lead.sourceDate);
        link.href = lead.sourceUrl; link.target = "_blank"; link.rel = "noopener noreferrer";
        row.append(link);
      }
      list.append(row);
    }
  }

  function appendReviewSummary(container, summary, heading) {
    const content = typeof summary === "string" ? summary : summary && (summary.summary || summary.text);
    if (!content) return false;
    container.append(element("strong", "", heading));
    container.append(element("p", "", content));
    const count = typeof summary === "object" && summary.count;
    if (Number.isFinite(count)) container.append(element("small", "", "基于 " + count + " 条可归属的个人评价摘录；不计入窗口评分。"));
    const refs = typeof summary === "object" && (summary.sources || summary.evidence) || [];
    if (Array.isArray(refs) && refs.length) {
      const links = element("div", "detail-sources");
      refs.slice(0, 3).forEach(ref => {
        const source = typeof ref === "string" ? state.catalog.sources[ref] : ref;
        if (!source || !source.url) return;
        const link = element("a", "source-pill", source.title || "查看原文");
        link.href = source.url; link.target = "_blank"; link.rel = "noopener noreferrer";
        links.append(link);
      });
      if (links.childElementCount) container.append(links);
    }
    return true;
  }

  function renderFloorReviewSummary() {
    const target = $("#floor-review-summary");
    target.replaceChildren();
    target.hidden = !appendReviewSummary(target, state.floor && state.floor.reviewSummary,
      "本层个人评价摘要 · 非评分");
  }

  let currentDetailTab = "menu";
  function showDetailTab(tab) {
    currentDetailTab = tab;
    $("#detail-tabs").querySelectorAll("button").forEach(button => {
      button.classList.toggle("active", button.dataset.detailTab === tab);
      button.setAttribute("aria-selected", String(button.dataset.detailTab === tab));
    });
    $("#stall-detail-content").querySelectorAll(".detail-section").forEach(section => {
      section.hidden = section.dataset.panel !== tab;
    });
  }
  $("#detail-tabs").addEventListener("click", event => {
    const button = event.target.closest("button[data-detail-tab]");
    if (button) showDetailTab(button.dataset.detailTab);
  });
  $("#detail-close").addEventListener("click", () => {
    resetDetailPanel();
    if (matchMedia("(max-width: 970px)").matches) $("#map-view").scrollIntoView({
      behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start"
    });
  });
  function dishPrice(dish) {
    if (dish.offer) return dish.offer.date + " 活动价 ¥" + dish.offer.promotionalPrice +
      (dish.offer.originalPrice != null ? " · 当期原价 ¥" + dish.offer.originalPrice : "");
    if (dish.historical && dish.historical.value != null) {
      const labels = { historical_promotion: "活动价", personal_promotion: "个人优惠价",
        personal_purchase: "学生当次消费", historical_reported_price: "历史资料价",
        menu_screenshot: "截图标价", illustrated_plan: "图示标价" };
      return dish.historical.date + " · " + (labels[dish.historical.type] || "历史记录价") + " ¥" + dish.historical.value + " · 现价待核";
    }
    return dish.price == null ? "现价待核" : "资料价 ¥" + dish.price + " · 现价待核";
  }

  async function selectStall(id) {
    state.selectedStall = id;
    map.setSelected(id);
    $("#map-walk-status").textContent = map.statusText();
    renderStallList();
    $("#detail-panel").classList.add("open");
    if (matchMedia("(max-width: 970px)").matches) $("#detail-panel").scrollIntoView({
      behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start"
    });
    $("#detail-panel").scrollTop = 0;
    $("#stall-detail-content").scrollTop = 0;
    $("#detail-close").hidden = false;
    $("#detail-tabs").querySelectorAll("button").forEach(button => { button.disabled = false; });
    $("#detail-question").disabled = false;
    $("#detail-ask-form button").disabled = false;
    showDetailTab("menu");
    map.sayAtStall(id, "孩子，想问什么？");
    $("#detail-question").value = "";
    $("#detail-chat-answer").textContent = "问这位阿姨菜单、营业时间或口碑；回答会存进你的对话历史。";
    const container = $("#stall-detail-content");
    container.replaceChildren(element("p", "detail-empty", "正在读取档口资料…"));
    try {
      const data = await api("/api/stalls/" + encodeURIComponent(id));
      if (state.selectedStall !== id) return;
      container.replaceChildren();
      const heading = element("div", "detail-name");
      heading.append(element("span", "", data.stall.name));
      heading.append(element("span", "detail-score", data.rating.score == null ? "暂无逐条评分" :
        data.rating.score.toFixed(1) + " 分 · " + data.rating.count + " 条"));
      container.append(heading);
      $("#detail-ask-form label").textContent = "问「" + data.stall.name + "」阿姨";
      container.append(element("p", "detail-meta", data.location.canteen + " · " + data.location.floorLabel + " · " + data.stall.summary));
      const scoreProof = element("details", "detail-proof");
      scoreProof.append(element("summary", "", "评分依据"));
      scoreProof.append(element("p", "score-method", data.rating.score == null
        ? "灰色表示暂无可计算的逐条评价，不代表差评。"
        : "评分来源：用户评价 " + data.rating.userCount + " 条、人工核对后导入 " + data.rating.importedCount +
          " 条；按时间衰减加权。最近更新 " + new Date(data.rating.updatedAt).toLocaleString("zh-CN") + "。"));
      container.append(scoreProof);

      const menuSection = element("section", "detail-section"); menuSection.dataset.panel = "menu";
      const menuRefs = new Set();
      if (data.stall.hours.length) {
        menuSection.append(element("p", "detail-label", "资料时段 · 当天以现场为准"));
        data.stall.hours.forEach(row => {
          menuSection.append(element("p", "detail-line", row.text));
          (row.evidence || []).forEach(id => menuRefs.add(id));
        });
      }
      const dishes = data.stall.dishes;
      menuSection.append(element("p", "detail-label", "点开查看的菜品价格 · 图示与截图标价并非实时售价"));
      for (const dish of dishes) {
        const row = element("div", "dish-row");
        const name = element("span", "", dish.name + (dish.priceNote ? " · " + dish.priceNote : ""));
        row.append(name);
        row.append(element("strong", "", dishPrice(dish)));
        menuSection.append(row);
        (dish.evidence || []).forEach(id => menuRefs.add(id));
      }
      if (!dishes.length) {
        menuSection.append(element("p", "detail-empty", data.stall.kind === "placeholder"
          ? "这是位置示意位，尚不知真实窗口名和菜单。"
          : "还没有可归属到这个窗口的可靠菜单。"));
        menuSection.append(element("p", "detail-demo", "其他菜品资料请展开地图下方的「本层有来源的菜品线索」查看；它们尚未归属到此窗口。"));
      }
      if (data.stall.locationEvidence && data.stall.locationEvidence.length) {
        data.stall.locationEvidence.forEach(id => menuRefs.add(id));
      } else if (data.stall.evidence && data.stall.evidence.length) {
        data.stall.evidence.forEach(id => menuRefs.add(id));
      }
      if (menuRefs.size) {
        const proof = element("details", "detail-proof");
        proof.append(element("summary", "", "菜单与位置依据"));
        appendSourcePills(proof, Array.from(menuRefs));
        menuSection.append(proof);
      }
      container.append(menuSection);

      const reviewSection = element("section", "detail-section"); reviewSection.dataset.panel = "reviews";
      reviewSection.append(element("p", "detail-label", "逐条评价 · 评分只从这里计算"));
      if (data.reviewSummary && data.reviewSummary.summary !== state.floor.reviewSummary?.summary) {
        const summary = element("div", "window-review-summary");
        if (appendReviewSummary(summary, data.reviewSummary, "个人评价摘要 · 非评分")) reviewSection.append(summary);
      }
      if (!data.reviews.length) reviewSection.append(element("p", "detail-empty", "还没有可归到此窗口的逐条评价。聊天里说出真实体验后才会更新分数。"));
      for (const review of data.reviews) {
        const item = element("div", "review-item");
        item.append(element("div", "", review.content));
        const date = new Date(review.createdAt).toLocaleString("zh-CN", { dateStyle: "short", timeStyle: "short" });
        item.append(element("small", "", date + (review.rating ? " · 口味 " + review.rating + " 分" : "") +
          (review.queueMinutes != null ? " · 排队 " + review.queueMinutes + " 分钟" : "") +
          (review.source === "imported" ? " · 核对后导入" : " · 用户反馈")));
        if (review.sourceRef) {
          const link = element("a", "source-pill", "查看原文");
          link.href = review.sourceRef; link.target = "_blank"; link.rel = "noopener noreferrer";
          item.append(link);
        }
        reviewSection.append(item);
      }
      if (data.sourceReviews && data.sourceReviews.length) {
        reviewSection.append(element("p", "detail-label", "公开个人评价摘录 · 不计入评分"));
        data.sourceReviews.slice(0, 8).forEach(review => {
          const item = element("div", "review-item public-review");
          item.append(element("div", "", review.excerpt));
          item.append(element("small", "", (review.date || "日期待核") + " · 公开资料摘录"));
          if (review.evidence && review.evidence.length) {
            const proof = element("details", "detail-proof");
            proof.append(element("summary", "", "查看原文"));
            appendSourcePills(proof, review.evidence);
            item.append(proof);
          }
          reviewSection.append(item);
        });
      }
      const canteen = state.catalog.canteens.find(item => item.id === data.location.canteenId);
      if (canteen.reviewSummary.length) {
        const more = element("details", "detail-proof");
        more.append(element("summary", "", "更多公开资料摘要 · 非评分"));
        canteen.reviewSummary.forEach(item => {
          more.append(element("p", "detail-line", item.text));
          appendSourcePills(more, item.evidence);
        });
        reviewSection.append(more);
      }
      container.append(reviewSection);
      const queueSection = element("section", "detail-section"); queueSection.dataset.panel = "queue";
      queueSection.append(element("p", "detail-label", "最近三小时的排队反馈"));
      queueSection.append(element("p", "detail-line", data.queue
        ? "最近一条用户报告：排队约 " + data.queue.minutes + " 分钟，报告于 " +
          new Date(data.queue.reportedAt).toLocaleString("zh-CN") + "。队伍随时会变。"
        : "暂无最近三小时的排队反馈，无法判断此刻人数或等待时间。"));
      queueSection.append(element("p", "detail-demo", "这里显示同学主动提交的时间记录，不是摄像头或实时人数统计。"));
      container.append(queueSection);
      showDetailTab(currentDetailTab);
    } catch (error) {
      container.replaceChildren(element("p", "detail-empty", error.message));
    }
  }

  $("#detail-ask-form").addEventListener("submit", async event => {
    event.preventDefault();
    const id = state.selectedStall;
    const input = $("#detail-question");
    const question = input.value.trim();
    if (!id || !question) return;
    const answerNode = $("#detail-chat-answer");
    answerNode.textContent = "阿姨正在查资料…";
    const result = await sendMessage(question, id);
    if (state.selectedStall !== id) return;
    if (!result) { answerNode.textContent = $("#chat-error").textContent || "提问没有发出，请再试一次。"; return; }
    input.value = "";
    const dishes = (result.recommendations || []).map(item => "• " + item.dish + "（" + item.floorLabel + "）");
    answerNode.textContent = result.reply + (dishes.length ? "\n" + dishes.join("\n") : "");
    map.sayAtStall(id, result.reply);
  });

  const movementKeys = {
    arrowleft: "left", a: "left", arrowright: "right", d: "right",
    arrowup: "up", w: "up", arrowdown: "down", s: "down"
  };
  const editing = target => target instanceof Element &&
    !!target.closest("input,textarea,select,button,a,summary,[contenteditable='true']");
  document.addEventListener("keydown", event => {
    if (appScreen.hidden || editing(event.target)) return;
    const direction = movementKeys[event.key.toLowerCase()];
    if (direction) {
      event.preventDefault();
      if (!event.repeat) map.nudge(direction);
      map.setControl(direction, true);
      return;
    }
    if (event.key.toLowerCase() === "e" || event.key === " ") {
      event.preventDefault();
      map.interact();
    }
    if (event.key === "+" || event.key === "=") { event.preventDefault(); changeZoom(.25); }
    if (event.key === "-" || event.key === "_") { event.preventDefault(); changeZoom(-.25); }
    if (event.key === "0" || event.key === "1") { event.preventDefault(); setZoom(1); }
  });
  document.addEventListener("keyup", event => {
    const direction = movementKeys[event.key.toLowerCase()];
    if (direction) map.setControl(direction, false);
  });
  window.addEventListener("blur", () => map.clearControls());
  document.addEventListener("visibilitychange", () => { if (document.hidden) map.clearControls(); });
  $("#control-pad").querySelectorAll("button[data-move]").forEach(button => {
    const direction = button.dataset.move;
    button.addEventListener("pointerdown", event => {
      event.preventDefault();
      button.setPointerCapture(event.pointerId);
      map.nudge(direction);
      map.setControl(direction, true);
    });
    const release = () => map.setControl(direction, false);
    button.addEventListener("pointerup", release);
    button.addEventListener("pointercancel", release);
    button.addEventListener("lostpointercapture", release);
    button.addEventListener("click", event => { if (event.detail === 0) map.nudge(direction); });
  });
  $("#interact-window").addEventListener("click", () => {
    if (!map.interact()) $("#map-walk-status").textContent = "再靠近一点窗口，或直接点击窗口查看。";
  });
  function setZoom(value) {
    $("#map-zoom-label").textContent = Math.round(map.setZoom(value) * 100) + "%";
  }
  function changeZoom(delta) { setZoom(map.zoom + delta); }
  $("#map-zoom-in").addEventListener("click", () => changeZoom(.25));
  $("#map-zoom-out").addEventListener("click", () => changeZoom(-.25));
  $("#map-zoom-fit").addEventListener("click", () => setZoom(1));
  $("#floor-map").addEventListener("wheel", event => {
    event.preventDefault();
    changeZoom(event.deltaY < 0 ? .25 : -.25);
  }, { passive: false });

  function appendSourcePills(container, ids) {
    const wrapper = element("div", "detail-sources");
    ids.forEach(id => {
      const source = state.catalog.sources[id];
      if (!source) return;
      const node = element(source.url ? "a" : "span", "source-pill", source.title);
      if (source.url) { node.href = source.url; node.target = "_blank"; node.rel = "noopener noreferrer"; }
      wrapper.append(node);
    });
    if (wrapper.children.length) container.append(wrapper);
  }

  let lastAnimation = "";
  function animate(now) {
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mode = reduced ? "idle" : now < state.talkUntil ? "talk" : "idle";
    const mapVisible = !appScreen.hidden;
    const mapMoved = mapVisible && map.tick(now, reduced);
    const phase = reduced ? 0 : Math.floor(now / (map.player.moving ? 140 : mode === "talk" ? 220 : 700));
    const key = [mode, phase, state.emotion, authScreen.hidden, mapVisible].join("|");
    if (key !== lastAnimation || mapMoved) {
      lastAnimation = key;
      if (mapVisible) {
        map.draw(phase, mode);
        const status = map.statusText();
        if ($("#map-walk-status").textContent !== status) $("#map-walk-status").textContent = status;
      }
    }
    requestAnimationFrame(animate);
  }

  async function start() {
    setupVoiceInput();
    // 只有真被嵌在地图抽屉里才提"按 Esc 退出"—— 独立开这一页的人眼前没有抽屉。
    try { if (window.self !== window.top) $("#auth-embed-tip").hidden = false; } catch (_) { /* private mode */ }
    requestAnimationFrame(animate);
    try { await showApp(await api("/api/me")); }
    /* ⭐ 开局就没票：被嵌着时**纱幕继续挂着**（那是「正在进入…」），先请宿主补票再重载；
       补不上宿主会收抽屉。独立开 :8020 才露「这里不登录」那张告示。 */
    catch (_) { if (!toHost("need-ticket", "no-ticket")) showAuth(); }
  }
  start();
})();
