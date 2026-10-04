# HANDOFF — AI 生图知识图谱

## 项目

- **路径**：`f:/schoolCompWorks/clone/aiPaintingKownledge`
- **技术栈**：纯静态站点（HTML/CSS/原生 JS），**无构建、无框架、无依赖安装**；Three.js 走 CDN；字体走 Google Fonts
- **当前分支**：`main`
- **公网**：<https://gorilla-kevv.github.io/ai-painting-atlas/>
- **仓库**：<https://github.com/Gorilla-Kevv/ai-painting-atlas>（GitHub Pages，源 `main` 根目录）

## 目标

- **已达成**：面向零基础→硬核理工科的 AI 生图科普知识体系，三页协同：
  - `index.html` = 参考书（系统正文）
  - `network.html` = 知识神经网络入口（Three.js 3D 图谱）
  - `docs.html` = 配置操作教程（含来源引用）
- **非目标**：不做后端、不做用户系统、不引入构建工具链（保持静态可直接托管）

## 结构

```
index.html          参考书主页面（顶部浮动入口按钮组）
network.html        知识神经网络（Three.js，Cytoscape 已移除）
docs.html           配置教程（6 个 section，含反向返回链接）
css/style.css       全部样式（设计令牌 + 组件 + 响应式）
js/data.js          内容源：SECTIONS / GLOSSARY / RESOURCES / RESOURCE_MAP / TUT_MAP
js/app.js           渲染与交互，暴露 window.KB_NAV
js/explainer.js     选中文本→磨砂玻璃释义悬浮窗（本地知识库 + 站内检索）
js/mindmap-data.js  思维导图树（源自 xmind-local MCP 的 .xmind）
js/mindmap-ui.js    右侧思维导图抽屉（悬浮提示 + 点击跳转）
js/network-data.js  3D 网络节点/边数据
js/svg-anims.js     SVG 动画讲解库（10 组：svg + formula + plain）
assets/             mascot.png、favicon-32/64/180.png
```

### 核心接口（全局对象）

| 对象 | 用途 |
|---|---|
| `window.KNOWLEDGE_DATA` | `{ SECTIONS, GLOSSARY, RESOURCES, RESOURCE_MAP, TUT_MAP }` |
| `window.MINDMAP_DATA` | `{ root }` 思维导图树 |
| `window.NETWORK_DATA` | `{ categories, nodes, edges }` |
| `window.SVG_ANIMS` | `{ key: { svg, formula, plain } }` |
| `window.KB_NAV` | `{ scrollToBlock, scrollToResource, highlight }` 跨模块跳转 |

## 决策与坑（重要）

1. **block id 规则**：子章节 id = `${secId}-b${index}`（如 `models-b3`）。**所有跳转映射都依赖它**（`RESOURCE_MAP`、`TUT_MAP`、思维导图 `REF_MAP`、`ANIM_BY_HEADING`）。
2. **新增 block 只能追加在 section 末尾**，不可插入中间——否则 `blockIdx` 全部错位，破坏上述所有映射。
3. **缓存穿透是硬性要求**：GitHub Pages 下发 `Cache-Control: max-age=600`。每次改动 JS/CSS，**必须递增 `index.html` / `network.html` 引用里的 `?v=YYYYMMDDx` 版本号**，否则用户会看到旧版（曾据此把"缩放功能失效"误判为代码 bug）。
4. **`ANIM_BY_HEADING` 按 block 的 heading 文本匹配**（`js/app.js` 顶部），改 heading 会导致动画丢失。
5. **思维导图 `REF_MAP` 按节点 title 匹配**；同名 title 存在冲突（如"概念辨析"统一归 `faq-b3`）。未列出的节点自动继承父级 ref。
6. **xmind-local MCP 的 workspace 不在项目内**（在 `c:\Users\kevin\.codebuddy\xmind\`），`outputPath` 必须用相对路径，绝对路径会报 `PATH_OUTSIDE_WORKSPACE`。
7. **`network.html` 中边与流光必须挂在 `nodeGroup` 下**（与节点同步旋转），否则旋转时连线与节点脱节。
8. **LineBasicMaterial 线宽在 WebGL 无效**，粗连线须用 `TubeGeometry`。

## 命令

```bash
# 本地预览（PowerShell 需 --directory，不能用 cd /d）
python -m http.server 8000 --directory "f:/schoolCompWorks/clone/aiPaintingKownledge"

# 提交发布（推送后 Pages 自动构建 30–90s）
git add -A && git commit -m "..." && git push origin main

# 查构建状态
gh api /repos/Gorilla-Kevv/ai-painting-atlas/pages/builds/latest

# 语法预检（无 linter 构建，靠 node --check）
node --check js/app.js
```

## 状态

- **当前状态**：功能完整，公网已上线（最新 commit `20dfa32`）
- **验收标准**：三页互链可达；思维导图节点点击→参考书对应章节并高亮；参考书/教程双向跳转生效；3D 图谱可旋转/中键平移/悬浮/点击；本地 `python -m http.server` 下无 console 报错
- **下一步（候选）**：
  - 内容继续扩充（更多 SVG 动画知识点、其他模型章节实战手册）
  - 参考书正文与官方资源条目继续补齐双向映射
  - 移动端 3D 图谱性能优化（低配设备降粒子/降节点数）
