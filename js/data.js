/* =====================================================================
 * AI 生图知识体系 · 内容数据
 * 面向零基础小白的硬核科普 —— 结构化数据，由 app.js 渲染
 * ===================================================================== */

/* ---------- 公共：术语表（A-Z 风格，按类别分组便于浏览） ---------- */
const GLOSSARY = [
  { term: "AI 生图", en: "AI Image Generation", cat: "基础", desc: "利用人工智能模型，根据文字、图像或其他输入自动生成图片的技术总称。" },
  { term: "文生图", en: "Text-to-Image (T2I)", cat: "基础", desc: "输入一段文字描述（Prompt），由模型直接输出对应图像，是目前最主流的生图方式。" },
  { term: "图生图", en: "Image-to-Image (I2I)", cat: "基础", desc: "输入一张参考图 + 文字描述，模型在保留原图结构的基础上生成新图，常用于风格迁移、线稿上色。" },
  { term: "提示词", en: "Prompt", cat: "基础", desc: "用户输入给模型的指令文字，决定生成内容。分正向提示词（要什么）与反向提示词（不要什么）。" },
  { term: "种子", en: "Seed", cat: "基础", desc: "随机数起点。相同种子 + 相同参数可复现同一张图，改种子会得到同一构图下的不同细节变体。" },
  { term: "采样步数", en: "Steps", cat: "基础", desc: "扩散模型去噪的迭代次数。太少图糊噪点多，太多边际收益递减且变慢，常用 20–40。" },
  { term: "采样器", en: "Sampler", cat: "基础", desc: "去噪所用的算法，如 Euler a、DPM++ 2M Karras 等，影响画面质感与收敛速度。" },
  { term: "CFG Scale", en: "Classifier Free Guidance", cat: "基础", desc: "提示词引导强度。值越大越听话但易过曝死板，值越小越自由但易跑偏，常用 5–12。" },
  { term: "神经网络", en: "Neural Network", cat: "原理", desc: "模仿生物神经元结构的计算模型，由层层节点与权重连接组成，是现代 AI 的基础。" },
  { term: "卷积核", en: "Convolution Kernel / Filter", cat: "原理", desc: "CNN 中扫过图像的小权重矩阵，负责提取边缘、纹理等局部特征。多个核堆叠可提取更复杂特征。" },
  { term: "卷积神经网络", en: "CNN", cat: "原理", desc: "通过卷积核扫描图像提取空间特征的神经网络，曾是图像识别主流架构。" },
  { term: "循环神经网络", en: "RNN", cat: "原理", desc: "具有时序记忆能力的网络，常用于文本、语音等序列数据，是 NLP 早期主力。" },
  { term: "Transformer", en: "Transformer", cat: "原理", desc: "基于自注意力的架构，可并行处理序列，是 GPT、SD 文本编码器等现代大模型的基础。" },
  { term: "注意力机制", en: "Attention", cat: "原理", desc: "让模型在处理时动态关注输入中重要部分的技术，是 Transformer 的核心。" },
  { term: "扩散模型", en: "Diffusion Model", cat: "原理", desc: "通过逐步加噪再学习去噪来生成图像的概率模型，是当前 AI 生图的主流范式。" },
  { term: "生成对抗网络", en: "GAN", cat: "原理", desc: "生成器与判别器对抗训练的模型，曾用于图像生成，现多被扩散模型取代。" },
  { term: "自编码器", en: "VAE", cat: "原理", desc: "将图像压缩到低维潜空间再解码重建的网络，SD 用它在像素与潜空间之间转换。" },
  { term: "潜空间", en: "Latent Space", cat: "原理", desc: "数据被压缩后的低维表示空间，扩散模型在潜空间运算可大幅降低计算量。" },
  { term: "U-Net", en: "U-Net", cat: "原理", desc: "编码-解码 + 跳跃连接的网络结构，是 SD 等扩散模型去噪的核心。" },
  { term: "CLIP", en: "Contrastive Language-Image Pretraining", cat: "原理", desc: "OpenAI 提出的图文对比学习模型，让模型理解文字与图像的对应关系，SD 用它编码提示词。" },
  { term: "Stable Diffusion", en: "SD", cat: "模型", desc: "Stability AI 于 2022 年开源的潜扩散模型，开源生态的核心，催生了 WebUI/ComfyUI 等工具链。" },
  { term: "DALL·E", en: "DALL·E", cat: "模型", desc: "OpenAI 的文生图系列，DALL·E 3 与 ChatGPT 深度集成，理解力强、闭源。" },
  { term: "Midjourney", en: "MJ", cat: "模型", desc: "闭源商业模型，以艺术风格出众著称，通过 Discord/网页使用，付费订阅制。" },
  { term: "NovelAI", en: "NAI", cat: "模型", desc: "面向二次元文生图/写作的付费平台，基于 SD 衍生模型训练，动漫风格突出。" },
  { term: "Banana AI", en: "Banana", cat: "模型", desc: "面向开发者的无服务器 GPU 平台，可一键部署 SD 等 ML 模型为 API，也被用于生图算力托管。" },
  { term: "LoRA", en: "Low-Rank Adaptation", cat: "微调", desc: "低秩适配微调方法，只训练极小参数即可改变画风/角色，是 SD 生态最流行的扩展形式。" },
  { term: "DreamBooth", en: "DreamBooth", cat: "微调", desc: "把特定主体（如你的猫）训练进模型的方法，比 LoRA 更深，但易过拟合、显存要求高。" },
  { term: "Textual Inversion", en: "TI / 嵌入式", cat: "微调", desc: "学习一个新词向量代表某概念，文件极小，适合定义风格/角色，训练慢、效果弱于 LoRA。" },
  { term: "Hypernetwork", en: "Hypernetwork", cat: "微调", desc: "在小规模网络层插入微调，效果介于 TI 与 LoRA 之间，现已较少使用。" },
  { term: "ControlNet", en: "ControlNet", cat: "微调", desc: "通过线稿/深度图/姿态等条件精确控制构图，是 SD 可控生成的关键扩展。" },
  { term: "WebUI", en: "AUTOMATIC1111 / A1111", cat: "工具", desc: "最流行的 SD 图形界面，功能全面、插件丰富，适合新手到进阶。" },
  { term: "ComfyUI", en: "ComfyUI", cat: "工具", desc: "节点式 SD 工作流工具，灵活强大、可复用工作流，是进阶与专业用户首选。" },
  { term: "整合包", en: "Integration Package", cat: "工具", desc: "民间打包的『开箱即用』SD 环境，含模型/插件/依赖，免去配置烦恼，新手友好。" },
  { term: "Civitai", en: "Civy", cat: "社区", desc: "全球最大的 SD 模型/LoRA 分享社区，附带示例图与提示词，是找资源第一站。" },
  { term: "Hugging Face", en: "HF", cat: "社区", desc: "开源模型托管平台，AI 界的 GitHub，可下载各类模型、数据集与 Space 在线体验。" },
  { term: "CheckPoint", en: "CP / 大模型", cat: "资源", desc: "完整的 SD 基础模型文件，通常 2–7GB，决定整体画风，可叠加 LoRA。" },
  { term: "Embedding", en: "嵌入", cat: "资源", desc: "Textual Inversion 训练产物，几 KB 到几十 KB 的小文件，代表一个概念/风格。" },
  { term: "VAE", en: "VAE 文件", cat: "资源", desc: "解码器权重，影响色彩与细节，常作为独立文件加载以提升画面质量。" },
  { term: "ControlNet 模型", en: "ControlNet Model", cat: "资源", desc: "针对每种控制条件（线稿/深度/姿态）单独训练的权重文件。" },
  { term: "工作流", en: "Workflow", cat: "工具", desc: "ComfyUI 中由节点连接组成的可复用生图流程，可保存为 JSON 分享。" },
  { term: "NLP", en: "Natural Language Processing", cat: "原理", desc: "自然语言处理，AI 生图中负责理解提示词，CLIP/文本编码器即属此范畴。" },
  { term: "图生图强度", en: "Denoising Strength", cat: "基础", desc: "图生图时改变原图的程度，0=不变，1=完全重画，常用 0.3–0.7。" },
  { term: "Hires.fix", en: "高清修复", cat: "基础", desc: "先低分辨率生成再放大细化的两步流程，常用放大算法补足细节。" },
  { term: "ADetailer", en: "After Detailer", cat: "微调", desc: "自动检测面部/手部并局部重绘修复的插件，解决崩坏问题。" },
];

