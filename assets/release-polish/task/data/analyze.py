"""Calculate the film's data and the actual downloadable report from the same CSV."""
import csv,json,html,shutil
from pathlib import Path
P=Path(__file__).resolve().parent
rows=[]
with (P/'channel-visits.csv').open() as f:
 for r in csv.DictReader(f):
  before,after=int(r['before']),int(r['after']);assert before>=0 and after>=0
  rows.append(dict(channel=r['channel'],before=before,after=after,delta=after-before))
before=sum(r['before'] for r in rows);after=sum(r['after'] for r in rows);delta=after-before
assert [r['channel'] for r in rows]==['自然搜索','推荐访问','广告访问','邮件访问'],'This authored four-channel example requires its original row identities and order.'
assert all(r['delta']>=0 for r in rows),'Negative changes need a diverging chart and different contribution semantics.'
assert before>0 and delta>0,'This example uses positive total growth; adapt chart semantics for other cases.'
assert before==10000 and after==12000 and delta==2000,'Update the authored headline/report copy before using another dataset.'
assert rows[0]['delta']==1300,'The fixed story is about natural search contributing 65% of growth.'
assert [r['delta'] for r in rows]==[1300,600,100,0],'The authored 20-unit report requires its original 13/6/1/0 partition; redesign the grid and report for other data.'
for r in rows:r['contribution']=r['delta']/delta
analysis=dict(metric='访问次数',source='channel-visits.csv',period='两个连续、等长的 28 天窗口',data_kind='fictional_demo',rows=rows,before=before,after=after,delta=delta,growth=delta/before,max_delta=max(r['delta'] for r in rows),leader=max(rows,key=lambda r:r['delta']),next_step='复盘自然搜索的落地页，并核对新增访问的转化质量。',caveat='本数据只有访问次数，不能推断转化率、营收或因果关系。')
(P/'analysis.json').write_text(json.dumps(analysis,ensure_ascii=False,indent=2)+'\n')
out=P.parent/'deliverables/DataTalk';out.mkdir(parents=True,exist_ok=True);shutil.copy2(P/'channel-visits.csv',out/'channel-visits.csv');shutil.copy2(P/'analysis.json',out/'analysis.json')
tr=''.join(f'<tr><td>{html.escape(r["channel"])}</td><td>{r["before"]:,}</td><td>{r["after"]:,}</td><td>+{r["delta"]:,}</td><td>{r["contribution"]:.0%}</td></tr>' for r in rows)
page='''<!doctype html><html lang="zh-CN"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>DataTalk · 增长复盘</title><style>*{box-sizing:border-box}body{margin:0;background:#f4f4ef;color:#182d3b;font:16px -apple-system,BlinkMacSystemFont,"Hiragino Sans GB",sans-serif}main{max-width:1040px;margin:auto;padding:42px 28px}.brand{font-size:24px;font-weight:650;color:#2449ed}header{display:flex;justify-content:space-between;align-items:center}small{color:#74818b}h1{font-size:38px;line-height:1.4;letter-spacing:-.03em}p{line-height:1.8}.stats{display:grid;grid-template-columns:1fr 1fr;gap:18px}.card{background:white;border:1px solid #dde2e2;border-radius:18px;padding:26px}.big{font-size:64px;letter-spacing:-.06em;color:#2449ed;margin:10px 0}.muted{color:#71818a}.table{overflow-x:auto}table{width:100%;border-collapse:collapse;font-variant-numeric:tabular-nums}td,th{padding:16px 12px;text-align:right;border-bottom:1px solid #e2e6e6;white-space:nowrap}td:first-child,th:first-child{text-align:left}th{font-size:13px;color:#71818a;font-weight:500}tr:first-child td{color:#2449ed}.next{border-left:4px solid #2449ed;padding-left:22px;margin:34px 0}a{display:inline-block;border-radius:24px;padding:12px 20px;margin-right:12px;background:#2449ed;color:white;text-decoration:none}footer{margin-top:34px;font-size:12px;line-height:1.8;color:#71818a}@media(max-width:650px){.stats{grid-template-columns:1fr}h1{font-size:28px}.big{font-size:52px}main{padding:25px 18px}}</style><main><header><span class="brand">DataTalk</span><small>增长复盘 / 示例数据</small></header><h1>增长，主要来自自然搜索。</h1><div class="stats"><section class="card"><small>总访问次数变化</small><div class="big">+20%</div><span>10,000 → 12,000</span></section><section class="card"><small>自然搜索的增量贡献</small><div class="big">65%</div><span>新增 1,300 / 总新增 2,000</span></section></div><h2>从来源到结论</h2><p class="muted">来源：channel-visits.csv · 两个连续、等长的 28 天窗口 · 单位：访问次数</p><div class="table"><table><thead><tr><th>渠道</th><th>上期</th><th>本期</th><th>增量</th><th>增量贡献</th></tr></thead><tbody>ROWS</tbody></table></div><section class="next"><h2>下一步：复盘自然搜索落地页</h2><p>核对哪些页面承接了新增访问，再验证转化率与访问质量。</p><small>待验证项，不是当前数据已经证明的结论。</small></section><a href="channel-visits.csv" download>下载源数据</a><a href="analysis.json" download>下载计算结果</a><footer>DataTalk 产品概念演示。所有数据为虚构示例。65% 表示增量贡献，不是本期访问占比，也不证明渠道对增长的因果关系。</footer></main></html>'''.replace('ROWS',tr)
(out/'增长简报.html').write_text(page)
assert before==10000 and after==12000 and delta==2000
assert abs(analysis['leader']['contribution']-.65)<1e-12
print(json.dumps(analysis,ensure_ascii=False))
