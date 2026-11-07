from pathlib import Path
import argparse,subprocess,json,hashlib
import numpy as np
P=Path(__file__).resolve().parent;SR=48000;D=32
ap=argparse.ArgumentParser();ap.add_argument('--voice-only',action='store_true');ap.add_argument('--music',default='minimax-fold-structured.wav');args=ap.parse_args()
def decode(p):
 return np.frombuffer(subprocess.run(['ffmpeg','-v','error','-i',str(p),'-ac','2','-ar',str(SR),'-f','f32le','-'],capture_output=True,check=True).stdout,dtype='<f4').reshape(-1,2).copy()
def write(p,x):
 subprocess.run(['ffmpeg','-v','error','-y','-f','f32le','-ar',str(SR),'-ac','2','-i','-','-c:a','pcm_s24le',str(p)],input=x.astype('<f4').tobytes(),check=True)
def fade(x,a=.015,b=.04):
 x=x.copy();na=min(round(a*SR),len(x));nb=min(round(b*SR),len(x))
 if na:x[:na]*=np.linspace(0,1,na)[:,None]
 if nb:x[-nb:]*=np.linspace(1,0,nb)[:,None]
 return x
lines=['每个作品，都从一个想法开始。','把灵感，变成看得见的设计。','每一种色彩，都可以随心而变。','一个画面，自由展开。','让好设计，走进每一种尺寸。','让灵感，展开。']
starts=[.8,6.6,12.15,16.8,21.2,29.1];voice=np.zeros((D*SR,2),np.float32);plans=[]
for i,(text,start) in enumerate(zip(lines,starts),1):
 f='take-%02d.wav'%i;x=decode(P/f);r=np.sqrt(np.mean(x*x,axis=1));r=np.convolve(r,np.ones(480)/480,'same');active=np.flatnonzero(r>max(.0012,float(r.max())*.025));a=max(0,int(active[0]-.055*SR));b=min(len(x),int(active[-1]+.10*SR));x=fade(x[a:b]);gain=.095/max(float(np.sqrt(np.mean(x*x))),1e-7);x*=gain
 at=round(start*SR);voice[at:at+len(x)]+=x;dest='voice-%02d.wav'%i;write(P/dest,x)
 plans.append(dict(id='%02d'%i,text=text,start=start,end=start+len(x)/SR,source=f,source_in=a/SR,source_out=b/SR,file=dest,gain_db=float(20*np.log10(gain))))
write(P/'voice-edit.wav',voice)
def stamp(t):
 ms=round(t*1000);return f'{ms//3600000:02}:{ms//60000%60:02}:{ms//1000%60:02},{ms%1000:03}'
(P/'FOLD.srt').write_text('\n\n'.join(f'{i+1}\n{stamp(q["start"])} --> {stamp(q["end"])}\n{q["text"]}' for i,q in enumerate(plans))+'\n')
if args.voice_only:
 (P/'voice-timeline.json').write_text(json.dumps(plans,ensure_ascii=False,indent=2));print(json.dumps(plans,ensure_ascii=False,indent=2));raise SystemExit
