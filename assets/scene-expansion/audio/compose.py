"""Original scores and event sounds for the three authored native films."""
from pathlib import Path
import argparse,json,math,re,subprocess,wave
import numpy as np
P=Path(__file__).resolve().parent
plan=json.loads((P.parent/'production-plan.json').read_text())['cases']
ap=argparse.ArgumentParser();ap.add_argument('--only',choices=list(plan));args=ap.parse_args()
SR=48000

def render(key,cfg):
 out=P/key;out.mkdir(exist_ok=True);D=cfg['duration'];count=round(D*SR);beat=60/cfg['bpm'];rng=np.random.default_rng({'api':3401,'brand':3402,'service':3403}[key]);notes=[]
 settings={
  'api':{'chords':[[50,57,62,65],[46,53,58,62],[48,55,60,64],[43,50,57,62]],'programs':[('bed',89),('bass',38),('lead',4)],'levels':[.72,.33,.28],'melody':[77,74,69,72,74,77,81,76]},
  'brand':{'chords':[[50,57,60,65],[53,60,64,69],[48,55,60,64],[55,62,65,69]],'programs':[('bed',89),('bass',38),('lead',81)],'levels':[.45,.50,.15],'melody':[74,74,77,72,69,72,77,81]},
  'service':{'chords':[[53,60,65,69],[48,55,60,64],[50,57,62,65],[46,53,58,62]],'programs':[('bed',24),('bass',32),('lead',12)],'levels':[.85,.50,.31],'melody':[77,72,74,69,72,77,79,76]}}
 st=settings[key]
 def note(t,d,n,v,inst):
  if 0<=t<D:notes.append(dict(time=round(t,6),duration=round(min(d,D-t),6),note=n,velocity=v,instrument=inst))
 for bar in range(math.ceil(cfg['close']/(beat*4))):
  start=bar*beat*4
  if start>cfg['close']-1:break
  chord=st['chords'][bar%4]
  for i,pitch in enumerate(chord):note(start+i*(.027 if key=='service' else .008),beat*(2.8 if key=='api' else 2),pitch,38+i*2,'bed')
  note(start,beat*1.45,chord[0]-12,48 if key!='brand' else 59,'bass')
  if key=='brand':
   for off in [1.5,2,3.5]:note(start+off*beat,.28,chord[0]-12,42,'bass')
  elif bar>0:note(start+2.5*beat,.48,chord[0]-12,34,'bass')
  for i,off in enumerate([.5,2.5] if key!='brand' else [.5,1.5,2.5,3.25]):
   t=start+off*beat
   if t<cfg['close']-1:note(t,.34 if key=='brand' else .60,st['melody'][(bar*2+i)%8],42+i%2*4,'lead')
 for i,n in enumerate(st['chords'][0]):note(cfg['close']+i*.025,D-cfg['close']-.8,n,42+i*2,'bed')
 for i,n in enumerate([st['chords'][0][-1]+12,st['chords'][0][-2]+12]):note(cfg['close']+i*.32,.8,n,37,'lead')
 (out/'notes.json').write_text(json.dumps(notes,indent=2)+'\n')
 for inst,program in st['programs']:
  subprocess.run(['/usr/bin/swift',str(P/'render_instrument.swift'),str(out/'notes.json'),inst,str(program),str(out/(inst+'.wav')),str(D)],check=True)
 def read(f):
  data=subprocess.run(['ffmpeg','-v','error','-i',str(f),'-f','f32le','-ar',str(SR),'-ac','2','pipe:1'],capture_output=True,check=True).stdout
  x=np.frombuffer(data,dtype=np.float32).reshape(-1,2).copy()[:count]
  if len(x)<count:x=np.pad(x,((0,count-len(x)),(0,0)))
  return x
 def room(x,wet):
  y=x.copy()
  for delay,gain in [(.053,.40),(.117,.24),(.193,.14),(.327,.07)]:
   shift=round(delay*SR);y[shift:,0]+=x[:-shift,1]*wet*gain;y[shift:,1]+=x[:-shift,0]*wet*gain
  return y
 music=sum(room(read(out/(inst+'.wav')),.30 if inst!='bass' else .05)*level for (inst,_),level in zip(st['programs'],st['levels']));fx=np.zeros((count,2));drums=np.zeros_like(fx)
 def put(dst,time,sig,pan=0):
  start=round(time*SR);length=min(len(sig),count-start)
  if start>=0 and length>0:
   dst[start:start+length,0]+=sig[:length]*math.sqrt((1-pan)/2);dst[start:start+length,1]+=sig[:length]*math.sqrt((1+pan)/2)
 def kick(t,gain):
  x=np.arange(round(.28*SR))/SR;sig=np.sin(2*np.pi*(48*x+1.5*(1-np.exp(-x/.018))))*np.exp(-x*18)*gain;put(drums,t,sig)
 for k in range(1,int(cfg['close']/beat)):
  t=k*beat
  if any(abs(t-c['time'])<.18 for c in cfg['cues'] if c['type'] in ('impact','confirm')):continue
  if key=='brand':
   kick(t,.072 if k%4==0 else .045)
   if k%2:
    x=np.arange(round(.11*SR))/SR;noise=rng.normal(0,1,len(x));sig=(noise-np.convolve(noise,np.ones(12)/12,'same'))*np.exp(-x*45)*.016;put(drums,t,sig,.1)
  elif key=='service' and k%4==0:kick(t,.018)
  x=np.arange(round(.075*SR))/SR;noise=rng.normal(0,1,len(x));sig=np.concatenate(([0],np.diff(noise)))*np.exp(-x*70)*(.006 if key=='brand' else .0025);put(drums,t+beat*.5,sig,.25*(-1)**k)
 for cue in cfg['cues']:
  t=cue['time'];kind=cue['type'];gain=cue.get('gain',1)
  if kind in ('sweep','paper'):
   dur=cue['duration'];x=np.arange(round(dur*SR))/SR;noise=rng.normal(0,1,len(x));smooth=np.convolve(noise,np.ones(26 if kind=='sweep' else 9)/(26 if kind=='sweep' else 9),'same');env=np.sin(np.pi*x/dur)**2
   sig=smooth*env*(.09 if kind=='sweep' else .038)*gain
   put(fx,t,sig,-.15);put(fx,t+.018,sig*.30,.35)
  elif kind=='impact':
   x=np.arange(round(.55*SR))/SR;sig=np.sin(2*np.pi*(43*x+1.8*(1-np.exp(-x/.025))))*np.exp(-x*10)*.12
   sig+=rng.normal(0,1,len(x))*np.exp(-x*80)*.028;put(fx,t,sig*gain)
  elif kind in ('tick','soft'):
   x=np.arange(round(.18*SR))/SR;freq=740 if kind=='tick' else 440;sig=(np.sin(2*np.pi*freq*x)+.13*np.sin(2*np.pi*freq*2.01*x))*np.exp(-x*33)*(.024 if kind=='tick' else .018);put(fx,t,sig*gain)
  else:
   chord=[587.33,698.46,880] if key!='service' else [698.46,880,1046.50]
   for i,freq in enumerate(chord[:2] if kind=='arrival' else chord):
    x=np.arange(round(.45*SR))/SR;sig=np.sin(2*np.pi*freq*x)*np.exp(-x*14)*.020;put(fx,t+i*.065,sig*gain,(-.12+i*.12))
 tt=np.arange(count)/SR;duck=np.ones(count)
 for start,end,level in cfg.get('focus',[]):duck[(tt>=start)&(tt<end)]=level
 for cue in cfg['cues']:
  if cue['type'] in ('impact','confirm'):duck[(tt>=cue['time']-.05)&(tt<cue['time']+.24)]=np.minimum(duck[(tt>=cue['time']-.05)&(tt<cue['time']+.24)],.64)
 rad=1200;v=np.pad(duck,(rad,rad),mode='edge');cs=np.concatenate(([0],np.cumsum(v)));duck=(cs[2*rad+1:]-cs[:-2*rad-1])/(2*rad+1)
 envelope=np.clip(tt/.07,0,1)*np.clip((D-tt)/.9,0,1)**1.6
 music=(music*duck[:,None]+drums)*envelope[:,None];fx=room(fx,.17)*envelope[:,None];gain=min(1,.9/float(np.max(np.abs(music+fx))));music*=gain;fx*=gain
 def save(name,x):
  with wave.open(str(out/name),'wb') as w:w.setnchannels(2);w.setsampwidth(2);w.setframerate(SR);w.writeframes((np.clip(x,-.99,.99)*32767).astype('<i2').tobytes())
 save('music.wav',music);save('foley.wav',fx);save('premaster.wav',music+fx)
 target=-16 if key=='brand' else -18
 first=subprocess.run(['ffmpeg','-hide_banner','-i',str(out/'premaster.wav'),'-af',f'loudnorm=I={target}:TP=-2:LRA=8:print_format=json','-f','null','-'],capture_output=True,text=True,check=True)
 stats=json.loads(re.findall(r'\{\s*"input_i".*?\}',first.stderr,re.S)[-1])
 measured=':'.join(f'{k}={stats[v]}' for k,v in [('measured_I','input_i'),('measured_TP','input_tp'),('measured_LRA','input_lra'),('measured_thresh','input_thresh'),('offset','target_offset')])
 subprocess.run(['ffmpeg','-y','-v','error','-i',str(out/'premaster.wav'),'-af',f'loudnorm=I={target}:TP=-2:LRA=8:{measured}:linear=true','-ar',str(SR),'-ac','2',str(out/'master.wav')],check=True)
 (out/'cues.json').write_text(json.dumps({'source':'../../production-plan.json','case':key,'bpm':cfg['bpm'],'cues':cfg['cues'],'focus':cfg['focus'],'target_lufs':target,'mix_gain':gain,'scope':'Original notes and synthesized event sounds; runtime uses the host macOS sound bank, which is not redistributed. Subjective listening is separate.'},ensure_ascii=False,indent=2)+'\n')
 print(key,'original score rendered',flush=True)

for key,cfg in plan.items():
 if not args.only or args.only==key:render(key,cfg)
