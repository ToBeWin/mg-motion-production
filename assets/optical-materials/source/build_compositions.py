"""Build editable EffectCraft projects from Cycles footage and original sound."""
from pathlib import Path
import argparse,subprocess,json
P=Path(__file__).resolve().parent
ap=argparse.ArgumentParser();ap.add_argument('--still',action='store_true');ap.add_argument('--render',action='store_true');ap.add_argument('--output',type=Path,default=P.parent/'final');args=ap.parse_args()
ec=Path.home()/'Library/Application Support/EffectCraft/bin/effectcraft-cli'
suffix='STYLEFRAMES' if args.still else 'OPTICAL'
source=P/'effectcraft'
paths={'GLASS_MEDIA':P/'blender/glass/preview-0240.png' if args.still else source/'media/FORM_cycles.mp4','METAL_MEDIA':P/'blender/metal/preview-0170.png' if args.still else source/'media/ORBIT_cycles.mp4','GLASS_AUDIO':P/'audio/glass/mix.wav','METAL_AUDIO':P/'audio/metal/mix.wav'}
for path in paths.values():
 if not path.exists():raise FileNotFoundError(path)
js='\n'.join((source/f).read_text() for f in ['native_helpers.jsx','advanced_helpers.jsx','optical.jsx'])
for key,path in paths.items():js=js.replace('__'+key+'__',str(path).replace('\\','/').replace("'","\\'"))
script=source/('BUILD_'+suffix+'.jsx');script.write_text(js);project=source/(suffix+'.ecproj')
subprocess.run([str(ec),'--empty','--gpu','script',str(script),'--save-as',str(project),'--json'],check=True)
if args.render:
 args.output.mkdir(parents=True,exist_ok=True)
 for comp,name in [('01 FORM — Optical','01_一念Form_v3_光学玻璃_1080p30.mp4'),('02 ORBIT — Precision','02_ORBIT_v3_精密金属_1080p30.mp4'),('03 ORBIT — Silent loop','03_ORBIT_v3_无声循环_1080p30.mp4')]:
  subprocess.run([str(ec),'--project',str(project),'--gpu','render','--comp',comp,'--out',str(args.output/name),'--format','h264','--fps','30','--resolution','full','--quality','best','--bitrate','22000','--audio','on' if 'Silent'not in comp else 'off','--progress','--json'],check=True)
  from check_media import inspect
  key='loop' if 'Silent'in comp else 'form' if 'FORM'in comp else 'orbit'
  print(inspect(args.output/name,P.parent/'qa'/key,[0,.5,1.5,2.5,3.5,4.5,5.1,6.3,7.7,8.5,10,11.966]))
 # Compare the encoded loop's join with adjacent-frame differences, not a quality score.
 import numpy as np
 movie=args.output/'03_ORBIT_v3_无声循环_1080p30.mp4'
 raw=subprocess.check_output(['ffmpeg','-v','error','-i',str(movie),'-vf','scale=480:270','-pix_fmt','rgb24','-f','rawvideo','-'])
 frames=np.frombuffer(raw,dtype=np.uint8).reshape(-1,270,480,3).astype(np.float32)
 diff=lambda a,b:float(np.abs(a-b).mean())
 metrics=dict(frames=len(frames),last_to_first_mean_absolute_difference=diff(frames[-1],frames[0]),first_adjacent=diff(frames[0],frames[1]),last_adjacent=diff(frames[-2],frames[-1]),scope='Pixel differences only; visual loop review remains separate.')
 (P.parent/'qa/loop-boundary.json').write_text(json.dumps(metrics,indent=2)+'\n');print(metrics)
