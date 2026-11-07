#!/usr/bin/env python3
"""Extract this example's four transitions for visual review; no quality score."""
from pathlib import Path
import argparse, hashlib, json, subprocess
from PIL import Image, ImageDraw
ap=argparse.ArgumentParser();ap.add_argument('media',type=Path);ap.add_argument('--out',type=Path,required=True);a=ap.parse_args();a.out.mkdir(parents=True,exist_ok=True)
events=[('01-unfold',1.5,3.0),('02-extract-assemble',4.65,6.4),('03-citation-return',9.1,10.3),('04-brand-resolve',12.2,13.5)]
record={'source':a.media.name,'sha256':hashlib.sha256(a.media.read_bytes()).hexdigest(),'scope':'64 selected frames at four transitions; requires image inspection and does not substitute for normal-speed playback.','events':[]}
for name,start,end in events:
    sheet=Image.new('RGB',(1920,1168),'#eceef3');d=ImageDraw.Draw(sheet);times=[]
    for i in range(16):
        t=start+(end-start)*i/15;times.append(t);p=a.out/f'{name}-{i:02}.jpg'
        subprocess.run(['ffmpeg','-v','error','-y','-ss',str(t),'-i',str(a.media),'-frames:v','1','-vf','scale=960:-2','-update','1',str(p)],check=True)
        with Image.open(p) as im:
            im=im.resize((480,270));x=(i%4)*480;y=(i//4)*292;sheet.paste(im,(x,y+22));d.text((x+8,y+6),f'{t:.3f}s',fill='#36415a')
    sheet.save(a.out/f'{name}.jpg',quality=93);record['events'].append({'name':name,'times':times,'sheet':name+'.jpg'})
(a.out/'scope.json').write_text(json.dumps(record,indent=2,ensure_ascii=False)+'\n')
print(record['scope'])
