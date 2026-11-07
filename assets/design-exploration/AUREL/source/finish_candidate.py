from pathlib import Path
import subprocess,time,json
P=Path(__file__).resolve().parent;OUT=P.parent
start=time.time()
while True:
 q=OUT/'review/render-progress.json'
 if q.exists()and json.loads(q.read_text()).get('stage')=='complete':break
 if time.time()-start>3600:raise TimeoutError('Continuous render is not complete; inspect logs before retrying.')
 time.sleep(5)
for script,args,log in [('build.py',['--preview','--render'],'final-build.log'),('verify.py',[],'final-verify.log'),('check_captions.py',[],'final-captions.log'),('make_review_frames.py',[],'final-contact.log'),('editor_handoff.py',[],'final-handoff.log')]:
 print('START',script,flush=True)
 with (OUT/'review'/log).open('w')as f:subprocess.run(['python3',str(P/script),*args],stdout=f,stderr=subprocess.STDOUT,check=True)
 print('DONE',script,flush=True)
(OUT/'review/candidate-built.json').write_text(json.dumps({'status':'candidate_built','review_pending':True,'finished_at':time.time()},indent=2))
