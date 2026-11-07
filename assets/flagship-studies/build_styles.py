"""Build six distinct 8-second motion studies with the supplied stems/captions."""
from pathlib import Path
import argparse,json,os
from native_delivery import delivery_js,save_project,render
P=Path(__file__).resolve().parent
ap=argparse.ArgumentParser();ap.add_argument('--render',action='store_true');ap.add_argument('--silent-draft',action='store_true');ap.add_argument('--only');ap.add_argument('--cpu',action='store_true');ap.add_argument('--replace-project',action='store_true');ap.add_argument('--cli',default=os.environ.get('EFFECTCRAFT_CLI',str(Path.home()/'Library/Application Support/EffectCraft/bin/effectcraft-cli')));a=ap.parse_args()
plan=json.loads((P/'production-plan.json').read_text());data=json.loads((P/'data/validated.json').read_text());routes=json.loads((P/'style-routes.json').read_text());studies=[r for domain in routes.values() for r in domain if r['level']=='motion-study']
project=P/'STYLES.ecproj'
if project.exists() and not a.replace_project:ap.error('Use a new directory or explicitly --replace-project.')
structure=Path(os.environ.get('STRUCTURE_PLATE',str(P/'media/orbit-structure-v9.mov'))).resolve()
if not structure.exists():raise SystemExit('Missing v9 transparent structure plate: '+str(structure))
jsx='var PLAN='+json.dumps(plan,ensure_ascii=False)+';\nvar DATA='+json.dumps(data,ensure_ascii=False)+';\nvar MEDIA='+json.dumps({'form':str(P/'media/form-optical.mp4'),'structure':str(structure)})+';\n'
for name in ['native_helpers','advanced_helpers','studio_helpers','design_helpers','flagship_helpers','trace-product']:jsx+=(P/'effectcraft'/f'{name}.jsx').read_text()+'\n'
jsx+='PLAN.cases.trace.composition="TRACE / Editorial reference";\n'+(P/'effectcraft/trace-editorial-study.jsx').read_text()+'\n'+(P/'effectcraft/style-studies.jsx').read_text()
if not a.silent_draft:
 for r in studies:
  folder=P/'audio/styles'/r['id'];timeline=json.loads((folder/'timeline.json').read_text());jsx+=delivery_js(r['composition'],folder/'master.wav',timeline,r['id'])
script=P/'effectcraft/STYLES-build.jsx';script.write_text(jsx);save_project(a.cli,script,project)
print('Six native study compositions ready',flush=True)
if a.render:
 for r in studies:
  if a.only and r['id']!=a.only:continue
  render(a.cli,project,r['composition']+('' if a.silent_draft else ' / 中文字幕'),P.parent/'style-films'/(r['id']+'_'+r['name']+'.mp4'),a.cpu,not a.silent_draft)
