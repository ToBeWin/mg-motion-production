#!/usr/bin/env python3
"""Copy this example into a new project directory, then rebuild the native project."""
from pathlib import Path
import argparse, shutil, subprocess, sys

P=Path(__file__).resolve().parent
ap=argparse.ArgumentParser(description=__doc__)
ap.add_argument('--out',type=Path,required=True,help='New source directory; must not exist.')
ap.add_argument('--render',action='store_true')
ap.add_argument('--remix',action='store_true',help='Rebuild the 16-second audio edit from bundled selected takes.')
args=ap.parse_args();dest=args.out.expanduser().resolve()
if dest.exists() or dest==P or P in dest.parents:
    ap.error('Choose a new directory outside this source tree.')
def ignore(directory,names):
    return [n for n in names if n in ('__pycache__','qa','TRACE-build.jsx') or n.endswith(('.ecproj','.pyc'))]
shutil.copytree(P,dest,ignore=ignore)
if args.remix:
    subprocess.run([sys.executable,str(dest/'audio/mix.py')],check=True)
subprocess.run([sys.executable,str(dest/'build.py')]+(['--render'] if args.render else []),check=True)
print(dest/'TRACE-MOTION.ecproj')
