#!/usr/bin/env python3
"""Build a native EffectCraft project. Render only when --render is supplied."""
import argparse,json,os,shutil,subprocess
from pathlib import Path
P=Path(__file__).resolve().parent
ap=argparse.ArgumentParser();ap.add_argument('--render',action='store_true');ap.add_argument('--replace-project',action='store_true',help='Explicitly replace this copy of CLUE.ecproj; otherwise existing edits are preserved.');ap.add_argument('--cli',default=os.environ.get('EFFECTCRAFT_CLI',str(Path.home()/'Library/Application Support/EffectCraft/bin/effectcraft-cli')));a=ap.parse_args()
if not Path(a.cli).is_file():ap.error('EffectCraft CLI not found; pass --cli.')
project=P/'CLUE.ecproj'
if project.exists() and not a.replace_project:ap.error('CLUE.ecproj already exists. Build in a fresh copy, or explicitly use --replace-project.')
jsx='var ASSET_ROOT='+json.dumps(str(P/'assets'))+';\n'
for name in ['native_helpers.jsx','advanced_helpers.jsx','film.jsx']:
 jsx+=(P/'effectcraft'/name).read_text()+'\n'
for comp_name,audio_path in [('CLUE v4 — Brand Color / 24s',P/'audio/master.wav')]:
 if audio_path.is_file():
  jsx+="for(var ci=1;ci<=app.project.numItems;ci++){var main=app.project.item(ci);if(main.name==="+json.dumps(comp_name)+"){var au=app.project.importFile(new ImportOptions(new File("+json.dumps(str(audio_path))+")));main.layers.add(au);break;}}\n"
(P/'effectcraft/BUILD.jsx').write_text(jsx)
subprocess.run([a.cli,'--empty','--gpu','script',str(P/'effectcraft/BUILD.jsx'),'--save-as',str(project),'--json'],check=True)
j=json.loads(project.read_text())
if j['settings']['bit_depth']=='Bpc8':
 subprocess.run([a.cli,'--project',str(project),'exec','file.cycleBitDepth','--save','--json'],check=True)
 j=json.loads(project.read_text())
if j['settings']['bit_depth']!='Bpc16':raise RuntimeError('Expected 16 bpc.')
for item in j['items'].values():
 k=item['kind']
 if k['type']=='Footage':k['path']=os.path.relpath(k['path'],P)
project.write_text(json.dumps(j,ensure_ascii=False,separators=(',',':')))
if a.render:
 subprocess.run([a.cli,'--project',str(project),'--gpu','render','--comp','CLUE v4 — Brand Color / 24s','--out',str(P.parent/'品牌色同步_v4_前后对照_1080p30.mp4'),'--format','h264','--fps','30','--resolution','full','--quality','best','--bitrate','22000','--audio','on','--progress','--json'],check=True)
print(json.dumps({'project':str(project),'rendered':a.render},ensure_ascii=False))
