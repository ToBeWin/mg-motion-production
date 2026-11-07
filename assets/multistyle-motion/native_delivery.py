"""Shared native project finishing. No footage is flattened by this module."""
from pathlib import Path
import json, os, subprocess

def delivery_js(comp_name, master, timeline, profile):
    """One picture comp, two delivery comps; each has exactly one master track."""
    themes=json.loads((Path(__file__).parent/'caption-themes.json').read_text())
    theme=themes['profiles'][profile]
    captions=[]
    for cue in timeline['captions']:
        style={**themes['defaults'],**{k:v for k,v in theme.items() if k!='cues'},**theme.get('cues',{}).get(cue['id'],{})}
        assert len(style['fill'])==6 and 0<=style['stroke_width']<=1
        captions.append({**cue,'style':style})
    return '''
(function(){
 var name=NAME,subtitles=CAPTIONS,src=null,M=MuseNative;
 for(var i=1;i<=app.project.numItems;i++){if(app.project.item(i).name===name){src=app.project.item(i);break;}}
 if(!src)throw new Error('Picture composition missing: '+name);
 src.name=name+' / Picture';
 for(var v=0;v<2;v++){
  var c=U.comp(name+(v?' / 中文字幕':''),src.width,src.height,src.duration,false);
  var pic=c.layers.add(src);pic.name='Editable picture';M.pos(pic).setValue([src.width/2,src.height/2]);
  var au=c.layers.add(app.project.importFile(new ImportOptions(new File(MASTER))));au.name='IndexTTS2 voice + MiniMax Music + event sound';au.inPoint=0;au.outPoint=src.duration;
  if(v)for(var k=0;k<subtitles.length;k++){
   var s=subtitles[k],start=Math.floor(s.start*30)/30,end=Math.ceil(s.end*30)/30;
   var st=s.style;
   var text=F.txt(c,'Caption '+s.id,s.text,st.size,M.rgb(st.fill),st.position[0],st.position[1],start,end,false,st.font);
   // The scene palette selects the cue treatment. No opaque caption plate.
   var prop=text.property('ADBE Text Properties').property('ADBE Text Document'),doc=prop.value;
   doc.applyStroke=st.stroke_width>0;
   if(doc.applyStroke){doc.strokeColor=M.rgb(st.stroke);doc.strokeWidth=st.stroke_width;doc.strokeOverFill=false;}
   prop.setValue(doc);
   if(st.shadow)N.fx(text,'Drop Shadow',{'Shadow Color':M.rgb(st.shadow.color),'Opacity':st.shadow.opacity,'Distance':st.shadow.distance,'Softness':st.shadow.softness,'Direction':180});
  }
 }
})();
'''.replace('NAME',json.dumps(comp_name,ensure_ascii=False)).replace('CAPTIONS',json.dumps(captions,ensure_ascii=False)).replace('MASTER',json.dumps(str(master)))

def save_project(cli, script, project):
    result=subprocess.run([cli,'--empty','script',str(script),'--save-as',str(project),'--json'],capture_output=True,text=True,check=True)
    answer=json.loads(result.stdout)
    if not answer.get('ok'):raise RuntimeError(answer)
    data=json.loads(project.read_text())
    if data['settings']['bit_depth']=='Bpc8':
        subprocess.run([cli,'--project',str(project),'exec','file.cycleBitDepth','--save','--json'],capture_output=True,check=True)
        data=json.loads(project.read_text())
    for item in data['items'].values():
        if item['kind']['type']=='Footage':item['kind']['path']=os.path.relpath(item['kind']['path'],project.parent)
    project.write_text(json.dumps(data,ensure_ascii=False,separators=(',',':')))

def render(cli, project, comp, dest, cpu=False, audio=True):
    dest.parent.mkdir(exist_ok=True,parents=True)
    command=[cli,'--project',str(project)]+([] if cpu else ['--gpu'])+['render','--comp',comp,'--out',str(dest),'--format','h264','--fps','30','--resolution','full','--quality','best','--bitrate','30000','--audio','on' if audio else 'off','--progress','--json']
    subprocess.run(command,check=True)
