# TRACE · 答案有出处

32 秒 / 1920×1080 / 30 fps。原创知识助手概念片，采用暖白到冷白的浅色环境、钴蓝引用、可编辑文字和原生三维文档平面。

## 内容与边界

问题是“知识库支持哪些文件？更新后，怎样生效？”。三份示例资料中选取两段原文，保留编号进入答案，再从引用 2 回到同一份原文。`data/corpus.json` 同时驱动画面和 `result/答案与出处.html`，配套 HTML 提供来源锚点与 JSON 下载。

这些资料为本片编写，答案是指定原文的组合；没有在线检索、模型推理或实际 AI 服务。实际产品需替换为经授权且核实的输入、输出和运行证据。HTML 已做静态链接检查，未声称完成浏览器交互验收。

## 工程与重建

直接用 EffectCraft 打开 `TRACE.ecproj`，主合成为 `TRACE / Answers with sources`。音轨用相对路径 `audio/master.wav`；移动工程时保留整个 source 文件夹。

本机验证环境为 EffectCraft CLI 0.16.0、macOS、Python 3、ffmpeg。字体使用 macOS 的 HiraginoSansGB-W3/W6、HelveticaNeue 和 Menlo；字体未随包分发，其他系统需安装合法字体或重新排版。

在新的目录重建（路径只是示例，需换成自己的绝对路径）：

```bash
python3 rebuild.py --out /absolute/new-project/source --render
```

默认使用已附音轨，不必安装音乐工具。CLI 可用 `--cli /absolute/path/to/effectcraft-cli` 指定，或设置 `EFFECTCRAFT_CLI`。重建入口拒绝非空输出目录。

编辑当前副本后：

```bash
python3 build.py --replace-project --render
python3 validate.py
```

画面布局按 32 秒横屏编排。改变时长、比例或文字长度需要重新设计，不能只改参数。新增正文尤其要检查列宽与引用芯片的距离。`build.py` 会拒绝已不匹配的音画 cue。

## 动画与声音

- `effectcraft/trace.jsx`：原生文字、路径、预合成、文档平面、镜头、阴影、运动模糊与引用回路；辅助 JSX 随包提供。
- `production-plan.json`：画面时点、声音标记与阅读段。文件到答案的摘录对象持续保留；标题延后进入以避开其运动路径。
- `audio/music.wav` 与 `foley.wav`：原创器乐编排、合成纸声和点击声的分轨；`master.wav` 为最终混音。
- `audio/notes.json`、`compose.py` 与 `render_instrument.swift`：音符与制作源。重新合成需 macOS Swift、系统音色库、NumPy、ffmpeg；系统音色库不随包分发。

需要重做音乐时用 `rebuild.py --regenerate-audio`，或先运行 `audio/compose.py` 再建工程。主混音目标为 −18 LUFS / −2 dBTP；最终 AAC 另作测量。信号测量不代替主观听审。

## 参考与可复用方法

制作前查看了本地留存的 Google Gemini 3 和 Anthropic Claude 官方片抽帧，参考信息焦点、对象连续与输入到结果的组织方式。未据此推断具体制作软件或精确缓动，也未引用其画面、标识或音轨。

配套校验区分来源内容一致、原生属性读回、实际导出抽帧、完整解码和声音测量。成片品质仍需要实际观看与用户反馈；不是通用的一键商业发布模板。
