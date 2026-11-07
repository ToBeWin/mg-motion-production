from pathlib import Path
import argparse,json,subprocess,os
P=Path(__file__).resolve().parent;O=P.parent
CLI=str(Path.home()/'Library/Application Support/EffectCraft/bin/effectcraft-cli')
p=argparse.ArgumentParser();p.add_argument('--variant',choices=['main','transfer'],default='main');p.add_argument('--render',action='store_true');p.add_argument('--preview',default='');p.add_argument('--skip-build',action='store_true');a=p.parse_args()
c=json.loads((P/(a.variant+'.json')).read_text());project=P/(a.variant+'.ecproj');prefix='Evidence / '+a.variant+' / '
if not a.skip_build:
 src='var ROOT='+json.dumps(str(P))+';var CFG='+json.dumps(c,ensure_ascii=False)+';\n'+'\n'.join((P/'effectcraft'/(n+'.jsx')).read_text() for n in ['native_helpers','advanced_helpers','evidence_library','film'])
 script=P/'effectcraft'/(a.variant+'-build.jsx');script.write_text(src)
 with (P/(a.variant+'-build.log')).open('w') as f:subprocess.run([CLI,'--empty','script',str(script),'--save-as',str(project),'--json'],check=True,stdout=f,stderr=f)
 d=json.loads(project.read_text())
 if d['settings']['bit_depth']=='Bpc8':
  subprocess.run([CLI,'--project',str(project),'exec','file.cycleBitDepth','--save','--json'],check=True,stdout=subprocess.DEVNULL);d=json.loads(project.read_text())
 for it in d['items'].values():
  if it['kind']['type']=='Footage':it['kind']['path']=os.path.relpath(it['kind']['path'],P)
 project.write_text(json.dumps(d,ensure_ascii=False,separators=(',',':')))
if a.preview:
 for t in a.preview.split(','):
  subprocess.run([CLI,'--project',str(project),'--gpu','render-frame','--comp',prefix+'Delivery','--time',t,'--max-side','1920','--out',str(O/'review'/f'{a.variant}-{float(t):06.2f}.png'),'--json'],check=True,stdout=subprocess.DEVNULL)
if a.render:
 with (P/(a.variant+'-render.log')).open('w') as f:subprocess.run([CLI,'--project',str(project),'--gpu','render','--comp',prefix+'Picture','--out',str(O/(a.variant+'-picture.mp4')),'--format','h264','--fps','30','--quality','best','--bitrate','25000','--audio','off','--progress','--json'],check=True,stdout=f,stderr=f)
print(a.variant,'ready',flush=True)
