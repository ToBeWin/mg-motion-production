from pathlib import Path
import subprocess,json,time
P=Path(__file__).resolve().parent;OUT=P.parent.parent
for shot in ['unfold','hero']:
 (OUT/'review/render-progress.json').write_text(json.dumps({'stage':shot,'started_at':time.time()}))
 with (OUT/'review'/('render-'+shot+'.log')).open('w')as f:subprocess.run(['/Applications/Blender.app/Contents/MacOS/Blender','--background','--factory-startup','--python-exit-code','1','--python',str(P/'sculpture.py'),'--','--shot',shot,'--render','--samples','32'],stdout=f,stderr=subprocess.STDOUT,check=True)
 subprocess.run(['ffmpeg','-v','error','-y','-framerate','30','-i',str(P/(shot+'-frames')/'%04d.png'),'-c:v','prores_ks','-profile:v','4','-pix_fmt','yuva444p10le','-alpha_bits','16','-color_primaries','bt709','-color_trc','bt709','-colorspace','bt709','-an',str(P/(shot+'.mov'))],check=True)
(OUT/'review/render-progress.json').write_text(json.dumps({'stage':'complete','finished_at':time.time()}))
