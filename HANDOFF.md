# HANDOFF — AI 生图知识图谱

## 项目

- **路径**：`f:/schoolCompWorks/clone/aiPaintingKownledge`
- **技术栈**：纯静态站点（HTML/CSS/原生 JS），**无构建、无框架、无依赖安装**；Three.js 走 CDN；字体走 Google Fonts
- **当前分支**：`main`（主线/发布分支，阶段 23 已合回并发布；阶段 24 按用户指定直接在 `main` 完成）；`knowledge-expansion` 为知识条目扩充专用（自 `main`@`0b45c96` 切出，阶段 23 后与 `main` 同步、暂落后于阶段 24）
- **公网**：<https://gorilla-kevv.github.io/ai-painting-atlas/>
- **仓库**：<https://github.com/Gorilla-Kevv/ai-painting-atlas>（GitHub Pages，源 `main` 根目录）

## 目标

- **已达成**：面向零基础→硬核理工科的 AI 生图科普知识体系，三页协同：
  - `index.html` = 参考书（系统正文）
  - `network.html` = 知识神经网络入口（Three.js 3D 图谱）
  - `docs.html` = 配置操作教程（含来源引用）
- **已达成（阶段 15）**：社区共建——用户注册投稿（Supabase 邮箱验证）+ 管理员审核（admin.html）+ 批准后同步回仓库（community-data.js）
- **非目标**：不做自建后端/服务器、不引入构建工具链（保持静态可直接托管；Supabase 是托管 BaaS，不算自建后端）

## 结构

```
index.html          参考书主页面（顶部浮动入口按钮组：社区/教程/神经网络）
network.html        知识神经网络（Three.js，Cytoscape 已移除）
docs.html           配置教程（6 个官方 section + 社区教程动态追加）
admin.html          管理员审核后台（投稿队列 + GitHub 发布同步）
css/style.css       全部样式（设计令牌 + 组件 + 响应式 + kb-* 社区段）
js/data.js          内容源：SECTIONS / GLOSSARY / RESOURCES / RESOURCE_MAP / TUT_MAP
js/community-data.js 社区内容层（由 admin 后台自动生成提交，勿手工编辑）
js/app.js           渲染与交互，暴露 window.KB_NAV（IIFE 顶部含社区数据合并）
js/config.js        站点配置：SUPABASE_URL / SUPABASE_ANON_KEY / GITHUB_REPO（空=社区功能关闭）
js/community-ui.js  社区共建抽屉：登录/注册/我的投稿/投稿表单 + block 悬浮补充按钮
js/admin.js         审核后台逻辑：RLS 守卫 + 批准/驳回/下架 + GitHub Contents API 同步
js/vendor/supabase.umd.js  supabase-js v2 本地化（勿走 CDN，国内不稳）
js/explainer.js     选中文本→磨砂玻璃释义悬浮窗（本地知识库 + 站内检索）
js/mindmap-data.js  思维导图树（源自 xmind-local MCP 的 .xmind）
js/mindmap-ui.js    右侧思维导图抽屉（悬浮提示 + 点击跳转）
js/network-data.js  3D 网络节点/边数据
js/svg-anims.js     SVG 动画讲解库（10 组：svg + formula + plain）
supabase-setup.sql  Supabase 初始化：建表/RLS/触发器/管理员 bootstrap（含执行顺序注释）
assets/             mascot.png、favicon-32/64/180.png
```

### 核心接口（全局对象）

