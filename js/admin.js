/* =====================================================================
 * AI 生图知识体系 · 管理员审核后台
 * 审核队列（批准/驳回/下架）+ GitHub Contents API 同步（全量重建 + 幂等）
 * 安全：页面本身无秘密；数据权限靠 Supabase RLS（is_admin()）；
 *       GitHub PAT 仅存管理员本人浏览器 localStorage
 * ===================================================================== */
(function () {
  "use strict";

  const $ = (id) => document.getElementById(id);
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  const TYPE_LABELS = { section_block: "补充章节块", glossary: "新术语", resource: "新官方资源", tutorial: "新配置教程", block_edit: "修订既有小节" };
  const STATUS_LABELS = { pending: "待审核", approved: "已批准", synced: "已发布", rejected: "已驳回", removed: "已下架" };

  /* ---------- Supabase 客户端 ---------- */
  let SB;
  function getSB() {
    if (SB !== undefined) return SB;
    try {
      const cfg = window.KB_CONFIG || {};
      SB = (cfg.SUPABASE_URL && cfg.SUPABASE_ANON_KEY && window.supabase && window.supabase.createClient)
        ? window.supabase.createClient(cfg.SUPABASE_URL, cfg.SUPABASE_ANON_KEY)
        : null;
    } catch (e) { console.warn("[admin] Supabase 初始化失败", e); SB = null; }
    return SB;
  }

  let USER = null;
  let IS_ADMIN = false;

  function authErrMsg(e) {
    const m = String((e && e.message) || "").toLowerCase();
    if (m.includes("email not confirmed")) return "邮箱尚未验证";
    if (m.includes("invalid login credentials")) return "邮箱或密码错误";
    return (e && e.message) || "操作失败";
  }

  /* 密码显示/隐藏切换 */
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

  /* ---------- 守卫 ---------- */
  async function requireAdmin() {
    const sb = getSB();
    if (!sb) {
      $("admGuard").innerHTML = `<div class="kb-tip err">社区功能未启用：请在 js/config.js 填入 SUPABASE_URL 与 SUPABASE_ANON_KEY。</div>`;
      return false;
    }
    try {
      const { data } = await sb.auth.getSession();
      USER = data && data.session ? data.session.user : null;
      if (!USER) { renderLogin(); return false; }
      const { data: p, error } = await sb.from("profiles").select("display_name,is_admin").eq("id", USER.id).maybeSingle();
      if (error) throw error;
      IS_ADMIN = !!(p && p.is_admin);
      if (!IS_ADMIN) {
        $("admGuard").innerHTML = `<div class="kb-tip err">当前账号（${esc(USER.email)}）不是管理员。请在 Supabase SQL Editor 执行：<br><code>update public.profiles set is_admin = true where email = '${esc(USER.email)}';</code></div>`;
        return false;
      }
      $("admWho").textContent = "👤 " + ((p && p.display_name) || USER.email);
      $("admLogout").hidden = false;
      $("admGuard").hidden = true;
      $("admMain").hidden = false;
      return true;
    } catch (e) {
      $("admGuard").innerHTML = `<div class="kb-tip err">初始化失败：${esc(authErrMsg(e))}</div>`;
      return false;
    }
  }

  function renderLogin() {
    $("admGuard").innerHTML = `
      <form class="kb-form" id="admLoginForm" style="max-width:360px">
        <p class="adm-note">管理员入口：请先登录（账号需已在 Supabase 中标记 is_admin）。</p>
        <label>邮箱<input class="kb-input" name="email" type="email" required autocomplete="email"></label>
        <label>密码<input class="kb-input" name="password" type="password" required autocomplete="current-password"></label>
        <div class="kb-msg" id="admLoginMsg"></div>
        <button class="kb-btn primary" type="submit">登录</button>
      </form>`;
    addPwToggle($("admLoginForm").querySelector('input[name="password"]'));
    $("admLoginForm").addEventListener("submit", async (ev) => {
      ev.preventDefault();
      const sb = getSB();
      const fd = new FormData($("admLoginForm"));
      const msg = $("admLoginMsg");
      msg.textContent = "登录中…"; msg.className = "kb-msg";
      try {
        const { error } = await sb.auth.signInWithPassword({
          email: String(fd.get("email")).trim(),
          password: String(fd.get("password"))
        });
        if (error) throw error;
        await requireAdmin();
        if (IS_ADMIN) { await loadList(curFilter); }
      } catch (e) {
        msg.textContent = authErrMsg(e); msg.className = "kb-msg err";
      }
    });
  }

  /* ---------- 审核队列 ---------- */
  let ROWS = [];
  let curFilter = "pending";

  async function loadList(filter) {
    if (filter) curFilter = filter;
    const sb = getSB();
    try {
      const { data, error } = await sb.from("submissions")
        .select("*").order("created_at", { ascending: false }).limit(500);
      if (error) throw error;
      ROWS = data || [];
    } catch (e) {
      $("admList").innerHTML = `<div class="kb-tip err">加载失败：${esc(authErrMsg(e))}</div>`;
      return;
    }
    renderTabs();
    renderRows();
  }

  function renderTabs() {
    const counts = { all: ROWS.length };
    ROWS.forEach((r) => { counts[r.status] = (counts[r.status] || 0) + 1; });
    const tabs = [["pending", "待审核"], ["approved", "已批准"], ["synced", "已发布"], ["rejected", "已驳回"], ["removed", "已下架"], ["all", "全部"]];
    $("admTabs").innerHTML = tabs.map(([k, label]) =>
      `<button class="adm-tab ${curFilter === k ? "active" : ""}" data-k="${k}" type="button">${label}<span class="cnt">${counts[k] || 0}</span></button>`
    ).join("");
    $("admTabs").querySelectorAll(".adm-tab").forEach((t) =>
      t.addEventListener("click", () => loadList(t.dataset.k)));
  }

  function summarize(r) {
    const p = r.payload || {};
    if (r.type === "section_block") {
      const bits = [];
      if (p.paragraphs) bits.push(p.paragraphs.length + " 段");
      if (p.list) bits.push("列表 " + p.list.items.length + " 项");
      if (p.callout) bits.push("提示卡");
      if (p.table) bits.push("表格 " + p.table.rows.length + " 行");
      if (p.faq) bits.push("FAQ " + p.faq.length + " 条");
      return `<b>${esc(p.heading || "(无标题)")}</b> → 追加到 <b>${esc(r.target_sec_id || "?")}</b> 末尾（${bits.join(" · ") || "无内容"}）`;
    }
    if (r.type === "block_edit") {
      const b = p.block || {};
      const bits = [];
      if (b.paragraphs) bits.push(b.paragraphs.length + " 段");
      if (b.list) bits.push("列表 " + b.list.items.length + " 项");
      if (b.callout) bits.push("提示卡");
      if (b.table) bits.push("表格 " + b.table.rows.length + " 行");
      if (b.faq) bits.push("FAQ " + b.faq.length + " 条");
      const orig = p.baseHeading ? `原「${esc(p.baseHeading)}」→ ` : "";
      return `修订 <b>${esc(p.baseBlockId || "?")}</b>：${orig}新「<b>${esc(b.heading || "?")}</b>」（${bits.join(" · ") || "无内容"}）`;
    }
    if (r.type === "glossary") return `<b>${esc(p.term || "?")}</b>（${esc(p.en || "无英文")} · ${esc(p.cat || "社区")}）：${esc(p.desc || "")}`;
    if (r.type === "resource") return `<b>${esc(p.name || "?")}</b> → ${esc(p.cat || "?")}（${(p.links || []).length} 条链接）：${esc(p.role || "")}`;
    if (r.type === "tutorial") return `<b>${esc(p.title || "?")}</b>：${esc(p.lead || "")}（${(p.parts || []).length} 小节）`;
    return "(未知类型)";
  }

  function rowActions(r) {
    const acts = [];
    if (r.status === "pending") {
      acts.push(`<button class="kb-btn ok" data-a="approve" data-id="${r.id}" type="button">✓ 批准</button>`);
      acts.push(`<button class="kb-btn bad" data-a="reject" data-id="${r.id}" type="button">✕ 驳回</button>`);
    }
    if (r.status === "approved" || r.status === "synced") {
      acts.push(`<button class="kb-btn bad" data-a="remove" data-id="${r.id}" type="button">⬇ 下架</button>`);
    }
    if (r.status === "removed" || r.status === "rejected") {
      acts.push(`<button class="kb-btn ok" data-a="approve" data-id="${r.id}" type="button">↑ 恢复为已批准</button>`);
    }
    if (r.status === "rejected") {
      acts.push(`<button class="kb-btn mut" data-a="reject" data-id="${r.id}" type="button">改备注</button>`);
    }
    if (r.status === "pending") {
      acts.push(`<button class="kb-btn mut" data-a="delete" data-id="${r.id}" type="button">🗑 删除</button>`);
    }
    return acts.join("");
  }

  function renderRows() {
    const list = curFilter === "all" ? ROWS : ROWS.filter((r) => r.status === curFilter);
    if (!list.length) {
      $("admList").innerHTML = `<div class="kb-tip">此状态下暂无投稿。</div>`;
      return;
    }
    $("admList").innerHTML = list.map((r) => `
      <div class="adm-row">
        <div class="adm-row-top">
          <span class="adm-row-type">${esc(TYPE_LABELS[r.type] || r.type)}</span>
          <span class="kb-status st-${esc(r.status)}">${esc(STATUS_LABELS[r.status] || r.status)}</span>
          <span class="adm-row-meta">#${r.id} · ${esc(r.user_email || "?")} · ${esc(new Date(r.created_at).toLocaleString("zh-CN"))}</span>
        </div>
        <div class="adm-summary">${summarize(r)}</div>
        ${r.admin_note ? `<div class="adm-row-meta" style="margin-top:6px">备注：${esc(r.admin_note)}</div>` : ""}
        <details class="adm-details"><summary>查看完整 payload</summary><pre class="adm-pre">${esc(JSON.stringify(r.payload, null, 2))}</pre></details>
        <div class="adm-row-acts">${rowActions(r)}</div>
      </div>`).join("");

    $("admList").querySelectorAll("button[data-a]").forEach((btn) => {
      btn.addEventListener("click", () => act(btn.dataset.a, Number(btn.dataset.id)));
    });
  }

  async function act(action, id) {
    const sb = getSB();
    const row = ROWS.find((r) => r.id === id);
    try {
      if (action === "approve") {
        const { error } = await sb.from("submissions").update({ status: "approved", admin_note: row && row.status === "rejected" ? row.admin_note : null, reviewed_at: new Date().toISOString() }).eq("id", id);
        if (error) throw error;
      } else if (action === "reject") {
        const note = (prompt("驳回备注（将展示给投稿人，可留空）：") ?? "").trim();
        const { error } = await sb.from("submissions").update({ status: "rejected", admin_note: note || null, reviewed_at: new Date().toISOString() }).eq("id", id);
        if (error) throw error;
      } else if (action === "remove") {
        if (!confirm("确认下架？下架后内容将在下次同步时从公网移除。")) return;
        const { error } = await sb.from("submissions").update({ status: "removed", reviewed_at: new Date().toISOString() }).eq("id", id);
        if (error) throw error;
      } else if (action === "delete") {
        if (!confirm("确认彻底删除该待审投稿？不可恢复。")) return;
        const { error } = await sb.from("submissions").delete().eq("id", id);
        if (error) throw error;
      }
      await loadList();
    } catch (e) {
      alert("操作失败：" + authErrMsg(e));
    }
  }

  /* ---------- community-data.js 全量重建 ---------- */
  function buildCommunityData(subs) {
    const cd = { v: 1, builtAt: new Date().toISOString(), blocks: {}, overrides: {}, glossary: [], resources: [], tutorials: [] };
    const counters = {};
    subs.forEach((s) => {
      const p = s.payload || {};
      if (s.type === "section_block") {
        const secId = s.target_sec_id;
        if (!secId || !p.heading) return;
        counters[secId] = counters[secId] || 0;
        (cd.blocks[secId] = cd.blocks[secId] || []).push(Object.assign({}, p, { cid: secId + "-cb" + counters[secId]++, comm: true }));
      } else if (s.type === "block_edit") {
        const bid = p.baseBlockId, b = p.block;
        if (!bid || !b || !b.heading) return;
        cd.overrides[bid] = b; // 同 baseBlockId 多次修订：后提交者覆盖先提交者
      } else if (s.type === "glossary") {
        if (!p.term || !p.desc) return;
        if (cd.glossary.some((g) => g.term === p.term)) return;
        cd.glossary.push({ term: p.term, en: p.en || "", cat: p.cat || "社区", desc: p.desc });
      } else if (s.type === "resource") {
        if (!p.name || !p.cat) return;
        cd.resources.push({ cat: p.cat, color: p.color || undefined, name: p.name, role: p.role || "", links: p.links || [] });
      } else if (s.type === "tutorial") {
        if (!p.title) return;
        cd.tutorials.push(Object.assign({}, p, { id: "c-doc-" + (cd.tutorials.length + 1) }));
      }
    });
    return cd;
  }

  const FILE_HEADER =
    "/* =====================================================================\n" +
    " * 社区内容层 · 由 admin.html 审核后台自动生成并提交到仓库，请勿手工编辑\n" +
    " * 数据来源：Supabase submissions 表中 status ∈ {approved, synced} 的投稿全量重建\n" +
    " * 合并逻辑：js/app.js IIFE 顶部（blocks/glossary/resources）+ docs.html 底部（tutorials）\n" +
    " * ===================================================================== */\n";

  function serialize(cd) {
    return FILE_HEADER + "window.COMMUNITY_DATA = " + JSON.stringify(cd, null, 2) + ";\n";
  }

  /* ---------- GitHub 同步 ---------- */
  function bytesToB64(bytes) {
    let bin = "";
    const CH = 0x8000;
    for (let i = 0; i < bytes.length; i += CH) {
      bin += String.fromCharCode.apply(null, bytes.subarray(i, i + CH));
    }
    return btoa(bin);
  }

  async function gitBlobSha(bytes) {
    const header = new TextEncoder().encode("blob " + bytes.length + "\0");
    const all = new Uint8Array(header.length + bytes.length);
    all.set(header); all.set(bytes, header.length);
    const h = await crypto.subtle.digest("SHA-1", all);
    return Array.from(new Uint8Array(h)).map((b) => b.toString(16).padStart(2, "0")).join("");
  }

  function logLine(cls, text) {
    const log = $("admSyncLog");
    const div = document.createElement("div");
    if (cls) div.className = cls;
    div.textContent = text;
    log.appendChild(div);
  }

  async function fetchRemoteSha(headers) {
    const repo = (window.KB_CONFIG && window.KB_CONFIG.GITHUB_REPO) || "";
    const res = await fetch(`https://api.github.com/repos/${repo}/contents/js/community-data.js?ref=main`, { headers });
    if (res.status === 200) return (await res.json()).sha;
    if (res.status === 404) return null;
    throw new Error("读取远端文件失败：HTTP " + res.status);
  }

  async function putFile(headers, b64, remoteSha, message) {
    const repo = (window.KB_CONFIG && window.KB_CONFIG.GITHUB_REPO) || "";
    const body = { message, content: b64, branch: "main" };
    if (remoteSha) body.sha = remoteSha;
    const res = await fetch(`https://api.github.com/repos/${repo}/contents/js/community-data.js`, {
      method: "PUT", headers: Object.assign({ "Content-Type": "application/json" }, headers),
      body: JSON.stringify(body)
    });
    return res;
  }

  async function syncToGithub() {
    const sb = getSB();
    const log = $("admSyncLog");
    log.innerHTML = "";
    const pat = localStorage.getItem("kb_gh_pat");
    if (!pat) { logLine("l-err", "✗ 请先保存 GitHub PAT。"); return; }
    const btn = $("admSync");
    btn.disabled = true;
    try {
      // 1. 拉取 approved + synced 全量（事实源），removed/rejected 不参与
      logLine("", "① 拉取投稿数据…");
      const { data: subs, error } = await sb.from("submissions")
        .select("*").in("status", ["approved", "synced"]).order("created_at");
      if (error) throw error;
      const approvedIds = (subs || []).filter((s) => s.status === "approved").map((s) => s.id);
      logLine("", `共 ${(subs || []).length} 条（本次新增已批准 ${approvedIds.length} 条）`);

      // 2. 构建文件
      const cd = buildCommunityData(subs || []);
      const content = serialize(cd);
      const bytes = new TextEncoder().encode(content);
      const b64 = bytesToB64(bytes);
      const sha = await gitBlobSha(bytes);
      const nBlock = Object.values(cd.blocks).reduce((a, b) => a + b.length, 0);
      logLine("", `② 生成 community-data.js：${nBlock} 个社区块 · ${Object.keys(cd.overrides).length} 项修订 · ${cd.glossary.length} 术语 · ${cd.resources.length} 资源 · ${cd.tutorials.length} 教程（blob ${sha.slice(0, 10)}…）`);

      const headers = { Authorization: "Bearer " + pat, Accept: "application/vnd.github+json" };

      // 3. 幂等检查 + 提交（sha 冲突自动重试一次）
      for (let attempt = 1; attempt <= 2; attempt++) {
        const remoteSha = await fetchRemoteSha(headers);
        if (remoteSha === sha) {
          logLine("l-ok", "✓ 远端内容无变化，跳过提交（幂等）");
          break;
        }
        const nB = nBlock, nG = cd.glossary.length, nR = cd.resources.length, nT = cd.tutorials.length;
      const nO = Object.keys(cd.overrides).length;
      const message = `community: publish ${approvedIds.length} new submission(s) — blocks ${nB} / overrides ${nO} / glossary ${nG} / resources ${nR} / tutorials ${nT}`;
      logLine("", `③ 提交到 main${attempt > 1 ? "（重试 " + attempt + "）" : ""}…`);
        const res = await putFile(headers, b64, remoteSha, message);
        if (res.status === 200 || res.status === 201) {
          const j = await res.json();
          const csha = j && j.commit && j.commit.sha ? j.commit.sha.slice(0, 7) : "ok";
          logLine("l-ok", `✓ 已提交（commit ${csha}）。Pages 构建中：30–90s 后生效，公网缓存最长延迟 10 分钟。`);
          break;
        }
        if ((res.status === 409 || res.status === 422) && attempt === 1) {
          logLine("", "远端有并发更新，自动重试…");
          continue;
        }
        const t = await res.text();
        throw new Error("提交失败：HTTP " + res.status + " " + t.slice(0, 300));
      }

      // 4. 记账：approved → synced（失败无碍，下次同步自愈）
      if (approvedIds.length) {
        const { error: upErr } = await sb.from("submissions")
          .update({ status: "synced", synced_at: new Date().toISOString() })
          .in("id", approvedIds);
        logLine(upErr ? "l-err" : "l-ok", upErr ? "⚠ 记账失败（不影响发布，下次同步自动收敛）：" + upErr.message : "④ 已将本次批准的投稿标记为「已发布」");
      }
      await loadList();
    } catch (e) {
      logLine("l-err", "✗ " + (e.message || e));
    } finally {
      btn.disabled = false;
    }
  }

  /* ---------- AI 审查包导出 ---------- */
  function exportReview() {
    const rows = curFilter === "all" ? ROWS : ROWS.filter((r) => r.status === curFilter);
    const counts = {};
    ROWS.forEach((r) => { counts[r.status] = (counts[r.status] || 0) + 1; });
    const pack = {
      exportedAt: new Date().toISOString(),
      site: "ai-painting-atlas 社区投稿审查包",
      filter: curFilter,
      counts,
      reviewGuide: {
        statuses: STATUS_LABELS,
        types: TYPE_LABELS,
        howToAct: "审核结论用 PATCH 写回：status=approved(批准)|rejected(驳回,附admin_note)|removed(下架)；全自动接入见 HANDOFF.md「本地 AI Agent 自动审核接入」"
      },
      submissions: rows.map((r) => ({ id: r.id, type: r.type, status: r.status, user_email: r.user_email, created_at: r.created_at, target_sec_id: r.target_sec_id, admin_note: r.admin_note, payload: r.payload }))
    };
    const json = JSON.stringify(pack, null, 2);
    const download = () => {
      const a = document.createElement("a");
      a.href = URL.createObjectURL(new Blob([json], { type: "application/json" }));
      a.download = "review-pack-" + curFilter + ".json";
      a.click();
      logLine("", "已下载 review-pack-" + curFilter + ".json（剪贴板不可用时的降级方式）");
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(json).then(
        () => logLine("l-ok", "✓ 已复制 " + rows.length + " 条投稿到剪贴板（可直接粘贴给 AI 审查）"),
        download
      );
    } else download();
  }

  /* ---------- PAT 管理 ---------- */
  function renderPatState() {
    const saved = !!localStorage.getItem("kb_gh_pat");
    $("admPat").placeholder = saved ? "已保存（输入新值可覆盖）" : "GitHub Fine-grained PAT（仅本仓库 Contents: 读写）";
    $("admPatState").innerHTML = saved
      ? '<span class="l-ok">● 已在本机保存 PAT，可直接同步发布。</span> <span>该凭据只存在于保存它的「设备 + 浏览器 + 站点域名」里（换浏览器 / 无痕窗口 / localhost 与公网之间互不可见，并非丢失）。</span>'
      : '<span class="l-err">● 尚未保存 PAT —— 同步前请先在上方粘贴并点「保存 PAT」。</span>';
  }

  function initPat() {
    renderPatState();
    $("admPatSave").addEventListener("click", () => {
      const v = $("admPat").value.trim();
      if (!v) { alert("请输入 PAT"); return; }
      localStorage.setItem("kb_gh_pat", v);
      $("admPat").value = "";
      renderPatState();
      $("admSyncLog").innerHTML = "";
      logLine("l-ok", "✓ PAT 已保存到本机 localStorage");
    });
    $("admPatClear").addEventListener("click", () => {
      localStorage.removeItem("kb_gh_pat");
      renderPatState();
      logLine("", "PAT 已清除");
    });
    $("admSync").addEventListener("click", syncToGithub);
  }

  /* ---------- 启动 ---------- */
  async function boot() {
    initPat();
    $("admExport").addEventListener("click", exportReview);
    $("admLogout").addEventListener("click", async () => {
      const sb = getSB();
      if (sb) { try { await sb.auth.signOut(); } catch (e) { /* 忽略 */ } }
      location.reload();
    });
    if (await requireAdmin()) await loadList(curFilter);
  }
  boot();
})();
