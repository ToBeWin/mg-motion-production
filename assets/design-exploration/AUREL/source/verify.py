"""Inspect actual final encodes. These checks are distinct from audiovisual judgment."""
from pathlib import Path
import subprocess,json,hashlib,re,math
P=Path(__file__).resolve().parent;OUT=P.parent;report={}
def run(args):return subprocess.run(args,capture_output=True,text=True,check=True)
for name in ['画面','纯音乐版','无字幕配音版','配音字幕版']:
 f=OUT/('AUREL_v2.1_让想象有形_'+name+'.mp4');assert f.is_file(),f
 d=json.loads(run(['ffprobe','-v','error','-show_streams','-show_format','-count_frames','-of','json',str(f)]).stdout)
 v=next(x for x in d['streams']if x['codec_type']=='video');assert(v['width'],v['height'])==(1920,1080);assert int(v['nb_read_frames'])==480;assert abs(float(v['duration'])-16)<.04
 dec=run(['ffmpeg','-v','error','-i',str(f),'-f','null','-']);assert not dec.stderr.strip(),dec.stderr
 q={'file':f.name,'sha256':hashlib.sha256(f.read_bytes()).hexdigest(),'bytes':f.stat().st_size,'width':v['width'],'height':v['height'],'frames_decoded':int(v['nb_read_frames']),'fps':v['r_frame_rate'],'duration':float(v['duration']),'full_decode':'passed'}
 if name!='画面':
  au=next(x for x in d['streams']if x['codec_type']=='audio');assert au['channels']==2
  stats=run(['ffmpeg','-hide_banner','-i',str(f),'-vn','-af','loudnorm=I=-16:TP=-2:LRA=9:print_format=json','-f','null','-']).stderr
  measure=json.JSONDecoder().raw_decode(stats[stats.rfind('{'):])[0];assert -19<float(measure['input_i'])<-13;assert float(measure['input_tp'])<-.9
  q['actual_encoded_audio']={'codec':au['codec_name'],'channels':au['channels'],'samplerate':au['sample_rate'],'lufs':float(measure['input_i']),'true_peak_dbtp':float(measure['input_tp']),'lra':float(measure['input_lra'])}
  adts=subprocess.run(['ffmpeg','-v','error','-i',str(f),'-vn','-c:a','copy','-f','adts','-'],capture_output=True,check=True).stdout;q['aac_sha256']=hashlib.sha256(adts).hexdigest()
 report[name]=q
assert report['无字幕配音版']['aac_sha256']==report['配音字幕版']['aac_sha256']
timeline=json.loads((P/'audio/timeline.json').read_text());bounds=[]
for q in timeline['captions']:
 assert 0<=q['start']<q['end']<16
 fi=math.floor(q['start']*30);fo=math.ceil(q['end']*30)
 bounds.append({'text':q['text'],'voice_start':q['start'],'voice_end':q['end'],'caption_first_frame':fi,'caption_end_exclusive':fo,'boundary_error_frames':max(q['start']*30-fi,fo-q['end']*30)})
proj=json.loads((P/'AUREL-v2.ecproj').read_text());items=list(proj['items'].values());comps=[x for x in items if x['kind']['type']=='Comp'];foot=[x for x in items if x['kind']['type']=='Footage']
assert all((P/x['kind']['path']).is_file()for x in foot)
assert all(not Path(x['kind']['path']).is_absolute()for x in foot)
plates=[x['kind']['path']for x in foot if x['kind']['path'].startswith('blender/')]
assert sorted(plates)==['blender/hero.mov','blender/unfold.mov'],plates
out={'media':report,'captions_from_real_voice_timing':bounds,'project':{'compositions':len(comps),'layers':sum(len(c['kind']['layers'])for c in comps),'footage_references':len(foot),'all_media_relative_and_present':True,'continuous_3d_plates':plates,'bit_depth':proj['settings']['bit_depth']},'scope':'Full final-file decoding and measurements; subtitle boundaries are sentence-level from trimmed source speech. Visual and model-assisted listening judgments are separate.'}
(OUT/'review/final-media-qa.json').write_text(json.dumps(out,ensure_ascii=False,indent=2)+'\n')
print(json.dumps(out,ensure_ascii=False,indent=2))
