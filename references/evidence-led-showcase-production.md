# 实证式产品发布：原生组件与复用

源码位于 `assets/evidence-led-showcase/source/effectcraft/`。可编辑问题标题、请求交接、窗口、结果摘要、导航和成果矩阵。原始界面截图作为素材，不冒充原生产品控件。

任务、输入、结果、摘要和范围应共享 ID；最后一项成果可由同一实例缩入集合。字幕、配音、音乐和阅读时间根据实际项目重新编排。详见 [组件与迁移](evidence-led-showcase-depth.md)。

```bash
python3 assets/evidence-led-showcase/rebuild.py --content /absolute/content.json --assets /absolute/authorized-assets --out /absolute/new-project --render
```

`--validate-only` 校验输入结构与素材；可编辑静音画面不等于完整有声成片。需要配音、音乐、字幕和实际审看时，按 [声音选项](audio-options.md) 继续制作。

