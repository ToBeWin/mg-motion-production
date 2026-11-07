from pathlib import Path
import subprocess,numpy as np,json
P=Path(__file__).resolve().parent.parent
r={}
for name in ['配音字幕版','纯音乐版']:
 f=P/('AUREL_v2.1_让想象有形_'+name+'.mp4')
 a=np.frombuffer(subprocess.run(['ffmpeg','-v','error','-i',str(f),'-vn','-ac','2','-ar','48000','-f','f32le','-'],capture_output=True,check=True).stdout,dtype='<f4').reshape(-1,2)
 q={}
 for start,end in [(14,14.5),(14.65,15),(15,15.5),(15.5,15.85),(15.85,16)]:
  x=a[int(start*48000):int(end*48000)];q[f'{start}-{end}']={'rms_dbfs':float(20*np.log10(max(np.sqrt((x*x).mean()),1e-12))),'peak':float(np.abs(x).max())}
 assert q['15.85-16']['peak']<.002,q
 r[name]=q
(P/'review/final-encoded-audio-tail.json').write_text(json.dumps({'scope':'Measurements from actual encoded MP4 audio, confirming the final fade reaches near silence before the picture ends. This supplements full-duration model-assisted listening.','files':r},ensure_ascii=False,indent=2))
print(json.dumps(r,ensure_ascii=False,indent=2))
