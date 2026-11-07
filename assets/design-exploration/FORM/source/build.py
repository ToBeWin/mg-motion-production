from pathlib import Path
import json,subprocess,argparse,os
P=Path(__file__).resolve().parent
CLI=os.environ.get('EFFECTCRAFT_CLI',str(Path.home()/'Library/Application Support/EffectCraft/bin/effectcraft-cli'))
ap=argparse.ArgumentParser();ap.add_argument('--render',action='store_true');a=ap.parse_args()
plate='FORM-optical.mov'
if not (P/'assets'/plate).exists():raise RuntimeError('Complete optical motion plate is required')
parts=['var ROOT='+json.dumps(str(P))+';','var PLATE='+json.dumps(plate)+';','var CONTOURS='+ (P/'assets/FORM-paths.json').read_text()+';']
for name in ['native_helpers','advanced_helpers','form']:
 parts.append((P/'effectcraft'/(name+'.jsx')).read_text())
timeline=json.loads((P/'audio/timeline.json').read_text())
parts.append('var CAPTIONS='+json.dumps(timeline['captions'],ensure_ascii=False)+';')
parts.append('''
(function(){
 var M=MuseNative,pic=null;
 for(var p=1;p<=app.project.numItems;p++)if(app.project.item(p).name==='FORM / Picture')pic=app.project.item(p);
 if(!pic)throw new Error('FORM / Picture composition is required for all delivery versions');
 for(var v=0;v<3;v++){
  var c=M.comp(v===0?'FORM / With voice':(v===1?'FORM / 中文字幕':'FORM / Music only'),1920,1080,18,30);
  M.setup(c.layers.add(pic),'Editable picture',[960,540],0,18);
  var filename=v===2?'master-music.wav':'master-voice.wav';
  M.setup(c.layers.add(app.project.importFile(new ImportOptions(new File(ROOT+'/audio/'+filename)))),'Sound / '+filename,null,0,18);
  if(v===1)for(var i=0;i<CAPTIONS.length;i++){
   var q=CAPTIONS[i],l=M.text(c,'Caption '+q.id,q.text,38,M.rgb('214E4B'),[960,922],'HiraginoSansGB-W3',Math.floor(q.start*30)/30,Math.ceil(q.end*30)/30);
   l.motionBlur=false;
  }
 }
})();
''')
script=P/'effectcraft/FORM-build.jsx';script.write_text('\n'.join(parts))
project=P/'FORM.ecproj'
subprocess.run([CLI,'--project',str(P/'assets/studio-handoff.ecproj'),'script',str(script),'--save-as',str(project),'--json'],check=True)
d=json.loads(project.read_text())
if d['settings']['bit_depth']=='Bpc8':
 subprocess.run([CLI,'--project',str(project),'exec','file.cycleBitDepth','--save','--json'],check=True)
 d=json.loads(project.read_text())
for i in d['items'].values():
 if i['kind']['type']=='Footage':i['kind']['path']=os.path.relpath(i['kind']['path'],P)
project.write_text(json.dumps(d,ensure_ascii=False,separators=(',',':')))
if a.render:
 subprocess.run([CLI,'--project',str(project),'--gpu','render','--comp','FORM / Picture','--out',str(P.parent/'FORM_形的发生_画面.mp4'),'--format','h264','--fps','30','--quality','best','--bitrate','35000','--audio','off','--progress','--json'],check=True)
 caption_picture=P.parent/'.FORM-caption-picture.mp4'
 subprocess.run([CLI,'--project',str(project),'--gpu','render','--comp','FORM / 中文字幕','--out',str(caption_picture),'--format','h264','--fps','30','--quality','best','--bitrate','35000','--audio','off','--progress','--json'],check=True)
 # Preserve the measured master through the same AAC encoder for every delivery.
 # EffectCraft 0.17's audio-on export produced a +2.14 dBTP overshoot in this case.
 for name,master,picture in [('配音字幕版','master-voice.wav',caption_picture),('无字幕配音版','master-voice.wav',P.parent/'FORM_形的发生_画面.mp4'),('纯音乐版','master-music.wav',P.parent/'FORM_形的发生_画面.mp4')]:
  subprocess.run(['ffmpeg','-v','error','-y','-i',str(picture),'-i',str(P/'audio'/master),'-map','0:v:0','-map','1:a:0','-c:v','copy','-c:a','aac','-b:a','320k','-movflags','+faststart',str(P.parent/('FORM_形的发生_'+name+'.mp4'))],check=True)
 caption_picture.unlink()
