from pathlib import Path
import subprocess,json,hashlib
import numpy as np
P=Path(__file__).resolve().parent;SR=48000;D=24;N=D*SR
def decode(p):return np.frombuffer(subprocess.run(['ffmpeg','-v','error','-i',str(p),'-ac','2','-ar',str(SR),'-f','f32le','-'],capture_output=True,check=True).stdout,dtype='<f4').reshape(-1,2).copy()
def write(p,x):subprocess.run(['ffmpeg','-v','error','-y','-f','f32le','-ar',str(SR),'-ac','2','-i','-','-c:a','pcm_s24le',str(p)],input=x.astype('<f4').tobytes(),check=True)
def fade(x,a=.008,b=.035):
 x=x.copy();na=min(int(a*SR),len(x));nb=min(int(b*SR),len(x))
 if na:x[:na]*=np.linspace(0,1,na)[:,None]
 if nb:x[-nb:]*=np.linspace(1,0,nb)[:,None]
 return x
voice=np.zeros((N,2),np.float32);plans=[];starts=[2.51,11.65,20.04]
for i,(text,start) in enumerate(zip(json.loads((P/'script.json').read_text())['lines'],starts),1):
 x=decode(P/f'take-{i:02d}.wav');env=np.convolve(np.sqrt(np.mean(x*x,axis=1)),np.ones(480)/480,'same');active=np.flatnonzero(env>max(.0012,env.max()*.026));a=max(0,int(active[0]-.04*SR));b=min(len(x),int(active[-1]+.08*SR));x=fade(x[a:b]);gain=.10/max(float(np.sqrt(np.mean(x*x))),1e-7);x*=gain
 j=round(start*SR);voice[j:j+len(x)]+=x;write(P/f'voice-{i:02d}.wav',x)
 plans.append(dict(id=f'{i:02d}',text=text,start=start,end=start+len(x)/SR,source=f'take-{i:02d}.wav',source_in=a/SR,source_out=b/SR,file=f'voice-{i:02d}.wav',gain_db=float(20*np.log10(gain))))
write(P/'voice-edit.wav',voice)
raw=decode(P/'minimax-sunpop-v2.wav');offset=.025;music=raw[round(offset*SR):round(offset*SR)+N].copy();assert len(music)==N
# Preserve the generated performance at its original tempo. A 2.4-second
# smooth musical outro avoids the source generation limit and abrupt stopping.
# The full groove continues underneath the final spoken line as it fades.
music=fade(music,.04,0);ending=np.clip((np.arange(N)/SR-21.0)/2.6,0,1);music*=(np.cos(ending*np.pi/2)**2)[:,None];music[int(23.6*SR):]=0;music*=.082/max(float(np.sqrt(np.mean(music*music))),1e-7)
sfx=np.zeros_like(music);rng=np.random.default_rng(871)
events=[(.62,'can-open',.15),(.68,'fizz',.13),(1.93,'aperture',.10),(2.92,'type-impact',.09),(3.10,'type-impact',.07),(5.08,'sweep',.10),(8.9,'type-impact',.065),(11.15,'sweep',.13),(11.68,'type-impact',.08),(12.85,'pop',.075),(14.48,'sweep',.12),(16.42,'pop',.09),(17.97,'sweep',.12),(18.83,'type-impact',.07),(22.87,'pop',.09)]
for at,kind,g in events:
 dur=.70 if kind=='fizz' else .12 if kind in ['can-open','type-impact','pop'] else .28;n=round(dur*SR);t=np.arange(n)/SR;noise=rng.normal(size=n)
 if kind=='can-open':z=(.6*np.sin(2*np.pi*2380*t)+.25*np.sin(2*np.pi*4160*t)+noise*.3)*np.exp(-t*68)
 elif kind=='fizz':z=(noise-np.convolve(noise,np.ones(29)/29,'same'))*np.exp(-t*5)*.24
 elif kind=='type-impact':z=(np.sin(2*np.pi*(180*t-70*t*t))+.18*noise)*np.exp(-t*65)
 elif kind=='pop':z=np.sin(2*np.pi*(720*t-1900*t*t))*np.exp(-t*50)
 else:z=(np.convolve(noise,np.ones(7)/7,'same')-np.convolve(noise,np.ones(110)/110,'same'))*np.sin(np.linspace(0,np.pi,n))**2*.65
 x=fade(np.column_stack([z,z*.93])*g,.002,.018);j=round(at*SR);sfx[j:j+n]+=x
duck=np.ones(N)
for q in plans:
 a=round((q['start']-.16)*SR);b=round((q['end']+.22)*SR);an=round(.16*SR);bn=round(.22*SR)
 duck[a:a+an]=np.minimum(duck[a:a+an],np.linspace(1,.31,an));duck[a+an:b-bn]=.31;duck[b-bn:b]=np.minimum(duck[b-bn:b],np.linspace(.31,1,bn))
duck[round(plans[-1]['end']*SR):]=.31
write(P/'music-edit.wav',music);write(P/'sfx-edit.wav',sfx);write(P/'mix-premaster.wav',voice+music*duck[:,None]+sfx);write(P/'music-premaster.wav',music+sfx)
reports={}
for src,dst in [('mix-premaster.wav','master-voice.wav'),('music-premaster.wav','master-music.wav')]:
 first=subprocess.run(['ffmpeg','-hide_banner','-i',str(P/src),'-af','loudnorm=I=-16:TP=-2.0:LRA=9:print_format=json','-f','null','-'],capture_output=True,text=True,check=True).stderr;m=json.JSONDecoder().raw_decode(first[first.rfind('{'):])[0]
 filt='loudnorm=I=-16:TP=-2.0:LRA=9:linear=true:measured_I='+m['input_i']+':measured_TP='+m['input_tp']+':measured_LRA='+m['input_lra']+':measured_thresh='+m['input_thresh']+':offset='+m['target_offset']
 subprocess.run(['ffmpeg','-v','error','-y','-i',str(P/src),'-af',filt,'-ar',str(SR),'-c:a','pcm_s24le',str(P/dst)],check=True);reports[dst]=m
def stamp(t):
 ms=round(t*1000);return f'{ms//3600000:02}:{ms//60000%60:02}:{ms//1000%60:02},{ms%1000:03}'
(P/'SUNPOP.srt').write_text('\n\n'.join(f'{i+1}\n{stamp(q["start"])} --> {stamp(q["end"])}\n{q["text"]}' for i,q in enumerate(plans))+'\n')
data=dict(duration=D,captions=plans,voice_engine='IndexTTS2 / three individual short slogans',music_engine='MiniMax Music3 local MLX q6 / 30 steps',music_source='minimax-sunpop-v2.wav',music_source_duration=len(raw)/SR,music_edits=[dict(source_in=offset,source_out=24.025,atempo=1,ending='Continuous original-tempo groove; cosine fade from 21.0 to 23.6 s and 0.4 s silent tail; final voice duck held through ending')],normalization=reports,sfx_events=events,source_hashes={n:hashlib.sha256((P/n).read_bytes()).hexdigest() for n in ['minimax-sunpop-v2.wav']+[f'take-{i:02d}.wav' for i in range(1,4)]})
(P/'timeline.json').write_text(json.dumps(data,ensure_ascii=False,indent=2));print(json.dumps(plans,ensure_ascii=False,indent=2))
