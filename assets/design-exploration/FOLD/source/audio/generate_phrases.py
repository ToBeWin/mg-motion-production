from pathlib import Path
import subprocess,json
P=Path(__file__).resolve().parent
lines=['每个作品，都从一个想法开始。','把灵感，变成看得见的设计。','每一种色彩，都可以随心而变。','一个画面，自由展开。','让好设计，走进每一种尺寸。','让灵感，展开。']
router=Path.home()/'.codex/skills/local-tts-router/scripts/local_tts.py'
ref=P/'reference-approved.wav'
for i,text in enumerate(lines,1):
 p=P/('take-%02d.wav'%i)
 if not p.exists():
  subprocess.run(['python3',str(router),'indextts2','--text',text,'--output',str(p),'--reference-audio',str(ref),'--seed',str(310+i),'--emotion-vector','.35','0','0','0','0','0','0','.65','--max-text-tokens','120','--interval-silence','150'],check=True)
 d=json.loads(p.with_suffix('.json').read_text())
 assert d['process_exited'] and d['network_blocked']
 print(i,text,d['duration_seconds'],flush=True)
