"""Build independent, editable EffectCraft projects from authored source.
Requires installed EffectCraft, NumPy, FFmpeg; Blender only for --render-3d.
All writes stay in this source directory and its parent output directory.
"""
from pathlib import Path
import argparse,json,os,subprocess,sys
from native_delivery import delivery_js,save_project,render
P=Path(__file__).resolve().parent
ap=argparse.ArgumentParser();ap.add_argument('--case',choices=['trace','orbit','shift','all'],default='all');ap.add_argument('--render',action='store_true');ap.add_argument('--render-3d',action='store_true');ap.add_argument('--audio',action='store_true');ap.add_argument('--silent-draft',action='store_true');ap.add_argument('--replace-project',action='store_true');ap.add_argument('--cpu',action='store_true');ap.add_argument('--cli',default=os.environ.get('EFFECTCRAFT_CLI',str(Path.home()/'Library/Application Support/EffectCraft/bin/effectcraft-cli')));ap.add_argument('--blender',default=os.environ.get('BLENDER_BIN','/Applications/Blender.app/Contents/MacOS/Blender'));a=ap.parse_args()
plan=json.loads((P/'production-plan.json').read_text());data=json.loads((P/'data/validated.json').read_text());kinds=list(plan['cases']) if a.case=='all' else [a.case]
assert plan['fps']==30 and plan['size']==[1920,1080], 'Redesign the authored layout before changing the format.'
plate=P/'blender/orbit-plate.mov'
if a.render_3d:
 subprocess.run([a.blender,'--background','--factory-startup','--python-exit-code','1','--python',str(P/'blender/direct_orbit.py'),'--','--render','--samples','64','--scale','100'],check=True)
 subprocess.run(['ffmpeg','-hide_banner','-y','-framerate','30','-i',str(P/'blender/frames/%04d.png'),'-frames:v','600','-c:v','prores_ks','-profile:v','2','-pix_fmt','yuv422p10le',str(plate)],check=True)
if a.audio:subprocess.run([sys.executable,str(P/'audio/mix.py'),'--raw',str(P/'audio/raw'),'--case',a.case],check=True)
for kind in kinds:
 case=plan['cases'][kind];project=P/f'{kind.upper()}.ecproj'
 if project.exists() and not a.replace_project:raise SystemExit('Use a new copy, or explicitly --replace-project for this copy.')
 master=P/'audio'/kind/'master.wav'
 if not a.silent_draft and not master.exists():raise SystemExit('Supply IndexTTS2/MiniMax assets in audio/raw and mix with --audio, or explicitly use --silent-draft.')
 if kind=='orbit' and not plate.exists():raise SystemExit('Missing photographic plate. Run --render-3d or copy the supplied plate.')
 jsx='var PLAN='+json.dumps(plan,ensure_ascii=False)+';\nvar DATA='+json.dumps(data,ensure_ascii=False)+';\nvar ORBIT_PLATE='+json.dumps(str(plate))+';\n'
 for name in ['native_helpers','advanced_helpers','studio_helpers','design_helpers','flagship_helpers','trace-product' if kind=='trace' else kind]:jsx+=(P/'effectcraft'/f'{name}.jsx').read_text()+'\n'
 if not a.silent_draft:
  timeline=json.loads((P/'audio'/kind/'timeline.json').read_text())
  assert timeline['voice_engine']=='IndexTTS2' and timeline['music_engine']=='MiniMax Music 3', 'Final delivery needs the specified voice and music engines.'
  jsx+=delivery_js(case['composition'],master,timeline,kind)
 path=P/'effectcraft'/f'{kind.upper()}-build.jsx';path.write_text(jsx)
 save_project(a.cli,path,project)
 print(kind,project,'16-bit native project ready',flush=True)
 if a.render:
  render(a.cli,project,case['composition'],P.parent/case['filename'],a.cpu,not a.silent_draft)
  if not a.silent_draft:render(a.cli,project,case['composition']+' / 中文字幕',P.parent/(Path(case['filename']).stem+'_中文字幕.mp4'),a.cpu)
