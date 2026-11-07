#!/usr/bin/env python3
"""Check native evidence motion bounds and media references; not an aesthetic score."""
from pathlib import Path
import argparse, bisect, hashlib, json, math

P = Path(__file__).resolve().parent

def prop(layer, name):
    transform = next(n for n in layer['props']['children'] if n['match'] == 'transform')
    return next(n for n in transform['children'] if n['match'] == name)

def at(p, t, tps):
    keys = p.get('keys', [])
    if not keys:
        return p['value']['v']
    ticks = t * tps
    times = [k['time'] for k in keys]
    n = bisect.bisect_right(times, ticks)
    if n == 0:
        return keys[0]['value']['v']
    if n == len(keys):
        return keys[-1]['value']['v']
    a, b = keys[n-1], keys[n]
    assert a['out_interp'] == 'Linear', 'This checker expects baked linear keys.'
    f = (ticks-a['time']) / (b['time']-a['time'])
    va, vb = a['value']['v'], b['value']['v']
    return [x+(y-x)*f for x,y in zip(va,vb)] if isinstance(va,list) else va+(vb-va)*f

def bounds(layer, height, t, tps):
    if not layer['in_point']/tps <= t < layer['out_point']/tps:
        return None
    if at(prop(layer,'opacity'), t, tps) <= 2:
        return None
    x,y,_ = at(prop(layer,'position'),t,tps)
    sx,sy,_ = at(prop(layer,'scale'),t,tps)
    return [x-240*sx/100, y-height/2*sy/100, x+240*sx/100, y+height/2*sy/100]

def check(a,b,ha,hb,start,end,tps):
    collisions=[]
    for frame in range(math.ceil(start*30),math.floor(end*30)+1):
        t=frame/30; aa=bounds(a,ha,t,tps); bb=bounds(b,hb,t,tps)
        if aa is None or bb is None:
            continue
        area=max(0,min(aa[2],bb[2])-max(aa[0],bb[0]))*max(0,min(aa[3],bb[3])-max(aa[1],bb[1]))
        if area>2:
            collisions.append({'frame':frame,'time':t,'intersection_area_px2':round(area,2)})
    return {'range_seconds':[start,end],'collision_frames':collisions,
            'method':'Native axis-aligned precomp bounds, 30 fps, visible opacity >2; does not check every pair of layers.'}

def audit(project):
    j=json.loads(project.read_text())
    comp=next(i['kind'] for i in j['items'].values() if i['name']=='TRACE / Motion narrative / Picture')
    tps=comp['duration']/16
    layers={l['name']:l for l in comp['layers']}
    a=layers['Evidence 1 / same object'];b=layers['Evidence 2 / same object'];r=layers['Answer quotation 2 remains']
    media=[]
    for item in j['items'].values():
        k=item['kind']
        if k['type']=='Footage':
            path=Path(k['path']);media.append({'path':str(path),'relative':not path.is_absolute(),'exists':(project.parent/path).is_file()})
    caption_comp=next(i['kind'] for i in j['items'].values() if i['name']=='TRACE / Motion narrative / 中文字幕')
    timeline=json.loads((project.parent/'audio/timeline.json').read_text())
    def find(node,name):
        if node.get('match')==name:
            return node
        for child in node.get('children',[]):
            found=find(child,name)
            if found is not None:
                return found
    captions=[]
    for cue in timeline['captions']:
        layer=next(l for l in caption_comp['layers'] if l['name']=='Caption '+cue['id'])
        text=find(layer['props'],'sourceText')['value']['v']
        start,end=layer['in_point']/tps,layer['out_point']/tps
        captions.append({'id':cue['id'],'text':text['text'],'start':start,'end':end,
                         'fill_hex':'#'+''.join(f'{round(v*255):02X}' for v in text['fill'][:3]),
                         'stroke':text['apply_stroke'],
                         'text_matches':text['text']==cue['text'],
                         'rounded_to_frame':abs(start-cue['start'])<=1/30+.00001 and abs(end-cue['end'])<=1/30+.00001})
    def keycount(node):
        return len(node.get('keys',[]))+sum(keycount(x) for x in node.get('children',[]))
    report={
        'project':project.name,'sha256':hashlib.sha256(project.read_bytes()).hexdigest(),
        'bit_depth':j['settings']['bit_depth'],'duration':16,'fps':30,
        'picture_layers':len(comp['layers']),'picture_keyframes':sum(keycount(l['props']) for l in comp['layers']),
        'media':media,
        'captions':captions,
        'caption_comp_layers':[l['name'] for l in caption_comp['layers']],
        'carry_excerpts':check(a,b,90,140,4.82,6.25,tps),
        'original_and_copy':check(b,r,140,140,9.1,10.3,tps),
        'continuous_objects':['Persistent question surface','Evidence 1 / same object','Evidence 2 / same object','Persistent focus bracket 0','Persistent focus bracket 1','Citation 2 / identity'],
        'scope':'Selected native motion relationships and reference portability only; final picture and normal-speed review remain necessary.'
    }
    report['checks_pass']=all(m['relative'] and m['exists'] for m in media) and all(c['text_matches'] and c['rounded_to_frame'] for c in captions) and not report['carry_excerpts']['collision_frames'] and not report['original_and_copy']['collision_frames']
    return report

if __name__=='__main__':
    ap=argparse.ArgumentParser();ap.add_argument('--project',type=Path,default=P/'TRACE-MOTION.ecproj');ap.add_argument('--out',type=Path,required=True);args=ap.parse_args()
    result=audit(args.project);args.out.parent.mkdir(parents=True,exist_ok=True);args.out.write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n')
    print(json.dumps(result,ensure_ascii=False,indent=2))
