---
name: mg-motion-production
description: "研究、设计、制作和精修 MG 动效视频，也支持不预设用途的原创视觉探索。整合 FigCraft 等设计工具、VectorCraft、PhotoCraft、Blender、EffectCraft 与声音工具，从可编辑设计资产、运动和材质出发，交付可审看的影片与工程；软件、AI、品牌和硬件等场景目录按需使用。"
metadata:
  version: "3.30.1-public"
---

# MG：从产品主张到可审看的成片

公开版保留通用方法、组件与案例源码；历史媒体和大型原生工程不随仓库分发。需要这些素材的旧案例不能直接重建，按新项目提供授权资产与声音。

核心任务是让观众看懂并记住一个有依据的主张。构图、材质、字排、镜头、运动和声音共同服务它。增加特效、使用 AE 类软件或成功导出，都不能独立证明高级感。

**自由探索也是正式制作模式。** 用户没有预设用途、要求发挥想象力时，从一个形态、材质、空间或节奏命题开始，设计能够持续变化的母形，做成完整视听作品，再由用户判断应用。无需先选场景、产品或风格编号；已有配方是参考，不是创作边界。具体方法与本轮 FORM 工程见 [自由探索与设计资产](references/design-assets-and-exploration.md)。

**把设计资产作为独立制作环节。** 按需要在 FigCraft 等可用设计工具中建立关键画面与可复用组件，在 VectorCraft 完成路径与矢量造型，在 PhotoCraft 处理分层位图、纹理与光影；与动态预演交替修订，再交给 Blender / EffectCraft。先确认素材在目标工具中的实际外观和可编辑层级，不能把导入成功等同于无损交接。读 [设计与动画的工具交接](references/design-toolchain.md)。本机优先使用已验证的本地设计链；Figma 和 Pen.dev 可按项目需要使用，其账号、额度或连接状态不应阻塞设计资产制作。SoundCraft 可承担分轨与混音，DesignCraft / DeckCraft 可制作片中报告与演示成果。

当软件片缺少设计感，优先补结果资产和组件状态，再增加运动复杂度。读 [设计驱动的软件发布片](references/designed-software-launch.md)：从参考片提取操作与结果关系，为同一内容独立设计多个版式，并保持对象身份、字体与锚点在变形中连续。FOLD 是原创概念案例，不能当作真实 AI 功能演示或所有项目的固定样式。

用户已认可将本次 FOLD 作为一种风格保留：[FOLD｜设计展开](references/fold-design.md)，ID 为 `fold-design`。用原创作品、明亮环境、组件状态和连续版式变化组织创作过程；适合设计软件、创意 AI、内容工具及多尺寸品牌视觉。调用 `scripts/choose_style.py --show fold-design`，或 `scripts/plan_scene.py --scenario software-launch --style fold-design --out /absolute/new-project/plan`。配色、母形、内容与时长按新项目设计，不固定为花瓣、纸色或 32 秒。


新增用户认可的独立风格：[热烈品牌｜Bold Brand Pop](references/bold-brand-pop.md)，ID 为 `bold-brand-pop`。从原创包装、字标与图形系统出发，把巨幅字体、强色场、实体产品或插画、连续母形与音乐组织成品牌广告。调用 `scripts/choose_style.py --show bold-brand-pop`，或规划器使用 `--style bold-brand-pop`。放晴 / SUNPOP 的饮料罐、太阳、橙蓝配色和 24 秒时长仅为案例；按本次行业、品牌性格和素材重新设计。

新增用户要求收录的独立风格：[字形雕塑＋动态排版](references/sculptural-type.md)，ID 为 `sculptural-type`。让同一字形在三维实体、平面文字载体与留白空间之间连续变化，适用于品牌焕新、创意工具、科技硬件及发布会视觉。调用 `scripts/choose_style.py --show sculptural-type`，或规划器使用 `--style sculptural-type`。指南包含共享路径、三维/平面交接和按品牌气质选择配乐的方法；映序 / AUREL 的字母 A、配色、16 秒及钢琴仅为案例。





此前反馈：TRACE v10 连续动效段得到“这次效果还可以”的评价，并要求扩展其他场景与风格。保留这条方向认可，按 [动态叙事优先](references/motion-before-polish.md) 与 [跨场景连续动效](references/multistyle-motion.md) 选择新的动作逻辑；品牌、硬件、协作不能只换同一套 UI 的颜色与标题。旧九条的用途分类与未验收范围继续保留。

