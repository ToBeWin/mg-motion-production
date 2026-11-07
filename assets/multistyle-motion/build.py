from pathlib import Path
import argparse,json,os
from native_delivery import save_project,delivery_js,render
P=Path(__file__).resolve().parent
CASES={'brand':('SHIFT / Shape the next','SHIFT_v11_让下一步发生'),'hardware':('ORBIT / Turn into response','ORBIT_v11_转动即反馈'),'agent':('一念协作 / One shared result','一念协作_v11_从想法到作品')}
ap=argparse.ArgumentParser();ap.add_argument('--case',choices=CASES,required=True);ap.add_argument('--render',action='store_true');ap.add_argument('--picture-only',action='store_true');ap.add_argument('--replace-project',action='store_true');args=ap.parse_args()
comp,stem=CASES[args.case];project=P/(args.case.upper()+'.ecproj')
if project.exists() and not args.replace_project:ap.error('Choose a new directory or --replace-project.')
cli=os.environ.get('EFFECTCRAFT_CLI',str(Path.home()/'Library/Application Support/EffectCraft/bin/effectcraft-cli'))
jsx='var SOURCE_ROOT='+json.dumps(str(P))+';\n'
data=P/'data/hardware-motion.json'
if data.exists():jsx+='var HARDWARE_DATA='+data.read_text()+';\n'
for n in ['native_helpers','advanced_helpers','studio_helpers','design_helpers','flagship_helpers','motion_helpers',args.case]:jsx+=(P/'effectcraft'/(n+'.jsx')).read_text()+'\n'
if not args.picture_only:jsx+=delivery_js(comp,P/f'audio/{args.case}/master.wav',json.loads((P/f'audio/{args.case}/timeline.json').read_text()),args.case)
script=P/'effectcraft'/f'{args.case.upper()}-build.jsx';script.write_text(jsx);save_project(cli,script,project)
if args.render:
 render(cli,project,comp,P.parent/(stem+'_无字幕.mp4'),audio=not args.picture_only)
 if not args.picture_only:render(cli,project,comp+' / 中文字幕',P.parent/(stem+'_中文字幕.mp4'))
print(project)
