"""Build original native scenes in this source folder; rendering is explicit."""
from pathlib import Path
import argparse,json,os,subprocess
from validate_inputs import validate
P=Path(__file__).resolve().parent
ap=argparse.ArgumentParser();ap.add_argument('--render',action='store_true');ap.add_argument('--only',choices=['api','brand','service']);ap.add_argument('--replace-project',action='store_true');ap.add_argument('--cli',default=os.environ.get('EFFECTCRAFT_CLI',str(Path.home()/'Library/Application Support/EffectCraft/bin/effectcraft-cli')));a=ap.parse_args()
project=P/'SCENE_COLLECTION.ecproj'
if project.exists() and not a.replace_project:ap.error('Native project exists. Use a fresh directory or explicitly --replace-project for this copy.')
if not Path(a.cli).is_file():ap.error('Pass --cli to an installed EffectCraft CLI.')
print(json.dumps(validate(P),ensure_ascii=False),flush=True)
plan=json.loads((P/'production-plan.json').read_text());api=json.loads((P/'data/api-example.json').read_text());flow=json.loads((P/'data/service-flow.json').read_text())
assert set(api['request']['schema'])==set(api['response']) and all(isinstance(v,str) for v in api['response'].values())
assert all(value in api['request']['text'] for value in api['response'].values())
assert [e['time'] for e in flow['sequence']]==sorted(e['time'] for e in flow['sequence'])
jsx='var PLAN='+json.dumps(plan,ensure_ascii=False)+';\nvar API='+json.dumps(api,ensure_ascii=False)+';\nvar FLOW='+json.dumps(flow,ensure_ascii=False)+';\n'
for name in ['native_helpers.jsx','advanced_helpers.jsx','studio_helpers.jsx','design_helpers.jsx','api.jsx','brand.jsx','service.jsx']:jsx+=(P/'effectcraft'/name).read_text()+'\n'
for key,cfg in plan['cases'].items():
 audio=P/'audio'/key/'master.wav'
 if audio.is_file():jsx+='for(var ai=1;ai<=app.project.numItems;ai++){var co=app.project.item(ai);if(co.name==='+json.dumps(cfg['composition'])+'){co.layers.add(app.project.importFile(new ImportOptions(new File('+json.dumps(str(audio))+'))));break;}}\n'
(P/'effectcraft/BUILD.jsx').write_text(jsx)
run=subprocess.run([a.cli,'--empty','--gpu','script',str(P/'effectcraft/BUILD.jsx'),'--save-as',str(project),'--json'],check=True,capture_output=True,text=True)
print(run.stdout,flush=True)
result=json.loads(run.stdout)
if not result.get('ok'):raise RuntimeError('Native script failed: '+str(result.get('error')))
d=json.loads(project.read_text())
if d['settings']['bit_depth']=='Bpc8':subprocess.run([a.cli,'--project',str(project),'exec','file.cycleBitDepth','--save','--json'],check=True);d=json.loads(project.read_text())
assert d['settings']['bit_depth']=='Bpc16'
for item in d['items'].values():
 if item['kind']['type']=='Footage':item['kind']['path']=os.path.relpath(item['kind']['path'],P)
project.write_text(json.dumps(d,ensure_ascii=False,separators=(',',':')))
if a.render:
 for key,cfg in plan['cases'].items():
  if a.only and key!=a.only:continue
  subprocess.run([a.cli,'--project',str(project),'--gpu','render','--comp',cfg['composition'],'--out',str(P.parent/cfg['filename']),'--format','h264','--fps','30','--resolution','full','--quality','best','--bitrate','24000','--audio','on','--progress','--json'],check=True)
print(json.dumps({'project':str(project),'rendered':a.render},ensure_ascii=False))
