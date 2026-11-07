"""Build a NEW native study from explicitly supplied product evidence.
No customer captures or audio are bundled. Rendering produces silent picture studies.
"""
from pathlib import Path
import argparse,json,shutil,subprocess,sys
from PIL import Image

ROOT=Path(__file__).resolve().parent
def validate(c,assets):
    assets=assets.resolve();files={c['logo']};duration=c['duration']
    assert c['variant'] in ['main','transfer','graphic','luminous','companion']
    assert duration>0 and c.get('fps',30)==30
    for k in c['cases']:
        key=k.get('source_id',k['case_id']);s=c['interaction_sources'][key]
        assert 0<=k['workspace']<k['click']-.22<k['click']+.75<k['end']<=duration,'Give the operation and result real screen time.'
        crop=s['crop'];hot=s['hotspot'];row=s['row']
        assert crop[0]<crop[2] and crop[1]<crop[3]
        assert crop[0]<=row[0]<row[2]<=crop[2] and crop[1]<=row[1]<row[3]<=crop[3]
        assert row[0]<=hot[0]<=row[2] and row[1]<=hot[1]<=row[3],'Hotspot must hit the actual documented row/control.'
        files.update([s['files_asset'],s['toolbar_asset']]);v=s['viewer']
        with Image.open(assets/s['files_asset']) as im:assert im.size==(crop[2]-crop[0],crop[3]-crop[1]),'Crop dimensions differ from the documented source rectangle.'
        if v['type']=='strip':
            files.add(v['asset'])
            with Image.open(assets/v['asset']) as im:assert im.size==(v['width'],v['height'])
            assert 0<v['scroll_offsets'][0]<v['scroll_offsets'][1]<v['height']
            if 'focus_crop' in v:
                f=v['focus_crop'];assert 0<=f[0]<f[2]<=v['width'] and 0<=f[1]<f[3]<=v['height']
        elif v['type']=='pages':files.update(v['pages']);assert len(v['pages'])>=2 and v['aspect']>0
        else:raise ValueError('Unknown viewer mode')
        if k.get('input'):
            p=k['input'];u=c['input_sources'][key]
            assert 0<=p['start']<p['focus']<p['type_start']<p['type_end']<p['submit']<k['workspace']<p['end']<=k['end']
            assert p['submit']-p['type_end']>=.75,'Give the completed request a readable pause.'
            files.update([u['empty_asset'],u['ready_asset'],u['text_asset']])
            with Image.open(assets/u['empty_asset']) as im:assert im.size==(u['width'],u['height'])
            with Image.open(assets/u['ready_asset']) as im:assert im.size==(u['width'],u['height'])
            with Image.open(assets/u['text_asset']) as im:assert im.size==(u['text_box'][2],u['text_box'][3])
            ends=u['glyph_ends'];assert ends and all(a<b for a,b in zip(ends,ends[1:])) and 0<ends[-1]<=u['text_box'][2]
            assert 0<u['submit_hotspot'][0]<u['width'] and 0<u['submit_hotspot'][1]<u['height']
        elif c['variant'] in ['main','transfer']:files.add(k['request_asset'])
    if c['variant'] in ['main','transfer']:
        files.update(r['asset'] for r in c['results'])
        assert len(c['results'])==len(c['tour']['hold_durations'])
    for arr in c.get('depth_assets',{}).values():files.update(arr)
    if c.get('motion_stage'):
        stage=c['motion_stage'];assert len(stage['items'])==6 and stage['end']-stage['start']>=7.6
        assert 0<=stage['start']<stage['end']<=duration
        files.update(item['file'] for item in stage['items'])
    for f in files:
        path=(assets/f).resolve();assert path.is_relative_to(assets) and path.is_file(),f'Missing or outside authorized asset root: {f}'
    caps=c.get('captions',[]);assert all(0<=v['start']<v['end']<=duration for v in caps)
    assert all(a['end']<=b['start'] for a,b in zip(caps,caps[1:])),'Overlapping captions'
    return sorted(files)

def main():
    ap=argparse.ArgumentParser();ap.add_argument('--content',required=True,type=Path);ap.add_argument('--assets',required=True,type=Path);ap.add_argument('--out',type=Path);ap.add_argument('--validate-only',action='store_true');ap.add_argument('--render',action='store_true');a=ap.parse_args()
    c=json.loads(a.content.read_text());files=validate(c,a.assets)
    if a.validate_only:print(json.dumps({'valid':True,'variant':c['variant'],'assets':len(files),'editorial_state_reconstruction':True}));return
    assert a.out and (not a.out.exists() or not any(a.out.iterdir())),'Choose a new empty output directory.'
    p=a.out/'source';p.mkdir(parents=True);(a.out/'review').mkdir();(p/'assets').mkdir()
    shutil.copytree(ROOT/'source/effectcraft',p/'effectcraft');shutil.copy2(ROOT/'source/build.py',p/'build.py')
    for f in files:
        target=p/'assets'/f;target.parent.mkdir(parents=True,exist_ok=True);shutil.copy2(a.assets/f,target)
    (p/(c['variant']+'.json')).write_text(json.dumps(c,ensure_ascii=False,indent=2))
    cmd=[sys.executable,str(p/'build.py'),'--variant',c['variant']]
    if a.render:cmd.append('--render')
    subprocess.run(cmd,check=True)
    print('Native study built; audio mixing and acceptance are separate.')

if __name__=='__main__':main()
