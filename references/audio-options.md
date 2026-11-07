# 配音与音乐：适配用户自己的环境

先识别用户当前已安装、已配置并同意使用的声音工具和项目偏好；已有项目的音色、音乐和生产方式优先，不因本技能安装而更改配置。按当前项目、语言、预算和隐私要求选择。需要有旁白时完成配音、音乐、混音与同步字幕；无声交付按用户要求执行。

## 配音路线

1. 已有授权录音、已配置本地 TTS 或用户指定服务：沿用用户选择，保留音色身份和可追溯原始声轨。
2. **本地草稿**：macOS 的 `say` 或 Linux 的 `espeak-ng` 配合 FFmpeg：`python3 scripts/system_tts.py --text-file /absolute/narration.txt --out /absolute/voice.wav`。需要时用 `--voice` 指定本机可用音色。语音质量和多语言能力取决于安装的声音，务必审听；这不是精品配音的质量保证。
3. **在线服务**：使用用户已有的兼容服务或 API。提供的 `scripts/online_audio.py --provider openai-tts --text-file /absolute/narration.txt --out /absolute/voice.wav` 是一个可选示例，通过环境变量读取凭据，可用 `--voice` 和 `--model` 指定声音及模型；使用前确认音色、费用、授权与文本发送范围。其他服务可按照官方接口替换。详见 [OpenAI 官方语音文档](https://developers.openai.com/api/docs/guides/text-to-speech)。

## 配乐路线

1. 优先使用用户指定、已获许可的音乐，或其已配置的本地音乐生成工具；核对使用范围和交付格式。
2. **Agent 程序化合成器乐**：用 `python3 scripts/generate_music.py --out /absolute/music.wav --duration 30 --style warm --bpm 100` 生成 48 kHz 立体声纯音乐；`--style pulse` 提供另一种编排。代码可由 Agent 按分镜修改和弦、配器、节奏、强弱和过门。此基础合成器是原创器乐草稿起点，合适与否需实际听审；不能保证达到专业音乐制作或覆盖所有题材。
3. **在线音乐服务或 MCP**：按用户选择使用有权限的服务，并核实当前地区、账号、价格与许可。`scripts/online_audio.py --provider minimax-music --text-file /absolute/prompt.txt --out /absolute/music.mp3` 演示可选 API，需相应环境变量和可用账号。根据 [MiniMax 官方文档](https://platform.minimax.io/docs/api-reference/music-generation)，相关付费音乐 API 自 2026-08-20 起不再对新用户开放、免费接口停用；现有符合条件的账号仍需自行验证。其他服务应采用其当前官方接口或连接工具，不能假定此示例通用于所有服务。

## 实施和检查

在线请求可能收费并发送文本或素材到服务商。只使用用户选择或授权的服务，将凭据保存在环境变量或密钥管理器中，不写入仓库、示例、日志或命令记录；失败后说明原因，不自动重复付费请求。不要擅自克隆声音或上传不在授权范围内的素材。

根据旁白实际起止与分镜设置音效、音乐避让和字幕；输出独立声轨、可编辑混音和最终编码。对短语音先做自然停顿检查；对音乐检查音色、段落、起落、结尾和视觉节奏。全片主观听审与响度测量、自动转写、用户验收分别记录。
'''

