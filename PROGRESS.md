# PROGRESS — AI 生图知识图谱

## 进度看板（10.7 15:40 更新 · 阶段 22 反推流扩充已完成）
- 分支策略：`knowledge-expansion`（知识条目扩充专用）↔ `main`（发布线）——阶段 17–21 已合并进 `main` 并推送 GitHub Pages；阶段 22 直接在 `main` 上完成（待提交发布）
- 当前正在开发任务：无（阶段 22 内容已完成、已校验，待提交/推送）
- 下一阶段任务：待定（候选见 HANDOFF「下一步」）
- 可提前进行的任务：投稿限流加固（RLS 每人 ≤5 条 pending）
- 未完成的任务：3D 图谱 / 思维导图纳入阶段 16–21 新增条目（债务项，需评估性能）

## 阶段总览（按时间顺序，均已完成并推送）

| # | 阶段 | 关键改动 | 状态 |
|---|---|---|---|
| 1 | 网站初版 | 10 大模块内容体系 + 暗色科技美学 + 数据驱动渲染 | ✅ |
| 2 | GitHub Pages 发布 | 建仓 `ai-painting-atlas`、启用 Pages、README | ✅ |
| 3 | 选词释义 | `explainer.js` 磨砂玻璃悬浮窗 + 站内检索 | ✅ |
| 4 | 思维导图 v1 | 右侧边缘呼出抽屉（目录大纲式） | ✅ |
| 5 | 官方资源模块 | 40+ 工具/模型官方链接 + 11 号模块 | ✅ |
| 6 | 导航展开 | 侧边栏模块展开显示章节副标题 | ✅ |
| 7 | 双向跳转 | 正文↔官方资源映射（`RESOURCE_MAP`） | ✅ |
| 8 | 思维导图重制 | xmind-local MCP 建 188 节点树 + 毛玻璃抽屉 | ✅ |
| 9 | 缩放/平移 | SVG viewBox 矢量缩放 + 拖左边缘展开 | ✅ |
| 10 | 3D 重构 | 移除 Cytoscape，纯 Three.js（发光球/流光管/中键平移） | ✅ |
| 11 | 参考书↔教程 | `TUT_MAP` 双向链接 + 参考书入口按钮 | ✅ |
| 12 | 硬核扩充 | `svg-anims.js` 10 组动画 + 公式 + 通俗解释 | ✅ |
| 13 | 图标/ favicon | 角色立绘替换两处图标 + 三尺寸 favicon | ✅ |
| 14 | NovelAI 整合 | 教程字幕知识写入（原理 + 七主线实战手册） | ✅ |
| 15 | 社区共建系统 | Supabase 认证投稿 + admin 审核后台 + GitHub 同步回仓库 | ✅ |
| 16 | 七大新模型知识扩充 | WAI / Anima / Krea 2 / Wan 2.2 / Z-Image / Seedream / GPT-Image（b7–b13） | ✅ |
| 17 | NovelAI 实战手册改折叠子章节 | b6 改为 b3 内可折叠补充阅读面板（sub/parentIdx 机制，映射零破坏） | ✅ |
| 18 | 六知识点扩充 + LoRA 双深度 | Illustrious XL / Forge / Forge Neo / 加速LoRA / 分辨率 / LoRA 浅显·硬核双版本 | ✅ |
| 19 | ComfyUI 章节深度拓展 | 官方生态 / 必装扩展 / 工作流资源三篇选读 + Manager·Registry·Hub 资源体系 | ✅ |
| 20 | 二次元工作流 + 审查分层 | 主流工作流全景（EPS/VPred、六步链）+ 审查机制四层结构与合规边界 | ✅ |
| 21 | 补充阅读栏内展开修正 | 面板改为栏内跟随各自按钮（[btn,panel] 交替） | ✅ |
| 22 | 反推流知识扩充 | 反推原理/三条路线 + PixAI Tagger vs WD14 选型 + ComfyUI 反推流实战与节点包 | ✅ |

## 阶段 15