/* ---------- 主内容模块 ---------- */
const SECTIONS = [

/* ======================= 1. 入门基础 ======================= */
{
  id: "basics",
  title: "入门基础",
  en: "Getting Started",
  icon: "◐",
  color: "#00ffc8",
  summary: "从零开始认识 AI 生图：它是什么、怎么来的、能做什么、核心术语速览。",
  sections: [
    {
      heading: "什么是 AI 生图",
      paragraphs: [
        "AI 生图（AI Image Generation），指利用人工智能模型，根据用户提供的输入（最常见是一段文字描述，也可以是一张参考图、一个线稿、一段声音等）自动生成图像的技术。",
        "它的核心特征是『生成』而非『检索』：模型并不是从图库里找一张图给你，而是从随机噪声开始，一笔一笔地『画』出全新的图像。这意味着每次生成的结果都是独一无二的，理论上可以生成无穷无尽的、世界上从未存在过的画面。",
        "对零基础用户来说，记住一句话就够了：你用文字描述想要的画面，AI 帮你把它『画』出来。这就是当前最主流的『文生图（Text-to-Image）』。"
      ],
      callout: { type: "key", title: "一句话理解", text: "AI 生图 = 用文字（或图片）当『咒语』，让模型当场『画』出一张全新的图。" }
    },
    {
      heading: "AI 生图简史",
      paragraphs: [
        "AI 生成图像并非一夜之间出现。早在 2014 年，生成对抗网络（GAN）就让 AI 第一次能生成以假乱真的图像，但可控性差、分辨率低。2015 年起，变分自编码器（VAE）和后续的扩散理论逐步成熟。",
        "真正的转折点是 2021–2022 年：OpenAI 推出 DALL·E 与 GLIDE，Google 提出 Imagen，Stability AI 在 2022 年 8 月开源 Stable Diffusion（SD）。SD 开源、可在消费级显卡上运行，瞬间引爆了全民 DIY 生图的热潮。",
        "2023 年起，Midjourney 凭艺术质感出圈、DALL·E 3 借 ChatGPT 大幅降低提示词门槛、LoRA 与 ControlNet 让 SD 可控性飞跃。AI 生图从『能出图』走向『能精细控制』。"
      ],
      list: { title: "关键时间节点", items: [
        "2014 — GAN 提出，生成式 AI 起步",
        "2020 — DDPM 论文奠定现代扩散模型基础",
        "2021.01 — OpenAI 发布 DALL·E（初代）",
        "2022.04 — OpenAI DALL·E 2 发布",
        "2022.07 — Midjourney 公测，艺术风格走红",
        "2022.08 — Stable Diffusion 开源，全民 DIY 时代开启",
        "2023.01 — DALL·E 3 与 ChatGPT 集成，提示词门槛骤降",
        "2023.02 — ControlNet 发布，可控生成革命",
        "2023 至今 — SDXL、SD3、Flux 等新基座不断涌现，生态持续繁荣"
      ]}
    },
    {
      heading: "AI 生图能做什么 & 不能做什么",
      paragraphs: [
        "能做：插画、概念图、头像、海报素材、风格迁移、线稿上色、局部重绘、图像放大、批量素材生成等。对个人创作者和小团队，它能显著降低视觉产出成本。",
        "不能做（或要谨慎）：精确的文字渲染（多数模型对文字仍不可靠，Flux 等新模型有改善）、严格透视与几何精度的工程图、需要稳定一致角色跨场景的连续漫画（虽有 LoRA/ControlNet 辅助但仍难）、以及对真实人物形象的可控修改（涉及伦理与版权）。",
        "更重要的是：AI 生图是『协作工具』而非『一键替代』。它最强大的用法是放大人的创意，而不是替你做决定。"
      ],
      callout: { type: "warn", title: "新手避坑", text: "不要期待『一句咒语出神图』。提示词工程 + 参数调节 + 后期修图，才是真正出好图的完整流程。" }
    },
    {
      heading: "核心术语速览",
      paragraphs: [
        "下面这些词在你接触任何一款 AI 生图工具时都会反复出现，先建立印象即可，后续章节会逐一深入。"
      ],
      table: {
        title: "高频术语表",
        head: ["术语", "英文", "一句话解释"],
        rows: [
          ["提示词", "Prompt", "你写给 AI 的指令文字，决定生成什么"],
          ["种子", "Seed", "随机起点，相同种子可复现同一张图"],
          ["采样步数", "Steps", "去噪迭代次数，常用 20–40"],
          ["采样器", "Sampler", "去噪算法，影响质感与速度"],
          ["CFG", "CFG Scale", "提示词引导强度，常用 5–12"],
          ["图生图强度", "Denoising", "图生图时改变原图程度，0–1"],
          ["LoRA", "LoRA", "小型微调文件，改画风/角色"],
          ["ControlNet", "ControlNet", "用线稿/姿态等精确控制构图"],
          ["VAE", "VAE", "影响色彩与细节的解码器"],
          ["CheckPoint", "CP", "基础大模型，决定整体风格"]
        ]
      }
    }
  ]
},

/* ======================= 2. 技术原理 ======================= */
{
  id: "principles",
  title: "技术原理",
  en: "Under the Hood",
  icon: "❖",
  color: "#7c5cff",
  summary: "从神经元到扩散模型：理解 AI 是怎么『画』出图来的。硬核但不劝退。",
  sections: [
    {
      heading: "神经网络：AI 的『大脑细胞』",
      paragraphs: [
        "神经网络（Neural Network）是一种受生物神经元启发的计算模型。它的基本单元是『神经元/节点』，每个节点接收若干输入，加权求和后经过一个激活函数输出结果。大量节点按层堆叠，就构成了网络。",
        "关键概念：权重（weight）是节点间连接的强度，训练就是不断调整权重；偏置（bias）给节点一个基础阈值；激活函数（如 ReLU）引入非线性，让网络能拟合复杂关系。一层层传递后，网络能学到从简单边缘到复杂语义的层层抽象特征。",
        "对图像而言，传统全连接网络把图像拍平成一维向量输入，参数量爆炸且丢失空间结构。于是专门处理图像的 CNN 登场。"
      ],
      callout: { type: "info", title: "直觉理解", text: "把神经网络想象成一个『调音台』：输入是原始信号，中间无数旋钮（权重）决定每个频段强弱，训练就是让 AI 自动把旋钮调到能输出正确答案的位置。" }
    },
    {
      heading: "卷积神经网络（CNN）",
      paragraphs: [
        "卷积神经网络（CNN, Convolutional Neural Network）专门为图像设计。它的核心是『卷积核（Convolution Kernel / Filter）』——一个很小的权重矩阵（比如 3×3），在图像上从左到右、从上到下滑动扫描，每扫一个位置就和对应像素做乘加运算，输出一个新值。所有位置扫完，得到一张『特征图』。",
        "一个卷积核可以理解为一种『特征探测器』：有的核专找横向边缘，有的找竖向边缘，有的找颜色块、纹理、圆弧。多个核同时扫描，就能并行提取多种特征。",
        "CNN 通常堆叠多层卷积：浅层核找边缘、线条；中层组合出纹理、局部部件（眼睛、车轮）；深层组合出整体语义（人脸、汽车）。这种『从局部到整体』的层级抽象，正是 CNN 强大的原因，也是『卷积核』这个词在 AI 生图教程里反复出现的根源。",
        "尽管 CNN 是图像识别时代的王者，现代生成模型更多采用 Transformer 与扩散结构，但 CNN 的卷积思想仍广泛出现在 VAE 解码器、上采样网络等组件中。"
      ],
      list: { title: "CNN 的三大件", items: [
        "卷积层（Conv）：用卷积核扫描提取特征，权重共享、参数少",
        "池化层（Pooling）：下采样压缩尺寸，保留主要特征、提升鲁棒性",
        "全连接层（FC）：把特征拍平做最终判断（分类/回归）"
      ]}
    },
    {
      heading: "循环神经网络（RNN）与序列",
      paragraphs: [
        "循环神经网络（RNN, Recurrent Neural Network）是为序列数据设计的：文本是一个字接一个字、语音是一帧接一帧。RNN 在处理每一步时，会把上一步的隐藏状态传入当前步，从而拥有『记忆』。",
        "传统 RNN 有长程依赖问题——记不住太久远的信息。后续改进出 LSTM（长短期记忆）和 GRU，用门控机制控制记忆的保留与遗忘，曾长期是 NLP 主力。",
        "但 RNN 必须逐步串行计算，无法高效并行。2017 年 Transformer 出现后，RNN 在大规模任务中基本被取代，但在轻量级、流式任务中仍有用武之地。理解 RNN 有助于理解为什么 AI 生图模型都偏爱 Transformer。"
      ]
    },
    {
      heading: "Transformer 与注意力机制",
      paragraphs: [
        "Transformer 是 2017 年 Google 论文《Attention Is All You Need》提出的架构，核心是『自注意力（Self-Attention）』：对序列中每个元素，计算它和其他所有元素的相关度，然后加权聚合信息。这样模型能直接看到全局关系，且可并行计算。",
        "注意力机制让模型理解『词与词之间的关系』：比如处理『一只猫坐在窗台上』，模型能学到『坐』的动作主体是『猫』、位置是『窗台』，这种语义理解对生成至关重要。",
        "Transformer 一统 NLP（GPT、BERT 都是它）后，又被引入视觉（ViT）。在 AI 生图中，SD 用 CLIP 文本编码器（基于 Transformer）把你的提示词编码成向量；新模型（如 SD3、Flux）更是在去噪网络里也用 Transformer 替代部分 U-Net。"
      ],
      callout: { type: "key", title: "为什么 Transformer 火了", text: "可并行训练（快）+ 长程依赖好（准）+ 可堆叠巨大规模（强）。这三点让它在几乎所有序列/多模态任务中击败 RNN。" }
    },
    {
      heading: "生成对抗网络（GAN）：先驱者",
      paragraphs: [
        "生成对抗网络（GAN, Generative Adversarial Network）由 Ian Goodfellow 在 2014 年提出，思路很巧妙：训练两个网络——生成器 G 和判别器 D，G 负责造假图，D 负责分辨真假，二者对抗博弈，G 越来越像真，D 越来越难辨。",
        "GAN 的优点是生成速度快、分辨率高，曾产出早期惊艳的换脸、超分、风格迁移作品。缺点是训练不稳定、模式坍缩（只会画几种图）、可控性差。",
        "在图像生成领域，GAN 逐步被扩散模型取代。但在实时生成、超分辨率、图像编辑等场景，GAN 及其变体（StyleGAN 系列）仍是重要工具。"
      ]
    },
    {
      heading: "扩散模型：当前主流范式",
      paragraphs: [
        "扩散模型（Diffusion Model）是当前 AI 生图的主流。思路分两步：『前向加噪』——把一张清晰图逐步加随机噪声，最终变成纯噪声；『反向去噪』——训练一个神经网络，学习从噪声一步步还原出图像。",
        "生成时，模型从一张纯随机噪声开始，按学习到的去噪方向反复迭代（即『采样步数 Steps』），逐步『雕刻』出符合提示词的图像。这个『从噪声到图像』的过程，就是 AI 在『画』图。",
        "为什么扩散赢了 GAN？训练稳定、可控性强、质量高、可叠加条件（文字、姿态、深度图）。代价是生成慢（要迭代多步），但通过潜空间扩散（Latent Diffusion）大幅提速。",
        "Stable Diffusion 全称是『Latent Diffusion Model』——它不在像素空间做扩散，而是先用 VAE 把图压到 64×64 的潜空间，在那里做扩散去噪，最后再用 VAE 解码回像素。这就是为什么 SD 能在消费级显卡上跑。"
      ],
      callout: { type: "key", title: "一句话理解扩散", text: "把一张图加噪到看不清，再教 AI 一步步还原。生成时从随机噪声开始还原，还原方向由你的提示词引导。" }
    },
    {
      heading: "VAE 与潜空间",
      paragraphs: [
        "自编码器（VAE, Variational Autoencoder）由编码器与解码器组成：编码器把图像压缩成低维『潜变量』，解码器再从潜变量重建图像。它学到的是数据的『精华表示』。",
        "潜空间（Latent Space）是这个低维表示所在的空间。一张 512×512 的彩色图有约 78 万个像素值，但 SD 把它压到 64×64×4 的潜空间（约 1.6 万维），计算量骤降几十倍，且潜空间中每个维度对应某种语义（颜色、姿态、风格），便于插值与控制。",
        "在 SD 中，VAE 是独立组件：扩散去噪在潜空间完成，生成结束时 VAE 解码器把潜变量还原成你能看到的 PNG 图。这也是为什么『换 VAE』会改变画面色彩与细节——解码器决定了从潜空间到像素的最终映射。"
      ]
    },
    {
      heading: "U-Net：去噪核心",
      paragraphs: [
        "U-Net 是扩散模型去噪网络的主流结构，因结构图形似字母 U 而得名。它由编码器（下采样）和解码器（上采样）组成，中间有『跳跃连接（Skip Connection）』把编码器各层特征直接传给解码器对应层。",
        "这种设计让网络既能看到全局语义（下采样后的低分辨率），又保留局部细节（跳跃连接传过来的高分辨率特征），非常适合图像到图像的任务。",
        "在 SD 中，U-Net 接收『带噪潜变量 + 文本条件向量 + 时间步』，预测『噪声』（或速度/方向），然后据此去噪。SD3、Flux 等新模型部分用 Transformer 块替换 U-Net 内部结构，但整体『条件引导去噪』的思路一致。"
      ]
    },
    {
      heading: "CLIP：让 AI 听懂你的话",
      paragraphs: [
        "CLIP（Contrastive Language-Image Pretraining）是 OpenAI 提出的图文对比学习模型：用海量『图-文配对』训练，让图像编码器和文本编码器在同一空间里对齐，使『猫的图片』和『猫的文字』向量靠近。",
        "这给了 AI 生图一项关键能力——理解你的提示词。SD 用 CLIP 的文本编码器把『a girl with blue hair』编码成向量，注入 U-Net，引导去噪方向，使最终图像符合文字描述。",
        "提示词工程本质就是在『说 CLIP 听得懂的话』：用 CLIP 训练数据中常见的词汇与组合，模型理解更准；用冷僻词或复杂语法，模型可能理解偏差。这也是为什么英文提示词往往比中文效果更好——CLIP 训练数据以英文为主。"
      ]
    },
    {
      heading: "NLP：提示词的幕后",
      paragraphs: [
        "自然语言处理（NLP, Natural Language Processing）是让计算机理解人类语言的领域。在 AI 生图中，NLP 负责『读懂你的提示词』：分词（Tokenization）→ 文本编码（CLIP/T5）→ 注入生成网络。",
        "新模型对长文本的理解越来越强：SD1.5 的 CLIP 只能理解约 75 个 token，SDXL 扩展到双 CLIP，SD3 与 Flux 引入 T5-XXL 这类大语言模型，能理解几百字、复杂句法甚至中英混合的描述。",
        "理解 NLP 的意义：提示词不是『关键词堆砌』，而是『和模型对话』。越懂模型的『语言习惯』，越能精准传达意图。这也是 DALL·E 3 + ChatGPT 的革命——它先帮你把大白话改写成模型最懂的专业提示词，再生成。"
      ],
      callout: { type: "info", title: "技术原理学习建议", text: "零基础不必硬啃论文。记住『扩散去噪 + 潜空间 + CLIP 理解文字 + U-Net 预测噪声』这条主线，就足以理解 90% 的参数与工具行为。" }
    }
  ]
},

/* ======================= 3. 主流模型 ======================= */
{
  id: "models",
  title: "主流模型",
  en: "Models",
  icon: "◆",
  color: "#ff2e88",
  summary: "盘点 Stable Diffusion、DALL·E、Midjourney、NovelAI、Banana AI 等主流模型的特点与定位。",
  sections: [
    {
      heading: "Stable Diffusion（SD）",
      paragraphs: [
        "Stable Diffusion 由 Stability AI 于 2022 年 8 月开源，是 AI 生图开源生态的基石。它基于潜扩散模型（LDM），可在 4GB 显存的消费级显卡上运行，让普通用户也能本地出图，这是它引爆热潮的根本原因。",
        "版本演进：SD 1.4（初代）/1.5（最经典、生态最丰富）→ SD 2.x（版权清理、画风偏写实）→ SDXL（1024 分辨率、质量大幅提升）→ SD3（引入多模态 Transformer、文本理解强）→ SD3.5。社区衍生模型（如 AnythingV3、DreamShaper、二次元/写实向各种 CP）多基于 1.5 或 SDXL 微调。",
        "SD 的最大价值是『开源 + 可本地 + 插件生态』。LoRA、ControlNet、WebUI、ComfyUI 几乎都围绕 SD 构建。缺点：默认画风偏『塑料感』，需调参与微调；提示词门槛较高。"
      ],
      list: { title: "SD 适合谁", items: [
        "想本地出图、重视隐私与可控性的用户",
        "想深度玩 LoRA/ControlNet/工作流的技术爱好者",
        "需要批量、可复现、可商用的创作者",
        "愿意花时间学习配置与提示词的人"
      ]}
    },
    {
      heading: "DALL·E 系列（OpenAI）",
      paragraphs: [
        "DALL·E 是 OpenAI 的文生图系列，DALL·E 3 于 2023 年发布，最大特点是和 ChatGPT 深度集成——你用大白话说『画一只戴墨镜的柴犬在冲浪』，ChatGPT 会自动帮你扩写成专业提示词再调用模型，大幅降低提示词门槛。",
        "优点：理解力强、出图稳定、文字渲染较好、内容安全合规。缺点：闭源、付费（需 ChatGPT Plus 或 API）、风格偏『干净插画感』、可控性不如 SD + ControlNet、不可本地运行。",
        "定位：适合非技术用户、需要快速出概念图、对合规性要求高的商业场景。"
      ]
    },
    {
      heading: "Midjourney",
      paragraphs: [
        "Midjourney 是闭源商业模型，以艺术质感出众著称，尤其擅长摄影、电影感、概念艺术风格。早期通过 Discord 机器人使用，现已推出网页版。",
        "优点：开箱即用、默认美学极高、风格化强、社区活跃。缺点：闭源、付费订阅（10–60 美元/月起）、参数可控性弱于 SD、不可本地、内容审核较严。",
        "定位：设计师、插画师、概念艺术家、追求『一键出大片』的用户。是『省心但花钱』的代表。"
      ],
      callout: { type: "info", title: "SD vs Midjourney", text: "SD = 自由可控但要折腾；MJ = 省心好看出图但花钱不可控。技术党选 SD，效率党选 MJ，二者结合最强。" }
    },
    {
      heading: "NovelAI（NAI）",
      paragraphs: [
        "NovelAI 是面向二次元的付费平台，提供文生图与 AI 写作。其图像模型基于 SD 架构二次训练（早期基于 SD 1.5 衍生，后推出基于 SDXL 的 NAI Diffusion V3 等），在动漫风格、角色一致性、构图理解上表现突出。",
        "核心特色：内置大量动漫角色 LoRA（可通过角色标签触发特定画风/人物）、对二次元提示词语义理解深入、支持『定向编辑』与无限制内容（在合规框架内）。",
        "定位：二次元爱好者、同人创作、需要稳定动漫角色出图的用户。与 SD 二次元微调模型（如 AnythingV3、OrangeMix）形成竞争与互补。"
      ]
    },
    {
      heading: "Banana AI（Banana.dev）",
      paragraphs: [
        "需要区分两个概念：Banana.dev 是面向开发者的『无服务器 GPU』平台，可把 SD 等 ML 模型一键打包成 API 部署，常被用来托管 AI 生图算力——你不必自己买显卡，按调用量付费即可。这是『云算力 + 模型部署』服务，而非一个独立的生图模型。",
        "在 AI 生图语境里，提到『Banana』通常指：开发者用 Banana 这类平台把 SD 部署成后端 API，再套一个网页/小程序前端给用户用。许多国内『即时生图』『在线 AI 画图』站点背后都是这种架构。",
        "定位：想自己搭在线生图服务但不想买卡的极客/小团队；普通用户更多是间接受益者，直接用前端产品即可。同类平台还有 Replicate、RunPod、Modal 等。"
      ],
      callout: { type: "warn", title: "概念辨析", text: "『Banana AI』不是某个画图模型，而是部署/算力服务。别和 NovelAI（二次元画图平台）搞混。" }
    },
    {
      heading: "其他重要模型",
      paragraphs: [
        "Imagen（Google）：闭源，文字理解强，研究中知名，商业产品融入 Gemini/Vertex AI。",
        "Flux（Black Forest Labs，2024）：由原 SD 团队创办，新一代开源/半开源模型，文本理解与生成质量极强，被认为是 SD3 之后的新标杆。",
        "Stable Cascade / Kandinsky / PixArt / HunyuanDiT：各具特色的开源模型，丰富生态。",
        "国产模型：百度文心一格、阿里通义万相、腾讯混元生图、字节豆包/即梦等，中文理解好、合规、适合国内用户与商用。"
      ],
      table: {
        title: "主流模型速览",
        head: ["模型", "开源", "强项", "使用方式", "适合人群"],
        rows: [
          ["Stable Diffusion", "是", "自由可控、生态丰富", "本地 WebUI/ComfyUI", "技术党/创作者"],
          ["DALL·E 3", "否", "理解力强、合规", "ChatGPT/API", "非技术用户"],
          ["Midjourney", "否", "艺术质感、易用", "Discord/网页付费", "设计师/艺术家"],
          ["NovelAI", "否（衍生于SD）", "二次元、角色稳定", "网页订阅", "动漫爱好者"],
          ["Banana.dev", "—（算力平台）", "一键部署模型为API", "开发者API", "极客/小团队"],
          ["Flux", "半开源", "新一代高质量", "本地/云", "进阶用户"],
          ["国产模型", "否", "中文好、合规商用", "网页/API", "国内商用用户"]
        ]
      }
    }
  ]
},

/* ======================= 4. 整合方案与工具 ======================= */
{
  id: "tools",
  title: "整合方案与工具",
  en: "Tools & Platforms",
  icon: "◈",
  color: "#ffb800",
  summary: "WebUI、ComfyUI、民间整合包、云端平台：告诉你用哪个、怎么选。",
  sections: [
    {
      heading: "AUTOMATIC1111 WebUI（A1111）",
      paragraphs: [
        "AUTOMATIC1111 Stable Diffusion WebUI，简称 WebUI 或 A1111，是 SD 最经典、用户最多的图形界面。用 Gradio 构建，提供文生图、图生图、局部重绘、高清修复、LoRA 加载、插件扩展等一站式功能。",
        "优点：界面直观、上手快、插件生态最丰富（Civitai 上几乎每个扩展都有 A1111 版本）、社区教程海量。缺点：核心架构较老，复杂工作流表达力不如 ComfyUI；显存占用相对高。",
        "定位：新手到进阶用户的首选。如果只想『开个软件就开始画』，从 WebUI 开始最稳。"
      ],
      list: { title: "WebUI 必装插件（举例）", items: [
        "中文汉化插件（zh_CN）——界面中文化",
        "OpenPose Editor ——姿态控制",
        "ADetailer ——面部/手部自动修复",
        "Additional Networks ——LoRA 管理",
        "Hidetagger/Tagger ——反推提示词",
        "Ultimate SD Upscale ——图像放大"
      ]}
    },
    {
      heading: "ComfyUI：节点式工作流",
      paragraphs: [
        "ComfyUI 是基于节点（Node）的 SD 工作流工具。它把生图过程拆解为一个个节点：加载模型 → CLIP 编码提示词 → 空Latent → KSampler 采样 → VAE 解码 → 保存图像，节点之间用线连接，组成完整流程。",
        "优点：极度灵活，任意拼装复杂流程（多 LoRA 叠加、ControlNet 组合、图生图+局部重绘+放大一条龙）；显存占用低（按需加载）；工作流可保存为 JSON 分享复用；新模型/新功能往往先在 ComfyUI 出现。",
        "缺点：学习曲线陡，新手面对一堆节点易劝退；调试复杂。但一旦入门，效率远超 WebUI。",
        "定位：进阶/专业用户、需要复用工作流、想玩最新特性的人。SD3、Flux 等新模型在 ComfyUI 上支持最好。"
      ],
      callout: { type: "key", title: "WebUI vs ComfyUI", text: "新手从 WebUI 起步，能稳定出图后再学 ComfyUI。两者不冲突，可共存于同一台机器，共享模型文件。" }
    },
    {
      heading: "民间整合包（开箱即用）",
      paragraphs: [
        "整合包是民间大神打包好的『SD 全套环境』，含软件本体、常用插件、模型、Python 环境与依赖，下载解压即可运行，免去手动配置环境、装依赖、下模型的各种坑。对零基础新手极度友好。",
        "国内最知名的整合包是『秋叶整合包』（bilibili up 主秋制作品），基于 A1111 WebUI，含中文界面、常用插件、模型管理器、启动器等，是国内 SD 入门事实标准。此外还有『炼丹阁』『绘世启动器』等。",
        "ComfyUI 也有整合包，如『ComfyUI 秋叶整合包』。整合包的代价：体积大（动辄数十 GB）、更新滞后于官方、可能捆绑特定插件版本。但对新手，省心远比这些重要。",
        "使用建议：先下整合包入门 → 用熟后可迁移到官方原版（更好维护、更新及时、可控）。整合包只是起点，不是终点。"
      ],
      callout: { type: "warn", title: "整合包注意", text: "只从官方/可信渠道下载（作者 B 站主页、官方群），警惕第三方网盘捆绑病毒/挖矿。下整合包前先看更新日志与评论区反馈。" }
    },
    {
      heading: "云端平台与在线服务",
      paragraphs: [
        "没有显卡或不想配置？云端方案分两类：①在线成品站点（如即梦、文心一格、Midjourney 网页版、Civitai 在线生成），开箱即用但灵活度低；②云算力平台（RunPod、AutoDL、矩池云、Colab、Banana 等），租用 GPU 跑你自己的 SD/ComfyUI，灵活但需懂操作。",
        "推荐路径：零基础先用免费在线站点（即梦/Civitai/MJ 试用）感受效果 → 想深度玩就租云 GPU 跑 ComfyUI，或买张二手显卡本地跑。云 GPU 按小时计费，体验一周成本可能就几十块。",
        "对国内用户：AutoDL、矩池云等国内平台延迟低、支付方便，预置 SD/ComfyUI 镜像，开机即用，是本地无卡时的首选。"
      ],
      table: {
        title: "工具/平台选择速查",
        head: ["场景", "推荐方案"],
        rows: [
          ["纯小白，只想体验出图", "在线站点（即梦/Civitai/MJ试用）"],
          ["想本地玩，零配置", "秋叶整合包（WebUI）"],
          ["想深度可控、复用工作流", "ComfyUI（整合包入门→官方原版）"],
          ["无显卡但想玩本地级灵活度", "国内云 GPU（AutoDL/矩池云）"],
          ["要部署成自己的在线服务", "Banana/Replicate/RunPod + API"],
          ["商业合规、要省心", "国产商用模型（文心一格/通义/即梦）"]
        ]
      }
    }
  ]
},

/* ======================= 5. 微调与扩展 ======================= */
{
  id: "fine-tuning",
  title: "微调与扩展",
  en: "Fine-tuning & Control",
  icon: "✦",
  color: "#00d4ff",
  summary: "LoRA、ControlNet、DreamBooth、提示词工程：让 AI 听话的关键技术。",
  sections: [
    {
      heading: "LoRA：最流行的微调方式",
      paragraphs: [
        "LoRA（Low-Rank Adaptation）是一种『低秩适配』微调方法：不修改原模型全部权重，而是在某些层旁挂一个极小的『低秩矩阵』，只训练这个小矩阵即可改变模型行为。一个 LoRA 文件通常只有几十到几百 MB，相比动辄几个 GB 的基础模型，小巧到可随手分享。",
        "用途：训练特定角色（如某个 OC、某个真人风格）、特定画风（油画/水彩/某画师风）、特定物件（某种武器/服饰/建筑）。叠加到基础模型上即可生效，可同时叠加多个 LoRA 并调权重。",
        "为什么 LoRA 火？小（易分享）、快（训练快、显存要求低）、灵活（随意叠加组合）、效果惊艳（角色还原度极高）。Civitai 上 LoRA 是数量最多的资源类型。"
      ],
      callout: { type: "info", title: "使用口诀", text: "选基础模型（CP）定整体画风 → 选 LoRA 定角色/物件/特定风格 → 用 ControlNet 定构图姿态 → 三者叠加，可控生图。" }
    },
    {
      heading: "DreamBooth 与 Textual Inversion",
      paragraphs: [
        "DreamBooth：把特定主体（如你的宠物、某品牌产品）训练进模型的方法，比 LoRA 改得更深、效果更稳定，但显存要求高、易过拟合。常用于『让模型记住某个特定角色/物品』。",
        "Textual Inversion（TI，文本反演/嵌入）：学一个新『词向量』代表某概念，文件极小（几 KB～几十 KB）。适合定义风格、角色，但训练慢、表达力弱于 LoRA，现已较少作为主力，但在小内存场景仍实用。",
        "Hypernetwork：在小规模层插入微调网络，效果介于 TI 与 LoRA 之间，早期 NovelAI 风格微调常用，现已基本被 LoRA 取代。"
      ],
      table: {
        title: "微调方法对比",
        head: ["方法", "文件大小", "训练难度", "效果强度", "适用场景"],
        rows: [
          ["LoRA", "几十~几百MB", "中", "强", "角色/画风/物件，主流首选"],
          ["DreamBooth", "改整模型(GB)", "高", "很强", "特定主体深度记忆"],
          ["Textual Inversion", "KB级", "低/慢", "弱-中", "轻量风格/概念定义"],
          ["Hypernetwork", "MB级", "中", "中", "已较少用，历史方案"],
          ["ControlNet", "GB级(每类)", "中", "控制极强", "构图/姿态/边缘控制"]
        ]
      }
    },
    {
      heading: "ControlNet：精确控制构图",
      paragraphs: [
        "ControlNet 是 2023 年初发布的革命性扩展，让 SD 从『只能描述要什么』进化到『能精确控制怎么画』。它通过额外输入条件（线稿、深度图、法线图、姿态骨架、涂色块等）引导生成，使输出严格遵循指定结构。",
        "典型用法：①Canny/线稿——保持构图轮廓；②OpenPose——控制人物姿态/手势；③Depth——按深度层次构图；④Segmentation——按色块分区；⑤Scribble/T2I-Adapter——手绘草图变成品。",
        "意义：解决了 SD 长期被诟病的『不可控』问题。配合 LoRA，你可以『用指定角色 + 指定姿态 + 指定构图』出图，从随机盲抽走向精准创作。"
      ]
    },
    {
      heading: "提示词工程（Prompt Engineering）",
      paragraphs: [
        "提示词工程是『用模型听得懂的话和它对话』的技艺。基础模型 + 好 LoRA + 烂提示词 = 烂图；基础模型 + 好 LoRA + 好提示词 = 神图。可见其重要性。",
        "常见结构：主体描述 → 细节修饰（服饰/表情/动作）→ 环境场景 → 光影/镜头 → 风格/画质词。例：『1girl, solo, blue hair, school uniform, smiling, sitting on bench, sunny park, bokeh, depth of field, masterpiece, best quality, ultra-detailed』。",
        "反向提示词（Negative Prompt）：写你不要的，如『worst quality, low quality, bad anatomy, extra fingers, blurry, watermark, text』，能显著降低崩坏率。许多整合包内置通用反向词模板。",
        "技巧：①用 CLIP 训练数据常见词（英文、Danbooru 标签）；②从简单开始逐步加词对比效果；③用 Tagger（反推）从参考图自动生成提示词；④善用 LoRA 触发词。"
      ],
      callout: { type: "key", "title": "新手提示词心法", text: "主体清晰 → 风格明确 → 反向词兜底 → 多抽几张挑。比『背一长串咒语』更重要。" }
    },
    {
      heading: "放大与高清修复",
      paragraphs: [
        "AI 生图默认分辨率有限（SD1.5 约 512×512，SDXL 约 1024×1024）。要更高分辨率需放大：①Hires.fix——先低分辨率生成再放大细化；②Tiled VAE/Upscaler——分块放大避免显存爆；③专用放大模型（ESRGAN、R-ESRGAN、4x-UltraSharp）。",
        "ADetailer（After Detailer）：生成后自动检测面部/手部并局部重绘修复，解决 SD 经典的『脸崩手崩』问题，几乎是必装插件。",
        "工作流示例（ComfyUI）：文生图 → 放大 1.5x → ADetailer 修脸 → 二次细化 → 出图。一条龙，可保存复用。"
      ]
    }
  ]
},

/* ======================= 6. 社区与生态 ======================= */
{
  id: "community",
  title: "社区与生态",
  en: "Community & Ecosystem",
  icon: "◉",
  color: "#7c5cff",
  summary: "Civitai、HuggingFace、国内社区：找模型、找教程、找灵感的地方。",
  sections: [
    {
      heading: "Civitai：模型分享第一站",
      paragraphs: [
        "Civitai（社区昵称 Civy）是全球最大的 Stable Diffusion 模型/LoRA/Embedding/资源分享社区。用户上传模型、展示示例图、附带提示词，其他用户可一键下载并复现。是找资源、找灵感的首选。",
        "核心功能：①模型分类（CheckPoint/LoRA/VAE/ControlNet/Embedding）；②示例图墙（Civitai 上的图都是社区真实生成，附参数可复现）；③模型评分/评论/下载统计；④在线生成（部分模型可在线试）。",
        "使用建议：先看示例图墙找喜欢的画风 → 点开对应模型看说明（触发词、推荐参数）→ 下载 → 在 WebUI/ComfyUI 加载使用。新手 90% 的模型都来自这里。"
      ]
    },
    {
      heading: "Hugging Face：AI 界的 GitHub",
      paragraphs: [
        "Hugging Face（HF）是开源模型/数据集/在线应用（Spaces）的托管平台，被誉为『AI 界的 GitHub』。几乎所有开源 AI 模型（SD、Flux、LLM 等）都托管在这里。",
        "对 AI 生图用户：①下载基础模型（如 SD、Flux 官方权重）；②体验 Spaces（在线 Demo，可直接试模型）；③找数据集与训练工具。Civitai 偏社区微调模型，HF 偏官方/研究模型。",
        "使用：注册账号 → 搜索模型名 → 选对应版本（注意 License）→ 下载 .safetensors 文件。配合 huggingface-cli 或 git-lfs 批量下载更方便。"
      ]
    },
    {
      heading: "国内社区与资源",
      paragraphs: [
        "国内生态同样活跃：①B 站（bilibili）——AI 生图教程/整合包/模型测评第一视频阵地（秋叶、神眷、Nite 等 UP 主）；② Liblib（哩布哩布）——国内版 Civitai，模型集中、国内访问快、部分模型可在线生成；③ 魔搭（ModelScope，阿里）——开源模型托管，国产模型集中地。",
        "④ 即梦（字节）/文心一格（百度）/通义万相（阿里）/腾讯混元——商用在线生图，中文友好、合规；⑤ 吐司（Tusi）等社区——国内二次元/创作者社区。⑥ 各类 QQ/微信群——整合包用户聚集地，新手答疑快。",
        "建议路径：B 站看教程入门 → 下整合包 → Civitai/Liblib 找模型 → HF/魔挑找官方权重 → 国产站点做商用。"
      ]
    },
    {
      heading: "AI 生图生态全景",
      paragraphs: [
        "一张图理解整个生态的层次关系："
      ],
      list: { title: "生态分层（自下而上）", items: [
        "底层算法：扩散模型、Transformer、CLIP（学术研究）",
        "基础模型：SD/Flux/DALL·E/MJ 等官方权重（厂商发布）",
        "微调生态：LoRA/ControlNet/DreamBooth/Embedding（社区训练）",
        "工具链：WebUI/ComfyUI/整合包（开发者构建）",
        "算力层：本地显卡 / 云 GPU（Banana/RunPod/AutoDL 等）",
        "社区平台：Civitai/HF/Liblib（资源分发与展示）",
        "应用层：在线站点/API/商用产品（面向终端用户）"
      ]}
    }
  ]
},

/* ======================= 7. 模型对比 ======================= */
{
  id: "compare",
  title: "对比速查",
  en: "Comparison",
  icon: "▤",
  color: "#00ffc8",
  summary: "横向对比主流模型、工具、微调方法，帮你快速做选择。",
  sections: [
    {
      heading: "主流生图模型对比",
      paragraphs: ["综合维度横向对比，便于按需选择。"],
      table: {
        title: "模型横向对比",
        head: ["维度", "Stable Diffusion", "DALL·E 3", "Midjourney", "NovelAI", "Flux"],
        rows: [
          ["开源", "是", "否", "否", "衍生于SD", "半开源"],
          ["本地运行", "可", "不可", "不可", "不可", "可"],
          ["画风自由度", "极高", "中", "高(艺术向)", "高(二次元)", "高"],
          ["可控性", "极强(ControlNet/LoRA)", "弱", "弱", "中", "中-强"],
          ["提示词门槛", "高", "极低(ChatGPT)", "中", "中", "中"],
          ["文字渲染", "差", "较好", "中", "差", "强"],
          ["成本", "显卡/云GPU", "订阅", "订阅", "订阅", "显卡/云"],
          ["适合", "技术党/创作者", "非技术用户", "设计师", "动漫党", "进阶"]
        ]
      }
    },
    {
      heading: "工具链对比",
      paragraphs: ["WebUI vs ComfyUI vs 整合包，三者并非互斥，常组合使用。"],
      table: {
        title: "工具对比",
        head: ["维度", "WebUI(A1111)", "ComfyUI", "整合包"],
        rows: [
          ["上手难度", "低-中", "高", "极低"],
          ["灵活性", "中", "极高", "中(随基座)"],
          ["显存占用", "较高", "低", "随基座"],
          ["新模型支持", "中", "快(最早)", "滞后"],
          ["工作流复用", "弱", "极强(JSON)", "弱"],
          ["插件生态", "最丰富", "快速增长", "预置常用"],
          ["定位", "新手到进阶", "专业/进阶", "零基础入门"]
        ]
      }
    },
    {
      heading: "微调方法对比",
      paragraphs: ["不同方法各有适用场景，可组合使用。"],
      table: {
        title: "微调方法对比",
        head: ["方法", "体积", "训练成本", "效果", "典型用途"],
        rows: [
          ["LoRA", "小", "中", "强", "角色/画风/物件，主流"],
          ["DreamBooth", "大", "高", "很强", "特定主体深度记忆"],
          ["Textual Inversion", "极小", "低但慢", "弱-中", "轻量概念定义"],
          ["Hypernetwork", "中", "中", "中", "已较少用"],
          ["ControlNet", "大", "中", "控制极强", "构图/姿态/边缘控制"],
          ["提示词工程", "无", "无", "中-强", "零成本提升质量"]
        ]
      }
    }
  ]
},

/* ======================= 8. 学习路径 ======================= */
{
  id: "learning",
  title: "学习路径",
  en: "Learning Path",
  icon: "➤",
  color: "#ff2e88",
  summary: "为零基础到进阶用户设计的分阶段学习路线与资源清单。",
  sections: [
    {
      heading: "阶段一：入门体验（1–3 天）",
      paragraphs: [
        "目标：建立直觉，感受 AI 生图能做什么，不被技术细节劝退。",
        "行动：用免费在线站点（即梦/Civitai 在线生成/Midjourney 试用）出几十张图；尝试不同提示词观察效果差异；浏览 Civitai/Liblib 首页找喜欢的画风。"
      ],
      list: { title: "阶段一 checklist", items: [
        "用在线工具出 50+ 张图，体感提示词与出图关系",
        "理解 Prompt / Negative Prompt / Seed / Steps / CFG",
        "能复现别人分享的一张图（用相同参数）",
        "浏览 Civitai 找到 3 个喜欢的画风模型"
      ]}
    },
    {
      heading: "阶段二：本地化与工具（1–2 周）",
      paragraphs: [
        "目标：在本地或云 GPU 上跑通 SD，掌握一款主力工具。",
        "行动：下秋叶整合包（WebUI）或 ComfyUI 整合包；加载一两个 Civitai 模型；学会用 LoRA、调参、保存预设；尝试图生图、局部重绘、高清修复。"
      ],
      list: { title: "阶段二 checklist", items: [
        "本地能稳定出图，掌握 WebUI 主要面板",
        "能加载 LoRA 并调权重，叠加多个 LoRA",
        "掌握图生图、局部重绘、Hires.fix",
        "装上 ADetailer、Tagger、ControlNet 等核心插件",
        "了解 ComfyUI 基础节点，能跑通一个简单工作流"
      ]}
    },
    {
      heading: "阶段三：可控生成（2–4 周）",
      paragraphs: [
        "目标：从『盲抽』走向『精准创作』，掌握 ControlNet 与工作流。",
        "行动：系统学 ControlNet 各类条件（线稿/姿态/深度）；用 ComfyUI 搭建可复用工作流；尝试训练一个简单 LoRA（用 Kohya_ss 等工具）；研究提示词工程。"
      ],
      list: { title: "阶段三 checklist", items: [
        "能用 OpenPose 控制人物姿态",
        "能用线稿/深度图控制构图",
        "在 ComfyUI 搭建『文生图→放大→修脸』完整工作流",
        "训练一个自己的 LoRA（角色或画风）",
        "理解扩散/U-Net/CLIP 原理，能看懂参数背后的含义"
      ]}
    },
    {
      heading: "阶段四：进阶与创作（持续）",
      paragraphs: [
        "目标：形成个人创作体系，深度玩最新模型与生态。",
        "行动：尝试 Flux/SD3 等新模型；研究 IP-Adapter、AnimateDiff（视频）、SVD 等扩展；部署自己的在线生图服务（Banana/Replicate）；做长期创作项目。"
      ],
      list: { title: "阶段四 checklist", items: [
        "能流畅使用 ComfyUI 复杂工作流（节点 30+）",
        "掌握 IP-Adapter/风格迁移/参考图控制",
        "尝试 AI 视频/动画（AnimateDiff/SVD）",
        "用云平台部署 SD 为 API（Banana/Replicate）",
        "形成稳定画风与创作主题，可持续输出作品"
      ]}
    },
    {
      heading: "推荐学习资源",
      paragraphs: [],
      list: { title: "资源清单", items: [
        "B 站：秋叶 sd 教程、神眷 ComfyUI、Nite 系列——国内入门首选",
        "Civitai：模型与示例图，最大资源库",
        "Hugging Face：官方模型与 Spaces 在线体验",
        "GitHub：AUTOMATIC1111/stable-diffusion-webui、comfyanonymous/ComfyUI",
        "论文：DDPM、Latent Diffusion（SD 基础）、CLIP、ControlNet、LoRA",
        "社区：Reddit r/StableDiffusion、Discord 各模型官方群、国内 QQ/微信群"
      ]}
    }
  ]
},

/* ======================= 9. 术语表 ======================= */
{
  id: "glossary",
  title: "术语表",
  en: "Glossary",
  icon: "▤",
  color: "#ffb800",
  summary: "A-Z 风格的术语速查表，遇到不认识的词就来翻一翻。",
  sections: [
    {
      heading: "按类别浏览",
      paragraphs: [
        "共收录 " + GLOSSARY.length + " 个高频术语，按类别分组，便于查找。点击术语可展开详细解释。"
      ],
      render: "glossary"
    }
  ]
},

/* ======================= 10. 常见问题 ======================= */
{
  id: "faq",
  title: "常见问题",
  en: "FAQ",
  icon: "?",
  color: "#00d4ff",
  summary: "新手最常问的问题与权威解答，避免踩坑。",
  sections: [
    {
      heading: "硬件与配置",
      paragraphs: [],
      faq: [
        { q: "AI 生图需要什么显卡？", a: "入门：NVIDIA GTX 1060 6GB 可跑 SD1.5（512 分辨率）；主流：RTX 3060 12GB / 4060 8GB 体验良好，可玩 SDXL；进阶：RTX 4080/4090 24GB+ 跑 Flux/SD3 无压力。显存比算力更重要，显存不够会爆显存无法出图。AMD/Intel 显卡支持有限，建议优先 NVIDIA。" },
        { q: "没有显卡能玩吗？", a: "能。①在线站点（即梦/Civitai 在线/MJ）零门槛；②云 GPU（AutoDL/矩池云/Colab）按小时租，预置镜像开机即用；③国产在线生图站点（文心一格/通义/即梦）合规商用。无卡用户从云 GPU 起步性价比最高。" },
        { q: "Mac 能跑 SD 吗？", a: "能但体验不如 N 卡。Apple Silicon（M1/M2/M3）可跑 SD，ComfyUI 对 MPS 支持较好，速度约为 RTX 3060 的一半到三分之一，适合轻度使用。Intel Mac 不推荐。" }
      ]
    },
    {
      heading: "模型与使用",
      paragraphs: [],
      faq: [
        { q: "safetensors 和 ckpt 有什么区别？", a: "都是模型文件格式。safetensors 更安全（不会执行恶意代码）、加载快，是当前推荐格式；ckpt 是老格式，有潜在安全风险。下载优先选 safetensors。" },
        { q: "LoRA 怎么用？", a: "把 LoRA 文件放到 models/Lora 目录，重启 WebUI/ComfyUI，在提示词里用 <lora:文件名:权重> 触发，或用界面按钮加载。权重默认 1，太强易崩坏，太弱无效，常用 0.5–0.8，可叠加多个。" },
        { q: "为什么我出的图很丑？", a: "排查顺序：①基础模型是否合适（别用写实模型出二次元）；②提示词是否清晰（主体+风格+画质词）；③参数是否合理（Steps 20–35、CFG 5–8、合适采样器如 DPM++ 2M Karras）；④是否加载合适 VAE；⑤是否用了反向提示词；⑥是否需要 ADetailer 修脸。多抽多调，别期待一次出神图。" },
        { q: "中文提示词行不行？", a: "SD1.5/SDXL 基于 CLIP（英文为主），中文效果差，建议用英文或 Danbooru 标签。SD3/Flux 引入 T5 等 LLM，中英混合理解较好。新手可用 Tagger 反推或用 ChatGPT 翻译提示词。" },
        { q: "出图总是崩脸崩手怎么办？", a: "①装 ADetailer 自动修复面部/手部；②用 ControlNet OpenPose 控制姿态；③用反向提示词排除 bad anatomy/extra fingers；④提高分辨率后局部重绘；⑤换更好的基础模型或 LoRA。" }
      ]
    },
    {
      heading: "版权与商用",
      paragraphs: [],
      faq: [
        { q: "AI 生成的图能商用吗？", a: "看模型 License。SD 系列多允许商用（CreativeML Open RAIL-M 等）；MJ/DALL·E 视订阅等级；NovelAI 有自己的条款。务必查模型页面的 License 说明，Civitai 模型也要看作者声明的使用范围。商用前最好咨询法律意见。" },
        { q: "用真人照片训练 LoRA 合法吗？", a: "涉及肖像权与人格权，未经本人同意训练/发布真人 LoRA 通常违法，国内尤其严格。请只训练自己拥有版权的角色/画风，或使用明确授权的素材。" },
        { q: "训练的 LoRA 可以卖吗？", a: "看基础模型与训练数据 License。SD 系列多数允许商用 LoRA，但若训练数据用了他人的受版权保护作品，发布/售卖可能侵权。开源/免费分享更安全。" }
      ]
    },
    {
      heading: "概念辨析",
      paragraphs: [],
      faq: [
        { q: "NovelAI 和 Stable Diffusion 啥关系？", a: "NovelAI 的图像模型基于 SD 架构二次训练/微调，专注二次元，是 SD 生态的衍生分支。但 NovelAI 是闭源付费平台，不公开其训练后的权重，你下载不到『NovelAI 官方模型』，社区有模仿其画风的衍生模型（如 AnythingV3）。" },
        { q: "Banana AI 是画图模型吗？", a: "不是。Banana.dev 是把 ML 模型（如 SD）部署成 API 的云算力平台。提到『Banana』在生图语境通常指用它托管 SD 的后端服务，而非一个独立模型。" },
        { q: "WebUI 和 ComfyUI 是同一个东西吗？", a: "不是。WebUI（A1111）是传统表单式界面，上手快；ComfyUI 是节点式，灵活但难入门。两者都是 SD 的图形前端，可共存共享模型文件。新手从 WebUI 起步，进阶学 ComfyUI。" },
        { q: "LoRA、CheckPoint、VAE 有什么区别？", a: "CheckPoint 是完整基础模型（几 GB，定整体画风）；LoRA 是小补丁（几十~几百 MB，定角色/画风/物件，叠加在 CP 上）；VAE 是解码器（影响色彩细节，可独立加载）。三者层次：CP 主宰 → LoRA 微调 → VAE 调色。" }
      ]
    }
  ]
},

/* ======================= 11. 官方资源 ======================= */
{
  id: "resources",
  title: "官方资源",
  en: "Resources",
  icon: "⛓",
  color: "#00d4ff",
  summary: "内容中涉及的全部工具、模型、框架与平台的官方链接与权威资源，便于直接访问深入了解。",
  sections: [
    {
      heading: "按类别浏览官方资源",
      paragraphs: [
        "下方按类别整理了本站内容涉及的主要基础模型、工具界面、微调技术、社区平台、算力服务与学习资源的官方入口。每个条目附核心定位说明，链接直达官网、文档或社区。"
      ],
      render: "resources"
    }
  ]
}

];

