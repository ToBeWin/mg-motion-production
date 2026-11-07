from pathlib import Path
import argparse,json,subprocess,re,numpy as np
P=Path(__file__).resolve().parent;ap=argparse.ArgumentParser();ap.add_argument('--case',choices=['brand','hardware','agent','all'],default='all');args=ap.parse_args();SR=48000

def dec(f):return np.frombuffer(subprocess.run(['ffmpeg','-v','error','-i',str(f),'-f','f32le','-ar',str(SR),'-ac','2','-'],capture_output=True,check=True).stdout,dtype='<f4').reshape(-1,2).copy()
def wav(f,x):subprocess.run(['ffmpeg','-v','error','-y','-f','f32le','-ar',str(SR),'-ac','2','-i','-','-c:a','pcm_s24le',str(f)],input=x.astype('<f4').tobytes(),check=True)
def measure(f):
 r=subprocess.run(['ffmpeg','-hide_banner','-i',str(f),'-af','loudnorm=I=-16:TP=-2.2:LRA=8:print_format=json','-f','null','-'],capture_output=True,text=True,check=True);return json.loads(re.findall(r'\{\s*"input_i".*?\}',r.stderr,re.S)[-1])
def stamp(t):
 ms=round(t*1000);h,ms=divmod(ms,3600000);m,ms=divmod(ms,60000);s,ms=divmod(ms,1000);return f'{h:02}:{m:02}:{s:02},{ms:03}'
for case in ['brand','hardware','agent'] if args.case=='all' else [args.case]:
 out=P/case;plan=json.loads((out/'edit-plan.json').read_text());D=plan['duration'];n=round(D*SR);voice=np.zeros((n,2));music=np.zeros((n,2));fx=np.zeros((n,2));captions=[]
 for take in plan['voices']:
  x=dec(out/take['file']);i=round(take['start']*SR);assert i+len(x)<=n;voice[i:i+len(x)]+=x
  captions.append({'id':take['id'],'text':take['text'],'start':take['start'],'end':take['end']+.1})
 for a,b in zip(captions,captions[1:]):assert a['end']<=b['start']
 raw=dec(out/plan['music_source']);cross=round(plan['crossfade']*SR)
 for j,segment in enumerate(plan['music_segments']):
  x=raw[round(segment['in']*SR):round(segment['out']*SR)].copy();i=round(segment['timeline_in']*SR);x=x[:n-i]
  if j:
   w=np.linspace(0,np.pi/2,cross)[:,None];music[i:i+cross]*=np.cos(w);x[:cross]*=np.sin(w)
  music[i:i+len(x)]+=x
 music*=plan['music_rms']/max(np.sqrt(np.mean(music**2)),1e-9);duck=np.ones(n)
 for cap in captions:
  a=max(0,round((cap['start']-plan.get('duck_attack',.12))*SR));b=round(cap['start']*SR);e=round(cap['end']*SR);f=min(n,round((cap['end']+plan.get('duck_release',.35))*SR));low=plan['duck']
  duck[a:b]=np.minimum(duck[a:b],np.linspace(1,low,b-a));duck[b:e]=np.minimum(duck[b:e],low);duck[e:f]=np.minimum(duck[e:f],np.linspace(low,1,f-e))
 music*=duck[:,None];music[:4800]*=np.linspace(0,1,4800)[:,None];tail=round(.75*SR);music[-tail:]*=np.cos(np.linspace(0,np.pi/2,tail))[:,None]**2
 for event in plan['sounds']:
  x=dec(out/event['file'])*event['gain']*.55;i=round(event['time']*SR);x=x[:n-i];fx[i:i+len(x)]+=x
 for name,x in [('voice-edit.wav',voice),('music-edit.wav',music),('sfx-edit.wav',fx),('premaster.wav',voice+music+fx)]:wav(out/name,x)
 m=measure(out/'premaster.wav');chain=f'loudnorm=I=-16:TP=-2.2:LRA=8:measured_I={m["input_i"]}:measured_TP={m["input_tp"]}:measured_LRA={m["input_lra"]}:measured_thresh={m["input_thresh"]}:offset={m["target_offset"]}:linear=true,atrim=duration={D}'
 subprocess.run(['ffmpeg','-v','error','-y','-i',str(out/'premaster.wav'),'-af',chain,'-ar',str(SR),'-c:a','pcm_s24le',str(out/'master.wav')],check=True)
 measured=measure(out/'master.wav');timeline={'duration':D,'voice_engine':'IndexTTS2','music_engine':'MiniMax Music 3','captions':captions,'takes':plan['voices'],'music_edits':plan['music_segments'],'sounds':plan['sounds'],'master_chain':chain,'final_wav_measurement':measured,'review_status':'Signal measurements only; listening review is recorded separately against actual final media.'}
 (out/'timeline.json').write_text(json.dumps(timeline,ensure_ascii=False,indent=2)+'\n');(out/'captions.srt').write_text('\n\n'.join(f'{i+1}\n{stamp(c["start"])} --> {stamp(c["end"])}\n{c["text"]}' for i,c in enumerate(captions))+'\n');print(case,measured['input_i'],'LUFS',measured['input_tp'],'dBTP',flush=True)
