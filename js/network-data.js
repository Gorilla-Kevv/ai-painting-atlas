/* =====================================================================
 * 知识神经网络数据 · network.html
 * 节点 = 知识点；边 = 技术原理关联（强映射对应关系）
 * 悬浮显示 blurb 缩略说明；点击展开详情面板（链接到参考书与配置教程）
 * ===================================================================== */
window.NETWORK_DATA = {
  /* 节点类别配色 */
  categories: {
    P: { name: "技术原理", color: "#4f7cff" },
    M: { name: "主流模型", color: "#60a5fa" },
    T: { name: "整合方案与工具", color: "#22d3ee" },
    F: { name: "微调与扩展", color: "#38bdf8" },
    C: { name: "社区与生态", color: "#7dd3fc" }
  },

  nodes: [
    /* ---- 技术原理 P ---- */
    { id: "p-diffusion", label: "扩散模型", cat: "P", blurb: "加噪再去噪，从随机噪声雕刻图像，当前主流生成范式。", detailRef: "index.html#principles-b5" },
    { id: "p-ldm", label: "潜扩散 LDM", cat: "P", blurb: "在潜空间做扩散，计算量降几十倍，让 SD 能在消费级显卡跑。", detailRef: "index.html#principles-b5" },
    { id: "p-unet", label: "U-Net", cat: "P", blurb: "编码-解码+跳跃连接，扩散去噪的核心网络结构。", detailRef: "index.html#principles-b7" },
    { id: "p-vae", label: "VAE / 潜空间", cat: "P", blurb: "把图像压缩到低维潜变量再重建，决定色彩与细节。", detailRef: "index.html#principles-b6" },
    { id: "p-clip", label: "CLIP", cat: "P", blurb: "图文对比学习，把提示词编码成向量注入 U-Net。", detailRef: "index.html#principles-b8" },
    { id: "p-transformer", label: "Transformer", cat: "P", blurb: "自注意力架构，大模型基石，SD3/Flux 引入。", detailRef: "index.html#principles-b3" },
    { id: "p-cnn", label: "CNN / 卷积核", cat: "P", blurb: "卷积核滑动扫描提取图像特征，图像识别时代主力。", detailRef: "index.html#principles-b1" },
    { id: "p-gan", label: "GAN", cat: "P", blurb: "生成器与判别器对抗，生成式 AI 先驱，已被扩散取代。", detailRef: "index.html#principles-b4" },
    { id: "p-prompt", label: "提示词工程", cat: "P", blurb: "用 CLIP 听得懂的话和模型对话，决定出图质量。", detailRef: "index.html#fine-tuning-b3" },

    /* ---- 主流模型 M ---- */
    { id: "m-sd", label: "Stable Diffusion", cat: "M", blurb: "开源潜扩散模型，生态核心，可在消费级显卡运行。", detailRef: "index.html#models-b0", tut: "docs.html#sd" },
    { id: "m-dalle", label: "DALL·E 3", cat: "M", blurb: "OpenAI 文生图，与 ChatGPT 集成，理解力强。", detailRef: "index.html#models-b1" },
    { id: "m-mj", label: "Midjourney", cat: "M", blurb: "闭源商业模型，艺术质感出众，付费订阅。", detailRef: "index.html#models-b2" },
    { id: "m-nai", label: "NovelAI", cat: "M", blurb: "二次元付费平台，基于 SD 二次训练，动漫风格突出。", detailRef: "index.html#models-b3" },
    { id: "m-flux", label: "Flux", cat: "M", blurb: "新一代半开源模型，原 SD 团队创办，文本理解极强。", detailRef: "index.html#models-b5" },
    { id: "m-banana", label: "Banana AI", cat: "M", blurb: "无服务器 GPU 平台，把 SD 部署为 API（非画图模型）。", detailRef: "index.html#models-b4", tut: "docs.html#cloud" },
    { id: "m-sd3", label: "SD3", cat: "M", blurb: "引入多模态 Transformer，文本理解大幅提升。", detailRef: "index.html#models-b0" },

    /* ---- 整合方案与工具 T ---- */
    { id: "t-webui", label: "WebUI (A1111)", cat: "T", blurb: "SD 最经典图形界面，表单式，上手快、插件丰富。", detailRef: "index.html#tools-b0", tut: "docs.html#webui" },
    { id: "t-comfy", label: "ComfyUI", cat: "T", blurb: "节点式 SD 工作流，灵活强大，新模型最先支持。", detailRef: "index.html#tools-b1", tut: "docs.html#comfyui" },
    { id: "t-pack", label: "秋叶整合包", cat: "T", blurb: "民间打包的开箱即用 SD 环境，国内入门事实标准。", detailRef: "index.html#tools-b2", tut: "docs.html#pack" },
    { id: "t-cloud", label: "云 GPU 平台", cat: "T", blurb: "AutoDL/RunPod/Colab，无显卡也能跑 SD/ComfyUI。", detailRef: "index.html#tools-b3", tut: "docs.html#cloud" },
    { id: "t-adetailer", label: "ADetailer", cat: "T", blurb: "自动检测面部/手部局部重绘修复，解决崩脸崩手。", detailRef: "index.html#fine-tuning-b4" },
    { id: "t-upscale", label: "放大 (ESRGAN)", cat: "T", blurb: "Real-ESRGAN 等放大模型，补足高清细节。", detailRef: "index.html#fine-tuning-b4" },

    /* ---- 微调与扩展 F ---- */
    { id: "f-lora", label: "LoRA", cat: "F", blurb: "低秩适配微调，小文件改画风/角色，最流行扩展。", detailRef: "index.html#fine-tuning-b0", tut: "docs.html#lora" },
    { id: "f-controlnet", label: "ControlNet", cat: "F", blurb: "线稿/姿态/深度等精确控制构图，可控生成革命。", detailRef: "index.html#fine-tuning-b2" },
    { id: "f-dreambooth", label: "DreamBooth", cat: "F", blurb: "把特定主体训练进模型，深度记忆但易过拟合。", detailRef: "index.html#fine-tuning-b1" },
    { id: "f-ti", label: "Textual Inversion", cat: "F", blurb: "学新词向量代表概念，文件极小但效果弱于 LoRA。", detailRef: "index.html#fine-tuning-b1" },
    { id: "f-ipadapter", label: "IP-Adapter", cat: "F", blurb: "用参考图风格/角色即时引导生成，图当提示词。", detailRef: "index.html#learning-b3" },
    { id: "f-anidiff", label: "AnimateDiff", cat: "F", blurb: "把 SD 扩展到视频，生成数秒动画。", detailRef: "index.html#learning-b3" },

    /* ---- 社区与生态 C ---- */
    { id: "c-civitai", label: "Civitai", cat: "C", blurb: "全球最大 SD 模型/LoRA 分享社区，找资源第一站。", detailRef: "index.html#community-b0" },
    { id: "c-hf", label: "Hugging Face", cat: "C", blurb: "AI 界 GitHub，托管模型/数据集/Spaces 在线体验。", detailRef: "index.html#community-b1" }
  ],

  /* 边 = 知识点间的技术原理关联（强映射） */
  edges: [
    // SD 的技术构成
    { s: "m-sd", t: "p-ldm", l: "基于潜扩散" },
    { s: "m-sd", t: "p-unet", l: "去噪核心" },
    { s: "m-sd", t: "p-clip", l: "文本编码" },
    { s: "m-sd", t: "p-vae", l: "潜空间解码" },
    { s: "p-ldm", t: "p-diffusion", l: "潜空间实现" },
    { s: "p-diffusion", t: "p-gan", l: "取代" },
    { s: "p-vae", t: "p-diffusion", l: "提供潜空间" },

    // 工具 → SD
    { s: "t-webui", t: "m-sd", l: "图形界面" },
    { s: "t-comfy", t: "m-sd", l: "节点界面" },
    { s: "t-pack", t: "t-webui", l: "打包" },
    { s: "t-pack", t: "t-comfy", l: "打包" },
    { s: "t-cloud", t: "m-sd", l: "托管运行" },
    { s: "m-banana", t: "m-sd", l: "部署为API" },
    { s: "t-adetailer", t: "t-webui", l: "插件" },
    { s: "t-upscale", t: "t-webui", l: "放大插件" },

    // 微调 → SD / 原理
    { s: "f-lora", t: "m-sd", l: "微调" },
    { s: "f-controlnet", t: "m-sd", l: "可控生成" },
    { s: "f-controlnet", t: "p-clip", l: "条件编码" },
    { s: "f-dreambooth", t: "m-sd", l: "深度微调" },
    { s: "f-ti", t: "p-clip", l: "词嵌入" },
    { s: "f-ipadapter", t: "p-clip", l: "参考图编码" },
    { s: "f-anidiff", t: "m-sd", l: "视频扩展" },

    // 模型间衍生与演进
    { s: "m-nai", t: "m-sd", l: "衍生训练" },
    { s: "m-flux", t: "p-transformer", l: "基于" },
    { s: "m-sd3", t: "p-transformer", l: "引入" },
    { s: "p-clip", t: "p-prompt", l: "理解提示词" },
    { s: "p-cnn", t: "p-diffusion", l: "卷积思想" },

    // 社区 → 模型/微调
    { s: "c-civitai", t: "f-lora", l: "分享LoRA" },
    { s: "c-civitai", t: "m-sd", l: "分享模型" },
    { s: "c-hf", t: "m-sd", l: "托管权重" },
    { s: "c-hf", t: "m-flux", l: "托管权重" },

    // 补全连通：消除孤立漂浮节点
    { s: "m-dalle", t: "m-sd", l: "同代对比" },
    { s: "m-mj", t: "m-sd", l: "同代对比" },
    { s: "m-dalle", t: "p-clip", l: "文本理解" },
    { s: "m-mj", t: "p-prompt", l: "艺术质感" },
    { s: "p-cnn", t: "p-transformer", l: "架构演进" },
    { s: "p-transformer", t: "p-clip", l: "CLIP基于" },
    { s: "m-sd3", t: "m-sd", l: "版本演进" }
  ]
};
