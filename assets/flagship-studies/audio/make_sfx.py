"""Small original interface and material sound effects only. Not background music."""
from pathlib import Path
import argparse,json
import numpy as np
from mix import SR,wav
P=Path(__file__).resolve().parent;plan=json.loads((P.parent/'production-plan.json').read_text())
def shape(kind,dur,rng):
 t=np.arange(round(dur*SR))/SR;n=rng.normal(0,1,len(t));f=np.fft.rfftfreq(len(t),1/SR)
 if kind=='tick':
  high=np.fft.irfft(np.fft.rfft(n)*(1-1/np.sqrt(1+(f/4500)**4)),n=len(t));return (np.sin(2*np.pi*2400*t)*.17+high*.045)*np.exp(-t*110)*np.minimum(t/.001,1)*np.clip((dur-t)/.01,0,1)
 cut=3500 if kind=='air' else 1400;response=1/np.sqrt(1+(f/cut)**4)
 if kind=='paper':response=1-response
 return np.fft.irfft(np.fft.rfft(n)*response,n=len(t))*(.028 if kind=='air' else .042)*np.sin(np.pi*t/dur)**2
def compose(kind):
 D=plan['cases'][kind]['duration'];out=np.zeros((D*SR,2));rng=np.random.default_rng(71027);events=[]
 def event(t,label,typ='tick',gain=1,dur=.12,pan=0):events.append(dict(seconds=t,frame=round(t*30),event=label,sound=typ,gain=gain,duration=dur,pan=pan))
 if kind=='trace':
  event(5.5,'send question',gain=1.2)
  for t in [2.8,5.8,10.4,20.4,23.7]:event(t-.17,'workspace travel','paper',.65,.42)
  for t in [7.15,8.45]:event(t,'exact source revealed',gain=.75,pan=-.4 if t<8 else .4)
  event(19.8,'open citation two',gain=1.4,pan=.35);event(25,'identity resolves',gain=.65)
 elif kind=='orbit':
  for t in [3.65,7.65,11.65,15.65]:event(t,'camera breath','air',.8,.5)
  for t in [5,5.4,5.8,6.2,6.6]:event(t,'rotation detail',gain=.75,pan=-.2)
 else:
  for t in [0,1,2.5,4,5.5,7,8.5,10,11,12,13,14.5,16]:event(t,'type or slash arrival',gain=.9)
  for t in [2.3,5.3,8.3,10.8,14.3]:event(t,'slash travel','paper',1.3,.28)
 for e in events:
  x=shape(e['sound'],e['duration'],rng)*e['gain'];start=round(e['seconds']*SR);length=min(len(x),len(out)-start);pan=(e['pan']+1)*np.pi/4;out[start:start+length]+=x[:length,None]*np.array([np.cos(pan),np.sin(pan)])
 dry=out.copy()
 for delay,gain in [(.037,.09),(.079,.045)]:sh=round(delay*SR);out[sh:]+=dry[:-sh,::-1]*gain
 folder=P/kind;folder.mkdir(exist_ok=True);wav(folder/'foley.wav',out)
 (folder/'cues.json').write_text(json.dumps({'kind':kind,'duration':D,'sample_rate':SR,'events':events,'scope':'Original event sounds only; MiniMax supplies final music.'},ensure_ascii=False,indent=2))
if __name__=='__main__':
 ap=argparse.ArgumentParser();ap.add_argument('--case',choices=['all','trace','orbit','shift'],default='all');a=ap.parse_args()
 for kind in plan['cases'] if a.case=='all' else [a.case]:compose(kind)
