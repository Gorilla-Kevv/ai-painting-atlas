/* =====================================================================
 * 思维导图数据 · 源自 xmind-local MCP 创建的 ai-painting-atlas.xmind
 * 188 个节点，含 note 说明，中心放射式知识结构（非目录大纲）
 * 由 mindmap-ui.js 渲染为 SVG 图形化思维导图
 * ===================================================================== */
window.MINDMAP_DATA = {
  root: {
    title: "AI 生图知识图谱",
    stylePreset: "important",
    note: "面向零基础小白的硬核科普 | 11大模块 | 中心放射式知识结构",
    children: [
      { title: "1. 入门基础", stylePreset: "info", note: "零基础起点：定义、简史、能力边界、术语", children: [
        { title: "什么是AI生图", note: "输入文字/图像，AI从随机噪声开始一笔笔画出全新图像，是生成而非检索。" },
        { title: "发展简史", note: "从GAN到扩散，从闭源到开源全民DIY", children: [
          { title: "2014 GAN诞生" },
          { title: "2020 DDPM奠基" },
          { title: "2021 DALL·E初代" },
          { title: "2022.08 SD开源引爆" },
          { title: "2023+ ControlNet/LoRA", note: "SD3/Flux新基座涌现，可控性飞跃" }
        ]},
        { title: "能做什么与不能做什么", note: "能：插画/概念图/头像/海报/风格迁移；不能：精确文字、严格几何、连续角色" },
        { title: "核心术语速览", children: [
          { title: "Prompt 提示词" },
          { title: "Seed 种子" },
          { title: "Steps 采样步数" },
          { title: "CFG 引导强度" },
          { title: "Denoising 图生图强度" }
        ]}
      ]},
      { title: "2. 技术原理", stylePreset: "idea", note: "从神经元到扩散模型，硬核但不劝退", children: [
        { title: "神经网络", children: [
          { title: "权重", note: "节点间连接强度，训练即调权重" },
          { title: "偏置" },
          { title: "激活函数", note: "ReLU等引入非线性" }
        ]},
        { title: "CNN卷积神经网络", note: "专为图像设计，卷积核扫描提取特征", children: [
          { title: "卷积核", note: "3x3小权重矩阵滑动扫描提取特征" },
          { title: "池化层", note: "下采样压缩尺寸" },
          { title: "特征图层级抽象", note: "浅层边缘→中层纹理→深层语义" }
        ]},
        { title: "RNN循环神经网络", children: [
          { title: "LSTM长短期记忆" },
          { title: "GRU" },
          { title: "长程依赖问题", note: "逐步串行无法并行，被Transformer取代" }
        ]},
        { title: "Transformer", note: "自注意力机制，大模型基石", children: [
          { title: "自注意力", note: "计算元素间相关度加权聚合" },
          { title: "可并行训练", note: "可并行+长程依赖好+可堆叠巨大规模" },
          { title: "ViT视觉Transformer" }
        ]},
        { title: "GAN生成对抗网络", children: [
          { title: "生成器造假" },
          { title: "判别器辨真" },
          { title: "对抗博弈", note: "训练不稳、模式坍缩，被扩散取代" }
        ]},
        { title: "扩散模型", stylePreset: "important", note: "当前主流：加噪再去噪，从噪声雕刻图像", children: [
          { title: "前向加噪", note: "逐步加噪到纯噪声" },
          { title: "反向去噪", note: "从噪声迭代还原图像，即采样" },
          { title: "潜扩散LDM", note: "在潜空间运算，消费级显卡可跑" }
        ]},
        { title: "VAE与潜空间", children: [
          { title: "编码器压缩" },
          { title: "解码器重建" },
          { title: "潜变量", note: "64x64x4低维表示，计算量降几十倍" }
        ]},
        { title: "U-Net去噪核心", children: [
          { title: "U型结构", note: "编码-解码+跳跃连接" },
          { title: "跳跃连接", note: "保留局部细节+全局语义" },
          { title: "预测噪声去噪" }
        ]},
        { title: "CLIP让AI听懂文字", children: [
          { title: "图文对比学习", note: "海量图文配对训练" },
          { title: "文本编码器", note: "把提示词编码成向量注入U-Net" },
          { title: "提示词工程本质", note: "用CLIP听得懂的词效果更好" }
        ]},
        { title: "NLP自然语言处理", children: [
          { title: "分词Tokenize" },
          { title: "文本编码上限", note: "CLIP约75token，T5可数百" },
          { title: "注入生成网络" }
        ]}
      ]},
      { title: "3. 主流模型", stylePreset: "important", note: "盘点SD/DALL·E/MJ/NovelAI/Banana/Flux/国产", children: [
        { title: "Stable Diffusion", stylePreset: "important", note: "开源生态核心，可在消费级显卡运行", children: [
          { title: "开源潜扩散", note: "2022.08开源，潜扩散LDM" },
          { title: "1.4/1.5经典" },
          { title: "SDXL 1024分辨率" },
          { title: "SD3/3.5", note: "多模态Transformer，文本理解强" }
        ]},
        { title: "DALL·E系列", children: [
          { title: "DALL·E 3", note: "ChatGPT自动改写专业提示词" },
          { title: "特点", note: "理解力强、文字渲染好、合规" },
          { title: "闭源付费" }
        ]},
        { title: "Midjourney", children: [
          { title: "艺术质感", note: "电影感、概念艺术出众" },
          { title: "Discord/网页付费" },
          { title: "定位", note: "省心但花钱不可控" }
        ]},
        { title: "NovelAI", children: [
          { title: "二次元付费平台", note: "基于SD二次训练，动漫风格突出" },
          { title: "角色标签", note: "内置角色LoRA可触发" },
          { title: "衍生分支", note: "闭源，下载不到官方权重" }
        ]},
        { title: "Banana AI", stylePreset: "warning", note: "面向开发者的一键部署平台", children: [
          { title: "算力部署平台", note: "无服务器GPU，把SD部署为API" },
          { title: "概念辨析", note: "不是画图模型，是后端托管服务" },
          { title: "同类Replicate/RunPod", note: "国内在线站点背后架构" }
        ]},
        { title: "Flux新标杆", children: [
          { title: "Black Forest Labs", note: "原SD团队创办，2024新一代" },
          { title: "文本理解与质量极强" },
          { title: "半开源" }
        ]},
        { title: "国产模型", note: "中文好、合规、适合商用", children: [
          { title: "文心一格" },
          { title: "通义万相" },
          { title: "即梦" },
          { title: "腾讯混元" }
        ]}
      ]},
      { title: "4. 整合方案与工具", stylePreset: "warning", note: "WebUI/ComfyUI/整合包/云端平台选型", children: [
        { title: "AUTOMATIC1111 WebUI", children: [
          { title: "表单式界面", note: "最经典图形界面，上手快" },
          { title: "必装插件", note: "中文汉化/ADetailer/Tagger等" },
          { title: "新手到进阶首选" }
        ]},
        { title: "ComfyUI", stylePreset: "warning", note: "节点式SD工作流，灵活强大", children: [
          { title: "节点式工作流", note: "节点连接组成可复用流程" },
          { title: "优势", note: "极度灵活、显存占用低" },
          { title: "SD3/Flux支持好", note: "新模型最先支持，专业用户首选" }
        ]},
        { title: "民间整合包", children: [
          { title: "开箱即用", note: "秋叶整合包=国内入门事实标准" },
          { title: "含模型/插件/依赖" },
          { title: "代价", note: "体积大、更新滞后官方" }
        ]},
        { title: "云端平台", children: [
          { title: "AutoDL国内延迟低" },
          { title: "RunPod按量租GPU" },
          { title: "Colab免费试用" },
          { title: "Banana部署", note: "Banana/Replicate部署为API" }
        ]}
      ]},
      { title: "5. 微调与扩展", stylePreset: "success", note: "LoRA/ControlNet/DreamBooth/提示词/放大", children: [
        { title: "LoRA", stylePreset: "success", note: "最流行微调，改画风角色", children: [
          { title: "低秩适配", note: "只训练极小低秩矩阵" },
          { title: "小巧灵活", note: "几十~几百MB，易分享叠加" },
          { title: "角色/画风/物件主流" }
        ]},
        { title: "DreamBooth", children: [
          { title: "深度记忆", note: "把特定主体训练进模型" },
          { title: "代价", note: "显存高、易过拟合" }
        ]},
        { title: "Textual Inversion", children: [
          { title: "词向量", note: "学新词向量代表概念" },
          { title: "极小但弱", note: "KB级文件，训练慢效果弱" }
        ]},
        { title: "ControlNet", stylePreset: "success", note: "精确控制构图姿态", children: [
          { title: "线稿Canny" },
          { title: "姿态OpenPose" },
          { title: "深度Depth" },
          { title: "革命性可控", note: "从盲抽走向精准创作" }
        ]},
        { title: "提示词工程", children: [
          { title: "提示词结构", note: "主体→细节→环境→光影→风格" },
          { title: "反向提示词兜底" },
          { title: "英文/Danbooru标签", note: "用CLIP听得懂的词" }
        ]},
        { title: "放大与高清修复", children: [
          { title: "Hires.fix", note: "先低分辨率再放大细化" },
          { title: "ADetailer修脸", note: "自动检测面部手部重绘" },
          { title: "放大模型", note: "ESRGAN/R-ESRGAN放大模型" }
        ]}
      ]},
      { title: "6. 社区与生态", stylePreset: "idea", note: "Civitai/HF/国内社区/生态全景", children: [
        { title: "Civitai", children: [
          { title: "模型/LoRA分享" },
          { title: "示例图墙可复现" },
          { title: "全球最大SD社区", note: "找资源第一站" }
        ]},
        { title: "Hugging Face", children: [
          { title: "模型托管平台", note: "AI界GitHub，托管模型/数据集/Spaces" },
          { title: "Spaces在线体验" },
          { title: "官方权重下载" }
        ]},
        { title: "国内社区", children: [
          { title: "Liblib哩布哩布" },
          { title: "魔搭ModelScope" },
          { title: "B站", note: "B站教程/整合包第一阵地" }
        ]},
        { title: "生态分层全景", children: [
          { title: "底层算法" },
          { title: "基础模型" },
          { title: "微调生态" },
          { title: "工具链" },
          { title: "算力/社区/应用层", note: "算力→社区→应用" }
        ]}
      ]},
      { title: "7. 对比速查", stylePreset: "info", note: "三张表快速做选择", children: [
        { title: "模型横向对比" },
        { title: "工具链对比" },
        { title: "微调方法对比" }
      ]},
      { title: "8. 学习路径", stylePreset: "task", note: "四阶段从入门到进阶", children: [
        { title: "阶段一入门体验", children: [
          { title: "在线工具出50+图" },
          { title: "理解Prompt/Seed/Steps/CFG" }
        ]},
        { title: "阶段二本地化", children: [
          { title: "下秋叶整合包" },
          { title: "掌握WebUI/LoRA/图生图" },
          { title: "装ADetailer/ControlNet" }
        ]},
        { title: "阶段三可控生成", children: [
          { title: "OpenPose控制姿态" },
          { title: "ComfyUI工作流" },
          { title: "训练自己的LoRA", note: "用Kohya_ss训练" }
        ]},
        { title: "阶段四进阶创作", children: [
          { title: "Flux/SD3新模型" },
          { title: "IP-Adapter/AnimateDiff" },
          { title: "Banana部署为API" }
        ]}
      ]},
      { title: "9. 术语表", note: "45+条术语按类别筛选搜索", children: [
        { title: "基础类" },
        { title: "原理类" },
        { title: "模型类" },
        { title: "微调类" },
        { title: "工具类" },
        { title: "社区/资源类" }
      ]},
      { title: "10. 常见问题", stylePreset: "warning", note: "新手最常问问题权威解答", children: [
        { title: "硬件与配置" },
        { title: "模型与使用" },
        { title: "版权与商用" },
        { title: "概念辨析" }
      ]},
      { title: "11. 官方资源", stylePreset: "success", note: "40+工具/模型/平台官方链接", children: [
        { title: "基础模型官网" },
        { title: "工具与界面" },
        { title: "微调技术" },
        { title: "社区平台" },
        { title: "算力部署" },
        { title: "学习论文" }
      ]}
    ]
  }
};
