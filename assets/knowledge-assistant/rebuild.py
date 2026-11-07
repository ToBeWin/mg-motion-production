#!/usr/bin/env python3
"""Copy the TRACE example into a fresh folder and rebuild its native project."""
import argparse
from pathlib import Path
import shutil
import subprocess
import sys

P=Path(__file__).resolve().parent
p=argparse.ArgumentParser(description=__doc__)
p.add_argument('--out',required=True,type=Path,help='New or empty source folder')
p.add_argument('--render',action='store_true')
p.add_argument('--regenerate-audio',action='store_true',help='Requires macOS Swift, system sound bank, NumPy and ffmpeg')
p.add_argument('--cli',help='EffectCraft CLI path')
a=p.parse_args();out=a.out.expanduser().resolve()
if out==P or P in out.parents or out in P.parents:p.error('Choose a new folder outside this source tree.')
if out.exists() and (not out.is_dir() or any(out.iterdir())):p.error('Output must be new or empty; existing work is preserved.')
if out.exists():out.rmdir()
shutil.copytree(P,out,ignore=shutil.ignore_patterns('*.ecproj','BUILD.jsx','__pycache__','*.pyc','.DS_Store','pad.wav','bass.wav','piano.wav','premaster.wav','qa'))
if a.regenerate_audio:subprocess.run([sys.executable,str(out/'audio/compose.py')],check=True)
cmd=[sys.executable,str(out/'build.py')]
if a.render:cmd.append('--render')
if a.cli:cmd.extend(['--cli',a.cli])
subprocess.run(cmd,check=True)
subprocess.run([sys.executable,str(out/'validate.py')],check=True)
