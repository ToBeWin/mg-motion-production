"""Preserve absolute cubic Bezier SVG geometry for native EffectCraft shapes.

Intentionally limited to M/C/Z and path-level solid strokes. Reject other SVGs;
this is not a general Illustrator/SVG importer.
"""
from pathlib import Path
import json,re,xml.etree.ElementTree as ET,argparse
def convert(path):
 root=ET.fromstring(Path(path).read_text());paths=[]
 for n in root.iter():
  if n.get('transform'):raise ValueError('Flatten transforms in the design tool first')
 for n in root.iter('{http://www.w3.org/2000/svg}path'):
  if n.get('fill','none')!='none':raise ValueError('This adapter expects stroked contours')
  color=n.get('stroke','')
  if not re.fullmatch(r'#[0-9a-fA-F]{6}',color):raise ValueError('Only solid RGB strokes supported')
  t=re.findall(r'[A-Za-z]|[-+]?(?:\d*\.\d+|\d+)(?:[Ee][-+]?\d+)?',n.attrib['d']);i=0;vs=[];ins=[];outs=[];closed=False
  while i<len(t):
   cmd=t[i];i+=1
   if cmd=='M':
    if vs:raise ValueError('Compound paths must be separated first')
    x,y=map(float,t[i:i+2]);i+=2;vs.append([x,y]);ins.append([0,0]);outs.append([0,0])
   elif cmd=='C':
    x1,y1,x2,y2,x,y=map(float,t[i:i+6]);i+=6;px,py=vs[-1];outs[-1]=[x1-px,y1-py];vs.append([x,y]);ins.append([x2-x,y2-y]);outs.append([0,0])
   elif cmd=='Z':closed=True
   else:raise ValueError('Unsupported SVG operator '+cmd)
  if closed and vs[-1]==vs[0]:ins[0]=ins.pop();vs.pop();outs.pop()
  paths.append({'name':n.get('data-name',n.get('id','path')),'vertices':vs,'inTangents':ins,'outTangents':outs,'closed':closed,'stroke':color,'strokeWidth':float(n.get('stroke-width','1'))})
 if not paths:raise ValueError('No supported paths')
 return paths
if __name__=='__main__':
 a=argparse.ArgumentParser();a.add_argument('svg');a.add_argument('out');args=a.parse_args();Path(args.out).write_text(json.dumps(convert(args.svg),indent=2));print(args.out)
