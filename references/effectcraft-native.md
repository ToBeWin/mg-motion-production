# EffectCraft：把原生能力用到镜头里

本节来自 2026-10-25 的本地 EffectCraft 0.16.0 制作。运行命令、保存工程、渲染样片已实际完成；不以效果注册表的数量推断全部效果都已验证。官方接口参考：[控制协议](https://github.com/storytold/effectcraft/blob/main/docs/control-protocol.md)。

## 已制作的几种用法

| 镜头需要 | 原生能力 | 源文件 |
|---|---|---|
| 一个品牌色联动网页、海报和手机 | Color Control + 跨合成表达式、预合成、alpha track matte | `feature.jsx` |
| 平面设计从叠放状态展开，再回到正面供阅读 | threeDLayer、Y 轴旋转、相机位置、阴影 | `feature.jsx` |
| 图形成为转场载体 | Repeater、Turbulent Displace、alpha matte、Linear Wipe | `event.jsx` |
| 解释过程保持对象与数值身份 | 同点数 Shape 路径关键帧、Trim Paths、数据点位置/尺寸/颜色变化 | `explainer.jsx` |
| 网站背景持续运动 | Advanced 3D 的 torus/sphere、PBR 参数、灯光、周期表达式、相机 | `loop.commands.json` + `loop.jsx` |

脚本在 `assets/effectcraft-native/effectcraft/`。效果要有用途：UI 正面阅读时收回透视；文字显现避免长时间半透明重影；过渡声音落在到达/点击等有含义的时刻。网站循环默认无声，不能把一条有片头片尾的广告简单循环。

## 重建可编辑案例

把 `assets/effectcraft-native/` 复制到一个新的项目目录，在副本中运行：

```bash
python3 rebuild_v2.py --new-scenes-only --render
```

需要已安装的 EffectCraft CLI、Python + NumPy、FFmpeg；脚本不安装软件。用 `--cli` 指定其他路径。本机默认路径仅是方便值。产物是原生 `effectcraft/EXPANDED.ecproj` 和四条 MP4；最后一条是无声音轨的 8 秒循环。全尺寸导出可能需要数分钟。

先修改内容、颜色、构图和时序，再在实际引擎中渲染关键帧检查。示例的概念品牌、低采样数、配乐和节拍都可以改；不要把数据故事或产品功能演示替换成无意义的装饰。

## 实际踩过的接口边界

- 每次 `run_script`/`file.runScript` 使用自己的脚本作用域。下一次调用需要再次包含 helper，不能假设 `MuseNative` 等变量仍存在。
- 先用 `command_list` / `effect.list` / `get_layer` 查本机参数。引擎命令的枚举一般从 0 开始，AE 风格 JSX 的 popup 从 1 开始，不能混用。
- 三维图元通过 `layer.new3dPrimitive` 创建会切到 Advanced 3D。经典三维平面、Advanced 3D 图元和 Blender 导入底片是三种不同对象，应按实际说明。
- `layers.addCamera()` 的默认关注点在合成中心。本机的某些 AE match name 并不通用；修改之前查 `get_layer`，原生命令路径如 `transform/poi` 可以准确定位。不要因一个 match name 不通就断言相机功能不存在。
- 轨道遮罩显现完成后，matte 必须持续覆盖内容的有效时段；提前结束 matte 会导致底层消失。保留整个末尾片段的遮罩。
- 跨合成颜色联动使用具体 comp / layer / effect 名称；重命名时同步改表达式，渲染前后两种颜色确认联动真实有效。
- 原生循环的周期表达式在数学上周期一致，还需检查编码后的末帧→首帧和常规相邻帧差异。最后一帧时间为 `duration - 1/fps`，不应硬复制首帧制造停顿。本例首轮渲染有起始接点异常，采用原生渲染两轮、FFmpeg 按帧提取第二轮；不据此断言软件存在通用错误。工程为 16 秒，循环周期与交付为 8 秒。
- ORBIT 的宽高光来自原创 HDR 环境光图，`make_environment.py` 生成。通过 `layer.environment` 和 Environment light 使用环境贴图。本机 JSX 的 `environmentLayer` 读取并不能可靠替代这条引擎命令，按实际画面与原生工程核对。
- `get_layer` 某些表达式属性的 `value` 是基值。核对求值时可用 JSX `valueAtTime(t, false)`，再看实际渲染；不能把基值不变误判为表达式没生效。
- 素材路径相对于 `.ecproj` 所在目录。搬迁验证要重新打开工程并实际渲染，不只检查文件是否存在。
- 使用系统 Helvetica Neue、Hiragino Sans GB、Menlo；不随包分发字体。换系统后检查字形、宽度和替代字体。

原生效果渲染成功只是工程证据。镜头节奏、材质质感与完整听审需要单独判断；本轮三维网站案例不代表所有高级三维功能或复杂真实产品资产都已验证。


## 原生交互与 MG 引导补强（2026-10-31）

按 [跨风格原生交互方法](native-interaction-fidelity.md) 制作真实热点、指针按压、状态响应、遮罩展开、内部滚动、同源局部放大与阅读引导。各路线的字排、空间与节奏分别设计。

