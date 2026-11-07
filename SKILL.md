---
name: mg-motion-production
description: "设计、制作与精修动态设计和 MG 视频，覆盖软件与 AI 发布、品牌、产品、数据叙事和其他传播场景；支持参考分析、可编辑资产、动画、声音及交付。"
metadata:
  version: "1.0.0"
---

# MG 动效视频制作

将信息、品牌与运动组织成可理解的视听叙事。使用本技能制作或精修软件发布、品牌广告、科技产品、解释动画、数据故事及相关 MG 视频。根据项目选择合适的工具与审美方向，不默认固定配色、时长或单一模板。

## 工作流程

1. 理解传播目标、受众、使用环境、画幅和时长；产品宣传确认可展示的真实能力与成果。素材来自参考视频时，记录可复用范围与观察证据。
2. 建立一句主张、叙事、分镜和关键画面；设计可以拆层、动画和重排的字体、图形、组件、界面和结果资产。根据需要使用矢量、位图、界面或三维设计工具。
3. 设计动作前后状态和对象交接。先测试最难的镜头、转场和阅读段，再完成完整时间线。参照 [风格路线](references/styles.md) 和 [交互与 MG 动作](references/interactions-and-motion.md)。
4. 用可用的合成、三维、代码视频或剪辑工具制作。软件操作要保持输入、热点、动作、真实反馈与结果的关系；设计演绎与实时操作分别说明。
5. 按项目匹配配音、音乐、动作声与字幕；尊重用户已有的本地工具、声源和项目偏好。没有现成声源时按 [配音与音乐选项](references/audio-options.md) 选择本地合成、Agent 程序化器乐或经用户选择的在线服务，保证配音清楚、字幕可读、声画同步。
6. 完整解码，检查关键帧、转场中段、字幕和音量，并审看成片；区分技术检查、主观听审和客户验收。保存可编辑工程和所需素材。

## 规划和组件

- `python3 scripts/plan_scene.py --list` 列出 24 类场景。`--scenario software-launch --style evidence-led-showcase --duration 60 --out /absolute/new-plan` 生成制作规划、时间线和声音提示；输出不是成片。
- `python3 scripts/choose_style.py --domain software` 查看路线，`--show <style-id>` 查看一个风格。目录包含 22 条可组合的视觉路线。
- `python3 scripts/compile_cues.py /path/to/production-plan.json --out /path/to/cues.json` 检查声音提示。
- `python3 scripts/qa_media.py /path/to/video.mp4 --out /absolute/review` 解码并提取检查帧；它不代替实际审看和听审。
- `scripts/system_tts.py` 可用系统语音制作本地配音草稿；`scripts/generate_music.py` 可合成基础器乐；`scripts/online_audio.py` 可在用户配置并选择后调用示例在线接口。使用边界和环境要求见 [配音与音乐选项](references/audio-options.md)。
- `assets/scenario-components/` 提供焦点、路径、任务交接、数据对比、字幕条和倒计时的 EffectCraft 原生组件示例。用 `build.py --out /absolute/new-directory` 构建；执行依赖相应的本机软件和字体。

软件工具与格式是实现手段：工具连接、许可证、软件版本、素材权利和目标平台限制按当前项目核实。参考设计只迁移可复用的方法，不复制未授权品牌、音乐或素材。
