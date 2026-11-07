#!/usr/bin/env python3
"""Copy the feature-release example into a fresh folder, build, optionally render."""
import argparse,os,shutil,subprocess,sys
from pathlib import Path
P=Path(__file__).resolve().parent
ap=argparse.ArgumentParser();ap.add_argument('--out',type=Path,required=True);ap.add_argument('--render',action='store_true');ap.add_argument('--regenerate-audio',action='store_true');ap.add_argument('--cli');a=ap.parse_args()
out=a.out.expanduser().resolve()
if out==P or P in out.parents:ap.error('Choose an output outside the example source folder.')
if out.exists() and (not out.is_dir() or any(out.iterdir())):ap.error('Use a new or empty output folder; existing work is preserved.')
if out.exists():out.rmdir()
shutil.copytree(P,out,ignore=shutil.ignore_patterns('CLUE.ecproj','BUILD.jsx','__pycache__','*.pyc','qa','keys.wav','bass.wav','marimba.wav','premaster.wav'))
if a.regenerate_audio:
 subprocess.run([sys.executable,str(out/'audio/compose.py')],check=True)
 subprocess.run([sys.executable,str(out/'audio/compose.py'),'--vertical'],check=True)
cmd=[sys.executable,str(out/'build.py')]
if a.render:cmd.append('--render')
if a.cli:cmd.extend(['--cli',a.cli])
subprocess.run(cmd,check=True)
