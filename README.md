# AI 生图知识图谱 · Knowledge Atlas

> 面向零基础小白的 AI 生图硬核科普知识体系网站。系统梳理 Stable Diffusion、DALL·E、Midjourney、NovelAI、ComfyUI、LoRA、ControlNet 等主流模型、工具与生态，从神经元讲到扩散模型，从概念讲到实操。

🌐 **公网地址**：<https://gorilla-kevv.github.io/ai-painting-atlas/>
📦 **仓库地址**：<https://github.com/Gorilla-Kevv/ai-painting-atlas>

---

## ✨ 项目亮点

- **零基础硬核科普** —— 从「AI 生图是什么」讲到「扩散模型 / U-Net / CLIP」原理，口语化但不失深度
- **数据驱动渲染** —— 全部内容以结构化数据（`js/data.js`）驱动，增删模块只需改数据
- **暗色科技美学** —— 深墨底 + 霓虹青绿/玫红双重点色，渐变 mesh + 噪点纹理，Syne × Manrope × Noto 字体排版
- **纯前端、零后端** —— 静态站点，可直接托管在 GitHub Pages / 任意静态服务器

## 🧭 内容模块（11 个）

| # | 模块 | 核心内容 |
|---|------|----------|
| 1 | 入门基础 | 什么是 AI 生图、简史、能/不能做什么、术语速览 |
| 2 | 技术原理 | 神经网络、CNN、卷积核、RNN、Transformer、GAN、扩散模型、VAE、潜空间、U-Net、CLIP、NLP |
| 3 | 主流模型 | Stable Diffusion、DALL·E、Midjourney、NovelAI、Banana AI、Flux、国产模型 |
| 4 | 整合方案与工具 | WebUI(A1111)、ComfyUI、民间整合包、云端平台 |
| 5 | 微调与扩展 | LoRA、DreamBooth、Textual Inversion、ControlNet、提示词工程、放大与高清修复 |
| 6 | 社区与生态 | Civitai、Hugging Face、国内社区、生态分层全景 |
| 7 | 对比速查 | 模型 / 工具 / 微调方法 三张横向对比表 |
| 8 | 学习路径 | 入门→本地化→可控生成→进阶 四阶段 checklist + 资源清单 |
| 9 | 术语表 | 45+ 条术语，按类别筛选 + 关键词搜索 |
| 10 | 常见问题 | 硬件配置、模型使用、版权商用、概念辨析 四类 FAQ |
| 11 | 官方资源 | 40+ 工具/模型/框架/平台的官网、文档、社区、论文链接 |

## 🛠️ 交互功能

- **左侧导航展开/收起** —— 每个模块可展开显示章节副标题，点击副标题精确定位子章节
- **右侧思维导图抽屉** —— 鼠标移到屏幕最右侧边缘呼出，中心主题 + 分支层级，节点可展开/收起
- **选中文本智能解释** —— 框选任意词弹出磨砂玻璃悬浮窗（`backdrop-filter: blur`），基于站内知识库 + 全文检索给出释义
- **正文 ↔ 官方资源双向跳转** —— 框选模型/工具名（如 ComfyUI）→ 解释窗内按钮跳转到对应资源卡片；资源卡片亦可跳回正文，跳转后高亮闪烁定位
- **滚动进度条 + 章节高亮 + 入场动画** —— IntersectionObserver 驱动
- **响应式** —— 桌面端侧边栏常驻，移动端抽屉式导航

## 📂 项目结构

```
ai-painting-atlas/
├── index.html              # 入口（引入字体与脚本）
├── css/
│   └── style.css           # 全部样式（设计令牌 + 组件 + 响应式）
├── js/
│   ├── data.js             # 内容数据：SECTIONS / GLOSSARY / RESOURCES / RESOURCE_MAP
│   ├── app.js              # 渲染与交互（导航、内容、思维导图、跳转、高亮）
│   └── explainer.js        # 选中文本解释悬浮窗（知识库 + 检索）
└── .gitignore
```

## 🚀 本地预览

纯静态站点，任选其一：

```bash
# 方式一：Python 内置服务器
python -m http.server 8000

# 方式二：Node 静态服务器
npx serve .
```

浏览器打开 <http://localhost:8000/index.html>。

## 🌐 部署

已通过 **GitHub Pages** 部署，源为 `main` 分支根目录。更新流程：

```bash
git add -A
git commit -m "update: 你的更新说明"
git push origin main
```

推送后 GitHub Pages 自动重新构建（约 30–90 秒），公网即时生效。

## 🧩 数据维护指南

所有知识点集中在 `js/data.js`：

- **新增模块** —— 在 `SECTIONS` 数组追加对象（含 `id / title / en / icon / color / summary / sections`）
- **新增术语** —— 在 `GLOSSARY` 数组追加 `{ term, en, cat, desc }`
- **新增官方资源** —— 在 `RESOURCES` 数组按类别追加条目
- **新增双向跳转** —— 在 `RESOURCE_MAP` 追加 `{ names, resCat, resName, secId, blockIdx }`

`js/app.js` 会自动渲染，无需改逻辑。

## 🎨 设计令牌

```
背景  #07090e / #0a0e14          强调  青绿 #00ffc8 / 玫红 #ff2e88
文字  #f4f6fa / #c7cdd9           辅色  紫 #7c5cff / 琥珀 #ffb800 / 青蓝 #00d4ff
字体  Syne(显示) · Manrope(正文) · JetBrains Mono(代码) · Noto Sans/Serif SC(中文)
```

## 📝 许可与声明

- 本仓库代码（HTML/CSS/JS）可自由用于学习与二次开发
- 内容中所引用的第三方模型、工具、商标版权归各自所有方，链接均指向官方资源
- 仅供科普学习用途，商用前请核实各模型/工具的 License

## 🤝 致谢

本站内容整理自 Stable Diffusion、ComfyUI、Civitai、Hugging Face、Black Forest Labs 等开源社区与官方文档，以及 B 站、Reddit 等社区的公开教程。感谢整个 AI 生图开源生态。
