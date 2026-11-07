from pathlib import Path
import subprocess,os,json
P=Path(__file__).resolve().parent
prompt="Genre: instrumental electronic, minimal IDM. Tempo: 120 BPM. Instruments: short plucked analog synthesizer, muted marimba, rounded sub bass, dry woodblock percussion and crisp electronic kick. Vocals: none, purely instrumental. Mood: precise, playful, bold, fresh, editorial design. Sparse syncopated rhythmic motif, clear beat, brief silent gaps, clean dry production. Structure: immediate rhythmic hook, a contrasting middle phrase, a short resolved ending."
lyrics="[instrumental]"
params={'prompt':prompt,'lyrics':lyrics,'engine':'MiniMax Music3 MLX q6','steps':30,'duration_limit':20,'seed':2029,'reason':'Initial score was flagged by two full-length listening reviews for singing; regenerate with a short positive instrumental caption.','musical_terms_are_request_not_verified_result':True}
(P/'music-revised-direction.json').write_text(json.dumps(params,indent=2))
output=P/'minimax-aurel-v2-r2.wav'
assert not output.exists(),'Do not overwrite a previous generation.'
env=os.environ.copy();env.update(HF_HUB_OFFLINE='1',TRANSFORMERS_OFFLINE='1')
subprocess.run([str(Path.home()/'AI/minimax-music3-mlx/.venv/bin/python'),'-m','minimax_music3_mlx.generate','--weights',str(Path.home()/'AI-Models/minimax-music3/mlx/q6'),'--prompt',prompt,'--lyrics',lyrics,'--duration','20','--steps','30','--seed','2029','--output',str(output)],check=True,env=env)
