#!/usr/bin/env python3
"""Build the two native films from shared data, timing and authored sources."""
from pathlib import Path
import argparse,json,os,subprocess,sys
P=Path(__file__).resolve().parent
ap=argparse.ArgumentParser();ap.add_argument('--render',action='store_true');ap.add_argument('--replace-project',action='store_true');ap.add_argument('--only',choices=['agent','data']);ap.add_argument('--cli',default=os.environ.get('EFFECTCRAFT_CLI',str(Path.home()/'Library/Application Support/EffectCraft/bin/effectcraft-cli')));a=ap.parse_args()
if not Path(a.cli).is_file():ap.error('Pass --cli to a verified EffectCraft installation.')
project=P/'TASK_RESULTS.ecproj'
if project.exists() and not a.replace_project:ap.error('Project exists. Use a fresh copy, or --replace-project for this copy.')
subprocess.run([sys.executable,str(P/'data/analyze.py')],stdout=subprocess.DEVNULL,check=True)
plan=json.loads((P/'production-plan.json').read_text());data=json.loads((P/'data/analysis.json').read_text())
jsx='var ASSET_ROOT='+json.dumps(str(P/'assets'))+';\nvar PLAN='+json.dumps(plan,ensure_ascii=False)+';\nvar DATA='+json.dumps(data,ensure_ascii=False)+';\n'
for name in ['native_helpers.jsx','advanced_helpers.jsx','studio_helpers.jsx','agent.jsx','data.jsx']:jsx+=(P/'effectcraft'/name).read_text()+'\n'
for key in ['agent','data']:
 audio=P/'audio'/key/'master.wav'
 if audio.is_file():jsx+='for(var i=1;i<=app.project.numItems;i++){var co=app.project.item(i);if(co.name==='+json.dumps(plan[key]['composition'])+'){co.layers.add(app.project.importFile(new ImportOptions(new File('+json.dumps(str(audio))+'))));break;}}\n'
(P/'effectcraft/BUILD.jsx').write_text(jsx)
subprocess.run([a.cli,'--empty','--gpu','script',str(P/'effectcraft/BUILD.jsx'),'--save-as',str(project),'--json'],check=True)
j=json.loads(project.read_text())
for item in j['items'].values():
 if item['kind']['type']=='Footage':item['kind']['path']=os.path.relpath(item['kind']['path'],P)
project.write_text(json.dumps(j,ensure_ascii=False,separators=(',',':')))
if a.render:
 for key,file in [('agent','一念协作_v3_任务到结果_1080p30.mp4'),('data','DataTalk_v3_数据到行动_1080p30.mp4')]:
  if a.only and key!=a.only:continue
  subprocess.run([a.cli,'--project',str(project),'--gpu','render','--comp',plan[key]['composition'],'--out',str(P.parent/file),'--format','h264','--fps','30','--resolution','full','--quality','best','--bitrate','22000','--audio','on','--progress','--json'],check=True)
print(json.dumps({'project':str(project),'rendered':a.render},ensure_ascii=False))
