# MG Motion Production

面向软件与 AI 发布、品牌传播、产品、数据和解释视频的 MG 动效制作 Skill。包含 24 类场景规划、22 条风格路线、四种软件风格的交互编排以及六个可编辑 EffectCraft 组件。

## 安装

将仓库中的 `SKILL.md`、`references/`、`assets/`、`scripts/` 和 `agents/` 一起复制到你的 Codex skills 目录下的 `mg-motion-production/`，然后在新会话中调用 `$mg-motion-production`。

## 快速使用

```bash
python3 scripts/plan_scene.py --list
python3 scripts/choose_style.py --domain software
python3 scripts/plan_scene.py --scenario software-launch --style evidence-led-showcase --duration 60 --out /absolute/new-plan
```

规划器需要 Python 3。媒体检查需要 FFmpeg 和 ffprobe，Pillow 为可选依赖。组件构建需要本机 EffectCraft；支持 `--cli` 指定路径。输出工程与成片需要按产品、素材和品牌具体制作与检查。

公开版只包含通用方法、规划数据和通用组件源码。视频、客户素材、项目文件及商业配乐均不在此仓库中。

配音和配乐可沿用用户已配置的工具，也可选择系统语音、本地程序化器乐或已授权的在线服务；不同选项的依赖、质量和服务限制见 [配音与音乐选项](references/audio-options.md)。本地器乐脚本需要 NumPy。
