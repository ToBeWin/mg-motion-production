"""Copy/build the native component kit into a fresh directory; optionally render."""
from pathlib import Path
import argparse,os,shutil,subprocess,json
P=Path(__file__).resolve().parent
ap=argparse.ArgumentParser();ap.add_argument('--out',type=Path,required=True);ap.add_argument('--render',action='store_true');ap.add_argument('--cli',default=os.getenv('EFFECTCRAFT_CLI') or str(Path.home()/'Library/Application Support/EffectCraft/bin/effectcraft-cli'));a=ap.parse_args()
out=a.out.expanduser().resolve()
if out.exists() and (not out.is_dir() or any(out.iterdir())):ap.error('Use a new or empty output directory; existing work is preserved.')
if not Path(a.cli).is_file():ap.error('EffectCraft CLI not found; pass --cli to a verified installation.')
out.mkdir(parents=True,exist_ok=True)
names=['native_helpers.jsx','advanced_helpers.jsx','modules.jsx','demo.jsx']
for name in names:shutil.copy2(P/name,out/name)
(out/'BUILD.jsx').write_text('\n'.join((P/name).read_text() for name in names))
project=out/'COMPONENTS.ecproj'
subprocess.run([a.cli,'--empty','--gpu','script',str(out/'BUILD.jsx'),'--save-as',str(project),'--json'],check=True)
if a.render:
 subprocess.run([a.cli,'--project',str(project),'--gpu','render','--comp','MG_SCENARIO_COMPONENTS','--out',str(out/'组件验证.mp4'),'--format','h264','--fps','30','--resolution','full','--quality','best','--bitrate','12000','--audio','off','--progress','--json'],check=True)
print(json.dumps(dict(project=str(project),rendered=a.render,scope='Native component verification, not commercial film acceptance'),ensure_ascii=False))
