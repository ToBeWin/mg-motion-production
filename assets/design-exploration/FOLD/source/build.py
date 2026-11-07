from pathlib import Path
import json,subprocess,argparse,os
P=Path(__file__).resolve().parent
CLI=os.environ.get('EFFECTCRAFT_CLI',str(Path.home()/'Library/Application Support/EffectCraft/bin/effectcraft-cli'))
ap=argparse.ArgumentParser();ap.add_argument('--render',action='store_true');ap.add_argument('--preview',action='store_true');a=ap.parse_args()
bg=P/'assets/studio-handoff.ecproj'
if not bg.exists():
 subprocess.run([CLI,'--empty','exec','file.import','--params',json.dumps({'paths':[str(P/'assets/FOLD-space.psd')],'importAs':'composition'}),'--save-as',str(bg),'--json'],check=True)
bgdata=json.loads(bg.read_text())
for it in bgdata['items'].values():
 if it['kind']['type']=='Footage' and os.path.isabs(it['kind']['path']):it['kind']['path']=os.path.relpath(it['kind']['path'],bg.parent)
bg.write_text(json.dumps(bgdata,ensure_ascii=False,separators=(',',':')))
parts=['var ROOT='+json.dumps(str(P))+';','var D='+json.dumps(json.loads((P/'design/design-system.json').read_text()),ensure_ascii=False,separators=(',',':'))+';']
for n in ['native_helpers','advanced_helpers','fold']:parts.append((P/'effectcraft'/(n+'.jsx')).read_text())
timeline=P/'audio/timeline.json'
if timeline.exists():
 parts.append('var CAPTIONS='+json.dumps(json.loads(timeline.read_text())['captions'],ensure_ascii=False)+';')
 parts.append('''
 (function(){var M=MuseNative,pic=null;for(var p=1;p<=app.project.numItems;p++)if(app.project.item(p).name==='FOLD / Picture')pic=app.project.item(p);if(!pic)throw new Error('Missing picture');
 for(var v=0;v<3;v++){var c=M.comp(v===0?'FOLD / Voice':v===1?'FOLD / 中文字幕':'FOLD / Music',1920,1080,32,30);M.setup(c.layers.add(pic),'Editable picture',[960,540],0,32);
 var f=v===2?'master-music.wav':'master-voice.wav';M.setup(c.layers.add(app.project.importFile(new ImportOptions(new File(ROOT+'/audio/'+f)))),'Sound / '+f,null,0,32);
 if(v===1)for(var i=0;i<CAPTIONS.length;i++){var q=CAPTIONS[i],l=M.text(c,'Caption / '+q.id,q.text,34,M.rgb('54496E'),[960,1030],'FOLDHan-Regular',Math.floor(q.start*30)/30,Math.ceil(q.end*30)/30);l.motionBlur=false;}
 }})();
 ''')
script=P/'effectcraft/FOLD-build.jsx';script.write_text('\n'.join(parts))
project=P/'FOLD.ecproj'
subprocess.run([CLI,'--project',str(bg),'script',str(script),'--save-as',str(project),'--json'],check=True)
d=json.loads(project.read_text())
if d['settings']['bit_depth']=='Bpc8':
 subprocess.run([CLI,'--project',str(project),'exec','file.cycleBitDepth','--save','--json'],check=True);d=json.loads(project.read_text())
for i in d['items'].values():
 if i['kind']['type']=='Footage':i['kind']['path']=os.path.relpath(i['kind']['path'],P)
for key,it in d['items'].items():
 if it['name']=='FOLD / 中文字幕':d['activeComp']=int(key);d['openComps']=[int(key)]
project.write_text(json.dumps(d,ensure_ascii=False,separators=(',',':')))
if a.preview:
 for t in [2.7,8.2,12.7,14.6,18.6,22.4,25.7,30.0]:
  subprocess.run([CLI,'--project',str(project),'--gpu','render-frame','--comp','FOLD / Picture','--time',str(t),'--max-side','1440','--out',str(P.parent/'review'/('frame-%04d.png'%round(t*10))),'--json'],check=True)
if a.render:
 for c,n in [('FOLD / Picture','FOLD_让灵感展开_画面.mp4'),('FOLD / 中文字幕','.FOLD-caption-picture.mp4')]:
  subprocess.run([CLI,'--project',str(project),'--gpu','render','--comp',c,'--out',str(P.parent/n),'--format','h264','--fps','30','--quality','best','--bitrate','35000','--audio','off','--progress','--json'],check=True)
 for n,master,pic in [('配音字幕版','master-voice.wav','.FOLD-caption-picture.mp4'),('无字幕配音版','master-voice.wav','FOLD_让灵感展开_画面.mp4'),('纯音乐版','master-music.wav','FOLD_让灵感展开_画面.mp4')]:
  subprocess.run(['ffmpeg','-v','error','-y','-i',str(P.parent/pic),'-i',str(P/'audio'/master),'-map','0:v:0','-map','1:a:0','-c:v','copy','-c:a','aac','-b:a','320k','-movflags','+faststart',str(P.parent/('FOLD_让灵感展开_'+n+'.mp4'))],check=True)
 (P.parent/'.FOLD-caption-picture.mp4').unlink()
