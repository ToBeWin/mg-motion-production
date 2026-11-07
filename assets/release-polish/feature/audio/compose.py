"""Original 100 BPM score + deterministic original foley. macOS DLS bank stays on host."""
import argparse,json,math,subprocess,wave
from pathlib import Path
import numpy as np
S=Path(__file__).resolve().parent
ap=argparse.ArgumentParser();ap.add_argument('--vertical',action='store_true');args=ap.parse_args()
P=S/'vertical' if args.vertical else S;P.mkdir(exist_ok=True)
SR=48000; D=18 if args.vertical else 24; N=SR*D; B=.6; rng=np.random.default_rng(26026)
notes=[]
def note(t,d,n,v,inst):
 if 0<=t<D:notes.append(dict(time=round(t,5),duration=round(min(d,D-t),5),note=n,velocity=v,instrument=inst))
chords=[[53,60,64,69],[50,57,60,64],[45,55,60,64],[48,55,62,67],[53,60,64,69],[50,57,60,65],[48,55,59,64],[43,55,59,62],[53,60,64,69],[53,60,64,67]]
if args.vertical:chords=chords[:6]+[[53,60,64,69]]
for bar,ch in enumerate(chords):
 t=bar*4*B
 for k,n in enumerate(ch):note(t+k*.023,1.82,n,48+k*2,'keys')
 if bar not in (0,len(chords)-1):
  for k,n in enumerate(ch[1:]):note(t+1.50+k*.027,.60,n,39+k*2,'keys')
 if bar>=1 and bar!=len(chords)-1:
  note(t,1.02,ch[0]-12,56,'bass');note(t+1.5,.47,ch[0]-12,43,'bass')
for t,n in [(0,77),(1.2,76),(1.8,72),(2.4,74),(3.6,77),(4.2,76),(4.8,72),(5.7,71),(7.2,79),(7.5,76),(7.8,74),(8.4,72),(9.6,77),(10.5,76),(12,74),(13.2,77),(14.4,76),(15.3,72),(16.2,71),(17.4,74),(18,76),(18.9,79),(20.4,77),(21,76),(21.6,72)]:
 if args.vertical and t>=14.4:continue
 note(t,.46,n,48 if t<6.6 else 54,'marimba')
if args.vertical:
 for t,n in [(14.4,77),(15,76),(15.6,72)]:note(t,.65,n,52,'marimba')
(P/'notes.json').write_text(json.dumps(notes,indent=2))
for inst,program in [('keys',4),('bass',33),('marimba',12)]:
 subprocess.run(['/usr/bin/swift',str(S/'render_instrument.swift'),str(P/'notes.json'),inst,str(program),str(P/(inst+'.wav')),str(D)],check=True)
def readwav(path):
 raw=subprocess.run(['ffmpeg','-v','error','-i',str(path),'-f','f32le','-ar',str(SR),'-ac','2','pipe:1'],capture_output=True,check=True).stdout
 return np.frombuffer(raw,dtype=np.float32).reshape(-1,2).copy()[:N]
def save(path,a):
 a=np.clip(a,-.98,.98)
 with wave.open(str(path),'wb') as w:w.setnchannels(2);w.setsampwidth(2);w.setframerate(SR);w.writeframes((a*32767).astype('<i2').tobytes())
def room(a,wet=.12):
 out=a.copy()
 for delay,gain in [(.047,.33),(.089,.25),(.137,.17),(.213,.13),(.331,.08)]:
  s=int(delay*SR);out[s:,0]+=a[:-s,1]*wet*gain;out[s:,1]+=a[:-s,0]*wet*gain
 return out
music=room(readwav(P/'keys.wav'),.5)*.9+room(readwav(P/'marimba.wav'),.6)*.56+readwav(P/'bass.wav')*.70
foley=np.zeros((N,2),np.float64);percussion=np.zeros_like(foley)
def put(dst,t,a,pan=0):
 s=int(t*SR);a=np.asarray(a);n=min(len(a),N-s)
 if n<=0:return
 dst[s:s+n,0]+=a[:n]*math.sqrt((1-pan)/2);dst[s:s+n,1]+=a[:n]*math.sqrt((1+pan)/2)