raw=decode(P/args.music);mono=raw.mean(axis=1)
frames=np.lib.stride_tricks.sliding_window_view(mono,2048)[::512];spec=np.abs(np.fft.rfft(frames*np.hanning(2048),axis=1));flux=np.maximum(np.diff(spec,axis=0),0).sum(axis=1);flux-=flux.mean();corr=np.correlate(flux,flux,mode='full')[len(flux)-1:];hz=SR/512
lags=np.arange(int(hz*60/140),int(hz*60/95)+1);peak=lags[np.argmax(corr[lags])];estimate=60*hz/peak
# Keep the selected generated performance continuous. A modest, pitch-preserving
# time stretch fits its complete phrase to this film; no repeated short loop.
source_duration=len(raw)/SR
if not 24<=source_duration<=40:raise RuntimeError('Choose a longer suitable music take before mastering this 32 s film.')
ratio=source_duration/D
pcm=subprocess.run(['ffmpeg','-v','error','-i',str(P/args.music),'-af',f'atempo={ratio:.10f},apad','-t',str(D),'-ar',str(SR),'-ac','2','-f','f32le','-'],capture_output=True,check=True).stdout
music=np.frombuffer(pcm,dtype='<f4').reshape(-1,2).copy()[:D*SR]
edits=[dict(source_in=0,source_out=source_duration,destination=0,atempo=ratio,pitch_preserved=True)]
cross=0
music=fade(music,.20,2.0);music*=.067/max(float(np.sqrt(np.mean(music*music))),1e-7)
# Small tactile cues complement the real music. No melodic bed is synthesized.
sfx=np.zeros_like(music);rng=np.random.default_rng(281)
events=[(4.35,'unfold',.20),(5.75,'grow',.08),(13.43,'click',.22),(16.25,'stretch',.10),(20.55,'spread',.10),(24.35,'fold',.15),(28.15,'resolve',.10)]
for at,kind,gain in events:
 n=round((.07 if kind=='click' else .23)*SR);t=np.arange(n)/SR
 if kind=='click':z=(np.sin(2*np.pi*820*t)+.35*np.sin(2*np.pi*1510*t))*np.exp(-t*75)
 else:
  noise=rng.normal(size=n);z=(np.convolve(noise,np.ones(9)/9,'same')-np.convolve(noise,np.ones(70)/70,'same'))*np.sin(np.linspace(0,np.pi,n))**2*.25
 x=fade(np.column_stack([z,z*.93])*gain,.003,.025);j=round(at*SR);sfx[j:j+n]+=x
duck=np.ones(D*SR)
for q in plans:
 a=max(0,round((q['start']-.18)*SR));b=min(D*SR,round((q['end']+.24)*SR));an=round(.18*SR);bn=round(.24*SR)
 duck[a:a+an]=np.minimum(duck[a:a+an],np.linspace(1,.34,an));duck[a+an:b-bn]=.34;duck[b-bn:b]=np.minimum(duck[b-bn:b],np.linspace(.34,1,bn))
write(P/'music-edit.wav',music);write(P/'sfx-edit.wav',sfx);write(P/'mix-premaster.wav',voice+music*duck[:,None]+sfx);write(P/'music-premaster.wav',music+sfx)
reports={}
for src,dst in [('mix-premaster.wav','master-voice.wav'),('music-premaster.wav','master-music.wav')]:
 first=subprocess.run(['ffmpeg','-hide_banner','-i',str(P/src),'-af','loudnorm=I=-16:TP=-1.5:LRA=9:print_format=json','-f','null','-'],capture_output=True,text=True,check=True).stderr
 m=json.JSONDecoder().raw_decode(first[first.rfind('{'):])[0]
 filt='loudnorm=I=-16:TP=-1.5:LRA=9:linear=true:measured_I='+m['input_i']+':measured_TP='+m['input_tp']+':measured_LRA='+m['input_lra']+':measured_thresh='+m['input_thresh']+':offset='+m['target_offset']
 subprocess.run(['ffmpeg','-v','error','-y','-i',str(P/src),'-af',filt,'-ar',str(SR),'-c:a','pcm_s24le',str(P/dst)],check=True);reports[dst]=m
(P/'timeline.json').write_text(json.dumps(dict(duration=D,captions=plans,voice_engine='IndexTTS2 / six individual takes',music_engine='MiniMax Music 3 local / 30 steps',music_source=args.music,music_source_duration=len(raw)/SR,tempo_estimate=estimate,music_edits=edits,music_crossfade_seconds=cross/SR,normalization=reports,sfx_events=events,source_hashes={n:hashlib.sha256((P/n).read_bytes()).hexdigest() for n in [args.music]+['take-%02d.wav'%i for i in range(1,7)]}),ensure_ascii=False,indent=2))
print('32-second masters, stems, exact phrase placement and SRT saved.')
