"""Original FOLD visual assets. One geometry source for Figma and native motion."""
from pathlib import Path
import math,json,html
P=Path(__file__).resolve().parent
C={'paper':'F4F1E9','surface':'FEFDFA','ink':'2B2943','muted':'827D8E','line':'DAD6DE','lilac':'B8A6E2','citrus':'E2EFA7','orange':'EB6746','gold':'F6C85E','soft':'ECE8F2'}
def rect(name,x,y,w,h,color,r=0):return dict(type='rect',name=name,x=x,y=y,w=w,h=h,color=color,r=r)
def text(name,value,x,y,size,color='ink',font='display',weight=400,align='left'):
 return dict(type='text',name=name,text=value,x=x,y=y,size=size,color=color,font=font,weight=weight,align=align)
def path(name,v,color,ins=None,outs=None,closed=True,stroke=None,sw=0):
 return dict(type='path',name=name,x=0,y=0,vertices=v,inTangents=ins or [[0,0] for _ in v],outTangents=outs or [[0,0] for _ in v],closed=closed,color=color,stroke=stroke,sw=sw)
def circ(name,x,y,d,col):return dict(type='ellipse',name=name,x=x,y=y,w=d,h=d,color=col)
def logo(x,y,scale=1):
 polys=[([[-24,-28],[24,-28],[5,-9],[-24,-9]],'ink'),([[-24,-7],[5,-7],[24,12],[-5,12]],'orange'),([[-24,-5],[-5,14],[-5,31],[-24,12]],'lilac')]
 return [path('FOLD mark '+str(i),[[x+a*scale,y+b*scale] for a,b in vs],col) for i,(vs,col) in enumerate(polys)]
def bloom(cx,cy,scale=1):
 out=[]
 # Each leaf has an asymmetric convex edge and an inward fold. Not a stock icon.
 verts=[[0,34],[68,-183],[4,-248],[-46,-93]]
 ins=[[-23,-28],[0,76],[43,8],[-12,-64]];outs=[[36,-30],[0,-38],[-38,23],[15,52]]
 for i in range(8):
  angle=math.radians(i*45+12);co,si=math.cos(angle),math.sin(angle)
  def rot(v,shift=False):
   x,y=v;return [round((x*co-y*si)*scale+(cx if shift else 0),4),round((x*si+y*co)*scale+(cy if shift else 0),4)]
  n=path('Petal %02d'%i,[rot(v,True) for v in verts],'orange' if i%2==0 else 'gold',[rot(v) for v in ins],[rot(v) for v in outs]);n['petal']=i;out.append(n)
 out += [circ('Bloom aperture',cx,cy,62*scale,'citrus'),circ('Bloom seed',cx,cy,18*scale,'ink')]
 return out
def artwork(kind):
 if kind=='portrait':
  w,h=600,760;a=[rect('Canvas',300,380,w,h,'citrus')]+bloom(358,446,1.03)
  a += [text('Eyebrow','WEEKEND SESSIONS',36,39,14,weight=600),text('Title','晴野',36,135,103,font='han',weight=700),text('English','OPEN AIR',40,226,33,weight=800),rect('Rule',300,667,528,1.5,'ink'),text('Schedule','SAT / SUN',36,710,30,weight=800),text('Details','公园 · 音乐 · 好天气',568,712,17,font='han',align='right')]
 elif kind=='wide':
  w,h=1120,600;a=[rect('Canvas',560,300,w,h,'citrus')]+bloom(860,310,1.33)
  a += [text('Eyebrow','WEEKEND SESSIONS / 01',52,53,17,weight=600),text('Title','晴野',48,200,136,font='han',weight=700),text('English','OPEN AIR',54,337,52,weight=800),text('Schedule','SAT / SUN',54,519,34,weight=800),text('Details','公园 · 音乐 · 好天气',54,558,18,font='han')]
 else:
  w,h=1240,320;a=[rect('Canvas',620,160,w,h,'citrus')]+bloom(120,180,.83)
  a += [text('Eyebrow','WEEKEND SESSIONS',355,44,15,weight=600),text('Title','晴野',346,124,90,font='han',weight=700),text('English','OPEN AIR',355,228,37,weight=800),text('Details','公园 · 音乐 · 好天气',355,281,18,font='han'),text('Pass','PASS',1100,126,66,weight=800,align='center'),text('Number','WEEKEND / 01',1100,238,17,weight=600,align='center')]
  a += [circ('Perforation '+str(i),964,18+i*16,3.4,'ink') for i in range(18)]
 return dict(w=w,h=h,elements=a)
