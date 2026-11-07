"""Read back saved native captions, media, and the actual shared hardware curve."""
from pathlib import Path
import argparse, hashlib, json, math, re

P=Path(__file__).resolve().parent
TICKS=254016000000
ap=argparse.ArgumentParser();ap.add_argument('--out',type=Path,default=P.parent/'qa/source-audit.json');a=ap.parse_args()
def props(n):
    yield n
    for child in n.get('children',[]):
        yield from props(child)
def prop(layer, match):
    return next(n for n in props(layer['props']) if n.get('match')==match)
def color_hex(color):
    return ''.join(f'{round(v*255):02X}' for v in color[:3])
def sha(f):
    return hashlib.sha256(f.read_bytes()).hexdigest()
results=[]
themes=json.loads((P/'caption-themes.json').read_text())
durations={'brand':18,'hardware':16,'agent':18}
for case,D in durations.items():
    path=P/(case.upper()+'.ecproj');d=json.loads(path.read_text())
    items=list(d['items'].values());comps=[i for i in items if i['kind']['type']=='Comp']
    footage=[i['kind']['path'] for i in items if i['kind']['type']=='Footage']
    for f in footage:
        assert not Path(f).is_absolute() and (P/f).is_file(),f
    cap=next(i for i in comps if i['name'].endswith(' / 中文字幕'))
    assert cap['kind']['duration']==D*TICKS
    assert cap['kind']['frame_rate']=={'num':30,'den':1}
    expected=json.loads((P/f'audio/{case}/timeline.json').read_text())['captions']
    rows=[]
    for cue in expected:
        layer=next(l for l in cap['kind']['layers'] if l['name']=='Caption '+cue['id'])
        doc=prop(layer,'sourceText')['value']['v']
        assert doc['text']==cue['text']
        assert color_hex(doc['fill'])==themes['profiles'][case]['fill']
        assert doc['apply_fill'] and not doc['apply_stroke'] and doc['stroke_width']==0
        start=layer['in_point']/TICKS;end=layer['out_point']/TICKS
        assert abs(start-math.floor(cue['start']*30)/30)<1e-7
        assert abs(end-math.ceil(cue['end']*30)/30)<1e-7
        rows.append({'id':cue['id'],'text':doc['text'],'in':start,'out':end,'fill':color_hex(doc['fill']),'no_plate':True})
    assert len(cap['kind']['layers'])==len(expected)+2, 'Unexpected caption backing or extra audio layer'
    layers=[l for i in comps for l in i['kind']['layers']]
    data={'case':case,'project_sha256':sha(path),'duration':D,'frame_rate':30,'bit_depth':d['settings']['bit_depth'],
          'relative_media':sorted(set(footage)),'caption_count':len(rows),'captions':rows,
          'native_compositions':len(comps),'native_layers':len(layers),'track_mattes':sum(bool(l['track_matte']) for l in layers)}
    if case=='hardware':
        number=next(l for l in layers if l['name']=='Live brightness')
        keys=prop(number,'sourceText')['keys'];curve=json.loads((P/'data/hardware-motion.json').read_text())
        assert not number['switches']['motion_blur'] and len(keys)==len(curve)==120
        for k,r in zip(keys,curve):
            assert abs(k['time']/TICKS-(2.8+r['time']))<1e-7
            assert int(k['value']['v']['text'])==math.floor(r['illustrative_brightness']+.5)
        line=next(l for l in layers if l['name']=='Dial response becomes brand O')
        assert line['track_matte'], 'Numeric foreground must remain clear during the arc transition'
        data['hardware']={'control_samples_verified':120,'number_motion_blur':False,'control_range_degrees':[curve[0]['degrees'],curve[-1]['degrees']],
                          'brightness_range':[curve[0]['illustrative_brightness'],curve[-1]['illustrative_brightness']],
                          'scope':'Illustrative mapping, not a calibrated device specification.'}
    if case=='agent':
        for name in ['Headline in photograph','Subhead in photograph']:
            assert next(l for l in layers if l['name']==name)['track_matte']
        html=(P/'deliverables/ROAM/index.html').read_text()
        assert 'class="tab active" role="tab" aria-selected="true" data-index="1"' in html
        assert '<h3 id="detail-title">沿着海岸，把脚步放慢。</h3>' in html
        for name,value in [('Topic label','海岸路线'),('Page closing detail','沿着海岸，把脚步放慢。')]:
            assert any(l['name']==name and prop(l,'sourceText')['value']['v']['text']==value for l in layers)
        for src in re.findall(r'<img[^>]+src="([^"]+)"',html):
            assert (P/'deliverables/ROAM'/src).is_file()
        assert sha(P/'media/roam-coast.png')==sha(P/'deliverables/ROAM/assets/roam-coast.png')
        data['roam']={'same_photo_hash':sha(P/'media/roam-coast.png'),'coast_topic_matches':True,
                      'scope':'HTML/source/media consistency only. No current browser interaction or live multi-agent service claim.'}
    results.append(data)
a.out.parent.mkdir(parents=True,exist_ok=True)
a.out.write_text(json.dumps({'cases':results,'caption_total':sum(r['caption_count'] for r in results),
    'scope':'Readback and integrity checks on saved native projects. Does not establish visual quality or customer acceptance.'},ensure_ascii=False,indent=2)+'\n')
print('Verified:',len(results),'projects;',sum(r['caption_count'] for r in results),'captions')