- **已完成**：
  - **叠加层**：`js/community-data.js`（社区内容层，由后台自动生成）；`app.js` IIFE 顶部合并社区 blocks/glossary/resources（4 处外科手术：合并钩子 + 两处 cid id 计算 + ANIM 守卫）；`docs.html` 底部动态追加社区教程（C1/C2… 编号 + 社区贡献徽章）
  - **认证**：`js/vendor/supabase.umd.js` 本地化（不走 CDN）、`js/config.js`（空=功能关闭）、`js/community-ui.js` 四合一抽屉（登录/注册/我的投稿/投稿表单，邮箱验证走 Supabase 内置确认邮件）
  - **投稿**：四种类型（补充章节块/新术语/新官方资源/新配置教程）动态表单 + 校验（长度上限、URL 强制 https、≤32KB）+ 每个 block 悬浮「✚ 补充」按钮预填目标章节
  - **审核**：`admin.html` + `js/admin.js`——会话+is_admin 双守卫、状态筛选队列、payload 完整预览、批准/驳回（备注回显投稿人）/下架/删除
  - **同步**：GitHub Contents API 全量重建 community-data.js（approved+synced 全量、blob-sha 幂等跳过、409 自动重试、同步后记账 synced、removed 下架）
  - **数据库**：`supabase-setup.sql`——profiles/submissions + RLS（匿名全拒/用户仅自身/admin 全权，security definer `is_admin()` 防递归）+ 注册触发器 + bootstrap 语句
- **改动文件**：新增 7（community-data/community-ui/admin.js/admin.html/config.js/supabase-setup.sql/vendor supabase.umd.js）；修改 4（app.js/index.html/docs.html/style.css，版本号 `20261005b`）
- **测试结果**：`node --check` 全过；浏览器三轮验证全过（叠加渲染/抽屉交互/降级/回归/admin 页面；修复了抽屉 z-index 80 遮挡问题→95）；测试数据已清空
- **风险**：
  - **社区功能尚未启用**：`config.js` 仍为空占位，上线前需执行 HANDOFF.md「Supabase 启用配置」7 步（未配置时站点零影响）
  - 社区 blocks 追加在 section 末尾 + cid 命名空间，官方 `b0–bN` 映射与四张映射表不受影响（本轮已回归验证）
  - 无投稿限流（可在 RLS 加 pending 计数限制，列为候选）
- **下一阶段入口**：
  - 执行 Supabase 配置走通端到端
  - 投稿限流 / 移动端锚点 / 社区内容进入 3D 图谱（需评估）

## 阶段 16 七大新模型知识扩充 [计划时间：10.6 01:50 BY Trae][完成时间：10.6 02:16 BY Trae]

- **已完成**：
  - `js/data.js` models 段末尾追加 7 个 block（b7–b13，严格追加不影响既有映射）：WAI（Illustrious XL 系社区顶流，v1.0→v17 版本史 + 官方参数）、Anima（CircleStone Labs × Comfy Org 2B 开源动漫模型，Base/Aesthetic/Turbo）、Krea 2（Krea AI 首个从零训练基础模型，风格参考/情绪板/创意滑杆）、Wan 2.2（业界首个 MoE 开源视频大模型，双专家 SNR 切换）、Z-Image 造相（阿里 6B S3-DiT 单流架构，8 步出图中英文字渲染）、Seedream（字节统一生成+编辑，15 张组图/知识生图/4K）、GPT-Image（OpenAI 自回归路线，gpt-image-1→1.5→Images 2.5 Flare/Sunburst）
  - RESOURCES 基础模型类新增 7 张官方资源卡；GLOSSARY 新增 7 条「模型」术语；RESOURCE_MAP 新增 7 条映射（resName↔资源卡、blockIdx↔heading 程序化验证对齐）；models 段 summary 同步更新
  - `index.html` data.js 版本号 `20261005a → 20261006a`（防 Pages 10 分钟缓存）
  - 内容均经联网检索核实（官方博客/技术报告/模型页为准，检索日期 2026-10-06）
