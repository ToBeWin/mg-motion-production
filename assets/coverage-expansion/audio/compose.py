"""Original musical phrases and event sounds, locked to the authored animation cue sheet."""
from pathlib import Path
import argparse,json,math,re,subprocess,wave
import numpy as np
P=Path(__file__).resolve().parent;SR=48000
ap=argparse.ArgumentParser();ap.add_argument('--only');a=ap.parse_args()
plan=json.loads((P.parent/'production-plan.json').read_text())
for si,scene in enumerate(plan['scenes']):
 if not scene['sound'] or a.only and scene['id'] not in a.only.split(','):continue
 dest=P/scene['id'];dest.mkdir(exist_ok=True);D=scene['duration'];count=round(D*SR);beat=60/scene['bpm'];rng=np.random.default_rng(3600+si);notes=[]
 chords=[[53,60,64,69],[50,57,60,65],[46,53,60,65],[48,55,62,67]];transpose=[0,2,7,0,0,5,2,7,2,0,0,5,-2][si]
 def note(t,length,pitch,velocity,instrument):
  if t<D:notes.append(dict(time=round(t,6),duration=round(min(length,D-t),6),note=pitch+transpose,velocity=velocity,instrument=instrument))
 for bar in range(math.ceil(D/(4*beat))):
  start=bar*4*beat
  if start>D-1.7:break
  chord=chords[bar%4]
  for i,n in enumerate(chord):note(start+i*.022,beat*3.6,n,30+i*2,'pad')
  note(start,beat*1.6,chord[0]-12,44,'bass')
  if si in [7,8,2]:note(start+beat*2.5,beat*.7,chord[0]-12,35,'bass')
  for i,off in enumerate([.5,1.75,3]):note(start+off*beat,.6,chord[[3,2,1][i]]+12,39+(i%2)*6,'piano')
 final=max(.1,D-2.0)
 for i,n in enumerate(chords[0]):note(final+i*.018,1.8,n,33+i*2,'pad')
 for i,n in enumerate([81,76,72]):note(final+i*.18,.9,n,38-i*3,'piano')
 (dest/'notes.json').write_text(json.dumps(notes,indent=2))
 for inst,program in [('pad',89 if si not in [2,7,12] else 88),('bass',32),('piano',4 if si not in [2,12] else 11)]:
  subprocess.run(['/usr/bin/swift',str(P/'render_instrument.swift'),str(dest/'notes.json'),inst,str(program),str(dest/(inst+'.wav')),str(D)],check=True,stdout=subprocess.DEVNULL)
 def read(path):
  raw=subprocess.run(['ffmpeg','-v','error','-i',str(path),'-f','f32le','-ar',str(SR),'-ac','2','pipe:1'],capture_output=True,check=True).stdout
  return np.frombuffer(raw,np.float32).reshape(-1,2).copy()[:count]
 def room(x,wet):
  y=x.copy()
  for delay,gain in [(.061,.36),(.127,.21),(.217,.13),(.349,.06)]:
   shift=round(delay*SR);y[shift:,0]+=x[:-shift,1]*wet*gain;y[shift:,1]+=x[:-shift,0]*wet*gain
  return y
 music=room(read(dest/'pad.wav'),.24)*.52+read(dest/'bass.wav')*.30+room(read(dest/'piano.wav'),.3)*.53;fx=np.zeros_like(music)
 def put(at,sig,pan=0):
  start=round(at*SR);n=min(len(sig),count-start)
  if n>0 and start>=0:fx[start:start+n,0]+=sig[:n]*math.sqrt((1-pan)/2);fx[start:start+n,1]+=sig[:n]*math.sqrt((1+pan)/2)
 for cue in scene['cues']:
  at=cue['time'];kind=cue['type']
  if kind in ('sweep','paper'):
   dur=cue['duration'];t=np.arange(round(SR*dur))/SR;noise=rng.normal(0,1,len(t));smooth=np.convolve(noise,np.ones(22)/22,'same');envelope=np.sin(np.pi*t/dur)**2
   put(at,smooth*envelope*(.055 if kind=='sweep' else .035),-.12);put(at+.022,smooth*envelope*.010,.35)
  elif kind=='tick':
   t=np.arange(round(.16*SR))/SR;s=(np.sin(2*np.pi*830*t)+.18*np.sin(2*np.pi*1669*t))*np.exp(-t*39)*.019;put(at,s,.04)
  else:
   for i,freq in enumerate([698.46,880,1046.5] if kind=='confirm' else [523.25,698.46]):
    t=np.arange(round(.52*SR))/SR;s=np.sin(2*np.pi*freq*t)*np.exp(-t*13)*.02;put(at+i*.055,s,-.13+i*.13)
 tt=np.arange(count)/SR;duck=np.ones(count)
 for cue in scene['cues']:
  sel=(tt>=cue['time']-.07)&(tt<cue['time']+.30);duck[sel]=np.minimum(duck[sel],.65)
 radius=1400;v=np.pad(duck,(radius,radius),mode='edge');cs=np.concatenate(([0],np.cumsum(v)));duck=(cs[2*radius+1:]-cs[:-2*radius-1])/(2*radius+1)
 env=np.clip(tt/.10,0,1)*np.clip((D-tt)/.85,0,1)**1.5;music*=duck[:,None]*env[:,None];fx=room(fx,.13)*env[:,None];gain=min(1,.9/float(np.max(np.abs(music+fx))));music*=gain;fx*=gain
 def save(name,data):
  with wave.open(str(dest/name),'wb') as w:w.setnchannels(2);w.setsampwidth(2);w.setframerate(SR);w.writeframes((np.clip(data,-.99,.99)*32767).astype('<i2').tobytes())
 save('music.wav',music);save('foley.wav',fx);save('premaster.wav',music+fx)
 first=subprocess.run(['ffmpeg','-hide_banner','-i',str(dest/'premaster.wav'),'-af','loudnorm=I=-18:TP=-2:LRA=8:print_format=json','-f','null','-'],capture_output=True,text=True,check=True);stats=json.loads(re.findall(r'\{\s*"input_i".*?\}',first.stderr,re.S)[-1]);params=':'.join(f'{k}={stats[v]}' for k,v in [('measured_I','input_i'),('measured_TP','input_tp'),('measured_LRA','input_lra'),('measured_thresh','input_thresh'),('offset','target_offset')])
 subprocess.run(['ffmpeg','-y','-v','error','-i',str(dest/'premaster.wav'),'-af','loudnorm=I=-18:TP=-2:LRA=8:'+params+':linear=true','-ar',str(SR),'-ac','2',str(dest/'master.wav')],check=True)
 (dest/'cues.json').write_text(json.dumps({'cues':scene['cues'],'bpm':scene['bpm'],'target_lufs':-18,'scope':'Original authored notes and synthesized event sounds. System sound bank not redistributed. Subjective listening is a separate check.'},ensure_ascii=False,indent=2))
 print(scene['id']+' audio complete',flush=True)
