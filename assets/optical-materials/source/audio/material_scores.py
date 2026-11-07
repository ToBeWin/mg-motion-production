"""Original restrained scores. Cue positions follow the camera and control motion."""
from pathlib import Path
import json,subprocess
import numpy as np

P=Path(__file__).resolve().parent;SR=48000;DUR=12;N=SR*DUR
t=np.arange(N)/SR
def frequency(note):return 440*2**((note-69)/12)
def write(path,data):
 subprocess.run(['ffmpeg','-y','-v','error','-f','f32le','-ar',str(SR),'-ac','2','-i','pipe:0','-c:a','pcm_s24le',str(path)],input=data.astype('<f4').tobytes(),check=True)
def envelope(u,dur,attack=.01,release=.2):return np.minimum(u/attack,1)*np.minimum(np.maximum(dur-u,0)/release,1)
def bandpass(noise,lo,hi):
 f=np.fft.rfftfreq(len(noise),1/SR);h=1/(1+(f/hi)**6)
 if lo:h*=1-1/(1+(f/lo)**6)
 return np.fft.irfft(np.fft.rfft(noise)*h,n=len(noise))
for kind in ['glass','metal']:
 folder=P/kind;folder.mkdir(exist_ok=True);rng=np.random.default_rng(903 if kind=='glass' else 906)
 music=np.zeros((N,2));fx=np.zeros_like(music)
 def put(dst,w,at,gain=.1,pan=0):
  i=round(at*SR);n=min(len(w),N-i)
  if n<=0:return
  dst[i:i+n]+=w[:n,None]*gain*np.array([np.cos((pan+1)*np.pi/4),np.sin((pan+1)*np.pi/4)])
 def resonance(f,dur=1.8,metal=False):
  u=np.arange(int(dur*SR))/SR;w=np.zeros(len(u))
  ratios=[1,2.01,3.95,6.7] if metal else [1,2,3.003,4.01]
  for j,r in enumerate(ratios):w+=np.sin(2*np.pi*f*r*u)*np.exp(-u/(.65/(j+1)))/(1+j*3)
  return w*envelope(u,dur,.004,.3)
 # Two slow voicings, never a repetitive metronome or a synthetic UI bleep bed.
 chords=[(0,[48,55,59,62,67]),(5.05,[43,50,57,62,66])] if kind=='glass' else [(0,[38,45,50,53,57]),(5,[38,45,48,52,57])]
 for at,notes in chords:
  dur=min(8,DUR-at);u=np.arange(int(dur*SR))/SR
  for j,note in enumerate(notes):
   f=frequency(note);wave=np.sin(2*np.pi*f*u)+.16*np.sin(2*np.pi*f*1.0012*u+.7)+.06*np.sin(2*np.pi*f*2*u)
   wave*=envelope(u,dur,1.15,2.7)*(.92+.08*np.sin(.55*u+j))
   put(music,wave,at,.018 if kind=='glass' else .024,(j-2)*.31)
 notes=[(.18,79),(4.65,74),(7.75,81),(9.0,78)] if kind=='glass' else [(.15,62),(4.7,69),(8,65)]
 for at,note in notes:put(music,resonance(frequency(note),2.4,kind=='metal'),at,.035 if kind=='glass' else .022, .25 if at>6 else -.25)
 cues=[]
 # An airy reveal follows the pullback; filtered friction follows the moving lens.
 for at,dur,tag,gain in ([(2.0,3.2,'camera reveal',.025),(5.1,2.6,'glass travel',.043)] if kind=='glass' else [(1.5,3.2,'camera reveal',.031),(8,4,'return to detail',.026)]):
  u=np.arange(round(dur*SR))/SR;noise=bandpass(rng.standard_normal(len(u)),280,3500)
  wind=noise*np.sin(np.pi*u/dur)**2;put(fx,wind,at,gain,-.25 if kind=='glass' else .2);cues.append(dict(at=at,duration=dur,event=tag))
 # Quiet contact transients with a short resonant body and close early reflections.
 for at in ([5.1,7.7] if kind=='glass' else [4.7,8]):
  dur=.4;u=np.arange(int(dur*SR))/SR;noise=bandpass(rng.standard_normal(len(u)),0,6000)
  transient=noise*np.exp(-u/.006)*.33+resonance(820 if kind=='glass' else 410,dur,kind=='metal')*.32
  transient*=envelope(u,dur,.0015,.12);put(fx,transient,at,.09,.34 if at>6 else -.34);cues.append(dict(at=at,duration=dur,event='control settles' if kind=='glass' else 'light catches chamfer'))
 dry=music.copy()
 for delay,gain in [(.089,.14),(.193,.08),(.397,.045),(.631,.022)]:
  d=round(SR*delay);music[d:]+=dry[:-d,::-1]*gain
 edge=envelope(t,DUR,.045,1.0);music*=edge[:,None];fx*=edge[:,None]
 for name,arr in [('music',music),('sfx',fx),('raw',music+fx)]:write(folder/(name+'.wav'),arr)
 subprocess.run(['ffmpeg','-y','-v','error','-i',str(folder/'raw.wav'),'-af','loudnorm=I=-18:TP=-2:LRA=12','-ar',str(SR),'-c:a','pcm_s24le',str(folder/'mix.wav')],check=True)
 (folder/'cues.json').write_text(json.dumps(dict(duration=DUR,events=cues,musicNotes=notes,original=True),ensure_ascii=False,indent=2)+'\n')
 print(kind,'score written')