根据品牌、场景与受众选择明暗、色彩和环境；同步检查文字、前景与字幕对比。

字幕与整体美术必须共同设计。字幕颜色与背景及主体需协调；按每条路线确定环境、主体、强调、次级信息和字幕五个色彩角色，并在真实镜头里验证。不要把降低饱和度或套灰白渐变当作质量保证。见 [色彩、环境与字幕统一](references/color-environment-captions.md)。

当前制作重点：更多聚焦科技，先把软件/AI、Agent、开发者工具和数据产品做深，再按实际需求拓展多模态、知识助手、云服务与科技硬件。读 [科技方向与制作优先级](references/technology-focus.md) 选择切入点；24 个场景保留为用途目录，非科技题材按需调用。增加配方或样片数量不替代核心作品精修。

**委托科技产品宣传时，软件产品发布是首要设计方向。** 保持产品内容可信，同时明确本次要的是操作演示还是 MG 发布片。MG 发布用图形、排版、形态变化和剪接组织任务与结果；完整工作台用于建立位置和证明功能，不能让全片都停在同一界面。选择可见输入、关键动作、结果与出处，再设计对象如何连续转变。软件、品牌和硬件各有多条路线，不能每次只换颜色与标题。读 [三个领域的风格路线](references/domain-style-routes.md)，用 `scripts/choose_style.py --domain software` 选择；三条主片与六条 8 秒动作研究的完成层级分开记录。

**真实产品宣传先采集产品证据。** 用户提供本机产品和权威业务视频时，先核对真实任务、可见状态与实际成果；自行设计的卡片不能代替产品页面。大会面向大众时，用少量价值主张组织真实界面，保留 MG 的尺度变化与对象交接。见 [公众价值与真实产品画面](references/real-product-value.md)：区分实采页面、已完成任务回放、连续录屏与概念演绎，保持文件、数据和任务的对应关系。

同一真实产品制作多风格版本时，先锁定业务事实、原始请求、成果与旁白，再分别设计空间和注意力。`luminous-workspace` 用持久任务锚点和窗口让位组织成果；`companion-ui-explainer` 可按品牌要求采用持续指针向导，无需加入卡通角色。两者共享证据，不共享同一套动作；具体适配与边界已补入各自指南。

有声宣传片优先使用用户指定或已配置的配音和音乐；未指定时读取 [配音与音乐选项](references/audio-options.md)。先检查已安装的对应 Skill 和模型，不能用简单合成旋律悄悄替代最终配乐。有配音时按语言与用途提供同步字幕、SRT 和不烧录字幕版本；避免按钮式圆角字幕底板，给字幕留出不遮挡主体的空间；无声循环、界面反馈等仍按用途决定。具体流程见 [配音、音乐与字幕](references/voice-music-captions.md)。完整听审、无提示稿转写、声音与画面交叉检查及返修规则见 [全长声音审查](references/listening-review.md)。

## 已整理的关键风格

- [图形组件产品发布](references/graphic-product-pop.md)：设计组件、动态字排、文件与成果接力。
- [柔光工作台](references/luminous-workspace.md)：持续任务锚点、窗口让位、局部操作与成果。
- [角色／指针导览](references/companion-ui-explainer.md)：定位、操作、反馈、阅读和复盘。
- [编辑式产品叙事](references/editorial-product.md)：以大字、界面特写和连续编辑组织产品价值。
- [实证式产品发布](references/evidence-led-showcase.md)：任务证明、能力巡览、成果集合和品牌收束。
- [目标成行](references/kinetic-process.md)：将目标连续转化为结构、阶段和结果。

这些方法按新项目品牌、素材和节奏重新设计；不可把其他产品的录屏或声音当成通用素材。

## 先分清四个维度

**应用场景**决定要证明什么、怎样收尾；**视觉风格**决定字形、色彩、材料和画面密度；**空间/运动语法**决定注意力怎样移动；**交付载体**决定画幅、观看距离、声音条件和播放方式。不要把“几何”与“产品 UI”当作穷尽所有场景的二选一。

