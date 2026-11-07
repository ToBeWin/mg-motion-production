/* Thirteen authored technology scenarios. Native vector/type/mattes/paths; original 3D assets. */
var M=MuseNative,r=M.rgb,ID=PLAN.id,D=PLAN.duration;
var C={ink:r('173C43'),muted:r('5C777B'),green:r('167F72'),blue:r('355BCC'),coral:r('DD6D4D'),sand:r('F4F1E8'),white:r('FFFFFF'),line:r('D5E0DD')};
var c=U.comp(PLAN.composition,1920,1080,D,false);
function bg(a,b){return M.gradient(c,'Light environment',[1920,1080],[260,120],[1680,1080],0,D,r(a),r(b),false);}
function t(str,size,x,y,col,a,b,left,font){return X.tx(c,str,str,size,col||C.ink,x,y,font||'HiraginoSansGB-W6',a||0,b||D,left);}
function tx(co,str,size,x,y,col,a,b,left,font){return X.tx(co,str,str,size,col||C.ink,x,y,font||'HiraginoSansGB-W6',a||0,b||D,left);}
function line(pts,col,w,a,b,n){return X.line(c,n||'Contour',pts,col,w,a||0,b||D);}
function show(l,a,dy){return X.on(l,a,.64,dy===undefined?22:dy);}
function phrase(s,size,x,y,w,a,b,col){return X.splitText(c,s,s,size,col||C.ink,x,y,w,a,b||D);}
function chip(co,label,x,y,w,col,a,b){var q=U.rect(co,label+' plate',w,44,col,x,y,22,a,b);tx(co,label,19,x,y,C.white,a,b);return q;}
function windowBase(co,w,h){U.rect(co,'Window',w,h,C.white,w/2,h/2,26);U.line(co,'Title divider',[[0,70],[w,70]],C.line,1);for(var i=0;i<3;i++)U.circle(co,'Window mark',9,r(['D4DFDD','B8CDC9','8CB3AA'][i]),32+i*19,34);}
function card(co,n,w,h,x,y,col){var q=U.rect(co,n,w,h,col||C.white,x,y,20);N.shadow(q,8,8,20);return q;}
function progress(co,label,x,y,w,val,col,a,b){tx(co,label,21,x,y-28,C.muted,a,b,true);U.rect(co,label+' track',w,8,C.line,x+w/2,y,4,a,b);var q=U.rect(co,label+' fill',w*val,8,col,x+w*val/2,y,4,a,b);return q;}
function keyshape(l,times,pts){var ss=[];for(var i=0;i<pts.length;i++)ss.push(N.shape(pts[i],false));M.key(N.pathProp(l),times,ss,{linear:true});}
function label(col,brand,cat,foot){X.pinHeader(c,brand,cat,C.ink,C.muted,foot||'');}
function disc(co,name,x,y,d,col,a,b){return U.circle(co,name,d,col,x,y,a,b);}
function ease(t,a,b){var q=Math.max(0,Math.min(1,(t-a)/(b-a)));return q*q*(3-2*q);}
function orbitMedia(kind){var p=MEDIA['orbit-'+kind];return M.footage(c,'Original ORBIT / '+kind,p,1920,[960,540],0,D);}

