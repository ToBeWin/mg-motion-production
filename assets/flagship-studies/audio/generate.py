"""Call the user's already installed local audio tools; never download models."""
from pathlib import Path
import argparse,json,subprocess,sys
P=Path(__file__).resolve().parent
ap=argparse.ArgumentParser();ap.add_argument('mode',choices=['music','voice']);ap.add_argument('--case',default='all',choices=['all','trace','orbit','shift']);ap.add_argument('--out',type=Path,default=P/'raw');ap.add_argument('--voice-reference',type=Path);ap.add_argument('--tts-router',type=Path,default=Path.home()/'.codex/skills/local-tts-router/scripts/local_tts.py');ap.add_argument('--music-router',type=Path,default=Path.home()/'.codex/skills/minimax-music3-local/scripts/generate_music.py');a=ap.parse_args()
directions=json.loads((P/'audio-direction.json').read_text());a.out.mkdir(parents=True,exist_ok=True)
if a.mode=='voice' and (not a.voice_reference or not a.voice_reference.is_file()):ap.error('Supply an authorized or synthetic reference with --voice-reference.')
for kind in directions['cases'] if a.case=='all' else [a.case]:
 case=directions['cases'][kind]
 if a.mode=='music':
  if 'music_prompt' not in case:continue
  dest=a.out/'minimax'/f'{kind}.wav';dest.parent.mkdir(parents=True,exist_ok=True)
  if dest.exists():raise SystemExit(f'Preserve existing take: {dest}. Use a new --out directory to regenerate.')
  lyrics=a.out/'instrumental.txt';lyrics.write_text('[instrumental]\n')
  cmd=[sys.executable,str(a.music_router),'--prompt',case['music_prompt'],'--lyrics-file',str(lyrics),'--duration',str(case['music_duration']),'--steps','30','--output',str(dest)]
  with dest.with_suffix('.log').open('w') as log:subprocess.run(cmd,stdout=log,stderr=subprocess.STDOUT,check=True)
 else:
  for line in case['lines']:
   dest=a.out/'indextts2'/kind/(line['id']+'.wav');dest.parent.mkdir(parents=True,exist_ok=True)
   if dest.exists():raise SystemExit(f'Preserve existing take: {dest}. Use a new --out directory to regenerate.')
   cmd=[sys.executable,str(a.tts_router),'indextts2','--reference-audio',str(a.voice_reference),'--text',line['text'],'--output',str(dest),'--seed','20261027','--emotion-text',case['emotion'],'--timeout','900']
   with dest.with_suffix('.launcher.log').open('w') as log:subprocess.run(cmd,stdout=log,stderr=subprocess.STDOUT,check=True)
 print(kind,a.mode,'completed',flush=True)
