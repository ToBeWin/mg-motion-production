from pathlib import Path
import xml.etree.ElementTree as E,subprocess,json
P=Path(__file__).resolve().parent;OUT=P.parent/'editor-handoff';OUT.mkdir(exist_ok=True)
root=E.Element('fcpxml',version='1.10');res=E.SubElement(root,'resources')
E.SubElement(res,'format',id='r1',name='FFVideoFormat1080p30',frameDuration='1/30s',width='1920',height='1080',colorSpace='1-1-1 (Rec. 709)')
media=[('r2','SUNPOP Picture',P.parent/'SUNPOP_把今天打开_画面.mp4',True),('r3','SUNPOP final master',P/'audio/master-voice.wav',False),('r4','Narration stem',P/'audio/voice-edit.wav',False),('r5','Music stem',P/'audio/music-edit.wav',False),('r6','Sound design stem',P/'audio/sfx-edit.wav',False)]
for ident,name,path,video in media:
 assert path.exists(),path
 attrs=dict(id=ident,name=name,start='0s',duration='24s')
 if video:attrs.update(hasVideo='1',format='r1')
 else:attrs.update(hasAudio='1',audioSources='1',audioChannels='2',audioRate='48000')
 a=E.SubElement(res,'asset',**attrs);E.SubElement(a,'media-rep',kind='original-media',src=path.resolve().as_uri())
lib=E.SubElement(root,'library');event=E.SubElement(lib,'event',name='SUNPOP · 把今天打开')
project=E.SubElement(event,'project',name='SUNPOP · picture + final master')
seq=E.SubElement(project,'sequence',format='r1',duration='24s',tcStart='0s',tcFormat='NDF',audioLayout='stereo',audioRate='48k')
spine=E.SubElement(seq,'spine');picture=E.SubElement(spine,'asset-clip',ref='r2',name='SUNPOP / editable source in EffectCraft',offset='0s',start='0s',duration='24s',format='r1')
E.SubElement(picture,'asset-clip',ref='r3',name='IndexTTS2 + MiniMax Music + sound design',lane='-1',offset='0s',start='0s',duration='24s',audioRole='dialogue')
for ident,name,path,video in media[2:]:E.SubElement(event,'asset-clip',ref=ident,name=name,start='0s',duration='24s')
xml=OUT/'SUNPOP.fcpxml';E.indent(root);xml.write_text('<?xml version="1.0" encoding="UTF-8"?>\n<!DOCTYPE fcpxml>\n'+E.tostring(root,encoding='unicode'))
dtd='/Applications/Final Cut Pro.app/Contents/Frameworks/Interchange.framework/Versions/A/Resources/FCPXMLv1_10.dtd'
subprocess.run(['xmllint','--noout','--dtdvalid',Path(dtd).as_uri(),str(xml)],check=True)
cli=str(Path.home()/'Library/Application Support/FilmCraft/bin/filmcraft-cli')
p=subprocess.run([cli,'--save-as',str(OUT/'SUNPOP.fcproj'),'import',str(xml)],capture_output=True,text=True)
(OUT/'filmcraft-import.log').write_text(p.stdout+p.stderr);p.check_returncode()
inspection=subprocess.run([cli,'--project',str(OUT/'SUNPOP.fcproj'),'inspect'],capture_output=True,text=True,check=True)
(OUT/'filmcraft-inspect.json').write_text(inspection.stdout)
print('FCPXML DTD valid; imported and saved FilmCraft native project.')
