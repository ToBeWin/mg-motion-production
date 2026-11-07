from pathlib import Path
import argparse,json,os,subprocess
from native_delivery import save_project,delivery_js,render
P=Path(__file__).resolve().parent
ap=argparse.ArgumentParser();ap.add_argument('--render',action='store_true');ap.add_argument('--picture-only',action='store_true');ap.add_argument('--replace-project',action='store_true');a=ap.parse_args()
project=P/'TRACE-MOTION.ecproj'
if project.exists() and not a.replace_project:ap.error('Project exists; use a new directory or --replace-project.')
cli=os.environ.get('EFFECTCRAFT_CLI',str(Path.home()/'Library/Application Support/EffectCraft/bin/effectcraft-cli'))
jsx='var DATA='+json.dumps(json.loads((P/'data/validated.json').read_text()),ensure_ascii=False)+';\n'
for name in ['native_helpers','advanced_helpers','studio_helpers','design_helpers','flagship_helpers','trace-motion']:jsx+=(P/'effectcraft'/f'{name}.jsx').read_text()+'\n'
if not a.picture_only:jsx+=delivery_js('TRACE / Motion narrative',P/'audio/master.wav',json.loads((P/'audio/timeline.json').read_text()),'trace')
script=P/'effectcraft/TRACE-build.jsx';script.write_text(jsx);save_project(cli,script,project)
if a.render:
 for comp,fn in [('TRACE / Motion narrative','TRACE_v10_从问题到依据_无字幕.mp4'),('TRACE / Motion narrative / 中文字幕','TRACE_v10_从问题到依据_中文字幕.mp4')]:
  if a.picture_only and '中文字幕' in comp:continue
  render(cli,project,comp,P.parent/fn,audio=not a.picture_only)
print(project)
