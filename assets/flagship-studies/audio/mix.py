"""Edit supplied MiniMax music, place IndexTTS2 takes and compile subtitles.
Raw takes are preserved. Overlapping speech fails instead of being truncated.
"""
from pathlib import Path
import argparse,json,subprocess,wave,math,shutil
import numpy as np
P=Path(__file__).resolve().parent;SR=48000
def decode(path,ch=2):
 b=subprocess.run(['ffmpeg','-v','error','-i',str(path),'-f','f32le','-ac',str(ch),'-ar',str(SR),'-'],capture_output=True,check=True).stdout
 return np.frombuffer(b,dtype='<f4').copy().reshape(-1,ch)
def wav(path,x):
 subprocess.run(['ffmpeg','-v','error','-y','-f','f32le','-ar',str(SR),'-ac','2','-i','-','-c:a','pcm_s24le',str(path)],input=np.asarray(x,dtype='<f4').tobytes(),check=True)
def stamp(t):
 ms=round(t*1000);h,ms=divmod(ms,3600000);m,ms=divmod(ms,60000);s,ms=divmod(ms,1000);return f'{h:02}:{m:02}:{s:02},{ms:03}'
def speech_trim(a):
 rms=np.array([np.sqrt(np.mean(a[i:i+480]**2)) for i in range(0,len(a),480)])
 nz=np.flatnonzero(rms>max(.0018,rms.max()*.035))
 if not len(nz):raise ValueError('Silent TTS take')
 lo=max(0,int(nz[0]*480)-1440);hi=min(len(a),int((nz[-1]+1)*480)+2400)
 out=a[lo:hi].copy();n=min(240,len(out)//2);out[:n]*=np.linspace(0,1,n)[:,None];out[-n:]*=np.linspace(1,0,n)[:,None]
 return out,lo/SR,(len(a)-hi)/SR
def music_edit(a,duration,kind,setting=None):
 setting=setting or {}
 if setting.get('segments'):
  out=np.zeros((0,2),dtype=np.float32);edits=[];cross=round(setting.get('crossfade',.035)*SR)
  for src_start,src_end in setting['segments']:
   stop=len(a) if src_end is None else min(len(a),round(src_end*SR));start=round(src_start*SR)
   seg=a[start:stop].copy();at=len(out)
   if len(out) and cross:
    at-=cross;w=np.linspace(0,np.pi/2,cross)[:,None]
    out[-cross:]=out[-cross:]*np.cos(w)+seg[:cross]*np.sin(w);out=np.concatenate([out,seg[cross:]])
   else:out=np.concatenate([out,seg])
   edits.append({'source_in':start/SR,'source_out':stop/SR,'pre_tempo_timeline_in':at/SR,'crossfade_seconds':cross/SR if at else 0})
  tempo=setting.get('tempo',1)
  if tempo!=1:
   raw=subprocess.run(['ffmpeg','-v','error','-f','f32le','-ar',str(SR),'-ac','2','-i','-','-af',f'atempo={tempo}','-f','f32le','-'],input=np.asarray(out,dtype='<f4').tobytes(),capture_output=True,check=True).stdout
   out=np.frombuffer(raw,dtype='<f4').copy().reshape(-1,2)
  end=min(duration,len(out)/SR);n=round(duration*SR);out=np.pad(out[:n],((0,max(0,n-len(out))),(0,0)))
  edits.append({'tempo_factor_pitch_preserved':tempo,'effective_music_end':end,'padded_seconds':max(0,duration-end),'selection_reason':setting.get('reason','editorial selection')})
  return out,edits
 # An explicit editorial splice preserves the generated ending for main films.
 # This is not a claim that the model placed musical beats at visual cue times.
 n=round(duration*SR);cross=round(.65*SR);edits=[]
 if len(a)>=n:
  if duration<=8 or len(a)-n<SR:
   return a[:n].copy(),[{'source_in':0,'source_out':duration,'timeline_in':0}]
  tail=round(2.5*SR);pieces=[(0,n-tail+cross),(len(a)-tail,len(a))]
 else:
  delta=n-len(a);split=round(len(a)*.65);repeat=delta+2*cross
  if repeat>split:raise ValueError('Music is too short for a restrained middle reprise; generate a longer cue.')
  pieces=[(0,split),(split-repeat,split),(split,len(a))]
 out=np.zeros((0,2),dtype=np.float32)
 for start,end in pieces:
  seg=a[start:end].copy();at=len(out)
  if len(out):
   at-=cross;w=np.linspace(0,np.pi/2,cross)[:,None]
   out[-cross:]=out[-cross:]*np.cos(w)+seg[:cross]*np.sin(w);out=np.concatenate([out,seg[cross:]])
  else:out=seg
  edits.append({'source_in':start/SR,'source_out':end/SR,'timeline_in':at/SR,'crossfade_seconds':0 if at==0 else cross/SR})
 assert len(out)==n,(len(out),n)
 return out,edits
def main():
 ap=argparse.ArgumentParser();ap.add_argument('--raw',type=Path,required=True);ap.add_argument('--case',default='all',choices=['all','trace','orbit','shift']);ap.add_argument('--styles',action='store_true');a=ap.parse_args();raw=a.raw.resolve()
 plan=json.loads((P.parent/'production-plan.json').read_text());directions=json.loads((P/'audio-direction.json').read_text());kinds=list(plan['cases']) if a.case=='all' else [a.case]
 mixsettings=json.loads((P/'editorial-mix.json').read_text()) if (P/'editorial-mix.json').exists() else {}
 jobs=[{'id':k,'voice_case':k,'music_case':k,'duration':plan['cases'][k]['duration'],'folder':P/k,'lines':directions['cases'][k]['lines']} for k in kinds]
 if a.styles:
  jobs=[];routes=json.loads((P.parent/'style-routes.json').read_text())
  for domain in routes.values():
   for route in domain:
    if route['level']!='motion-study' or (a.case!='all' and route['voice_case'] not in kinds):continue
    kind=route['voice_case'];byid={v['id']:v for v in directions['cases'][kind]['lines']}
    lines=[dict(byid[identity],at=at) for identity,at in zip(route['voice_ids'],route['voice_at'])]
    jobs.append(dict(route,folder=P/'styles'/route['id'],lines=lines,music_case=route.get('music_case',kind)))
 for job in jobs:
  kind=job['voice_case'];setting=mixsettings.get(job['id'],{});D=job['duration'];n=round(D*SR);folder=job['folder'];folder.mkdir(exist_ok=True,parents=True);voice=np.zeros((n,2));subs=[];records=[];previous_end=0
  for line in job['lines']:
   f=raw/'indextts2'/kind/(line['id']+'.wav');meta=json.loads(f.with_suffix('.json').read_text())
   assert meta['engine']=='indextts2' and meta['process_exited'] and meta['service_stopped'] and meta['network_blocked']
   mono,lead,tail=speech_trim(decode(f,1));start=round(line['at']*30)/30;end=start+len(mono)/SR
   if start<previous_end+.08:raise ValueError(f'{kind} {line["id"]}: speech overlaps by {previous_end+.08-start:.3f}s; retime the shot or take.')
   if end>D-.12:raise ValueError(f'{kind} {line["id"]}: speech extends beyond picture ({end:.3f} > {D-.12:.3f}); extend the picture.')
   active=mono[abs(mono[:,0])>.006];rms=float(np.sqrt(np.mean(active**2)));gain=min(.115/max(rms,1e-6),.75/max(float(np.max(abs(mono))),1e-6))
   i=round(start*SR);voice[i:i+len(mono)]+=mono*gain*np.ones((1,2))
   subs.append({'id':line['id'],'start':start,'end':min(end+.10,D-.05),'text':line['text']});records.append({'id':line['id'],'raw_duration':meta['duration_seconds'],'trim_leading':lead,'trim_trailing':tail,'gain_db':20*math.log10(gain),'start':start,'end':end});previous_end=end
  selected_music=setting.get('music_case',job['music_case']);mpath=P/setting['music_path'] if setting.get('music_path') else raw/'minimax'/f'{selected_music}.wav';music,edits=music_edit(decode(mpath),D,kind,setting);mrms=float(np.sqrt(np.mean(music**2)));music*=setting.get('music_rms',.075)/max(mrms,1e-6)
  duck=np.ones(n)
  for s in subs:
   aa=max(0,round((s['start']-.16)*SR));bb=round(s['start']*SR);cc=min(n,round(s['end']*SR));dd=min(n,round((s['end']+setting.get('duck_release',.5))*SR));level=setting.get('duck_level',.36)
   if bb>aa:duck[aa:bb]=np.minimum(duck[aa:bb],1-(1-level)*(1-np.cos(np.linspace(0,np.pi,bb-aa)))/2)
   duck[bb:cc]=np.minimum(duck[bb:cc],level)
   if dd>cc:duck[cc:dd]=np.minimum(duck[cc:dd],level+(1-level)*(1-np.cos(np.linspace(0,np.pi,dd-cc)))/2)
  music*=duck[:,None];fade=np.ones(n);head=round(setting.get('fade_in',.08)*SR);fade[:head]=np.linspace(0,1,head);tail=round(setting.get('fade_out',1.2)*SR);fade[-tail:]=np.cos(np.linspace(0,np.pi/2,tail))**2;music*=fade[:,None]
  sfxpath=folder/'foley.wav';sfx=decode(sfxpath)[:n] if sfxpath.exists() else np.zeros((n,2));sfx=np.pad(sfx,((0,max(0,n-len(sfx))),(0,0)))[:n]*.55
  wav(folder/'voice-edit.wav',voice);wav(folder/'music-edit.wav',music);wav(folder/'sfx-edit.wav',sfx);wav(folder/'premaster-final.wav',voice+music+sfx)
  # Two-pass measured loudness. Stems are pre-master; the nonlinear mastering
  # chain is explicitly retained instead of claiming they sum to the master.
  cmd=['ffmpeg','-hide_banner','-i',str(folder/'premaster-final.wav'),'-af','loudnorm=I=-16:TP=-2.2:LRA=8:print_format=json','-f','null','-']
  res=subprocess.run(cmd,capture_output=True,text=True,check=True);report=json.JSONDecoder().raw_decode(res.stderr[res.stderr.rfind('{'):])[0];(folder/'loudness-input.json').write_text(json.dumps(report,indent=2))
  filt=f'loudnorm=I=-16:TP=-2.2:LRA=8:measured_I={report["input_i"]}:measured_TP={report["input_tp"]}:measured_LRA={report["input_lra"]}:measured_thresh={report["input_thresh"]}:offset={report["target_offset"]}:linear=true,atrim=duration={D}'
  subprocess.run(['ffmpeg','-v','error','-y','-i',str(folder/'premaster-final.wav'),'-af',filt,'-ar',str(SR),'-c:a','pcm_s24le',str(folder/'master.wav')],check=True)
  # Short cues can miss the requested LUFS in loudnorm's dynamic fallback.
  # Measure again, correct the remaining offset, and leave AAC peak margin.
  post=[]
  for attempt in range(2):
   check=subprocess.run(['ffmpeg','-hide_banner','-i',str(folder/'master.wav'),'-af','loudnorm=I=-16:TP=-2.2:LRA=8:print_format=json','-f','null','-'],capture_output=True,text=True,check=True)
   measured=json.JSONDecoder().raw_decode(check.stderr[check.stderr.rfind('{'):])[0];post.append(measured)
   diff=-16-float(measured['input_i']);gain=min(diff,-2.15-float(measured['input_tp']))
   if abs(gain)<.08:break
   tmp=folder/'master-corrected.wav';subprocess.run(['ffmpeg','-v','error','-y','-i',str(folder/'master.wav'),'-af',f'volume={gain}dB','-c:a','pcm_s24le',str(tmp)],check=True);tmp.replace(folder/'master.wav');filt+=f'; post gain {gain:.4f}dB'
  (folder/'timeline.json').write_text(json.dumps({'duration':D,'voice_engine':'IndexTTS2','music_engine':'MiniMax Music 3','voice_case':kind,'music_case':selected_music,'captions':subs,'takes':records,'music_edits':edits,'mix_settings':setting,'master_chain':filt,'master_verification':post,'raw_music_seconds':len(decode(mpath))/SR},ensure_ascii=False,indent=2))
  (folder/'captions.srt').write_text('\n\n'.join(f'{i+1}\n{stamp(s["start"])} --> {stamp(s["end"])}\n{s["text"]}' for i,s in enumerate(subs))+'\n',encoding='utf-8')
  print(job['id'],'mixed:',len(subs),'aligned sentences',flush=True)
if __name__=='__main__':main()
