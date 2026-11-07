from pathlib import Path
import subprocess,json,argparse,os
P=Path(__file__).resolve().parent;OUT=P.parent
CLI=str(Path.home()/'Library/Application Support/EffectCraft/bin/effectcraft-cli')
ap=argparse.ArgumentParser();ap.add_argument('--preview',action='store_true');ap.add_argument('--render',action='store_true');ap.add_argument('--times',default='1.5,4.8,5.9,8.5,10.7,14.8');a=ap.parse_args()
D=json.loads((P/'design/design-system.json').read_text());plates={};projected={}
for n,fr in [('unfold',144),('hero',120)]:
 q=P/'blender'/(n+'.mov')
 if not q.exists():q=P/'blender'/(n+'-frames')/('%04d.png'%fr)
 assert q.exists(),q
 plates[n]=str(q);projected[n]=json.loads((P/'blender'/(n+'-projected.json')).read_text())
parts=['var ROOT='+json.dumps(str(P))+';var D='+json.dumps(D,ensure_ascii=False)+';var PLATES='+json.dumps(plates)+';var PROJECTED='+json.dumps(projected)+';']
for n in ['native_helpers','advanced_helpers','sculpture']:parts.append((P/'effectcraft'/(n+'.jsx')).read_text())
timeline=P/'audio/timeline.json'
if timeline.exists():
 parts+=['var CAPTIONS='+json.dumps(json.loads(timeline.read_text())['captions'],ensure_ascii=False)+';', '''(function(){var M=MuseNative,pic=null;for(var i=1;i<=app.project.numItems;i++)if(app.project.item(i).name==='AUREL v2 / Picture')pic=app.project.item(i);
 for(var v=0;v<3;v++){var c=M.comp(v===0?'AUREL v2 / Voice':v===1?'AUREL v2 / 中文字幕':'AUREL v2 / Music',1920,1080,16,30);M.setup(c.layers.add(pic),'Native picture',[960,540],0,16);var f=v===2?'master-music.wav':'master-voice.wav';M.setup(c.layers.add(app.project.importFile(new ImportOptions(new File(ROOT+'/audio/'+f)))),'Audio / '+f,null,0,16);
 if(v===1)for(var j=0;j<CAPTIONS.length;j++){var q=CAPTIONS[j],l=M.text(c,'Caption / '+q.id,q.text,32,M.rgb('091E91'),[330,1014],'FOLDHan-Regular',Math.floor(q.start*30)/30,Math.ceil(q.end*30)/30);l.motionBlur=false;}
 }})();''']
script=P/'effectcraft/AUREL-v2-build.jsx';script.write_text('\n'.join(parts));project=P/'AUREL-v2.ecproj'
subprocess.run([CLI,'--empty','script',str(script),'--save-as',str(project),'--json'],check=True)
d=json.loads(project.read_text())
if d['settings']['bit_depth']=='Bpc8':subprocess.run([CLI,'--project',str(project),'exec','file.cycleBitDepth','--save','--json'],check=True);d=json.loads(project.read_text())
for key,it in d['items'].items():
 if it['kind']['type']=='Footage':it['kind']['path']=os.path.relpath(it['kind']['path'],P)
 if it['name']==('AUREL v2 / 中文字幕'if timeline.exists()else'AUREL v2 / Picture'):d['activeComp']=int(key);d['openComps']=[int(key)]
project.write_text(json.dumps(d,ensure_ascii=False,separators=(',',':')))
if a.preview:
 for t in a.times.split(','):subprocess.run([CLI,'--project',str(project),'--gpu','render-frame','--comp','AUREL v2 / Picture','--time',t,'--max-side','1920','--out',str(OUT/'review'/('frame-%04d.png'%round(float(t)*10))),'--json'],check=True)
if a.render:
 assert timeline.exists();assert all(str(x).endswith('.mov')for x in plates.values()),'Final render needs continuous 3D plates'
 for comp,name in [('AUREL v2 / Picture','AUREL_v2.1_让想象有形_画面.mp4'),('AUREL v2 / 中文字幕','.caption-picture.mp4')]:subprocess.run([CLI,'--project',str(project),'--gpu','render','--comp',comp,'--out',str(OUT/name),'--format','h264','--fps','30','--quality','best','--bitrate','30000','--audio','off','--progress','--json'],check=True)
 for name,master,pic in [('配音字幕版','master-voice.wav','.caption-picture.mp4'),('无字幕配音版','master-voice.wav','AUREL_v2.1_让想象有形_画面.mp4'),('纯音乐版','master-music.wav','AUREL_v2.1_让想象有形_画面.mp4')]:
  subprocess.run(['ffmpeg','-v','error','-y','-i',str(OUT/pic),'-i',str(P/'audio'/master),'-map','0:v:0','-map','1:a:0','-c:v','copy','-c:a','aac','-b:a','320k','-movflags','+faststart',str(OUT/('AUREL_v2.1_让想象有形_'+name+'.mp4'))],check=True)
 (OUT/'.caption-picture.mp4').unlink()
