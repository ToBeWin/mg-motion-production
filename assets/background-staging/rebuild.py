#!/usr/bin/env python3
"""Build the light-stage revision without duplicating historical media assets."""
import argparse,shutil,subprocess,sys
from pathlib import Path
P=Path(__file__).resolve().parent
ap=argparse.ArgumentParser();ap.add_argument('--out',type=Path,required=True);ap.add_argument('--render',action='store_true');ap.add_argument('--only',choices=['agent','data']);ap.add_argument('--cli');a=ap.parse_args()
base=P.parent/'task-results';out=a.out.expanduser().resolve()
if not (base/'build.py').is_file():ap.error('Keep this folder alongside assets/task-results in the Skill package.')
if out==P or P in out.parents or out==base or base in out.parents:ap.error('Choose an output outside either example source folder.')
if out.exists() and (not out.is_dir() or any(out.iterdir())):ap.error('Use a new or empty output folder; existing work is preserved.')
if out.exists():out.rmdir()
shutil.copytree(base,out,ignore=shutil.ignore_patterns('TASK_RESULTS.ecproj','BUILD.jsx','__pycache__','*.pyc','qa','keys.wav','bass.wav','melody.wav','premaster.wav'))
for name in ['backgrounds.jsx','agent.jsx','data.jsx']:shutil.copy2(P/'effectcraft'/name,out/'effectcraft'/name)
for name in ['build.py','production-plan.json']:shutil.copy2(P/name,out/name)
shutil.copy2(P/'source-readme.md',out/'README.md')
cmd=[sys.executable,str(out/'build.py')]
if a.render:cmd.append('--render')
if a.only:cmd.extend(['--only',a.only])
if a.cli:cmd.extend(['--cli',a.cli])
subprocess.run(cmd,check=True)
