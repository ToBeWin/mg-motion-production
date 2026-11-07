from pathlib import Path
import subprocess,json,time
P=Path(__file__).resolve().parent
blender='/Applications/Blender.app/Contents/MacOS/Blender'
for shot,n in [('open',75),('hero',180),('pack',180)]:
 # Replace preview frames to make the final sequence internally consistent.
 for f in {'open':[36],'hero':[95],'pack':[105]}[shot]:
  p=P/(shot+'-frames')/f'{f:04d}.png'
  if p.exists():p.rename(p.with_name(f'preview-{f:04d}.png'))
 subprocess.run([blender,'-b','-t','6','--python',str(P/'sunpop.py'),'--','--shot',shot,'--render','--samples','32'],check=True)
 for i in range(1,n+1):assert (P/(shot+'-frames')/f'{i:04d}.png').exists()
 subprocess.run(['ffmpeg','-v','error','-y','-framerate','30','-i',str(P/(shot+'-frames')/'%04d.png'),'-c:v','prores_ks','-profile:v','4','-pix_fmt','yuva444p10le','-vendor','apl0','-an',str(P/(shot+'.mov'))],check=True)
 print('FINISHED PLATE',shot,flush=True)