- **未完成**：3D 图谱（固定 30 节点）与思维导图未纳入新模型条目（债务项）；资源卡→正文跳转按钮的浏览器实测因桥接超时未跑完
- **改动文件**：`js/data.js`（+152 行）、`index.html`（版本号）
- **测试结果**：`node --check` 通过；结构校验 models 共 14 block、7 条映射全部解析正确；本地浏览器渲染验证 b7–b13 锚点/标题/资源卡全部正常、console 零报错；ANIM_BY_HEADING 与思维导图 REF_MAP 零改动、旧 block 索引未位移
- **风险**：跳转按钮走与既有 6 条映射相同的 `scrollToBlock` 代码路径，实测缺失风险极低；模型信息有时效性（如版本号），后续迭代需复查
- **下一阶段入口**：投稿限流 / 移动端锚点 / 3D 图谱扩节点评估 / 新模型接入 network-data 与 mindmap（需同步关注 30 节点性能）
- **本次文档更新时间**：10.6 02:16

## 阶段 17 NovelAI 实战手册改为折叠补充阅读 [计划时间：10.6 10:50 BY Trae][完成时间：10.6 11:29 BY Trae]

- **已完成**：
  - **数据标记**：`data.js` b6「NovelAI 4.5 实战全解（硬核操作手册）」加 `sub: true, parentIdx: 3`——数组位置与 heading 不变，锚点仍为 `models-b6`，四张映射表（RESOURCE_MAP/TUT_MAP/REF_MAP/ANIM_BY_HEADING）零改动
  - **渲染机制**：`app.js` sub 块渲染为父章节（b3 NovelAI）内部的可折叠面板（默认收起），父章节尾部自动生成「📖 补充阅读 ▸」展开按钮；子面板头部带「补充阅读」徽章 + 「收起」按钮
  - **导航层级**：侧边栏子标题按父子关系排序（b6 以 `└` 缩进紧跟 NovelAI），点击自动展开并滚动
  - **跳转兼容**：`scrollToBlock` 由「按 .block DOM 索引查找」改为「按 `${secId}-b${blockIdx}` 锚点 id 查找」——DOM 嵌套后索引查找会错位，按 id 查找对嵌套/重排免疫；命中子块自动展开
  - **hash 直达**：`init` 检测 `#models-b6` 类锚点，展开后主动 scrollIntoView（原生锚点滚动在 display:none 时期会落空）
  - **样式**：`style.css` 新增折叠面板/按钮/徽章/导航缩进样式 + 移动端适配；版本号全线递增至 `20261006b`（index/docs/admin/network 四页共用 style.css）
- **过程中发现并修复**：
  - **社区悬浮按钮遮挡**：`.kb-block-actions`（absolute right:0, z-index:5，opacity:0 时仍拦截点击）盖住折叠按钮导致收起失效——`.sub-fold` 提 z-index:6，子面板内社区按钮组上移至面板外沿（top:-14px）
  - **收起逻辑缺陷**：初版「collapsed/expanded 双类切换」在首次展开移除 collapsed 后收起失效——改为「默认 display:none，expanded 才显示」单向逻辑
- **测试结果**：`node --check` 通过；结构校验 14 blocks（b6=SUB→3）映射无越界；浏览器实测：初始折叠/父按钮展开/收起按钮收起/重复开合/导航嵌套排序/hash 直达展开+定位全部通过；b6 嵌套于 b3、13 个顶层块 + 1 子块、b7–b13 回归正常；console 无本改动相关报错（仅社区 supabase 导航中断 ERR_ABORTED，与本次无关）
- **改动文件**：`js/data.js`（+2 行标记）、`js/app.js`（导航排序/折叠控制/嵌套渲染/id 跳转/hash 展开）、`css/style.css`（+46 行）、`index.html`/`docs.html`/`admin.html`/`network.html`（版本号 20261006b）
- **风险**：`.sub-fold` z-index 高于社区按钮组，子面板右上角 hover 时两按钮组相邻但不再互相遮挡；若未来有 block 同时设 `sub:true` 与 `comm:true`，comm 优先（已守卫）
- **复用说明**：任何 block 加 `sub: true, parentIdx: N` 即成为 N 号章节的折叠补充阅读，无需改渲染代码；parentIdx 必须指向同 section 内的非 sub 块
- **下一阶段入口**：推送远端 / 更多章节的补充阅读化（如 compare 表格扩展）
- **本次文档更新时间**：10.6 11:29

