from pathlib import Path
import json,subprocess,hashlib
import numpy as np
P=Path(__file__).resolve().parent;plan=json.loads((P/'edit-plan.json').read_text());SR=plan['sample_rate'];D=plan['duration'];n=round(D*SR)
def dec(path):
 b=subprocess.run(['ffmpeg','-v','error','-i',str(path),'-f','f32le','-ar',str(SR),'-ac','2','-'],capture_output=True,check=True).stdout
 return np.frombuffer(b,dtype='<f4').reshape(-1,2).copy()
def wav(path,x):subprocess.run(['ffmpeg','-v','error','-y','-f','f32le','-ar',str(SR),'-ac','2','-i','-','-c:a','pcm_s24le',str(path)],input=np.asarray(x,dtype='<f4').tobytes(),check=True)
def stamp(t):
 m=round(t*1000);h,m=divmod(m,3600000);mi,m=divmod(m,60000);s,m=divmod(m,1000);return f'{h:02}:{mi:02}:{s:02},{m:03}'
voice=np.zeros((n,2));caps=[]
for r in plan['voices']:
 x=dec(P/r['file']);i=round(r['start']*SR);assert i+len(x)<=n;voice[i:i+len(x)]+=x
 caps.append({'id':r['id'],'text':r['text'],'start':r['start'],'end':r['end']+.1})
raw=dec(P/plan['music_source']);music=np.zeros((n,2));cross=round(plan['crossfade']*SR)
for j,seg in enumerate(plan['music_segments']):
 x=raw[round(seg['in']*SR):round(seg['out']*SR)].copy();i=round(seg['timeline_in']*SR);x=x[:n-i]
 if j:
  w=np.linspace(0,np.pi/2,cross)[:,None];music[i:i+cross]*=np.cos(w);x[:cross]*=np.sin(w)
 music[i:i+len(x)]+=x
music*=.068/max(float(np.sqrt(np.mean(music**2))),1e-8);duck=np.ones(n)
for c in caps:
 a=max(0,round((c['start']-.12)*SR));b=round(c['start']*SR);e=round(c['end']*SR);f=min(n,round((c['end']+.35)*SR));low=.35
 duck[a:b]=np.minimum(duck[a:b],np.linspace(1,low,b-a));duck[b:e]=np.minimum(duck[b:e],low);duck[e:f]=np.minimum(duck[e:f],np.linspace(low,1,f-e))
music*=duck[:,None];music[:4800]*=np.linspace(0,1,4800)[:,None];tail=round(.75*SR);music[-tail:]*=np.cos(np.linspace(0,np.pi/2,tail))[:,None]**2
fx=np.zeros((n,2))
for e in plan['sounds']:
 x=dec(P/e['file'])*e['gain']*.55;i=round(e['time']*SR);fx[i:i+len(x)]+=x[:n-i]
for name,x in [('voice-edit.wav',voice),('music-edit.wav',music),('sfx-edit.wav',fx),('premaster.wav',voice+music+fx)]:wav(P/name,x)
def measure(f):
 r=subprocess.run(['ffmpeg','-hide_banner','-i',str(f),'-af','loudnorm=I=-16:TP=-2.2:LRA=8:print_format=json','-f','null','-'],capture_output=True,text=True,check=True)
 return json.JSONDecoder().raw_decode(r.stderr[r.stderr.rfind('{'):])[0]
m=measure(P/'premaster.wav');chain=f'loudnorm=I=-16:TP=-2.2:LRA=8:measured_I={m["input_i"]}:measured_TP={m["input_tp"]}:measured_LRA={m["input_lra"]}:measured_thresh={m["input_thresh"]}:offset={m["target_offset"]}:linear=true,atrim=duration={D}'
subprocess.run(['ffmpeg','-v','error','-y','-i',str(P/'premaster.wav'),'-af',chain,'-ar',str(SR),'-c:a','pcm_s24le',str(P/'master.wav')],check=True)
post=measure(P/'master.wav');offset=min(-16-float(post['input_i']),-2.15-float(post['input_tp']))
if abs(offset)>.08:
 subprocess.run(['ffmpeg','-v','error','-y','-i',str(P/'master.wav'),'-af',f'volume={offset}dB','-c:a','pcm_s24le',str(P/'master-corrected.wav')],check=True);(P/'master-corrected.wav').replace(P/'master.wav');post=measure(P/'master.wav')
(P/'timeline.json').write_text(json.dumps({'duration':D,'voice_engine':'IndexTTS2','music_engine':'MiniMax Music 3','captions':caps,'takes':plan['voices'],'music_edits':plan['music_segments'],'sfx':plan['sounds'],'master_chain':chain,'post_gain_db':offset,'final_wav_measurement':post,'newly_generated_audio':False,'note':'Selected existing takes and music, newly edited and mixed for this visual timeline. Naturalness and music fit need actual listening review.'},ensure_ascii=False,indent=2)+'\n')
(P/'captions.srt').write_text('\n\n'.join(f'{i+1}\n{stamp(c["start"])} --> {stamp(c["end"])}\n{c["text"]}' for i,c in enumerate(caps))+'\n')
print('MIXED',D,'seconds',len(caps),'phrases',post['input_i'],'LUFS',post['input_tp'],'dBTP')
