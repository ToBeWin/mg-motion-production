/* Three different compositions built around the same verified product actions. */
var M=MuseNative,D=CFG.duration,S=CFG.variant,C=CFG.colors;
var picture=E.comp('Picture');
M.gradient(picture,'Designed environment',[1920,1080],[60,0],[1840,1080],0,D,M.rgb(C.paper),M.rgb(C.glow2),false);
I.img(picture,CFG.logo,'Supplied product logo',51,99,65,0,D);
E.txt(picture,'Wordmark',CFG.brand,29,202,65,'ink',0,D);
E.txt(picture,'Brand line','让想法清晰展开',22,1655,65,'secondary',0,D,true);

function label(text,x,y,z,a,b,name){return E.txt(picture,name||text,text,z,x,y,'ink',a,b);}
function fadeOut(l,b){M.key(M.opacity(l),[b-.20,b],[100,0],{linear:true});}
function entering(l,a,from,to){I.reveal(l,a,a+.25);I.smooth(M.pos(l),a,a+.48,from,to);}
function paperFan(k){
 var a=k.click+.12,b=k.end;
 var files=(CFG.depth_assets&&CFG.depth_assets[k.case_id])||[];
 for(var i=0;i<Math.min(2,files.length);i++){
  var q=I.comp(k.case_id+' / Depth paper '+i,1440,810);I.rect(q,'Paper stock',1430,800,720,405,'FFFFFF',10,0,D);
  var im=I.img(q,files[i],'Real result on paper',1300,720,405,0,D);var fit=Math.min(1300/im.source.width,730/im.source.height)*100;M.scale(im).setValue([fit,fit]);
  var l=I.sub(picture,q,k.case_id+' / Result paper behind '+i,1130,585,a,b);M.scale(l).setValue([78,78]);N.shadow(l,9,9,26);
  I.reveal(l,a,a+.3);I.smooth(M.rotation(l),a,a+.60,0,i===0?-4:3);I.smooth(M.pos(l),a,a+.60,[1130,585],[1140+i*16,580-i*16]);fadeOut(l,b);
 }
}
function editorialGuide(k){
 var a=k.workspace,b=k.end,xx=186,yy=[372,511,650],times=[a,k.click+.12,k.click+2.9],words=['找到成果','打开文件','继续阅读'];
 var rail=M.path(picture,k.case_id+' / Persistent guide rail',[[xx,yy[0]],[xx,yy[2]]],null,M.rgb(C.line),2,[0,0],false,a,b);I.reveal(rail,a,a+.25);
 for(var j=0;j<3;j++){
  var idle=M.circle(picture,k.case_id+' / Guide node '+j,12,M.rgb(C.line),[xx,yy[j]],a,b);
  var dot=M.circle(picture,k.case_id+' / Active guide node '+j,12,M.rgb(C.accent),[xx,yy[j]],times[j],b);I.reveal(dot,times[j],times[j]+.15);
  E.txt(picture,k.case_id+' / Step '+j,words[j],29,290,yy[j],'secondary',a,b,true);
  var cap=E.txt(picture,k.case_id+' / Step current '+j,words[j],29,290,yy[j],'accent',times[j],b,true);I.reveal(cap,times[j],times[j]+.2);
 }
}
for(var i=0;i<CFG.cases.length;i++){
 var k=CFG.cases[i],a=k.workspace,b=k.end,kind=k.case_id;
 U.add(picture,k,S);
 if(S==='graphic'){
  var tt=[kind==='analysis'?'从回答':'从方案',kind==='analysis'?'到报告。':'到行动。'];
  E.txt(picture,'Graphic chapter '+i,'0'+(i+1)+'  /  '+(kind==='analysis'?'看见变化':'推进行动'),24,244,260,'accent',a,b,true);
  for(var j=0;j<2;j++){var l=label(tt[j],249,397+j*91,62,a,b,'Graphic display type '+i+'-'+j);entering(l,a+j*.08,[249,434+j*91],[249,397+j*91]);fadeOut(l,b);}
  var underline=M.path(picture,'Graphic value rule '+i,[[105,552],[390,552]],null,M.rgb(C.accent),5,[0,0],false,a,b);N.trim(underline,a+.35,a+.85);
  paperFan(k);
  var op=I.workspace(k,S),w=I.sub(picture,op.comp,kind+' / Graphic product stage',1120,590,a,b);M.scale(w).setValue([84,84]);N.shadow(w,13,16,32);entering(w,a,[1220,616],[1120,590]);fadeOut(w,b);
 }else if(S==='luminous'){
  var head=label(kind==='analysis'?'从一个问题，看清经营变化。':'从一个目标，连起整套行动。',960,174,52,a,b);entering(head,a,[960,202],[960,174]);fadeOut(head,b);
  var anchor=I.comp(kind+' / Persistent task anchor',370,380);I.rect(anchor,'Task paper',360,370,185,190,'FFFFFF',20,0,D);
  I.text(anchor,'Task label','本次任务',22,185,52,'accent',0,D);
  var lines=kind==='analysis'?['看清业绩变化','找到值得行动','的方向']:['规划一项任务','明确目标、节奏','与团队分工'];
  for(var j=0;j<3;j++)I.text(anchor,'Task line '+j,lines[j],30,185,118+j*50,'ink',0,D);
  I.text(anchor,'Task provenance','真实任务 · 已完成',19,185,324,'secondary',0,D);
  var al=I.sub(picture,anchor,kind+' / Retained task identity',245,588,k.click+.22,b);I.reveal(al,k.click+.22,k.click+.58);N.shadow(al,8,8,24);fadeOut(al,b);
  var op=I.workspace(k,S),w=I.sub(picture,op.comp,kind+' / Persistent luminous window',960,596,a,b);M.scale(w).setValue([92,92]);N.shadow(w,11,14,38);entering(w,a,[960,636],[960,596]);
  I.smooth(M.pos(w),k.click+.25,k.click+.94,[960,596],[1122,596]);I.smooth(M.scale(w),k.click+.25,k.click+.94,[92,92],[84,84]);fadeOut(w,b);
 }else{
  var h=label(kind==='analysis'?'看清结果，也看见依据。':'打开方案，让下一步清楚。',1020,174,52,a,b);entering(h,a,[1020,202],[1020,174]);fadeOut(h,b);
  editorialGuide(k);
  var op=I.workspace(k,S),w=I.sub(picture,op.comp,kind+' / Guided viewport',1110,590,a,b);M.scale(w).setValue([84,84]);N.shadow(w,12,13,30);entering(w,a,[1152,622],[1110,590]);fadeOut(w,b);
  var note=E.txt(picture,'Guide note '+i,kind==='analysis'?'示例报告 · 核对数据口径':'演示方案 · 目标不等于结果',19,1110,956,'secondary',a+.5,b,true);I.reveal(note,a+.5,a+.8);
 }
 var scope=kind==='analysis'?'界面回放 · 核对数据口径':'实际生成的演示方案 · 目标不等于结果';
 if(S!=='companion')E.txt(picture,'Evidence scope '+i,scope,19,1105,956,'secondary',a+.50,b,true);
}
V.stage(picture,CFG.motion_stage,S);
E.close(picture);
var captions=E.comp('Captions');for(var j=0;j<CFG.captions.length;j++){var r=CFG.captions[j];var l=E.txt(captions,'VO '+r.id,r.text,33,960,1013,'secondary',r.start,r.end,true);l.motionBlur=false;}
var final=E.comp('Delivery');E.sub(final,picture,'Native editable picture',960,540,0,D);E.sub(final,captions,'Transparent synchronized captions',960,540,0,D);
$.writeln(JSON.stringify({variant:S,layers:M.count.layers,realClicks:CFG.cases.map(function(k){return k.click;})}));