## 阶段 18 六知识点扩充 + LoRA 双深度选读 [计划时间：10.6 12:40 BY Trae][完成时间：10.6 13:41 BY Trae]

- **已完成**（均经联网检索核实，检索日期 2026-10-06）：
  - **models 段追加 b14「Illustrious XL（illu · OnomaAI）」**：三大差异化（原生 1536px / NLP+Danbooru 混合提示 / 文本编码器微调）、v0.1→v3.5 VPred 版本表、推荐参数、与 Pony 生态不兼容辨析
  - **tools 段追加 b4「Forge」**（lllyasviel A1111 高性能分支：UNet Patcher + 动态显存卸载、4GB 跑 SDXL、原生 Flux、显存—提速速查表）与 **b5「Forge Neo 与 Forge Classic」**（Haoming02 接手双分支：Neo 支持/Z-Image/Anima/Krea 2/Wan 2.2 等新模型、SageAttention、uv 安装；Classic 稳定存档）
  - **fine-tuning 段追加 b5「加速 LoRA 与少步蒸馏（步数的极限）」**：蒸馏原理、Turbo/Lightning/Hyper-SD/LCM 方案速查表（步数/CFG/形态/要点）、CFG=0 硬约束翻坑指南、step 通用规律与「草稿少步→定稿常规步」策略
  - **fine-tuning 段追加 b6「分辨率：原生分辨率与出图策略」**：训练分布外推失败原理、SDXL 官方比例尺寸表、Illustrious 1536、Hires.fix 正路、显存×4 代价
  - **LoRA 双深度选读**：fine-tuning 段尾追加 b7「LoRA 浅显版：5 分钟看懂」（画师与便利贴类比、使用三步、三大常见困惑）与 b8「LoRA 硬核版：低秩分解与训练细节」（ΔW=BA 数学结构、内在秩依据、Kohya 训练超参表、过拟合识别治理、与加速 LoRA 本质区别），均 `sub:true, parentIdx:0` 挂在 LoRA 主块下，复用阶段 17 折叠机制
  - **GLOSSARY**：新增 Illustrious XL / Forge / Forge Neo / 加速 LoRA / 原生分辨率 5 条，扩写「采样步数」词条（补蒸馏 4–8 步与低 CFG 要求）
  - **RESOURCES**：基础模型+Illustrious XL、工具与界面+Forge/Forge Neo、微调与控制技术+加速 LoRA (Lightning/Hyper-SD)
  - **RESOURCE_MAP**：新增 4 条映射（Illustrious→models-b14、Forge→tools-b4、Forge Neo→tools-b5、加速LoRA→fine-tuning-b5）
  - `index.html` data.js 版本号 → `20261006c`
- **测试结果**：`node --check` 通过；结构校验 models=15 / tools=6 / fine-tuning=9 blocks，全部映射解析正确；浏览器实测：5 个新常规块渲染正常、LoRA 双子面板均嵌套于 b0 且默认收起、双展开按钮独立开合（开硬核版不影响浅显版、两面板可同时展开）、导航嵌套排序正确（NovelAI→4.5实战、LoRA→浅显→硬核→DreamBooth）、console 零报错
- **改动文件**：`js/data.js`（models/tools/fine-tuning 追加 5 块 + 2 sub 块 + 术语/资源卡/映射）、`index.html`（版本号）
- **风险**：sub 块锚点 `fine-tuning-b7/b8` 已被 sub 机制占用——今后若在 fine-tuning 段中部插入正式块会使 sub 块索引位移（追加式扩充不受影响）；分辨率块无资源卡映射（概念性内容，属预期）
- **下一阶段入口**：推送远端 / 其他难点概念的双深度化（如 CFG、采样器）
- **本次文档更新时间**：10.6 13:41

## 阶段 19 ComfyUI 章节深度拓展 [计划时间：10.6 13:50 BY Trae][完成时间：10.6 14:10 BY Trae]