if(ID==='onboarding'){
 bg('F9F6EE','E8F2EC');label(C.green,'START','FIRST CONNECTION','本地样本演示 · 数据与权限状态由可运行控制器生成');
 var panel=U.comp('START / Workspace',1120,750,D,true);windowBase(panel,1120,750);tx(panel,'First workspace',22,150,35,C.ink,0,D,true,'HelveticaNeue-Medium');
 var co=U.add(c,panel,'Continuous workspace',1260,570,1);show(co,.2,40);
 // One workspace remains in place; the selected file becomes the imported source.
 tx(panel,'连接你的第一份数据',42,60,145,C.ink,.5,6.5,true);tx(panel,'从一个小样本开始。',24,60,204,C.muted,.5,6.5,true);
 var sample=U.comp('START / sample.csv',380,270,D,true);card(sample,'CSV card',360,248,190,135,r('EFF7F2'));chip(sample,'CSV',68,54,72,C.green);tx(sample,'sample.csv',27,35,104,C.ink,0,D,true,'HelveticaNeue-Bold');
 var names=[],values=[];for(var ri=0;ri<DATA.runtime.rows.length;ri++){names.push(DATA.runtime.rows[ri].name);values.push(DATA.runtime.rows[ri].value);}for(var i=0;i<3;i++){tx(sample,names[i],19,35,155+i*29,C.muted,0,D,true);tx(sample,String(values[i]),20,320,155+i*29,C.ink,0,D,false,'HelveticaNeue-Medium');}
 var file=U.add(panel,sample,'Selected source',280,430,1,.4,13.8);X.move(file,[.4,1.2,6.6,7.35],[[560,920],[560,860],[560,860],[260,300]]);X.scale(file,[6.6,7.35],[100,42]);
 var select=chip(panel,'导入样本',850,440,190,C.green,2.3,6.6);show(select,2.3,10);tx(panel,'已解析 3 行',23,850,510,C.green,2.6,6.6);X.checked(panel,'Parse complete',774,510,C.green,2.6,6.6,12);
 tx(panel,'数据已连接',42,60,280,C.ink,7.4,10.5,true);tx(panel,'3 行记录，保留原始字段。',25,60,342,C.muted,7.6,10.5,true);
 for(var i=0;i<3;i++){var row=U.rect(panel,'Connected row',980,66,r(i%2?'FFFFFF':'F0F6F2'),560,440+i*75,10,7.7,10.5);show(row,7.7+i*.12,18);tx(panel,names[i],25,100,440+i*75,C.ink,7.9+i*.12,10.5,true);tx(panel,String(values[i]),28,980,440+i*75,C.green,7.9+i*.12,10.5,false,'HelveticaNeue-Medium');}
 tx(panel,'先确认，谁能看见。',42,60,275,C.ink,10.5,13.8,true);chip(panel,'仅自己',245,426,270,C.green,10.5,13.8);tx(panel,'工作区将只保存在本地。',26,60,530,C.muted,10.7,13.8,true);
 tx(panel,'工作区已就绪',44,60,145,C.ink,13.8,D,true);chip(panel,'PRIVATE',960,142,150,C.green,13.8,D);
 for(var i=0;i<3;i++){var xx=200+i*360;card(panel,'Metric',300,340,xx,430,r(['E4F2EA','ECF0FC','FCF0DC'][i])).inPoint=13.8;tx(panel,names[i],27,xx,320,C.muted,13.8,D);show(tx(panel,String(values[i]),84,xx,435,C.ink,13.8,D,false,'HelveticaNeue-Medium'),13.8+i*.12,30);tx(panel,'样本记录',20,xx,545,C.muted,13.8,D);}
 var starts=[.2,6.6,10.5,13.8],ends=[6.6,10.5,13.8,D],heads=['导入。','连接。','确认。','开始。'],subs=['一份数据，\n就是起点。','让信息\n进入工作区。','先确定\n访问范围。','第一步，\n已经完成。'];
 for(var i=0;i<4;i++){t('0'+(i+1),180,110,330,C.green,starts[i],ends[i],true,'HelveticaNeue-Thin');phrase(heads[i],66,110,525,570,starts[i],ends[i]);t(subs[i],32,110,675,C.muted,starts[i],ends[i],true);}
}
if(ID==='customer-case'){
 bg('F8F3E9','F3ECE0');label(C.coral,'ATLAS LAB','CASE STUDY / AUTHORED EXAMPLE','虚构团队示例 · 原创资料整理 · 不代表真实客户、效率或业绩');
 phrase('从分散资料，到可追溯简报。',66,110,215,1700,.2,5.8);
 var docs=[];for(var i=0;i<3;i++){var doc=U.comp('ATLAS / Source '+i,400,460,D,true);card(doc,'Paper',384,444,200,230,C.white);chip(doc,'0'+(i+1),63,58,68,[C.green,C.blue,C.coral][i]);tx(doc,DATA.case.documents[i].title,26,30,134,C.ink,0,D,true);tx(doc,DATA.case.documents[i].format,18,30,185,C.muted,0,D,true,'HelveticaNeue-Medium');var q=DATA.case.claims[i].quote;for(var j=0;j<q.length;j++){var s=q[j];if(i===0){tx(doc,'支持 PDF、',21,30,255,C.ink,0,D,true);tx(doc,'Markdown、TXT。',21,30,285,C.ink,0,D,true);}else if(s.length>14){tx(doc,s.slice(0,13),21,30,255+j*68,C.ink,0,D,true);tx(doc,s.slice(13),21,30,285+j*68,C.ink,0,D,true);}else tx(doc,s,21,30,255+j*68,C.ink,0,D,true);}tx(doc,'保留出处 · source '+(i+1),17,30,403,C.muted,0,D,true);for(var di=1;di<=doc.numLayers;di++){var dl=doc.layer(di);if(dl.name!=='Paper' && dl.name!=='0'+(i+1)+' plate')X.off(dl,6.3,6.65);}var l=U.add(c,doc,'Source '+(i+1),430+i*530,585,1,0,8.5);show(l,.6+i*.2,100);X.move(l,[6.4,7.5,8.2],[[430+i*530,585],[960+(i-1)*35,535],[960,535]]);X.scale(l,[6.4,8.2],[100,55]);X.off(l,7.9,8.5);docs.push(l);}
 var result=U.comp('ATLAS / Sourced brief',1180,650,D,true);card(result,'Final brief',1160,630,590,325,C.white);tx(result,'产品知识简报',48,60,90,C.ink,0,D,true);tx(result,'3 份资料 / 3 个可回看的出处',23,60,157,C.muted,0,D,true);var claims=['支持 PDF、Markdown、TXT。','修改文件后，重新同步。','成员只访问已授权的资料。'];for(var i=0;i<3;i++){disc(result,'Source identifier',99,275+i*115,48,[C.green,C.blue,C.coral][i]);tx(result,String(i+1),22,99,275+i*115,C.white,0,D,false,'HelveticaNeue-Bold');tx(result,claims[i],30,150,275+i*115,C.ink,0,D,true);U.line(result,'Rule',[[150,322+i*115],[1090,322+i*115]],C.line,1);}
 var res=U.add(c,result,'Assembled brief',1110,560,1,8.2,D);show(res,8.2,45);X.scale(res,[8.2,9],[91,100]);t('3 → 1',100,120,415,C.coral,8.2,D,true,'HelveticaNeue-Thin');t('信息汇合，\n出处保留。',42,120,580,C.ink,8.7,D,true);show(t('简报已生成',25,1110,940,C.green,11.5,D),11.5,15);X.checked(c,'Final evidence',979,940,C.green,11.5,D,14);t('可下载 Markdown · SHA-256 原文校验',19,1110,982,C.muted,15,D);
}
function prism(co,alpha){
 var colors=[r('F2BA51'),r('DB704E'),r('47837A')];
 for(var i=0;i<3;i++){var q=M.path(co,'Prism segment '+i,[[0,-180],[156,-90],[156,0],[0,90],[-78,45],[-78,-135]],colors[i],null,0,[960,470],true,0,D);var angle=i*120;U.key(M.rotation(q),[.2+i*.12,2.2,3.1],[angle-95,angle+5,angle],'travel');X.move(q,[.2+i*.12,2.2,3.1],[[960+(i-1)*620,650],[960,465],[960,470]]);X.scale(q,[.2+i*.12,2.2,3.1],[45,104,100]);show(q,.2+i*.12,0);}
 show(tx(co,'PRISM',76,960,770,C.ink,3.1,D,false,'HelveticaNeue-Medium'),3.1,26);show(tx(co,'光的秩序',26,960,852,C.muted,3.8,D),3.8,12);
}
if(ID==='identity-sting'){
 bg('FFF9ED','EDEDE4');prism(c,false);var ac=U.comp('Alpha / identity-sting',1920,1080,D,false);prism(ac,true);
}
if(ID==='product-function'){
 orbitMedia('function');label(C.blue,'ORBIT','FUNCTION / ORIGINAL CONCEPT','原创交互旋钮概念 · 参数动画示意，不代表已量产硬件');
 phrase('一转，即得。',72,110,290,700,.2,8.3);t('旋转，细调亮度。',28,110,395,C.muted,.6,8.3,true);
 var v=20,last=-1;for(var i=0;i<DATA.function.length;i++){v=Math.round(DATA.function[i].value);if(v!==last){var until=D;for(var j=i+1;j<DATA.function.length;j++)if(Math.round(DATA.function[j].value)!==v){until=DATA.function[j].time;break;}t(String(v),118,110,570,C.ink,DATA.function[i].time,until,true,'HelveticaNeue-Thin');last=v;}}
 t('%',40,310,597,C.muted,0,D,true,'HelveticaNeue-Light');line([[110,710],[510,710]],C.line,8);var bar=line([[110,710],[190,710]],C.blue,8);var pts=[],ts=[];for(var i=0;i<DATA.function.length;i++){ts.push(DATA.function[i].time);pts.push([[110,710],[110+4*DATA.function[i].value,710]]);}keyshape(bar,ts,pts);t('LIGHT / 20 → 80',19,110,768,C.muted,0,D,true,'HelveticaNeue-Medium');phrase('每一格，',52,110,280,690,8.3,D);phrase('都有回应。',52,110,355,690,8.45,D); 
}
if(ID==='industrial-exploded'){
 orbitMedia('assembly'); // The model occupies the upper frame; no horizontal header through its material.
 t('ORBIT / INSIDE',25,92,70,C.ink,0,D,true,'HelveticaNeue-Bold');t('原创概念结构 · 四个分件 / Z 轴拆装',18,960,1030,C.muted);
 phrase('内外有序。',64,92,235,550,.2,9.2);t('从触感，\n到信号。',31,92,360,C.muted,1,D,true);
 var labels=['陶瓷底座','控制板','旋转编码器','金属旋帽'],ys=[850,670,470,240],keys=['base','board','encoder','cap'];
 for(var k=0;k<4;k++){var times=[],pp=[],dots=[];for(var i=0;i<DATA.assembly.length;i++){var row=DATA.assembly[i],a=row.anchors[k];times.push(row.time);pp.push([[a[0],a[1]],[1245,ys[k]],[1320,ys[k]]]);dots.push([a[0],a[1]]);}var leader=line(pp[0],r('5E7C82'),1.4,5.5,9.2,'Tracked part leader');keyshape(leader,times,pp);X.fade(leader,5.5,5.9,8.8,9.2);var dot=disc(c,'Projected anchor',dots[0][0],dots[0][1],8,C.blue,5.5,9.2);M.key(M.pos(dot),times,dots,{linear:true});X.fade(dot,5.5,5.9,8.8,9.2);show(t('0'+(k+1)+' / '+labels[k],30,1350,ys[k],C.ink,5.5,9.2,true),5.5+k*.12,14);}
 phrase('合而为一。',64,92,235,550,10.2,D);t('闭合完成',24,1450,840,C.green,12.6,D);X.checked(c,'Assembly seated',1340,840,C.green,12.6,D,16);
}
if(ID==='map-journey'){
 bg('EDF4FA','F7FAF7');label(C.blue,'RELAY','GEOGRAPHIC STORY','路径为叙事示意 · 地理底图：Natural Earth / Public Domain');
 phrase('跨越距离，接续同一个想法。',60,110,190,1700,.2,D);
 for(var lon=-180;lon<=180;lon+=30){var xx=220+(lon+180)/360*1480;line([[xx,300],[xx,910]],r('DDE7E8'),.6);}
 for(var lat=-60;lat<=60;lat+=30){var yy=250+(90-lat)/180*690;line([[220,yy],[1700,yy]],r('DDE7E8'),.6);}
 for(var i=0;i<DATA.map.land.length;i++)M.path(c,'Natural Earth land '+i,DATA.map.land[i],r('CEDDD9'),null,0,[0,0],true,0,D);
 var labels=['旧金山','纽约','伦敦'],ts=[2.5,5.5,7.8];for(var i=0;i<3;i++){var city=DATA.map.cities[i],p=city.point;var dot=disc(c,city.name,p[0],p[1],15,C.blue,ts[i],D);show(dot,ts[i],0);var rr=X.ring(c,'Arrival pulse',p[0],p[1],24,C.blue,2,ts[i],ts[i]+1.5);X.scale(rr,[ts[i],ts[i]+1.5],[80,350]);X.off(rr,ts[i]+.1,ts[i]+1.5);var dx=[-82,28,30][i],dy=[47,76,-43][i];t(labels[i],26,p[0]+dx,p[1]+dy,C.ink,ts[i],D);}
 var rt=[2.5,5.5],en=[5.5,7.8];for(var i=0;i<2;i++){var route=DATA.map.routes[i];var routeLayer=X.line(c,'Great-circle route '+i,route,C.blue,4,rt[i],D),trim=N.trim(routeLayer,rt[i],en[i]);M.key(trim.property('ADBE Vector Trim End'),[rt[i],en[i]],[0,100],{linear:true});var cumulative=[0];for(var j=1;j<route.length;j++){var dx=route[j][0]-route[j-1][0],dy=route[j][1]-route[j-1][1];cumulative.push(cumulative[j-1]+Math.sqrt(dx*dx+dy*dy));}var tt=[],vv=[];for(var j=0;j<route.length;j++){tt.push(rt[i]+(en[i]-rt[i])*cumulative[j]/cumulative[cumulative.length-1]);vv.push(route[j]);}var moving=disc(c,'Journey marker',route[0][0],route[0][1],12,C.coral,rt[i],en[i]);M.key(M.pos(moving),tt,vv,{linear:true});}
 t('01 / 出发',30,320,955,C.blue,2.5,5.5);t('02 / 接续',30,960,955,C.blue,5.5,7.8);t('03 / 汇合',30,1570,955,C.blue,7.8,10.5);show(t('一条叙事路径。三个真实地理坐标。',28,960,955,C.ink,10.5,D),10.5,15);
}
if(ID==='editorial-story'){
 bg('FAF6ED','ECEFE4');label(C.coral,'BUILD LOG','A DEVELOPMENT STORY','真实本地制作记录 · 展示迭代内容，不将版本数量视作商业验收');
 phrase('能力，在一次次修订中生长。',63,110,210,1700,.2,D);
 var xs=[285,735,1185,1635],names=['任务与结果','节奏与细节','独立新场景','答案与来源'],details=['一念协作 / DataTalk','转场 / 音画 / 排版','PULSE / SHIFT / LOOP','TRACE / 引用回看'],versions=['3.2','3.3','3.4','3.5'],at=[1.2,4.7,8.2,11.7];
 line([[180,780],[1740,780]],C.line,2);for(var i=0;i<4;i++){var x=xs[i];var pole=line([[x,780],[x,705]],C.green,4,at[i],D);N.trim(pole,at[i],at[i]+.8);var dot=disc(c,'Version node',x,780,18,C.green,at[i],D);show(dot,at[i],0);show(t(versions[i],94,x,435,C.green,at[i],D,false,'HelveticaNeue-Thin'),at[i],32);show(t(names[i],31,x,580,C.ink,at[i]+.25,D),at[i]+.25,20);show(t(details[i],20,x,650,C.muted,at[i]+.35,D),at[i]+.35,10);t('BUILD 0'+(i+1),18,x,835,C.muted,at[i],D,false,'HelveticaNeue-Medium');}
}
if(ID==='stage-opening'){
 bg('F6F3E9','EAF3F6');
 var bands=[];for(var i=0;i<7;i++){var l=U.rect(c,'Ribbon '+i,2350,125,r(['D9EEE9','C4E2DF','A8D5D0','7FB9B7','C0D9E8','D4E5ED','E4EDF0'][i]),960,-200+i*190,62);U.key(M.rotation(l),[0,3,8.2,11.5],[-26,-16,18,0],'travel');X.move(l,[0,3,5.5,8.2,11.5],[[960,-450+i*180],[960,-250+i*220],[960,1450+i*90],[960,260+i*105],[960,1500+i*120]]);bands.push(l);}
 phrase('让',230,800,460,500,.1,3.0);phrase('下一步',180,480,470,1100,3,5.5);phrase('发生。',210,620,460,1000,5.5,8.2);
 var arrow=M.path(c,'Forward contour',[[-300,-180],[100,-180],[300,0],[100,180],[-300,180],[-100,0]],null,C.blue,22,[960,540],false,8.2,11.5);N.trim(arrow,8.2,9.4);X.scale(arrow,[8.2,9.7,11.5],[70,100,170]);X.off(arrow,10.8,11.5);
 phrase('NEXT',210,650,450,950,11.5,D,C.blue);t('TECHNOLOGY FORUM',30,960,670,C.ink,11.7,D,false,'HelveticaNeue-Medium');t('从想法，到下一步。',31,960,760,C.muted,11.9,D);
}
function broadcast(co){
 var bug=U.rect(co,'Station bug',230,58,C.green,230,126,9,1,D);show(bug,1,0);tx(co,'FIELD NOTES',21,230,126,C.white,1,D,false,'HelveticaNeue-Bold');
 var lower=U.comp('FIELD / nameplate',760,160,D,true);U.rect(lower,'Identity',760,160,C.white,380,80,12);U.rect(lower,'Accent',12,160,C.coral,6,80,0);tx(lower,'科技现场',38,46,55,C.ink,0,D,true);tx(lower,'OPEN LAB / 原创节目包装示例',23,46,116,C.muted,0,D,true);
 var l=U.add(co,lower,'Speaker nameplate',490,850,1,3,6.8);X.move(l,[3,3.65,6.1,6.8],[[490,1170],[490,850],[490,850],[490,1170]]);
 var chapter=U.comp('FIELD / chapter',1720,270,D,true);U.rect(chapter,'Chapter paper',1720,270,r('E7F1E9'),860,135,16);tx(chapter,'02',125,140,135,C.green,0,D,false,'HelveticaNeue-Thin');tx(chapter,'让界面理解意图',64,330,111,C.ink,0,D,true);tx(chapter,'DESIGNING WHAT COMES NEXT',24,335,204,C.muted,0,D,true,'HelveticaNeue-Medium');var ch=U.add(co,chapter,'Chapter transition',960,540,1,7,10.5);X.move(ch,[7,7.65,9.9,10.5],[[-1000,540],[960,540],[960,540],[2950,540]]);
 tx(co,'FIELD NOTES / END OF SEGMENT',25,960,935,C.green,10.5,D,false,'HelveticaNeue-Medium');
}
if(ID==='broadcast-package'){
 bg('E7F1ED','F9F5EB');
 // An abstract lit studio plate is only for viewing the transparent graphics.
 for(var i=0;i<10;i++){var l=U.rect(c,'Studio panel',240,1300,r(i%2?'E1EBE8':'EDF4F0'),100+i*220,580,70);M.rotation(l).setValue(-14);}
 t('OPEN LAB',100,960,420,r('99B7B0'),0,D,false,'HelveticaNeue-Thin');t('透明播出包装 / 展示底板',23,960,560,C.muted);broadcast(c);var ac=U.comp('Alpha / broadcast-package',1920,1080,D,false);broadcast(ac);
}
if(ID==='exhibition-loop'){
 bg('F3F4EB','EAF3F0');label(C.green,'OPEN LAB','EXPLORE AT YOUR OWN PACE','科技展厅概念 / 无声循环 · 任何时刻进入，都能独立阅读');
 t('从这里，探索 AI。',70,960,215,C.ink);var xs=[370,960,1550],titles=['感知','推理','创造'],english=['SENSE','REASON','CREATE'],sub=['让信息被看见','让关系被理解','让想法有形状'];
 for(var k=0;k<3;k++){var co=U.comp('Exhibit / '+k,460,460,D,false);for(var i=0;i<7;i++){var q;if(k===0){q=X.ring(co,'Sensing orbit',230,230,110+i*45,r('82B6A9'),2);X.scale(q,[0,4,8,12,16],[100,101+i*2,100,99-i,100]);}else if(k===1){q=U.rect(co,'Reason unit',55,55,r(i%2?'547EAC':'8ABAAA'),230+145*Math.cos(i*2*Math.PI/7),230+145*Math.sin(i*2*Math.PI/7),15);M.rotation(q).setValue(i*360/7);U.key(M.rotation(q),[0,8,16],[i*360/7,i*360/7+180,i*360/7+360],'quiet');}else{q=M.path(co,'Create petal',[[0,-145],[85,-50],[0,145],[-85,50]],null,r(i%2?'CE9463':'83AC92'),2.8,[230,230],true);M.key(M.rotation(q),[0,16],[i*360/7,i*360/7+360],{linear:true});}}
 var lay=U.add(c,co,'Exhibit motif '+k,xs[k],550,1);t('0'+(k+1),24,xs[k],850,C.muted,0,D,false,'HelveticaNeue-Medium');t(titles[k],42,xs[k],770,C.ink);t(english[k],20,xs[k],910,C.green,0,D,false,'HelveticaNeue-Medium');t(sub[k],23,xs[k],960,C.muted);}
}
if(ID==='interface-feedback'){
 bg('EFF3F7','F9F6ED');label(C.blue,'READY','INTERACTION STATES','附可运行组件 · 支持取消、失败重试、过期请求拦截与减少动态效果');
 phrase('每一次操作，都有回应。',65,110,205,1700,.2,D);
 var surface=card(c,'Persistent status surface',980,410,960,560,C.white);show(surface,.5,0);var starts=[.5,2,4.1,5.5,7.2],ends=[2,4.1,5.5,7.2,D],states=['准备就绪','正在处理','连接失败','重新尝试','已完成'],cols=[C.blue,C.blue,C.coral,C.blue,C.green];
 for(var i=0;i<5;i++){var st=U.comp('READY / '+states[i],1000,430,D,true);disc(st,'State color',160,200,100,cols[i]);if(i===4)X.checked(st,'Success mark',160,200,C.white,starts[i],ends[i],30);else tx(st,i===2?'!':i===0?'→':'·',54,160,200,C.white,0,D,false,'HelveticaNeue-Medium');tx(st,states[i],48,280,175,C.ink,0,D,true);tx(st,['随时开始','操作仍在进行，可以取消','保留输入，允许重试','只接受当前请求的结果','结果已保存'][i],26,280,252,C.muted,0,D,true);var l=U.add(c,st,'State '+states[i],960,560,1,starts[i],ends[i]);show(l,starts[i],12);}
 line([[400,880],[1520,880]],C.line,3);for(var i=0;i<5;i++){disc(c,'State index',400+i*280,880,16,cols[i],starts[i],D);t(['就绪','进行中','失败','重试','成功'][i],22,400+i*280,940,C.muted);}
 // Real native animated waiting dot, independent from completion status.
 for(var k=0;k<3;k++){var p=disc(c,'Loading pulse',728+k*18,560,9,C.white,2,4.1);U.key(M.opacity(p),[2,2.35+k*.12,2.85+k*.12,3.35+k*.12,4.1],[20,100,20,100,20],'quiet');}
}
if(ID==='footage-callouts'){
 bg('F7F3E9','EDF4EE');label(C.green,'ANCHOR','NATIVE POSITION TRACKING','Technical demo · (CC) Blender Foundation | mango.blender.org · CC BY 3.0');
 phrase('让说明，留在真实空间里。',59,100,205,1700,.2,D);
 M.footage(c,'Licensed tracked camera plate',MEDIA.tracking,1280,[1120,595],0,D);
 t('一次取点。\n连续跟随。',43,100,410,C.ink,0,D,true);t('EffectCraft 原生跟踪\n360 帧 / 位置 XY\n刚性锚点技术演示',23,100,580,C.muted,0,D,true);
 var ts=[],pos=[],paths=[];for(var i=0;i<DATA.tracking.frames.length;i++){var f=DATA.tracking.frames[i],x=f.position[0]+480,y=f.position[1]+328;ts.push(f.time);pos.push([x,y]);paths.push([[x,y],[x+72,y-100],[x+260,y-100]]);}
 var lead=line(paths[0],C.white,2,2,10.5,'Tracking leader');keyshape(lead,ts,paths);X.fade(lead,2,2.4,10.2,10.5);
 var ring=X.ring(c,'Tracked attach target',pos[0][0],pos[0][1],30,C.white,2,2,10.5);M.key(M.pos(ring),ts,pos,{linear:true});
 var call=U.comp('ANCHOR / caption',250,64,D,true);U.rect(call,'Caption',250,64,C.white,125,32,10);tx(call,'锚点 / 连续跟随',23,125,32,C.ink);var lay=U.add(c,call,'Tracked caption',pos[0][0]+190,pos[0][1]-130,1,2,10.5);var pp=[];for(var i=0;i<pos.length;i++)pp.push([pos[i][0]+190,pos[i][1]-130]);M.key(M.pos(lay),ts,pp,{linear:true});
 t('实拍片段经截取、静音、重构画幅与图形叠加；人物不代表产品背书。',19,1120,940,C.muted,0,D);
}
if(ID==='title-sequence'){
 bg('F7EBDD','E3ECEB');
 // A shifting field of related curves becomes a quiet opening in the centre.
 for(var i=0;i<52;i++){var pts=[],ph=i*.125;for(var j=0;j<=50;j++){var x=-1100+j*44,y=Math.sin(j*.11+ph)*170+Math.sin(j*.037+ph)*85;pts.push([x,y]);}var q=M.path(c,'Interference line '+i,pts,null,r(i%3?'A0B8B1':'C58F66'),1.2,[960,100+i*18],false,0,D);X.move(q,[0,4,8.2,12.4,16],[[960,100+i*18],[930,60+i*20],[990,-100+i*25],[960,-400+i*38],[960,-400+i*38]]);U.key(M.rotation(q),[0,4,8.2,12.4],[i*.12-3,i*.1+2,i*.1-4,0],'quiet');}
 var veil=U.rect(c,'Title paper',960,390,r('F4EFE5'),960,540,24,11.7,D);show(veil,11.7,0);t('在信息与理解之间',32,960,520,C.ink,.6,4);t('在问题与答案之间',32,960,520,C.ink,4,8.2);t('在今天与可能之间',32,960,520,C.ink,8.2,11.7);
 phrase('BETWEEN',116,630,490,1200,12.4,D);show(t('思考之间',37,960,645,C.ink,12.6,D),12.6,20);t('AN ORIGINAL TECHNOLOGY TITLE STUDY',17,960,1010,C.muted,0,D,false,'HelveticaNeue-Medium');
}
