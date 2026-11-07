# 放晴 / SUNPOP · 把今天，打开。

原创虚构气泡饮料品牌的 MG 广告探索，24 秒，1920 × 1080，30 fps。

这次从包装、字标与图形组件开始设计：电光蓝、柑橘橙、奶油白组成统一色彩系统；圆形在太阳、气泡、标点和转场之间接替。运动分成真实罐体的刚性旋转、图形的弹性和文字的节奏冲击。没有引用真实饮料品牌的包装或商标。

## 观看

- `SUNPOP_把今天打开_纯音乐版.mp4`：音乐与触感音效，突出品牌节奏。
- `SUNPOP_把今天打开_配音字幕版.mp4`：短口号配音与透明底字幕。
- `SUNPOP_把今天打开_无字幕配音版.mp4`：相同配音混音，适合另做字幕或版式。
- `SUNPOP_把今天打开_画面.mp4`：无声画面，供剪辑使用。

## 这次实际用到的工具

- **VectorCraft 0.17.0**：原创 SVG 包装、字标和太阳组件的原生工程及 PNG 输出。字形在包装中转为轮廓，保留 SVG 与生成代码。
- **Blender 5.2.0 / Cycles / Metal**：罐体轮廓网格、UV 包装、铝制拉环与卷边、冷凝水；三段连续三维动画。`.blend` 已打包纹理。
- **EffectCraft 0.17.0**：原生文字、形状、父级运动、缓动、遮挡和转场，16 bpc；三维透明片作为可替换素材合成。
- **本地 IndexTTS2**：三条短口号，使用先前获准的合成声音参考。每次生成后进程退出，附源 WAV 和生成记录。
- **本地 MiniMax Music3 MLX q6**：为本片生成新配乐。第一条偏卡通管弦乐，最终选第二条放克／迪斯科方向，未使用短循环伪装成整段音乐。
- **FFmpeg**：透明 ProRes 4444 中间片、分轨混音、AAC 母版及交付检查。
- **FilmCraft**：原生剪辑交接工程；另提供经本机 Final Cut Pro DTD 校验的 FCPXML。DTD 与 FilmCraft 导入不等于 Final Cut Pro GUI 人工验收。

Figma 本轮没有参与设计。此前连接遇到调用额度限制，本轮直接完成可编辑 VectorCraft 资产，不声称使用未调用的工具。

## 可编辑源文件

- `source/SUNPOP.ecproj`：最终 EffectCraft 合成工程，媒体相对路径。
- `source/design/`：三套包装、字标、太阳组件、品牌海报，含 SVG / VectorCraft / PNG 与生成代码。
- `source/blender/SUNPOP-open.blend`、`SUNPOP-hero.blend`、`SUNPOP-pack.blend`：三段真实连续动画，含已打包纹理。
- `source/blender/open.mov`、`hero.mov`、`pack.mov`：透明 ProRes 4444 中间片。
- `source/audio/`：配音原始片段、原始音乐、剪辑后分轨、母版、SRT、时间轴及生成记录。
- `source/fonts/`：本地使用的字体及 OFL 许可证。
- `editor-handoff/`：FCPXML 和 FilmCraft 工程。

`source/build.py --render` 用原生合成重建三版成片；`source/blender/sunpop.py` 可单独重建指定三维镜头；`source/audio/mix.py` 可重新生成混音和字幕时间轴。工具路径可按新电脑安装位置调整。源包保留可重建文件及中间片，不重复包含全部 PNG 序列缓存。

## 检查范围

逐镜查看实际渲染，检查裁切、图层顺序、标签贴图、转场和字色。音频包含逐条盲转写、音乐风格分析和成片音画模型审查；它们是模型辅助听审，不等于真人监听。最终 AAC 的响度、峰值、完整解码、帧数与字幕帧边界另做本地验证，证据在 `review/`。

听审模型有一轮把实际 11.65 秒的人声误定位到 7–9 秒，不能照单采纳；相应原始反馈保留。结尾经过多轮修改，最终音乐在 21.0–23.6 秒按余弦曲线渐弱，并保留 0.4 秒无声尾段。最终验收记录以 `review/final-media-qa.json` 和最终音画审查为准。

本片是可供观看评判的原创广告样片，未把交付等同于客户验收或“大厂旗舰品质认证”。品牌、包装和产品均为概念设计，无真实上市或营养功效主张。

## 设计研究来源

[COLLINS / Muse Group](https://wearecollins.com/case-studies/musegroup/) 的模块化品牌系统、音乐与字体运动关系用于方法研究。SUNPOP 的名称、包装、图形和动画在本项目中原创制作；没有使用该案例的视频、声音、图形或品牌身份。

## Skill 收录记录

2026-10-29，用户反馈“可以，这个做另外一种风格固化到skill中吧”，按 `bold-brand-pop` 收录至 Skill 3.17.0。当前决定见 `case.json`；交付时状态保存在 `review/case-at-delivery.json`。按 `references/bold-brand-pop.md` 迁移制作方法；本案例的品牌、配色、三维罐体和 24 秒结构不作为其他项目的固定条件。移动到新目录后，用 `source/editor_handoff.py` 重新生成该目录的 FCPXML 与 FilmCraft 媒体地址。
