#!/usr/bin/env python3
"""Copy the three authored films to a fresh source folder and build with EffectCraft."""
import argparse
from pathlib import Path
import shutil
import subprocess
import sys

P = Path(__file__).resolve().parent
parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('--out', required=True, type=Path, help='New or empty source folder')
parser.add_argument('--render', action='store_true')
parser.add_argument('--only', choices=['api', 'brand', 'service'], help='Render only this film; the editable project contains all three')
parser.add_argument('--regenerate-audio', action='store_true', help='Requires macOS Swift, host sound bank, NumPy and ffmpeg')
parser.add_argument('--cli', help='EffectCraft CLI path; otherwise EFFECTCRAFT_CLI or the macOS default')
args = parser.parse_args()
out = args.out.expanduser().resolve()
if out == P or P in out.parents or out in P.parents:
    parser.error('Choose a new directory outside this source tree.')
if out.exists() and (not out.is_dir() or any(out.iterdir())):
    parser.error('Output must be new or empty. Existing work is preserved.')
if out.exists():
    out.rmdir()
shutil.copytree(P, out, ignore=shutil.ignore_patterns('*.ecproj', 'BUILD.jsx', '__pycache__', '*.pyc', '.DS_Store', 'bed.wav', 'bass.wav', 'lead.wav', 'premaster.wav', 'qa'))
if args.regenerate_audio:
    subprocess.run([sys.executable, str(out/'audio/compose.py')], check=True)
cmd = [sys.executable, str(out/'build.py')]
if args.render:
    cmd.append('--render')
if args.only:
    cmd.extend(['--only', args.only])
if args.cli:
    cmd.extend(['--cli', args.cli])
subprocess.run(cmd, check=True)
