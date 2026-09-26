/* =====================================================================
 * SVG 动画讲解库 · 参考书技术原理
 * 每项：svg（SMIL 动画演示）+ formula（数学公式 HTML）+ plain（通俗解释）
 * 配色统一蓝青系，适配暗色背景
 * ===================================================================== */
window.SVG_ANIMS = {

  /* ---------- 神经元 ---------- */
  neuron: {
    formula: 'y = σ( w₁x₁ + w₂x₂ + w₃x₃ + b )&nbsp;&nbsp;<span class="f-note">σ：激活函数（如 ReLU/sigmoid）</span>',
    plain: "把神经元想成一个『加权投票器』：三个输入各自乘上自己话语权的大小（权重），加起来再加上一个基础分（偏置 b），最后过一道『闸门』σ 决定输出多强。训练就是不断调整权重和偏置，让输出越来越接近正确答案。",
    svg: `<svg viewBox="0 0 440 190" xmlns="http://www.w3.org/2000/svg">
      <g stroke="#38bdf8" stroke-width="1.4" opacity="0.55">
        <line x1="72" y1="42" x2="228" y2="92"/><line x1="72" y1="92" x2="228" y2="92"/><line x1="72" y1="142" x2="228" y2="92"/>
        <line x1="266" y1="92" x2="352" y2="92" stroke-dasharray="4 3"/>
        <line x1="235" y1="30" x2="235" y2="68" stroke-dasharray="3 3" stroke="#22d3ee"/>
      </g>
      <g fill="#0c1a2e" stroke="#38bdf8" stroke-width="2">
        <circle cx="52" cy="42" r="15"/><circle cx="52" cy="92" r="15"/><circle cx="52" cy="142" r="15"/>
      </g>
      <circle cx="247" cy="92" r="24" fill="#0c1a2e" stroke="#00ffc8" stroke-width="2"/>
      <circle cx="370" cy="92" r="17" fill="#0c1a2e" stroke="#7dd3fc" stroke-width="2"/>
      <g font-family="JetBrains Mono,monospace" font-size="13" fill="#cfe3ff" text-anchor="middle">
        <text x="52" y="47">x₁</text><text x="52" y="97">x₂</text><text x="52" y="147">x₃</text>
        <text x="247" y="97" fill="#00ffc8" font-size="16">Σ</text><text x="370" y="97">y</text>
        <text x="235" y="22" fill="#22d3ee" font-size="11">b 偏置</text>
      </g>
      <g font-family="JetBrains Mono,monospace" font-size="10.5" fill="#7dd3fc">
        <text x="140" y="52">w₁</text><text x="150" y="86">w₂</text><text x="140" y="132">w₃</text>
      </g>
      <circle r="3.5" fill="#00ffc8">
        <animateMotion dur="1.6s" repeatCount="indefinite" path="M72,42 L228,92"/>
        <animate attributeName="opacity" values="1;0.4;1" dur="1.6s" repeatCount="indefinite"/>
      </circle>
      <circle r="3.5" fill="#00ffc8">
        <animateMotion dur="1.6s" begin="0.5s" repeatCount="indefinite" path="M72,92 L228,92"/>
      </circle>
      <circle r="3.5" fill="#00ffc8">
        <animateMotion dur="1.6s" begin="1s" repeatCount="indefinite" path="M72,142 L228,92"/>
      </circle>
      <circle r="4" fill="#7dd3fc">
        <animateMotion dur="1.2s" repeatCount="indefinite" path="M266,92 L352,92"/>
        <animate attributeName="r" values="3;5;3" dur="1.2s" repeatCount="indefinite"/>
      </circle>
    </svg>`
  },

  /* ---------- CNN 卷积 ---------- */
  cnn: {
    formula: '(I ∗ K)(i,j) = Σₘ Σₙ I(i+m, j+n) · K(m, n)&nbsp;&nbsp;<span class="f-note">I：输入图&nbsp;&nbsp;K：卷积核（如 3×3）</span>',
    plain: "想象拿一个 3×3 的『放大镜』在图片上从左到右、从上到下一格格滑动，每滑一格就把放大镜盖住的 9 个像素分别乘上放大镜里的 9 个权重再求和，得到特征图上的一个点。不同的放大镜（卷积核）找不同的东西：有的找竖边缘，有的找横边缘。",
    svg: `<svg viewBox="0 0 440 200" xmlns="http://www.w3.org/2000/svg">
      <g fill="none" stroke="#334766" stroke-width="1">
        ${[0,1,2,3,4].map(r=>`<line x1="40" y1="${30+r*22}" x2="150" y2="${30+r*22}"/>`).join("")}
        ${[0,1,2,3,4,5].map(c=>`<line x1="${40+c*22}" y1="30" x2="${40+c*22}" y2="140"/>`).join("")}
      </g>
      <rect x="40" y="30" width="110" height="110" fill="#0c1a2e" opacity="0.5"/>
      <g>
        <rect x="40" y="30" width="66" height="66" fill="rgba(0,255,200,0.14)" stroke="#00ffc8" stroke-width="2">
          <animateTransform attributeName="transform" type="translate" values="0,0; 22,0; 44,0; 44,22; 22,22; 0,22; 0,44; 22,44; 44,44" dur="4.5s" calcMode="discrete" repeatCount="indefinite"/>
        </rect>
      </g>
      <text x="95" y="158" font-family="JetBrains Mono,monospace" font-size="11" fill="#7dd3fc" text-anchor="middle">输入 5×5 · 卷积核 3×3 滑动</text>
      <path d="M165,85 L215,85" stroke="#38bdf8" stroke-width="1.5" marker-end="url(#arr)"/>
      <polygon points="215,85 206,81 206,89" fill="#38bdf8"/>
      <g fill="none" stroke="#334766" stroke-width="1">
        ${[0,1,2,3].map(r=>`<line x1="235" y1="${52+r*22}" x2="323" y2="${52+r*22}"/>`).join("")}
        ${[0,1,2,3,4].map(c=>`<line x1="${235+c*22}" y1="52" x2="${235+c*22}" y2="118"/>`).join("")}
      </g>
      <rect x="235" y="52" width="88" height="66" fill="#0c1a2e" opacity="0.5"/>
      <g fill="#00ffc8">
        <rect x="237" y="54" width="18" height="18" opacity="0.5"><animate attributeName="opacity" values="0;0.7;0" dur="4.5s" begin="0s" repeatCount="indefinite"/></rect>
        <rect x="259" y="54" width="18" height="18" opacity="0.5"><animate attributeName="opacity" values="0;0.7;0" dur="4.5s" begin="0.5s" repeatCount="indefinite"/></rect>
        <rect x="281" y="76" width="18" height="18" opacity="0.5"><animate attributeName="opacity" values="0;0.7;0" dur="4.5s" begin="2s" repeatCount="indefinite"/></rect>
        <rect x="303" y="98" width="18" height="18" opacity="0.5"><animate attributeName="opacity" values="0;0.7;0" dur="4.5s" begin="4s" repeatCount="indefinite"/></rect>
      </g>
      <text x="279" y="140" font-family="JetBrains Mono,monospace" font-size="11" fill="#7dd3fc" text-anchor="middle">输出特征图 3×3</text>
      <g fill="#0c1a2e" stroke="#22d3ee" stroke-width="1.6">
        <rect x="350" y="55" width="54" height="54" rx="4"/>
      </g>
      <g font-family="JetBrains Mono,monospace" font-size="10" fill="#22d3ee" text-anchor="middle">
        <text x="368" y="72">1</text><text x="390" y="72">0</text><text x="377" y="90" font-size="12" fill="#7dd3fc">⋯</text><text x="368" y="104">0</text><text x="390" y="104">1</text>
      </g>
      <text x="377" y="126" font-family="JetBrains Mono,monospace" font-size="10.5" fill="#7dd3fc" text-anchor="middle">卷积核 K</text>
    </svg>`
  },

  /* ---------- RNN 循环 ---------- */
  rnn: {
    formula: 'hₜ = tanh( W·hₜ₋₁ + U·xₜ ),&nbsp;&nbsp;yₜ = V·hₜ&nbsp;&nbsp;<span class="f-note">h：隐藏状态（记忆）</span>',
    plain: "RNN 像一个『边读边记笔记』的读者：每读一个词，就把新内容和之前的笔记（隐藏状态 h）混合，更新笔记。这样读到后面时，笔记里积累着前文信息。缺点是笔记传着传着会『失真』（长程依赖问题），所以后来被能并行处理全文的 Transformer 取代。",
    svg: `<svg viewBox="0 0 440 190" xmlns="http://www.w3.org/2000/svg">
      <g fill="#0c1a2e" stroke="#38bdf8" stroke-width="2">
        <rect x="60" y="70" width="84" height="44" rx="8"/><rect x="178" y="70" width="84" height="44" rx="8"/><rect x="296" y="70" width="84" height="44" rx="8"/>
      </g>
      <g font-family="JetBrains Mono,monospace" font-size="14" fill="#cfe3ff" text-anchor="middle">
        <text x="102" y="97">hₜ₋₁</text><text x="220" y="97">hₜ</text><text x="338" y="97">hₜ₊₁</text>
      </g>
      <g stroke="#38bdf8" stroke-width="1.5" opacity="0.6">
        <line x1="144" y1="92" x2="178" y2="92"/><line x1="262" y1="92" x2="296" y2="92"/>
      </g>
      <polygon points="178,92 169,88 169,96" fill="#38bdf8"/><polygon points="296,92 287,88 287,96" fill="#38bdf8"/>
      <path d="M220,70 C220,38 220,38 220,70" fill="none" stroke="#00ffc8" stroke-width="1.6"/>
      <polygon points="220,70 216,61 224,61" fill="#00ffc8"/>
      <text x="243" y="42" font-family="JetBrains Mono,monospace" font-size="10.5" fill="#00ffc8">循环记忆 W</text>
      <g stroke="#22d3ee" stroke-width="1.4" stroke-dasharray="4 3" opacity="0.7">
        <line x1="102" y1="152" x2="102" y2="116"/><line x1="220" y1="152" x2="220" y2="116"/><line x1="338" y1="152" x2="338" y2="116"/>
      </g>
      <g font-family="JetBrains Mono,monospace" font-size="11" fill="#22d3ee" text-anchor="middle">
        <text x="102" y="168">xₜ₋₁</text><text x="220" y="168">xₜ</text><text x="338" y="168">xₜ₊₁</text>
        <text x="102" y="58" fill="#7dd3fc">yₜ₋₁</text><text x="220" y="58" fill="#7dd3fc">yₜ</text><text x="338" y="58" fill="#7dd3fc">yₜ₊₁</text>
      </g>
      <circle r="3.5" fill="#00ffc8">
        <animateMotion dur="2.4s" repeatCount="indefinite" path="M102,92 L144,92 L178,92 L220,92 L262,92 L296,92 L338,92"/>
      </circle>
    </svg>`
  },

  /* ---------- Transformer 注意力 ---------- */
  attention: {
    formula: 'Attention(Q,K,V) = softmax( QKᵀ / √dₖ ) · V&nbsp;&nbsp;<span class="f-note">Q：查询&nbsp;&nbsp;K：键&nbsp;&nbsp;V：值</span>',
    plain: "读『小猫追球』时，模型会给每个词发一张『查询卡』，拿它去和所有词的『名片』（K）比对相关度，相关度越高，就越多地『借用』那个词的信息（V）。『追』会强烈关注『小猫』（谁追）和『球』（追什么）。这种全局自动对焦就是自注意力，且所有词同时计算，可并行训练。",
    svg: `<svg viewBox="0 0 440 190" xmlns="http://www.w3.org/2000/svg">
      <g font-family="Manrope,Noto Sans SC,sans-serif" font-size="15" fill="#e6e9f0" text-anchor="middle">
        <text x="70" y="48">小猫</text><text x="170" y="48">追</text><text x="270" y="48">球</text><text x="370" y="48" fill="#5a6275">。</text>
      </g>
      <g font-family="Manrope,Noto Sans SC,sans-serif" font-size="13" fill="#7dd3fc" text-anchor="middle">
        <text x="120" y="152">施动者</text><text x="230" y="152">动作</text><text x="330" y="152">受动者</text>
      </g>
      <g fill="none" stroke-width="2">
        <path d="M70,58 C70,110 120,110 120,140" stroke="#00ffc8" opacity="0.85">
          <animate attributeName="stroke-dashoffset" from="60" to="0" dur="1.4s" repeatCount="indefinite"/>
          <animate attributeName="opacity" values="0.85;0.3;0.85" dur="2.8s" repeatCount="indefinite"/>
        </path>
        <path d="M170,58 C170,100 230,100 230,140" stroke="#38bdf8" opacity="0.7">
          <animate attributeName="stroke-dashoffset" from="50" to="0" dur="1.4s" repeatCount="indefinite"/>
        </path>
        <path d="M270,58 C270,110 330,110 330,140" stroke="#22d3ee" opacity="0.75">
          <animate attributeName="stroke-dashoffset" from="60" to="0" dur="1.4s" repeatCount="indefinite"/>
          <animate attributeName="opacity" values="0.75;0.25;0.75" dur="2.8s" begin="1.2s" repeatCount="indefinite"/>
        </path>
        <path d="M70,58 C100,120 210,130 230,140" stroke="#334766" opacity="0.3"/>
        <path d="M370,58 C350,110 290,130 230,140" stroke="#334766" opacity="0.3"/>
      </g>
      <g stroke-dasharray="6 4">
        <animate attributeName="stroke-dashoffset" from="20" to="0" dur="0.8s" repeatCount="indefinite"/>
      </g>
      <g font-family="JetBrains Mono,monospace" font-size="11" fill="#5a6275">
        <text x="20" y="30">Q 查询卡 →</text><text x="352" y="170">← K/V 名片</text>
      </g>
    </svg>`
  },

  /* ---------- GAN 对抗 ---------- */
  gan: {
    formula: 'min<sub>G</sub> max<sub>D</sub> V(D,G) = 𝔼<sub>x~p<sub>data</sub></sub>[log D(x)] + 𝔼<sub>z~p<sub>z</sub></sub>[log(1 − D(G(z)))]',
    plain: "像一场『造假 vs 鉴宝』的军备竞赛：造假者 G 从一堆随机噪声出发学画假币，鉴宝师 D 学习分辨真假。D 越强，G 被迫画得越像；G 越强，D 被迫更敏锐。两者互相对抗、共同进步，最终 G 画出的图能以假乱真。缺点是训练不稳定，后来被扩散模型取代。",
    svg: `<svg viewBox="0 0 440 190" xmlns="http://www.w3.org/2000/svg">
      <circle cx="46" cy="95" r="20" fill="#0c1a2e" stroke="#38bdf8" stroke-width="2"/>
      <g fill="#38bdf8" opacity="0.8">
        <circle cx="40" cy="88" r="1.5"/><circle cx="52" cy="92" r="1.5"/><circle cx="44" cy="102" r="1.5"/><circle cx="55" cy="100" r="1"/><circle cx="38" cy="96" r="1"/>
        <animate attributeName="opacity" values="0.8;0.3;0.8" dur="1.2s" repeatCount="indefinite"/>
      </g>
      <text x="46" y="132" font-family="JetBrains Mono,monospace" font-size="11" fill="#7dd3fc" text-anchor="middle">z 噪声</text>
      <rect x="92" y="70" width="88" height="50" rx="10" fill="#0c1a2e" stroke="#00ffc8" stroke-width="2"/>
      <text x="136" y="90" font-family="JetBrains Mono,monospace" font-size="14" fill="#00ffc8" text-anchor="middle">G 生成器</text>
      <text x="136" y="108" font-family="JetBrains Mono,monospace" font-size="9.5" fill="#5a6275" text-anchor="middle">造假者</text>
      <rect x="222" y="76" width="44" height="38" rx="6" fill="none" stroke="#22d3ee" stroke-width="1.5" stroke-dasharray="5 3"/>
      <g stroke="#22d3ee" stroke-width="1.2" fill="none">
        <path d="M230,88 q8,-8 16,0 t16,0"/><circle cx="240" cy="102" r="3"/><path d="M252,100 l8,6"/>
      </g>
      <text x="244" y="130" font-family="JetBrains Mono,monospace" font-size="10" fill="#22d3ee" text-anchor="middle">假图</text>
      <rect x="292" y="70" width="88" height="50" rx="10" fill="#0c1a2e" stroke="#ffb800" stroke-width="2"/>
      <text x="336" y="90" font-family="JetBrains Mono,monospace" font-size="14" fill="#ffb800" text-anchor="middle">D 判别器</text>
      <text x="336" y="108" font-family="JetBrains Mono,monospace" font-size="9.5" fill="#5a6275" text-anchor="middle">鉴宝师</text>
      <g stroke="#38bdf8" stroke-width="1.4" opacity="0.7">
        <line x1="70" y1="95" x2="92" y2="95"/><line x1="180" y1="95" x2="222" y2="95"/><line x1="266" y1="95" x2="292" y2="95"/>
      </g>
      <polygon points="92,95 83,91 83,99" fill="#38bdf8"/><polygon points="222,95 213,91 213,99" fill="#38bdf8"/><polygon points="292,95 283,91 283,99" fill="#38bdf8"/>
      <text x="404" y="82" font-family="JetBrains Mono,monospace" font-size="12" fill="#22c55e" text-anchor="middle">真</text>
      <text x="404" y="112" font-family="JetBrains Mono,monospace" font-size="12" fill="#f87171" text-anchor="middle">假</text>
      <path d="M336,124 C336,164 136,164 136,124" fill="none" stroke="#f87171" stroke-width="1.4" stroke-dasharray="6 4" opacity="0.7">
        <animate attributeName="stroke-dashoffset" from="20" to="0" dur="0.9s" repeatCount="indefinite"/>
        <animate attributeName="opacity" values="0.7;0.3;0.7" dur="2s" repeatCount="indefinite"/>
      </path>
      <text x="236" y="176" font-family="JetBrains Mono,monospace" font-size="10.5" fill="#f87171" text-anchor="middle">D 的判断反馈给 G（对抗更新）</text>
    </svg>`
  },

  /* ---------- 扩散模型 ---------- */
  diffusion: {
    formula: '前向：q(xₜ | xₜ₋₁) = 𝒩(√(1−βₜ)·xₜ₋₁, βₜI)&nbsp;&nbsp;&nbsp;反向：p<sub>θ</sub>(xₜ₋₁ | xₜ) = 𝒩(μ<sub>θ</sub>(xₜ, t), Σ<sub>θ</sub>(xₜ, t))',
    plain: "拿一张清晰照片，每次往上撒一点『沙子』（噪声），撒几百次后完全看不清——这是前向过程，不需要学习。然后训练一个网络学会反着来：从一团噪声里一步步『擦掉』沙子还原图片——这是反向去噪。生成新图时，从纯噪声出发，按提示词指引方向一步步擦，就『雕刻』出了全新图像。",
    svg: `<svg viewBox="0 0 440 200" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="cln" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#1e4d8c"/><stop offset="1" stop-color="#0ea5e9"/></linearGradient>
        <pattern id="nz" width="8" height="8" patternUnits="userSpaceOnUse">
          <rect width="8" height="8" fill="#0c1a2e"/>
          <circle cx="2" cy="2" r="1.1" fill="#64748b"/><circle cx="6" cy="5" r="1" fill="#475569"/><circle cx="4" cy="7" r="0.8" fill="#64748b"/>
        </pattern>
      </defs>
      <g>
        <rect x="40" y="70" width="52" height="52" rx="6" fill="url(#cln)" stroke="#38bdf8"/>
        <rect x="108" y="70" width="52" height="52" rx="6" fill="url(#cln)" stroke="#38bdf8" opacity="0.85"><rect fill="url(#nz)" width="52" height="52" opacity="0.25"/></rect>
        <rect x="176" y="70" width="52" height="52" rx="6" fill="url(#cln)" stroke="#38bdf8" opacity="0.6"><rect fill="url(#nz)" width="52" height="52" opacity="0.5"/></rect>
        <rect x="244" y="70" width="52" height="52" rx="6" fill="url(#cln)" stroke="#38bdf8" opacity="0.35"><rect fill="url(#nz)" width="52" height="52" opacity="0.75"/></rect>
        <rect x="312" y="70" width="52" height="52" rx="6" fill="url(#nz)" stroke="#475569">
          <animate attributeName="stroke" values="#475569;#22d3ee;#475569" dur="2.4s" repeatCount="indefinite"/>
        </rect>
      </g>
      <g font-family="JetBrains Mono,monospace" font-size="11" fill="#7dd3fc" text-anchor="middle">
        <text x="66" y="140">x₀ 清晰</text><text x="200" y="140">xₜ 半噪</text><text x="338" y="140">x_T 纯噪声</text>
      </g>
      <path d="M100,52 L320,52" stroke="#38bdf8" stroke-width="1.4" marker-end="url(#arr)" opacity="0.75"/>
      <polygon points="330,52 320,47 320,57" fill="#38bdf8"/>
      <text x="215" y="42" font-family="JetBrains Mono,monospace" font-size="11" fill="#38bdf8" text-anchor="middle">前向加噪 q(xₜ|xₜ₋₁) →</text>
      <path d="M320,158 L100,158" stroke="#00ffc8" stroke-width="1.4" opacity="0.75"/>
      <polygon points="92,158 102,153 102,163" fill="#00ffc8"/>
      <text x="212" y="176" font-family="JetBrains Mono,monospace" font-size="11" fill="#00ffc8" text-anchor="middle">← 反向去噪 pθ(xₜ₋₁|xₜ)（学习目标）</text>
      <circle r="4" fill="#00ffc8">
        <animateMotion dur="2.2s" repeatCount="indefinite" path="M320,158 L100,158"/>
        <animate attributeName="opacity" values="1;0.5;1" dur="1s" repeatCount="indefinite"/>
      </circle>
    </svg>`
  },

  /* ---------- VAE 自编码器 ---------- */
  vae: {
    formula: 'q<sub>φ</sub>(z|x)：编码 → z = μ + σ ⊙ ε, ε~𝒩(0,I) → p<sub>θ</sub>(x|z)：解码&nbsp;&nbsp;<span class="f-note">重参数化技巧使采样可导</span>',
    plain: "VAE 像『压缩-还原』大师：编码器把大图压成一个低维『精华密码』z（只保留精髓，如 64×64 的潜变量），解码器再凭密码还原出图。因为 SD 的扩散去噪就发生在这个压缩后的潜空间里，计算量骤降几十倍——这就是 SD 能在普通显卡上跑的原因。换 VAE 会改变画面色彩，因为解码器决定『密码如何还原成像素』。",
    svg: `<svg viewBox="0 0 440 190" xmlns="http://www.w3.org/2000/svg">
      <rect x="30" y="70" width="48" height="48" rx="6" fill="url(#cln2)" stroke="#38bdf8"/>
      <defs><linearGradient id="cln2" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#1e4d8c"/><stop offset="1" stop-color="#0ea5e9"/></linearGradient></defs>
      <text x="54" y="136" font-family="JetBrains Mono,monospace" font-size="11" fill="#7dd3fc" text-anchor="middle">输入 x</text>
      <polygon points="100,60 150,78 150,110 100,128" fill="#0c1a2e" stroke="#38bdf8" stroke-width="2"/>
      <text x="122" y="98" font-family="JetBrains Mono,monospace" font-size="11" fill="#38bdf8" text-anchor="middle">编码器</text>
      <g fill="#0c1a2e" stroke="#22d3ee" stroke-width="1.8">
        <circle cx="196" cy="78" r="14"/><circle cx="196" cy="112" r="14"/>
      </g>
      <text x="196" y="83" font-family="JetBrains Mono,monospace" font-size="12" fill="#22d3ee" text-anchor="middle">μ</text>
      <text x="196" y="117" font-family="JetBrains Mono,monospace" font-size="12" fill="#22d3ee" text-anchor="middle">σ</text>
      <circle cx="258" cy="95" r="15" fill="#0c1a2e" stroke="#00ffc8" stroke-width="2" stroke-dasharray="5 3"/>
      <text x="258" y="100" font-family="JetBrains Mono,monospace" font-size="12" fill="#00ffc8" text-anchor="middle">z</text>
      <text x="258" y="140" font-family="JetBrains Mono,monospace" font-size="9.5" fill="#00ffc8" text-anchor="middle">潜变量（采样）</text>
      <polygon points="290,78 340,60 340,128 290,110" fill="#0c1a2e" stroke="#7dd3fc" stroke-width="2"/>
      <text x="318" y="98" font-family="JetBrains Mono,monospace" font-size="11" fill="#7dd3fc" text-anchor="middle">解码器</text>
      <rect x="362" y="70" width="48" height="48" rx="6" fill="url(#cln2)" stroke="#7dd3fc">
        <animate attributeName="opacity" values="1;0.55;1" dur="2s" repeatCount="indefinite"/>
      </rect>
      <text x="386" y="136" font-family="JetBrains Mono,monospace" font-size="11" fill="#7dd3fc" text-anchor="middle">重建 x̂</text>
      <g stroke="#38bdf8" stroke-width="1.4" opacity="0.7">
        <line x1="78" y1="94" x2="100" y2="94"/><line x1="150" y1="94" x2="182" y2="94"/><line x1="210" y1="95" x2="243" y2="95"/><line x1="273" y1="95" x2="290" y2="94"/><line x1="340" y1="94" x2="362" y2="94"/>
      </g>
      <circle r="3.5" fill="#00ffc8">
        <animateMotion dur="2.6s" repeatCount="indefinite" path="M78,94 L100,94 L150,94 L182,94 L210,95 L243,95 L273,95 L290,94 L340,94 L362,94"/>
      </circle>
    </svg>`
  },

  /* ---------- U-Net ---------- */
  unet: {
    formula: 'x̂ = xₜ − ε<sub>θ</sub>(xₜ, t, CLIP(prompt))&nbsp;&nbsp;<span class="f-note">ε<sub>θ</sub>：U-Net 预测的噪声（含跳跃连接）</span>',
    plain: "U-Net 长得像字母 U：左边一路下采样『看全局』（图越缩越小、语义越抽象），右边一路上采样『还原细节』。关键在横向的『跳跃连接』——把左边看过的细节直接抄送给右边，让网络既懂整体又记得局部细节。SD 用它预测噪声，告诉模型『这张图里哪些是沙子，该擦掉多少』。",
    svg: `<svg viewBox="0 0 440 200" xmlns="http://www.w3.org/2000/svg">
      <g fill="#0c1a2e" stroke="#38bdf8" stroke-width="1.8">
        <rect x="60" y="40" width="56" height="30" rx="5"/>
        <rect x="82" y="90" width="44" height="26" rx="5"/>
        <rect x="100" y="136" width="32" height="22" rx="5"/>
      </g>
      <g fill="#0c1a2e" stroke="#22d3ee" stroke-width="1.8">
        <rect x="324" y="40" width="56" height="30" rx="5"/>
        <rect x="314" y="90" width="44" height="26" rx="5"/>
        <rect x="308" y="136" width="32" height="22" rx="5"/>
      </g>
      <rect x="196" y="150" width="52" height="24" rx="5" fill="#0c1a2e" stroke="#00ffc8" stroke-width="2"/>
      <g font-family="JetBrains Mono,monospace" font-size="9.5" fill="#7dd3fc" text-anchor="middle">
        <text x="88" y="58">64²</text><text x="104" y="106">32²</text><text x="116" y="150">16²</text>
        <text x="352" y="58">上采样</text><text x="336" y="106">上采样</text><text x="324" y="150">输出</text>
        <text x="222" y="165" fill="#00ffc8">瓶颈</text>
      </g>
      <g stroke="#38bdf8" stroke-width="1.4" opacity="0.6" fill="none">
        <path d="M116,70 C116,80 104,80 104,90"/>
        <path d="M126,116 C150,136 170,150 196,158"/>
        <path d="M248,158 C270,150 290,136 314,116"/>
        <path d="M352,136 C364,126 360,110 352,96"/>
      </g>
      <g stroke="#00ffc8" stroke-width="1.6" stroke-dasharray="7 4" fill="none" opacity="0.85">
        <path d="M116,55 L324,55"><animate attributeName="stroke-dashoffset" from="22" to="0" dur="0.9s" repeatCount="indefinite"/></path>
        <path d="M126,103 L314,103"><animate attributeName="stroke-dashoffset" from="22" to="0" dur="1.1s" repeatCount="indefinite"/></path>
        <path d="M132,147 L308,147"><animate attributeName="stroke-dashoffset" from="22" to="0" dur="1.3s" repeatCount="indefinite"/></path>
      </g>
      <text x="220" y="24" font-family="JetBrains Mono,monospace" font-size="11" fill="#00ffc8" text-anchor="middle">跳跃连接（细节直通）</text>
      <text x="222" y="188" font-family="JetBrains Mono,monospace" font-size="10.5" fill="#5a6275" text-anchor="middle">左：下采样看全局 · 右：上采样还原细节</text>
    </svg>`
  },

  /* ---------- CLIP ---------- */
  clip: {
    formula: 'L<sub>CLIP</sub> = −(1/N) Σᵢ [ log( exp(s<sub>ii</sub>/τ) / Σⱼ exp(s<sub>ij</sub>/τ) ) ]&nbsp;&nbsp;<span class="f-note">s<sub>ij</sub>：图 i 与文 j 的相似度</span>',
    plain: "CLIP 看过几亿张『图片+配文』，学会让正确的图和文在数学空间里『靠近』，错误的互相『远离』。训练后它成了一个翻译官：把你的提示词翻译成一串数字向量，SD 拿这个向量当导航，朝『像提示词描述的画面』方向去噪。所以写 CLIP 训练时常见的词，模型理解得更准。",
    svg: `<svg viewBox="0 0 440 190" xmlns="http://www.w3.org/2000/svg">
      <g fill="#0c1a2e" stroke="#38bdf8" stroke-width="1.6">
        <rect x="46" y="46" width="52" height="34" rx="4"/><rect x="46" y="88" width="52" height="34" rx="4"/><rect x="46" y="130" width="52" height="34" rx="4"/>
      </g>
      <g stroke="#7dd3fc" stroke-width="1.2" fill="none">
        <path d="M52,74 l12,-10 8,6 10,-8 12,12"/><circle cx="94" cy="96" r="6"/><path d="M52,156 l14,-12 8,6 12,-10 8,4"/>
      </g>
      <g font-family="Manrope,Noto Sans SC,sans-serif" font-size="13" fill="#cfe3ff">
        <text x="250" y="66">一只猫的照片</text><text x="250" y="108">一只狗的照片</text><text x="250" y="150">一辆车的照片</text>
      </g>
      <g stroke-width="2" fill="none">
        <path d="M98,63 C160,63 190,60 244,61" stroke="#00ffc8">
          <animate attributeName="stroke-dashoffset" from="40" to="0" dur="1s" repeatCount="indefinite"/>
        </path>
        <path d="M98,105 C160,105 190,102 244,103" stroke="#00ffc8">
          <animate attributeName="stroke-dashoffset" from="40" to="0" dur="1.2s" repeatCount="indefinite"/>
        </path>
        <path d="M98,147 C160,147 190,144 244,145" stroke="#00ffc8">
          <animate attributeName="stroke-dashoffset" from="40" to="0" dur="1.4s" repeatCount="indefinite"/>
        </path>
      </g>
      <g stroke="#334766" stroke-width="1" opacity="0.45" fill="none">
        <path d="M98,63 C150,95 200,100 244,103"/><path d="M98,63 C150,130 200,140 244,145"/>
        <path d="M98,105 C150,70 200,64 244,61"/><path d="M98,105 C150,135 200,140 244,145"/>
        <path d="M98,147 C150,68 200,64 244,61"/><path d="M98,147 C150,98 200,102 244,103"/>
      </g>
      <g fill="#00ffc8"><circle cx="98" cy="63" r="3"/><circle cx="98" cy="105" r="3"/><circle cx="98" cy="147" r="3"/></g>
      <g font-family="JetBrains Mono,monospace" font-size="10" fill="#5a6275">
        <text x="150" y="36">相似度矩阵：对角线（正确配对）被拉高</text>
      </g>
    </svg>`
  },

  /* ---------- Softmax ---------- */
  softmax: {
    formula: 'softmax(zᵢ) = e^{zᵢ} / Σⱼ e^{z<sub>j</sub>}&nbsp;&nbsp;<span class="f-note">把任意实数压成和为 1 的概率分布</span>',
    plain: "softmax 是『概率分配器』：把一串打分（可正可负）先取指数（拉开差距、全变正数），再除以总和归一化，变成一组加起来等于 1 的概率。注意力里的『相关度权重』、分类器的『置信度』都是它算出来的。",
    svg: `<svg viewBox="0 0 440 170" xmlns="http://www.w3.org/2000/svg">
      <g font-family="JetBrains Mono,monospace" font-size="12" fill="#cfe3ff" text-anchor="middle">
        <text x="56" y="50">2.0</text><text x="56" y="92">1.0</text><text x="56" y="134">0.1</text>
      </g>
      <g fill="#0c1a2e" stroke="#38bdf8" stroke-width="1.6">
        <rect x="40" y="36" width="32" height="20" rx="4"/><rect x="40" y="78" width="32" height="20" rx="4"/><rect x="40" y="120" width="32" height="20" rx="4"/>
      </g>
      <rect x="150" y="70" width="90" height="40" rx="8" fill="#0c1a2e" stroke="#00ffc8" stroke-width="1.8"/>
      <text x="195" y="95" font-family="JetBrains Mono,monospace" font-size="13" fill="#00ffc8" text-anchor="middle">softmax</text>
      <g stroke="#38bdf8" stroke-width="1.3" opacity="0.6">
        <line x1="72" y1="46" x2="150" y2="86"/><line x1="72" y1="88" x2="150" y2="90"/><line x1="72" y1="130" x2="150" y2="94"/>
      </g>
      <polygon points="150,86 141,83 143,90" fill="#38bdf8"/><polygon points="150,90 141,87 141,94" fill="#38bdf8"/><polygon points="150,94 141,91 143,98" fill="#38bdf8"/>
      <g font-family="JetBrains Mono,monospace" font-size="11" fill="#7dd3fc">
        <text x="262" y="60">P = 0.66</text><text x="262" y="96">P = 0.24</text><text x="262" y="132">P = 0.10</text>
      </g>
      <g fill="#123" stroke="#22d3ee" stroke-width="1">
        <rect x="330" y="48" width="80" height="16" rx="3"/><rect x="330" y="84" width="80" height="16" rx="3"/><rect x="330" y="120" width="80" height="16" rx="3"/>
      </g>
      <g fill="#00ffc8">
        <rect x="332" y="50" width="53" height="12" rx="2"><animate attributeName="width" values="0;53;53" dur="1.6s" fill="freeze"/></rect>
        <rect x="332" y="86" width="19" height="12" rx="2" fill="#38bdf8"><animate attributeName="width" values="0;19;19" dur="1.6s" begin="0.3s" fill="freeze"/></rect>
        <rect x="332" y="122" width="8" height="12" rx="2" fill="#22d3ee"><animate attributeName="width" values="0;8;8" dur="1.6s" begin="0.6s" fill="freeze"/></rect>
      </g>
      <text x="370" y="156" font-family="JetBrains Mono,monospace" font-size="10" fill="#5a6275" text-anchor="middle">Σ P = 1</text>
    </svg>`
  }
};
