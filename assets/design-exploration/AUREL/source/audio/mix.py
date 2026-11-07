from pathlib import Path
import subprocess,sys
P=Path(__file__).resolve().parent
subprocess.run([sys.executable,str(P/"mix_v21.py"),"--music","minimax-aurel-v21-chamber.wav","--out",str(P)],check=True)
