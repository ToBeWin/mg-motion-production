/* Editable optical/metal films. Native type, masks, easing, vector rules and sound. */
var M=MuseNative;
function importLayer(c,path,name,end){var f=app.project.importFile(new ImportOptions(new File(path)));var l=c.layers.add(f);l.name=name;l.inPoint=0;l.outPoint=end;return l;}
function txt(c,name,str,size,color,x,y,start,end,font){
 var pc=M.comp(name+' / Type',1400,240,12,30);
 var type=M.text(pc,'Editable '+name,str,size,M.rgb(color),[0,120],font||'HiraginoSansGB-W6',0,12);
 var b=type.sourceRectAtTime(0,false);pc.width=Math.ceil(b.width)+12;pc.height=Math.ceil(b.height)+12;
 M.anchor(type).setValue([b.left,b.top+b.height/2]);M.pos(type).setValue([6,pc.height/2]);
 var l=M.setup(c.layers.add(pc),name,[x-6,y],start,end);M.anchor(l).setValue([0,pc.height/2]);return l;
}
function reveal(l,at,dur){N.reveal(l,at,at+dur,20);M.key(M.opacity(l),[at,at+.3],[0,100]);}
function exit(l,at,end){var p=M.opacity(l);p.setValueAtTime(at,100);p.setValueAtTime(end,0);}
function label(c,str,color){return txt(c,'Series',str,23,color,128,77,0,12,'HelveticaNeue-Medium');}
var form=M.comp('01 FORM — Optical',1920,1080,12,30);form.bgColor=M.rgb('EEF0F2');form.motionBlurSamplesPerFrame=8;
var image=importLayer(form,'__GLASS_MEDIA__','Cycles / solid crystal optics',12);M.scale(image).setValue([1920/image.source.width*100,1920/image.source.width*100]);
label(form,'一念 / FORM','343B45');
var l=txt(form,'Tactile title 1','让光，',78,'242B35',128,302,4.25,8.15);reveal(l,4.25,.75);exit(l,7.75,8.15);
l=txt(form,'Tactile title 2','成为触感。',66,'242B35',128,405,4.4,8.15);reveal(l,4.4,.75);exit(l,7.75,8.15);
l=txt(form,'Optical descriptor','透过表面，感知变化。',24,'717985',128,505,4.85,8.15,'HiraginoSansGB-W3');reveal(l,4.85,.6);exit(l,7.75,8.15);
l=txt(form,'FORM wordmark','一念 Form',75,'242B35',128,325,8.35,12);reveal(l,8.35,.85);
l=txt(form,'FORM promise','看得见的轻盈。',30,'626C78',128,430,8.65,12,'HiraginoSansGB-W3');reveal(l,8.65,.8);
l=N.line(form,'Optical fine rule',[[128,892],[428,892]],M.rgb('AAB1BA'),1,4.35,12);N.trim(l,4.35,5.1);
l=txt(form,'Optical footer','OPTICAL INTERFACE / CONCEPT',17,'7C8590',128,925,4.6,12,'HelveticaNeue');reveal(l,4.6,.6);
importLayer(form,'__GLASS_AUDIO__','Original score / optical gestures',12);

function makeOrbit(name,sound){
 var c=M.comp(name,1920,1080,12,30);c.bgColor=M.rgb('202B37');c.motionBlurSamplesPerFrame=8;
 var image=importLayer(c,'__METAL_MEDIA__','Cycles / machined metal assembly',12);M.scale(image).setValue([1920/image.source.width*100,1920/image.source.width*100]);
 label(c,'ORBIT / MATERIAL STUDY','E1E7EE');
 var l=txt(c,'Precision title','精于毫厘。',71,'F2F5F7',128,292,4.2,8.7);reveal(l,4.2,.8);exit(l,8.0,8.7);
 l=txt(c,'ORBIT wordmark','ORBIT',104,'F2F5F7',128,422,4.45,8.7,'HelveticaNeue-Medium');reveal(l,4.45,.8);exit(l,8,8.7);
 l=txt(c,'Material descriptor','金属 · 切面 · 光',26,'B4C0CC',128,530,4.8,8.7,'HiraginoSansGB-W3');reveal(l,4.8,.7);exit(l,8,8.7);
 l=N.line(c,'Precision fine rule',[[128,880],[428,880]],M.rgb('8A9BAD'),1,4.55,8.7);N.trim(l,4.55,5.3);exit(l,8,8.7);
 l=txt(c,'Metal footer','PRECISION IN EVERY REFLECTION',16,'B4C0CC',128,914,4.8,8.7,'HelveticaNeue');reveal(l,4.8,.7);exit(l,8,8.7);
 if(sound)importLayer(c,'__METAL_AUDIO__','Original score / machined resonance',12);
 return c;
}
var orbit=makeOrbit('02 ORBIT — Precision',true);
var loop=makeOrbit('03 ORBIT — Silent loop',false);
form.openInViewer();'Optical and precision films built';
