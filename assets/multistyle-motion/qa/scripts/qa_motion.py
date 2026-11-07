"""Dense transition sheets from actual MP4 frames. No aesthetic pass is inferred."""
from pathlib import Path
import argparse, hashlib, json, subprocess
from PIL import Image, ImageDraw
P=Path(__file__).resolve().parent
ap=argparse.ArgumentParser();ap.add_argument('--case',choices=['brand','hardware','agent','all'],default='all');ap.add_argument('--media-root',type=Path,default=P);a=ap.parse_args();P=a.media_root.resolve()
settings={
 'brand':('SHIFT_v11_让下一步发生',[(2.65,3.55),(6.1,7.9),(10.65,11.7),(13.1,14.5)]),
 'hardware':('ORBIT_v11_转动即反馈',[(2.7,3.8),(6.8,9.5),(11.3,13.25)]),
 'agent':('一念协作_v11_从想法到作品',[(2.4,4.3),(6.85,8.0),(8.0,9.5),(12.3,14.1)])}
for case in settings if a.case=='all' else [a.case]:
 stem,ranges=settings[case];src=P/(stem+'_中文字幕.mp4');out=P/'qa'/('motion-'+case);out.mkdir(parents=True,exist_ok=True);record=[]
 for k,(start,end) in enumerate(ranges):
  sheet=Image.new('RGB',(1920,4*302),'#e4e4e1');draw=ImageDraw.Draw(sheet);samples=[]
  for j in range(16):
   frame=round((start+(end-start)*j/15)*30);time=frame/30;f=out/f'{k:02d}-{j:02d}-{frame:04d}.png'
   subprocess.run(['ffmpeg','-v','error','-y','-ss',str(time),'-i',str(src),'-frames:v','1','-update','1',str(f)],check=True)
   with Image.open(f) as im:
    thumb=im.convert('RGB');thumb.thumbnail((480,270));x=(j%4)*480;y=(j//4)*302;sheet.paste(thumb,(x,y+32));draw.text((x+8,y+9),f'{time:.4f}s / frame {frame}',fill='#202020')
   samples.append({'frame':frame,'time':time,'file':f.name})
  sheet.save(out/f'transition-{k:02d}.jpg',quality=92);record.append({'range':[start,end],'samples':samples,'sheet':f'transition-{k:02d}.jpg'})
 (out/'report.json').write_text(json.dumps({'media':str(src),'sha256':hashlib.sha256(src.read_bytes()).hexdigest(),'sample_count':sum(len(r['samples']) for r in record),'transitions':record,'scope':'Dense samples from actual encoded video. Separately record visual observations; not a full-frame human playback.'},ensure_ascii=False,indent=2)+'\n')
 print(case,'dense samples',sum(len(r['samples']) for r in record),flush=True)
