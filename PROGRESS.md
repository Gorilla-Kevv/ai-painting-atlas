# PROGRESS — AI 生图知识图谱

## 进度看板（10.6 02:16 更新）
- 当前正在开发任务：无（阶段 16 已完成并提交）
- 下一阶段任务：待定（候选见 HANDOFF「下一步」：投稿限流 / 移动端锚点 / 社区内容进 3D 图谱）
- 可提前进行的任务：投稿限流加固（RLS 每人 ≤5 条 pending）
- 未完成的任务：3D 图谱 / 思维导图纳入阶段 16 新增模型条目（债务项，需评估性能）

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

## 当前风险与债务

1. **版本号手工维护**：易遗漏，遗漏即表现为"功能没上线"。建议后续每次改动固定检查。
2. **映射表分散**：`RESOURCE_MAP` / `TUT_MAP` / `REF_MAP` / `ANIM_BY_HEADING` 四处独立，改 heading 或插入 block 会静默失效。
3. **无自动化测试**：依赖人工预览 + `node --check` + lint。
4. **`docs.html` 反向链接为运行时注入**：依赖页面内脚本，若 JS 被禁用则缺失。
5. **3D 图谱节点数固定 30**：后续扩节点需同步关注性能。
