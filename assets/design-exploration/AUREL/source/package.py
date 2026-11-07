from pathlib import Path
import zipfile,json,hashlib
P=Path(__file__).resolve().parent.parent
out=P/'AUREL_v2.1_完整工程.zip'
assert (P/'review/final-media-qa.json').exists()
assert json.loads((P/'case.json').read_text())['status'] in {'ready_for_user_review','user_requested_style_registration'}
def excluded(f):
 r=f.relative_to(P)
 return any(q.endswith('-frames')or q=='__pycache__'for q in r.parts)or f.suffix in ['.zip','.blend1','.pyc']or f.name.startswith('.')or f.name=='package-result.log'
files=[f for f in P.rglob('*')if f.is_file()and not excluded(f)]
manifest=[]
for f in files:
 if f.name=='package-manifest.json':continue
 manifest.append({'path':str(f.relative_to(P)),'bytes':f.stat().st_size,'sha256':hashlib.sha256(f.read_bytes()).hexdigest()})
m=P/'package-manifest.json';m.write_text(json.dumps(manifest,ensure_ascii=False,indent=2))
files=[f for f in P.rglob('*')if f.is_file()and not excluded(f)]
with zipfile.ZipFile(out,'w',compression=zipfile.ZIP_DEFLATED,compresslevel=4)as z:
 for f in files:z.write(f,Path(P.name)/f.relative_to(P))
with zipfile.ZipFile(out)as z:
 bad=z.testzip();assert bad is None,bad
print(json.dumps({'zip':str(out),'files':len(files),'bytes':out.stat().st_size,'crc_check':'passed'},ensure_ascii=False))
