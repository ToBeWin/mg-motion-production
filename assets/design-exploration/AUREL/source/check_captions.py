"""Compare encoded picture and caption variants at every frame of each spoken cue."""
from pathlib import Path
import subprocess,json,math
import numpy as np
P=Path(__file__).resolve().parent;OUT=P.parent;W,H=1920,1080;B=W*H*3
caps=json.loads((P/'audio/timeline.json').read_text())['captions']
for q in caps:q['first_frame']=math.floor(q['start']*30);q['end_frame_exclusive']=math.ceil(q['end']*30)
def process(name):return subprocess.Popen(['ffmpeg','-v','error','-i',str(OUT/name),'-f','rawvideo','-pix_fmt','rgb24','-'],stdout=subprocess.PIPE,stderr=subprocess.PIPE)
p=process('AUREL_v2.1_让想象有形_画面.mp4');c=process('AUREL_v2.1_让想象有形_配音字幕版.mp4');frames=[]
def luminance(x):
 v=x/255;v=np.where(v<=.04045,v/12.92,((v+.055)/1.055)**2.4);return np.sum(v*np.array([.2126,.7152,.0722]),axis=-1)
for i in range(480):
 a=p.stdout.read(B);b=c.stdout.read(B);assert len(a)==len(b)==B
 active=[q for q in caps if q['first_frame']<=i<q['end_frame_exclusive']]
 if not active:continue
 q=active[0];rect=(100,984,570,1045);x1,y1,x2,y2=rect
 a=np.frombuffer(a,dtype=np.uint8).reshape(H,W,3)[y1:y2,x1:x2].astype(float);b=np.frombuffer(b,dtype=np.uint8).reshape(H,W,3)[y1:y2,x1:x2].astype(float)
 mask=(np.max(np.abs(b-np.array([9,30,145])),axis=2)<=8)&(np.max(np.abs(a-b),axis=2)>18)
 assert mask.sum()>40,('caption not detected',q['id'],i,int(mask.sum()))
 bg=luminance(a[mask]);fg=luminance(b[mask]);r=(np.maximum(bg,fg)+.05)/(np.minimum(bg,fg)+.05)
 frames.append({'frame':i,'cue':q['id'],'interior_pixels':int(mask.sum()),'contrast_p05':round(float(np.percentile(r,5)),3),'median_contrast':round(float(np.median(r)),3)})
for proc in [p,c]:proc.stdout.close();assert proc.wait()==0,proc.stderr.read().decode()
out={'scope':'Every final-encoded frame inside each sentence-level subtitle interval, compared with the separately encoded uncaptioned picture. Near-opaque text interiors are selected by color and image difference; these numerical checks supplement image inspection.','checked_frames':len(frames),'lowest_frame_p05_contrast':min(x['contrast_p05']for x in frames),'cues':[{'id':q['id'],'first_frame':q['first_frame'],'end_frame_exclusive':q['end_frame_exclusive']}for q in caps],'frames':frames}
out['low_contrast_frames']=[x['frame']for x in frames if x['contrast_p05']<4.5]
(OUT/'review/encoded-caption-check.json').write_text(json.dumps(out,ensure_ascii=False,indent=2));print(json.dumps({k:v for k,v in out.items()if k!='frames'},ensure_ascii=False,indent=2))
