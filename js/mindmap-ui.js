/* =====================================================================
 * 思维导图 UI · SVG 水平树渲染 + 右侧抽屉 + 拖拽左边缘展开
 * 数据：window.MINDMAP_DATA.root（源自 xmind-local MCP）
 * ===================================================================== */
(function () {
  "use strict";
  const DATA = window.MINDMAP_DATA;
  if (!DATA || !DATA.root) return;

  /* ---------- 样式映射（暗色背景友好） ---------- */
  const PRESET = {
    important: { fill: "rgba(255,184,0,0.16)", stroke: "#ffb800", text: "#ffd24d", branch: "#ffb800" },
    idea:      { fill: "rgba(124,92,255,0.16)", stroke: "#7c5cff", text: "#c3b5ff", branch: "#7c5cff" },
    info:      { fill: "rgba(59,130,246,0.16)", stroke: "#3b82f6", text: "#93c5fd", branch: "#3b82f6" },
    success:   { fill: "rgba(34,197,94,0.16)", stroke: "#22c55e", text: "#86efac", branch: "#22c55e" },
    warning:   { fill: "rgba(251,146,60,0.16)", stroke: "#fb923c", text: "#fdba74", branch: "#fb923c" },
    task:      { fill: "rgba(148,163,184,0.14)", stroke: "#94a3b8", text: "#cbd5e1", branch: "#94a3b8" },
    danger:    { fill: "rgba(248,113,113,0.16)", stroke: "#f87171", text: "#fca5a5", branch: "#f87171" },
    default:   { fill: "rgba(255,255,255,0.05)", stroke: "rgba(255,255,255,0.28)", text: "#c7cdd9", branch: "rgba(255,255,255,0.32)" }
  };
  const colorOf = (n) => PRESET[n.stylePreset] || PRESET.default;

  /* ---------- 节点 → 参考书锚点映射（未列出的节点继承父级 ref） ---------- */
  const REF_MAP = {
    "1. 入门基础":"basics","什么是AI生图":"basics-b0","发展简史":"basics-b1","2014 GAN诞生":"basics-b1","2020 DDPM奠基":"basics-b1","2021 DALL·E初代":"basics-b1","2022.08 SD开源引爆":"basics-b1","2023+ ControlNet/LoRA":"basics-b1","能做什么与不能做什么":"basics-b2","核心术语速览":"basics-b3","Prompt 提示词":"basics-b3","Seed 种子":"basics-b3","Steps 采样步数":"basics-b3","CFG 引导强度":"basics-b3","Denoising 图生图强度":"basics-b3",
    "2. 技术原理":"principles","神经网络":"principles-b0","权重":"principles-b0","偏置":"principles-b0","激活函数":"principles-b0","CNN卷积神经网络":"principles-b1","卷积核":"principles-b1","池化层":"principles-b1","特征图层级抽象":"principles-b1","RNN循环神经网络":"principles-b2","LSTM长短期记忆":"principles-b2","GRU":"principles-b2","长程依赖问题":"principles-b2","Transformer":"principles-b3","自注意力":"principles-b3","可并行训练":"principles-b3","ViT视觉Transformer":"principles-b3","GAN生成对抗网络":"principles-b4","生成器造假":"principles-b4","判别器辨真":"principles-b4","对抗博弈":"principles-b4","扩散模型":"principles-b5","前向加噪":"principles-b5","反向去噪":"principles-b5","潜扩散LDM":"principles-b5","VAE与潜空间":"principles-b6","编码器压缩":"principles-b6","解码器重建":"principles-b6","潜变量":"principles-b6","U-Net去噪核心":"principles-b7","U型结构":"principles-b7","跳跃连接":"principles-b7","预测噪声去噪":"principles-b7","CLIP让AI听懂文字":"principles-b8","图文对比学习":"principles-b8","文本编码器":"principles-b8","提示词工程本质":"principles-b8","NLP自然语言处理":"principles-b9","分词Tokenize":"principles-b9","文本编码上限":"principles-b9","注入生成网络":"principles-b9",
    "3. 主流模型":"models","Stable Diffusion":"models-b0","开源潜扩散":"models-b0","1.4/1.5经典":"models-b0","SDXL 1024分辨率":"models-b0","SD3/3.5":"models-b0","DALL·E系列":"models-b1","DALL·E 3":"models-b1","特点":"models-b1","闭源付费":"models-b1","Midjourney":"models-b2","艺术质感":"models-b2","Discord/网页付费":"models-b2","定位":"models-b2","NovelAI":"models-b3","二次元付费平台":"models-b3","角色标签":"models-b3","衍生分支":"models-b3","Banana AI":"models-b4","算力部署平台":"models-b4","概念辨析":"faq-b3","同类Replicate/RunPod":"models-b4","Flux新标杆":"models-b5","Black Forest Labs":"models-b5","文本理解与质量极强":"models-b5","半开源":"models-b5","国产模型":"models-b5","文心一格":"models-b5","通义万相":"models-b5","即梦":"models-b5","腾讯混元":"models-b5",
    "4. 整合方案与工具":"tools","AUTOMATIC1111 WebUI":"tools-b0","表单式界面":"tools-b0","必装插件":"tools-b0","新手到进阶首选":"tools-b0","ComfyUI":"tools-b1","节点式工作流":"tools-b1","优势":"tools-b1","SD3/Flux支持好":"tools-b1","民间整合包":"tools-b2","开箱即用":"tools-b2","含模型/插件/依赖":"tools-b2","代价":"tools-b2","云端平台":"tools-b3","AutoDL国内延迟低":"tools-b3","RunPod按量租GPU":"tools-b3","Colab免费试用":"tools-b3","Banana部署":"tools-b3",
    "5. 微调与扩展":"fine-tuning","LoRA":"fine-tuning-b0","低秩适配":"fine-tuning-b0","小巧灵活":"fine-tuning-b0","角色/画风/物件主流":"fine-tuning-b0","DreamBooth":"fine-tuning-b1","深度记忆":"fine-tuning-b1","Textual Inversion":"fine-tuning-b1","词向量":"fine-tuning-b1","极小但弱":"fine-tuning-b1","ControlNet":"fine-tuning-b2","线稿Canny":"fine-tuning-b2","姿态OpenPose":"fine-tuning-b2","深度Depth":"fine-tuning-b2","革命性可控":"fine-tuning-b2","提示词工程":"fine-tuning-b3","提示词结构":"fine-tuning-b3","反向提示词兜底":"fine-tuning-b3","英文/Danbooru标签":"fine-tuning-b3","放大与高清修复":"fine-tuning-b4","Hires.fix":"fine-tuning-b4","ADetailer修脸":"fine-tuning-b4","放大模型":"fine-tuning-b4",
    "6. 社区与生态":"community","Civitai":"community-b0","模型/LoRA分享":"community-b0","示例图墙可复现":"community-b0","全球最大SD社区":"community-b0","Hugging Face":"community-b1","模型托管平台":"community-b1","Spaces在线体验":"community-b1","官方权重下载":"community-b1","国内社区":"community-b2","Liblib哩布哩布":"community-b2","魔搭ModelScope":"community-b2","B站":"community-b2","生态分层全景":"community-b3","底层算法":"community-b3","基础模型":"community-b3","微调生态":"community-b3","工具链":"community-b3","算力/社区/应用层":"community-b3",
    "7. 对比速查":"compare","模型横向对比":"compare-b0","工具链对比":"compare-b1","微调方法对比":"compare-b2",
    "8. 学习路径":"learning","阶段一入门体验":"learning-b0","在线工具出50+图":"learning-b0","理解Prompt/Seed/Steps/CFG":"learning-b0","阶段二本地化":"learning-b1","下秋叶整合包":"learning-b1","掌握WebUI/LoRA/图生图":"learning-b1","装ADetailer/ControlNet":"learning-b1","阶段三可控生成":"learning-b2","OpenPose控制姿态":"learning-b2","ComfyUI工作流":"learning-b2","训练自己的LoRA":"learning-b2","阶段四进阶创作":"learning-b3","Flux/SD3新模型":"learning-b3","IP-Adapter/AnimateDiff":"learning-b3","Banana部署为API":"learning-b3",
    "9. 术语表":"glossary","基础类":"glossary-b0","原理类":"glossary-b0","模型类":"glossary-b0","微调类":"glossary-b0","工具类":"glossary-b0","社区/资源类":"glossary-b0",
    "10. 常见问题":"faq","硬件与配置":"faq-b0","模型与使用":"faq-b1","版权与商用":"faq-b2",
    "11. 官方资源":"resources","基础模型官网":"resources-b0","工具与界面":"resources-b0","微调技术":"resources-b0","社区平台":"resources-b0","算力部署":"resources-b0","学习论文":"resources-b0"
  };

  /* ---------- 1. 水平树布局 ---------- */
  const ROOT_H = 42, L1_H = 28, LEAF_H = 22, GAP = 7, LEVEL_W = 200;
  const fSize = (d) => (d === 0 ? 16 : d === 1 ? 13 : 11.5);

  function calcSpan(node, depth) {
    node._d = depth;
    node._h = depth === 0 ? ROOT_H : depth === 1 ? L1_H : LEAF_H;
    const fs = fSize(depth);
    node._w = Math.max(depth === 0 ? 180 : depth === 1 ? 120 : 96, node.title.length * fs * 0.62 + 24);
    const ch = node.children || [];
    if (!ch.length) { node._span = node._h + 4; return; }
    ch.forEach((c) => calcSpan(c, depth + 1));
    let s = 0;
    ch.forEach((c, i) => { s += c._span + (i < ch.length - 1 ? GAP : 0); });
    node._span = Math.max(node._h + 4, s);
  }
  function assignY(node, y0) {
    const ch = node.children || [];
    if (!ch.length) { node._y = y0 + node._span / 2; return; }
    let cy = y0;
    ch.forEach((c) => { assignY(c, cy); cy += c._span + GAP; });
    node._y = (ch[0]._y + ch[ch.length - 1]._y) / 2;
  }
  function assignX(node, x0) {
    node._x = x0;
    (node.children || []).forEach((c) => assignX(c, x0 + node._w + LEVEL_W));
  }
  function bounds(node, b) {
    b.maxX = Math.max(b.maxX, node._x + node._w);
    b.maxY = Math.max(b.maxY, node._y + node._h / 2);
    b.minY = Math.min(b.minY, node._y - node._h / 2);
    (node.children || []).forEach((c) => bounds(c, b));
  }

  /* ---------- 2. SVG 生成 ---------- */
  let nodeCount = 0;
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c])); }

  function link(p, c) {
    const x1 = p._x + p._w, y1 = p._y, x2 = c._x, y2 = c._y;
    const mx = (x1 + x2) / 2;
    return `<path d="M${x1},${y1} C${mx},${y1} ${mx},${y2} ${x2},${y2}" fill="none" stroke="${colorOf(p).branch}" stroke-width="${p._d === 0 ? 2.2 : 1.6}" opacity="0.7"/>`;
  }
  function node(n, ref) {
    nodeCount++;
    const x = n._x, y = n._y - n._h / 2, w = n._w, h = n._h;
    const c = colorOf(n);
    const fs = fSize(n._d);
    const isRoot = n._d === 0;
    const isL1 = n._d === 1;
    const fill = isRoot ? "url(#mmGrad)" : c.fill;
    const stroke = isRoot ? "#00ffc8" : c.stroke;
    const txt = isRoot ? "#06121a" : (isL1 ? "#fff" : c.text);
    const sw = isRoot ? 0 : (isL1 ? 1.5 : 1);
    const bold = isRoot || isL1 ? "bold" : "normal";
    const rx = isRoot ? 21 : 6;
    const attrs = ` class="mm2-ng" data-ref="${esc(ref || "")}" data-note="${esc(n.note || "")}" data-label="${esc(n.title)}"`;
    return `<g${attrs}><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}"/>` +
      `<text x="${x + w / 2}" y="${y + h / 2}" font-family="Manrope, Noto Sans SC, sans-serif" font-size="${fs}" font-weight="${bold}" fill="${txt}" text-anchor="middle" dominant-baseline="central">${esc(n.title)}</text></g>`;
  }
  function walkLinks(n, out) {
    (n.children || []).forEach((c) => { out.push(link(n, c)); walkLinks(c, out); });
  }
  function walkNodes(n, out, pRef) {
    const ref = REF_MAP[n.title] || pRef || "";
    out.push(node(n, ref));
    (n.children || []).forEach((c) => walkNodes(c, out, ref));
  }

  function buildSVG() {
    const root = DATA.root;
    calcSpan(root, 0);
    assignY(root, 0);
    assignX(root, 0);
    const b = { minX: 0, maxX: 0, minY: root._y, maxY: root._y };
    b.maxX = root._x + root._w;
    bounds(root, b);
    const W = b.maxX + 30, H = (b.maxY - b.minY) + 30, Y0 = -b.minY + 15;

    // 重新偏移 y（让最小 y 为 15）
    (function shift(n) { n._y += Y0; (n.children || []).forEach(shift); })(root);

    const links = [], nodes = [];
    walkLinks(root, links);
    walkNodes(root, nodes);

    return { svg: `<svg viewBox="0 0 ${W} ${H}" width="100%" height="100%" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">` +
      `<defs><linearGradient id="mmGrad" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#00ffc8"/><stop offset="1" stop-color="#ff2e88"/></linearGradient></defs>` +
      links.join("") + nodes.join("") + `</svg>`, w: W, h: H };
  }

  /* ---------- 3. 抽屉与拖拽交互 ---------- */
  function init() {
    const { svg, w: VW, h: VH } = buildSVG();

    const trigger = document.createElement("div");
    trigger.className = "mm2-trigger";
    trigger.setAttribute("aria-label", "打开思维导图");
    trigger.innerHTML = `<span class="mm2-hint">思维导图 · MIND MAP</span><span class="mm2-rail"></span>`;

    const overlay = document.createElement("div");
    overlay.className = "mm2-overlay";

    const panel = document.createElement("div");
    panel.className = "mm2-panel";
    panel.innerHTML = `
      <div class="mm2-handle" role="separator" aria-orientation="vertical" title="向左拖动展开"></div>
      <div class="mm2-head">
        <span class="mm2-title">Mind Map · 思维导图</span>
        <span class="mm2-sub">${nodeCount} 节点 · 拖动左边缘展开</span>
        <button class="mm2-close" aria-label="关闭">✕</button>
      </div>
      <div class="mm2-stage">
        ${svg}
        <div class="mm2-zoom">
          <button type="button" data-zoom="in" title="放大" aria-label="放大">＋</button>
          <button type="button" data-zoom="out" title="缩小" aria-label="缩小">－</button>
          <button type="button" data-zoom="reset" title="复位" aria-label="复位">⤢</button>
        </div>
        <div class="mm2-zoom-hint">滚轮缩放 · 拖拽平移 · 双击复位</div>
      </div>`;

    document.body.appendChild(overlay);
    document.body.appendChild(trigger);
    document.body.appendChild(panel);

    const minW = () => Math.round(window.innerWidth * (window.innerWidth <= 720 ? 0.62 : 0.33));
    const maxW = () => Math.round(window.innerWidth * 0.92);
    let open = false, lastW = minW(), hideTimer = null;

    const show = () => {
      clearTimeout(hideTimer);
      panel.style.setProperty("--w", lastW + "px");
      panel.classList.add("show");
      trigger.classList.add("active");
      if (window.innerWidth <= 720) overlay.classList.add("show");
      open = true;
    };
    const hide = () => {
      panel.classList.remove("show");
      trigger.classList.remove("active");
      overlay.classList.remove("show");
      open = false;
    };
    const toggle = () => (open ? hide() : show());

    // 右侧边缘热区触发
    trigger.addEventListener("mouseenter", show);
    trigger.addEventListener("click", (e) => {
      if (window.innerWidth <= 720) { e.stopPropagation(); toggle(); }
    });

    // 显示后鼠标离开右侧区域自动收起
    document.addEventListener("mousemove", (e) => {
      if (!open) return;
      const keepZone = window.innerWidth - (panel.offsetWidth + 40);
      if (e.clientX < keepZone) { clearTimeout(hideTimer); hideTimer = setTimeout(hide, 320); }
      else clearTimeout(hideTimer);
    });
    document.addEventListener("mouseleave", () => { if (open) { clearTimeout(hideTimer); hideTimer = setTimeout(hide, 240); } });

    panel.querySelector(".mm2-close").addEventListener("click", hide);
    overlay.addEventListener("click", hide);
    document.addEventListener("keydown", (e) => { if (e.key === "Escape" && open) hide(); });

    // 拖拽左边缘竖线展开/收起
    const handle = panel.querySelector(".mm2-handle");
    let dragging = false;
    const startDrag = (clientX) => {
      dragging = true;
      panel.classList.add("dragging");
    };
    const moveDrag = (clientX) => {
      if (!dragging) return;
      let w = window.innerWidth - clientX;
      w = Math.max(minW(), Math.min(maxW(), w));
      panel.style.setProperty("--w", w + "px");
      lastW = w;
    };
    const endDrag = () => { if (!dragging) return; dragging = false; panel.classList.remove("dragging"); };

    handle.addEventListener("mousedown", (e) => { startDrag(e.clientX); e.preventDefault(); });
    document.addEventListener("mousemove", (e) => moveDrag(e.clientX));
    document.addEventListener("mouseup", endDrag);

    handle.addEventListener("touchstart", (e) => { if (e.touches[0]) { startDrag(e.touches[0].clientX); } }, { passive: true });
    document.addEventListener("touchmove", (e) => { if (e.touches[0]) moveDrag(e.touches[0].clientX); }, { passive: true });
    document.addEventListener("touchend", endDrag);

    /* ---------- 缩放与平移（放大后查看细节） ---------- */
    const stage = panel.querySelector(".mm2-stage");
    const svgEl = panel.querySelector("svg");
    if (!stage || !svgEl) return; // 防御：DOM 结构异常时不注册缩放交互
    let view = { x: 0, y: 0, w: VW, h: VH };
    const setView = () => svgEl.setAttribute("viewBox", `${view.x} ${view.y} ${view.w} ${view.h}`);
    const clampView = () => {
      view.w = Math.max(VW / 8, Math.min(VW, view.w));
      view.h = view.w * VH / VW;
      view.x = Math.max(-(view.w * 0.5), Math.min(VW - view.w * 0.5, view.x));
      view.y = Math.max(-(view.h * 0.5), Math.min(VH - view.h * 0.5, view.y));
    };
    const clientToSvg = (cx, cy) => {
      const r = svgEl.getBoundingClientRect();
      const s = r.width / view.w;
      return { x: (cx - r.left) / s + view.x, y: (cy - r.top) / s + view.y };
    };
    const zoomAt = (factor, ax, ay) => {
      const nw = view.w / factor, nh = nw * VH / VW;
      const fx = (ax - view.x) / view.w, fy = (ay - view.y) / view.h;
      view.w = nw; view.h = nh;
      view.x = ax - fx * nw; view.y = ay - fy * nh;
      clampView(); setView();
    };
    const zoomCenter = (f) => zoomAt(f, view.x + view.w / 2, view.y + view.h / 2);
    setView();

    // 滚轮缩放（以鼠标位置为锚点，矢量缩放保持清晰）
    stage.addEventListener("wheel", (e) => {
      e.preventDefault();
      const p = clientToSvg(e.clientX, e.clientY);
      zoomAt(e.deltaY < 0 ? 1.18 : 1 / 1.18, p.x, p.y);
    }, { passive: false });

    // 鼠标拖拽平移（不与 handle 展开拖拽冲突：handle 在 stage 之外）
    let panning = false, panStart = null, panMoved = 0;
    stage.addEventListener("mousedown", (e) => {
      if (e.target.closest("button") || e.target.closest(".mm2-zoom")) return;
      panning = true; stage.classList.add("panning"); panMoved = 0;
      panStart = { x: e.clientX, y: e.clientY, vx: view.x, vy: view.y };
      e.preventDefault();
    });
    document.addEventListener("mousemove", (e) => {
      if (!panning) return;
      const r = svgEl.getBoundingClientRect(), s = r.width / view.w;
      panMoved = Math.max(panMoved, Math.hypot(e.clientX - panStart.x, e.clientY - panStart.y));
      view.x = panStart.vx - (e.clientX - panStart.x) / s;
      view.y = panStart.vy - (e.clientY - panStart.y) / s;
      clampView(); setView();
    });
    document.addEventListener("mouseup", () => { if (panning) { panning = false; stage.classList.remove("panning"); } });

    // 触屏：单指平移 / 双指捏合缩放
    let touchPan = null, touchPinch = null;
    stage.addEventListener("touchstart", (e) => {
      if (e.target.closest("button") || e.target.closest(".mm2-zoom")) return;
      if (e.touches.length === 1) {
        touchPan = { x: e.touches[0].clientX, y: e.touches[0].clientY, vx: view.x, vy: view.y };
      } else if (e.touches.length === 2) {
        const dx = e.touches[0].clientX - e.touches[1].clientX, dy = e.touches[0].clientY - e.touches[1].clientY;
        touchPinch = { d: Math.hypot(dx, dy), w: view.w }; touchPan = null;
      }
    }, { passive: true });
    stage.addEventListener("touchmove", (e) => {
      if (touchPan && e.touches.length === 1) {
        const r = svgEl.getBoundingClientRect(), s = r.width / view.w;
        view.x = touchPan.vx - (e.touches[0].clientX - touchPan.x) / s;
        view.y = touchPan.vy - (e.touches[0].clientY - touchPan.y) / s;
        clampView(); setView();
      } else if (touchPinch && e.touches.length === 2) {
        const dx = e.touches[0].clientX - e.touches[1].clientX, dy = e.touches[0].clientY - e.touches[1].clientY;
        view.w = Math.max(VW / 8, Math.min(VW, touchPinch.w / (Math.hypot(dx, dy) / touchPinch.d)));
        view.h = view.w * VH / VW; clampView(); setView();
        e.preventDefault();
      }
    }, { passive: false });
    stage.addEventListener("touchend", () => { touchPan = null; touchPinch = null; });

    // 双击复位
    stage.addEventListener("dblclick", () => { view = { x: 0, y: 0, w: VW, h: VH }; setView(); });

    // 缩放按钮
    panel.querySelectorAll(".mm2-zoom [data-zoom]").forEach((b) => {
      b.addEventListener("click", (e) => {
        e.stopPropagation();
        const z = b.dataset.zoom;
        if (z === "in") zoomCenter(1.35);
        else if (z === "out") zoomCenter(1 / 1.35);
        else { view = { x: 0, y: 0, w: VW, h: VH }; setView(); }
      });
    });

    /* ---------- 节点悬浮提示与点击跳转参考书 ---------- */
    const tip2 = document.createElement("div");
    tip2.className = "mm2-tip";
    document.body.appendChild(tip2);
    let tipCur = null;
    svgEl.addEventListener("mousemove", (e) => {
      if (panning) { tip2.classList.remove("show"); return; }
      const g = e.target.closest ? e.target.closest(".mm2-ng") : null;
      if (g && g.dataset.note) {
        if (tipCur !== g) {
          tipCur = g;
          tip2.innerHTML = `<div class="tt-name">${g.dataset.label}</div><div class="tt-blurb">${g.dataset.note}</div><div class="tt-cta">点击跳转参考书对应章节 →</div>`;
        }
        tip2.classList.add("show");
        let x = e.clientX + 14, y = e.clientY + 14;
        if (x + tip2.offsetWidth > window.innerWidth - 8) x = e.clientX - tip2.offsetWidth - 14;
        if (y + tip2.offsetHeight > window.innerHeight - 8) y = e.clientY - tip2.offsetHeight - 14;
        tip2.style.left = x + "px"; tip2.style.top = y + "px";
      } else { tip2.classList.remove("show"); tipCur = null; }
    });
    svgEl.addEventListener("mouseleave", () => { tip2.classList.remove("show"); tipCur = null; });
    svgEl.addEventListener("click", (e) => {
      if (panMoved > 6) return; // 拖拽平移不触发跳转
      const g = e.target.closest ? e.target.closest(".mm2-ng") : null;
      if (!g || !g.dataset.ref) return;
      const target = document.getElementById(g.dataset.ref);
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
        if (window.KB_NAV && window.KB_NAV.highlight) window.KB_NAV.highlight(target);
      }
      hide();
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 720) overlay.classList.remove("show");
      lastW = Math.max(minW(), Math.min(maxW(), lastW));
      if (open) panel.style.setProperty("--w", lastW + "px");
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
