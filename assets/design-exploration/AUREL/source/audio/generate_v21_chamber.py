from pathlib import Path
import subprocess,os,json,time
P=Path(__file__).resolve().parent
prompt="Genre: contemporary minimalist chamber music, instrumental design-brand soundtrack. Warm acoustic piano in the middle and low register, restrained pizzicato cello pulse, sustained rich cello and viola chords. Simple spacious harmonic progression, few deliberate notes, long soft releases. Around 92 BPM with a gentle steady pulse and subtle forward motion. Calm confidence, clarity, precision, warm architectural space. A concise opening, a modest rise in the middle, and a resolved warm closing chord with a natural tail. Intimate studio recording, clean and balanced. Purely instrumental."
params={'prompt':prompt,'lyrics':'[instrumental]','engine':'MiniMax Music3 MLX q6','steps':30,'duration_limit':20,'seed':4139,'reason':'Alternative with piano and string texture to compare with the brighter mallet candidate for the original user timbre mismatch feedback.','musical_terms_are_request_not_verified_result':True}
(P/'music-v21-chamber-direction.json').write_text(json.dumps(params,ensure_ascii=False,indent=2))
output=P/'minimax-aurel-v21-chamber.wav';assert not output.exists()
env=os.environ.copy();env.update(HF_HUB_OFFLINE='1',TRANSFORMERS_OFFLINE='1')
start=time.time()
subprocess.run([str(Path.home()/'AI/minimax-music3-mlx/.venv/bin/python'),'-m','minimax_music3_mlx.generate','--weights',str(Path.home()/'AI-Models/minimax-music3/mlx/q6'),'--prompt',prompt,'--lyrics','[instrumental]','--duration','20','--steps','30','--seed','4139','--output',str(output)],check=True,env=env)
params.update(status='generated',seconds=time.time()-start);(P/'music-v21-chamber-direction.json').write_text(json.dumps(params,ensure_ascii=False,indent=2))
