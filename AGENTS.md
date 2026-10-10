# AGENTS.md — AI 生图知识图谱 · Agent 工作规则

本仓库任何 agent 会话的固定工作规则（agents.md 开放标准）。人类读者请读 `README.md` 与 `HANDOFF.md`；本文件面向自动执行者，规则冲突时以 **HANDOFF.md「决策与坑」> 本文件 > 聊天记忆** 为序。

## 项目速览

- 纯静态站点（HTML/CSS/原生 JS），**无构建、无依赖安装**；Three.js/字体走 CDN
- 内容源：`js/data.js`（SECTIONS/GLOSSARY/RESOURCES/RESOURCE_MAP/TUT_MAP）；社区层 `js/community-data.js` 由后台自动生成，**禁止手编**
- 交付文档：`PROGRESS.md`（阶段台账+看板）、`HANDOFF.md`（环境/坑/命令）——代码仓库是唯一真实上下文，聊天记录不是

## 硬性红线（踩过的坑，违反即返工）

1. **缓存穿透**：改动任何 JS/CSS，必须同步递增引用处 `?v=YYYYMMDDx` 版本号（GitHub Pages 有 10 分钟缓存）；只增不改旧值
2. **block 只能追加在 section 数组末尾**（`-bN` 锚点与四张映射表全部依赖数组索引）；确需重排必须同步重算 `RESOURCE_MAP.blockIdx`、`mindmap-ui.js` REF_MAP、`network-data.js` detailRef 三处映射并全量校验
3. **sub/parentIdx 折叠选读**：锚点 id 不变但 DOM 嵌套进父块——按 DOM 顺序索引的查询一律失效，跳转必须按锚点 id；面板栏内 [btn,panel] 交替是用户钦定设计，勿改
4. **右上角控件避让**：`.kb-block-actions`（补充/编辑）absolute right:0，`block-head` 已预留 `padding-right:150px`、其 `top:1px` 为量算值——都不得回退；暗底徽章/控件文字 ≥12px 且非等宽
5. **入场动画 IO `threshold` 必须为 0**：章节高度早已超过 12 倍视口，任何非 0 阈值都会让整节永久 opacity:0（阶段 25 P0 事故）
6. **存疑不写入**：联网调研的事实必须带来源；无法核实的内容一律不写或明确标注不确定；CSDN 系"评测/对比"文章按内容农场处理
7. 正文语言为简体中文；`ANIM_BY_HEADING` 按 heading 文本匹配——改标题会静默丢动画

## 会话与提交流程（token-efficient-agent-workflow）

- 每完成一个阶段：更新 `PROGRESS.md`（阶段条目带 `[计划时间][完成时间] BY <agent>` 署名，**全文件严格升序，写后必审**，刷新文件头看板）→ `git add` 按路径提交（禁 `add -A`）→ commit message 注明「阶段N: 小结」
- **push 仅在用户明确说「推送/上线/发布」类触发词时执行**；用户也可能自行 push
- 预览服务用 `python -m http.server 8010+`（**8000 被 ClipDown 控制台占用，禁止触碰/杀进程**）；验证即截图+DOM 量测+console 检查，验证完停掉自己的服务
- 删除一律进回收站，不硬删

## 常用命令

```bash
node --check js/data.js && node --check js/app.js      # 语法预检
python -m http.server 8010 --directory "<repo>"        # 本地预览
MSYS_NO_PATHCONV=1 gh api /repos/Gorilla-Kevv/ai-painting-atlas/pages/builds/latest  # Pages 构建状态（Git Bash 必加前缀）
```

## 知识生产标准管道（大改动沿用）

1. 并发子智能体联网调研（每专题一个，只回结构化摘要+来源 URL，禁止改文件）
2. 主线 agent 写入 `js/data.js`：新块严格追加 → 术语/资源卡/RESOURCE_MAP 三件套同步 → 版本号递增
3. 校验三件套：`node --check` → 临时脚本做结构/映射/重名断言（用毕即删）→ 浏览器实测（渲染/折叠/跳转/console）
4. 更新交付文档并升序审查 → 阶段提交

## QMind 知识库同步（「ai绘图知识」）

网页知识更新后如需同步：按 `01-参考书(9章)/02-术语/03-资源/04-映射/05-教程/06-导图/07-图解` 的 15 文件 Markdown 导出模板重导（导出脚本要点：eval data.js → strip HTML 标签 → 渲染 meta/table/callout/faq → 临时目录逐文件 add_source）。

## 分支

- `main`＝发布线（阶段 24 起按用户指示多在其上直改）；`knowledge-expansion`＝知识扩充专用
- 开工前 `git status` 确认工作区干净、当前分支正确；发现非本任务改动即停下报告
