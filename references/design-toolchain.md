# 设计资产到最终影片

## 小组件先设计，再做动效

对文件夹、票签、图标、按钮、界面碎片等，先在 FigCraft / Figma / VectorCraft 做轮廓、排版、配色和状态，将需要运动的部分拆成独立层，再交给 EffectCraft 做开合、遮罩、描线、轻透视与阴影。图像纹理需要时才加 PhotoCraft。平面设计和浅空间已经能满足时，不为了“高级”强行建模。


组件先导出关键画面与带前后镜头的短预览，再接回原时间轴。用户只否定一段时保留其认可的其他部分；不用安装或调用更多软件来代替设计判断。

## 工具按实际作用组合

| 环节 | 工具与接口 | 输出与边界 |
|---|---|---|
| 关键画面、版式、文字与组件 | FigCraft CLI / MCP；按需用 Figma 或 Pen.dev | 原生文字、矢量、组件与状态；保留设计源、对象 ID、实际导出。Figma 使用时记录 fileKey / nodeId；截图不等于可编辑组件 |
| 路径、插画、几何、标志与矢量造型 | VectorCraft CLI / MCP | `.vectorcraft`、SVG、PDF、PNG；贝塞尔控制点、填充、描边和效果兼容性分别检查 |
| 图像、纹理、局部光影与分层环境 | PhotoCraft CLI / MCP | `.pcraft`、PSD、PNG；原生调整结构与跨软件 PSD 的栅格层不是同一编辑能力 |
| 三维建模、实体材质、灯光、镜头 | Blender Python / background / 可用 MCP | `.blend`、连续帧、合成底片；真实几何、设备、采样和色彩转换记录在工程 |
| 二维动画、合成、原生字幕和渲染 | EffectCraft CLI / MCP | 原生 Shape、关键帧、遮罩、预合成和 `.ecproj`；检查导入后是路径还是素材 |
| 配音、配乐和音效的编辑与混音 | SoundCraft CLI / MCP | 原生 `.scraft`、媒体与 WAV 分轨；导入后显式指定轨道 ID，保存重开检查缺失媒体，最终编码另测响度。它不替代所选的配音和配乐生成工具 |
| 报告、画册、长文本成果设计 | DesignCraft CLI / MCP | `.designcraft`、PDF、PNG；文字格式作用于 UTF-8 字节范围，先选文本再设置字体，检查中文和溢出 |
| 演示文稿与发布会内容资产 | DeckCraft CLI / MCP | `.deckcraft`、PPTX、PDF、PNG；PPTX 需要实际重开。幻灯片转场不等于完整 MG 动画能力 |
| 剪辑、分轨、调色及交付 | FilmCraft、Resolve/Fusion、Final Cut Pro、剪映 | 选择最适合的终编工具。FCPXML、媒体和 SRT 是交接形式，不等于所有软件都有 headless 或 MCP |

当前用户授权利用可用工具，也授权升级 Craft 系列。普通跨机器制作无需自动安装全套软件。使用本机可用能力；记录每个工具的真实作用，避免把“已安装、已配置、已调用、已制作、已验收”混为一谈。

## 官方 VectorCraft 接法

