from pathlib import Path
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.boundsPen import BoundsPen
import math,json,subprocess
P=Path(__file__).resolve().parent
F=P.parent/'fonts'
fonts={k:TTFont(F/v) for k,v in {'display':'FOLDDisplay-ExtraBold.ttf','han':'FOLDHan-Bold.ttf','regular':'FOLDHan-Regular.ttf'}.items()}
C={'blue':'163FE8','orange':'FF6B19','cream':'FFF3D9','yellow':'FFCE44','ink':'1936A8'}
def text(t,x,y,size,color,font='display',width=None):
 f=fonts[font];gs=f.getGlyphSet();cm=f.getBestCmap();units=f['head'].unitsPerEm;advance=0;paths=[];lo=1e9;hi=-1e9
 for ch in t:
  name=cm.get(ord(ch),'.notdef');g=gs[name];p=SVGPathPen(gs);g.draw(p);b=BoundsPen(gs);g.draw(b)
  if b.bounds:lo=min(lo,b.bounds[1]);hi=max(hi,b.bounds[3])
  paths.append(f'<path transform="translate({advance} 0)" d="{p.getCommands()}"/>');advance+=g.width
 sy=size/units;sx=width/advance if width else sy
 return f'<g fill="#{color}" transform="translate({x-advance*sx/2} {y+(hi+lo)*sy/2}) scale({sx} {-sy})">'+''.join(paths)+'</g>'
def circle(x,y,r,c):return f'<circle cx="{x}" cy="{y}" r="{r}" fill="#{c}"/>'
def sun(x,y,r,c,core=True):
 a=[]
 if core:a.append(circle(x,y,r*.60,c))
 for i in range(12):
  ang=i*math.tau/12;cx=x+math.cos(ang)*r*.88;cy=y+math.sin(ang)*r*.88
  a.append(f'<rect x="{cx-r*.13}" y="{cy-r*.06}" width="{r*.26}" height="{r*.12}" rx="{r*.06}" fill="#{c}" transform="rotate({i*30} {cx} {cy})"/>')
 return ''.join(a)
def wrap(w,h,parts):return f'<svg xmlns="http://www.w3.org/2000/svg" width="{w}" height="{h}" viewBox="0 0 {w} {h}">'+''.join(parts)+'</svg>'
def bg(w,h,c):return f'<rect width="{w}" height="{h}" fill="#{c}"/>'
for variant,base,fg,accent in [('blue',C['blue'],C['cream'],C['orange']),('orange',C['orange'],C['cream'],C['blue']),('cream',C['cream'],C['blue'],C['orange'])]:
 a=[bg(4096,2867,base)]
 a+=[sun(2048,460,340,accent),text('SUN',2048,1125,820,fg,width=1370),text('POP',2048,1750,820,fg,width=1370)]
 a+=[text('放晴',2048,2265,292,fg,'han'),text('CITRUS SODA',2048,2578,115,fg),text('柑橘气泡饮',2048,2724,86,fg,'regular')]
 a+=[circle(1220,1850,87,accent),circle(2870,1060,68,accent),circle(2960,2170,110,fg),circle(3040,1950,38,accent)]
 for y,line in [(900,'OPEN'),(1080,'A LITTLE'),(1260,'SUNSHINE.')]:a.append(text(line,570,y,132,fg,width=730))
 a+=[sun(570,1640,220,accent),text('把今天，打开。',570,2100,90,fg,'han',790),text('SUNPOP / 330 ml',3500,2470,74,fg)]
 (P/f'label-{variant}.svg').write_text(wrap(4096,2867,a))
poster=[bg(1920,1080,C['orange'])]
poster+=[text('OPEN',960,330,470,C['cream'],width=1680),text('SUNSHINE.',960,760,410,C['blue'],width=1700)]
poster+=[sun(1720,158,90,C['blue']),text('放晴 / SUNPOP',288,70,35,C['cream'],'han'),text('把今天，打开。',1592,1020,34,C['cream'],'han')]
(P/'brand-poster.svg').write_text(wrap(1920,1080,poster))
(P/'sun.svg').write_text(wrap(1000,1000,[sun(500,500,475,C['orange'])]))
(P/'wordmark.svg').write_text(wrap(1800,420,[text('SUNPOP',900,210,490,C['blue'],width=1790)]))
brief={'brand':{'zh':'放晴','en':'SUNPOP','status':'Original fictional citrus soda brand; speculative advertising concept'},'colors':C,'duration':24,'fps':30,'design_principle':'One circular motif becomes sun, bubbles, aperture and transition. Typography and pack interact through occlusion and matched movement.','motion':['Metal is rigid; no can squash','Graphic sun and bubbles are elastic','Every loud build resolves to a clean packshot'],'references':[{'url':'https://wearecollins.com/case-studies/musegroup/','learned':'A modular brand system with coherent motion identity and music-reactive type. No copied assets or layout.'}],'copy':['把今天，打开。','热烈一点。','再热烈一点。','快乐冒个泡。']}
(P/'design-system.json').write_text(json.dumps(brief,ensure_ascii=False,indent=2))
cli=str(Path.home()/'Library/Application Support/VectorCraft/bin/vectorcraft-cli')
for n in ['label-blue','label-orange','label-cream','brand-poster','sun','wordmark']:
 subprocess.run([cli,'run','--in',str(P/(n+'.svg')),'--export',str(P/(n+'.vectorcraft')),'--export',str(P/(n+'.png'))],check=True)
