# 六个 EffectCraft 原生组件

位置：`assets/scenario-components/`。组件是可编辑动作的起点；参考画布为 1280×720、30fps，36 秒验证片每项 6 秒且无声。当前版不自动生成各种画幅或完整广告。

## 重建与复用

```bash
python3 assets/scenario-components/build.py --out /absolute/new-project/components --render
```

输出 `COMPONENTS.ecproj` 与 `组件验证.mp4`。脚本读取本地已验证的 EffectCraft CLI，可用 `--cli` 或 `EFFECTCRAFT_CLI` 指定；不安装软件，不覆盖非空目录。依赖本地字体 `HiraginoSansGB-W6`，换机器先验证实际字形或替换字体并重测。

在新项目按 `native_helpers.jsx` → `advanced_helpers.jsx` → `modules.jsx` 的顺序加载，替换 demo 的素材和调用。不要把 demo 标题与占位值直接交付为真实业务案例。

| ID / 调用 | 输入 / 用途 | 已实现与适配边界 |
|---|---|---|
| `focus-highlight` / `focus(comp, fromBox, toBox, t0, t1)` | box 为中心 x,y,宽,高；操作区域到结果区域 | 位置与选框尺寸动画；按真实 UI 位置重排，需独立检查中途高亮 |
| `workflow-handoff` / `handoff(comp, labels, points, t0, t1)` | 同长度的职责标签与坐标，至少两个 | 单一任务 chip 沿多个责任节点交接；当前时间均分，实际依赖/并行另设计 |
| `data-compare` / `compare(comp, rows, maxValue, t0, t1)` | 1–2 行 `{label,value}` 与正标尺 | 数值、宽度、中心共用 smoothstep；当前固定两行布局、非负值，复杂图表另做 |
| `route-draw` / `route(comp, projectedPoints, t0, t1)` | 至少两个不相邻重合的画面坐标 | 修剪与端点按同一路径弧长计时；它不是地图投影器或地理数据源 |
| `title-banner` / `banner(comp, name, role, start, holdEnd, end)` | 两个可替换文本字段，独立驻留与退出时间 | 父子图层与字段缩字号；长到不可读时必须换行/重排，不无限缩小 |
| `countdown` / `countdown(comp, count, start, step)` | 1–99 次计数，step > .26秒，留终态时间 | 数字/进度共享时钟；结束状态可改，舞台实际触发需另接播放控制 |

原生形状、修剪路径、父子变换、关键帧、文本表达式和预合成已实际导出。赋值父对象会保留世界位置，需要在 parenting 后重新设置期望局部偏移；此次渲染审看发现并修正了任务 chip 和主题条偏移。

## 检查记录

附 `COMPONENTS.ecproj`、`qa/report.json`、`qa/contact-sheet.jpg`；具体检查与限制以报告为准。完整解码、抽帧和组件关联检查支持动作实现，不能把无声组件验证片称作商业成片或声画验收。资产、转场、镜头、声音仍要为本次内容设计。

