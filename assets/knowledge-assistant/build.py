"""Build the authored source-grounded film in native EffectCraft."""
from pathlib import Path
import argparse,json,os,subprocess,sys
P=Path(__file__).resolve().parent
parser=argparse.ArgumentParser();parser.add_argument('--render',action='store_true');parser.add_argument('--replace-project',action='store_true');parser.add_argument('--silent-draft',action='store_true');parser.add_argument('--cli',default=os.environ.get('EFFECTCRAFT_CLI',str(Path.home()/'Library/Application Support/EffectCraft/bin/effectcraft-cli')));a=parser.parse_args()
project=P/'TRACE.ecproj'
if project.exists() and not a.replace_project:parser.error('Use a new copy or explicitly --replace-project for this copy.')
if not Path(a.cli).is_file():parser.error('Pass an installed EffectCraft CLI with --cli.')
subprocess.run([sys.executable,str(P/'data/prepare.py')],check=True)
plan=json.loads((P/'production-plan.json').read_text());data=json.loads((P/'data/validated.json').read_text());master=P/'audio/master.wav'
if not a.silent_draft and not master.is_file():parser.error('Generate audio first, or explicitly choose --silent-draft.')
if (plan['duration'],plan['size'],plan['fps'])!=(32,[1920,1080],30):parser.error('The authored layout is fixed at 32s / 1920x1080 / 30fps; redesign JSX before changing this contract.')
if master.exists() and not a.silent_draft:
 cues=json.loads((P/'audio/cues.json').read_text());assert cues['cues']==plan['cues'] and cues['focus']==plan['focus'] and cues['bpm']==plan['bpm'],'Regenerate audio after timing changes.'
jsx='var PLAN='+json.dumps(plan,ensure_ascii=False)+';\nvar DATA='+json.dumps(data,ensure_ascii=False)+';\n'
for name in ['native_helpers.jsx','advanced_helpers.jsx','studio_helpers.jsx','design_helpers.jsx','trace.jsx']:jsx+=(P/'effectcraft'/name).read_text()+'\n'
if not a.silent_draft:jsx+='for(var ai=1;ai<=app.project.numItems;ai++){var item=app.project.item(ai);if(item.name==='+json.dumps(plan['composition'])+'){item.layers.add(app.project.importFile(new ImportOptions(new File('+json.dumps(str(master))+'))));break;}}\n'
(P/'effectcraft/BUILD.jsx').write_text(jsx)
result=subprocess.run([a.cli,'--empty','--gpu','script',str(P/'effectcraft/BUILD.jsx'),'--save-as',str(project),'--json'],capture_output=True,text=True,check=True)
print(result.stdout,flush=True);answer=json.loads(result.stdout)
if not answer.get('ok'):raise RuntimeError(answer.get('error'))
d=json.loads(project.read_text())
if d['settings']['bit_depth']=='Bpc8':subprocess.run([a.cli,'--project',str(project),'exec','file.cycleBitDepth','--save','--json'],capture_output=True,check=True);d=json.loads(project.read_text())
assert d['settings']['bit_depth']=='Bpc16'
for item in d['items'].values():
 if item['kind']['type']=='Footage':item['kind']['path']=os.path.relpath(item['kind']['path'],P)
project.write_text(json.dumps(d,ensure_ascii=False,separators=(',',':')))
if a.render:
 subprocess.run([a.cli,'--project',str(project),'--gpu','render','--comp',plan['composition'],'--out',str(P.parent/plan['filename']),'--format','h264','--fps','30','--resolution','full','--quality','best','--bitrate','26000','--audio','off' if a.silent_draft else 'on','--progress','--json'],check=True)
print(json.dumps({'project':str(project),'rendered':a.render,'silent_draft':a.silent_draft},ensure_ascii=False))
