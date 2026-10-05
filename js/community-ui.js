/* =====================================================================
 * AI 生图知识体系 · 社区共建 UI
 * 登录/注册（Supabase 邮箱验证）+ 我的投稿 + 投稿表单（四类内容）
 * 降级原则：Supabase 未配置/不可用时，所有功能静默关闭，站点其余部分零影响
 * 复用模式：右侧毛玻璃抽屉（同 mindmap-ui 的 .mm2-panel 模式）
 * ===================================================================== */
(function () {
  "use strict";

  /* ---------- 工具 ---------- */
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const okUrl = (u) => typeof u === "string" && /^https:\/\//i.test(u.trim());
  const lines = (v) => String(v || "").split("\n").map((x) => x.trim()).filter(Boolean);
  const cut = (v, n) => String(v || "").trim().slice(0, n);

  /* ---------- Supabase 客户端（懒初始化 + 降级） ---------- */
  let SB; // undefined=未初始化 / null=不可用 / object=客户端
  function getSB() {
    if (SB !== undefined) return SB;
    try {
      const cfg = window.KB_CONFIG || {};
      SB = (cfg.SUPABASE_URL && cfg.SUPABASE_ANON_KEY && window.supabase && window.supabase.createClient)
        ? window.supabase.createClient(cfg.SUPABASE_URL, cfg.SUPABASE_ANON_KEY)
        : null;
    } catch (e) {
      console.warn("[community] Supabase 初始化失败", e);
      SB = null;
    }
    return SB;
  }

  let USER = null;
  let PROFILE = null;

  async function refreshSession() {
    const sb = getSB();
    if (!sb) return;
    try {
      const { data } = await sb.auth.getSession();
      USER = data && data.session ? data.session.user : null;
      PROFILE = null;
      if (USER) {
        const { data: p, error } = await sb.from("profiles").select("display_name,is_admin").eq("id", USER.id).maybeSingle();
        if (!error && p) PROFILE = p;
      }
    } catch (e) {
      console.warn("[community] 会话获取失败", e);
      USER = null; PROFILE = null;
    }
  }

  function authErrMsg(e) {
    const m = String((e && e.message) || "").toLowerCase();
    if (m.includes("email not confirmed")) return "邮箱尚未验证：请先查收确认邮件并点击链接";
    if (m.includes("invalid login credentials")) return "邮箱或密码错误";
    if (m.includes("user already registered")) return "该邮箱已注册，请直接登录";
    if (m.includes("password")) return "密码至少 6 位";
    if (m.includes("rate limit")) return "操作过于频繁，请稍后再试";
    return (e && e.message) || "操作失败，请稍后再试";
  }

  /* 密码显示/隐藏切换（包裹 input，右侧眼睛按钮） */
  function addPwToggle(input) {
    if (!input || input.dataset.pwToggle) return;
    input.dataset.pwToggle = "1";
    const wrap = document.createElement("div");
    wrap.className = "kb-pw-wrap";
    input.parentNode.insertBefore(wrap, input);
    wrap.appendChild(input);
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "kb-pw-toggle";
    btn.setAttribute("aria-label", "显示/隐藏密码");
    btn.title = "显示/隐藏密码";
    btn.textContent = "👁";
    let shown = false;
    btn.addEventListener("click", () => {
      shown = !shown;
      input.type = shown ? "text" : "password";
      btn.classList.toggle("on", shown);
    });
    wrap.appendChild(btn);
  }

  /* ---------- 抽屉 DOM（单例） ---------- */
  const TYPE_LABELS = {
    section_block: "补充章节块",
    glossary: "新术语",
    resource: "新官方资源",
    tutorial: "新配置教程"
  };
  const STATUS_LABELS = {
    pending: "待审核", approved: "已批准", synced: "已发布",
    rejected: "已驳回", removed: "已下架"
  };
  let drawer = null, dBody = null, dTitle = null, overlay = null;
  let curView = "hub";
  let submitPreset = null; // { type, target }

  function buildDrawer() {
    overlay = document.createElement("div");
    overlay.className = "mm2-overlay kb-overlay";
    document.body.appendChild(overlay);
    overlay.addEventListener("click", closeDrawer);

    drawer = document.createElement("div");
    drawer.className = "mm2-panel kb-panel";
    drawer.innerHTML = `
      <div class="mm2-head">
        <span class="mm2-title">社区共建</span>
        <span class="mm2-sub" id="kbDrawerSub">登录后即可投稿扩充本站内容</span>
        <button class="mm2-close" id="kbDrawerClose" type="button" aria-label="关闭">✕</button>
      </div>
      <div class="kb-body" id="kbDrawerBody"></div>`;
    document.body.appendChild(drawer);
    dBody = drawer.querySelector("#kbDrawerBody");
    dTitle = drawer.querySelector("#kbDrawerSub");
    drawer.querySelector("#kbDrawerClose").addEventListener("click", closeDrawer);

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && drawer.classList.contains("show")) closeDrawer();
    });
    // 会话变化时刷新当前视图
    if (getSB()) {
      getSB().auth.onAuthStateChange(() => {
        refreshSession().then(() => {
          if (!drawer.classList.contains("show")) return;
          if (USER) { if (curView === "auth") showView("hub"); else showView(curView); }
          else showView("auth");
        });
      });
    }
  }

  function openDrawer() {
    if (!drawer) buildDrawer();
    drawer.classList.add("show");
    overlay.classList.add("show");
    if (!getSB()) { showView("disabled"); return; }
    showView(USER ? (curView === "submit" || curView === "mine" ? curView : "hub") : "auth");
  }
  function closeDrawer() {
    if (!drawer) return;
    drawer.classList.remove("show");
    overlay.classList.remove("show");
    curView = "hub";
    submitPreset = null;
  }

  /* ---------- 视图：未启用 ---------- */
  function viewDisabled() {
    dTitle.textContent = "社区功能未启用";
    dBody.innerHTML = `
      <div class="kb-tip">
        <p>社区共建功能尚未配置（缺少 Supabase 连接信息）。</p>
        <p class="kb-dim">站点内容浏览不受任何影响。</p>
      </div>`;
  }

  /* ---------- 视图：登录 / 注册 ---------- */
  let authTab = "login";
  function viewAuth() {
    dTitle.textContent = "登录 / 注册";
    dBody.innerHTML = `
      <div class="kb-tabs">
        <button type="button" class="kb-tab ${authTab === "login" ? "active" : ""}" data-t="login">登录</button>
        <button type="button" class="kb-tab ${authTab === "register" ? "active" : ""}" data-t="register">注册</button>
      </div>
      <form class="kb-form" id="kbAuthForm">
        <label>邮箱<input class="kb-input" name="email" type="email" required autocomplete="email" placeholder="you@example.com"></label>
        <label>密码<input class="kb-input" name="password" type="password" required minlength="6" autocomplete="${authTab === "login" ? "current-password" : "new-password"}" placeholder="至少 6 位"></label>
        ${authTab === "register" ? `<label>昵称（可选）<input class="kb-input" name="display_name" type="text" maxlength="20" placeholder="将显示在你的投稿旁"></label>` : ""}
        <div class="kb-msg" id="kbAuthMsg"></div>
        <button class="kb-btn primary" type="submit">${authTab === "login" ? "登录" : "注册（需邮箱验证）"}</button>
        ${authTab === "login" ? `<button class="kb-btn ghost" type="button" id="kbForgot">忘记密码？发送重置邮件</button>` : ""}
        <p class="kb-dim">${authTab === "register" ? "注册后 Supabase 会发送确认邮件，点击链接完成验证后即可登录投稿。" : ""}</p>
      </form>`;
    dBody.querySelectorAll(".kb-tab").forEach((t) => t.addEventListener("click", () => { authTab = t.dataset.t; viewAuth(); }));
    addPwToggle(dBody.querySelector('input[name="password"]'));
    const form = dBody.querySelector("#kbAuthForm");
    const msg = dBody.querySelector("#kbAuthMsg");
    form.addEventListener("submit", async (ev) => {
      ev.preventDefault();
      const sb = getSB(); if (!sb) return;
      const fd = new FormData(form);
      const email = String(fd.get("email") || "").trim();
      const password = String(fd.get("password") || "");
      msg.textContent = "处理中…"; msg.className = "kb-msg";
      try {
        if (authTab === "login") {
          const { error } = await sb.auth.signInWithPassword({ email, password });
          if (error) throw error;
        } else {
          const dn = String(fd.get("display_name") || "").trim();
          const { error } = await sb.auth.signUp({
            email, password,
            options: { data: dn ? { display_name: dn } : {} }
          });
          if (error) throw error;
          msg.textContent = "注册成功！确认邮件已发送，请查收并点击验证链接后再登录。";
          msg.className = "kb-msg ok";
          return;
        }
      } catch (e) {
        msg.textContent = authErrMsg(e);
        msg.className = "kb-msg err";
      }
    });
    const forgot = dBody.querySelector("#kbForgot");
    if (forgot) forgot.addEventListener("click", async () => {
      const sb = getSB(); if (!sb) return;
      const email = String(new FormData(form).get("email") || "").trim();
      if (!email) { msg.textContent = "请先填写邮箱"; msg.className = "kb-msg err"; return; }
      try {
        const { error } = await sb.auth.resetPasswordForEmail(email);
        if (error) throw error;
        msg.textContent = "重置邮件已发送，请查收。";
        msg.className = "kb-msg ok";
      } catch (e) {
        msg.textContent = authErrMsg(e); msg.className = "kb-msg err";
      }
    });
  }

  /* ---------- 视图：个人中心 ---------- */
  function viewHub() {
    const name = (PROFILE && PROFILE.display_name) || (USER && USER.email) || "用户";
    dTitle.textContent = "个人中心";
    dBody.innerHTML = `
      <div class="kb-hub">
        <div class="kb-hi">👋 ${esc(name)}</div>
        <button class="kb-btn primary" type="button" id="kbGoSubmit">✍️ 我要投稿</button>
        <button class="kb-btn" type="button" id="kbGoMine">📋 我的投稿</button>
        ${PROFILE && PROFILE.is_admin ? `<a class="kb-btn admin" href="admin.html">🛡 管理员审核后台 →</a>` : ""}
        <button class="kb-btn ghost" type="button" id="kbLogout">退出登录</button>
      </div>`;
    dBody.querySelector("#kbGoSubmit").addEventListener("click", () => showView("submit"));
    dBody.querySelector("#kbGoMine").addEventListener("click", () => showView("mine"));
    dBody.querySelector("#kbLogout").addEventListener("click", async () => {
      const sb = getSB(); if (!sb) return;
      try { await sb.auth.signOut(); } catch (e) { /* 忽略 */ }
      USER = null; PROFILE = null;
      showView("auth");
    });
  }

  /* ---------- 视图：我的投稿 ---------- */
  async function viewMine() {
    dTitle.textContent = "我的投稿";
    dBody.innerHTML = `<div class="kb-loading">加载中…</div>`;
    const sb = getSB();
    if (!sb) { viewDisabled(); return; }
    let rows = [];
    try {
      const { data, error } = await sb.from("submissions")
        .select("id,type,status,admin_note,target_sec_id,created_at")
        .order("created_at", { ascending: false }).limit(50);
      if (error) throw error;
      rows = data || [];
    } catch (e) {
      dBody.innerHTML = `<div class="kb-tip err">加载失败：${esc(authErrMsg(e))}</div>`;
      return;
    }
    if (!rows.length) {
      dBody.innerHTML = `
        <div class="kb-tip">
          <p>还没有投稿记录。</p>
          <button class="kb-btn primary" type="button" id="kbGoSubmit2">✍️ 发起第一次投稿</button>
        </div>`;
      dBody.querySelector("#kbGoSubmit2").addEventListener("click", () => showView("submit"));
      return;
    }
    dBody.innerHTML = `<div class="kb-list">` + rows.map((r) => `
      <div class="kb-item">
        <div class="kb-item-top">
          <span class="kb-item-type">${esc(TYPE_LABELS[r.type] || r.type)}</span>
          <span class="kb-status st-${esc(r.status)}">${esc(STATUS_LABELS[r.status] || r.status)}</span>
        </div>
        ${r.target_sec_id ? `<div class="kb-dim">目标章节：${esc(r.target_sec_id)}</div>` : ""}
        <div class="kb-dim">${esc(new Date(r.created_at).toLocaleString("zh-CN"))}</div>
        ${r.status === "rejected" && r.admin_note ? `<div class="kb-note">管理员备注：${esc(r.admin_note)}</div>` : ""}
      </div>`).join("") + `</div>`;
  }

  /* ---------- 视图：投稿表单 ---------- */
  function secOptions(selected) {
    const S = (window.KNOWLEDGE_DATA && window.KNOWLEDGE_DATA.SECTIONS) || [];
    return S.map((s) => `<option value="${esc(s.id)}" ${s.id === selected ? "selected" : ""}>${esc(s.title)}（${esc(s.id)}）</option>`).join("");
  }
  const glossaryCats = (() => {
    try { return [...new Set((window.KNOWLEDGE_DATA.GLOSSARY || []).map((g) => g.cat))]; } catch (e) { return []; }
  })();
  const resourceCats = (() => {
    try { return [...new Set((window.KNOWLEDGE_DATA.RESOURCES || []).map((g) => g.cat))]; } catch (e) { return []; }
  })();
  const datalist = (id, arr) => `<datalist id="${id}">${arr.map((c) => `<option value="${esc(c)}">`).join("")}</datalist>`;

  function viewSubmit() {
    const t = (submitPreset && submitPreset.type) || "section_block";
    dTitle.textContent = "投稿（管理员审核通过后发布）";
    dBody.innerHTML = `
      <form class="kb-form" id="kbSubmitForm">
        <label>投稿类型
          <select class="kb-input" name="type" id="kbType">
            ${Object.keys(TYPE_LABELS).map((k) => `<option value="${k}" ${k === t ? "selected" : ""}>${TYPE_LABELS[k]}</option>`).join("")}
          </select>
        </label>
        <div id="kbTypeFields"></div>
        <div class="kb-msg" id="kbSubMsg"></div>
        <button class="kb-btn primary" type="submit">提交投稿</button>
        <p class="kb-dim">提交后进入待审核队列，可在「我的投稿」查看进度。所有内容展示前均经管理员人工审核。</p>
      </form>`;
    const typeSel = dBody.querySelector("#kbType");
    const fields = dBody.querySelector("#kbTypeFields");
    const renderFields = () => {
      const v = typeSel.value;
      if (v === "section_block") {
        fields.innerHTML = `
          <label>追加到章节
            <select class="kb-input" name="target_sec_id">${secOptions(submitPreset && submitPreset.target)}</select>
          </label>
          <label>小节标题（必填，≤60 字）<input class="kb-input" name="heading" maxlength="60" required placeholder="如：提示词进阶技巧"></label>
          <label>正文段落（每行一段，≤6 段）<textarea class="kb-input" name="paragraphs" rows="5" placeholder="第一段…&#10;第二段…"></textarea></label>
          <fieldset class="kb-fs"><legend>要点列表（可选）</legend>
            <label>列表标题<input class="kb-input" name="list_title" maxlength="40" placeholder="如：关键要点"></label>
            <label>列表项（每行一条，≤12 条）<textarea class="kb-input" name="list_items" rows="3"></textarea></label>
          </fieldset>
          <fieldset class="kb-fs"><legend>重点提示（可选）</legend>
            <label>类型<select class="kb-input" name="co_type"><option value="key">★ 关键</option><option value="info">✦ 补充</option><option value="warn">⚠ 注意</option></select></label>
            <label>提示文本（≤600 字）<textarea class="kb-input" name="co_text" rows="2"></textarea></label>
          </fieldset>
          <fieldset class="kb-fs"><legend>术语对照表（可选）</legend>
            <label>表头（英文逗号分隔，≤6 列）<input class="kb-input" name="tb_head" placeholder="术语,英文,一句话解释"></label>
            <label>表行（每行一条，逗号分隔各列，≤20 行）<textarea class="kb-input" name="tb_rows" rows="3" placeholder="提示词,Prompt,描述你想要的画面"></textarea></label>
          </fieldset>
          <fieldset class="kb-fs"><legend>FAQ（可选，每行一条「问|答」，≤8 条）</legend>
            <textarea class="kb-input" name="faq" rows="3" placeholder="什么是采样器？|控制去噪过程的算法…"></textarea>
          </fieldset>`;
      } else if (v === "glossary") {
        fields.innerHTML = `
          ${datalist("kbGlossCats", glossaryCats)}
          <label>术语（必填，≤30 字）<input class="kb-input" name="term" maxlength="30" required placeholder="如：潜空间"></label>
          <label>英文（≤60 字）<input class="kb-input" name="en" maxlength="60" placeholder="Latent Space"></label>
          <label>分类（≤12 字）<input class="kb-input" name="cat" maxlength="12" list="kbGlossCats" placeholder="如：原理"></label>
          <label>释义（必填，≤300 字）<textarea class="kb-input" name="desc" rows="4" required></textarea></label>`;
      } else if (v === "resource") {
        fields.innerHTML = `
          ${datalist("kbResCats", resourceCats)}
          <label>所属分类（必填，≤20 字）<input class="kb-input" name="cat" maxlength="20" list="kbResCats" required placeholder="如：基础模型"></label>
          <label>名称（必填，≤40 字）<input class="kb-input" name="name" maxlength="40" required></label>
          <label>一句话定位（≤60 字）<input class="kb-input" name="role" maxlength="60"></label>
          <label>主题色（可选）<input class="kb-input kb-color" name="color" type="color" value="#00ffc8"></label>
          <label>链接（每行一条「标签|https://网址」，1–6 条）<textarea class="kb-input" name="links" rows="3" required placeholder="官网|https://example.com"></textarea></label>`;
      } else {
        fields.innerHTML = `
          <label>教程标题（必填，≤40 字）<input class="kb-input" name="title" maxlength="40" required></label>
          <label>导语（≤150 字）<textarea class="kb-input" name="lead" rows="2"></textarea></label>
          <label>正文（支持轻量标记：# 小节标题 / - 列表项 / 1. 步骤 / &gt; 命令行 / 普通行为段落）<textarea class="kb-input" name="body" rows="10" placeholder="# 安装步骤&#10;1. 下载安装包&#10;&gt; pip install x&#10;- 支持 Windows / macOS"></textarea></label>
          <label>参考来源（每行一条「标签|https://网址」，≤5 条）<textarea class="kb-input" name="sources" rows="2"></textarea></label>`;
      }
    };
    renderFields();
    typeSel.addEventListener("change", renderFields);

    dBody.querySelector("#kbSubmitForm").addEventListener("submit", async (ev) => {
      ev.preventDefault();
      const sb = getSB(); if (!sb) return;
      const msg = dBody.querySelector("#kbSubMsg");
      const fd = new FormData(dBody.querySelector("#kbSubmitForm"));
      const type = typeSel.value;
      let payload = null, target = null;
      try {
        if (type === "section_block") payload = buildSectionBlock(fd);
        else if (type === "glossary") payload = buildGlossary(fd);
        else if (type === "resource") payload = buildResource(fd);
        else payload = buildTutorial(fd);
        target = type === "section_block" ? String(fd.get("target_sec_id") || "") : null;
        if (JSON.stringify(payload).length > 32768) throw new Error("内容体积超过 32KB，请精简后提交");
      } catch (e) {
        msg.textContent = e.message; msg.className = "kb-msg err"; return;
      }
      msg.textContent = "提交中…"; msg.className = "kb-msg";
      try {
        // RLS 要求 user_id/user_email 与会话一致，缺一不可
        const { error } = await sb.from("submissions").insert({
          user_id: USER.id, user_email: USER.email,
          type, target_sec_id: target, payload
        });
        if (error) throw error;
        msg.textContent = "投稿成功！已进入待审核队列。";
        msg.className = "kb-msg ok";
      } catch (e) {
        msg.textContent = "提交失败：" + authErrMsg(e);
        msg.className = "kb-msg err";
      }
    });
  }

  /* ---------- payload 构造与校验 ---------- */
  function need(cond, m) { if (!cond) throw new Error(m); }

  function buildSectionBlock(fd) {
    const heading = cut(fd.get("heading"), 60);
    need(heading, "小节标题必填");
    const blk = { heading };
    const paras = lines(fd.get("paragraphs"));
    need(paras.length <= 6, "段落最多 6 段");
    if (paras.length) blk.paragraphs = paras.map((p) => cut(p, 1500));
    const li = lines(fd.get("list_items"));
    if (String(fd.get("list_title") || "").trim() || li.length) {
      need(li.length && li.length <= 12, "列表需 1–12 条内容");
      blk.list = { title: cut(fd.get("list_title"), 40) || "要点", items: li.map((x) => cut(x, 200)) };
    }
    const coText = cut(fd.get("co_text"), 600);
    if (coText) blk.callout = { type: ["key", "warn", "info"].includes(fd.get("co_type")) ? fd.get("co_type") : "key", title: cut(fd.get("co_type") === "warn" ? "注意" : "提示", 40), text: coText };
    const head = lines(String(fd.get("tb_head") || "").replace(/，/g, ","));
    const rows = lines(fd.get("tb_rows")).map((r) => r.replace(/，/g, ",").split(",").map((c) => cut(c, 200)));
    if (head.length || rows.length) {
      need(head.length >= 1 && head.length <= 6 && rows.length >= 1 && rows.length <= 20, "表格需表头 1–6 列、数据 1–20 行");
      blk.table = {
        title: cut(fd.get("tb_title") || "对照表", 40),
        head: head.map((h) => cut(h, 30)),
        rows: rows.map((r) => { const out = r.slice(0, head.length); while (out.length < head.length) out.push(""); return out; })
      };
    }
    const faq = lines(fd.get("faq")).map((x) => { const i = x.indexOf("|"); return i > 0 ? { q: cut(x.slice(0, i), 100), a: cut(x.slice(i + 1), 800) } : null; }).filter(Boolean);
    if (lines(fd.get("faq")).length) {
      need(faq.length && faq.length <= 8, "FAQ 每行需为「问|答」格式，最多 8 条");
      blk.faq = faq;
    }
    need(blk.paragraphs || blk.list || blk.callout || blk.table || blk.faq, "至少填写一项内容（段落/列表/提示/表格/FAQ）");
    return blk;
  }
  function buildGlossary(fd) {
    const term = cut(fd.get("term"), 30);
    need(term, "术语必填");
    const desc = cut(fd.get("desc"), 300);
    need(desc, "释义必填");
    return { term, en: cut(fd.get("en"), 60), cat: cut(fd.get("cat"), 12) || "社区", desc };
  }
  function buildResource(fd) {
    const cat = cut(fd.get("cat"), 20); need(cat, "分类必填");
    const name = cut(fd.get("name"), 40); need(name, "名称必填");
    const links = lines(fd.get("links")).map((x) => { const i = x.indexOf("|"); return i > 0 ? { label: cut(x.slice(0, i), 20), url: cut(x.slice(i + 1), 500) } : null; }).filter(Boolean);
    need(links.length && links.length <= 6, "链接需 1–6 条，格式「标签|网址」");
    need(links.every((l) => okUrl(l.url)), "链接必须以 https:// 开头");
    return { cat, name, role: cut(fd.get("role"), 60), color: /^#[0-9a-fA-F]{6}$/.test(fd.get("color") || "") ? fd.get("color") : undefined, links };
  }
  function buildTutorial(fd) {
    const title = cut(fd.get("title"), 40); need(title, "标题必填");
    const parts = [];
    let cur = null;
    lines(fd.get("body")).forEach((raw) => {
      if (/^#\s/.test(raw)) { cur = { h3: cut(raw.slice(1), 40) }; parts.push(cur); return; }
      if (!cur) { cur = {}; parts.push(cur); }
      if (/^-\s/.test(raw)) { (cur.bullets = cur.bullets || []).push(cut(raw.slice(2), 200)); }
      else if (/^\d+[.、]\s*/.test(raw)) { (cur.steps = cur.steps || []).push(cut(raw.replace(/^\d+[.、]\s*/, ""), 200)); }
      else if (/^>\s?/.test(raw)) { (cur.cmds = cur.cmds || []).push(cut(raw.replace(/^>\s?/, ""), 300)); }
      else { (cur.paras = cur.paras || []).push(cut(raw, 800)); }
    });
    parts.forEach((p) => { need(!(p.paras && p.paras.length > 20), "每小节段落过多"); });
    need(parts.length && parts.length <= 8, "正文至少 1 行，小节数 ≤8");
    const sources = lines(fd.get("sources")).map((x) => { const i = x.indexOf("|"); return i > 0 ? { label: cut(x.slice(0, i), 40), url: cut(x.slice(i + 1), 500) } : null; }).filter(Boolean);
    need(sources.every((s) => okUrl(s.url)), "参考来源链接必须以 https:// 开头");
    need(sources.length <= 5, "参考来源最多 5 条");
    return { title, lead: cut(fd.get("lead"), 150), parts, sources };
  }

  /* ---------- 视图路由 ---------- */
  const VIEWS = { disabled: viewDisabled, auth: viewAuth, hub: viewHub, mine: viewMine, submit: viewSubmit };
  function showView(v) {
    curView = v;
    if (v === "submit" && !USER) { showView("auth"); return; }
    (VIEWS[v] || viewHub)();
    dBody.scrollTop = 0;
  }

  /* ---------- block 悬浮操作：✚ 补充（抽屉） / ✎ 编辑（原位修订） ---------- */
  function locateBlockData(blkEl) {
    const secEl = blkEl.closest("section.section");
    if (!secEl || !secEl.id) return null;
    const secId = secEl.id;
    const m = blkEl.id.match(/^(.+)-b(\d+)$/);
    if (m) {
      const sec = ((window.KNOWLEDGE_DATA || {}).SECTIONS || []).find((s) => s.id === m[1]);
      const data = sec && Array.isArray(sec.sections) ? sec.sections[Number(m[2])] : null;
      return { secId, baseId: blkEl.id, data: data || null, origHeading: data ? data.heading : null };
    }
    // 社区 block：按 cid 在 COMMUNITY_DATA.blocks 中定位
    const CD = window.COMMUNITY_DATA || {};
    for (const sid of Object.keys(CD.blocks || {})) {
      const arr = CD.blocks[sid] || [];
      const i = arr.findIndex((b) => b && b.cid === blkEl.id);
      if (i >= 0) return { secId, baseId: blkEl.id, data: arr[i], origHeading: arr[i].heading };
    }
    return null;
  }

  function appendBlockActions() {
    document.querySelectorAll("#main .block").forEach((blk) => {
      const loc = locateBlockData(blk);
      if (!loc) return;
      buildBlockActions(blk, loc);
    });
  }

  /* 构建悬浮操作按钮（append 与编辑器 restore 后共用，保证监听器始终有效） */
  function buildBlockActions(blk, loc) {
    const old = blk.querySelector(".kb-block-actions");
    if (old) old.remove();
    const acts = document.createElement("div");
    acts.className = "kb-block-actions";

    const add = document.createElement("button");
    add.className = "kb-block-add";
    add.type = "button";
    add.title = "在此章节末尾追加新内容（投稿）";
    add.textContent = "✚ 补充";
    add.addEventListener("click", (e) => {
      e.stopPropagation();
      submitPreset = { type: "section_block", target: loc.secId };
      openDrawer();
      showView(USER ? "submit" : "auth");
    });
    acts.appendChild(add);

    if (loc.data && !loc.data.render) {
      const edit = document.createElement("button");
      edit.className = "kb-block-edit";
      edit.type = "button";
      edit.title = "直接在原位修订此小节内容（投稿，需审核）";
      edit.textContent = "✎ 编辑";
      edit.addEventListener("click", (e) => {
        e.stopPropagation();
        if (!getSB()) { openDrawer(); return; }
        if (!USER) { openDrawer(); showView("auth"); return; }
        openBlockEditor(blk, loc);
      });
      acts.appendChild(edit);
    }
    blk.appendChild(acts);
  }

  /* ---------- 原位编辑器：把 block 内容替换为就地表单，提交为 block_edit 修订 ---------- */
  function openBlockEditor(blkEl, loc) {
    if (blkEl.dataset.editing) return;
    blkEl.dataset.editing = "1";
    const savedHtml = blkEl.innerHTML;
    const restore = () => {
      blkEl.innerHTML = savedHtml;
      delete blkEl.dataset.editing;
      blkEl.classList.remove("comm-editing");
      buildBlockActions(blkEl, loc); // innerHTML 还原会丢监听器，重建操作按钮
    };
    const d = loc.data;
    blkEl.classList.add("comm-editing");
    blkEl.innerHTML = `
      <div class="kb-ed-head">✎ 修订此小节 <span class="kb-dim">原位编辑 · 提交后需管理员审核通过才生效</span></div>
      <div class="kb-ed-form">
        <label>小节标题<input class="kb-input" name="ed_heading" maxlength="60" value="${esc(d.heading || "")}"></label>
        <label>正文段落（每段一个输入框，可增删）</label>
        <div class="kb-ed-paras"></div>
        <button type="button" class="kb-btn ghost" data-act="add-para">＋ 添加段落</button>
        <fieldset class="kb-fs"><legend>重点提示卡（可选）</legend>
          <label class="kb-ed-check"><input type="checkbox" name="ed_co_on" ${d.callout ? "checked" : ""}> 包含提示卡</label>
          <div class="kb-ed-co">
            <select class="kb-input" name="ed_co_type">
              <option value="key" ${d.callout && d.callout.type === "key" ? "selected" : ""}>★ 关键</option>
              <option value="warn" ${d.callout && d.callout.type === "warn" ? "selected" : ""}>⚠ 注意</option>
              <option value="info" ${d.callout && d.callout.type === "info" ? "selected" : ""}>✦ 补充</option>
            </select>
            <input class="kb-input" name="ed_co_title" maxlength="40" placeholder="提示标题（可省）" value="${esc(d.callout ? d.callout.title || "" : "")}">
            <textarea class="kb-input" name="ed_co_text" rows="2" placeholder="提示正文">${esc(d.callout ? d.callout.text || "" : "")}</textarea>
          </div>
        </fieldset>
        <fieldset class="kb-fs"><legend>要点列表（可选）</legend>
          <input class="kb-input" name="ed_list_title" maxlength="40" placeholder="列表标题" value="${esc(d.list ? d.list.title || "" : "")}">
          <textarea class="kb-input" name="ed_list_items" rows="4" placeholder="每行一条">${esc(d.list ? (d.list.items || []).join("\n") : "")}</textarea>
        </fieldset>
        <fieldset class="kb-fs"><legend>表格（可选）</legend>
          <input class="kb-input" name="ed_tb_title" maxlength="40" placeholder="表标题" value="${esc(d.table ? d.table.title || "" : "")}">
          <input class="kb-input" name="ed_tb_head" placeholder="表头（逗号分隔，≤6 列）" value="${esc(d.table ? (d.table.head || []).join(",") : "")}">
          <textarea class="kb-input" name="ed_tb_rows" rows="4" placeholder="每行一条，逗号分隔各列">${esc(d.table ? (d.table.rows || []).map((r) => r.join(",")).join("\n") : "")}</textarea>
        </fieldset>
        <fieldset class="kb-fs"><legend>FAQ（可选，每行「问|答」）</legend>
          <textarea class="kb-input" name="ed_faq" rows="4">${esc((d.faq || []).map((x) => x.q + "|" + x.a).join("\n"))}</textarea>
        </fieldset>
        <div class="kb-msg" data-role="ed_msg"></div>
        <div class="kb-ed-acts">
          <button class="kb-btn primary" type="button" data-act="submit">提交修订</button>
          <button class="kb-btn ghost" type="button" data-act="cancel">取消</button>
        </div>
      </div>`;

    // 段落动态增删改（输入即写回状态，删除不丢其他段落的编辑）
    const paras = (d.paragraphs || []).slice();
    const parasWrap = blkEl.querySelector(".kb-ed-paras");
    const renderParas = () => {
      parasWrap.innerHTML = "";
      if (!paras.length) parasWrap.innerHTML = '<div class="kb-dim">（暂无段落，点下方「＋ 添加段落」）</div>';
      paras.forEach((p, i) => {
        const row = document.createElement("div");
        row.className = "kb-ed-para";
        const ta = document.createElement("textarea");
        ta.className = "kb-input"; ta.rows = 3; ta.value = p; ta.placeholder = "第 " + (i + 1) + " 段";
        ta.addEventListener("input", () => { paras[i] = ta.value; });
        const del = document.createElement("button");
        del.type = "button"; del.className = "kb-btn ghost"; del.textContent = "✕ 删除此段";
        del.addEventListener("click", () => { paras.splice(i, 1); renderParas(); });
        row.appendChild(ta); row.appendChild(del);
        parasWrap.appendChild(row);
      });
    };
    renderParas();
    blkEl.querySelector('[data-act="add-para"]').addEventListener("click", () => { paras.push(""); renderParas(); });

    const msg = blkEl.querySelector('[data-role="ed_msg"]');
    blkEl.querySelector('[data-act="cancel"]').addEventListener("click", restore);
    blkEl.querySelector('[data-act="submit"]').addEventListener("click", async () => {
      const q = (n) => blkEl.querySelector('[name="' + n + '"]');
      const heading = cut(q("ed_heading").value, 60);
      if (!heading) { msg.textContent = "小节标题必填"; msg.className = "kb-msg err"; return; }
      const out = { heading, paragraphs: paras.map((p) => cut(p, 1500)).filter((s) => s.length) };
      if (out.paragraphs.length > 6) { msg.textContent = "段落最多 6 段"; msg.className = "kb-msg err"; return; }
      if (q("ed_co_on").checked) {
        const t = cut(q("ed_co_text").value, 600);
        if (t) out.callout = { type: ["key", "warn", "info"].includes(q("ed_co_type").value) ? q("ed_co_type").value : "key", title: cut(q("ed_co_title").value, 40), text: t };
      }
      const li = lines(q("ed_list_items").value);
      if (cut(q("ed_list_title").value, 40) || li.length) {
        if (!li.length || li.length > 12) { msg.textContent = "列表需 1–12 条内容"; msg.className = "kb-msg err"; return; }
        out.list = { title: cut(q("ed_list_title").value, 40) || "要点", items: li.map((x) => cut(x, 200)) };
      }
      const head = lines(q("ed_tb_head").value.replace(/，/g, ",")).join(",").split(",").map((h) => cut(h, 30)).filter(Boolean);
      const rows = lines(q("ed_tb_rows").value).map((r) => r.replace(/，/g, ",").split(",").map((c) => cut(c, 200)));
      if (head.length || rows.length) {
        if (!head.length || head.length > 6 || !rows.length || rows.length > 20) { msg.textContent = "表格需表头 1–6 列、数据 1–20 行"; msg.className = "kb-msg err"; return; }
        out.table = { title: cut(q("ed_tb_title").value, 40) || "对照表", head, rows: rows.map((r) => { const o = r.slice(0, head.length); while (o.length < head.length) o.push(""); return o; }) };
      }
      const faqLines = lines(q("ed_faq").value);
      const faq = faqLines.map((x) => { const i = x.indexOf("|"); return i > 0 ? { q: cut(x.slice(0, i), 100), a: cut(x.slice(i + 1), 800) } : null; }).filter(Boolean);
      if (faqLines.length) {
        if (!faq.length || faq.length > 8) { msg.textContent = "FAQ 每行需为「问|答」格式，最多 8 条"; msg.className = "kb-msg err"; return; }
        out.faq = faq;
      }
      if (!out.paragraphs.length && !out.callout && !out.list && !out.table && !out.faq) {
        msg.textContent = "至少保留一项内容（段落/提示/列表/表格/FAQ）"; msg.className = "kb-msg err"; return;
      }
      const payload = { baseBlockId: loc.baseId, baseHeading: loc.origHeading, block: out };
      if (JSON.stringify(payload).length > 32768) { msg.textContent = "内容体积超过 32KB，请精简"; msg.className = "kb-msg err"; return; }
      msg.textContent = "提交中…"; msg.className = "kb-msg";
      try {
        const sb = getSB();
        const { error } = await sb.from("submissions").insert({
          user_id: USER.id, user_email: USER.email,
          type: "block_edit", target_sec_id: loc.secId, payload
        });
        if (error) throw error;
        msg.textContent = "✓ 修订已提交，待管理员审核"; msg.className = "kb-msg ok";
        setTimeout(restore, 1200);
      } catch (e) {
        msg.textContent = "提交失败：" + authErrMsg(e); msg.className = "kb-msg err";
      }
    });
  }

  /* ---------- 启动 ---------- */
  async function boot() {
    buildDrawer();
    appendBlockActions();
    const fab = document.getElementById("kbAccountFab");
    if (fab) fab.addEventListener("click", openDrawer);
    if (getSB()) {
      await refreshSession();
      // 登录状态下更新抽屉副标题
      if (USER) dTitle.textContent = "社区共建 · 已登录";
    }
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
