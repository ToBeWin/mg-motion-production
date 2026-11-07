"""Export native transparent graphics as ProRes 4444, plus a stage hold frame."""
from pathlib import Path
import os,subprocess
P=Path(__file__).resolve().parent;out=P.parent/'extras';out.mkdir(exist_ok=True)
cli=os.environ.get('EFFECTCRAFT_CLI',str(Path.home()/'Library/Application Support/EffectCraft/bin/effectcraft-cli'))
for id in ['identity-sting','broadcast-package']:
 subprocess.run([cli,'--project',str(P/'projects'/(id+'.ecproj')),'--gpu','render','--comp','Alpha / '+id,'--out',str(out/(id+'_alpha_ProRes4444.mov')),'--format','prores','--prores','4444','--channels','rgba','--audio','off','--json'],check=True)
subprocess.run([cli,'--project',str(P/'projects/stage-opening.ecproj'),'--gpu','render-frame','--comp','Coverage / stage-opening','--time','13.5','--out',str(out/'NEXT_stage_hold.png'),'--json'],check=True)
