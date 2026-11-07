# Content contract / version 1

`brand, logo, fps:30, width:1920, height:1080, duration, colors, topline, workspace_label, collection_title, collection_scope, cases, results, tour, close, captions`。

`colors`: paper / ink / accent / secondary / line / glow1 / glow2，十六进制不带 #。品牌按新项目设计，按项目重新选择。

每个 `cases` 元素：

```json
{"case_id":"case-a","chapter":"01 / 本次任务","problem":["一个具体的问题，","怎样走向结果？"],"request_asset":"request.png","capture":"workspace.png","start":0.3,"dock":3.15,"workspace":3.35,"result_start":6.0,"end":10.0,"result_ids":["result-a"]}
```

若一个任务展示两项结果，加入第二个 result ID 和 `change` 秒数，位于 `result_start` 和 `end` 之间。问题支持 1–2 行；长文案应重新设计，不任意压缩字体。

每个 `results` 元素：

```json
{"result_id":"result-a","asset":"result.png","label":"成果类别","title":"一句观众可以理解的价值。","case_id":"case-a","proof_points":["有出处的结论","可见的后续工作"],"proof_descriptions":["对应内容的短解释","对应内容的短解释"],"scope_note":"真实 / 示例及必要的数据范围","source":"授权文件的来源、页码或裁切记录"}
```

结果顺序就是巡览顺序，不能独立维护导航和结果。`tour` 示例：`{"start":20.4,"hold_durations":[2.4,2.4,1.2,1.2,1.2,1.2],"columns":3,"matrix_hold":4}`；`close.start` 应等于巡览开始加所有停留加集合段。集合组装占前 0.6–0.8 秒，不能全算作完成后的阅读时长。

`close`：start / title / sub。`captions`：按顺序的 `id / text / start / end` 数组，区间不得重叠。无旁白画面预演可用空数组；有声制作必须另提供实际音轨。

素材路径全部相对 `--assets`，不得超出输入目录。只复制配置引用的素材，不自动复制客户目录的其他文件。字体需安装 FOLDHan-Regular / FOLDHan-Bold，或将源码中的字体替换为已获授权并实际验证的字体；不能把默认回退字体当作原设计。
