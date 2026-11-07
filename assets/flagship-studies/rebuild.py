"""Create a new editable project copy without replacing an existing directory."""
from pathlib import Path
import argparse,shutil,subprocess,sys
P=Path(__file__).resolve().parent
ap=argparse.ArgumentParser();ap.add_argument('--out',type=Path,required=True);ap.add_argument('--render',action='store_true');ap.add_argument('--case',choices=['trace','orbit','shift','all'],default='all');ap.add_argument('--cpu',action='store_true');a=ap.parse_args();dest=a.out.expanduser().resolve()
if dest.exists():ap.error('Destination already exists; use a new directory.')
shutil.copytree(P,dest,ignore=shutil.ignore_patterns('frames','previews','*.blend1','__pycache__','*-build.jsx','*.ecproj','qa'))
cmd=[sys.executable,str(dest/'build.py'),'--case',a.case]
if a.render:cmd+=['--render']
if a.cpu:cmd+=['--cpu']
subprocess.run(cmd,check=True)
if a.case=='all':
 cmd=[sys.executable,str(dest/'build_styles.py')]
 if a.render:cmd+=['--render']
 if a.cpu:cmd+=['--cpu']
 subprocess.run(cmd,check=True)
print(dest)
