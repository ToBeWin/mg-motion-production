"""Copy the complete v11 source into a fresh directory and build editable projects."""
from pathlib import Path
import argparse, shutil, subprocess, sys

P = Path(__file__).resolve().parent
ap = argparse.ArgumentParser(description=__doc__)
ap.add_argument('--out', type=Path, required=True, help='A NEW source directory')
ap.add_argument('--case', choices=['all', 'brand', 'hardware', 'agent'], default='all')
ap.add_argument('--render', action='store_true')
ap.add_argument('--remix', action='store_true', help='Recreate audio masters from the included selected takes')
args = ap.parse_args()
target = args.out.expanduser().resolve()
if target.exists():
    ap.error('Output already exists; choose a new directory to preserve earlier deliveries.')
if target.is_relative_to(P):
    ap.error('Output must be outside this source bundle.')
def ignored(directory, names):
    return [n for n in names if n in {'__pycache__', 'frames', 'qa'} or
            n.endswith(('.ecproj', '.blend1', '-build.jsx')) or n == 'preview.png']
shutil.copytree(P, target, ignore=ignored)
cases = ['brand', 'hardware', 'agent'] if args.case == 'all' else [args.case]
if args.remix:
    subprocess.run([sys.executable, str(target/'audio/mix.py'), '--case', args.case], check=True)
for case in cases:
    command = [sys.executable, str(target/'build.py'), '--case', case]
    if args.render:
        command.append('--render')
    subprocess.run(command, check=True)
print('Rebuilt in:', target)
