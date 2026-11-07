# 三个独立场景：PULSE / SHIFT / LOOP

原创概念样片，采用 EffectCraft 原生文字、形状、路径、遮罩、重复器、表达式、预合成、阴影、颗粒、关键帧及运动模糊。背景遵循本轮用户要求：不用黑色或近黑色场景底色。没有嵌入整段栅格视频来冒充可编辑图层。

| 片名 | 规格 | 核心结构 | 主文件 |
|---|---|---|---|
| PULSE API | 24 秒，1920×1080，30 fps | 输入中的三个字段持续进入 schema、JSON 与任务卡 | effectcraft/api.jsx |
| SHIFT 品牌宣言 | 18 秒，1920×1080，30 fps | 双斜线母形、分带文字、字内重复纹样、品牌收束 | effectcraft/brand.jsx |
| LOOP 服务有回音 | 26 秒，1080×1920，30 fps | 同一 SR-024 申请、角色交接、缺资料回路、寄出通知 | effectcraft/service.jsx |

## 直接编辑

用 EffectCraft 打开 `SCENE_COLLECTION.ecproj`，三个顶层合成与多个命名预合成可独立编辑。工程内音频路径相对于本目录。请保留 `audio/` 与工程的位置关系。引擎实测为 0.16.0，内部合成为 16 bpc；交付 H.264/AAC 为 8 bit。

字体使用本机 HiraginoSansGB-W6 / W3、HelveticaNeue-Bold / Medium、Menlo-Regular；未附字体文件。其他机器需检查实际字形、字宽与回退，再导出。不是自适应任意语言、任意长度的自动排版模板。

## 在新目录重建

```bash
python3 rebuild.py --out /absolute/new-project/source --render
python3 rebuild.py --out /absolute/brand-copy/source --render --only brand
```

`--out` 必须是新的或空的 **source 目录**。工程写入该目录，MP4 写入其父目录。`--only` 仅筛选导出的影片，工程仍包含三个场景。默认保留已有原创音频；只重建画面需要 Python 3 与 EffectCraft CLI。可通过 `--cli /absolute/path/to/effectcraft-cli` 或 `EFFECTCRAFT_CLI` 指定程序。

在当前副本修改 JSX 后，用 `python3 build.py --replace-project --render` 显式重建该副本；这会覆盖该副本的工程与成片。`build.py` 检查 CLI 的 JSON `ok` 字段，不能仅依赖退出码。

## 修改声音

```bash
python3 audio/compose.py
python3 validate_inputs.py
python3 build.py --replace-project --render
```

重新生成声音需要 macOS Swift / AVFoundation、主机系统音色库、Python NumPy、ffmpeg。音符与合成动作声为本项目编写；不分发系统音色库。每片附 `music.wav`、`foley.wav`、`master.wav`、`notes.json` 和 `cues.json`。前两轨在归一化前混音，直接相加不等于归一化后的 master；重建精确 master 请运行音频脚本。最终声音还需真人听审，信号测量不能代替主观评价。

## 可迁移部分和边界

- API 示例附合法 JSON、字段和值校验；`req_024 → task_024` 是固定概念演示，没有调用真实 API，也没有把“周五前”解析为日期。改长字符串需要重排并审看移动中的交叉遮挡。
- 服务 JSON 记录固定片例，与 JSX 状态和音效时点保持一致；它不是通用流程引擎。`商品照片.jpg` 是图形表示，未读取实际用户照片；“寄出”仅为示意终态。
- 品牌片的斜线从母形延伸为遮挡转场和字内纹样，不能把任意换色或随机图形替换当作品牌设计完成。
- 预合成的 2× 内部分辨率需要统一的逻辑缩放换算；`design_helpers.jsx` 的 `X.scale` 同时处理父子合成比例，避免第一帧正确但后续关键帧突然放大。
- 片尾主张保持到最后一帧；运动交叉需看中间态，不能只看起终点。视觉及声音的完整审看范围见交付包检查记录。