- **已完成**（均经联网检索核实，检索日期 2026-10-06；sub 机制复用阶段 17）：
  - **主块 b1 增强**：补 App 模式/Desktop 降低门槛的最新信息，正文中给出三篇选读的导航脉络（官方生态 → 必装扩展 → 工作流资源）
  - **tools 段尾追加 3 个 sub 块（parentIdx:1 挂在 ComfyUI 下）**：
    - b6「ComfyUI 官方生态：平台、文档与 Registry」——按『装它（Desktop/便携版/Cloud）→ 用它（App 模式/模板/子图）→ 扩展它（Manager + Registry 语义化版本与恶意扫描）』脉络，附官方入口速查表（comfy.org、docs、registry、comfy-cli、示例集）
    - b7「ComfyUI 必装扩展与自定义节点」——按用途五分类（管理与效率/通用工具箱/修脸检测/控制条件/视频动图）：Manager、rgthree、KJNodes、Impact Pack、essentials、was-suite、Easy-Use、ControlNet aux、IPAdapter、AnimateDiff-Evolved+VHS、WanVideoWrapper、RES4LYF；附优先级速查表与安装避坑（依赖冲突、按需安装）
    - b8「ComfyUI 工作流资源地图与学习路径」——2026 现状资源地图（官方 Comfy Hub/Civitai 1800+/ComfyWorkflows/国内 eSheep·AIGODLIKE·LiblibAI；**OpenArt 工作流区已于 2026.1 停服**）、工作流 JSON/PNG 分享原理、五步学习路径、使用礼仪与安全
  - **GLOSSARY**：+工作流（基础）、+ComfyUI Manager（工具）、+自定义节点（工具）
  - **RESOURCES**：工具与界面 +ComfyUI-Manager、+ComfyUI 工作流资源两张卡
  - `index.html` data.js 版本号 → `20261006d`
- **测试结果**：`node --check` 通过；结构校验 tools=9 blocks（b6–b8=SUB→1）映射无越界、术语 59 条；浏览器实测：三子面板均嵌套于 tools-b1 且默认收起、三个展开按钮标签正确、开「官方生态」不影响其余面板、导航嵌套顺序正确（ComfyUI→官方生态→必装扩展→工作流资源）、console 仅既有 supabase ERR_ABORTED（与本改动无关）
- **改动文件**：`js/data.js`（tools 主块增强 + 3 sub 块 + 3 术语 + 2 资源卡）、`index.html`（版本号）
- **风险**：tools 段现有 6 个 sub 块（含 Forge Neo 正式块 b5 之后）——社区投稿若补充 tools 段会排在 sub 块之后（cid 机制不受影响）；工作流资源站信息有时效性，半年后建议复查
- **下一阶段入口**：推送远端 / 其他重点章节拓展（如 ControlNet、采样器专题）
- **本次文档更新时间**：10.6 13:46（内容实际完成于 13:55 前后，一并署名完成时间 14:10 以覆盖验证与提交时段）

## 阶段 20 二次元工作流全景 + 审查机制分层 [计划时间：10.6 13:55 BY Trae][完成时间：10.6 14:20 BY Trae]

- **已完成**（联网检索核实，检索日期 2026-10-06）：
  - **models 段追加 b15「二次元生成：主流工作流全景」**：Illustrious 系底模选型（WAI/NoobAI-XL/官方底模/NAI）、EPS vs VPred 关键分支（VPred 需 Euler+ZTSNR+低 CFG）、四段式标签体系（画质/分级/角色画师/通用）、六步标准管线（原生出图→Hires.fix(R-ESRGAN Anime6B)→ADetailer/FaceDetailer→ControlNet→LoRA 叠加→出图）、参数基准表、LoRA 训练社区起点参数
  - **models 段追加 b16「审查机制的分层真相与合规边界」**：审查四层结构（平台层服务端双分类器/运行时层 Safety Checker 可选模块/权重层无内置审查器属开源客观属性/数据层 censored·uncensored 训练分级）；2026 平台动态（Civitai 4 月双域名拆分、NSFW 元数据强制、AI 审核管线；Visa/Mastercard 高风险分类为动因）；合规边界与零容忍红线清单（未成年性化=刑事犯罪、真人肖像、非自愿内容）。定位为科普+合规导向，不提供规避平台审核的手段
  - **GLOSSARY**：+EPS/VPred（原理）、+Safety Checker（原理）、+分级标签（基础）、+NoobAI-XL（模型）
  - **RESOURCES**：基础模型 +NoobAI-XL 卡（官网/HF Laxhar/Civitai）
  - `index.html` data.js 版本号 → `20261006e`
