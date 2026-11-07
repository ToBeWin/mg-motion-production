"""Original restrained score and citation/document sounds, driven by the film cue sheet."""
from pathlib import Path
import json,math,re,subprocess,wave
import numpy as np
P=Path(__file__).resolve().parent
plan=json.loads((P.parent/'production-plan.json').read_text());D=plan['duration'];SR=48000;count=round(D*SR);beat=60/plan['bpm'];rng=np.random.default_rng(3500);notes=[]
chords=[[53,60,64,69],[50,57,60,65],[46,53,60,65],[48,55,62,67]]
def note(t,length,pitch,velocity,instrument):
    if t<D:notes.append({'time':round(t,6),'duration':round(min(length,D-t),6),'note':pitch,'velocity':velocity,'instrument':instrument})
for bar in range(12):
    start=bar*4*beat
    if start>26.5:break
    chord=chords[bar%4]
    for i,n in enumerate(chord):note(start+i*.018,beat*3.6,n,30+i*2,'pad')
    note(start,beat*1.8,chord[0]-12,42,'bass')
    if bar%2==1:note(start+beat*2.5,.6,chord[0]-12,31,'bass')
    motif=[chord[-1]+12,chord[2]+12,chord[1]+12]
    for i,off in enumerate([.5,1.75,3]):note(start+off*beat,.75,motif[(i+bar)%3],35+(i%2)*6,'piano')
for i,n in enumerate(chords[0]):note(28.5+i*.035,2.6,n,38+i*2,'pad')
for i,n in enumerate([81,76,72]):note(28.5+i*.31,1.2,n,40-i*3,'piano')
(P/'notes.json').write_text(json.dumps(notes,indent=2)+'\n')
for inst,program in [('pad',89),('bass',32),('piano',4)]:
    subprocess.run(['/usr/bin/swift',str(P/'render_instrument.swift'),str(P/'notes.json'),inst,str(program),str(P/(inst+'.wav')),str(D)],check=True)
def read(path):
    raw=subprocess.run(['ffmpeg','-v','error','-i',str(path),'-f','f32le','-ar',str(SR),'-ac','2','pipe:1'],capture_output=True,check=True).stdout
    return np.frombuffer(raw,np.float32).reshape(-1,2).copy()[:count]
def room(x,wet):
    y=x.copy()
    for delay,gain in [(.061,.36),(.127,.21),(.217,.13),(.349,.06)]:
        shift=round(delay*SR);y[shift:,0]+=x[:-shift,1]*wet*gain;y[shift:,1]+=x[:-shift,0]*wet*gain
    return y
music=room(read(P/'pad.wav'),.24)*.52+read(P/'bass.wav')*.30+room(read(P/'piano.wav'),.30)*.53
fx=np.zeros_like(music)
def put(at,sig,pan=0):
    start=round(at*SR);n=min(len(sig),count-start)
    if n>0 and start>=0:
        fx[start:start+n,0]+=sig[:n]*math.sqrt((1-pan)/2);fx[start:start+n,1]+=sig[:n]*math.sqrt((1+pan)/2)
for cue in plan['cues']:
    at=cue['time'];kind=cue['type']
    if kind in ('sweep','paper'):
        dur=cue['duration'];t=np.arange(round(SR*dur))/SR;noise=rng.normal(0,1,len(t));smooth=np.convolve(noise,np.ones(22)/22,'same');envelope=np.sin(np.pi*t/dur)**2
        put(at,smooth*envelope*(.055 if kind=='sweep' else .035),-.12);put(at+.022,smooth*envelope*.010,.35)
    elif kind=='tick':
        t=np.arange(round(.16*SR))/SR;s=(np.sin(2*np.pi*830*t)+.18*np.sin(2*np.pi*1669*t))*np.exp(-t*39)*.019;put(at,s,.04)
    else:
        for i,freq in enumerate([698.46,880,1046.5] if kind=='confirm' else [523.25,698.46]):
            t=np.arange(round(.52*SR))/SR;s=np.sin(2*np.pi*freq*t)*np.exp(-t*13)*.020;put(at+i*.055,s,(-.13+i*.13))
tt=np.arange(count)/SR;duck=np.ones(count)
for a,b,level in plan['focus']:duck[(tt>=a)&(tt<b)]=level
for cue in plan['cues']:
    if cue['type'] in ('tick','confirm'):
        sel=(tt>=cue['time']-.07)&(tt<cue['time']+.28);duck[sel]=np.minimum(duck[sel],.65)
radius=1400;v=np.pad(duck,(radius,radius),mode='edge');cs=np.concatenate(([0],np.cumsum(v)));duck=(cs[2*radius+1:]-cs[:-2*radius-1])/(2*radius+1)
env=np.clip(tt/.10,0,1)*np.clip((D-tt)/1.0,0,1)**1.5
music*=duck[:,None]*env[:,None];fx=room(fx,.13)*env[:,None];gain=min(1,.9/float(np.max(np.abs(music+fx))));music*=gain;fx*=gain
def save(name,data):
    with wave.open(str(P/name),'wb') as w:
        w.setnchannels(2);w.setsampwidth(2);w.setframerate(SR);w.writeframes((np.clip(data,-.99,.99)*32767).astype('<i2').tobytes())
save('music.wav',music);save('foley.wav',fx);save('premaster.wav',music+fx)
first=subprocess.run(['ffmpeg','-hide_banner','-i',str(P/'premaster.wav'),'-af','loudnorm=I=-18:TP=-2:LRA=8:print_format=json','-f','null','-'],capture_output=True,text=True,check=True)
stats=json.loads(re.findall(r'\{\s*"input_i".*?\}',first.stderr,re.S)[-1]);params=':'.join(f'{k}={stats[v]}' for k,v in [('measured_I','input_i'),('measured_TP','input_tp'),('measured_LRA','input_lra'),('measured_thresh','input_thresh'),('offset','target_offset')])
subprocess.run(['ffmpeg','-y','-v','error','-i',str(P/'premaster.wav'),'-af','loudnorm=I=-18:TP=-2:LRA=8:'+params+':linear=true','-ar',str(SR),'-ac','2',str(P/'master.wav')],check=True)
(P/'cues.json').write_text(json.dumps({'source':'../production-plan.json','cues':plan['cues'],'focus':plan['focus'],'bpm':plan['bpm'],'target_lufs':-18,'premix_gain':gain,'scope':'Original authored notes and synthesized event sounds. Host macOS sound bank not redistributed; subjective listening is a separate check.'},ensure_ascii=False,indent=2)+'\n')
print('TRACE audio rendered from shared cues',flush=True)
