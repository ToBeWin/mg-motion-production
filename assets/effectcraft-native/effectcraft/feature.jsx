(function(){
 var M=MuseNative,r=M.rgb,ink=r('23212B'),paper=r('F4F0E8'),purple=r('7152E8'),coral=r('EC7250');
 var c=M.comp('04 一念 — Theme Sync',1920,1080,14,30);c.bgColor=paper;c.motionBlurSamplesPerFrame=6;
 M.rect(c,'Warm paper',[1920,1080],paper,[960,540]);
 function tx(comp,name,s,size,col,x,y,a,b){return M.text(comp,name,s,size,col,[x,y],'HiraginoSansGB-W6',a||0,b||14);}
 tx(c,'Series','一念 / STUDIO',26,ink,235,80);tx(c,'Scene','FEATURE / 04',20,r('7C7782'),1660,80);
 var ctrl=M.group(c,'Brand controls',0,14),color=ctrl.property('ADBE Effect Parade').addProperty('ADBE Color Control');color.name='Accent';M.key(color.property('Color'),[0,5.2,5.8,14],[purple,purple,coral,coral]);
 var colorExpression="comp('04 一念 — Theme Sync').layer('Brand controls').effect('Accent')('Color')";
 function accent(l){N.fill(l).expression=colorExpression;return l;}
 function ribbon(comp,x,y,w,h){
  var mask=M.rect(comp,'Artwork silhouette',[w,h],[1,1,1],[x,y],12),art=M.rect(comp,'Shared brand field',[w,h],purple,[x,y],12);accent(art);art.setTrackMatte(mask,TrackMatteType.ALPHA);
  for(var k=0;k<3;k++){
   var ring=M.shape(comp,'Concentric artwork '+k,'ellipse',[w*.68+k*w*.18,w*.68+k*w*.18],null,[x+w*.24,y+h*.3],0,r('F6ECD9'),Math.max(6,w*.035));ring.setTrackMatte(mask,TrackMatteType.ALPHA);
   M.rotation(ring).expression='time*8';
  }
  return art;
 }
 var web=M.comp('Theme / Website',700,550,14,30);M.rect(web,'Window',[700,550],r('FFFFFF'),[350,275],24);
 tx(web,'Name','线索 / CLUE',26,ink,125,45);tx(web,'Nav','设计     灵感     关于',17,r('74717B'),515,45);
 ribbon(web,350,254,644,330);tx(web,'Hero','发现日常，',52,r('FFF9EC'),231,209);tx(web,'Hero 2','新的角度。',52,r('FFF9EC'),231,278);
 accent(M.rect(web,'CTA',[180,48],purple,[118,485],24));tx(web,'CTA label','开始探索 ↗',20,r('FFFFFF'),118,485);
 tx(web,'Description','留意细节，让想法发生。',21,r('7B7580'),445,485);
 var poster=M.comp('Theme / Poster',400,550,14,30);M.rect(poster,'Paper',[400,550],r('F5ECDD'),[200,275],10);ribbon(poster,200,320,356,330);
 tx(poster,'Poster brand','CLUE',66,ink,200,70);tx(poster,'Poster edition','DESIGN IS EVERYWHERE',14,r('73707A'),200,123);tx(poster,'Poster footer','发现 / 每一天',24,ink,200,510);
 var phone=M.comp('Theme / Mobile',290,550,14,30);M.rect(phone,'Device',[290,550],ink,[145,275],42);M.rect(phone,'Screen',[272,532],r('FFFEFA'),[145,275],34);M.rect(phone,'Speaker',[72,14],ink,[145,26],7);
 tx(phone,'Mobile brand','CLUE',31,ink,145,85);ribbon(phone,145,265,238,280);tx(phone,'Mobile title','灵感，随身。',29,ink,145,455);accent(M.rect(phone,'Mobile action',[212,36],purple,[145,510],18));tx(phone,'Mobile arrow','探索  ↗',17,r('FFFFFF'),145,510);
 var comps=[web,poster,phone],pos=[370,1040,1585],z=[80,-30,20],sc=[86,91,91],names=['网页','海报','移动端'];
 for(var i=0;i<3;i++){
  var l=M.setup(c.layers.add(comps[i]),'Live design '+names[i],[pos[i],570],0,14);l.threeDLayer=true;
  M.key(M.pos(l),[0,2,3.5,10.5,12.1,14],[[1330+i*45,580+i*18,150-i*180],[1330+i*45,580+i*18,150-i*180],[pos[i],575,z[i]],[pos[i],575,z[i]],[1210+i*200,570,200-i*180],[1210+i*200,570,200-i*180]]);
  M.key(M.scale(l),[0,2,3.5,10.5,12.1,14],[[66,66,100],[66,66,100],[sc[i],sc[i],100],[sc[i],sc[i],100],[62,62,100],[62,62,100]]);
  var yr=l.property('ADBE Transform Group').property('ADBE Rotate Y');M.key(yr,[0,2,3.5,9.9,12.1,14],[-19+i*6,-19+i*6,0,0,-13+i*12,-13+i*12]);N.shadow(l,14,16,32);
  var label=tx(c,'Touchpoint '+i,names[i],24,r('857C86'),pos[i],888,3.2,10.7);M.key(M.opacity(label),[3.2,3.9,10.1,10.7],[0,100,100,0]);
 }
 var cam=N.camera(c,'Native camera — fan to front');M.key(M.pos(cam),[0,2,3.5,10.5,12.1,14],[[900,500,-2200],[900,500,-2200],[960,540,-2200],[960,540,-2200],[910,510,-2200],[910,510,-2200]]);
 var a=tx(c,'Opening 1','一次改变。',91,ink,480,418,0,2.5);N.reveal(a,0,.7,44);M.key(M.opacity(a),[0,2,2.5],[100,100,0]);
 a=tx(c,'Opening 2','完整焕新。',91,ink,480,542,.15,2.5);N.reveal(a,.15,.85,44);M.key(M.opacity(a),[0,2,2.5],[100,100,0]);
 a=tx(c,'Action title','让品牌色，贯穿每个触点。',64,ink,960,205,2.7,10.5);N.reveal(a,2.7,3.45,28);M.key(M.opacity(a),[2.7,9.8,10.5],[100,100,0]);
 var tray=M.rect(c,'Palette surface',[278,76],r('FFFFFF'),[960,978],38,3.6,10.4);N.shadow(tray,10,5,15);M.key(M.opacity(tray),[3.6,4,9.8,10.4],[0,100,100,0]);
 for(var i=0;i<3;i++){var p=M.circle(c,'Palette '+i,43,[purple,coral,r('3C8173')][i],[880+i*80,978],3.6,10.4);M.key(M.opacity(p),[3.6,4,9.8,10.4],[0,100,100,0]);}
 var sel=M.shape(c,'Selected colour','ellipse',[57,57],null,[880,978],0,ink,2,3.6,10.4);M.key(M.pos(sel),[3.6,5.2,5.55,10.4],[[880,978],[880,978],[960,978],[960,978]]);M.key(M.opacity(sel),[3.6,4,9.8,10.4],[0,100,100,0]);
 var cursor=M.path(c,'Cursor',[[0,0],[0,30],[8,23],[15,36],[22,32],[15,20],[27,20]],r('FFFFFF'),ink,2,[1120,1080],true,4.2,6.5);M.key(M.pos(cursor),[4.2,5.2,5.34,5.5,6.5],[[1120,1080],[960,978],[960,978],[970,993],[1120,1080]]);
 var ripple=M.shape(c,'Click response','ellipse',[45,45],null,[960,978],0,coral,3,5.2,5.9);M.key(M.scale(ripple),[5.2,5.9],[[100,100],[230,230]]);M.key(M.opacity(ripple),[5.2,5.9],[75,0]);
 for(var i=0;i<3;i++){
  var trail=N.line(c,'Propagation '+i,[[960,936],[960,922],[pos[i],922],[pos[i],860]],coral,2,5.25,6.8);N.trim(trail,5.25+i*.1,5.95+i*.1);M.key(M.opacity(trail),[5.25,6.2,6.8],[40,40,0]);
 }
 var done=tx(c,'Sync feedback','一个颜色变量 · 三处同步',27,r('5D5A66'),960,292,6.1,10.1);N.reveal(done,6.1,6.7,14);M.key(M.opacity(done),[6.1,9.7,10.1],[100,100,0]);
 a=tx(c,'Close 1','改一处。',93,ink,430,445,11.3,14);N.reveal(a,11.3,12,40);
 a=tx(c,'Close 2','焕新每一处。',76,coral,430,565,11.5,14);N.reveal(a,11.5,12.2,40);
 tx(c,'Concept','设计系统功能 · 概念演示',19,r('8D858B'),960,1050);
 c.openInViewer();
})();