用途明确时读 [24 个场景与叙事配方](references/scenario-recipes.md)，选与用途对应的路线，再按需用 `scripts/plan_scene.py --show <id>` 读取素材、镜头链与检查项。配方不是已完成影片；已制作与已认可的范围见 [能力证据](references/capability-evidence.md)。软件与 AI 发布优先做扎实：给出输入、关键动作、可见结果和价值证据。品牌广告、发布会开场、社媒广告、网站循环、数据故事和实体产品展示有不同的验收条件，不能仅换文案套用同一条时间线。

只有风格需要决策时读 [视觉路线与资产](references/art-direction.md)；涉及镜头、深度或连续转场时读 [空间与运动语法](references/spatial-grammar.md)。

用规划器生成本项目的分镜、素材清单和声音标记，继续实际制作：

```bash
python3 scripts/plan_scene.py --list
python3 scripts/plan_scene.py --scenario developer-api --title "本次发布" \
  --duration 25 --style technical --out /absolute/new-project/plan
```

生成的 `brief.md`、`production-plan.json` 和 `cues.json` 都可编辑；用户已授权时，规划完成后直接推进关键画面与动画，不增加审批关卡。固定时长按整帧分配，阅读过短会提示重排，不用加速代替删减。


## 从参考片提炼方法


该路线的 [连续动作与迁移深化](references/evidence-led-showcase-depth.md) 补充了对象连续、阅读节奏、最后一个成果回到矩阵的关系，以及任务/成果/能力组件共享身份的规范。研究证据与原生组件实现、声音听审、新片验收仍分开记录。 可执行组件、6/8 成果布局、真实任务迁移和已修正问题见 [原生制作与复用](references/evidence-led-showcase-production.md)；入口为 `assets/evidence-led-showcase/rebuild.py`，只复制配置引用的授权素材。

用户给出参考时实际查看视频。没有指定时选与任务接近的 2–4 条官方案例，覆盖不同解法；“最近发布”与“最值得学”分开，不把老片说成最新。研究方法见 [发布片研究](references/reference-studies.md)。

把每段记录为：时间码/版本 → 看见的变化 → 画面中的注意力 → 前后状态 → 空间关系 → 声音范围（若实际听到）→ 可迁移用途。区分画面事实、视觉推断和未验证内容。稀疏抽帧能支持构图与先后关系，不能证明精确缓动、运动模糊参数或音画落点。

不能从风格反推作者一定用了 AE。学习对象身份、空间连续和信息组织，不把品牌标识、音轨或现成镜头当自己的素材。

## 制作流程按项目规模使用

1. **明确主张与证据。** 写一句观众最终要理解的价值，再列一件画面能展示的结果。产品未实现或没有依据的内容标为概念。识别用途、受众、长度、画幅、静音/有声、交付工程；能从已有上下文得到的不用重复问。
2. **完成视觉方向与设计资产。** 给出关键画面、字体家族与实际字形、色彩角色、材质、镜头距离、画面密度；制作可拆分的路径、图标、插画、字形、产品组件或材质源，保留可编辑文件、对象名称与变形所需的控制点。高要求项目先检查关键画面及核心资产能否支撑目标，与动态预演交替推进。用户已授权时直接制作。
3. **建立叙事与空间。** 镜头时长由动作和阅读决定。标出主体、相机、遮挡、世界坐标与屏幕坐标、继承状态、转场携带物。主张越具体，越能避免无意义的漂浮卡片、节点球和整屏换色。
4. **做连续动态预演。** 与关键画面设计交替推进，先完成最难的连接和信息链，不把所有静帧美化完成后才统一加位移。检查停顿是否有用途、相机移动是否揭示信息、上一镜的主体是否在下一镜有明确归宿。参考 [制作深度与返修](references/production-review.md)。
5. **完成画面与声音。** 选择与方向相符的资产/工具，按共同标记时间安排声音。用 [音画方法](references/timing-audio.md)；用 [工具与工程](references/tooling.md) 处理引擎、字体、渲染和原生交付。
6. **审看、修订、交付。** 看实际 MP4、密集动作片段、阅读帧和结尾；完整播放/听审与结构检查分开记录。用户批评质量时回到对应层级返修，不能只增加清晰度、分辨率或效果数量。见 [检查与交付](references/quality-delivery.md)。

## 精修现有作品

保留用户仍然认可的风格、产品身份与内容，旧版单独保存。用户否定当前质量时，“保留风格”不代表保留粗糙资产、错误字形、平均节奏或无内容的 UI。先列出具体缺口：主张不清、产品证据不足、材质问题、字体/版式、空间不连贯、阅读过短、动作失去重心、声画不合。每次改动对应缺口并复查。

