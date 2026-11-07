"""Read the actual native caption layers and optionally render each cue midpoint.

This checks the applied palette and layout. It does not score taste or speech.
"""
from pathlib import Path
import argparse,json,math,subprocess,os
P=Path(__file__).resolve().parent
ap=argparse.ArgumentParser();ap.add_argument('--frames',action='store_true');ap.add_argument('--out',type=Path,default=P/'qa/caption-design');a=ap.parse_args()
a.out.mkdir(parents=True,exist_ok=True)
themes=json.loads((P/'caption-themes.json').read_text())
plan=json.loads((P/'production-plan.json').read_text());routes=json.loads((P/'style-routes.json').read_text())
jobs=[(k,P/(k.upper()+'.ecproj'),c['composition'],P/'audio'/k) for k,c in plan['cases'].items()]
jobs += [(r['id'],P/'STYLES.ecproj',r['composition'],P/'audio/styles'/r['id']) for g in routes.values() for r in g if r['level']=='motion-study']
def find(node,match):
    if node.get('match')==match:return node
    for child in node.get('children',[]):
        found=find(child,match)
        if found:return found
def hexrgb(rgb):return ''.join(f'{round(v*255):02X}' for v in rgb[:3])
rows=[]
for key,project,name,audio in jobs:
    data=json.loads(project.read_text());comp=next(i for i in data['items'].values() if i['name']==name+' / 中文字幕')['kind']
    timeline=json.loads((audio/'timeline.json').read_text());factor=comp['duration']/timeline['duration']
    native={l['name'][8:]:l for l in comp['layers'] if l['name'].startswith('Caption ')}
    assert len(native)==len(timeline['captions'])
    profile=themes['profiles'][key];checks=[]
    for cue in timeline['captions']:
        layer=native[cue['id']];text=find(layer['props'],'sourceText')['value']['v']
        style={**themes['defaults'],**profile,**profile.get('cues',{}).get(cue['id'],{})}
        assert text['text']==cue['text']
        assert hexrgb(text['fill'])==style['fill'],(key,cue['id'],'fill')
        assert text['font']==style['font'] and text['size']==style['size']
        assert text['apply_stroke']==(style['stroke_width']>0)
        assert abs(text['stroke_width']-style['stroke_width'])<.001
        assert abs(layer['in_point']/factor-math.floor(cue['start']*30)/30)<.0001
        assert abs(layer['out_point']/factor-math.ceil(cue['end']*30)/30)<.0001
        png=a.out/(key+'-'+cue['id']+'.png');time=(cue['start']+cue['end'])/2
        if a.frames:
            cli=os.environ.get('EFFECTCRAFT_CLI',str(Path.home()/'Library/Application Support/EffectCraft/bin/effectcraft-cli'))
            subprocess.run([cli,'--project',str(project),'--gpu','render-frame','--comp',name+' / 中文字幕','--time',str(time),'--out',str(png),'--json'],check=True,capture_output=True)
        checks.append({'id':cue['id'],'text':cue['text'],'fill':hexrgb(text['fill']),'font':text['font'],'size':text['size'],'stroke_width':text['stroke_width'],'in':layer['in_point']/factor,'out':layer['out_point']/factor,'sample_time':time,'frame':png.name if a.frames else None})
    # Delivery contains only the editable picture, one audio layer and captions.
    assert len(comp['layers'])==2+len(native),'Unexpected caption backdrop or duplicate media layer'
    rows.append({'id':key,'role':profile['role'],'captions':checks,'no_caption_backdrop':True})
result={'native_caption_events':sum(len(r['captions']) for r in rows),'profiles':len(rows),'status':'passed','frames_rendered':a.frames,'aesthetic_acceptance':False,'films':rows}
(a.out/'report.json').write_text(json.dumps(result,ensure_ascii=False,indent=2))
print('Native caption palette and timing:',result['native_caption_events'],'events across',len(rows),'films')