- **测试结果**：`node --check` 通过；结构校验 models=17 blocks（b15/b16 正式块）、全部 RESOURCE_MAP blockIdx 在范围内、术语 63 条；浏览器实测 b15/b16 渲染正常、2 张表格完整、NoobAI-XL 卡与 4 个新术语生效、models 顶层 16 块（17-1 嵌套子块）；console 仅既有 supabase ERR_ABORTED（与本改动无关）
- **改动文件**：`js/data.js`（models +2 块 + 4 术语 + 1 资源卡）、`index.html`（版本号）
- **风险**：平台政策类信息时效性强（Civitai 双域名、支付通道），建议半年内复查；b16 内容已按「科普结构事实+突出法律红线」基调撰写，后续社区投稿若涉及此话题需保持同一基调
- **下一阶段入口**：推送远端 / 采样器与调度器专题 / ControlNet 专题
- **本次文档更新时间**：10.6 13:53

## 阶段 21 补充阅读栏内展开设计修正 [计划时间：10.6 14:25 BY Trae][完成时间：10.6 14:40 BY Trae]

- **已完成**：应用户设计要求，折叠补充阅读的面板展开位置改为**栏内跟随各自按钮**——app.js 渲染时面板经 `insertAdjacentElement('afterend')` 插入到 `.sub-toggles` 内自己按钮的正下方（DOM 顺序 [btn,panel] 交替），不再统一堆在按钮组之后；style.css 清掉栏内面板的外边距由 gap 统一节奏；版本号 app.js/style.css → `20261006c`（四页 style.css 同步）
- **测试结果**：`node --check` 通过；浏览器 DOM 顺序验证 tools-b1 栏为 [BTN:b6,PANEL:b6,BTN:b7,PANEL:b7,BTN:b8,PANEL:b8]、models-b3 同构（桥接后续退化，点击交互未复测——展开逻辑代码未变，风险极低，已请用户目验）
- **沉淀**：该设计规则已写入 Trae 项目记忆 Hard Constraints + 用户级 WORK_MEMORY.md（agent-work-habits-write），今后所有「补充阅读」类组件默认此设计
- **改动文件**：`js/app.js`、`css/style.css`、`index.html`/`docs.html`/`admin.html`/`network.html`（版本号）
- **本次文档更新时间**：10.6 14:35

## 阶段 22 反推流知识扩充 [计划时间：10.7 15:10 BY Trae][完成时间：10.7 15:40 BY Trae]

