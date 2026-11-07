# 品牌色同步 v4 · 同一版面的前后对照

24 秒，1920×1080，30 fps；EffectCraft 原生可编辑。全片为一念 STUDIO 的概念功能演示，CLUE 为虚构设计品牌。图片来源见 assets/provenance.md。

直接打开 CLUE.ecproj，保持相对素材目录。复制到新目录并重建：

```bash
python3 rebuild.py --out /absolute/new-case/source --render
# 需要重新演奏声音时
python3 rebuild.py --out /absolute/new-audio-case/source --regenerate-audio --render
```

已包含 music.wav、foley.wav 和 master.wav，可直接重渲视频。重奏另需 macOS、Swift、NumPy、FFmpeg 与宿主内置 DLS 音源；音源库不随包分发。字体采用系统 Helvetica Neue / Hiragino Sans GB，换机须复查替代字体。脚本拒绝覆盖非空目录。

## 本轮制作

11.15–13.65 秒展示同一网页改色前后。复制可编辑网页合成，仅冻结副本里的品牌色表达式，然后用原生路径遮罩和手柄揭示实时改色版本。图片、文字与布局完全相同；比较原点、尺寸和层级均在同一预合成中。6.6 秒选色与三处联动继续读取同一个品牌色控制器。

主合成在新建时直接引用比较预合成。当前本机引擎的 replaceSource 方法会明确报告未实现，不可仅依据 AE API 的存在认定能执行。背景改为暖白光场，卡片统一使用宽柔影；新工程设置并读回 16 bpc，最终 MP4 为 8-bit H.264。

本轮仅升级横屏。历史 v3 的 18 秒竖屏在原交付中保留，不作为本轮升级交付。配乐在比较阅读段减弱，并增加轻的移动声；原始音符、时间标记和分轨一并保存。

报告已完成的实际导出、抽帧与信号检查，不据此宣称完整主观听审或用户审美验收。

浅色背景使用低强度、固定种子的原生单色颗粒，缓解最终编码中的色阶环带；阅读段不制造噪点运动。
