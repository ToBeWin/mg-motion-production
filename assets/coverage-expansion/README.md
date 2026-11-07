# 13 类科技 MG · 可执行样例

13 个独立原生 EffectCraft 工程、2 个 Blender 工程、11 条原创声音设计、2 条有意无声的影片、透明包装、可运行界面状态逻辑、地图与跟踪数据。成片总长 178 秒，1920×1080 / 30fps。

这是可复用的场景实现，不是每种行业与风格都经过商业验收的承诺。客户和硬件内容是明确标识的概念演示；实拍片是技术演示。阅读 CREDITS.md 和 records/QA.json 的实际检查边界。

## 重建

需要本机 EffectCraft 0.16.0 CLI、Python 3、FFmpeg。重做音乐还需 macOS Swift/AVFoundation、NumPy；重做三维需 Blender 5.2 / Cycles。地图与界面数据已经随包保存，无需网络。

```sh
python3 data/prepare.py
node runtime/verify.mjs
python3 audio/compose.py
python3 build.py --replace --render
python3 export_alpha.py
```

这些命令在 source 目录执行，输出到相邻 films / extras。可用 `--only onboarding` 只构建一个，或逗号分隔若干 ID。`--draft` 是显式无声草稿；没有完整三维视频时会使用关键帧图片，只能用于布局预览。

不要在已经手工改过的交付工程上直接用 `--replace`；复制整个 source 到新目录后重建。重建参数固定 1080p30；新画幅需要重新布局。

## 三维重建

```sh
/Applications/Blender.app/Contents/MacOS/Blender --background --factory-startup --python-exit-code 1 --python blender/build_orbit.py -- --kind function --render --samples 40
/Applications/Blender.app/Contents/MacOS/Blender --background --factory-startup --python-exit-code 1 --python blender/build_orbit.py -- --kind assembly --render --samples 40
ffmpeg -framerate 30 -i blender/function/frames/%04d.png -c:v libx264 -crf 15 -pix_fmt yuv420p media/orbit-function.mp4
ffmpeg -framerate 30 -i blender/assembly/frames/%04d.png -c:v libx264 -crf 15 -pix_fmt yuv420p media/orbit-assembly.mp4
```

模型分件可编辑；旋钮、数值与投影标注用同一帧数据。拆装只验证本概念模型的轴向间隙，不是制造级 CAD 或物理装配验证。

## 真正的原生跟踪

`TRACKING.ecproj` 保存原始位置跟踪器和输出空对象；`data/tracking.json` 是 360 帧跟踪结果，原生合成直接使用这些数值。

原生命令链为 `track.new` → `track.setPoint` → `track.options` → `track.analyze` → `track.apply`。片段 1280×534，初始中心 [612,333]，特征 [44,44]，搜索 [100,100]，亮度、亚像素、阈值 75、低于阈值停止，输出位置 XY。已实际完成 360 帧；不代表复杂遮挡、旋转缩放或三维相机求解。

## 交互与输出

`runtime/controller.mjs` 是可复用的纯状态逻辑；`runtime/demo.html` 是界面示例。支持本地 CSV 解析、错误处理、权限确认、JSON 下载；READY 支持取消、失败重试、防止旧请求覆写新状态、aria-live、prefers-reduced-motion。Node 状态测试已运行，浏览器实际交互验收尚未进行。模块示例通常由已有静态开发环境提供；本轮不启动浏览器或本地服务绕过先前预览限制。

`extras/*alpha*.mov` 应用 RGBA / ProRes4444 导出。广播片 MP4 上的明亮底板只是预览环境，透明 MOV 不带底板。`NEXT_stage_hold.png` 是发布会结束交接的静帧；特定 LED 像素比、现场安全区、屏幕拼接与音响仍需现场适配。

OPEN LAB 与 READY 有意不加音轨。OPEN LAB 为 16 秒循环，内容在任意进入时刻均可阅读。ATLAS 的结果见 `records/case-brief.md`，它来自随包的三份作者样本及摘录哈希。
