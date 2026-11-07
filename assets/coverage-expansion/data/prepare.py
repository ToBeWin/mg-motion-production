"""Convert public-domain map data and authored project facts into native composition data."""
from pathlib import Path
import struct,zipfile,json,math,hashlib
P=Path(__file__).resolve().parent

def records(blob):
 off=100
 while off<len(blob):
  num,length=struct.unpack_from('>ii',blob,off);off+=8;n=length*2;yield blob[off:off+n];off+=n

def dbf(blob):
 count=struct.unpack_from('<I',blob,4)[0];head,record=struct.unpack_from('<HH',blob,8);fields=[];i=32
 while blob[i]!=13:
  fields.append((blob[i:i+11].split(b'\0')[0].decode(),blob[i+16]));i+=32
 rows=[]
 for k in range(count):
  b=blob[head+k*record:head+(k+1)*record];j=1;row={}
  for name,size in fields:row[name.lower()]=b[j:j+size].decode('utf-8',errors='replace').strip();j+=size
  rows.append(row)
 return rows

def project(lon,lat):return [round(220+(lon+180)/360*1480,3),round(250+(90-lat)/180*690,3)]
with zipfile.ZipFile(P/'ne_110m_land.zip') as z:
 raw=z.read('ne_110m_land.shp');land=[]
 for b in records(raw):
  if struct.unpack_from('<i',b)[0]!=5:continue
  n,m=struct.unpack_from('<ii',b,36);starts=list(struct.unpack_from('<'+'i'*n,b,44))+[m];pts=[struct.unpack_from('<dd',b,44+4*n+16*k) for k in range(m)]
  for a,end in zip(starts,starts[1:]):
   part=pts[a:end]
   if len(part)>4:land.append([project(x,y) for x,y in part])
with zipfile.ZipFile(P/'ne_110m_populated_places_simple.zip') as z:
 rows=dbf(z.read('ne_110m_populated_places_simple.dbf'));points=list(records(z.read('ne_110m_populated_places_simple.shp')))
 candidates=[]
 for row,b in zip(rows,points):
  name=row.get('name','');xy=struct.unpack_from('<dd',b,4)
  if name in ['San Francisco','New York','London']:candidates.append({'name':name,'lon':xy[0],'lat':xy[1],'point':project(*xy)})
byname={x['name']:x for x in candidates};assert len(byname)==3,list(byname)
cities=[byname[n] for n in ['San Francisco','New York','London']]
def arc(a,b):
 def unit(v):lon,lat=map(math.radians,[v['lon'],v['lat']]);return [math.cos(lat)*math.cos(lon),math.cos(lat)*math.sin(lon),math.sin(lat)]
 A,B=unit(a),unit(b);theta=math.acos(max(-1,min(1,sum(x*y for x,y in zip(A,B)))));out=[]
 for i in range(61):
  t=i/60;v=[(math.sin((1-t)*theta)*x+math.sin(t*theta)*y)/math.sin(theta) for x,y in zip(A,B)];out.append(project(math.degrees(math.atan2(v[1],v[0])),math.degrees(math.atan2(v[2],math.hypot(v[0],v[1])))))
 return out
mapdata={'land':land,'cities':cities,'routes':[arc(cities[0],cities[1]),arc(cities[1],cities[2])],'projection':'Equirectangular EPSG:4326 degrees mapped to screen; not an equal-area or distance scale.','scope':'Natural Earth coordinates; routes are illustrative, not deployed cloud sites or network measurements.'}
(P/'map.json').write_text(json.dumps(mapdata,ensure_ascii=False,separators=(',',':')))
# Three real local example documents form one downloadable brief; no invented performance metrics.
corpus=json.loads((P/'case-corpus.json').read_text());docs=corpus['documents'];claims=[{'id':d['id'],'title':d['title'],'quote':d['excerpt'],'sha256':hashlib.sha256('\n'.join(d['excerpt']).encode()).hexdigest()} for d in docs]
report='# 产品知识库 · 入门简报\n\n示例团队 ATLAS LAB 的资料整合演示，不是真实客户证言或业务业绩。\n\n'
for i,c in enumerate(claims,1):report+='## '+str(i)+' · '+c['title']+'\n\n'+'\n\n'.join(c['quote'])+'\n\n来源：'+c['id']+'；摘录 SHA-256：'+c['sha256']+'\n\n'
(P.parent/'records/case-brief.md').write_text(report);case={'documents':docs,'claims':claims,'source_count':len(docs),'report_count':1,'scope':'Authored demo, no real customer or performance claim.'};(P/'case.json').write_text(json.dumps(case,ensure_ascii=False,indent=2))
# Release versions refer to the actual existing project packages, without invented dates.
editorial=[{'version': '3.2', 'name': '任务与结果', 'evidence': 'assets/task-results'}, {'version': '3.3', 'name': '节奏与细节', 'evidence': 'assets/release-polish'}, {'version': '3.4', 'name': '独立新场景', 'evidence': 'assets/scene-expansion'}, {'version': '3.5', 'name': '答案与来源', 'evidence': 'assets/knowledge-assistant'}]
(P/'editorial.json').write_text(json.dumps(editorial,ensure_ascii=False,indent=2))
print(json.dumps({'land_parts':len(land),'cities':cities,'case_sources':len(claims)},ensure_ascii=False))
