"""Build 13 independent, editable native EffectCraft projects. Source and media stay relocatable."""
from pathlib import Path
import argparse,json,os,subprocess,sys
P=Path(__file__).resolve().parent
ap=argparse.ArgumentParser();ap.add_argument('--only');ap.add_argument('--render',action='store_true');ap.add_argument('--draft',action='store_true');ap.add_argument('--replace',action='store_true');ap.add_argument('--cli',default=os.environ.get('EFFECTCRAFT_CLI',str(Path.home()/'Library/Application Support/EffectCraft/bin/effectcraft-cli')));a=ap.parse_args()
plan=json.loads((P/'production-plan.json').read_text());scenes=[s for s in plan['scenes'] if not a.only or s['id'] in a.only.split(',')]
assert scenes,'No matching scenario';(P/'projects').mkdir(exist_ok=True);out=P.parent/'films';out.mkdir(exist_ok=True)
subprocess.run(['node',str(P/'runtime/capture.mjs')],check=True)
data={k:json.loads((P/'data'/f'{v}.json').read_text()) for k,v in [('case','case'),('map','map'),('function','orbit-function'),('assembly','orbit-assembly'),('tracking','tracking'),('runtime','runtime-capture')]}
for s in scenes:
 project=P/'projects'/(s['id']+'.ecproj')
 if project.exists() and not a.replace:raise RuntimeError('Existing project; use --replace only in a working copy.')
 media={'tracking':str(P/'media/tracking_plate.mp4')}
 for kind,preview in [('function','0160'),('assembly','0210')]:
  file=P/'media'/('orbit-'+kind+'.mp4')
  if not file.exists():
   if not a.draft and s['id']=={'function':'product-function','assembly':'industrial-exploded'}[kind]:raise FileNotFoundError(file)
   file=P/'blender'/kind/('preview-'+preview+'.png')
  media['orbit-'+kind]=str(file)
 jsx='var PLAN='+json.dumps(s,ensure_ascii=False)+';\nvar DATA='+json.dumps(data,ensure_ascii=False)+';\nvar MEDIA='+json.dumps(media)+';\n'
 for name in ['native_helpers.jsx','advanced_helpers.jsx','studio_helpers.jsx','design_helpers.jsx','scenes.jsx']:jsx+=(P/'effectcraft'/name).read_text()+'\n'
 if s['sound'] and not a.draft:
  master=P/'audio'/s['id']/'master.wav';assert master.exists(),master
  cue=json.loads((master.parent/'cues.json').read_text());assert cue['cues']==s['cues'],'Audio is stale'
  jsx+='c.layers.add(app.project.importFile(new ImportOptions(new File('+json.dumps(str(master))+'))));\n'
 build=P/'effectcraft'/('BUILD-'+s['id']+'.jsx');build.write_text(jsx)
 result=subprocess.run([a.cli,'--empty','--gpu','script',str(build),'--save-as',str(project),'--json'],capture_output=True,text=True,check=True)
 answer=json.loads(result.stdout);assert answer.get('ok'),answer
 d=json.loads(project.read_text())
 if d['settings']['bit_depth']=='Bpc8':subprocess.run([a.cli,'--project',str(project),'exec','file.cycleBitDepth','--save','--json'],capture_output=True,check=True);d=json.loads(project.read_text())
 assert d['settings']['bit_depth']=='Bpc16'
 for item in d['items'].values():
  if item['kind']['type']=='Footage':item['kind']['path']=os.path.relpath(item['kind']['path'],project.parent)
 project.write_text(json.dumps(d,ensure_ascii=False,separators=(',',':')))
 print(json.dumps({'id':s['id'],'built':True,'draft':a.draft,'items':len(d['items'])}),flush=True)
 if a.render:
  subprocess.run([a.cli,'--project',str(project),'--gpu','render','--comp',s['composition'],'--out',str(out/s['filename']),'--format','h264','--fps','30','--resolution','full','--quality','best','--bitrate','26000','--audio','off' if a.draft or not s['sound'] else 'on','--progress','--json'],check=True)
