from pathlib import Path
import subprocess,json,numpy as np,hashlib
P=Path(__file__).resolve().parent;SR=48000;D=18
def decode(p):return np.frombuffer(subprocess.run(['ffmpeg','-v','error','-i',str(p),'-ac','2','-ar',str(SR),'-f','f32le','-'],capture_output=True,check=True).stdout,dtype='<f4').reshape(-1,2).copy()
def write(p,x):subprocess.run(['ffmpeg','-v','error','-y','-f','f32le','-ar',str(SR),'-ac','2','-i','-','-c:a','pcm_s24le',str(p)],input=x.astype('<f4').tobytes(),check=True)
def fade(x,a=.015,b=.025):
 x=x.copy();na=min(int(a*SR),len(x));nb=min(int(b*SR),len(x));x[:na]*=np.linspace(0,1,na)[:,None];x[-nb:]*=np.linspace(1,0,nb)[:,None];return x
raw=decode(P/'voice-raw.wav');voice=np.zeros((D*SR,2),np.float32)
plans=[{'id':'01','text':'从一条线开始。','in':.18,'out':1.51,'start':.72},{'id':'02','text':'让光，拥有形状。','in':1.60,'out':3.17,'start':6.15},{'id':'03','text':'让想象，成为可能。','in':3.21,'out':len(raw)/SR,'start':14.5}]
for q in plans:
 x=fade(raw[round(q['in']*SR):round(q['out']*SR)]);gain=.095/max(float(np.sqrt(np.mean(x*x))),1e-6);x*=gain;at=round(q['start']*SR);voice[at:at+len(x)]+=x;q['end']=q['start']+len(x)/SR;q['gain_db']=float(20*np.log10(gain));q['file']='voice-'+q['id']+'.wav';write(P/q['file'],x)
music=decode(P/'minimax-form.wav');m=music[:D*SR].copy();tail=round(2.8*SR);cross=round(.6*SR);at=D*SR-tail
m[at:at+cross]=m[at:at+cross]*np.linspace(1,0,cross)[:,None]+music[-tail:-tail+cross]*np.linspace(0,1,cross)[:,None];m[at+cross:]=music[-tail+cross:]
m=fade(m,.18,.65);m*=.068/max(float(np.sqrt(np.mean(m*m))),1e-7)
sfx=np.zeros_like(m);events=[(.3,.3),(1.8,.23),(5.1,.6),(10.76,.45),(12.2,.3),(14.0,.26)]
rng=np.random.default_rng(410)
for t,g in events:
 length=round(.18*SR);z=rng.normal(size=length);z=np.convolve(z,np.ones(27)/27,mode='same');env=np.sin(np.linspace(0,np.pi,length))**2;x=z*env*g*.11;at=round(t*SR);sfx[at:at+length,0]+=x;sfx[at:at+length,1]+=x*.84
duck=np.ones(D*SR)
for q in plans:
 a=max(0,int((q['start']-.13)*SR));b=min(D*SR,int((q['end']+.18)*SR));attack=min(int(.13*SR),b-a);release=min(int(.18*SR),b-a);duck[a:a+attack]=np.minimum(duck[a:a+attack],np.linspace(1,.39,attack));duck[a+attack:b-release]=.39;duck[b-release:b]=np.minimum(duck[b-release:b],np.linspace(.39,1,release))
write(P/'voice-edit.wav',voice);write(P/'music-edit.wav',m);write(P/'sfx-edit.wav',sfx)
write(P/'mix-premaster.wav',voice+m*duck[:,None]+sfx);write(P/'music-premaster.wav',m+sfx)
reports={}
for src,dest in [('mix-premaster.wav','master-voice.wav'),('music-premaster.wav','master-music.wav')]:
 first=subprocess.run(['ffmpeg','-hide_banner','-i',str(P/src),'-af','loudnorm=I=-16:TP=-1.5:LRA=9:print_format=json','-f','null','-'],capture_output=True,text=True,check=True).stderr
 measured=json.JSONDecoder().raw_decode(first[first.rfind('{'):])[0]
 filt='loudnorm=I=-16:TP=-1.5:LRA=9:linear=true:measured_I='+measured['input_i']+':measured_TP='+measured['input_tp']+':measured_LRA='+measured['input_lra']+':measured_thresh='+measured['input_thresh']+':offset='+measured['target_offset']
 subprocess.run(['ffmpeg','-v','error','-y','-i',str(P/src),'-af',filt,'-ar',str(SR),'-c:a','pcm_s24le',str(P/dest)],check=True);reports[dest]=measured
def stamp(t):
 ms=round(t*1000);return f'{ms//3600000:02}:{ms//60000%60:02}:{ms//1000%60:02},{ms%1000:03}'
(P/'FORM.srt').write_text('\n\n'.join(f'{i+1}\n{stamp(q["start"])} --> {stamp(q["end"])}\n{q["text"]}' for i,q in enumerate(plans))+'\n')
(P/'timeline.json').write_text(json.dumps({'duration':D,'captions':plans,'voice_engine':'IndexTTS2','music_engine':'MiniMax Music 3 / local / 30 steps','source_hashes':{n:hashlib.sha256((P/n).read_bytes()).hexdigest() for n in ['voice-raw.wav','minimax-form.wav']},'normalization':reports,'sfx_events':events},ensure_ascii=False,indent=2))
print('Two 18 s masters, separate stems, three aligned phrases and SRT created.')
