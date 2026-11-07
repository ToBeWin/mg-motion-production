from pathlib import Path
import subprocess,json
P=Path(__file__).resolve().parent
router=Path.home()/'.codex/skills/local-tts-router/scripts/local_tts.py'
lines=['把今天，打开。','热烈一点，再热烈一点。','放晴，快乐冒个泡。']
(P/'script.json').write_text(json.dumps({'engine':'IndexTTS2','lines':lines,'direction':'Bright, spontaneous, smiling, short brand slogans'},ensure_ascii=False,indent=2))
for i,line in enumerate(lines,1):
 out=P/f'take-{i:02d}.wav'
 if out.exists():continue
 subprocess.run(['python3',str(router),'indextts2','--text',line,'--reference-audio',str(P/'reference-approved.wav'),'--output',str(out),'--seed',str(820+i),'--emotion-vector','.55','0','0','0','0','0','.15','.30','--max-text-tokens','120','--interval-silence','150'],check=True)
 d=json.loads(out.with_suffix('.json').read_text());assert d['process_exited'] and d['service_stopped'] and d['network_blocked']
 print('VOICE',i,d['duration_seconds'],flush=True)
prompt='Instrumental advertising music for a playful premium citrus soda brand. Bold sunshine electro funk, 128 BPM, tight live drums, punchy warm syncopated electric bass, crisp handclaps, bright staccato brass and quirky plucked synths. Cheerful confident summer energy, stylish rather than childish. Tiny opening pickup, immediate strong hook, rhythmic stop and go, build into a bigger second half, decisive final chord and short clean tail. No singing, no spoken words, no vocals, no ambient intro, no cinematic orchestral swell.'
(P/'music-structure.txt').write_text('[intro]\n[instrumental]\n[verse]\n[instrumental]\n[chorus]\n[instrumental]\n[outro]\n[instrumental]\n')
(P/'music-direction.json').write_text(json.dumps({'prompt':prompt,'duration_limit':32,'steps':30,'engine':'MiniMax Music3 local MLX q6'},indent=2))
out=P/'minimax-sunpop.wav'
if not out.exists():subprocess.run(['python3',str(Path.home()/'.codex/skills/minimax-music3-local/scripts/generate_music.py'),'--prompt',prompt,'--lyrics-file',str(P/'music-structure.txt'),'--duration','32','--steps','30','--output',str(out)],check=True)
