#!/usr/bin/env python3
"""Copy a historical case plus the v4 overlay to a fresh, self-contained directory."""
import argparse,shutil,subprocess,sys
from pathlib import Path
P=Path(__file__).resolve().parent
ap=argparse.ArgumentParser();ap.add_argument('--case',required=True,choices=['brand-color','agent-data']);ap.add_argument('--out',type=Path,required=True);ap.add_argument('--render',action='store_true');ap.add_argument('--regenerate-audio',action='store_true');ap.add_argument('--cli');a=ap.parse_args()
kind='feature' if a.case=='brand-color' else 'task';base=P.parent/('feature-release' if kind=='feature' else 'task-results');overlay=P/kind;out=a.out.expanduser().resolve()
if not (base/'build.py').exists():ap.error('Keep the original case folders alongside this overlay in assets/.')
if out==P or P in out.parents or out==base or base in out.parents:ap.error('Use an output outside the example folders.')
if out.exists() and (not out.is_dir() or any(out.iterdir())):ap.error('Use a new or empty output folder; existing work is preserved.')
if out.exists():out.rmdir()
shutil.copytree(base,out,ignore=shutil.ignore_patterns('*.ecproj','BUILD.jsx','__pycache__','*.pyc','qa','keys.wav','bass.wav','melody.wav','marimba.wav','premaster.wav','vertical','vertical.jsx'))
shutil.copytree(overlay,out,dirs_exist_ok=True,ignore=shutil.ignore_patterns('__pycache__','*.pyc'))
if a.regenerate_audio:subprocess.run([sys.executable,str(out/'audio/compose.py')],check=True)
cmd=[sys.executable,str(out/'build.py')]
if a.render:cmd.append('--render')
if a.cli:cmd.extend(['--cli',a.cli])
subprocess.run(cmd,check=True)
