(function(){
 var M=MuseNative,r=V.r,D=18,c=U.comp('一念协作 / One shared result',1920,1080,D,false),paper=r('F0F3EB'),green=r('235C4C'),sage=r('AFCBBB'),blue=r('768BBF'),coral=r('CE9A7D'),ink=r('244A40'),muted=r('698577'),white=r('FFFDF6');
 F.base(c,paper);M.gradient(c,'Warm green daylight',[1920,1080],[950,420],[1950,1150],0,D,r('FAFAF3'),r('E2EADF'),true);
 V.tx(c,'Early identity','一念协作',27,green,92,83,0,12.6,true);V.tx(c,'Early value','THINK TOGETHER. MAKE TOGETHER.',17,muted,1460,84,0,12.6,false,'HelveticaNeue-Medium');
 var headline=V.tx(c,'One idea','一个想法，',146,green,770,413,0,2.75,false);V.pos(headline,[[0,[770,580]],[.65,[770,413],'out'],[2.25,[770,413]],[2.75,[770,130],'in']]);V.alpha(headline,[[0,0],[.45,100],[2.25,100],[2.75,0]]);
 var go=V.tx(c,'Begin together','开始协作。',146,green,1130,624,.2,2.9,false);V.pos(go,[[.2,[1130,790]],[.85,[1130,624],'out'],[2.35,[1130,624]],[2.9,[1130,900],'in']]);V.alpha(go,[[.2,0],[.65,100],[2.35,100],[2.9,0]]);
 var world=U.comp('一念 / Artifacts to one website',1920,1080,D,false);
 var colors=[green,blue,coral],cx=[350,960,1570],role=['内容','设计','构建'];
 // The task's three strands become the rules under the assembled content.
 for(var j=0;j<3;j++){
  var pts=[[960,247],[960,300],[cx[j],300],[cx[j],330]],dest=[[365+j*430,850],[465+j*430,850],[565+j*430,850],[665+j*430,850]];
  var path=U.line(world,'Task strand '+j,pts,colors[j],4,2.45,12.8);N.trim(path,2.45+j*.13,3.35+j*.13);V.shapeKeys(path,[[2.45,pts],[6.7,pts],[8.95,dest]],false);V.alpha(path,[[2.45,70],[6.7,70],[8.95,35],[12.8,35]]);
  var lab=V.tx(world,'Role '+j,'0'+(j+1)+' / '+role[j],24,colors[j],cx[j],365,3.05+j*.1,7.45,false);V.alpha(lab,[[3.05+j*.1,0],[3.55+j*.1,100],[6.75,100],[7.45,0]]);
 }
 var task=V.tx(world,'Persistent task','ROAM · 旅行灵感网站',42,green,960,220,2.4,9.3,false);V.alpha(task,[[2.4,0],[3.05,100],[7.0,100],[7.55,0]]);
 // Right-hand build frame becomes the actual page surface.
 var surface=V.rect(world,'Build frame becomes page',390,444,white,1570,615,3.4,D,24);V.shadow(surface,14,38);
 V.pos(surface,[[3.4,[1570,695]],[4.15,[1570,615],'out'],[6.7,[1570,615]],[8.95,[960,520]]]);
 V.key(M.shapeSize(surface),[[3.4,[390,444]],[6.7,[390,444]],[8.95,[1280,760]]]);V.alpha(surface,[[3.4,0],[4.05,100]]);
 var frameLine=U.line(world,'Layout wireframe',[[1420,500],[1720,500],[1720,745],[1420,745],[1420,500]],sage,2,3.85,7.35);N.trim(frameLine,3.85,4.55);V.alpha(frameLine,[[3.85,0],[4.45,100],[6.7,100],[7.35,0]]);
 var rule=U.line(world,'Layout header',[[1420,548],[1720,548]],sage,2,4.1,7.35);N.trim(rule,4.1,4.6);V.alpha(rule,[[4.1,0],[4.6,100],[6.7,100],[7.35,0]]);
 for(var n=0;n<3;n++){var wr=V.rect(world,'Layout region '+n,78,90,r('EAF0E7'),1464+n*106,632,4.3+n*.1,7.35,6);V.scale(wr,[[4.3+n*.1,0],[4.85+n*.1,100,'out']]);V.alpha(wr,[[4.3+n*.1,0],[4.8+n*.1,100],[6.7,100],[7.35,0]]);}
 // Photo is a real deliverable asset; its crop expands into the hero region.
 var im=app.project.importFile(new ImportOptions(new File(SOURCE_ROOT+'/media/roam-coast.png')));
 var photo=U.comp('ROAM / Hero crop',1200,396,D,false);var pil=photo.layers.add(im);var fit=Math.max(1200/im.width,396/im.height)*100;M.scale(pil).setValue([fit,fit]);M.pos(pil).setValue([600,198]);
 var image=V.add(world,photo,'Same photograph throughout',960,590,.4,3.3,D);V.pos(image,[[3.3,[960,690]],[4.05,[960,590],'out'],[6.75,[960,590]],[8.9,[960,480]]]);V.scale(image,[[3.3,32],[4.05,40,'out'],[6.75,40],[8.9,100]]);V.alpha(image,[[3.3,0],[3.95,100]]);
 // Design tokens travel into the website's button, preserving their identity.
 var token=V.rect(world,'Design token becomes button',100,48,r('E8D4A3'),860,750,3.85,D,24);V.pos(token,[[3.85,[860,790]],[4.4,[860,750],'out'],[6.9,[860,750]],[8.95,[510,616]]]);V.key(M.shapeSize(token),[[3.85,[100,48]],[6.9,[100,48]],[8.95,[182,49]]]);
 var tok2=V.rect(world,'Design green token',100,48,green,990,750,3.95,7.5,24);V.alpha(tok2,[[3.95,0],[4.5,100],[6.9,100],[7.5,0]]);
 var tok3=V.rect(world,'Design paper token',100,48,r('E5EADC'),1120,750,4.05,7.5,24);V.alpha(tok3,[[4.05,0],[4.6,100],[6.9,100],[7.5,0]]);
 // Actual content stays as the same text layer while it moves onto the photo.
 var text=V.tx(world,'Persistent headline','去发现。',82,green,350,480,3.15,D,false);V.pos(text,[[3.15,[350,560]],[3.85,[350,480],'out'],[7.15,[350,480]],[8.95,[602,433]]]);V.scale(text,[[3.15,85],[3.85,100],[7.15,100],[8.95,123]]);U.colorText(text,green).setValue(green);V.alpha(text,[[3.15,0],[3.75,100]]);
 var sub=V.tx(world,'Persistent subhead','未曾抵达的风景。',26,muted,350,560,3.35,D,false);V.pos(sub,[[3.35,[350,625]],[4.0,[350,560],'out'],[7.2,[350,560]],[8.95,[601,521]]]);V.scale(sub,[[3.35,100],[7.2,100],[8.95,139]]);U.colorText(sub,muted).setValue(muted);V.alpha(sub,[[3.35,0],[3.9,100]]);
 // The same words turn white exactly where the moving photograph passes behind them.
 function whiteOnPhoto(original,name){
  var wl=original.duplicate();wl.name=name;U.colorText(wl,white).setValue(white);
  var matte=V.rect(world,name+' photo window',1200,396,white,960,590,3.3,D);
  V.pos(matte,[[3.3,[960,690]],[4.05,[960,590],'out'],[6.75,[960,590]],[8.9,[960,480]]]);
  V.scale(matte,[[3.3,32],[4.05,40,'out'],[6.75,40],[8.9,100]]);wl.setTrackMatte(matte,TrackMatteType.ALPHA);
 }
 whiteOnPhoto(text,'Headline in photograph');whiteOnPhoto(sub,'Subhead in photograph');
 var topics=['城市漫游','海岸路线','山野徒步'];
 for(var k=0;k<3;k++){
  var pc=U.comp('ROAM / Topic '+k,370,60,D,false);V.rect(pc,'Topic paper',370,60,k===1?green:r('E3EBDD'),185,30,0,D,10);V.tx(pc,'Topic label',topics[k],25,k===1?white:green,185,30,0,D,false);
  var pl=V.add(world,pc,'Same topic '+k,350,650+k*76,1,3.6+k*.12,D);var a=6.9+(2-k)*.12;
  V.pos(pl,[[3.6+k*.12,[350,700+k*76]],[4.25+k*.12,[350,650+k*76],'out'],[a,[350,650+k*76]],[a+.7,[530+k*430,905-k*25]],[9.15,[530+k*430,796]]]);
  V.alpha(pl,[[3.6+k*.12,0],[4.15+k*.12,100]]);
 }
 // New page chrome appears only after the moving artifacts have a place to land.
 var brand=V.tx(world,'Page wordmark','ROAM',34,green,369,206,8.35,D,true,'HelveticaNeue-Bold');V.alpha(brand,[[8.35,0],[8.95,100]]);
 var nav=V.tx(world,'Page navigation','目的地     灵感     关于',18,green,1465,206,8.5,D,false);V.alpha(nav,[[8.5,0],[9.05,100]]);
 var eye=V.tx(world,'Page editorial','GO SOMEWHERE NEW.',17,white,425,350,8.5,D,true,'HelveticaNeue-Medium');V.alpha(eye,[[8.5,0],[9.05,100]]);
 var bt=V.tx(world,'Button label','开始漫游 ↗',21,green,510,616,8.6,D,false);V.alpha(bt,[[8.6,0],[9.15,100]]);
 var ask=V.tx(world,'Page topic heading','下一程，想去哪里？',28,green,370,716,8.5,D,true);V.alpha(ask,[[8.5,0],[9.1,100]]);
 var descriptor=V.tx(world,'Page closing detail','沿着海岸，把脚步放慢。',22,muted,375,867,9.1,D,true);V.alpha(descriptor,[[9.1,0],[9.5,100]]);
 var globe=V.add(c,world,'Continuous assembled artifacts',960,540,1,0,D);V.pos(globe,[[0,[960,540]],[12.3,[960,540]],[13.65,[1290,585]],[18,[1290,585]]]);V.scale(globe,[[0,100],[12.3,100],[13.65,72],[18,72]]);
 var finalIdentity=V.tx(c,'Final identity','一念协作',55,green,110,342,13.0,D,true);V.alpha(finalIdentity,[[13,0],[13.65,100]]);V.pos(finalIdentity,[[13,[110,392]],[13.65,[110,342],'out']]);
 var promise=V.tx(c,'Final value','一起完成。',108,green,110,507,13.3,D,true);V.alpha(promise,[[13.3,0],[13.95,100]]);V.pos(promise,[[13.3,[110,587]],[13.95,[110,507],'out']]);
 V.tx(c,'Final description','从分工，到一个完整结果。',30,muted,114,666,14,D,true);
 for(var z=0;z<3;z++){var bar=V.rect(c,'Shared identity strand '+z,186,14,colors[z],207,779+z*28,13.7,D,7);V.scale(bar,[[13.7+z*.08,[0,100]],[14.3+z*.08,[100,100],'out']]);}
 c.openInViewer();
})();
