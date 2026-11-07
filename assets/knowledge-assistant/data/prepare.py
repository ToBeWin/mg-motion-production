"""Validate authored source spans and create the same citation artifact used by the film."""
from pathlib import Path
import hashlib
import html
import json

P=Path(__file__).resolve().parent
def prepare():
    corpus=json.loads((P/'corpus.json').read_text())
    docs={d['id']:d for d in corpus['documents']}
    if len(docs)!=len(corpus['documents']):raise ValueError('Duplicate document identity')
    claims=[]
    for i,key in enumerate(corpus['answer_order'],1):
        d=docs[key]
        if d['citation']!=i or not d['excerpt']:raise ValueError('Citation order must match the source span')
        claims.append({'citation':i,'document_id':key,'source_title':d['title'],'section':d['section'],'lines':d['excerpt'],'source_anchor':'source-'+key,'sha256':hashlib.sha256('\n'.join(d['excerpt']).encode()).hexdigest()})
    if corpus['followup_id'] not in corpus['answer_order']:raise ValueError('The followed citation must appear in the answer')
    # Exact spans are used by both native layers and the readable artifact.
    payload={'question':corpus['question'],'documents':corpus['documents'],'claims':claims,'followup_id':corpus['followup_id'],'scope':corpus['scope']}
    (P/'validated.json').write_text(json.dumps(payload,ensure_ascii=False,indent=2)+'\n')
    out=P.parent/'result';out.mkdir(exist_ok=True)
    esc=html.escape
    answers=''.join('<article class="claim"><small>'+esc(c['section'])+'</small><p>'+'<br>'.join(esc(s) for s in c['lines'])+f'<a class="citation" href="#{c["source_anchor"]}" aria-label="查看来源 {c["citation"]}">{c["citation"]}</a></p></article>' for c in claims)
    sources=''.join('<section id="source-'+d['id']+'" class="source"><small>'+esc(d['format'])+' / '+esc(d['number'])+' / 示例版本 '+esc(d['version'])+'</small><h2>'+esc(d['title'])+'</h2><h3>'+esc(d['section'])+'</h3><blockquote>'+'<br>'.join(esc(s) for s in d['excerpt'])+'</blockquote><p>'+'<br>'.join(esc(s) for s in d['context'])+'</p><a href="#answer">返回答案 ↑</a></section>' for d in corpus['documents'])
    page='''<!doctype html><html lang="zh-CN"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>TRACE · 答案与出处</title><style>
    *{box-sizing:border-box}html{scroll-behavior:smooth;scroll-padding-top:25px}body{margin:0;background:#f5f7fa;color:#25384d;font-family:-apple-system,BlinkMacSystemFont,"PingFang SC",sans-serif}main{max-width:1120px;margin:48px auto;padding:0 24px}header{display:flex;justify-content:space-between;border-bottom:1px solid #d9e0e9;padding-bottom:20px;align-items:center}header strong{font-size:26px;letter-spacing:3px}small{color:#697a8f;font-size:13px}h1{font-size:34px;line-height:1.6;letter-spacing:-.5px;margin:36px 0 24px}.answer{background:white;border:1px solid #dce3ed;border-radius:22px;padding:35px 42px;box-shadow:0 14px 45px #25384d0a}.answer h2{font-size:20px;font-weight:500}.claim{padding:18px 0}.claim p{font-size:24px;line-height:1.8;margin:10px 0}.citation{font-size:17px;vertical-align:super;margin-left:12px;padding:5px 10px;border-radius:8px;background:#e7edff;color:#365bdf;text-decoration:none}.source{margin:25px 0;padding:32px 40px;border:1px solid #dae2ed;border-radius:16px;background:#fff;transition:box-shadow .25s}.source:target{box-shadow:0 0 0 3px #365bdf;background:#fdfefe}.source h2{font-size:24px}.source h3{font-size:16px;color:#68798b}blockquote{margin:16px 0;background:#edf1ff;border-left:4px solid #365bdf;padding:18px 22px;font-size:21px;line-height:1.9}.source p{line-height:1.8;color:#68798b}a{color:#365bdf}footer{font-size:13px;line-height:1.8;color:#68798b;padding:24px 0}nav{display:flex;gap:20px;flex-wrap:wrap;margin:25px 0}@media(max-width:600px){main{padding:0 17px;margin-top:24px}.answer,.source{padding:24px}h1{font-size:27px}.claim p{font-size:20px}blockquote{font-size:18px;padding:16px}}
    </style><main><header><strong>[ ] TRACE</strong><small>产品知识库 · 可追溯答案</small></header><section id="answer"><h1>QUESTION</h1><div class="answer"><h2>根据两份资料，答案如下：</h2>ANSWERS</div></section><nav aria-label="来源目录"><a href="#source-release">01 发布说明</a><a href="#source-sync">02 同步与更新</a><a href="#source-access">03 访问与权限</a></nav>SOURCES<footer>原创概念示例。资料为本样片编写，答案直接引用指定段落；没有运行真实模型或在线检索。<br><a href="answer.json" download>下载答案与引用 JSON</a> · <a href="documents.json" download>下载示例资料</a></footer></main></html>'''
    page=page.replace('QUESTION','<br>'.join(esc(s) for s in corpus['question'])).replace('ANSWERS',answers).replace('SOURCES',sources)
    (out/'答案与出处.html').write_text(page)
    (out/'answer.json').write_text(json.dumps({'question':corpus['question'],'claims':claims,'scope':corpus['scope']},ensure_ascii=False,indent=2)+'\n')
    (out/'documents.json').write_text(json.dumps(corpus['documents'],ensure_ascii=False,indent=2)+'\n')
    report={'documents':len(docs),'claims':len(claims),'citations':[c['source_anchor'] for c in claims],'exact_source_spans':True,'artifact':'../result/答案与出处.html','scope':'Data and static anchor validation; not AI inference or browser interaction acceptance.'}
    (P/'validation.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
    return report
if __name__=='__main__':print(json.dumps(prepare(),ensure_ascii=False))