prompt=[rect('Prompt paper',560,84,1120,168,'surface',28),text('Prompt eyebrow','从一句想法开始',38,36,18,'muted','han'),text('Prompt content','为周末的公园音乐会，设计一套活动视觉。',38,98,33,'ink','han'),rect('Submit',1039,87,82,82,'ink',41),path('Submit arrow',[[1023,87],[1054,87],[1040,73],[1054,87],[1040,101]],None,closed=False,stroke='surface',sw=3)]
colorbar=[rect('Color ribbon',270,54,540,108,'surface',54),text('Color caption','主题',30,54,22,'muted','han')]
for i,col in enumerate(['lilac','orange','citrus','gold','ink']):colorbar.append(circ('Swatch '+col,140+i*78,54,52,col))
inspector=[text('Inspector heading','设计语言',0,25,23,font='han',weight=700),text('Theme label','01 / 色彩',0,91,16,'muted','han')]
for i,col in enumerate(['citrus','orange','gold','ink']):inspector.append(rect('Inspector '+col,24+i*60,143,47,47,col,11))
inspector += [text('Type label','02 / 字形',0,219,16,'muted','han'),text('Type sample','Aa 晴野',0,278,42,font='han',weight=700),rect('Inspector divider',114,328,228,1,'line'),text('Motion label','03 / 动作曲线',0,378,16,'muted','han'),rect('Curve well',114,462,228,110,'soft',13),path('Curve',[[22,495],[205,426]],None,[[0,0],[-85,0]],[[85,0],[0,0]],False,'ink',2.5),circ('Curve start',22,495,8,'orange'),circ('Curve end',205,426,8,'orange'),text('Curve name','舒展 / 70%',0,553,17,'muted','han')]
tools=[]
for i,name in enumerate(['选择','形状','文字','画笔','布局','动效']):
 y=40+i*78
 if i==0:tools+=[rect('Selected tool',40,y,58,58,'soft',16),path('Cursor icon',[[25,y-18],[25,y+19],[36,y+9],[44,y+26],[50,y+23],[42,y+6],[56,y+6]],'ink')]
 elif i==1:tools+=[rect('Square tool',32,y-6,24,24,'orange',5),circ('Circle tool',46,y+8,23,'lilac')]
 elif i==2:tools+=[text('Type tool','T',40,y,35,weight=600,align='center')]
 elif i==3:tools+=[path('Pen tool',[[23,y+16],[31,y-11],[48,y-18],[57,y+7],[23,y+16]],None,closed=False,stroke='ink',sw=2.5),circ('Pen point',40,y,6,'ink')]
 elif i==4:tools+=[rect('Layout big',30,y,19,35,'ink',3),rect('Layout small',52,y-10,15,15,'ink',3),rect('Layout low',52,y+10,15,15,'ink',3)]
 else:tools+=[path('Play tool',[[25,y-18],[57,y],[25,y+18]],'ink')]
data={'colors':C,'fonts':{'display':'FOLDDisplay-Regular','display600':'FOLDDisplay-SemiBold','display800':'FOLDDisplay-ExtraBold','han':'FOLDHan-Regular','han700':'FOLDHan-Bold'},'artworks':{k:artwork(k) for k in ['portrait','wide','ticket']},'components':{'prompt':{'w':1120,'h':168,'elements':prompt},'colors':{'w':540,'h':108,'elements':colorbar},'inspector':{'w':228,'h':584,'elements':inspector},'tools':{'w':80,'h':488,'elements':tools}},'logo':logo(30,30)}
(P/'design-system.json').write_text(json.dumps(data,ensure_ascii=False,indent=2))
def svg_path(e):
 v=e['vertices'];s=f'M{v[0][0]} {v[0][1]}'
 for k in range(1,len(v)+(1 if e['closed'] else 0)):
  a=(k-1)%len(v);b=k%len(v);out=e['outTangents'][a];inside=e['inTangents'][b]
  s+=f' C{v[a][0]+out[0]} {v[a][1]+out[1]} {v[b][0]+inside[0]} {v[b][1]+inside[1]} {v[b][0]} {v[b][1]}'
 return s+(' Z' if e['closed'] else '')
def svg(spec):
 chunks=[f'<svg xmlns="http://www.w3.org/2000/svg" width="{spec["w"]}" height="{spec["h"]}" viewBox="0 0 {spec["w"]} {spec["h"]}">']
 for e in spec['elements']:
  fill='#'+C.get(e.get('color'),e.get('color')) if e.get('color') else 'none';name=html.escape(e['name']);common=f'data-name="{name}" fill="{fill}"'
  if e['type']=='rect':chunks.append(f'<rect {common} x="{e["x"]-e["w"]/2}" y="{e["y"]-e["h"]/2}" width="{e["w"]}" height="{e["h"]}" rx="{e.get("r",0)}"/>')
  elif e['type']=='ellipse':chunks.append(f'<ellipse {common} cx="{e["x"]}" cy="{e["y"]}" rx="{e["w"]/2}" ry="{e["h"]/2}"/>')
  elif e['type']=='path':chunks.append(f'<path {common} d="{svg_path(e)}" stroke="{"#"+C[e["stroke"]] if e.get("stroke") else "none"}" stroke-width="{e.get("sw",0)}" stroke-linecap="round" stroke-linejoin="round"/>')
  else:
   family='FOLD Han' if e['font']=='han' else 'FOLD Display';anchor={'left':'start','center':'middle','right':'end'}[e['align']]
   chunks.append(f'<text {common} x="{e["x"]}" y="{e["y"]+e["size"]*.34}" font-family="{family}" font-weight="{e["weight"]}" font-size="{e["size"]}" text-anchor="{anchor}">{html.escape(e["text"])}</text>')
 return ''.join(chunks)+'</svg>'
for name,spec in data['artworks'].items():(P.parent/'assets'/('晴野-'+name+'.svg')).write_text(svg(spec))
(P.parent/'assets/FOLD-mark.svg').write_text(svg({'w':60,'h':64,'elements':data['logo']}))
print('Original FOLD design system, three campaign formats and mark created.')
