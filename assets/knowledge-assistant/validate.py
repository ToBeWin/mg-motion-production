#!/usr/bin/env python3
"""Check the authored source, linked artifact, audio cues and project media paths."""
from html.parser import HTMLParser
from pathlib import Path
import hashlib
import json
import wave

P=Path(__file__).resolve().parent
class Links(HTMLParser):
    def __init__(self):super().__init__();self.ids=[];self.hrefs=[];self.text=[]
    def handle_starttag(self,tag,attrs):
        a=dict(attrs)
        if 'id' in a:self.ids.append(a['id'])
        if tag=='a' and 'href' in a:self.hrefs.append(a['href'])
    def handle_data(self,data):self.text.append(data)

def validate():
    corpus=json.loads((P/'data/corpus.json').read_text())
    data=json.loads((P/'data/validated.json').read_text())
    answer=json.loads((P/'result/answer.json').read_text())
    docs=json.loads((P/'result/documents.json').read_text())
    assert data['documents']==corpus['documents']==docs,'Source document drift'
    assert data['claims']==answer['claims'],'Answer drift'
    by_id={d['id']:d for d in docs}
    page=Links();page.feed((P/'result/答案与出处.html').read_text())
    assert len(page.ids)==len(set(page.ids)),'Duplicate HTML anchors'
    for link in page.hrefs:
        assert (link[1:] in page.ids) if link.startswith('#') else (P/'result'/link).is_file(),link
    for c in answer['claims']:
        original=by_id[c['document_id']]
        assert c['lines']==original['excerpt'] and c['citation']==original['citation'],'Citation mismatch'
        assert hashlib.sha256('\n'.join(c['lines']).encode()).hexdigest()==c['sha256']
        assert '#'+c['source_anchor'] in page.hrefs
        for line in c['lines']:assert ''.join(page.text).count(line)>=2,'Quote absent from source or answer'
    plan=json.loads((P/'production-plan.json').read_text());cues=json.loads((P/'audio/cues.json').read_text())
    assert all(cues[k]==plan[k] for k in ['cues','focus','bpm']),'Audio and visual timing drift'
    assert all(0<=c['time']<plan['duration'] for c in cues['cues'])
    for name in ['master.wav','music.wav','foley.wav']:
        with wave.open(str(P/'audio'/name)) as w:
            assert (w.getnchannels(),w.getframerate(),w.getnframes())==(2,48000,32*48000),name
    project=json.loads((P/'TRACE.ecproj').read_text());assert project['settings']['bit_depth']=='Bpc16'
    media=[]
    for item in project['items'].values():
        if item['kind']['type']=='Footage':
            path=Path(item['kind']['path']);assert not path.is_absolute() and (P/path).is_file(),str(path);media.append(str(path))
    return {'documents':len(docs),'exact_claims':len(answer['claims']),'anchor_links':sum(h.startswith('#') for h in page.hrefs),'relative_media':media,'audio_cues_match':True,'audio_seconds':32,'project_bit_depth':16,'scope':'Static data, links, audio structure and project paths. No browser, AI inference or listening acceptance.'}

if __name__=='__main__':print(json.dumps(validate(),ensure_ascii=False,indent=2))
