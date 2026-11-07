"""Original music and motion cues for the three new stories; no external music assets."""
from pathlib import Path
import json, subprocess
import numpy as np

P=Path(__file__).resolve().parent
SR=48000
CONFIG={
 'feature':dict(duration=14,bpm=104,chord=[50,57,60,64],cues=[(2.65,'air',.8),(3.5,'tap',.2),(5.2,'tap',.15),(5.8,'resolve',1.2),(11.3,'air',.9),(12.2,'resolve',1.2)]),
 'event':dict(duration=12,bpm=120,chord=[45,52,55,59],cues=[(.18,'impact',.35),(.8,'tap',.2),(2.65,'air',.7),(3.6,'impact',.35),(6.1,'air',1.2),(7.5,'impact',.5),(8.6,'resolve',1.4),(9.2,'tap',.2)]),
 'explainer':dict(duration=20,bpm=90,chord=[48,55,59,62],cues=[(.4,'air',1),(5,'tick',.1),(5.5,'tick',.1),(6,'tick',.1),(9,'tap',.2),(9.5,'resolve',.8),(12.2,'air',1.1),(13.7,'tap',.2),(16.6,'air',.8),(17.5,'resolve',1.5)])
}

def hz(n):return 440*2**((n-69)/12)
for kind,cfg in CONFIG.items():
 dur=cfg['duration'];n=round(dur*SR);t=np.arange(n)/SR;rng=np.random.default_rng(741+len(kind));music=np.zeros((n,2));fx=np.zeros_like(music)
 def put(dst,w,at,gain,pan=0):
  i=round(at*SR);num=min(len(w),n-i)
  if i<0 or num<=0:return
  dst[i:i+num]+=w[:num,None]*np.array([np.cos((pan+1)*np.pi/4),np.sin((pan+1)*np.pi/4)])*gain
 def key(note,length=1.2,decay=.4):
  u=np.arange(round(length*SR))/SR;f=hz(note);v=(np.sin(2*np.pi*f*u)+.22*np.sin(2*np.pi*2.002*f*u)+.06*np.sin(2*np.pi*3*f*u))*np.exp(-u/decay)
  return v*np.minimum(u/.006,1)*np.minimum((length-u)/.05,1)
 # Sparse harmonic bed with moving voicing, natural decays and room reflections.
 for j,note in enumerate(cfg['chord']):
  wave=np.sin(2*np.pi*hz(note)*t+.2*j)+.12*np.sin(2*np.pi*hz(note)*1.003*t)
  env=np.minimum(t/1.2,1)*np.minimum((dur-t)/1.8,1)*(.75+.25*np.sin(.4*t+j)**2)
  put(music,wave*env,0,.014 if kind!='event' else .009,(j-1.5)*.32)
 beat=60/cfg['bpm']; end=dur-2
 for i,at in enumerate(np.arange(.25,end,beat if kind!='explainer' else beat*2)):
  note=cfg['chord'][[0,2,1,3,2,1,0,3][i%8]]+(12 if kind!='explainer' else 24)
  put(music,key(note,1.8,.38 if kind=='event' else .7),at,.045 if i%4 else .065,(-1 if i%2 else 1)*.28)
  if kind=='event':
   u=np.arange(round(.24*SR))/SR
   if i%2==0:put(music,np.sin(2*np.pi*(60*u+2*(1-np.exp(-u/.02))))*np.exp(-u/.06)*np.minimum(u/.003,1),at,.09)
   else:
    noise=rng.standard_normal(len(u));noise-=np.convolve(noise,np.ones(18)/18,'same');put(music,noise*np.exp(-u/.022)*np.minimum(u/.002,1),at,.011,.1)
 for i,(at,typ,length) in enumerate(cfg['cues']):
  u=np.arange(round(length*SR))/SR
  if typ=='air':
   noise=rng.standard_normal(len(u));low=np.convolve(noise,np.ones(22)/22,'same');w=low*np.sin(np.pi*u/length)**2;g=.037
  elif typ=='impact':w=np.sin(2*np.pi*(52*u+1.7*(1-np.exp(-u/.015))))*np.exp(-u/.075)*np.minimum(u/.003,1);g=.1
  elif typ in ['tick','tap']:w=(np.sin(2*np.pi*1300*u)+.2*np.sin(2*np.pi*2350*u))*np.exp(-u/.012)*np.minimum(u/.0015,1);g=.028 if typ=='tick' else .045
  else:w=key(cfg['chord'][i%4]+24,length,.55);g=.05
  put(fx,w,at,g,(i%3-1)*.25)
 dry=music.copy()
 for delay,gain in [(.073,.08),(.151,.07),(.293,.045),(.461,.025)]:
  d=round(delay*SR);music[d:]+=dry[:-d,::-1]*gain
 # Light music ducking around semantic sync/completion events.
 for at,typ,length in cfg['cues']:
  if typ in ['resolve','impact']:
   envelope=1-.16*np.exp(-((t-at)/.21)**2);music*=envelope[:,None]
 edge=np.minimum(t/.03,1)*np.minimum((dur-t)/.8,1);music*=edge[:,None];fx*=edge[:,None]
 folder=P/kind;folder.mkdir(exist_ok=True)
 for name,w in [('music',music),('sfx',fx),('raw',music+fx)]:
  subprocess.run(['ffmpeg','-y','-v','error','-f','f32le','-ar',str(SR),'-ac','2','-i','pipe:0','-c:a','pcm_s24le',str(folder/(name+'.wav'))],input=w.astype('<f4').tobytes(),check=True)
 subprocess.run(['ffmpeg','-y','-v','error','-i',str(folder/'raw.wav'),'-af','loudnorm=I=-17:TP=-2:LRA=11','-ar',str(SR),'-c:a','pcm_s24le',str(folder/'mix.wav')],check=True)
 (folder/'cues.json').write_text(json.dumps(cfg,ensure_ascii=False,indent=2)+'\n');print(kind,'score complete')
