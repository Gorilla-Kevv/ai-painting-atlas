/* =====================================================================
 * AI 生图知识体系 · 渲染与交互逻辑
 * 数据驱动渲染 + 导航高亮 + 入场动画 + 响应式
 * ===================================================================== */
(function () {
  "use strict";

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
        subs.forEach((blk, j) => {
          const sub = el("div", "nav-sub");
          sub.innerHTML = `<span class="nav-sub-dot"></span><span class="nav-sub-txt">${esc(blk.heading)}</span>`;
          sub.addEventListener("click", () => {
            const blkEl = document.getElementById(sec.id + "-b" + j);
            if (blkEl) blkEl.scrollIntoView({ behavior: "smooth", block: "start" });
            if (window.innerWidth <= 720) sidebar.classList.remove("open");
          });
          children.appendChild(sub);
        });
        navList.appendChild(children);
      }
    });
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
    const blocks = sec.querySelectorAll(".block");
    const blk = (blockIdx != null && blocks[blockIdx]) ? blocks[blockIdx] : sec;
    blk.scrollIntoView({ behavior: "smooth", block: "start" });
    highlight(blk);
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

  /* ---------- 7. 渲染主内容 ---------- */
  function renderContent() {
    // Hero
    const hero = el("section", "hero");
    hero.innerHTML = `
      <div class="hero-tag"><span class="ping"></span>面向零基础小白的硬核科普</div>
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

      // 子章节
      sec.sections.forEach((blk, j) => {
        const block = el("div", "block fade-in");
        block.id = sec.id + "-b" + j;
        block.style.animationDelay = `${j * 60}ms`;
        const bh = el("div", "block-head");
        bh.innerHTML = `
          <span class="glyph" style="background:${sec.color}">${sec.icon}</span>
          <h3>${esc(blk.heading)}</h3>`;
        block.appendChild(bh);

        // 段落
        (blk.paragraphs || []).forEach((p) => {
          block.appendChild(el("p", "", p));
        });

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

        section.appendChild(block);
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

  /* ---------- 11. 思维导图抽屉（右侧边缘呼出） ---------- */
  function setupMindMap() {
    const PANEL_W = 360;

    const trigger = el("div", "mm-trigger");
    trigger.setAttribute("aria-label", "打开思维导图");
    trigger.innerHTML = `<span class="mm-hint">思维导图 · MIND MAP</span><span class="mm-rail"></span>`;

    const overlay = el("div", "mm-overlay");

    const panel = el("div", "mm-panel");
    panel.innerHTML = `
      <div class="mm-head">
        <span class="mm-head-title">Mind Map · 思维导图</span>
        <button class="mm-close" aria-label="关闭思维导图">✕</button>
      </div>
      <div class="mm-body"></div>`;

    document.body.appendChild(overlay);
    document.body.appendChild(trigger);
    document.body.appendChild(panel);

    const body = panel.querySelector(".mm-body");
    let open = false;
    let hideTimer = null;
    let lastMove = 0;

    const show = () => {
      clearTimeout(hideTimer);
      panel.classList.add("open");
      trigger.classList.add("active");
      if (window.innerWidth <= 720) overlay.classList.add("show");
      open = true;
    };
    const hide = () => {
      panel.classList.remove("open");
      trigger.classList.remove("active");
      overlay.classList.remove("show");
      open = false;
    };
    const toggle = () => (open ? hide() : show());

    renderMindMap(body, () => {
      // 跳转后，移动端自动收起面板以查看正文
      if (window.innerWidth <= 720) hide();
    });

    // 桌面：鼠标移入右侧边缘热区即触发
    trigger.addEventListener("mouseenter", () => show());
    // 移动端无 hover：点击热区切换
    trigger.addEventListener("click", (e) => {
      if (window.innerWidth <= 720) { e.stopPropagation(); toggle(); }
    });

    // 自动隐藏：显示后鼠标离开右侧区域则收起（带短延迟，防抖动）
    document.addEventListener("mousemove", (e) => {
      const now = performance.now();
      if (now - lastMove < 60) return;
      lastMove = now;
      if (!open) return;
      const keepZone = window.innerWidth - (PANEL_W + 40);
      if (e.clientX < keepZone) {
        clearTimeout(hideTimer);
        hideTimer = setTimeout(hide, 280);
      } else {
        clearTimeout(hideTimer);
      }
    });
    // 鼠标离开窗口
    document.addEventListener("mouseleave", () => {
      if (open) { clearTimeout(hideTimer); hideTimer = setTimeout(hide, 200); }
    });

    panel.querySelector(".mm-close").addEventListener("click", hide);
    overlay.addEventListener("click", hide);
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && open) hide();
    });

    // 窗口尺寸变化时重置移动端遮罩
    window.addEventListener("resize", () => {
      if (window.innerWidth > 720) overlay.classList.remove("show");
    });
  }

  function renderMindMap(host, onNavigate) {
    // 中心节点
    const root = el("div", "mm-root");
    root.innerHTML = `<div class="mm-root-node">AI 生图<br>知识图谱</div>`;
    host.appendChild(root);

    // 分支区
    const branches = el("div", "mm-branches");
    SECTIONS.forEach((sec) => {
      const branch = el("div", "mm-branch");
      branch.style.setProperty("--accent", sec.color);

      const hasChildren = (sec.sections || []).length > 0;
      const node = el("div", "mm-node");
      node.innerHTML = `
        <span class="mm-ic">${sec.icon}</span>
        <span class="mm-label">${esc(sec.title)}</span>
        <span class="mm-en">${esc(sec.en)}</span>
        <span class="mm-chevron${hasChildren ? "" : " no-children"}">▸</span>`;

      // 节点主体点击 → 跳转到对应 section
      node.addEventListener("click", () => {
        const target = document.getElementById(sec.id);
        if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
        if (onNavigate) onNavigate();
      });
      // chevron 单独点击 → 展开/收起子节点（阻止冒泡，避免同时触发跳转）
      const chev = node.querySelector(".mm-chevron");
      if (chev && hasChildren) {
        chev.addEventListener("click", (ev) => {
          ev.stopPropagation();
          branch.classList.toggle("expanded");
        });
      }

      // 二级叶子节点
      const leaves = el("div", "mm-leaves");
      (sec.sections || []).forEach((blk, j) => {
        const leaf = el("div", "mm-leaf");
        leaf.textContent = blk.heading;
        leaf.title = blk.heading;
        leaf.addEventListener("click", () => {
          const blkEl = document.getElementById(sec.id + "-b" + j);
          if (blkEl) blkEl.scrollIntoView({ behavior: "smooth", block: "start" });
          if (onNavigate) onNavigate();
        });
        leaves.appendChild(leaf);
      });
      branch.appendChild(node);
      branch.appendChild(leaves);
      branches.appendChild(branch);
    });
    host.appendChild(branches);
  }

  /* ---------- 启动 ---------- */
  function init() {
    renderNav();
    renderContent();
    setupScroll();
    setupReveal();
    setupToggle();
    setupMindMap();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
