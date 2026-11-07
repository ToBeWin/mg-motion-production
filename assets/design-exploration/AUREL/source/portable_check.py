"""Reopen the finished native sources after relocating them on this Mac."""
from pathlib import Path
import argparse, shutil, subprocess, json
import numpy as np
from PIL import Image

P=Path(__file__).resolve().parent
OUT=P.parent
ap=argparse.ArgumentParser()
ap.add_argument('--destination',required=True)
a=ap.parse_args()
dest=Path(a.destination).resolve()
assert not dest.exists(), 'Use a new destination to preserve earlier evidence.'
def omit(directory,names):
    return [n for n in names if n.endswith('-frames') or n.endswith('.blend1') or n=='__pycache__']
shutil.copytree(P,dest,ignore=omit)
cli=str(Path.home()/'Library/Application Support/EffectCraft/bin/effectcraft-cli')
checks=[]
for t,label in [('5.9','0059'),('14.8','0148')]:
    target=dest/('relocated-'+label+'.png')
    subprocess.run([cli,'--project',str(dest/'AUREL-v2.ecproj'),'--gpu','render-frame','--comp','AUREL v2 / Picture','--time',t,'--max-side','1920','--out',str(target),'--json'],check=True)
    original=np.asarray(Image.open(OUT/'review'/('frame-'+label+'.png')).convert('RGB'))
    relocated=np.asarray(Image.open(target).convert('RGB'))
    delta=np.abs(original.astype(int)-relocated.astype(int))
    checks.append({'time':float(t),'exact_rgb_match':bool(np.array_equal(original,relocated)),'max_rgb_error':int(delta.max())})
    assert np.array_equal(original,relocated), checks[-1]

inspect=dest/'inspect_relocated_blends.py'
inspect.write_text('''import bpy,json
from pathlib import Path
p=Path(__file__).resolve().parent
checks=[]
for shot in ['unfold','hero']:
 bpy.ops.wm.open_mainfile(filepath=str(p/'blender'/('AUREL-v2-'+shot+'.blend')))
 fonts=[]
 for font in bpy.data.fonts:
  if font.filepath and not font.filepath.startswith('<'):
   path=Path(bpy.path.abspath(font.filepath));assert path.is_file(),path
   fonts.append({'name':font.name,'path':font.filepath,'resolved_exists':True})
 checks.append({'shot':shot,'objects':len(bpy.data.objects),'frames':bpy.context.scene.frame_end,'fonts':fonts})
(p/'relocated-blend-checks.json').write_text(json.dumps(checks,indent=2))
''')
subprocess.run(['/Applications/Blender.app/Contents/MacOS/Blender','--background','--factory-startup','--python-exit-code','1','--python',str(inspect)],check=True)
report={'scope':'Same-host relocation test using the already installed fonts and CLIs; not a clean-machine compatibility claim. No still-image proxies or missing footage substitutions were used.','destination':str(dest),'effectcraft_frames':checks,'blender_projects':json.loads((dest/'relocated-blend-checks.json').read_text())}
(OUT/'review/portable-source-check.json').write_text(json.dumps(report,ensure_ascii=False,indent=2))
print(json.dumps(report,ensure_ascii=False,indent=2))
