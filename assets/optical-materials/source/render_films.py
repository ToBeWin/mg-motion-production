"""Sequential GPU renders keep VRAM predictable; preserves full 1080p and 30 fps."""
from pathlib import Path
import subprocess,sys,json,time,argparse,os,shutil
P=Path(__file__).resolve().parent;Q=P.parent/'qa';Q.mkdir(exist_ok=True)
ap=argparse.ArgumentParser();ap.add_argument('--samples',type=int,default=32);ap.add_argument('--blender',default=os.getenv('BLENDER_BIN') or shutil.which('blender') or '/Applications/Blender.app/Contents/MacOS/Blender');args=ap.parse_args()
blender=args.blender
if not Path(blender).is_file():raise FileNotFoundError(blender)
ec=Path.home()/'Library/Application Support/EffectCraft/bin/effectcraft-cli'
if not ec.is_file():raise FileNotFoundError(ec)
(P/'effectcraft/media').mkdir(parents=True,exist_ok=True)
subprocess.run([sys.executable,str(P/'audio/material_scores.py')],check=True)
for kind,title in [('glass','FORM'),('metal','ORBIT')]:
 (Q/'progress.json').write_text(json.dumps(dict(stage='cycles',kind=kind,start=time.time())))
 with (Q/(kind+'-production.log')).open('w') as log:
  subprocess.run([blender,'--background','--factory-startup','--python-exit-code','1','--python',str(P/'blender/build_optical.py'),'--','--kind',kind,'--render','--samples',str(args.samples),'--scale','100'],stdout=log,stderr=subprocess.STDOUT,check=True)
 subprocess.run(['ffmpeg','-y','-v','error','-framerate','30','-start_number','1','-i',str(P/'blender'/kind/'frames/%04d.png'),'-frames:v','360','-c:v','libx264','-preset','slow','-crf','14','-pix_fmt','yuv420p','-color_primaries','bt709','-color_trc','bt709','-colorspace','bt709','-movflags','+faststart',str(P/'effectcraft/media'/(title+'_cycles.mp4'))],check=True)
 (Q/'progress.json').write_text(json.dumps(dict(stage='encoded plate',kind=kind,time=time.time())))
with (Q/'effectcraft-final-render.log').open('w') as log:
 (Q/'progress.json').write_text(json.dumps(dict(stage='effectcraft',time=time.time())))
 subprocess.run([sys.executable,str(P/'build_compositions.py'),'--render'],stdout=log,stderr=subprocess.STDOUT,check=True)
(Q/'progress.json').write_text(json.dumps(dict(stage='completed',time=time.time())))
print('Rendered all three deliverables')
