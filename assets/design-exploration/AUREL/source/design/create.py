from pathlib import Path
import json
P=Path(__file__).resolve().parent
parts=[{'name':'left-stem','points':[[-3,0],[-1.55,0],[0,5.8],[-.55,5.8]],'color':'244CFF'},
       {'name':'right-stem','points':[[1.55,0],[3,0],[.55,5.8],[0,5.8]],'color':'244CFF'},
       {'name':'crossbar','points':[[-1.94,2.25],[1.94,2.25],[1.66,2.82],[-1.66,2.82]],'color':'244CFF'},
       {'name':'citron-inlay','points':[[-.86,3.87],[.86,3.87],[.73,4.14],[-.73,4.14]],'color':'D6F045'}]
d={'brand':'AUREL / 映序','thought':'让想象，有形。','duration':16,'fps':30,'colors':{'paper':'F7F5EE','blue':'244CFF','ink':'091E91','accent':'D6F045','silver':'D5D9E5'},'parts':parts,'font':'AurelGrotesk-Black','principle':'The same four authored paths become dimensional sculpture, moving graphic strips and a reconstructed A. The 3D-to-2D transition uses actual projected front-face vertices, not an unrelated wipe.'}
(P/'design-system.json').write_text(json.dumps(d,ensure_ascii=False,indent=2))
s=['<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080" viewBox="0 0 1920 1080">','<rect width="1920" height="1080" fill="#F7F5EE"/>','<g id="AUREL-type" fill="#091E91" font-family="Aurel Grotesk" font-weight="900"><text x="96" y="145" font-size="62">AUREL</text><text x="90" y="714" font-size="138">SHIFT</text><text x="90" y="850" font-size="138">YOUR VIEW.</text></g>']
for p in parts:
 pts=' '.join('%.2f,%.2f'%(1240+x*137,950-z*137)for x,z in p['points'])
 s.append('<polygon id="'+p['name']+'" points="'+pts+'" fill="#'+p['color']+'"/>')
s+=['<g stroke="#091E91" stroke-width="1.5"><path d="M96 199H590 M96 930H300 M339 915V945 M324 930H354"/></g>','<text x="96" y="1006" fill="#091E91" font-family="FOLD Han" font-size="24">让想象，有形。</text>','</svg>']
(P/'vector-system.svg').write_text('\n'.join(s))