针对已有方向的细节，可读 [品牌几何/动态字体](references/brand-motion.md)、[产品 UI](references/product-motion.md) 或 [扩展风格适配](references/style-adaptation.md)。这些是局部制作参考，不是固定的影片结构。

软件功能发布需要进一步提高成片质感时，读 [资产、操作与结果的连续制作](references/feature-release.md)。其中的品牌色同步 v3 提供一套原生可编辑的完整版面、操作特写、状态传播、横竖屏独立编排和原创音乐工程。先把被演示的结果设计好，再安排动效；保留对象身份与输入痕迹，比替换更多特效更有用。

软件发布、精密硬件和品牌字排三条主线的具体制作与返修见 [三条标杆方向的制作记录](references/flagship-production.md)：TRACE v2 的工作台与引用回溯、ORBIT v4 的明亮金属摄影、SHIFT v2 的字形与母形转场。保留普通软件界面的可信度；原生合成、三维摄影和声音工具各自承担适合的工作。

Agent 协作或数据分析片需要强化结果可信度时，读 [任务到结果的两种证据链](references/task-results.md)。一念协作 v3 附可浏览网页和实际检查；DataTalk v3 用同一 CSV 驱动图形与可下载简报。学习对象持续、同尺度比较、结果交付和共同声音标记，并检查停留段空间曲线是否让图表漂移。

知识助手、研究问答或带来源的 AI 功能片，读 [资料、答案与引用的连续呈现](references/knowledge-assistant.md)。TRACE 提供持续的摘录对象、引用回到同一原文、明亮文档空间、配套答案 HTML/JSON 和可重建工程；实际检索/推理与概念示意分开记录。

背景显得廉价、与主体不合或缺少质感时，读 [背景、受光与主体层级](references/background-staging.md)。先调整色彩角色、主要光向、卡片边缘和阴影，再决定是否需要纹理；用独立预合成保护文字与数据编码。一念协作 / DataTalk v3.1 提供中性石墨与冷暖白两种可重建案例。

功能片已经整洁但仍缺少说服力时，读 [让关键镜头承担可见证明](references/visible-proof.md)：同对象前后比较、可见生成与对象检查、可数比例三种方法分别对应不同证据需求，附 v4 可重建案例。不要把三种方法固化成每个场景都必须采用的结构。

## 跨场景复用

[22 条风格路线](references/style-adaptation.md)说明资产、运动和审看差异；[18 类动效方法](references/motion-modules.md)说明何时采用遮罩揭示、匹配转场、数据变换、任务交接、拆解、跟踪等手法。按传播任务组合方法，不按效果名称堆叠。

横竖屏、公共屏幕、透明叠加、静音、循环和运行时动画按 [画幅与交付适配](references/delivery-adaptations.md) 重排与验证。MP4 示意不是已交付交互组件。

[6 个原生组件](references/scenario-components.md)提供可执行 JSX 与可编辑 EffectCraft 工程：焦点高亮、任务交接、同尺度比较、路径描绘、姓名/主题条、倒计时。它们是动作积木，实际项目仍需自己的视觉与素材。

开发者发布、品牌广告或服务说明需要独立成片范例时，读 [API、品牌宣言与服务广告](references/brand-api-service.md)：字段贯穿输入到任务、母形延伸为遮挡和字内纹样、同一申请的异常回路。附三套明亮方向、原创声音和可重建原生工程。

新增十三类用途已有独立可执行样例，见 [十三类场景实现与边界](references/coverage-implementations.md)：新手引导、案例、Logo、硬件功能与拆解、地图、编辑年表、发布会、直播、展厅、界面反馈、实拍跟踪和片头。附真实原生跟踪、透明素材、分件模型与可运行状态逻辑，按场景读取对应工程；不能把用途数量视为同等商业成熟度。

## EffectCraft 原生制作

**四种软件风格共享增强，但各自编排。** 图形组件、柔光工作台、角色/指针导览与实证式发布均读取 [输入、引导、鼠标与 MG 跨风格增强](references/cross-style-mg-enhancements.md)。输入状态、原文字形、热点点击、阅读引导、字排、遮罩、页面空间、成果集合与声音标记由共同规范约束，再按风格分别安排。选择器和规划器已接入 `assets/native-interaction/style-profiles.json`；本次规则同步不代表历史视频自动重渲染。