| 对象 | 用途 |
|---|---|
| `window.KNOWLEDGE_DATA` | `{ SECTIONS, GLOSSARY, RESOURCES, RESOURCE_MAP, TUT_MAP }` |
| `window.COMMUNITY_DATA` | `{ v, builtAt, blocks:{secId:[block]}, glossary, resources, tutorials }` 社区内容层（由审核后台全量重建） |
| `window.KB_CONFIG` | `{ SUPABASE_URL, SUPABASE_ANON_KEY, GITHUB_REPO }`，留空 = 社区功能关闭 |
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
9. **折叠补充阅读子章节（阶段 17 建、阶段 21 修正）**：block 加 `sub: true, parentIdx: N` 即渲染为同 section 第 N 块内的折叠面板。锚点 id 不变（仍 `-bN`、数组索引不变），但 **DOM 已嵌套进父块**——任何按 `.block` DOM 顺序索引的查询都会错位，必须按锚点 id 查找（`scrollToBlock` 已改造）。**面板展开位置：在 `.sub-toggles` 栏内紧跟自己的按钮（insertAdjacentElement 'afterend'，DOM 为 [btn,panel] 交替）——这是用户钦定设计，勿改回面板堆叠式**。`sub` 与 `comm` 同设时 comm 优先。
10. **`.kb-block-actions`（社区悬浮按钮）opacity:0 时仍拦截点击**（z-index:5, absolute right:0）——凡在 block 右上角新增可点控件，z-index 须 >5，或像 `.block.sub-block .kb-block-actions { top:-14px }` 一样错位。

### 社区共建相关（阶段 15 新增）

9. **社区数据合并时机**：必须在 `app.js` IIFE 顶部、`const { SECTIONS, GLOSSARY } = ...` 解构**之前**——术语筛选 `categories` 在 IIFE 早期从 GLOSSARY 派生，晚合并则社区术语永远不显示。
10. **社区 block 双命名空间**：cid = `${secId}-cb${n}`（n 为该 section 社区块序号），与官方 `-b` 序号**解耦**——data.js 以后增删 block 不影响社区块外链。app.js 有两处 id 计算（renderNav :105 附近、renderContent :339 附近）都用了 `blk.cid ||` 前缀，勿回退。
11. **社区 block 标记 `comm: true`**：显式排除 ANIM_BY_HEADING 动画、不进 RESOURCE_MAP/TUT_MAP/REF_MAP。同步重建时自动附加。
12. **同步是全量重建不是增量**：每次同步取 `status ∈ {approved, synced}` 全部投稿重建整个 community-data.js（内容寻址 blob-sha 幂等，无变化自动跳过）；`synced` 只是记账状态，`removed` 表示下架。**绝不要手工编辑 data.js 或 community-data.js 来改社区内容**。
13. **Supabase 安全模型**：anon key 公开（在 config.js 里）是安全的，权限全靠 RLS；管理员判定走 security definer 函数 `public.is_admin()`（防 RLS 策略递归），**前端 is_admin 只控 UI**；GitHub PAT 仅存管理员浏览器 localStorage（fine-grained、仅本仓库 Contents: 读写）。
14. **降级要求**：config.js 留空或 Supabase 挂掉时，站点浏览/官方内容必须零影响，社区功能静默显示"未启用"。所有 Supabase 调用前置 `getSB()` 判空 + try/catch。
15. **Supabase 免费层 7 天无活动会暂停项目**（登录/投稿失效，站点浏览不受影响）——定期登录 Dashboard 保活。

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

## 本地 AI Agent 自动审核接入（阶段 15.2）

为本地 agent 提供两条通道（人工复点用 admin.html，全自动用 REST）：

**通道 A：admin.html「📋 复制当前队列」按钮** —— 导出结构化审查包 JSON（含 reviewGuide 状态/类型枚举 + 全部投稿 payload），粘贴给任意 agent 审查。

**通道 B：REST 直连（全自动）**
- 前提：`service_role` key（Dashboard → Settings → API），**绕过 RLS，只存本机 agent 配置，绝不入仓库/浏览器/对话**
- 读待审队列：
  ```
  GET {SUPABASE_URL}/rest/v1/submissions?status=eq.pending&order=created_at.asc
  Headers: apikey: <service_role_key>
           Authorization: Bearer <service_role_key>
  ```
