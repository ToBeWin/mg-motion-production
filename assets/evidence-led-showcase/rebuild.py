"""Build a NEW native evidence-led study from supplied, authorized product assets.
This is a picture builder, not automatic narration/music production or a quality guarantee.
"""
from pathlib import Path
import argparse,json,shutil,subprocess,os

def validate(c,assets):
 assert c.get('fps',30)==30 and c.get('width',1920)==1920 and c.get('height',1080)==1080,'Only 1920x1080 / 30fps has been validated.'
 assert c['duration']>0
 ids=[r['result_id'] for r in c['results']];assert len(ids)==len(set(ids)) and 2<=len(ids)<=10
 assert len(c['tour']['hold_durations'])==len(ids) and all(v>=.5 for v in c['tour']['hold_durations'])
 assert 1<=c['tour']['columns']<=5
 end=c['tour']['start']+sum(c['tour']['hold_durations'])+c['tour']['matrix_hold']
 assert abs(end-c['close']['start'])<1/30 and end<c['duration']
 files={c['logo']}
 for k in c['cases']:
  assert 0<=k['start']<k['dock']<k['workspace']<k['result_start']<k['end']<=c['tour']['start']
  assert 1<=len(k['problem'])<=2 and max(map(len,k['problem']))<=22,'Re-design longer headings instead of squeezing them.'
  assert 1<=len(k['result_ids'])<=2 and all(x in ids for x in k['result_ids'])
  if len(k['result_ids'])==2:assert k['result_start']<k['change']<k['end']
  files.update([k['request_asset'],k['capture']])
 for r in c['results']:
  assert r['source'] and r['scope_note'] and r['case_id']
  assert len(r['proof_points'])<=2 and len(r.get('proof_descriptions',[]))==len(r['proof_points'])
  assert len(r['label'])<=7 and len(r['title'])<=32
  files.add(r['asset'])
 for x in files:
  path=(assets/x).resolve();assert path.is_relative_to(assets.resolve()) and path.is_file(),f'Missing or outside asset root: {x}'
 caps=c.get('captions',[])
 assert all(0<=x['start']<x['end']<=c['duration'] for x in caps)
 assert all(x['end']<=y['start'] for x,y in zip(caps,caps[1:])), 'Overlapping captions'
 return sorted(files)

def main():
 ap=argparse.ArgumentParser();ap.add_argument('--content',type=Path,required=True);ap.add_argument('--assets',type=Path,required=True);ap.add_argument('--out',type=Path);ap.add_argument('--render',action='store_true');ap.add_argument('--validate-only',action='store_true');a=ap.parse_args()
 cfg=json.loads(a.content.read_text());files=validate(cfg,a.assets)
 if a.validate_only:print(json.dumps(dict(valid=True,result_count=len(cfg['results']),asset_count=len(files))));return
 if not a.out:ap.error('--out is required unless --validate-only is supplied')
 out=a.out.expanduser().resolve();assert not out.exists() or not any(out.iterdir()),'Preserve existing output; choose an empty directory.'
 source=out/'source';(source/'assets').mkdir(parents=True);(out/'review').mkdir()
 package=Path(__file__).resolve().parent
 shutil.copytree(package/'source/effectcraft',source/'effectcraft')
 shutil.copy2(package/'source/build.py',source/'build.py')
 for name in files:
  to=source/'assets'/name;to.parent.mkdir(parents=True,exist_ok=True);shutil.copy2(a.assets/name,to)
 cfg['variant']='main';(source/'main.json').write_text(json.dumps(cfg,ensure_ascii=False,indent=2))
 collect=cfg['tour']['start']+sum(cfg['tour']['hold_durations']);times=[cfg['cases'][0]['start']+1,cfg['cases'][0]['dock']+.4,collect+.3,collect+1,cfg['duration']-1.5]
 cmd=['python3',str(source/'build.py'),'--preview',','.join(str(t) for t in times)]
 if a.render:cmd.append('--render')
 subprocess.run(cmd,check=True)
 (out/'BOUNDARY.txt').write_text('Native editable picture study. Source screenshots remain image layers; they are not editable product UI controls. Add an authorized voice, suitable music, synchronized captions and a reviewed mix for a voiced launch film. The original product data is not a template for a new business.\n')
 print(out)
if __name__=='__main__':main()