依据 [官方 MCP 文档](https://github.com/storytold/vectorcraft/blob/main/docs/mcp.md) 和 [官方 releases](https://github.com/storytold/vectorcraft/releases)。macOS `.app` 只有桌面程序，CLI 是单独的 `vectorcraft-cli-<version>-macos-universal.zip`。

```bash
vectorcraft-cli --version
vectorcraft-cli commands
vectorcraft-cli mcp --headless
vectorcraft-cli run --in artwork.svg --export artwork.vectorcraft --export artwork.png
```

客户端配置 `command` 使用实际绝对路径，`args` 使用 `["mcp", "--headless"]`。裸 `mcp` 会尝试本机 7979 端口后回退，不适合要求确定隔离的制作。显式连接桌面窗口时按官方文档启动对应应用的 control 端口。

MCP 使用 stdio / newline JSON-RPC。先 `initialize`、`tools/list`，然后 `command_list` 或工具 schema 发现命令；不要猜参数。脚本批处理使用 `run --commands`，可查询 `doc_inspect` 并保存原生文件。

## PhotoCraft 接法

依据 [官方 MCP 文档](https://github.com/storytold/photocraft/blob/main/docs/mcp.md)。其文件访问需要根目录参数，不照抄 VectorCraft 的全部开关：

```bash
photocraft-cli mcp --automation-read-root /absolute/project --automation-write-root /absolute/project
photocraft-cli commands --json
photocraft-cli run --new '{"width":1920,"height":1080,"depth":16,"background":"#F2EFE7"}' --out studio.pcraft
```

调用 `doc_new`、`command_run`、`doc_inspect`、`doc_save`、`doc_export`；生产后用原生文件重新打开导出。按工作目录配置根，不把本机路径固化为跨机器条件。

## 交接的实际验证（2026-10-28）

- Figma 官方 MCP：已创建原生关键画面，读取节点、导出 SVG 并审看截图。
- VectorCraft 0.17.0：MCP 初始化与命令调用、SVG 导入、原生 Bézier 创建、原生保存和重开、PNG/SVG/PDF 导出已完成。FORM 原生重开 PNG 与保存前一致。
- PhotoCraft 0.16.0：16 位分层渐变、独立低强度颗粒层、原生保存重开与 PSD/PNG 导出已完成；重开 PNG 字节一致。
- PhotoCraft → EffectCraft 0.17.0：PSD 作为合成导入，三个独立素材层及 SoftLight 混合方式保留；不能声称 PhotoCraft 的渐变参数在 EffectCraft 中仍是同一种可编辑调整层。
- VectorCraft PDF → EffectCraft：本案例只得到素材层。为路径修剪，把已导出的 `M/C/Z` 实线描边转换成独立原生 Shape，保留 vertices / inTangents / outTangents。`assets/design-exploration/FORM/source/svg_paths.py` 只支持该明确子集，遇到变换、复合路径、渐变或其他指令需拒绝并另选交接方式。
- Figma 的 `feFlood/feColorMatrix/feOffset/feGaussianBlur/feBlend` 组合阴影在本次 VectorCraft SVG 导入中被忽略且返回 warnings。应去掉导出阴影后在合成器重建，或把只需保持外观的阴影单独栅格化。
- EffectCraft 的合成引用应按明确名称或 ID 获取，并读回 source；本轮给 `app.project.activeItem` 赋值没有让后续读取指向预期画面合成，曾使字幕版只有背景。修复后逐版抽查实际画面，不能仅凭主片正常推断嵌套版正常。
- EffectCraft 本轮音频直接导出的 AAC 测得 +2.14 dBTP，改为用校准母带统一封装，最终配音两版为 −16.02 LUFS / −1.01 dBTP，AAC 数据一致。每次测实际最终编码，不把 WAV 母带指标当作 MP4 指标。
- FORM 原生工程在独立目录重建，1.5、6.7、15.2 秒逐像素一致；相对路径包括 PSD 导入的中间工程，不仅最终工程。
- FCPXML 通过本机 Final Cut Pro 的 1.10 DTD 校验，FilmCraft 0.13.0 实际导入无离线素材，保存重开后渲染了 8 秒帧。原生合成仍在 EffectCraft，剪辑工程引用的是已合成的画面与独立声音资产。
- Final Cut Pro 11.2 与剪映 11.5.0 的安装已核实。剪映的本机包名为 `VideoFusion-macOS.app`、bundle ID `com.lemon.lvpro`。安装不代表已验证自动化导出。

## 升级与生命周期

使用官方 release 元数据与摘要校验下载，检查架构、代码签名和 macOS 应用 Gatekeeper；保留旧版与配置备份。原包附带 FinderInfo 导致严格签名检查失败时，只在暂存副本清除该 Finder 展示属性，再重新验证签名和 notarization；不清除隔离属性、不禁用 Gatekeeper。

本轮 GUI/CLI 同步版本：VectorCraft 0.17.0、PhotoCraft 0.16.0、EffectCraft 0.17.0、FilmCraft 0.13.0、LightCraft 0.14.0、PdfCraft 0.14.0；ArtCraft 0.41.0 与官方 latest 相同。以后仍查当次官方 release，不把这些版本当永久最新。

Codex 新增 MCP 配置不代表当前会话已重新加载工具。可先使用已验证的独立 CLI/MCP stdio 会话完成制作，下一次客户端加载后检查工具是否出现。按需运行，不添加后台常驻服务，也不终止其他会话的进程。

## 本地补充工具实测（2026-10-30）

用户要求安装 FigCraft、SoundCraft、DesignCraft、DeckCraft，也用于其他项目。已安装的 GUI / CLI 对应版本为 0.12.1 / 0.14.0 / 0.14.0 / 0.12.0；每个工具都经过官方摘要、代码签名、Gatekeeper 与桌面启动检查。版本来自当日官方 GitHub release，官网介绍页可能滞后，以当次 release 再核对。

四个原生 headless MCP 已实际完成创建、保存、重开、导出。可执行文件按本机约定置于 `~/Library/Application Support/<App>/bin/<app>-cli`，并有 `~/.local/bin/` 入口；跨机器须发现实际位置。Codex 配置已写入，但工具枚举需要客户端重新加载；当前制作可使用已验证的独立 stdio 会话，不因此卡住任务。

最小调用：

```bash
figcraft-cli mcp --automation-read-root /absolute/project --automation-write-root /absolute/project
soundcraft-cli mcp --automation-read-root /absolute/project --automation-write-root /absolute/project
designcraft-cli mcp --automation-read-root /absolute/project --automation-write-root /absolute/project
deckcraft-cli mcp --automation-read-root /absolute/project --automation-write-root /absolute/project
```

先 `initialize`、`tools/list` 获取本机 schema，再调用工具。不要把四者的命令名和参数互换：

- **FigCraft**：`create_node` → `save_file` → `open_file` → `export`。验证了中文关键画面、独立 component、PNG/SVG 输出，保存重开 PNG 一致。CLI 的 `run script.json --out design.figcraft` 支持原生命令批次和 `$ref` 引用；SVG 到 EffectCraft 的路径、字体和效果仍需单独验证。
- **SoundCraft**：`new_session` → `import_audio` → `execute` → `save_session` → `open_session` → `bounce_mix`。`import_audio` 返回 `imported[].track`；它不自动选中轨道，调整音量需 `mix.volume {tracks:[id], db:-6}`。本次原创配音导入、音量修改、48 kHz / 32f WAV 导出及保存重开 PCM 一致，无缺失媒体。仅验证单轨链路，未证明所有插件、多轨自动化或完整音乐听审。
- **DesignCraft**：`new_document` → `execute frame.create` → `text.select {story, anchor:0, focus:utf8_length}` → `type.char {attrs:{fontFamily, fontStyle, size}}` → `save_document` / `export_png` / `file.exportPdf`。只创建文字框后直接 `type.char` 曾返回成功但没有修改正文，导致中文方框；选择故事的 UTF-8 范围后明确用 PingFang SC 修复。检查 `font.list` 精确匹配、正文无 overset、PDF 可提取中文和实际画面。
- **DeckCraft**：`new_presentation` → `add_slide` / `add_text_box` → `save_presentation` → `export`。验证原生保存重开 PNG 一致，PPTX 重开可渲染，PDF 可导出；复杂母版、动画与其他 Office 应用兼容性仍需按项目测试。

原生样例与检查位于 `assets/toolchain-checks/20261030/`，属于工具链验证，不是新风格成片或商业质量验收。

### Figma / Pen.dev 的位置

MG 的设计资产环节不要求生成网页代码。先根据可编辑文字、组件、路径、素材交接和渲染可靠性选工具；本机以 FigCraft + VectorCraft + PhotoCraft 为主要设计组合。Figma 适合已有客户文件与协作，Pen.dev 适合页面设计和代码联动；仅在确实有用且额度可用时选用。Pen.dev 的 Agent 天数与模型额度分开，MCP 也可能受 Agent 天数限制；使用时查官方最新定价，不写成无额度限制的默认后备。此次 Pen.dev MCP 连接关闭，未完成设计操作，不把打开空文档计作参与生产。

官方资料：[FigCraft CLI](https://github.com/storytold/figcraft/blob/main/docs/cli.md)、[FigCraft MCP](https://github.com/storytold/figcraft/blob/main/docs/mcp.md)、[SoundCraft MCP](https://github.com/storytold/soundcraft/blob/main/docs/mcp.md)、[DesignCraft MCP](https://github.com/storytold/designcraft/blob/main/docs/mcp.md)、[DeckCraft MCP](https://github.com/storytold/deckcraft/blob/main/docs/mcp.md)、[Pen.dev 定价](https://www.pen.dev/pricing)。

