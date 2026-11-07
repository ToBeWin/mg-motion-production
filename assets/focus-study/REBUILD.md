# Focus 空间叙事研究 · 源工程

一段原创 AI 研究工作台概念演示，不是已有产品功能证明。18 秒，1920×1080，30fps。

`blender/FOCUS_CONTINUOUS.blend` 是可编辑的 14 秒三维层，包含相机、灯光、材质、关键帧和打包的四张原创界面纹理。`visual/compose.cjs` 将三维层延展到 18 秒，加入标题、与三维投影对应的来源连线、光标、引用弹层和品牌结尾。完整片不是单个 Blender 工程；修改文字/内容优先改 `visual/make-textures.cjs`，重新生成纹理、三维层和合成层。

依赖：Blender 5.2、Node.js、FFmpeg/ffprobe、Python 3 + NumPy。系统字体为 macOS Helvetica Neue、Hiragino Sans GB；代码中含 PingFang SC 回退。字体不随包分发；在其他系统可设置 MG_LATIN_FONT / MG_CJK_FONT 为本地合法字体路径，并更新代码里的字体家族后检查实际字形。

第一次安装项目依赖：

```bash
cd source/visual
npm ci
```

在 `source/` 中运行 `bash rebuild.sh`。非 macOS 或不同安装路径，用 `BLENDER_BIN=/absolute/path/to/blender bash rebuild.sh`。这个脚本会重建本目录的生成文件，输出 `focus.mp4`；不会安装系统软件。

Blender 命令使用 `--factory-startup` 避免用户配置中的本地化节点名称/插件影响批处理；`--python-exit-code 1` 让 Python 错误正确返回失败。原始构建采用 Eevee、真实阴影和透视、32 samples、0.35 shutter。不同驱动/平台的像素结果可能不同。

`production-plan.json` 定义重要视觉标记，`compile_cues.py` 从这些标记生成音效 cue；叠层也读取同一时间表。三维对象的详细位置/关键帧仍在 Python 源码中，改变叙事结构时要一起调整。`audio/` 含原创音乐与音效的生成源码；运行脚本生成音乐、音效和混音文件。music.wav + sfx.wav 得到未响度处理的 mix-raw.wav，经过所列 loudnorm 才得到 mix.wav。没有第三方音乐或参考影片片段。

分轨：48kHz stereo PCM 24 bit；最终 MP4 使用 AAC。结构、完整解码、抽帧与响度检查已做，完整实时视听及客户接受尚未完成。案例用于验证连续空间、UI 因果和来源回溯；不作为已达到 Apple 等发布片水平的证明。

重建全部 420 张三维帧会占用约 650MB 临时空间。交付包不包含这些 PNG 序列和 node_modules，可从源工程重建。只想查看三维构图，可以直接打开打包的 .blend；不要误以为其中包含末尾四秒二维品牌叠层和声音。
