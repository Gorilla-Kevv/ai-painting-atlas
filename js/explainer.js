/* =====================================================================
 * 选中文本智能解释 · 磨砂玻璃悬浮窗
 * 复用站内 GLOSSARY + SECTIONS 构建知识库，纯前端运行（可发布静态站）
 * ===================================================================== */
(function () {
  "use strict";
  if (!window.KNOWLEDGE_DATA) return;
  const { GLOSSARY, SECTIONS } = window.KNOWLEDGE_DATA;

  /* ---------- 1. 扩展释义库（补充站内高频词） ---------- */
  const EXTRA = [
    { term: "噪声", en: "Noise", cat: "原理", desc: "扩散模型中的随机扰动。生成时从纯噪声出发逐步去噪还原成图像；前向过程则是把清晰图逐步加噪。噪声是生成的『原料』。" },
    { term: "去噪", en: "Denoise", cat: "原理", desc: "扩散模型的核心动作——神经网络预测并减去噪声，一步步把随机噪声还原成符合提示词的图像。采样步数即去噪迭代次数。" },
    { term: "采样", en: "Sampling", cat: "原理", desc: "在扩散模型中，从随机噪声出发、按某种算法一步步去噪生成图像的过程。不同采样器（Sampler）是不同的去噪算法。" },
    { term: "潜变量", en: "Latent", cat: "原理", desc: "图像被 VAE 压缩到潜空间后的低维表示。扩散模型在潜变量上做去噪，最后由 VAE 解码回像素图。" },
    { term: "分词", en: "Tokenize", cat: "原理", desc: "把提示词切分成模型能处理的最小单元（token）的过程。CLIP/T5 等文本编码器的输入就是 token 序列。" },
    { term: "Token", en: "Token", cat: "原理", desc: "模型处理文本的最小单元，约等于一个词或字。CLIP 文本编码器上限约 75 个 token，超出会被截断。" },
    { term: "显存", en: "VRAM", cat: "基础", desc: "显卡的内存，决定能跑多大的模型与多大分辨率。SD1.5 约 4–6GB 可跑，SDXL 需 8GB+，Flux/SD3 建议 16–24GB。" },
    { term: "权重", en: "Weights", cat: "原理", desc: "神经网络中节点间连接的强度参数。训练就是不断调整权重；模型文件保存的就是权重。" },
    { term: "训练", en: "Training", cat: "原理", desc: "用数据让模型学习调整权重的过程。AI 生图的微调（LoRA/DreamBooth）都是训练的子集。" },
    { term: "推理", en: "Inference", cat: "原理", desc: "训练完成后，用模型生成输出的过程。你用 SD 出图就是推理，不修改权重。" },
    { term: "过拟合", en: "Overfitting", cat: "原理", desc: "模型把训练样本背得太死，对新输入泛化差。DreamBooth 训练过多易过拟合，表现为只会画训练图、出不了新变化。" },
    { term: "风格迁移", en: "Style Transfer", cat: "应用", desc: "把一张图的风格应用到另一张图的内容上。可通过图生图、LoRA、IP-Adapter 等方式实现。" },
    { term: "蒙版", en: "Mask", cat: "基础", desc: "指定图像中哪些区域需要被重绘/保护。局部重绘（Inpaint）就是『只改蒙版内、保住蒙版外』。" },
    { term: "局部重绘", en: "Inpaint", cat: "基础", desc: "只重绘图像指定区域、保留其他部分的操作。常用于修脸、换背景、加物件，配合蒙版使用。" },
    { term: "放大", en: "Upscale", cat: "基础", desc: "把低分辨率图扩大到高分辨率并补细节。可用 Hires.fix、Tiled VAE、专用放大模型（ESRGAN 等）。" },
    { term: "反向提示词", en: "Negative Prompt", cat: "基础", desc: "告诉模型『不要什么』，如 worst quality、bad anatomy。能显著降低崩坏率，几乎必填。" },
    { term: "触发词", en: "Trigger Word", cat: "微调", desc: "LoRA/DreamBooth 训练时绑定的关键词，使用时写进提示词即可激活该 LoRA 的风格/角色。" },
    { term: "模型融合", en: "Merge", cat: "微调", desc: "把多个模型按比例混合成一个新模型的技术，可融合不同画风。常见工具有 SuperMerger 等。" },
    { term: "调度器", en: "Scheduler", cat: "基础", desc: "控制每一步去噪强度的策略，如 Karras、Exponential。和采样器配合影响收敛与质感。" },
    { term: "梯度", en: "Gradient", cat: "原理", desc: "损失对权重的导数，指示权重该往哪个方向调整。反向传播就是用梯度更新权重。" },
    { term: "损失", en: "Loss", cat: "原理", desc: "模型预测与真实答案的差距度量。训练目标就是不断降低损失。" },
    { term: "反向传播", en: "Backpropagation", cat: "原理", desc: "从输出向输入逐层计算梯度的高效算法，是训练神经网络的基础。" },
    { term: "张量", en: "Tensor", cat: "原理", desc: "多维数组的统称，是深度学习的数据载体。图像、权重、潜变量都是张量。" },
    { term: "嵌入向量", en: "Embedding", cat: "原理", desc: "把概念映射成的一串数字向量。Textual Inversion 学的就是新词的嵌入向量。" },
    { term: "多模态", en: "Multimodal", cat: "原理", desc: "能同时处理多种模态（文本+图像+音频等）的模型。CLIP、SD3、Flux 都属多模态范畴。" },
    { term: "量化", en: "Quantization", cat: "原理", desc: "降低模型权重精度（如 FP16→INT8）以减小体积、加速推理的技术，常用于在低显存设备跑大模型。" },
    { term: "提示词权重", en: "Prompt Weighting", cat: "基础", desc: "用 (word:1.3) 等语法调节某词强度。>1 增强、<1 减弱。WebUI 用 ()，ComfyUI 用语法不同。" },
    { term: "画风", en: "Art Style", cat: "应用", desc: "图像的整体视觉风格，如写实、二次元、油画、水彩。由基础模型 + LoRA + 提示词共同决定。" },
    { term: "二次元", en: "Anime", cat: "应用", desc: "日式动漫风格。NovelAI、AnythingV3 等模型擅长；Civitai 上有海量二次元 LoRA 与模型。" },
    { term: "写实", en: "Realistic", cat: "应用", desc: "追求照片级真实的风格。Realistic Vision、ChilloutMix 等模型为代表，对皮肤/光影细节要求高。" },
    { term: "概念图", en: "Concept Art", cat: "应用", desc: "影视游戏前期的设计稿，AI 生图在该领域应用广泛，Midjourney、SD 都很擅长。" },
    { term: "IP-Adapter", en: "IP-Adapter", cat: "微调", desc: "用一张参考图的风格/角色来引导生成的扩展，可理解为『图当提示词』，比 LoRA 更灵活即时。" },
    { term: "AnimateDiff", en: "AnimateDiff", cat: "扩展", desc: "把 SD 图像模型扩展到视频的模块，可生成数秒动画，是 AI 生图走向生视频的桥梁。" },
  ];

  const KB = GLOSSARY.concat(EXTRA);

  /* ---------- 2. 站内章节索引 ---------- */
  const SITE_INDEX = SECTIONS.map((s) => ({
    id: s.id, title: s.title, en: s.en, summary: s.summary,
    blocks: (s.sections || []).map((b) => b.heading),
  }));

  const norm = (s) => String(s == null ? "" : s).trim().toLowerCase().replace(/\s+/g, " ");
  const has = (hay, needle) => needle && hay.includes(needle);

  /* 站内全文检索：返回最多 3 条最相关章节 */
  function searchSite(q) {
    const scored = SITE_INDEX.map((s) => {
      let score = 0;
      if (has(norm(s.title), q)) score += 5;
      if (has(norm(s.summary), q)) score += 3;
      if (s.blocks.some((b) => has(norm(b), q))) score += 2;
      return { s, score };
    }).filter((x) => x.score > 0).sort((a, b) => b.score - a.score).slice(0, 3);
    return scored.map((x) => ({ id: x.s.id, title: x.s.title, en: x.s.en }));
  }

  /* 查章节里最相关 block（返回首个含 q 的 block 索引） */
  function findBlock(secId, q) {
    const s = SITE_INDEX.find((x) => x.id === secId);
    if (!s) return -1;
    return s.blocks.findIndex((b) => has(norm(b), q));
  }

  /* ---------- 3. 核心匹配 ---------- */
  function explain(raw) {
    const q = norm(raw);
    if (!q || q.length < 2) return null;

    // 1) 精确匹配 term / en / en 缩写
    let hit = KB.find((g) => {
      const t = norm(g.term), e = norm(g.en);
      return t === q || e === q || e.split(/[\s\/]+/).includes(q);
    });
    if (!hit) {
      // 2) 包含匹配（选中词含某术语，或某术语含选中词）
      hit = KB.find((g) => {
        const t = norm(g.term), e = norm(g.en);
        return (t && (t.includes(q) || q.includes(t))) || (e && (e.includes(q) || q.includes(e)));
      });
    }
    const related = searchSite(q);
    if (hit) return { type: "term", data: hit, related };

    // 3) 站内章节标题/摘要命中
    const sec = SITE_INDEX.find((s) => has(norm(s.title), q) || has(norm(s.summary), q));
    if (sec) return { type: "section", data: sec, related: [{ id: sec.id, title: sec.title, en: sec.en }] };

    // 4) 兜底：站内相关检索
    if (related.length) return { type: "fallback", word: raw, related };
    return { type: "none", word: raw, related: [] };
  }

  /* 查双向映射：选中词是否对应官方资源条目 */
  function findMap(q) {
    const RM = (window.KNOWLEDGE_DATA && window.KNOWLEDGE_DATA.RESOURCE_MAP) || [];
    return RM.find((m) => m.names.some((n) => norm(n) === q)) ||
           RM.find((m) => m.names.some((n) => norm(n).includes(q) || q.includes(norm(n))));
  }

  /* ---------- 4. 悬浮窗 ---------- */
  let pop = null;

  function ensurePop() {
    if (pop) return pop;
    pop = document.createElement("div");
    pop.className = "explainer-pop";
    pop.setAttribute("role", "dialog");
    document.body.appendChild(pop);
    return pop;
  }

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"]/g, (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  }

  function renderCard(res) {
    let html = "";
    if (res.type === "term") {
      const d = res.data;
      html = `
        <div class="ex-head">
          <span class="ex-term">${esc(d.term)}</span>
          <span class="ex-en">${esc(d.en)}</span>
        </div>
        <span class="ex-cat">${esc(d.cat)}</span>
        <div class="ex-desc">${esc(d.desc)}</div>`;
    } else if (res.type === "section") {
      const d = res.data;
      html = `
        <div class="ex-tag">★ 站内章节</div>
        <div class="ex-term" style="margin:6px 0 4px">${esc(d.title)} <span class="ex-en">${esc(d.en)}</span></div>
        <div class="ex-desc">${esc(d.summary)}</div>`;
    } else if (res.type === "fallback") {
      html = `
        <div class="ex-tag">✦ 站内检索</div>
        <div class="ex-desc" style="margin:6px 0 2px"><b>「${esc(res.word)}」</b>暂无专属释义，但站内有相关内容可深入阅读：</div>`;
    } else {
      html = `
        <div class="ex-tag">○ 未收录</div>
        <div class="ex-desc" style="margin:6px 0 2px"><b>「${esc(res.word)}」</b>未在本知识库中找到释义。试试选中更具体的术语，如 LoRA、扩散模型、ControlNet。</div>`;
    }

    if (res.related && res.related.length) {
      html += `<div class="ex-related-label">相关阅读</div><div class="ex-related">`;
      res.related.forEach((r) => {
        html += `<a class="ex-link" data-id="${esc(r.id)}">${esc(r.title)}</a>`;
      });
      html += `</div>`;
    }
    if (res.mapMatch) {
      html += `<button class="ex-jump" type="button" data-cat="${esc(res.mapMatch.resCat)}" data-name="${esc(res.mapMatch.resName)}">查看官方资源 · ${esc(res.mapMatch.resName)} →</button>`;
    }
    return html;
  }

  function showAt(rect, res) {
    const p = ensurePop();
    p.innerHTML = renderCard(res);
    p.classList.add("show");
    // 测量
    const pw = p.offsetWidth;
    const ph = p.offsetHeight;
    let x = rect.left + rect.width / 2 - pw / 2;
    let y = rect.top - ph - 12; // 优先在选区上方
    if (y < 8) y = rect.bottom + 12; // 上方不够则放下方
    x = Math.max(8, Math.min(x, window.innerWidth - pw - 8));
    p.style.left = x + "px";
    p.style.top = y + "px";
  }

  function hide() {
    if (pop) pop.classList.remove("show");
  }

  /* 跳转到章节/子章节 */
  function navigate(secId, word) {
    const sec = document.getElementById(secId);
    if (!sec) return;
    const bi = findBlock(secId, norm(word));
    if (bi >= 0) {
      const blocks = sec.querySelectorAll(".block");
      const blk = blocks[bi];
      if (blk) { blk.scrollIntoView({ behavior: "smooth", block: "start" }); hide(); return; }
    }
    sec.scrollIntoView({ behavior: "smooth", block: "start" });
    hide();
  }

  /* ---------- 5. 监听选区 ---------- */
  function onSelect() {
    setTimeout(() => {
      const sel = window.getSelection ? window.getSelection() : null;
      const text = sel ? sel.toString().trim() : "";
      if (!text || text.length < 2 || text.length > 60) { hide(); return; }
      if (pop && sel && pop.contains(sel.anchorNode)) return; // 在悬浮窗内选择不重弹
      const res = explain(text);
      if (!res) { hide(); return; }
      res.mapMatch = findMap(norm(text));
      let rect = null;
      try { rect = sel.getRangeAt(0).getBoundingClientRect(); } catch (e) { rect = null; }
      if (!rect || (rect.width === 0 && rect.height === 0)) { hide(); return; }
      showAt(rect, res);
    }, 60);
  }

  document.addEventListener("mouseup", onSelect);
  document.addEventListener("touchend", onSelect);

  /* 点击悬浮窗内按钮/链接跳转 */
  document.addEventListener("click", (e) => {
    // 跳转到官方资源条目
    const jump = e.target.closest(".ex-jump");
    if (jump && pop && pop.contains(jump)) {
      e.preventDefault();
      const nav = window.KB_NAV;
      if (nav && nav.scrollToResource) nav.scrollToResource(jump.dataset.cat, jump.dataset.name);
      hide();
      return;
    }
    // 跳转到站内章节
    const link = e.target.closest(".ex-link");
    if (!link || !pop || !pop.contains(link)) return;
    e.preventDefault();
    const word = (window.getSelection ? window.getSelection().toString() : "") || link.textContent;
    navigate(link.dataset.id, word.trim() || link.textContent);
  });

  /* 点击空白处关闭（未选中文本时） */
  document.addEventListener("mousedown", (e) => {
    if (!pop || !pop.classList.contains("show")) return;
    if (pop.contains(e.target)) return;
    setTimeout(() => {
      const sel = window.getSelection ? window.getSelection().toString() : "";
      if (!sel) hide();
    }, 10);
  });

  /* 滚动/缩放时隐藏，避免错位 */
  window.addEventListener("scroll", hide, { passive: true, capture: true });
  window.addEventListener("resize", hide);
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") hide(); });
})();