**整片运动设计不能缩减为交互引导。** 动态字排、形态接替、前景遮挡、原生三维页面、相机与错峰阵列、成果汇聚和品牌收束，也应按题材编排。见 [软件发布片的 MG 动作方法](references/native-motion-vocabulary.md)，已实现范围与待研究能力分别保留。

**软件交互必须有可见因果。** 几条路线曾被用户指出鼠标点击缺失、细节不足、MG 引导不够。先读 [原生交互与注意力引导](references/native-interaction-fidelity.md)：真实输入框与原文字形、聚焦/插入光标/提交、真实入口与后态、热点坐标、指针到位/按压、文件遮罩展开、固定视窗滚动、同源局部放大、阅读描线与声音联动。EffectCraft 原生组件在 `assets/native-interaction/`；实证式、图形组件、柔光工作台、指针导览分别组织这些动作。保留旧版，区分实采状态重构与连续录屏，不把新样片未获验收的效果称为大厂旗舰水平。


本地已有 EffectCraft 时，优先让已验证的原生能力承担路径修剪、重复器、轨道遮罩、表达式联动、预合成、三维相机、材质和渲染。读 [原生能力与可重建样例](references/effectcraft-native.md)，根据需要查询实际属性和制作小样；不要默认只把它当作视频导出器，也不要为展示工具堆叠无关效果。

需要透明玻璃、精密金属或微距产品摄影时，读 [光学与材质镜头](references/optical-materials.md)。先检查实体厚度、法线、灯光反射与连续镜头，再选择原生三维或 Blender Cycles 底片加 EffectCraft 合成。使用更多原生效果不是此类画面的质量目标。

已有七场景研究记录保存在 [七场景案例](references/seven-scenarios.md)，新配方继续扩展应用。Form/ORBIT v3 的玻璃与金属重做获得用户正面反馈，保留这条路线；这不等于所有 24 个场景和 22 种风格已经完成同等质量验收。

## 实用资源

- `assets/design-exploration/FORM/`：原创《形的发生》，包含 Figma 设计链接、VectorCraft / PhotoCraft / Blender / EffectCraft 源文件、18 秒三版本、原始声音与分轨、FilmCraft / FCPXML 交接及实际检查。用于自由探索和设计资产交接，不作为所有新片的母形或用途限制。
- `assets/design-exploration/FOLD/`：`fold-design` 已获用户风格正面反馈的完整案例，包含组件与活动视觉设计、同一对象的主题和版式变化、32 秒三版本及原生工程。按 [设计展开](references/fold-design.md) 迁移；最新反馈在 `case.json`，历史声音与检查记录保持原样。


- `assets/design-exploration/SUNPOP/`：`bold-brand-pop` 已获用户同意固化的 24 秒品牌广告，含原创包装与图形、连续三维罐体、原生合成、三种有声版本及分轨、字幕和检查。按 [热烈品牌](references/bold-brand-pop.md) 迁移设计与运动方法；父子坐标、素材入出点、透明底片裁切和声音收尾的实测修正一并保留。

- `assets/design-exploration/AUREL/`：`sculptural-type` 用户要求固化的字形雕塑案例，含 16 秒四种有声选择、无声画面、共享矢量路径、连续三维底片、原生合成及声音分轨。按 [字形雕塑＋动态排版](references/sculptural-type.md) 迁移；三维遮挡到平面轮廓的修正及配乐音色不搭的返修经验一并保留。


- `assets/multistyle-motion/`：SHIFT 品牌字排、ORBIT 功能反馈、一念协作产物组装三条 v11 连续动效片，含原生工程、三维转角数据、音频与重建方法；完成和审查范围见配套记录。
- `assets/motion-correction/`：TRACE v10 的 16 秒连续图形叙事纠偏段、原生工程、音频编辑计划及实际检查；用户后续评价“这次效果还可以”，认可仅对应这一版，不延伸到旧九条或全部用途。



