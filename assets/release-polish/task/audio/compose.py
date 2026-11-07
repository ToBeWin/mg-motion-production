"""Two original scores, with visual cues read from the production plan."""
import argparse,json,math,subprocess,wave
from pathlib import Path
import numpy as np
P=Path(__file__).resolve().parent
plan=json.loads((P.parent/'production-plan.json').read_text())
ap=argparse.ArgumentParser();ap.add_argument('--only',choices=['agent','data']);a=ap.parse_args()
SR=48000
def render(key):
 cfg=plan[key];D=cfg['duration'];N=int(D*SR);out=P/key;out.mkdir(exist_ok=True);rng=np.random.default_rng(26027 if key=='agent' else 26028)
 notes=[];bpm=96 if key=='agent' else 108;beat=60/bpm
 def note(t,d,n,v,inst):
  if 0<=t<D:notes.append(dict(time=round(t,6),duration=round(min(d,D-t),6),note=n,velocity=v,instrument=inst))
 if key=='agent':
  chords=[[50,57,60,64],[46,53,57,62],[53,60,64,69],[48,55,62,67]];melody=[74,72,69,65,67,69,72,74];programs=[('keys',4),('bass',33),('melody',11)]
 else:
  chords=[[53,60,64,69],[50,57,60,65],[55,62,65,69],[48,55,59,64]];melody=[77,76,72,74,77,79,76,72];programs=[('keys',0),('bass',32),('melody',12)]
 ending=cfg['times']['close']
 bars=math.ceil(ending/(4*beat))
 for bar in range(bars):
  t=bar*4*beat;ch=chords[bar%4]
  if t>ending-1.5:break
  for j,n in enumerate(ch):note(t+j*.019,2.6*beat,n,40+j*3,'keys')
  if bar>0:
   note(t,1.3*beat,ch[0]-12,46,'bass');note(t+2.5*beat,.7*beat,ch[0]-12,34,'bass')
  for j in range(3 if key=='agent' else 4):
   start=t+(j+.5)*beat;pitch=melody[(bar*2+j)%len(melody)]
   if start<ending-1:note(start,.36 if key=='data' else .55,pitch,42+(j%2)*6,'melody')
 # A deliberate coda follows each film's close, independent of the phrase grid.
 final_chord=chords[0]
 for j,n in enumerate(final_chord):note(ending+j*.024,max(.5,D-ending-.5),n,45+j*2,'keys')
 for j,n in enumerate([final_chord[-1]+12,final_chord[-2]+12,final_chord[1]+12]):note(ending+j*.27,.55,n,43-j*3,'melody')
 (out/'notes.json').write_text(json.dumps(notes,indent=2))
 for name,program in programs:subprocess.run(['/usr/bin/swift',str(P/'render_instrument.swift'),str(out/'notes.json'),name,str(program),str(out/(name+'.wav')),str(D)],check=True)
 def read(path):
  raw=subprocess.run(['ffmpeg','-v','error','-i',str(path),'-f','f32le','-ar',str(SR),'-ac','2','pipe:1'],capture_output=True,check=True).stdout
  return np.frombuffer(raw,dtype=np.float32).reshape(-1,2).copy()[:N]
 def save(path,x):
  with wave.open(str(path),'wb') as w:w.setnchannels(2);w.setsampwidth(2);w.setframerate(SR);w.writeframes((np.clip(x,-.98,.98)*32767).astype('<i2').tobytes())
 def room(x,wet):
  y=x.copy()
  for dt,g in [(.047,.38),(.101,.26),(.163,.18),(.257,.1),(.389,.06)]:
   q=int(dt*SR);y[q:,0]+=x[:-q,1]*wet*g;y[q:,1]+=x[:-q,0]*wet*g
  return y
 music=room(read(out/'keys.wav'),.45 if key=='agent' else .25)*.8+room(read(out/'melody.wav'),.5)*.38+read(out/'bass.wav')*.62
 fx=np.zeros((N,2),np.float64);rhythm=np.zeros_like(fx)
 def put(dst,t,sig,pan=0):
  s=round(t*SR);nn=min(len(sig),N-s)
  if nn>0:dst[s:s+nn,0]+=sig[:nn]*math.sqrt((1-pan)/2);dst[s:s+nn,1]+=sig[:nn]*math.sqrt((1+pan)/2)
 for b in range(6,int((ending-.8)/beat)):
  t=b*beat
  if any(abs(t-c['time'])<.25 for c in cfg['cues'] if c['type']=='click'):continue
  x=np.arange(int(.09*SR))/SR;noise=rng.normal(0,1,len(x));shaker=np.concatenate(([0],np.diff(noise)))*np.exp(-x*65)*.009
  put(rhythm,t+beat*.5,shaker,.25*(-1)**b)
  if key=='agent' and b%4==0:
   x=np.arange(int(.23*SR))/SR;kick=np.sin(2*np.pi*(45*x+1.1*(1-np.exp(-x/.022))))*np.exp(-x*23)*.04;put(rhythm,t,kick)
 for cue in cfg['cues']:
  t=cue['time'];pan=cue.get('pan',0);kind=cue['type'];gain=cue.get('gain',1)
  if kind=='air':
   d=cue['duration'];x=np.arange(int(d*SR))/SR;noise=rng.normal(0,1,len(x));noise=np.convolve(noise,np.ones(22)/22,mode='same');put(fx,t,noise*np.sin(np.pi*x/d)**2*.105*gain,pan)
  elif kind=='click':
   x=np.arange(int(.075*SR))/SR;sig=(np.sin(2*np.pi*1250*x)*.09+rng.normal(0,1,len(x))*.035)*np.exp(-x*105);put(fx,t,sig*gain,pan)
  elif kind in ('tick','warm'):
   x=np.arange(int(.18*SR))/SR;freq=660 if kind=='warm' else 990;sig=(np.sin(2*np.pi*freq*x)+.17*np.sin(2*np.pi*2.02*freq*x))*np.exp(-x*31)*.035;put(fx,t,sig*gain,pan)
  else:
   for j,f in enumerate([659.25,783.99,1046.5] if key=='data' else [587.33,698.46,880]):
    x=np.arange(int(.33*SR))/SR;sig=np.sin(2*np.pi*f*x)*np.exp(-x*18)*.023;put(fx,t+j*.08,sig*gain,pan)
 tt=np.arange(N)/SR;duck=np.ones(N)
 for c in cfg['cues']:
  if c['type']=='click':duck[(tt>c['time']-.18)&(tt<c['time']+.24)]=.52
 for focus in cfg.get('audio_focus',[]):
  sel=(tt>focus['start'])&(tt<focus['end']);duck[sel]=np.minimum(duck[sel],focus['gain'])
 duck=np.convolve(np.pad(duck,(1200,1200),mode='edge'),np.ones(2401)/2401,mode='valid')
 env=np.clip(tt/.09,0,1)*np.clip((D-tt)/.9,0,1)**1.8
 music=(music*duck[:,None]+rhythm)*env[:,None];fx=room(fx,.2)*env[:,None]
 save(out/'music.wav',music);save(out/'foley.wav',fx);save(out/'premaster.wav',music+fx)
 (out/'cues.json').write_text(json.dumps({'source':'../../production-plan.json','film':key,'bpm':bpm,'duration':D,'cues':cfg['cues'],'review':'Authored timing and signal measures; listening is a separate review.'},ensure_ascii=False,indent=2)+'\n')
 subprocess.run(['ffmpeg','-y','-v','error','-i',str(out/'premaster.wav'),'-af','loudnorm=I=-18:TP=-2:LRA=8','-ar',str(SR),'-ac','2',str(out/'master.wav')],check=True)
 print(key,'score completed')
for key in ['agent','data']:
 if not a.only or a.only==key:render(key)