/* ---------- 官方资源数据（按类别分组） ---------- */
const RESOURCES = [

  { cat: "基础模型", color: "#ff2e88", items: [
    { name: "Stable Diffusion", role: "开源潜扩散模型，SD 生态核心", links: [
      { label: "官网 Stability AI", url: "https://stability.ai/" },
      { label: "模型库 HF", url: "https://huggingface.co/stabilityai" },
      { label: "论文 Latent Diffusion", url: "https://arxiv.org/abs/2112.10752" }
    ]},
    { name: "DALL·E 3", role: "OpenAI 文生图，与 ChatGPT 集成，理解力强", links: [
      { label: "官网", url: "https://openai.com/dall-e-3" },
      { label: "API 文档", url: "https://platform.openai.com/docs/guides/images" }
    ]},
    { name: "Midjourney", role: "闭源商业模型，艺术质感出众", links: [
      { label: "官网", url: "https://www.midjourney.com" },
      { label: "文档", url: "https://docs.midjourney.com/" }
    ]},
    { name: "NovelAI", role: "面向二次元的付费文生图/写作平台", links: [
      { label: "官网", url: "https://novelai.net" },
      { label: "文档", url: "https://docs.novelai.net/" }
    ]},
    { name: "Flux", role: "新一代高质量开源/半开源模型，原 SD 团队创办", links: [
      { label: "官网 Black Forest Labs", url: "https://blackforestlabs.ai/" },
      { label: "模型库 HF", url: "https://huggingface.co/black-forest-labs" }
    ]},
    { name: "Imagen (Google)", role: "Google 文生图研究模型，文字理解强", links: [
      { label: "产品页", url: "https://deepmind.google/models/imagen-3/" }
    ]},
    { name: "文心一格", role: "百度文生图，中文友好、合规商用", links: [
      { label: "官网", url: "https://yige.baidu.com" }
    ]},
    { name: "通义万相", role: "阿里通义旗下文生图，中文理解好", links: [
      { label: "官网", url: "https://tongyi.aliyun.com/wanxiang" }
    ]},
    { name: "即梦", role: "字节跳动 AI 创作平台，含生图与视频", links: [
      { label: "官网", url: "https://jimeng.jianying.com" }
    ]},
    { name: "腾讯混元生图", role: "腾讯混元大模型的图像生成能力", links: [
      { label: "官网", url: "https://hunyuan.tencent.com" }
    ]}
  ]},

  { cat: "工具与界面", color: "#ffb800", items: [
    { name: "AUTOMATIC1111 WebUI", role: "SD 最经典图形界面，功能全面、插件丰富", links: [
      { label: "GitHub", url: "https://github.com/AUTOMATIC1111/stable-diffusion-webui" },
      { label: "Wiki 文档", url: "https://github.com/AUTOMATIC1111/stable-diffusion-webui/wiki" }
    ]},
    { name: "ComfyUI", role: "节点式 SD 工作流工具，灵活强大", links: [
      { label: "GitHub", url: "https://github.com/comfyanonymous/ComfyUI" },
      { label: "官方文档", url: "https://docs.comfy.org/" },
      { label: "官网/工作流市场", url: "https://comfy.org/" }
    ]},
    { name: "秋叶整合包 / 绘世启动器", role: "民间打包的 SD 开箱即用环境（无单一官网）", links: [
      { label: "B 站搜索『秋叶』", url: "https://search.bilibili.com/all?keyword=%E7%A7%8B%E5%8F%B" }
    ]},
    { name: "Kohya_ss", role: "LoRA / DreamBooth 训练图形工具", links: [
      { label: "GitHub", url: "https://github.com/bmaltais/kohya_ss" }
    ]},
    { name: "WD14 Tagger", role: "从参考图反推提示词的 WebUI 插件", links: [
      { label: "GitHub", url: "https://github.com/toriato/stable-diffusion-webui-wd14-tagger" }
    ]},
    { name: "ADetailer", role: "自动检测面部/手部并局部重绘修复", links: [
      { label: "GitHub", url: "https://github.com/Bing-su/adetailer" }
    ]},
    { name: "Ultimate SD Upscale", role: "分块放大以突破显存限制", links: [
      { label: "GitHub", url: "https://github.com/Coyote-A/ultimate-upscale-for-automatic1111" }
    ]},
    { name: "Real-ESRGAN", role: "图像放大算法与模型，补足细节", links: [
      { label: "GitHub", url: "https://github.com/xinntao/Real-ESRGAN" }
    ]}
  ]},

  { cat: "微调与控制技术", color: "#00d4ff", items: [
    { name: "LoRA", role: "低秩适配微调，改画风/角色最流行方案", links: [
      { label: "论文", url: "https://arxiv.org/abs/2106.09685" }
    ]},
    { name: "ControlNet", role: "用线稿/姿态/深度等精确控制构图", links: [
      { label: "论文", url: "https://arxiv.org/abs/2302.05543" },
      { label: "GitHub", url: "https://github.com/lllyasviel/ControlNet" }
    ]},
    { name: "DreamBooth", role: "把特定主体训练进模型，深度记忆", links: [
      { label: "论文", url: "https://arxiv.org/abs/2208.12242" }
    ]},
    { name: "Textual Inversion", role: "学习新词向量代表概念，文件极小", links: [
      { label: "论文", url: "https://arxiv.org/abs/2208.01618" }
    ]},
    { name: "IP-Adapter", role: "用参考图风格/角色即时引导生成", links: [
      { label: "GitHub", url: "https://github.com/tencent-ailab/IP-Adapter" }
    ]},
    { name: "AnimateDiff", role: "把 SD 扩展到视频，生成数秒动画", links: [
      { label: "GitHub", url: "https://github.com/guoyww/AnimateDiff" }
    ]}
  ]},

  { cat: "社区与平台", color: "#7c5cff", items: [
    { name: "Civitai", role: "全球最大 SD 模型/LoRA 分享社区", links: [
      { label: "官网", url: "https://civitai.com" },
      { label: "模型库", url: "https://civitai.com/models" }
    ]},
    { name: "Hugging Face", role: "AI 界的 GitHub，模型/数据集/Spaces 托管", links: [
      { label: "官网", url: "https://huggingface.co" },
      { label: "文档", url: "https://huggingface.co/docs" }
    ]},
    { name: "Liblib 哩布哩布", role: "国内版 Civitai，模型集中、访问快", links: [
      { label: "官网", url: "https://www.liblib.art" }
    ]},
    { name: "魔搭 ModelScope", role: "阿里开源模型社区，国产模型集中地", links: [
      { label: "官网", url: "https://modelscope.cn" }
    ]},
    { name: "r/StableDiffusion", role: "Reddit 上最活跃的 SD 英文社区", links: [
      { label: "社区", url: "https://www.reddit.com/r/StableDiffusion/" }
    ]},
    { name: "OpenXLab 浦源", role: "上海 AI 实验室开源模型与算力平台", links: [
      { label: "官网", url: "https://openxlab.org.cn" }
    ]}
  ]},

  { cat: "算力与部署", color: "#00ffc8", items: [
    { name: "Banana.dev", role: "无服务器 GPU，把 SD 等模型部署为 API", links: [
      { label: "官网", url: "https://www.banana.dev" }
    ]},
    { name: "Replicate", role: "云端运行开源模型，按次付费，API 友好", links: [
      { label: "官网", url: "https://replicate.com" }
    ]},
    { name: "RunPod", role: "按量租用 GPU，预置 SD/ComfyUI 模板", links: [
      { label: "官网", url: "https://www.runpod.io" },
      { label: "模板", url: "https://www.runpod.io/pod-template" }
    ]},
    { name: "AutoDL", role: "国内 GPU 租赁，延迟低、支付方便", links: [
      { label: "官网", url: "https://www.autodl.com" }
    ]},
    { name: "矩池云", role: "国内 GPU 算力平台，预置镜像", links: [
      { label: "官网", url: "https://matpool.com" }
    ]},
    { name: "Google Colab", role: "免费/付费云端笔记本，可跑 SD", links: [
      { label: "官网", url: "https://colab.research.google.com" }
    ]},
    { name: "Modal", role: "无服务器云算力，部署 ML 工作流", links: [
      { label: "官网", url: "https://modal.com" }
    ]}
  ]},

  { cat: "学习与论文", color: "#ff2e88", items: [
    { name: "DDPM", role: "现代扩散模型奠基论文", links: [
      { label: "论文", url: "https://arxiv.org/abs/2006.11239" }
    ]},
    { name: "CLIP", role: "图文对比学习，让模型理解文字", links: [
      { label: "OpenAI 介绍", url: "https://openai.com/research/clip" },
      { label: "论文", url: "https://arxiv.org/abs/2103.00020" }
    ]},
    { name: "Transformer", role: "基于自注意力的架构，大模型基石", links: [
      { label: "论文", url: "https://arxiv.org/abs/1706.03762" }
    ]},
    { name: "GAN", role: "生成对抗网络，生成式 AI 先驱", links: [
      { label: "论文", url: "https://arxiv.org/abs/1406.2661" }
    ]},
    { name: "U-Net", role: "编码-解码+跳跃连接，去噪核心结构", links: [
      { label: "论文", url: "https://arxiv.org/abs/1505.04597" }
    ]},
    { name: "bilibili", role: "国内 AI 生图教程/整合包第一视频阵地", links: [
      { label: "官网", url: "https://www.bilibili.com" },
      { label: "搜索 SD 教程", url: "https://search.bilibili.com/all?keyword=stable%20diffusion%20%E6%95%99%E7%A8%8B" }
    ]}
  ]}

];

window.KNOWLEDGE_DATA = { SECTIONS, GLOSSARY, RESOURCES };
