from pathlib import Path
import subprocess
from PIL import Image,ImageDraw
P=Path(__file__).resolve().parent.parent
movie=P/'AUREL_v2.1_让想象有形_配音字幕版.mp4'
def sheet(times,name,cols=4,width=480):
 dest=P/'review'/name;dest.mkdir(exist_ok=True)
 images=[]
 for i,t in enumerate(times):
  out=dest/('%03d.png'%i)
  subprocess.run(['ffmpeg','-v','error','-y','-ss',str(t),'-i',str(movie),'-frames:v','1',str(out)],check=True)
  images.append((out,t))
 h=round(width*9/16);canvas=Image.new('RGB',(cols*width,((len(images)+cols-1)//cols)*(h+26)),'#f7f5ee');d=ImageDraw.Draw(canvas)
 for i,(f,t)in enumerate(images):
  x=i%cols*width;y=i//cols*(h+26);canvas.paste(Image.open(f).convert('RGB').resize((width,h)),(x,y));d.text((x+12,y+h+6),f'{t:05.2f}s',fill='#091e91')
 canvas.save(P/'review'/(name+'.jpg'),quality=92)
sheet([.0,1.1,2.4,3.5,4.6,5.4,6.3,7.5,8.4,9.6,10.85,11.7,12.8,14,14.8,15.9],'full-film-contact')
sheet([4.5,4.6,4.7,4.8,4.95,5.1,5.3,5.6],'join-unfold-graphic',4,480)
sheet([10.65,10.8,10.9,11.0,11.1,11.2,11.3,11.5],'join-graphic-hero',4,480)