- **素材来源（用户收集）**：RunningHub「Anima 本地简易反推流」工作流（国内站/国际站）、PixAI Tagger v1.0 发布页、视频整合包与模型（夸克）、KJNodes / rgthree / Easy-Use / ComfyUI-TaggerPlus（Zove-try）/ z-tipo-extension / ComfyUI-Tagger（sln77）/ D 站插件 / TE 启动器
- **已完成**（联网检索核实，检索日期 2026-10-07）：
  - **tools 段追加 b9「反推流：把图变回提示词（图像打标）」**（正式块）：反推定义与存在理由（模型吃 Danbooru 标签、人写散文，反推即翻译器）、原理（多标签分类 + sigmoid 置信度 + 阈值，非生成）、三条技术路线速查表（专用打标模型 / VLM / LLM 扩写）、六类标签体系（general/character/style/copyright/meta/rating）、标准六步管线（选图→打标→清洗→扩写→按序重组→出图，含 Anima 的十段顺序约定）、三大用途（复刻参考图/数据集打标/图库检索）、常见坑（标签是起点非答案、顺序影响权重、角色与系列锁死、rating 处理、写实图走 VLM、官方声明不可用于审核判定）
  - **tools 段追加两个 sub 块（parentIdx:9 挂在反推流下）**：
    - b10「PixAI Tagger v1.0 vs WD14：打标模型怎么选」——v1.0 规格（30,877 标签 / SAM3 骨干 486.3M / 1008² / 数据截止 2026-05 / Apache-2.0）、六类默认阈值（0.17/0.27/0.15/0.24/0.17/0.41）、官方 8 模型共享词表 benchmark（general micro F1 0.6660 第一、character 0.9242 第二、style 0.8143 领先）、v0.9→v1.0 进步、H100 吞吐 48.3 img/s、WD14 v3 与社区 canary（16,473 标签）、Camie v2 / AnimeTIMM 概览、局限与红线
    - b11「ComfyUI 反推流实战：插件、节点与一条完整链路」——WD14(pysssss) / sln77（PixAI + Camie + Taggerine + Tag Combiner）/ TaggerPlus（会话缓存、device 显示、模型下拉、safetensors+timm、hf-mirror、CUDA12 静默退回 CPU 坑，实测 16.5s→0.09–0.2s）/ z-tipo-extension（tag length、NL length、Ban tags、Prompt Format 占位符、Seed、Temperature）/ 六节点完整链路 / 模型放置路径 / 云端工作流平台注意事项 / 安全提醒
  - **GLOSSARY +7**：反推（图像打标）、Tagger、WD14 Tagger、PixAI Tagger、TIPO、VLM 打标、Danbooru 标签（术语总数 63→70）
  - **RESOURCES +6 卡**（工具与界面）：WD14 Tagger 权重（SmilingWolf）、PixAI Tagger v1.0、ComfyUI-Tagger(sln77)、ComfyUI-TaggerPlus、TIPO/DanTagGen、RunningHub（在线 ComfyUI 工作流，链接已去除 inviteCode 推广参数）
  - **RESOURCE_MAP +5** 条，全部指向 `tools-b9`
  - **models-b15 正文补交叉引用**：把「反推」标注为二次元工作流的第 0 步
  - `index.html` data.js 版本号 → `20261007a`
- **未纳入（有意）**：夸克网盘整合包/模型、「D 站插件」网盘包、TE 启动器视频——均为网盘分发或视频教程，链接易失效且不便核验，未写入资源卡（B 站视频 BV1s1HL6VE8Q 已在 RunningHub 卡说明中隐含指向）
- **测试结果**：`node --check js/data.js` 通过；临时结构校验脚本（已删除）验证：tools=12 blocks（b6–b8 SUB→1、b10/b11 SUB→9，parentIdx 均指向非 sub 块）、models 仍 17 blocks、RESOURCE_MAP 全部 resCat/resName/secId/blockIdx 解析有效、TUT_MAP 无越界、术语 70 条、资源卡无重名；lint 零报错
- **改动文件**：`js/data.js`（tools +3 块、models 正文 1 处、术语 +7、资源卡 +6、映射 +5）、`index.html`（版本号）、`HANDOFF.md` / `PROGRESS.md`
- **风险**：PixAI Tagger benchmark 与版本号时效性强（半年内建议复查）；TaggerPlus/sln77 为社区小众插件（star 数低），信息以仓库 README 为准，后续可能变动；RunningHub 工作流页可能下架
- **下一阶段入口**：推送发布 / 采样器与调度器专题 / ControlNet 专题 / 3D 图谱与思维导图纳入 16–22 阶段新增条目（债务项）
- **本次文档更新时间**：10.7 15:40

## 当前风险与债务

1. **版本号手工维护**：易遗漏，遗漏即表现为"功能没上线"。建议后续每次改动固定检查。
2. **映射表分散**：`RESOURCE_MAP` / `TUT_MAP` / `REF_MAP` / `ANIM_BY_HEADING` 四处独立，改 heading 或插入 block 会静默失效。
3. **无自动化测试**：依赖人工预览 + `node --check` + lint。
4. **`docs.html` 反向链接为运行时注入**：依赖页面内脚本，若 JS 被禁用则缺失。
5. **3D 图谱节点数固定 30**：后续扩节点需同步关注性能。
