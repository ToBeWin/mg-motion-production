# MG Motion Production

用于设计、制作和精修 MG 动效视频的 Codex Skill，覆盖软件与 AI 发布、品牌、硬件、数据可视化、解释动画和自由视觉探索。包含 24 类场景规划、22 条风格路线、输入与指针等交互方法、可编辑的原生组件与制作检查流程。风格是可调整的方法，不是自动生成商业成片的保证。

## 安装与使用

将仓库放到 Codex 的 skills 目录（例如 `~/.codex/skills/mg-motion-production`），在新会话中使用 `$mg-motion-production`。规划器需要 Python 3；媒体检查需要 FFmpeg/ffprobe。具体工具根据作品选择，EffectCraft 工程需安装兼容版本，音频方案见[配音与配乐](references/audio-options.md)。

```bash
python3 scripts/plan_scene.py --list
python3 scripts/choose_style.py --domain software
python3 scripts/plan_scene.py --scenario software-launch --style evidence-led-showcase --duration 60 --out /absolute/new-plan
```

核心仓库包含风格指南、规划器、通用组件、文本源代码和可复用工作流。构建真实软件演示时，请自行提供有权使用的界面、数据、Logo、字体与声音；原始参考视频、对应复刻素材和客户资料不随本仓库分发。

## 可选案例素材

原创案例的工程文件与媒体按项目打包在 [Releases](https://github.com/ToBeWin/mg-motion-production/releases)；仅在需要相应案例时下载。下载并解压到本仓库根目录，路径会合并到 `assets/`。各包大小与 SHA-256 见 `assets-release.json`，发布页还提供 `ASSETS.sha256`。例如用 GitHub CLI 下载后校验：

```bash
mkdir -p /tmp/mg-motion-assets
# 选择需要的包，例如 assets-form.zip；也可在发布页手动下载。
gh release download v3.30.1-public -R ToBeWin/mg-motion-production -p 'assets-form.zip' -p 'ASSETS.sha256' -D /tmp/mg-motion-assets
cd /tmp/mg-motion-assets
shasum -a 256 -c --ignore-missing ASSETS.sha256
# 在确认将合并到正确的仓库后执行：
unzip assets-form.zip -d /absolute/path/to/mg-motion-production
```

对于不支持 `--ignore-missing` 的系统，请依据 `assets-release.json` 单独比对文件哈希。解压前请备份已有同名修改。案例中未分发的声音参考不能用于重建原音色，重新生成时请自行提供获授权的参考音频。各工程对字体、应用版本及路径的依赖不同，下载后应按对应说明重建并检查；案例素材的使用也应核实其各自的授权。

## 声音和交付

优先使用项目指定、用户已配置并授权的声音工具；也可使用系统语音、Agent 可编辑的程序化纯音乐草稿或可用的线上 API。不同方式的质量、依赖、费用和授权见[声音选项](references/audio-options.md)。原始配音、音乐、音效及字幕应按项目分别管理，最终文件需实际审看和听审。
