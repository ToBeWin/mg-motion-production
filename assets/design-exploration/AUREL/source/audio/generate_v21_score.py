from pathlib import Path
import subprocess,os,json,time
P=Path(__file__).resolve().parent
prompt="Genre: contemporary minimalist instrumental, organic acoustic-electronic brand soundtrack. Tempo: 100 BPM. Instruments: warm muted electric piano chords, low soft marimba notes, deep round bass and restrained brushed percussion. Smooth rounded timbres, spacious studio acoustics, elegant short reverb. A simple three-note motif with slow harmonic movement and breathing room. Understated, tactile, confident, sophisticated and optimistic. Clear gentle pulse supports geometric motion. Begin immediately, develop one small motif, resolve with a warm sustained chord and a soft natural decay. Purely instrumental."
params={'prompt':prompt,'lyrics':'[instrumental]','engine':'MiniMax Music3 MLX q6','steps':30,'duration_limit':20,'seed':4127,'reason':'User rejects prior score timbre and style; replace chiptune-like lead with warm rounded instrumental timbres and restrained pulse.','musical_terms_are_request_not_verified_result':True}
(P/'music-v21-direction.json').write_text(json.dumps(params,ensure_ascii=False,indent=2))
output=P/'minimax-aurel-v21-organic.wav';assert not output.exists()
env=os.environ.copy();env.update(HF_HUB_OFFLINE='1',TRANSFORMERS_OFFLINE='1')
start=time.time()
subprocess.run([str(Path.home()/'AI/minimax-music3-mlx/.venv/bin/python'),'-m','minimax_music3_mlx.generate','--weights',str(Path.home()/'AI-Models/minimax-music3/mlx/q6'),'--prompt',prompt,'--lyrics','[instrumental]','--duration','20','--steps','30','--seed','4127','--output',str(output)],check=True,env=env)
params.update(status='generated',seconds=time.time()-start);(P/'music-v21-direction.json').write_text(json.dumps(params,ensure_ascii=False,indent=2))
