# 一念协作 / DataTalk v4 · 需求到页面与可数贡献

两个独立原生 EffectCraft 合成：一念协作 27 秒，DataTalk 26 秒；均为 1920×1080 / 30 fps。所有文字、形状、图表与界面均可编辑，ROAM 海岸图片为原创生成素材，来源见 `assets/provenance.md`。

## 打开与重建

直接用 EffectCraft 打开 `TASK_RESULTS.ecproj`，保持本目录结构。工程使用相对素材路径。

```bash
python3 rebuild.py --out /absolute/new-project/source --render
# 只导出指定成片（仍构建包含两条片的工程）
python3 rebuild.py --out /absolute/another-project/source --render --only data
# 重奏原创音乐与动作音
python3 rebuild.py --out /absolute/audio-project/source --regenerate-audio --render
```

需要已安装的 EffectCraft CLI，可加 `--cli /verified/path` 或设置 `EFFECTCRAFT_CLI`。重建脚本只写入新建或空目录。直接运行 `build.py` 遇到已有工程会拒绝覆盖；确认重建当前副本时显式使用 `--replace-project`。

声音重建额外需要 macOS、Swift、NumPy 与 FFmpeg。系统音源不在包内；跨平台可直接使用已包含的 `master.wav`。字体使用 macOS 的 Hiragino Sans GB 和 Helvetica Neue，换机必须检查替代字体的字形和换行。

## 共享数据与时间

- `production-plan.json`：两片时长、关键动作、cue。视觉点击与声音共用同一时间；其他编排在 JSX 中可编辑，移动镜头后应同步复查所有关联时点。
- `effectcraft/agent.jsx`：具体任务、研究内容、设计网页、实际检查记录和交付页；`Task state / Route` 统一网页与手机选中状态。
- `data/channel-visits.csv` → `data/analyze.py` → `data/analysis.json`：DataTalk 图形和实际 HTML 简报共享计算结果。
- `effectcraft/data.jsx`：同一组单元格变为总量、增量和占比；选中段成为下一步行动卡。
- `audio/<agent|data>/notes.json`、`cues.json`、`music.wav`、`foley.wav`、`master.wav`：原创器乐、动作音与处理后的母带。分轨之和是预母带，不等于经 loudnorm 处理后的母带。

## 可浏览交付物

- `deliverables/ROAM/index.html`：三主题可切换的旅行灵感页，附 `brief.md` 和实际浏览器检查 `checks.json`。
- `deliverables/DataTalk/增长简报.html`：数据表、增量贡献、待验证行动和两个下载入口。

这是两条产品概念动画，不是实际 Agent 服务或 DataTalk 产品的运行录像。网页与简报是真实本地文件；ROAM 不是旅行预订服务，DataTalk 数据为虚构示例。

本例的数据布局限定为原有四渠道、非负增量、正的总增长。固定文案建立在 10,000 → 12,000、1,300 / 2,000 = 65% 上，脚本在不满足条件时拒绝生成。改换数据需重写相应文案、标尺和结论；负增量、零基期、零总增量不能套用当前占比图。

QA 范围及渲染检查见交付包说明。抽帧、完整解码和音轨信号测量不代替全片实时听审和用户验收。


## v3.1 背景修订

一念协作使用中性石墨灰、宽幅暖反光与柔和暗边；DataTalk 使用冷暖白、宽幅窗光与轻微冷色边缘。卡片的边缘亮度、离面阴影与背景统一调整。片尾钴蓝由单色改为明暗渐变。

`effectcraft/backgrounds.jsx` 提供两个独立背景预合成及片尾光色，全部由 EffectCraft 原生形状、渐变、模糊与颗粒生成。颗粒速度为 0、种子为 37；不在阅读段持续制造闪动。光场主要跟随现有结果转场变化。图表、数据、声音与关键事件时刻沿用 v3。

`build.py` 在新建工程后设置并读回 16 bpc；这是合成设置，最终 MP4 仍为 8-bit H.264。`Add Grain` 与 `Drop Shadow` 的参数以当前 EffectCraft 实际出图为准，不保证与 Adobe 对应参数产生逐像素相同的画面。此为平面灯光与层级设计，不是物理纸张或玻璃的光线追踪。


## v4 的关键镜头

一念协作在 7.3–9.5 秒按导航、图片、标题、按钮、主题的顺序构建可编辑页面；12.0 / 12.5 / 13.0 秒的检查框分别指向主题、导航和手机边界，回到实际被检查的对象。最终网页仍沿用已有可浏览交付物。本片展示概念过程，不声称运行了自动 Agent 服务。

DataTalk 在 14.15–16.35 秒揭示 20 格等量单位，每格代表 100 次新增访问；13 / 6 / 1 / 0 格对应四个渠道，图形从共享 CSV 计算。此例恰好是整数单位，非整百数据不能直接套用；若改变数据，需要重设单位或保留连续比例条。计数标记随后退出，蓝色贡献段继续进入行动卡。报告内保留同一组缩小的单位标记。

声音 cue 和音乐减弱窗口写在 production-plan.json；音频已重新生成。曲线、单位和检查框由同一源对象/时点驱动。仅列出效果参数无法代替最终 MP4 审看。
