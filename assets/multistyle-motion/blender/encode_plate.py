"""Encode the 120 Cycles poses and a final hold as a reusable alpha plate."""
from pathlib import Path
import subprocess
P = Path(__file__).resolve().parent
missing = [i for i in range(1,121) if not (P/'frames'/f'{i:04d}.png').is_file()]
if missing:
    raise RuntimeError(f'Render the Cycles poses first; {len(missing)} files are missing.')
out = P.parent/'media/hardware-control.mov'
subprocess.run(['ffmpeg','-y','-v','error','-framerate','30','-i',str(P/'frames/%04d.png'),
    '-vf','tpad=stop_mode=clone:stop_duration=9.34,scale=in_range=full:out_range=tv:out_color_matrix=bt709,format=yuva444p10le',
    '-t','13.333333','-c:v','prores_ks','-profile:v','4','-vendor','apl0',
    '-color_primaries','bt709','-colorspace','bt709','-movflags','+faststart',str(out)],check=True)
print(out)
