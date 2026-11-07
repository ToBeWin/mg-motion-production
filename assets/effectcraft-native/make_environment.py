"""Create an original equirectangular HDR studio-light map for native PBR reflections."""
from pathlib import Path
import numpy as np
P=Path(__file__).resolve().parent/'effectcraft/media';P.mkdir(exist_ok=True)
w,h=1024,512;y,x=np.mgrid[0:h,0:w];u=x/w;v=y/h
rgb=np.zeros((h,w,3),dtype=np.float32)+np.array([.028,.035,.045])
for cx,cy,sx,sy,power,color in [(.20,.36,.065,.23,4.2,[1,.95,.85]),(.58,.32,.12,.095,2.8,[.8,.91,1]),(.89,.47,.028,.20,3.8,[1,.82,.62]),(.44,.66,.17,.05,.75,[.64,.78,1])]:
 dx=np.minimum(abs(u-cx),1-abs(u-cx));dy=abs(v-cy)
 panel=np.exp(-((dx/sx)**8+(dy/sy)**8))
 rgb+=panel[:,:,None]*power*np.array(color)
mantissa,exponent=np.frexp(rgb.max(axis=2));scale=mantissa*256/np.maximum(rgb.max(axis=2),1e-20)
rgbe=np.zeros((h,w,4),np.uint8);rgbe[:,:,:3]=np.clip(rgb*scale[:,:,None],0,255).astype(np.uint8);rgbe[:,:,3]=(exponent+128).astype(np.uint8)
with (P/'studio.hdr').open('wb')as f:f.write(b'#?RADIANCE\nFORMAT=32-bit_rle_rgbe\n\n-Y 512 +X 1024\n');f.write(rgbe.tobytes())
print(P/'studio.hdr')
