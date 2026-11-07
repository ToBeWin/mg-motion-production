from pathlib import Path
import subprocess,json
P=Path(__file__).resolve().parent
router=Path.home()/'.codex/skills/local-tts-router/scripts/local_tts.py'
lines=['换个视角。','让想象，有形。']
(P/'script.json').write_text(json.dumps({'engine':'IndexTTS2','lines':lines,'direction':'Clear and confident Mandarin; two concise lines with deliberate space for graphic movement.'},ensure_ascii=False,indent=2))
for i,line in enumerate(lines,1):
 out=P/f'take-{i:02d}.wav'
 if out.exists():continue
 subprocess.run(['python3',str(router),'indextts2','--text',line,'--reference-audio',str(P/'reference-approved.wav'),'--output',str(out),'--seed',str(1410+i),'--emotion-vector','.16','0','0','0','0','0','.04','.80','--max-text-tokens','120','--interval-silence','160'],check=True)
 d=json.loads(out.with_suffix('.json').read_text());assert d['process_exited']and d['service_stopped']and d['network_blocked'];print('VOICE',i,d['duration_seconds'],flush=True)
prompt='Instrumental minimal electronica for a bold, precise design-studio motion graphics film. Clean tactile synthesizer plucks, rounded warm bass, tiny dry wood clicks, soft crisp electronic percussion, around 112 BPM. Confident, curious, intelligent and fresh, with elegant empty space between rhythmic gestures. Cool blue and ivory visual mood. A concise opening hook, two contrasting phrases, then a brief resolved musical ending. No vocals, no choir, no spoken word, no funk guitar, no brass, no cinematic boom, no dreamy piano ballad, no long intro or long ambient tail.'
(P/'music-direction.json').write_text(json.dumps({'prompt':prompt,'engine':'MiniMax Music3 MLX q6','steps':30,'duration_limit':20,'musical_terms_are_request_not_verified_result':True},indent=2))
out=P/'minimax-aurel-v2.wav'
if not out.exists():subprocess.run(['python3',str(Path.home()/'.codex/skills/minimax-music3-local/scripts/generate_music.py'),'--prompt',prompt,'--instrumental','--duration','20','--steps','30','--output',str(out)],check=True)
