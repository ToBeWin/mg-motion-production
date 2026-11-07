/* CLUE / Brand Color. Native editable artwork, bounded text reveals and state continuity. */
(function(){
 var M=MuseNative,r=M.rgb,D=24,FR=30;
 var C={paper:r('F1F0EB'),white:r('FFFEFA'),ink:r('202827'),muted:r('777B74'),line:r('D8DBD3'),coral:r('BE6048'),blue:r('315FF1'),olive:r('68735A')};
 var c=M.comp('CLUE — Brand Color / 24s',1920,1080,D,FR);c.bgColor=C.paper;c.motionBlurSamplesPerFrame=8;
 M.rect(c,'Backdrop',[1920,1080],C.paper,[960,540]);
 var ctrl=M.group(c,'Brand controls',0,D),color=ctrl.property('ADBE Effect Parade').addProperty('ADBE Color Control');color.name='Accent';
 M.key(color.property('Color'),[0,6.6,7.04,D],[C.coral,C.coral,C.blue,C.blue],{influence:45});
 var ex="comp('CLUE — Brand Color / 24s').layer('Brand controls').effect('Accent')('Color')";
 var source=app.project.importFile(new ImportOptions(new File(ASSET_ROOT+'/courtyard.png'))),photoComps=[];
 function tx(co,n,s,size,col,x,y,font,align){var l=M.text(co,n,s,size,col,[x,y],font||'HiraginoSansGB-W3',0,D);if(align!=='center'){var b=l.sourceRectAtTime(0,false);M.anchor(l).setValue([b.left,b.top+b.height/2]);}return l;}
 function en(co,n,s,size,col,x,y,font){return tx(co,n,s,size,col,x,y,font||'HelveticaNeue-Medium');}
 function rect(co,n,w,h,col,x,y,rad){return M.rect(co,n,[w,h],col,[x,y],rad||0);}
 function line(co,n,x,y,w,col){return rect(co,n,w,1,col||C.line,x+w/2,y);}
 function accent(l){N.fill(l).expression=ex;return l;}
 function accentText(l){var e=N.fx(l,'Fill',{'Color':C.coral});e.property('Color').expression=ex;return l;}
 function photo(co,n,x,y,w,h,fx,fy){
  var crop=M.comp(n+' / image crop',w*2,h*2,D,FR);photoComps.push(crop);var p=crop.layers.add(source),sc=Math.max(w/source.width,h/source.height)*100;
  M.scale(p).setValue([sc,sc]);M.pos(p).setValue([w/2+(fx||0),h/2+(fy||0)]);
  var l=M.setup(co.layers.add(crop),n,[x+w/2,y+h/2],0,D);return l;
 }
 function panel(co,n,w,h,col,x,y,rad){var l=M.shape(co,n,'rect',[w,h],col,[x,y],rad||0,C.line,1,0,D);return l;}
 function arrow(co,n,x,y,size,col){return M.path(co,n,[[0,size],[size,0],[size*.12,0],[size,0],[size,size*.88]],null,col,2,[x,y],false,0,D);}
 function bind(co,label,x,y){accent(M.circle(co,label+' token',7,C.coral,[x,y]));en(co,label+' label','BRAND / PRIMARY',10,C.muted,x+11,y);}

 var web=M.comp('Artwork / Website',1920,1320,D,FR);rect(web,'Page',960,660,C.white,480,330);
 en(web,'CLUE wordmark','CLUE',32,C.ink,32,43,'HelveticaNeue-Bold');accent(rect(web,'Brand underline',72,4,C.coral,69,68));
 tx(web,'Navigation','建筑      设计      生活方式',16,C.ink,580,43);en(web,'Issue','ISSUE 024',12,C.muted,822,43);
 photo(web,'Courtyard / wide',32,98,896,350,0,15);
 accent(rect(web,'Issue badge',112,31,C.coral,106,127,3));en(web,'Issue badge type','FIELD NOTES',11,C.white,64,127);
 tx(web,'Editorial heading','光，塑造空间。',48,C.ink,32,509,'HiraginoSansGB-W6');
 tx(web,'Editorial deck','在光影与留白之间，重新发现日常。',18,C.muted,34,565);
 en(web,'Editorial meta','ARCHITECTURE  /  06 MIN READ',11,C.muted,34,613);
 accent(rect(web,'Read story',161,46,C.coral,846,553,23));tx(web,'Read story label','阅读故事',16,C.white,784,553);arrow(web,'Read story arrow',891,545,14,C.white);
 line(web,'Footer rule',32,640,896);bind(web,'Token evidence',783,612);

 var poster=M.comp('Artwork / Poster',900,1260,D,FR);rect(poster,'Stock',450,630,r('FBF8F0'),225,315);
 accentText(en(poster,'Large CLUE','CLUE',112,C.coral,24,70,'HelveticaNeue-Bold'));
 en(poster,'Edition','VOLUME 024',11,C.ink,28,137);en(poster,'Discipline','ART / SPACE / LIFE',10,C.muted,289,137);
 photo(poster,'Courtyard / portrait',28,164,394,306,-64,0);
 accent(M.circle(poster,'Round publisher stamp',74,C.coral,[365,456]));arrow(poster,'Publisher stamp arrow',352,443,26,C.white);
 tx(poster,'Poster headline','留白之间',46,C.ink,27,521,'HiraginoSansGB-W6');
 en(poster,'Poster deck','SPACES FOR SLOW LIVING',12,C.muted,29,569);
 accent(rect(poster,'Footer accent',394,5,C.coral,225,598));en(poster,'Poster folio','CLUE JOURNAL',9,C.ink,28,616);en(poster,'Poster number','024 / 2026',9,C.ink,358,616);

 var phone=M.comp('Artwork / Mobile',600,1280,D,FR);rect(phone,'Device rim',300,640,C.ink,150,320,38);rect(phone,'Screen',288,628,C.white,150,320,32);
 en(phone,'Clock','9:41',10,C.ink,28,24);rect(phone,'Speaker',70,17,C.ink,150,23,8);rect(phone,'Battery',17,8,C.ink,264,25,2);
 en(phone,'Mobile CLUE','CLUE',31,C.ink,25,75,'HelveticaNeue-Bold');line(phone,'Menu one',253,68,20,C.ink);line(phone,'Menu two',253,76,20,C.ink);
 accent(rect(phone,'Pill',73,21,C.coral,63,116,10));tx(phone,'Pill label','本期精选',10,C.white,42,116);
 photo(phone,'Courtyard / mobile',18,139,264,245,-34,0);
 en(phone,'Mobile story meta','FIELD NOTES / 024',10,C.muted,25,408);
 tx(phone,'Mobile headline one','把灵感',32,C.ink,24,451,'HiraginoSansGB-W6');tx(phone,'Mobile headline two','带进日常。',32,C.ink,24,493,'HiraginoSansGB-W6');
 accent(rect(phone,'Mobile CTA',250,43,C.coral,150,550,21));tx(phone,'Mobile CTA label','开始阅读',14,C.white,98,550);arrow(phone,'Mobile CTA arrow',232,544,12,C.white);
 tx(phone,'Bottom nav','发现          收藏          我的',10,C.muted,43,596);rect(phone,'Home indicator',95,4,C.ink,150,622,2);

 var inspect=M.comp('UI / Brand inspector',680,1060,D,FR);panel(inspect,'Inspector',340,530,C.white,170,265,18);
 tx(inspect,'Inspector title','品牌样式',24,C.ink,27,39,'HiraginoSansGB-W6');en(inspect,'Inspector subtitle','CLUE / DESIGN SYSTEM',11,C.muted,28,76);line(inspect,'Rule',27,100,286);
 tx(inspect,'Token title','主色',15,C.ink,28,128);en(inspect,'Token ID','brand.primary',12,C.muted,175,128);
 accent(rect(inspect,'Primary swatch',286,115,C.coral,170,210,8));
 var oldHex=en(inspect,'Old hex','#BE6048',21,C.white,47,210,'HelveticaNeue-Medium'),newHex=en(inspect,'New hex','#315FF1',21,C.white,47,210,'HelveticaNeue-Medium');
 oldHex.outPoint=6.8;newHex.inPoint=6.8;
 var palette=[C.coral,C.blue,C.olive,C.ink,r('C6BCA6')];
 for(var i=0;i<5;i++)M.circle(inspect,'Palette '+i,34,palette[i],[45+i*62,310]);
 var selected=M.shape(inspect,'Selected color','ellipse',[44,44],null,[45,310],0,C.ink,1.4);M.key(M.pos(selected),[0,6.6,6.86,D],[[45,310],[45,310],[107,310],[107,310]],{influence:48});
 line(inspect,'Instances rule',27,353,286);tx(inspect,'Instances title','已连接的设计',13,C.muted,28,379);
 var ins=['网站','海报','移动端'];for(var j=0;j<3;j++){accent(M.circle(inspect,'Instance '+j,6,C.coral,[32,413+j*30]));tx(inspect,'Instance label '+j,ins[j],14,C.ink,46,413+j*30);en(inspect,'Instance status '+j,'LINKED',10,C.muted,258,413+j*30);}
 var cur=M.path(inspect,'Pointer',[[0,0],[0,25],[6,19],[13,31],[19,28],[12,17],[24,17]],C.white,C.ink,1.8,[285,425],true,5.65,8.0);
 M.key(M.pos(cur),[5.65,6.5,6.6,6.75,7.65,8],[[285,425],[110,311],[110,311],[113,315],[238,363],[265,380]],{influence:46});
 M.key(M.scale(cur),[6.5,6.6,6.74,6.88],[[100,100],[87,87],[104,104],[100,100]],{influence:32});
 var pulse=M.shape(inspect,'Click feedback','ellipse',[40,40],null,[107,310],0,C.blue,2,6.6,7.2);M.key(M.scale(pulse),[6.6,7.2],[[100,100],[180,180]],{influence:25});M.key(M.opacity(pulse),[6.6,7.2],[80,0],{linear:true});

 // Rasterize editable artwork at twice delivery density so close-ups retain clean type.
 var resized={};
 function multProp(p,k){if(p.numKeys){for(var z=1;z<=p.numKeys;z++){var v=p.keyValue(z);p.setValueAtKey(z,[v[0]*k,v[1]*k]);}}else{var v=p.value;p.setValue([v[0]*k,v[1]*k]);}}
 function upres(co){for(var n=1;n<=co.numLayers;n++){var l=co.layer(n);multProp(M.pos(l),2);if(!(l.source&&resized[l.source.id]))multProp(M.scale(l),2);}resized[co.id]=true;}
 for(var pc=0;pc<photoComps.length;pc++)upres(photoComps[pc]);upres(web);upres(poster);upres(phone);upres(inspect);
 var times=[0,2.4,3.6,4.8,5.85,8.1,9.3,10.8,11.9,13.8,14.8,16.6,17.6,19.4,20.6,24];
 function travel(p,ts,vs){M.key(p,ts,vs,{influence:62});var dim=p.propertyValueType===PropertyValueType.TwoD?2:1;for(var k=1;k<=p.numKeys;k++){var ai=[],ao=[];for(var n=0;n<dim;n++){ai.push(new KeyframeEase(0,76));ao.push(new KeyframeEase(0,32));}p.setTemporalEaseAtKey(k,ai,ao);}}
 function animCard(comp,name,poses,scales,opTimes,opValues,rot){var l=M.setup(c.layers.add(comp),name,poses[0],0,D);N.shadow(l,16,14,32);
  var ts=[],lag=name.indexOf('02')===0?.055:(name.indexOf('03')===0?.11:0);for(var t=0;t<times.length;t++)ts.push(t===0||t===times.length-1?times[t]:times[t]+lag);
  travel(M.pos(l),ts,poses);var ss=[];for(var k=0;k<scales.length;k++)ss.push([scales[k]/2,scales[k]/2]);travel(M.scale(l),ts,ss);
  if(opTimes)M.key(M.opacity(l),opTimes,opValues,{influence:35});if(rot)M.key(M.rotation(l),times,rot,{influence:60});return l;}
 var W=animCard(web,'01 / Website',[[380,730],[380,730],[528,615],[528,615],[-710,615],[-710,615],[528,615],[528,615],[960,599],[947,599],[-760,610],[-760,610],[-760,610],[-760,610],[1230,490],[1230,486]],[68,68,81,81,100,100,81,81,124,125,120,120,120,120,62,62],[0,2.4,3.3,24],[0,0,100,100]);
 var P=animCard(poster,'02 / Poster',[[1370,552],[1358,548],[1216,615],[1216,615],[-400,615],[-400,615],[1216,615],[1216,615],[2055,615],[2055,615],[1290,584],[1284,580],[-490,584],[-490,584],[1500,665],[1496,660]],[128,130,85,85,104,104,85,85,112,112,127,128,127,127,64,64],null,null,[-3,-2,0,0,0,0,0,0,0,0,-1,-1,0,0,3,3]);
 var Q=animCard(phone,'03 / Mobile',[[1870,720],[1870,720],[1631,615],[1631,615],[532,624],[532,624],[1631,615],[1631,615],[2520,615],[2520,615],[2200,615],[2200,615],[1290,586],[1283,582],[1740,712],[1737,706]],[63,63,84,84,111,111,84,84,100,100,118,118,127,128,63,63],[0,2.4,3.5,24],[0,0,100,100]);
 var I=animCard(inspect,'04 / Inspector',[[2350,610],[2350,610],[2350,610],[2350,610],[1302,602],[1302,602],[2350,610],[2350,610],[2350,610],[2350,610],[2350,610],[2350,610],[2350,610],[2350,610],[2350,610],[2350,610]],[120,120,120,120,140,140,120,120,120,120,120,120,120,120,120,120]);

 // A bounded precomposition reveals type within its real rectangle, not the full canvas.
 function title(name,text,x,y,width,size,start,reveal,end,col,font){
  var co=M.comp('Type / '+name,width,size*1.62,D,FR),l=tx(co,name,text,size,col||C.ink,1,size*.78,font||'HiraginoSansGB-W6');
  M.key(M.pos(l),[start,start+reveal],[[1,size*1.9],[1,size*.78]],{influence:62});
  var layer=M.setup(c.layers.add(co),name,[x+width/2,y],start,end);M.key(M.opacity(layer),[start,start+.16,end-.24,end],[0,100,100,0],{linear:true});return layer;
 }
 title('Opening one','一个品牌色。',126,403,900,78,0,.75,2.4);
 title('Opening two','每一份设计。',126,513,900,78,.15,.75,2.4);
 var note=tx(c,'Opening deck','在一念，让品牌保持一致。',25,C.muted,130,631);M.key(M.opacity(note),[0,.6,2.16,2.4],[0,100,100,0],{influence:42});
 title('Overview','让改变，贯穿每个触点。',424,215,1100,60,2.85,.65,4.9);
 title('Action','一次修改。',790,185,600,62,4.95,.58,8.25);
 title('Feedback','网站、海报、移动端。同步。',414,215,1200,58,8.7,.6,11.0);
 title('Poster benefit one','保留版式，',150,406,780,70,14.65,.55,16.65);
 title('Poster benefit two','焕新表达。',150,504,780,70,14.81,.55,16.65);
 title('Mobile benefit one','从桌面，',150,406,780,70,17.48,.55,19.55);
 title('Mobile benefit two','到掌心。',150,504,780,70,17.64,.55,19.55);
 title('End one','改一处。',126,392,900,77,20.5,.6,24.4);
 title('End two','焕新每一处。',126,502,920,77,20.66,.6,24.4,C.blue);
 var proof=tx(c,'End evidence','1 个品牌变量 · 3 份同步设计',25,C.muted,130,619);M.key(M.opacity(proof),[0,20.65,21.2,24],[0,0,100,100],{influence:45});
 var labels=['WEBSITE / 网站','POSTER / 海报','MOBILE / 移动端'];for(var z=0;z<3;z++){var lb=en(c,'Overview label '+z,labels[z],18,C.muted,[185,1023,1514][z],933);M.key(M.opacity(lb),[0,3.4,3.8,4.65,5,8.8,9.3,10.6,10.9,24],[0,0,100,100,0,0,100,100,0,0],{linear:true});}
 var hdr=tx(c,'Product identity','一念',26,C.ink,105,66,'HiraginoSansGB-W6');en(c,'Studio identity','STUDIO',19,C.ink,174,66,'HelveticaNeue-Medium');
 en(c,'Feature label','BRAND COLOR / 01',16,C.muted,1581,66);line(c,'Top hairline',105,106,1710,C.line);
 tx(c,'Concept label','概念功能演示 · CLUE 为虚构设计品牌',14,C.muted,733,1046);
 c.openInViewer();
 $.writeln('Built CLUE 24s; '+c.numLayers+' main layers. Shared accent key at 6.6 seconds.');
})();
