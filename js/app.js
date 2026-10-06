/* =====================================================================
 * AI 生图知识体系 · 渲染与交互逻辑
 * 数据驱动渲染 + 导航高亮 + 入场动画 + 响应式
 * ===================================================================== */
(function () {
  "use strict";

  /* ---------- 0. 社区内容叠加（必须在解构前合并：GLOSSARY 派生的 categories 在 IIFE 早期绑定） ---------- */
  (function mergeCommunity() {
    try {
      const CD = window.COMMUNITY_DATA;
      const KD = window.KNOWLEDGE_DATA;
      if (!CD || !KD) return;
      const okUrl = (u) => typeof u === "string" && /^https:\/\//i.test(u.trim());
      // blocks：追加到对应 section 的 sections 末尾（append-only，保护既有 b0..bN 官方映射）
      const blocks = CD.blocks || {};
      Object.keys(blocks).forEach((secId) => {
        const sec = KD.SECTIONS.find((s) => s.id === secId);
        if (!sec || !Array.isArray(blocks[secId])) return;
        sec.sections = sec.sections || [];
        blocks[secId].forEach((blk, n) => {
          if (!blk || !blk.heading) return;
          blk.comm = true; // 社区标记：不挂 ANIM_BY_HEADING 动画、不进官方映射
          blk.cid = blk.cid || (secId + "-cb" + n); // 与官方 b 序号解耦，data.js 增删不影响外链
          sec.sections.push(blk);
        });
      });
      // glossary：按 term 去重，官方优先
      (CD.glossary || []).forEach((g) => {
        if (!g || !g.term || !g.desc) return;
        if (!KD.GLOSSARY.some((x) => x.term === g.term)) KD.GLOSSARY.push(g);
      });
      // resources：扁平项按 cat 归组（组已存在则 push，否则新建组），URL 强制 https
      if (!Array.isArray(KD.RESOURCES)) KD.RESOURCES = [];
      (CD.resources || []).forEach((r) => {
        if (!r || !r.name || !r.cat) return;
        const links = (r.links || []).filter((l) => l && okUrl(l.url)).map((l) => ({ label: l.label || "链接", url: l.url.trim() }));
        if (!links.length) return;
        let grp = KD.RESOURCES.find((x) => x.cat === r.cat);
        if (!grp) {
          grp = { cat: r.cat, color: r.color || "#00ffc8", items: [] };
          KD.RESOURCES.push(grp);
        }
        grp.items.push({ name: r.name, role: r.role || "", links });
      });
      // overrides：修订既有 block（官方按 `${secId}-bN` 定位，社区按 cid 定位）
      // 替换原位置对象 → blockIdx/b序号不变，RESOURCE_MAP/TUT_MAP 等映射保持安全；
      // 标题未改则保留 ANIM_BY_HEADING 动画
      const ov = CD.overrides || {};
      Object.keys(ov).forEach((baseId) => {
        const edit = ov[baseId];
        if (!edit || !edit.heading) return;
        let done = false;
        const m = baseId.match(/^(.+)-b(\d+)$/);
        if (m) {
          const sec = KD.SECTIONS.find((s) => s.id === m[1]);
          const idx = Number(m[2]);
          if (sec && Array.isArray(sec.sections) && idx < sec.sections.length) {
            const orig = sec.sections[idx];
            sec.sections[idx] = Object.assign({}, edit, { comm: edit.heading !== orig.heading });
            done = true;
          }
        }
        if (!done) {
          Object.keys(blocks).some((secId) => {
            const arr = blocks[secId];
            const i = Array.isArray(arr) ? arr.findIndex((b) => b && b.cid === baseId) : -1;
            if (i >= 0) { arr[i] = Object.assign({}, edit, { cid: baseId, comm: true }); return true; }
            return false;
          });
        }
      });
    } catch (e) {
      console.warn("[community] 社区内容合并失败，已忽略", e);
    }
  })();

  const { SECTIONS, GLOSSARY } = window.KNOWLEDGE_DATA;
  const main = document.getElementById("main");
  const navList = document.getElementById("navList");
  const sidebar = document.getElementById("sidebar");
  const progress = document.getElementById("progress");

  /* ---------- 工具 ---------- */
  const el = (tag, cls, html) => {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    return e;
  };
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  /* ---------- 1. 渲染侧边栏（支持展开/收起子标题） ---------- */
  function renderNav() {
    SECTIONS.forEach((sec, i) => {
      const num = String(i + 1).padStart(2, "0");
      const subs = sec.sections || [];
      const hasChildren = subs.length > 0;
      const item = el("div", "nav-item fade-in");
      item.dataset.target = sec.id;
      item.innerHTML = `
        <span class="num">${num}</span>
        <span class="ic" style="color:${sec.color}">${sec.icon}</span>
        <span class="lbl">${esc(sec.title)}</span>
        <span class="en">${esc(sec.en)}</span>
        <span class="nav-chev${hasChildren ? "" : " nav-chev-none"}">▸</span>`;

      // 主项点击 → 跳转到该章节
      item.addEventListener("click", () => {
        const target = document.getElementById(sec.id);
        if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
        if (window.innerWidth <= 720) sidebar.classList.remove("open");
      });
      // 展开按钮点击 → 切换子标题（不触发跳转）
      const chev = item.querySelector(".nav-chev");
      if (chev && hasChildren) {
        chev.addEventListener("click", (ev) => {
          ev.stopPropagation();
          item.classList.toggle("expanded");
        });
      }
      navList.appendChild(item);

      // 子标题列表（默认收起，由 .nav-item.expanded + .nav-children 展开）
      if (hasChildren) {
        const children = el("div", "nav-children");
        children.style.setProperty("--dot", sec.color);
        // sub=true 的补充阅读块紧跟其父章节显示（数组原始索引 j 不变，锚点 id 不受影响）
        const entries = subs.map((blk, j) => ({ blk, j }));
        const ordered = [];
        entries.forEach((x) => {
          if (x.blk.sub && !x.blk.cid) return;
          ordered.push(x);
          entries.forEach((s) => {
            if (s.blk.sub && !s.blk.cid && s.blk.parentIdx === x.j) ordered.push(s);
          });
        });
        entries.forEach((x) => { if (!ordered.includes(x)) ordered.push(x); });
        ordered.forEach(({ blk, j }) => {
          const sub = el("div", "nav-sub");
          if (blk.sub && !blk.cid) sub.classList.add("nav-sub-nested");
          sub.innerHTML = `<span class="nav-sub-dot"></span><span class="nav-sub-txt">${esc(blk.heading)}</span>`;
          sub.addEventListener("click", () => {
            const blkEl = document.getElementById(blk.cid || sec.id + "-b" + j);
            expandIfSub(blkEl);
            if (blkEl) blkEl.scrollIntoView({ behavior: "smooth", block: "start" });
            if (window.innerWidth <= 720) sidebar.classList.remove("open");
          });
          children.appendChild(sub);
        });
        navList.appendChild(children);
      }
    });
  }

  /* ---------- 1.5 可折叠补充阅读子章节（sub-block） ---------- */
  function setSubExpanded(blkEl, on) {
    if (!blkEl || !blkEl.classList || !blkEl.classList.contains("sub-block")) return;
    blkEl.classList.toggle("expanded", !!on);
    blkEl.classList.remove("collapsed");
    const expanded = blkEl.classList.contains("expanded");
    (blkEl._foldBtns || []).forEach((b) => { b.textContent = expanded ? "收起 ▴" : "展开 ▾"; });
    document.querySelectorAll('.sub-toggle[data-sub-id="' + blkEl.id + '"]').forEach((b) => {
      b.textContent = expanded ? b.dataset.labelOpen : b.dataset.labelClosed;
      b.setAttribute("aria-expanded", expanded ? "true" : "false");
    });
  }
  function expandIfSub(blkEl) {
    if (blkEl && blkEl.classList && blkEl.classList.contains("sub-block")) setSubExpanded(blkEl, true);
  }

  /* ---------- 2. 渲染 callout ---------- */
  function renderCallout(c) {
    const out = el("div", "callout" + (c.type ? " " + c.type : ""));
    const titleHtml = c.title ? "<b>" + esc(c.title) + "：</b>" : "";
    out.innerHTML = `
      <div class="ct-title">${c.type === "warn" ? "⚠ 注意" : c.type === "info" ? "✦ 补充" : "★ 关键"}</div>
      <div class="ct-body">${titleHtml}${esc(c.text)}</div>`;
    return out;
  }

  /* ---------- 3. 渲染 list ---------- */
  function renderList(l) {
    const out = el("div", "list-card");
    out.innerHTML = `
      <div class="lc-title">${esc(l.title || "要点")}</div>
      <ul>${l.items.map((i) => `<li>${esc(i)}</li>`).join("")}</ul>`;
    return out;
  }

  /* ---------- 4. 渲染 table ---------- */
  function renderTable(t) {
    const wrap = el("div", "table-wrap");
    const inner = `
      ${t.title ? `<div class="table-cap">${esc(t.title)}</div>` : ""}
      <div class="table-scroll"><table>
        <thead><tr>${t.head.map((h) => `<th>${esc(h)}</th>`).join("")}</tr></thead>
        <tbody>${t.rows.map((r) => `<tr>${r.map((c) => `<td>${esc(c)}</td>`).join("")}</tr>`).join("")}</tbody>
      </table></div>`;
    wrap.innerHTML = inner;
    return wrap;
  }

  /* ---------- 5. 渲染 faq ---------- */
  function renderFaq(items) {
    const wrap = el("div", "faq-wrap");
    items.forEach((f, i) => {
      const it = el("div", "faq-item");
      it.innerHTML = `
        <div class="faq-q">
          <span class="q-ic">Q${String(i + 1).padStart(2, "0")}</span>
          <span class="q-text">${esc(f.q)}</span>
          <span class="q-arrow">▸</span>
        </div>
        <div class="faq-a"><div class="faq-a-inner">${esc(f.a)}</div></div>`;
      it.querySelector(".faq-q").addEventListener("click", () => it.classList.toggle("open"));
      wrap.appendChild(it);
    });
    return wrap;
  }

  /* ---------- 5.5 渲染官方资源（含跳转正文按钮） ---------- */
  function renderResources(host) {
    const { RESOURCES, RESOURCE_MAP } = window.KNOWLEDGE_DATA;
    if (!RESOURCES) return;
    RESOURCES.forEach((group) => {
      const ghead = el("div", "res-group-head");
      ghead.innerHTML = `<span class="res-dot" style="background:${group.color}"></span><span class="res-cat">${esc(group.cat)}</span><span class="res-count">${group.items.length} 项</span>`;
      host.appendChild(ghead);

      const grid = el("div", "res-grid");
      group.items.forEach((it) => {
        const card = el("div", "res-card");
        card.dataset.cat = group.cat;
        card.dataset.name = it.name;
        card.style.setProperty("--accent", group.color);
        const links = (it.links || [])
          .map((l) => `<a class="res-link" href="${esc(l.url)}" target="_blank" rel="noopener noreferrer">${esc(l.label)}<span class="res-ext">↗</span></a>`)
          .join("");
        // 查双向映射：若该条目在正文有对应位置，加「跳转正文」按钮
        const map = (RESOURCE_MAP || []).find((m) => m.resCat === group.cat && m.resName === it.name);
        const jump = map
          ? `<button class="res-jump" type="button">跳转正文 · ${esc(secTitle(map.secId))} →</button>`
          : "";
        card.innerHTML = `
          <div class="res-name">${esc(it.name)}</div>
          <div class="res-role">${esc(it.role)}</div>
          <div class="res-links">${links}</div>
          ${jump}`;
        if (map) {
          card.querySelector(".res-jump").addEventListener("click", () => scrollToBlock(map.secId, map.blockIdx));
        }
        grid.appendChild(card);
      });
      host.appendChild(grid);
    });
  }

  /* ---------- 5.6 跳转与高亮（正文↔资源双向，暴露给 explainer） ---------- */
  function highlight(node) {
    if (!node) return;
    node.classList.add("kb-highlight");
    setTimeout(() => node.classList.remove("kb-highlight"), 2200);
  }
  function secTitle(secId) {
    const s = SECTIONS.find((x) => x.id === secId);
    return s ? s.title : secId;
  }
  function scrollToBlock(secId, blockIdx) {
    const sec = document.getElementById(secId);
    if (!sec) return;
    // blockIdx 即数组索引 = 锚点 id 后缀（-bN），按 id 查找对 DOM 嵌套/重排免疫
    const blk = (blockIdx != null) ? document.getElementById(secId + "-b" + blockIdx) : null;
    expandIfSub(blk);
    const target = blk || sec;
    target.scrollIntoView({ behavior: "smooth", block: "start" });
    highlight(target);
    if (window.innerWidth <= 720) sidebar.classList.remove("open");
  }
  function scrollToResource(cat, name) {
    const cards = document.querySelectorAll(".res-card");
    for (const c of cards) {
      if (c.dataset.cat === cat && c.dataset.name === name) {
        c.scrollIntoView({ behavior: "smooth", block: "center" });
        highlight(c);
        return true;
      }
    }
    const resSec = document.getElementById("resources");
    if (resSec) resSec.scrollIntoView({ behavior: "smooth", block: "start" });
    return false;
  }
  window.KB_NAV = { scrollToBlock, scrollToResource, highlight };

  /* ---------- 6. 渲染术语表 ---------- */
  let glossaryFilter = "全部";
  let glossaryQuery = "";
  const categories = ["全部", ...Array.from(new Set(GLOSSARY.map((g) => g.cat)))];

  function renderGlossary() {
    const grid = document.getElementById("glossaryGrid");
    if (!grid) return;
    const list = GLOSSARY.filter((g) => {
      const okCat = glossaryFilter === "全部" || g.cat === glossaryFilter;
      const q = glossaryQuery.trim().toLowerCase();
      const okQ = !q || g.term.toLowerCase().includes(q) || g.en.toLowerCase().includes(q) || g.desc.toLowerCase().includes(q);
      return okCat && okQ;
    });
    if (!list.length) {
      grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;color:var(--text-3);padding:40px;font-family:var(--font-mono);font-size:13px;">没有匹配的术语</div>`;
      return;
    }
    grid.innerHTML = list.map((g) => `
      <div class="gcard">
        <div class="gc-head">
          <span class="gc-term">${esc(g.term)}</span>
          <span class="gc-en">${esc(g.en)}</span>
        </div>
        <span class="gc-cat">${esc(g.cat)}</span>
        <div class="gc-desc">${esc(g.desc)}</div>
      </div>`).join("");
  }

  function renderGlossaryControls(host) {
    const ctrl = el("div", "glossary-controls");
    categories.forEach((c) => {
      const chip = el("button", "gchip" + (c === glossaryFilter ? " active" : ""), c);
      chip.addEventListener("click", () => {
        glossaryFilter = c;
        host.querySelectorAll(".gchip").forEach((x) => x.classList.toggle("active", x.textContent === c));
        renderGlossary();
      });
      ctrl.appendChild(chip);
    });
    const search = el("input", "gsearch");
    search.type = "text";
    search.placeholder = "搜索术语…（中英文均可）";
    search.value = glossaryQuery;
    search.addEventListener("input", (e) => {
      glossaryQuery = e.target.value;
      renderGlossary();
    });
    ctrl.appendChild(search);
    host.appendChild(ctrl);
  }

  /* ---------- 6.5 数学公式 + SVG 动画映射（硬核扩充） ---------- */
  const ANIM_BY_HEADING = {
    "什么是 AI 生图": "diffusion",
    "神经网络：AI 的『大脑细胞』": "neuron",
    "卷积神经网络（CNN）": "cnn",
    "循环神经网络（RNN）与序列": "rnn",
    "Transformer 与注意力机制": "attention",
    "生成对抗网络（GAN）：先驱者": "gan",
    "扩散模型：当前主流范式": "diffusion",
    "VAE 与潜空间": "vae",
    "U-Net：去噪核心": "unet",
    "CLIP：让 AI 听懂你的话": "clip"
  };

  /* ---------- 7. 渲染主内容 ---------- */
  function renderContent() {
    // Hero
    const hero = el("section", "hero");
    hero.innerHTML = `
      <div class="hero-tag"><span class="ping"></span>📖 参考书模式 · 零基础硬核科普</div>
      <h1>AI 生图<br><span class="accent">知识图谱</span> <span class="stroke">2026</span></h1>
      <p class="hero-lead">从神经元到扩散模型，从 Stable Diffusion 到 ComfyUI，系统梳理主流 AI 图像生成项目、模型与整合方案。技术原理 · 特点差异 · 适用场景 · 生态关系，一站看懂。</p>
      <div class="hero-meta">
        <span><b>${SECTIONS.length}</b> 个模块</span>
        <span><b>${GLOSSARY.length}</b> 条术语</span>
        <span>含 <b>原理 / 模型 / 工具 / 微调 / 社区 / 路径 / FAQ</b></span>
        <span>更新于 2026.09</span>
      </div>`;
    main.appendChild(hero);

    // 各章节
    SECTIONS.forEach((sec, i) => {
      const section = el("section", "section fade-in");
      section.id = sec.id;
      section.style.setProperty("--accent", sec.color);

      // 章节头
      const head = el("div");
      head.innerHTML = `
        <div class="section-head">
          <span class="section-num" style="color:${sec.color}">${String(i + 1).padStart(2, "0")} /</span>
          <span class="section-title">${esc(sec.title)}</span>
          <span class="section-en">${esc(sec.en)}</span>
        </div>
        <p class="section-summary" style="border-left-color:${sec.color}">${esc(sec.summary)}</p>`;
      section.appendChild(head);

      // 子章节（sub=true 渲染为 parentIdx 章节内的可折叠补充阅读面板，锚点 id 不变）
      const blockEls = [];
      sec.sections.forEach((blk, j) => {
        const isSub = !!blk.sub && !blk.comm && Number.isInteger(blk.parentIdx);
        const block = el("div", "block fade-in");
        if (blk.comm) block.classList.add("comm-block");
        if (isSub) block.classList.add("sub-block", "collapsed");
        block.id = blk.cid || sec.id + "-b" + j;
        if (!isSub) block.style.animationDelay = `${j * 60}ms`;
        const bh = el("div", "block-head");
        bh.innerHTML = `
          <span class="glyph" style="background:${sec.color}">${sec.icon}</span>
          ${isSub ? '<span class="sub-badge">补充阅读</span>' : ""}
          <h3>${esc(blk.heading)}</h3>`;
        block.appendChild(bh);

        // 段落
        (blk.paragraphs || []).forEach((p) => {
          block.appendChild(el("p", "", p));
        });

        // 数学公式 + SVG 动画 + 通俗解释（硬核扩充；社区 block 明确排除）
        const animKey = blk.comm ? undefined : ANIM_BY_HEADING[blk.heading];
        if (animKey && window.SVG_ANIMS && window.SVG_ANIMS[animKey]) {
          const A = window.SVG_ANIMS[animKey];
          if (A.formula) block.appendChild(el("div", "formula-card", A.formula));
          if (A.svg) block.appendChild(el("div", "anim-box", A.svg));
          if (A.plain) {
            const pc = el("div", "plain-card");
            pc.innerHTML = '<div class="pc-t">💡 通俗解释</div><div class="pc-b">' + A.plain + "</div>";
            block.appendChild(pc);
          }
        }

        // callout
        if (blk.callout) block.appendChild(renderCallout(blk.callout));

        // list
        if (blk.list) block.appendChild(renderList(blk.list));

        // table
        if (blk.table) block.appendChild(renderTable(blk.table));

        // faq
        if (blk.faq) block.appendChild(renderFaq(blk.faq));

        // 术语表
        if (blk.render === "glossary") {
          const controls = el("div");
          renderGlossaryControls(controls);
          block.appendChild(controls);
          const grid = el("div", "glossary-grid");
          grid.id = "glossaryGrid";
          block.appendChild(grid);
          // 延迟到 DOM 挂载后渲染
          setTimeout(renderGlossary, 0);
        }

        // 官方资源
        if (blk.render === "resources") {
          const resHost = el("div");
          renderResources(resHost);
          block.appendChild(resHost);
        }

        // 配置教程映射：若该 block 有对应教程，加跳转链接
        const tut = (window.KNOWLEDGE_DATA.TUT_MAP || []).find((m) => m.blockId === block.id);
        if (tut) {
          const tutLink = el("a", "block-tut-link");
          tutLink.href = "docs.html#" + tut.tutId;
          tutLink.target = "_blank";
          tutLink.rel = "noopener";
          tutLink.innerHTML = "🛠 查看配置教程 · " + esc(tut.label) + " →";
          block.appendChild(tutLink);
        }

        blockEls[j] = block;
        if (isSub) {
          // 折叠子块：嵌套挂载到父章节内部，头部带收起按钮
          const foldBtn = el("button", "sub-fold");
          foldBtn.type = "button";
          foldBtn.textContent = "收起 ▴";
          foldBtn.addEventListener("click", () => setSubExpanded(block, false));
          block._foldBtns = [foldBtn];
          bh.appendChild(foldBtn);
          const parentEl = blockEls[blk.parentIdx];
          if (parentEl) parentEl.appendChild(block); else section.appendChild(block);
        } else {
          section.appendChild(block);
          // 父章节尾部挂载其补充阅读的展开按钮
          sec.sections.forEach((sb, k) => {
            if (!(sb.sub && !sb.comm && Number.isInteger(sb.parentIdx) && sb.parentIdx === j)) return;
            if (!block._subWrap) {
              block._subWrap = el("div", "sub-toggles");
              block.appendChild(block._subWrap);
            }
            const btn = el("button", "sub-toggle");
            btn.type = "button";
            btn.setAttribute("aria-expanded", "false");
            btn.dataset.subId = sec.id + "-b" + k;
            btn.dataset.labelClosed = "📖 补充阅读 · " + sb.heading + " ▸";
            btn.dataset.labelOpen = "📖 补充阅读 · " + sb.heading + " ▴";
            btn.textContent = btn.dataset.labelClosed;
            btn.addEventListener("click", () => {
              const t = document.getElementById(btn.dataset.subId);
              if (t) setSubExpanded(t, !t.classList.contains("expanded"));
            });
            block._subWrap.appendChild(btn);
          });
        }
      });

      main.appendChild(section);
    });

    // 页脚
    const foot = el("footer", "foot fade-in");
    foot.innerHTML = `
      <div class="foot-grid">
        <div>
          <div class="foot-brand">AI 生图<span class="a"> · 知识图谱</span></div>
          <p>一份面向零基础小白的硬核科普知识体系，系统梳理 AI 图像生成领域的主流模型、工具、原理与生态。内容持续更新，欢迎反复查阅。</p>
        </div>
        <div>
          <h5>核心模块</h5>
          <ul class="foot-links">
            <li><a href="#basics">入门基础</a></li>
            <li><a href="#principles">技术原理</a></li>
            <li><a href="#models">主流模型</a></li>
            <li><a href="#tools">整合工具</a></li>
          </ul>
        </div>
        <div>
          <h5>进阶资源</h5>
          <ul class="foot-links">
            <li><a href="#community">社区与生态</a></li>
            <li><a href="#compare">对比速查</a></li>
            <li><a href="#learning">学习路径</a></li>
            <li><a href="#faq">常见问题</a></li>
          </ul>
        </div>
      </div>
      <div class="foot-bot">
        <span>© 2026 AI 生图知识图谱 · 科普用途</span>
        <span>由 Syne × Manrope × Noto 排版驱动</span>
      </div>`;
    main.appendChild(foot);
  }

  /* ---------- 8. 滚动监听：高亮导航 + 进度条 ---------- */
  function setupScroll() {
    const items = Array.from(document.querySelectorAll(".nav-item"));
    const sections = SECTIONS.map((s) => document.getElementById(s.id)).filter(Boolean);

    const onScroll = () => {
      const y = window.scrollY + 140;
      let activeIdx = 0;
      sections.forEach((sec, i) => {
        if (sec && sec.offsetTop <= y) activeIdx = i;
      });
      items.forEach((it, i) => it.classList.toggle("active", i === activeIdx));

      // 进度条
      const h = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.width = (h > 0 ? (window.scrollY / h) * 100 : 0) + "%";
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ---------- 9. 入场动画（IntersectionObserver） ---------- */
  function setupReveal() {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("visible");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
    );
    document.querySelectorAll(".fade-in").forEach((e) => io.observe(e));
  }

  /* ---------- 10. 移动端侧边栏开关 ---------- */
  function setupToggle() {
    const btn = document.getElementById("sidebarToggle");
    if (btn) btn.addEventListener("click", () => sidebar.classList.toggle("open"));
    document.addEventListener("click", (e) => {
      if (window.innerWidth > 720) return;
      if (!sidebar.contains(e.target) && e.target.id !== "sidebarToggle" && !e.target.closest("#sidebarToggle")) {
        sidebar.classList.remove("open");
      }
    });
  }


  /* ---------- 启动 ---------- */
  function init() {
    renderNav();
    renderContent();
    setupScroll();
    setupReveal();
    setupToggle();
    // 直接以 #models-b6 这类锚点进入时，自动展开命中的折叠子章节。
    // 展开前浏览器原生锚点滚动会因 display:none 落空，故展开后补一次定位。
    const h = location.hash.slice(1);
    if (h) {
      const t = document.getElementById(h);
      if (t && t.classList.contains("sub-block")) {
        setSubExpanded(t, true);
        t.scrollIntoView({ block: "start" });
      }
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