- `assets/scenario-catalog.json` / `scripts/plan_scene.py`：24 个场景配方、22 条风格路线、素材与镜头规划。优先按 ID 读取单项，避免无关上下文。
- `assets/domain-style-routes.json` / `scripts/choose_style.py`：软件 11 条、品牌 5 条、硬件 3 条具体路线，与现有用途目录交叉组合；路线数量不代表同等成熟度。
- `assets/flagship-studies/`：TRACE v2 / ORBIT v4 / SHIFT v2 和六条风格短样段的可编辑原生工程、三维源、原始声音、分轨、字幕及重建入口。复制到新目录后执行；主片 `build.py`、短样段 `build_styles.py`，混音 `audio/mix.py`。完整用法与检查范围在随包 `制作说明.md`。
- `assets/scenario-components/`：6 个原生组件、重建脚本和实际导出检查；使用方法见组件参考页。
- `assets/feature-release/`：品牌色同步 v3 的 24 秒横屏和 18 秒竖屏工程、原创影像、音符与音效源、分轨和可重建脚本。用 `python3 assets/feature-release/rebuild.py --out /absolute/new-project/source --render` 复制到新目录并制作。它是具体功能片案例，不能仅换标题就充当所有场景的商业模板。

- `assets/task-results/`：一念协作 v3 / DataTalk v3 的原生工程、实际网页和简报、共享数据与 cue、原创声音和重建脚本。用 `python3 assets/task-results/rebuild.py --out /absolute/new-project/source --render` 制作新副本；具体范围与限制见任务到结果参考页。

- `assets/background-staging/`：v3.1 背景与光影覆盖层，复用 `assets/task-results/` 素材；用本目录 `rebuild.py --out /absolute/new-project/source --render` 生成独立完整工程。

- `assets/scene-expansion/`：PULSE API 24 秒、SHIFT 品牌宣言 18 秒和 LOOP 服务旅程 26 秒竖屏，三种独立叙事与视觉。用本目录 `rebuild.py --out /absolute/new-project/source --render` 制作新副本；带片例数据校验与声音 cue 一致性检查。

- `assets/coverage-expansion/`：13 条 1080p30 科技用途样片的原生工程、分件模型、地图/跟踪数据、界面组件和原创声音；`rebuild.py --out /absolute/new-project/source --only <id> --render` 可单项重建。13 个工程均在新目录构建并通过逐项原生单帧一致性检查。

- `assets/knowledge-assistant/`：TRACE 32 秒知识助手概念片的原生工程、同源资料与答案、原创声音和检查记录；用 `rebuild.py --out /absolute/new-project/source --render` 制作新副本。

- `assets/release-polish/`：品牌色、一念协作和 DataTalk v4 覆盖层、声音与重建入口；复用历史素材，在新目录生成独立工程。

- `assets/effectcraft-native/`：四个完全使用 EffectCraft 的可编辑案例，包含实际执行过的图层/效果/相机脚本和声音生成源；复制到项目目录后用 `rebuild_v2.py --new-scenes-only --render` 重建。
- `assets/optical-materials/`：Form 玻璃控件与 ORBIT 金属控制器的 Blender、EffectCraft、原创声音源码。用于实体材质与微距制作研究，具体结果和边界见光学参考页；不是未经审看的商业模板。
- `scripts/compile_cues.py`：从项目中命名的视觉标记生成音效 cue，检查时间范围和镜头区间；避免画面改时间后音频仍用旧硬编码。格式见 `assets/production-plan.example.json`。
- `scripts/qa_media.py`：完整解码实际视频，测最终音轨，抽取审看片段中的帧；不会给审美打分。
- `scripts/create_example.py` / `assets/canvas-example/`：旧版 32 秒几何与 UI **技术练习**，用于学习确定性渲染和回归检查。用户已指出其质感未达到高端发布片目标，不把它默认复制成新商业片，也不作为审美验收基准。
- `assets/focus-study/`：本轮连续三维产品空间研究的生成源码与计划。用于研究资料→关联→简报→来源回溯的表达；实际质量与验证范围以其案例记录为准。

```bash
python3 scripts/compile_cues.py /absolute/path/to/production-plan.json --out /absolute/path/to/cues.json
python3 scripts/qa_media.py /absolute/path/to/film.mp4 --out /absolute/path/to/qa --times 3.8,4,4.2,9.9,10.1
```

交付规模与任务匹配：成片、可编辑源、实际使用的资产、必要分轨/依赖和重建方法。按需制作其他比例、无声循环、字幕/本地化版本，不擅自增加外部发布或软件安装。报告已验证的能力，不承诺全部风格已被掌握或“一键商业级”。


公开版按 [配音与音乐选项](references/audio-options.md) 保留本地、程序化与在线可选路线；优先尊重使用者已有配置。

