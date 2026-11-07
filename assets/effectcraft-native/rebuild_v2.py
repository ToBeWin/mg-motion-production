#!/usr/bin/env python3
"""Build native EffectCraft comps with installed engines. No custom raster renderer."""
from pathlib import Path
import argparse,json,subprocess,os

P=Path(__file__).resolve().parent
ap=argparse.ArgumentParser()
ap.add_argument('--render',action='store_true')
ap.add_argument('--render-3d',action='store_true',help='Re-render the legacy Blender ribbon film')
ap.add_argument('--new-scenes-only',action='store_true',help='Build the four EffectCraft-only examples')
ap.add_argument('--cli',default=str(Path.home()/'Library/Application Support/EffectCraft/bin/effectcraft-cli'))
ap.add_argument('--blender',default='/Applications/Blender.app/Contents/MacOS/Blender')
a=ap.parse_args();e=P/'effectcraft';project=e/'EXPANDED.ecproj'

def run(*parts):
 subprocess.run([a.cli,*parts,'--json'],check=True)

if a.render_3d:
 subprocess.run([a.blender,'--background','--factory-startup','--python-exit-code','1','--python',str(P/'blender/brand_scene.py'),'--','--render'],check=True)
 subprocess.run(['ffmpeg','-y','-v','error','-framerate','30','-i',str(P/'blender/frames/%04d.png'),'-c:v','libx264','-crf','15','-pix_fmt','yuv420p','-movflags','+faststart',str(e/'media/brand-3d.mp4')],check=True)

subprocess.run(['python3',str(P/'make_environment.py')],check=True)
helper=(e/'native_helpers.jsx').read_text()+'\n'+(e/'advanced_helpers.jsx').read_text()
parts=[helper]
if not a.new_scenes_only:
 if not (e/'media/brand-3d.mp4').exists():raise SystemExit('Missing Blender footage. Use --render-3d or --new-scenes-only.')
 subprocess.run(['python3',str(P/'audio/make_scores.py')],check=True)
 finish=(e/'FINISH.jsx').read_text().replace('__AUDIO_ROOT__',json.dumps(str(P/'audio')+'/'))
 brand=(e/'brand.jsx').read_text().replace("'__BRAND_MEDIA__'",json.dumps(str(e/'media/brand-3d.mp4'))).replace("'__BRAND_AUDIO__'",json.dumps(str(P/'audio/brand/mix.wav')))
 parts += [(e/'scenes.jsx').read_text(),finish,brand,(e/'refine.jsx').read_text()]
subprocess.run(['python3',str(P/'audio/expansion_scores.py')],check=True)
parts += [(e/n).read_text() for n in ['feature.jsx','event.jsx','explainer.jsx']]
script=e/'REBUILD_ALL.jsx';script.write_text('\n'.join(parts))
run('--empty','--gpu','script',str(script),'--save-as',str(project))

commands=json.loads((e/'loop.commands.json').read_text());argv=['--project',str(project),'--gpu','run']
for cmd,params in commands:argv += [cmd,json.dumps(params,ensure_ascii=False)]
run(*argv,'--save-as',str(project))
sound="function find(n){for(var i=1;i<=app.project.numItems;i++){var c=app.project.item(i);if(c.name===n)return c;}throw Error(n);}\n"
for name,kind,duration in [('04 一念 — Theme Sync','feature',14),('05 OPEN STUDIO — Vertical','event',12),('06 SIGNAL — Explainer','explainer',20)]:
 sound+="var c=find(%s),f=app.project.importFile(new ImportOptions(new File(%s))),l=c.layers.add(f);l.name=%s;l.inPoint=0;l.outPoint=%s;\n"%(json.dumps(name),json.dumps(str(P/'audio'/kind/'mix.wav')),json.dumps('Original score — '+kind),duration)
loop=e/'REBUILD_LOOP.jsx';loop.write_text(helper+'\n'+(e/'loop.jsx').read_text().replace('__ENVIRONMENT_PATH__',json.dumps(str(e/'media/studio.hdr')))+'\n'+sound)
run('--project',str(project),'--gpu','script',str(loop),'--save-as',str(project))

run('--project',str(project),'--gpu','run','layer.environment',json.dumps({'layers':['Studio reflection environment'],'on':True}),'layer.newLight',json.dumps({'kind':'Environment','name':'Native studio environment','intensity':180}),'--save-as',str(project))

j=json.loads(project.read_text())
for item in j['items'].values():
 k=item['kind']
 if k['type']=='Footage':k['path']=os.path.relpath(k['path'],e)
project.write_text(json.dumps(j,ensure_ascii=False,indent=2)+'\n')

specs=[('04 一念 — Theme Sync','04_Theme_Sync'),('05 OPEN STUDIO — Vertical','05_Open_Studio'),('06 SIGNAL — Explainer','06_Signal'),('07 ORBIT — Native Loop','07_Orbit_Loop')]
if not a.new_scenes_only:specs=[('01 一念协作 — Parallel','01_Agent'),('02 DataTalk — Insight','02_DataTalk'),('03 一念 — Form','03_Form')]+specs
if a.render:
 for comp,slug in specs:
  target=P/(slug+'.mp4');native_target=P/(slug+'_two_cycles.mp4') if slug.startswith('07') else target
  run('--project',str(project),'--gpu','render','--comp',comp,'--out',str(native_target),'--format','h264','--fps','30','--resolution','full','--quality','best','--bitrate','22000','--audio','off' if slug.startswith('07') else 'on','--progress')
  if slug.startswith('07'):
   subprocess.run(['ffmpeg','-y','-v','error','-i',str(native_target),'-vf','trim=start_frame=240:end_frame=480,setpts=PTS-STARTPTS','-an','-c:v','libx264','-crf','16','-pix_fmt','yuv420p','-movflags','+faststart',str(target)],check=True)
print('Editable project:',project)
