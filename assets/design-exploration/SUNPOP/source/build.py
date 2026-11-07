from pathlib import Path
import subprocess,json,argparse,os
P=Path(__file__).resolve().parent;OUT=P.parent
CLI=str(Path.home()/'Library/Application Support/EffectCraft/bin/effectcraft-cli')
ap=argparse.ArgumentParser();ap.add_argument('--preview',action='store_true');ap.add_argument('--stills',action='store_true');ap.add_argument('--render',action='store_true');ap.add_argument('--times',default='.9,2.8,3.8,6.5,9.6,12.9,15.8,19.5,22.5');a=ap.parse_args()
D=json.loads((P/'design/design-system.json').read_text());plates={}
for n,f in [('open',36),('hero',95),('pack',105)]:
 q=P/'blender'/(n+'.mov')
 if a.stills or not q.exists():
  q=P/'blender/previews'/(n+'.png')
 plates[n]=str(q)
parts=['var ROOT='+json.dumps(str(P))+';','var D='+json.dumps(D,ensure_ascii=False)+';','var PLATES='+json.dumps(plates)+';']
for n in ['native_helpers','advanced_helpers','sunpop']:parts.append((P/'effectcraft'/(n+'.jsx')).read_text())
timeline=P/'audio/timeline.json'
if timeline.exists():
 parts+=['var CAPTIONS='+json.dumps(json.loads(timeline.read_text())['captions'],ensure_ascii=False)+';', '''(function(){var M=MuseNative,pic=null;for(var i=1;i<=app.project.numItems;i++)if(app.project.item(i).name==='SUNPOP / Picture')pic=app.project.item(i);
 for(var v=0;v<3;v++){var c=M.comp(v===0?'SUNPOP / Voice':v===1?'SUNPOP / 中文字幕':'SUNPOP / Music',1920,1080,24,30);M.setup(c.layers.add(pic),'Native SUNPOP picture',[960,540],0,24);var f=v===2?'master-music.wav':'master-voice.wav';M.setup(c.layers.add(app.project.importFile(new ImportOptions(new File(ROOT+'/audio/'+f)))),'Audio / '+f,null,0,24);
 if(v===1)for(var j=0;j<CAPTIONS.length;j++){var q=CAPTIONS[j],l=M.text(c,'Caption / '+q.id,q.text,33,M.rgb(q.start>10&&q.start<14.7?'FFF3D9':'1936A8'),[960,1023],'FOLDHan-Bold',Math.floor(q.start*30)/30,Math.ceil(q.end*30)/30);l.motionBlur=false;}
 }})();''']
script=P/'effectcraft/SUNPOP-build.jsx';script.write_text('\n'.join(parts));project=P/('SUNPOP-styleframes.ecproj'if a.stills else'SUNPOP.ecproj')
subprocess.run([CLI,'--empty','script',str(script),'--save-as',str(project),'--json'],check=True)
d=json.loads(project.read_text())
if d['settings']['bit_depth']=='Bpc8':subprocess.run([CLI,'--project',str(project),'exec','file.cycleBitDepth','--save','--json'],check=True);d=json.loads(project.read_text())
for key,it in d['items'].items():
 if it['kind']['type']=='Footage':it['kind']['path']=os.path.relpath(it['kind']['path'],P)
 if it['name']==('SUNPOP / 中文字幕'if timeline.exists()else'SUNPOP / Picture'):d['activeComp']=int(key);d['openComps']=[int(key)]
project.write_text(json.dumps(d,ensure_ascii=False,separators=(',',':')))
if a.preview:
 for t in a.times.split(','):subprocess.run([CLI,'--project',str(project),'--gpu','render-frame','--comp','SUNPOP / Picture','--time',t,'--max-side','1920','--out',str(OUT/'review'/('frame-%04d.png'%round(float(t)*10))),'--json'],check=True)
if a.render:
 assert timeline.exists()
 assert all(str(v).endswith('.mov') for v in plates.values()),'Final requires real animated plates'
 for c,n in [('SUNPOP / Picture','SUNPOP_把今天打开_画面.mp4'),('SUNPOP / 中文字幕','.caption-picture.mp4')]:subprocess.run([CLI,'--project',str(project),'--gpu','render','--comp',c,'--out',str(OUT/n),'--format','h264','--fps','30','--quality','best','--bitrate','35000','--audio','off','--progress','--json'],check=True)
 for name,master,pic in [('配音字幕版','master-voice.wav','.caption-picture.mp4'),('无字幕配音版','master-voice.wav','SUNPOP_把今天打开_画面.mp4'),('纯音乐版','master-music.wav','SUNPOP_把今天打开_画面.mp4')]:
  subprocess.run(['ffmpeg','-v','error','-y','-i',str(OUT/pic),'-i',str(P/'audio'/master),'-map','0:v:0','-map','1:a:0','-c:v','copy','-c:a','aac','-b:a','320k','-movflags','+faststart',str(OUT/('SUNPOP_把今天打开_'+name+'.mp4'))],check=True)
 (OUT/'.caption-picture.mp4').unlink()