- 写审核结论：
  ```
  PATCH {SUPABASE_URL}/rest/v1/submissions?id=eq.42
  Headers: 同上 + Content-Type: application/json
  Body: {"status":"approved","admin_note":"理由(驳回时必填)","reviewed_at":"2026-10-05T00:00:00Z"}
  批量: ?id=in.(1,2,3)
  ```
- 枚举：`type ∈ section_block|glossary|resource|tutorial|block_edit`；`status ∈ pending|approved|rejected|synced|removed`
- 审核要点：URL 必须 `https://`；必填字段齐全（section_block/blocked_edit 的 heading、glossary 的 term+desc、resource 的 cat+name、tutorial 的 title）；payload ≤32KB；内容质量由 agent/人工把关；`block_edit` 是对既有小节的整块替换（payload.baseBlockId 定位、block 为新全量内容）
- 发布仍走 admin.html「🚀 同步到仓库」（需 PAT，agent 无法代办 GitHub 授权；也可由本地脚本以同样 Contents API 方式提交）

## 状态

- **当前状态**：功能完整（阶段 15 社区共建已实现并通过本地三轮浏览器验证，含测试数据清理），公网已上线；**社区功能上线前需完成下方「Supabase 启用配置」**（未配置时社区按钮显示"未启用"，站点不受影响）。阶段 16（2026-10-06）已完成七大新模型知识扩充：models 段 b0–b13 共 14 个 block，新增 WAI / Anima / Krea 2 / Wan 2.2 / Z-Image / Seedream / GPT-Image（含资源卡/术语/RESOURCE_MAP，data.js 版本号 20261006a），内容按 2026-10-06 联网检索核实。阶段 17（2026-10-06，knowledge-expansion 分支）已将 b6「NovelAI 4.5 实战全解」改为 b3 内可折叠补充阅读（sub/parentIdx 机制，见决策与坑 9/10，版本号 20261006b）。阶段 18（2026-10-06，同分支）完成六知识点扩充：Illustrious XL（models-b14）、Forge（tools-b4）、Forge Neo（tools-b5）、加速 LoRA 与步数（fine-tuning-b5）、分辨率（fine-tuning-b6），并为 LoRA 主块挂「浅显版/硬核版」双深度选读子块（fine-tuning-b7/b8，sub 机制复用）；data.js 版本号 20261006c。阶段 19（2026-10-06，同分支）深度拓展 ComfyUI 章节：tools 段追加 3 个 sub 块（官方生态/必装扩展/工作流资源与学习路径，parentIdx:1），主块补 App 模式与 Desktop 信息，GLOSSARY +3 术语、RESOURCES +2 卡；data.js 版本号 20261006d。阶段 20（2026-10-06，同分支）追加二次元工作流全景（models-b15：Illustrious 系选型/EPS·VPred 分支/六步管线）与审查机制分层科普（models-b16：平台/运行时/权重/数据四层 + 合规红线，科普导向不提供规避手段）；GLOSSARY +4（EPS/VPred、Safety Checker、分级标签、NoobAI-XL）、RESOURCES +NoobAI-XL；data.js 版本号 20261006e。阶段 17–21（knowledge-expansion 分支）已全部合并进 `main` 并推送发布（版本号演进 20261006a→e，app.js/style.css 20261006c）。阶段 22（2026-10-07）新增<b>反推流</b>专题：tools 段追加 b9 主块「反推流：把图变回提示词（图像打标）」+ 两个 sub 补充阅读（b10 打标模型选型 PixAI Tagger v1.0 vs WD14、b11 ComfyUI 反推流实战与节点包）；GLOSSARY +7（反推/Tagger/WD14 Tagger/PixAI Tagger/TIPO/VLM 打标/Danbooru 标签）、RESOURCES +6 卡（WD14 权重、PixAI Tagger v1.0、sln77、TaggerPlus、TIPO/DanTagGen、RunningHub）、RESOURCE_MAP +5 条；models-b15 正文加反推交叉引用；data.js 版本号 20261007a。内容经联网检索核实（PixAI Tagger v1.0 官方模型卡、ComfyUI-TaggerPlus / sln77 / z-tipo-extension 仓库，检索日期 2026-10-07）。阶段 23（2026-10-10，knowledge-expansion 分支）完成 SD 家族与 Forge 深度扩充：models 段追加 b17 SDXL / b18 SD3-SD3.5 / b19 FLUX 三个专块，tools 段 Forge 主块下追加 b12/b13 两篇折叠选读（UNet Patcher 与显存管理、Forge 系三条线与安装迁移，sub/parentIdx:4 机制）；同步修正 Forge Neo『仅 Windows+NVIDIA』过时口径与 reForge 停更信息；GLOSSARY +10、RESOURCES +2 卡（Flux/Forge 卡增链）、RESOURCE_MAP +3/修订 2（Flux 重指向 b19）；data.js 版本号 20261010a。内容经 4 路并发联网检索核实（检索日期 2026-10-10，关键事实均带来源；SD3 泄露传闻/GAIA 成员说等未核实项一律未写入）。阶段 23 已合回 `main` 并推送发布（`5db46f0`，Pages built，公网版本号 20261010a）。阶段 24（2026-10-10，按用户指定直接在 `main`）以用户 ComfyUI 目录截图为素材完成模型目录与文件家族扩充：models 追加 b20「MiniMax H3」专块（33B 全模态开源视频、FL2VA/Ref2VA、四文件组件拆解），tools 追加 b14 sub「ComfyUI 模型目录结构与文件摆放」（parentIdx:1，含 Anything V5/flux-ae 实例与量化后缀语义），fine-tuning 追加 b9 sub「SD1.5 ControlNet v1.1 全家族名录与命名解读」（parentIdx:2，14 成员+避坑）；GLOSSARY +8（87）、RESOURCES +4 卡、RESOURCE_MAP +4（50 条）；data.js 版本号 20261010b。经 4 路并发联网检索核实（检索日期 2026-10-10；"RE"释义、H3 许可区域条款等存疑项未写入或按不确定表述）
- **验收标准**：三页互链可达；思维导图节点点击→参考书对应章节并高亮；参考书/教程双向跳转生效；3D 图谱可旋转/中键平移/悬浮/点击；社区：注册→验证邮箱→投稿→管理员批准→同步→公网可见全链路；本地 `python -m http.server` 下无 console 报错
- **下一步（候选）**：
  - 投稿限流加固（RLS 加"每人 ≤5 条 pending"）
  - 社区 block 移动端锚点目录
  - 3D 图谱/思维导图纳入社区投稿（当前明确排除）
  - 新模型接入 3D 图谱/思维导图（需评估固定 30 节点性能）
- **本次文档更新时间**：10.10 02:12 [BY Qoder]（阶段 24 模型目录与文件家族扩充）

## Supabase 启用配置（社区功能上线的一次性步骤）

1. 注册 <https://supabase.com>（免费层）→ New project（区域选 nearest，记下数据库密码）
2. SQL Editor → 粘贴 `supabase-setup.sql` 全文 → Run（含建表/RLS/触发器）
3. 注册站点账号（右上角「👤 社区」→ 注册）→ 回 SQL Editor 执行文件末尾的 bootstrap 语句把你的邮箱标为 `is_admin = true`
4. Dashboard → Settings → API → 复制 Project URL 与 anon public key → 填入 `js/config.js` → 递增版本号提交发布
5. Dashboard → Authentication → URL Configuration：Site URL = `https://gorilla-kevv.github.io/ai-painting-atlas`，Redirect URLs 加上生产地址 `/*` 与 `http://localhost:8000/*`
6. 创建 GitHub fine-grained PAT（仅本仓库、仅 Contents: 读写、短有效期）→ 存入 admin.html 后台（保存在浏览器 localStorage）
7. 端到端验证：注册→验证邮箱→投稿→admin 批准→点同步→GitHub 出现 `community:` commit→Pages 构建→公网强刷可见
