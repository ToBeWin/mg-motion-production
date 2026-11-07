#!/usr/bin/env python3
"""Generate a configurable procedural instrumental bed; no network or source media."""
import argparse, math, wave
from pathlib import Path
import numpy as np

def synth(duration, bpm, style, seed, sample_rate=48000):
    if not 2 <= duration <= 180 or not 45 <= bpm <= 180:
        raise ValueError('duration must be 2–180 seconds and bpm 45–180')
    sr=sample_rate; n=round(duration*sr); mix=np.zeros((n,2),dtype=np.float64)
    rng=np.random.default_rng(seed); beat=60/bpm
    chords=[(48,52,55,59),(45,48,52,55),(41,45,48,52),(43,47,50,55)]
    def note(midi,start,length,kind,level,pan):
        begin=round(start*sr);size=min(round(length*sr),n-begin)
        if begin<0 or size<=0:return
        t=np.arange(size)/sr;freq=440*2**((midi-69)/12)
        if kind=='pad':
            env=np.minimum(t/.45,1)*np.minimum((length-t)/.6,1)
            z=(np.sin(2*np.pi*freq*t)+.28*np.sin(2*np.pi*2*freq*t)+.11*np.sin(2*np.pi*3*freq*t))*env
        else:
            env=(1-np.exp(-t*80))*np.exp(-t*(2.4 if kind=='pluck' else 3.8))
            z=(np.sin(2*np.pi*freq*t)+.35*np.sin(2*np.pi*2*freq*t)*np.exp(-t*3)+.12*np.sin(2*np.pi*3*freq*t)*np.exp(-t*5))*env
        mix[begin:begin+size,0]+=level*z*(1-pan)*.5
        mix[begin:begin+size,1]+=level*z*(1+pan)*.5
    def percussion(start,kind,level):
        begin=round(start*sr);length=.20 if kind=='kick' else .08;size=min(round(length*sr),n-begin)
        if size<=0:return
        t=np.arange(size)/sr
        z=np.sin(2*np.pi*(52*t+28*(1-np.exp(-t*24))/24))*np.exp(-t*20) if kind=='kick' else rng.normal(0,1,size)*np.exp(-t*85)
        mix[begin:begin+size]+=level*z[:,None]
    bars=math.ceil(duration/(4*beat))
    for bar in range(bars):
        start=bar*4*beat;chord=chords[bar%4];section=bar%8
        for j,m in enumerate(chord):note(m,start,4*beat,'pad',.075,(-.55+.36*j))
        for j in range(4):
            if style=='pulse' or j in (0,2):note(chord[0]-12,start+j*beat,.7*beat,'bass',.13,0)
            if section>=2 and (style=='pulse' or j in (0,2)):
                percussion(start+j*beat,'kick',.09)
                if j in (1,3):percussion(start+j*beat,'hat',.025)
            if section%4!=3 or j<2:
                note(chord[(j+bar)%4]+12,start+(j+.5)*beat,.85*beat,'pluck',.075,(-.35 if j%2 else .35))
    fade=min(round(.8*sr),n//3);mix[:fade]*=np.linspace(0,1,fade)[:,None];mix[-fade:]*=np.linspace(1,0,fade)[:,None]
    peak=np.max(np.abs(mix));mix*=min(1,.82/max(peak,1e-9))
    return np.clip(mix,-1,1)

if __name__=='__main__':
    p=argparse.ArgumentParser(description=__doc__);p.add_argument('--out',type=Path,required=True);p.add_argument('--duration',type=float,default=30);p.add_argument('--bpm',type=float,default=100);p.add_argument('--style',choices=['warm','pulse'],default='warm');p.add_argument('--seed',type=int,default=7);a=p.parse_args()
    if a.out.exists():p.error('output already exists; choose a new file')
    if a.out.suffix.lower()!='.wav':p.error('output must end in .wav')
    audio=synth(a.duration,a.bpm,a.style,a.seed);a.out.parent.mkdir(parents=True,exist_ok=True)
    with wave.open(str(a.out),'wb') as f:f.setnchannels(2);f.setsampwidth(2);f.setframerate(48000);f.writeframes((audio*32767).astype('<i2').tobytes())
    print(f'Wrote {a.out}: {a.duration:g}s, 48 kHz stereo; review musical fit before final use.')