for beat in range(4,24 if args.vertical else 36):
 t=beat*B
 if 6.05<t<7.15:continue
 x=np.arange(int(.105*SR))/SR
 shaker=rng.normal(0,1,len(x));shaker=np.concatenate(([0],np.diff(shaker)))*np.exp(-x*60)*.014
 put(percussion,t+.3,shaker,(-.28 if beat%2 else .28))
 if beat%4 in (0,2):
  x=np.arange(int(.20*SR))/SR;phase=2*np.pi*(48*x+38*.018*(1-np.exp(-x/.018)));kick=np.sin(phase)*np.exp(-x*25)*.055
  put(percussion,t,kick)
cue_data=[]
def whoosh(t,d,gain,pan):
 x=np.arange(int(d*SR))/SR;noise=rng.normal(0,1,len(x));noise=np.convolve(noise,np.ones(18)/18,mode='same');env=np.sin(np.pi*x/d)**2
 put(foley,t,noise*env*gain,pan);cue_data.append(dict(time=t,kind='soft air movement',duration=d))
movements=[(2.43,.63,.13,-.15),(4.25,.66,.12,.3),(8.15,.71,.13,-.3),(11.45,.62,.11,-.1),(13.65,.81,.12,-.2)] if args.vertical else [(2.43,.63,.13,-.15),(4.85,.66,.12,.3),(8.15,.71,.13,-.3),(10.85,.62,.11,-.1),(13.85,.64,.14,.25),(16.65,.64,.12,.25),(19.45,.81,.12,-.2)]
if not args.vertical:movements.append((11.43,1.35,.055,0))
for t,d,g,p in movements:whoosh(t,d,g,p)
x=np.arange(int(.09*SR))/SR
click=(np.sin(2*np.pi*1380*x)*.11+rng.normal(0,1,len(x))*.035)*np.exp(-x*95)
put(foley,6.6,click,.28);cue_data.append(dict(time=6.6,kind='palette click',duration=.09))
for t,f in [(6.75,880),(6.88,1108.73),(7.04,1318.51)]:
 x=np.arange(int(.26*SR))/SR;chime=(np.sin(2*np.pi*f*x)+.14*np.sin(2*np.pi*f*2.01*x))*np.exp(-x*17)*.03
 put(foley,t,chime,.1);cue_data.append(dict(time=t,kind='linked state confirmation',duration=.26))
timeline=np.arange(N)/SR
duck=np.ones(N);duck[(timeline>6.30)&(timeline<7.08)]=.45
# Smooth the purposeful pause without clicks.
if not args.vertical:duck[(timeline>11.4)&(timeline<13.4)]=.72
duck=np.convolve(np.pad(duck,(2400,2400),mode='edge'),np.ones(4801)/4801,mode='valid')
music*=duck[:,None]
fadein=np.clip(timeline/.08,0,1);fadeout=np.clip((D-timeline)/1.25,0,1)**1.6
music*=fadein[:,None]*fadeout[:,None];percussion*=fadeout[:,None]
save(P/'music.wav',music+percussion);save(P/'foley.wav',room(foley,.2));save(P/'premaster.wav',music+percussion+room(foley,.2))
(P/'cues.json').write_text(json.dumps(dict(bpm=100,duration=D,visual_change=6.6,cues=cue_data,scope='Original authored notes and DSP effects; built-in macOS instruments rendered locally, bank not redistributed.'),indent=2))
subprocess.run(['ffmpeg','-y','-v','error','-i',str(P/'premaster.wav'),'-af','loudnorm=I=-18:TP=-2:LRA=8','-ar',str(SR),'-ac','2',str(P/'master.wav')],check=True)
print('Original score, stems, cues and master created.')
