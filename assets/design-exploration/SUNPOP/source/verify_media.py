"""Measure actual delivery files. A successful encode is not visual or customer acceptance."""
from pathlib import Path
import subprocess,json,hashlib
P=Path(__file__).resolve().parent.parent
reports={}
for f in sorted(P.glob('*.mp4')):
 r=json.loads(subprocess.run(['ffprobe','-v','error','-count_frames','-show_streams','-show_format','-of','json',str(f)],capture_output=True,text=True,check=True).stdout)
 dec=subprocess.run(['ffmpeg','-v','error','-i',str(f),'-f','null','-'],capture_output=True,text=True)
 if dec.returncode or dec.stderr:raise RuntimeError(f.name+dec.stderr)
 v=next(s for s in r['streams'] if s['codec_type']=='video')
 assert (v['width'],v['height'],v['nb_read_frames'],v['r_frame_rate'])==(1920,1080,'720','30/1')
 z={'sha256':hashlib.sha256(f.read_bytes()).hexdigest(),'duration':r['format']['duration'],'video':{k:v.get(k) for k in ['codec_name','width','height','r_frame_rate','nb_read_frames','pix_fmt','color_range','color_space','color_transfer','color_primaries']},'full_decode':'pass'}
 if any(s['codec_type']=='audio' for s in r['streams']):
  a=next(s for s in r['streams'] if s['codec_type']=='audio');z['audio']={k:a.get(k) for k in ['codec_name','sample_rate','channels']}
  pcm=subprocess.run(['ffmpeg','-v','error','-i',str(f),'-vn','-f','s16le','-ac','2','-ar','48000','-'],capture_output=True,check=True).stdout;z['decoded_audio_sha256']=hashlib.sha256(pcm).hexdigest()
  x=subprocess.run(['ffmpeg','-hide_banner','-i',str(f),'-af','loudnorm=I=-16:TP=-2:LRA=9:print_format=json','-f','null','-'],capture_output=True,text=True,check=True).stderr
  q=json.JSONDecoder().raw_decode(x[x.rfind('{'):])[0];z['measured_final_aac']={k:q[k] for k in ['input_i','input_tp','input_lra']}
  assert float(q['input_tp'])<-1.0
 reports[f.name]=z
(P/'review/final-media-qa.json').write_text(json.dumps(reports,ensure_ascii=False,indent=2))
timeline=json.loads((P/'source/audio/timeline.json').read_text());assert len(timeline['captions'])==3
for c in timeline['captions']:assert 0<=c['start']<c['end']<=24
assert reports['SUNPOP_把今天打开_配音字幕版.mp4']['decoded_audio_sha256']==reports['SUNPOP_把今天打开_无字幕配音版.mp4']['decoded_audio_sha256']
print(json.dumps({n:dict(duration=r['duration'],decode=r['full_decode'],audio=r.get('measured_final_aac')) for n,r in reports.items()},ensure_ascii=False,indent=2))
