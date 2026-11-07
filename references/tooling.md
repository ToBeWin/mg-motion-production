# 工具选择与工程

优先延续已经得到用户认可、可编辑且能稳定渲染的工程。工具应服务需要的画面；不为证明软件能力而重建整个片子。

| 工具路线 | 合适任务 | 使用边界 |
|---|---|---|
| Figma 官方 MCP | 关键画面、文字、组件与视觉规范 | 创建真实可编辑节点；按 Figma Skill 检查字体、图层、截图和导出 |
| VectorCraft CLI / MCP | 路径、插画、图标、几何母形与矢量造型 | 单独安装 CLI；检查滤镜、字体、图层及控制点的交接 |
| PhotoCraft CLI / MCP | 分层图像、纹理、局部光影和环境 | 保存 `.pcraft` 与必要 PSD/PNG；检查 16 位、透明与混合方式 |
| Canvas/SVG + Node + FFmpeg | 几何、字体、UI、数据；精确可重复时间轴 | 3D 材质能力有限；需注册实际字体并检查输出 |
| Remotion/React | 可复用组件、字幕、UI、数据、多规格 | 核实当前依赖与渲染环境；不要仅交网页播放器 |
| EffectCraft / AE | 图层合成、关键帧、表达式、编辑器工作流 | MCP/CLI 能力按本地版本确认；导出的脚本不等于原生工程 |
| Blender Python + background render | 3D 形态、材质、相机、几何节点 | 先看小样材质与灯光，再付出长时间渲染成本 |
| FilmCraft / DaVinci Resolve / Fusion | 剪辑、合成、调色、混音 | 各工具的脚本与无界面能力不完全相同，不能一概而论 |
| Final Cut Pro / 剪映 | 终编、字幕、声音与交付适配 | 按软件支持的 FCPXML、媒体、SRT 或 UI 交接；不虚构 headless/MCP 能力 |

实际设计到动画的安装、接口、保真测试与已知兼容性问题见 [设计工具链](design-toolchain.md)。

## 本地能力检查

先发现已有连接器/MCP，能力不足才转 CLI 或合规 UI 操作。检查可执行路径、`--help`、版本和一个最小读/写/渲染动作。没有工具时不要声称已调用。

本次制作环境曾存在（需要时重新确认，不是跨机器固定配置）：

- macOS EffectCraft CLI：`~/Library/Application Support/EffectCraft/bin/effectcraft-cli`，MCP 启动使用 `mcp --autosave`。
- FilmCraft 对应的 CLI 位于应用支持目录；它的 MCP 参数与 EffectCraft 不同，不复制 `--autosave`。
- Blender 可用 `blender --background --python scene.py`；真实路径和渲染设备先检测。
- Codex MCP 配置变更不代表当前会话已经载入新工具；应发现实际可用工具或使用已确认的 CLI。

2026-10-25 已从连接检查推进到实际原生制作：三场景初版及七场景进阶版使用 EffectCraft MCP 构建，原生 renderQueue 或 headless CLI 导出；新增 ORBIT 网站循环使用 EffectCraft 的 Advanced 3D 图元、灯光、材质与相机。早先 Focus 样片仍属于 Blender + Canvas + FFmpeg 路线，不能混称。MCP 会话与 `--gpu` CLI 的设备设置不同，按每次运行记录说明。具体可重建代码及已验证边界见 [原生案例](effectcraft-native.md)。

安装或升级软件不是普通 MG 制作的默认前置步骤。已有工具能完成就直接制作，缺工具时按用户已有授权处理。MCP 是调用接口，不是自动具备所有 AE 功能的证明。

## 确定性与字体

核心渲染接口采用 `draw(context, seconds)`，每一帧由绝对时间和显式状态决定。不要在渲染里用 `Date.now()`、不固定种子的随机数、上帧累加位置或依赖播放顺序的状态。异步资源、字体加载完成后才能渲染。

保存/恢复 Canvas 的 transform、clip、alpha、composite 与共享色板。镜头负时间预演要测试。临时主题变更用 `try/finally` 恢复，缓存键覆盖主题、时间及分辨率。

字体用明确文件/字体家族并记录来源。别假设给字体取一个别名就改变了字体内部家族；渲染实际中文、英文和数字样本，检查宽度、缺字和回退。示例使用当前机器的 Arial Black / Hiragino Sans GB，不随 Skill 分发字体；换机器可设置 `MG_LATIN_FONT` / `MG_CJK_FONT` 后重新检查，不能承诺像素相同。

## 样例项目

`create_example.py` 只向不存在的新目录复制文件，不联网、不安装依赖、不修改已有项目。输出 `visual/`、`audio/` 和相对路径的重建说明。样例保留原始“一念成形”文案，实际任务应重新编排，不把固定 32 秒当默认需求。

在项目的 `visual/` 执行 `npm ci` 安装锁定依赖；`node render.cjs stills 3.8 4 4.2` 抽样，`FPS=60 SAMPLES=3 node render.cjs video ../silent.mp4` 渲染。`START` 与 `DURATION` 可限制试渲染区间，输出文件使用调用者给定路径。

音频依赖 NumPy、FFmpeg：在项目根执行 `python3 audio/compose_score.py --style brand --cues audio/cues.json --out audio`（产品版换成 product）。该示例合成器只针对现有 32 秒乐曲，变更时长/结构需改编音乐，不能直接拉伸。

实际交付使用 `source/` + `MP4` 时附对应目录的重建命令。AE JSX、EffectCraft 工程、Blender .blend、Canvas JS 分别标注，不能把 JSON/JS 改后缀冒充 .aep 或 .blend。

连续空间案例在 `assets/focus-study/`。Blender 生成脚本用 `--background --factory-startup --python-exit-code 1`：默认用户配置可能启用插件或本地化节点名，而 Blender 默认即使 Python 失败也可能返回零退出码。图片打包进 `.blend` 后再交付；完整渲染仍须检查结束帧和日志。该案例有真实三维场景和独立二维叠层，完整 18 秒成片不等于 `.blend` 内的 14 秒三维层。

