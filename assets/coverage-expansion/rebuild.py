"""Copy this authored collection into a new output directory, then build native projects."""
from pathlib import Path
import argparse,shutil,subprocess,sys
P=Path(__file__).resolve().parent
ap=argparse.ArgumentParser();ap.add_argument('--out',required=True);ap.add_argument('--only');ap.add_argument('--render',action='store_true');a=ap.parse_args();out=Path(a.out).expanduser().resolve()
if out.exists():ap.error('Choose a new directory; existing outputs are preserved.')
shutil.copytree(P,out,ignore=shutil.ignore_patterns('__pycache__','BUILD-*.jsx','*.pyc','*.blend1','frames'))
cmd=[sys.executable,str(out/'build.py'),'--replace']
if a.only:cmd+=['--only',a.only]
if a.render:cmd+=['--render']
subprocess.run(cmd,check=True)
print(out)
