(function(){
 var M=MuseNative,r=M.rgb,dark=r('171A1B'),acid=r('D9FF65'),white=r('F1F2E9');
 var c=M.comp('05 OPEN STUDIO — Vertical',1080,1920,12,30);c.bgColor=dark;c.motionBlurSamplesPerFrame=6;c.shutterAngle=150;
 M.rect(c,'Dark ink',[1080,1920],dark,[540,960]);
 function tx(name,s,size,col,x,y,a,b,font){return M.text(c,name,s,size,col,[x,y],font||'HiraginoSansGB-W6',a||0,b||12);}
 tx('Series','OPEN / STUDIO',28,white,245,200,0,12,'HelveticaNeue-Medium');tx('Index','05',30,white,880,200,0,12,'HelveticaNeue');
 var petals=M.path(c,'Native repeater — twelve petals',[[-48,-155],[-95,-280],[-56,-390],[0,-430],[56,-390],[95,-280],[48,-155],[0,-120]],acid,null,0,[540,1090],true,0,7.3);
 N.repeater(petals,12,[0,0],30);M.rotation(petals).expression='-18+time*19';
 var warp=N.fx(petals,'Turbulent Displace',{'Amount':6,'Size':155,'Complexity':1.2});warp.property('Evolution').expression='time*50';
 M.key(M.scale(petals),[0,.8,2.7,3.6,5.55,6.4,7.3],[[20,20],[88,88],[88,88],[49,49],[49,49],[160,160],[400,400]]);
 M.key(M.pos(petals),[0,2.7,3.6,5.55,6.4],[[540,1110],[540,1110],[870,1080],[870,1080],[540,960]]);
 var main='OPEN';for(var i=0;i<4;i++){
  var l=tx('Opening glyph '+i,main.charAt(i),238,white,196+i*230,470,.1+i*.055,3.3,'HelveticaNeue-Bold');N.reveal(l,.1+i*.055,.65+i*.055,180);
  M.key(M.pos(l),[.1+i*.055,.7+i*.055,2.6+i*.035,3.25+i*.035],[[196+i*230,650],[196+i*230,470],[196+i*230,470],[196+i*230,-250]]);
 }
 var sub=tx('Studio','STUDIO',128,white,540,675,.45,3.3,'HelveticaNeue-Bold');N.reveal(sub,.45,1.1,60);M.key(M.pos(sub),[.45,1.1,2.7,3.3],[[540,735],[540,675],[540,675],[540,-70]]);
 tx('Opening caption','打开创作的另一面',36,white,540,1630,.8,3.1);
 var lines=['看见','新可能'];for(var i=0;i<2;i++){
  var t=tx('Middle headline '+i,lines[i],150,white,455,585+i*212,3,6.2);N.reveal(t,3+i*.12,3.7+i*.12,95);M.key(M.opacity(t),[3,5.2,5.55],[100,100,0]);
 }
 var stroke=N.line(c,'Editorial divider',[[120,1310],[960,1310]],white,2,3.5,6.3);N.trim(stroke,3.5,4.3);M.key(M.opacity(stroke),[3.5,5.1,5.5],[100,100,0]);
 tx('Categories','设计 / 动效 / 创造',43,white,540,1450,3.7,5.55);
 // The same expanding flower supplies an alpha matte for the light poster.
 var light=M.rect(c,'Acid field',[1080,1920],acid,[540,960],0,6.1,12);
 var reveal=M.circle(c,'Circular transition matte',20,[1,1,1],[540,960],6.1,7.7);M.key(M.scale(reveal),[6.1,7.5],[[100,100],[12000,12000]]);light.setTrackMatte(reveal,TrackMatteType.ALPHA);
 // Matte must persist after its reveal to retain the final design.
 reveal.outPoint=12;
 var outline=M.shape(c,'Open window','rect',[650,650],null,[540,700],80,dark,17,7.15,12);
 M.key(M.rotation(outline),[7.15,8.2,12],[-38,0,0]);M.key(M.scale(outline),[7.15,8.2],[[35,35],[100,100]]);
 var diagonal=N.line(c,'Window diagonal',[[350,880],[730,500]],dark,22,7.6,12);N.trim(diagonal,7.6,8.4);
 var arrow=N.line(c,'Window arrow',[[510,500],[730,500],[730,720]],dark,22,7.9,12);N.trim(arrow,7.9,8.6);
 var sweep=N.fx(outline,'CC Light Sweep',{'Width':90,'Sweep Intensity':28,'Edge Intensity':12,'Direction':25});M.key(sweep.property('Center'),[7.7,8.65],[[-300,0],[1000,900]]);
 var closing=tx('Event title','创意开放日',91,dark,540,1220,7.4,12);N.reveal(closing,7.4,8.3,65);
 closing=tx('End English','OPEN STUDIO',53,dark,540,1350,7.7,12,'HelveticaNeue-Bold');N.reveal(closing,7.7,8.5,40);
 var button=M.rect(c,'Action capsule',[710,112],dark,[540,1570],56,8.5,12);M.key(M.scale(button),[8.5,9.1],[[90,90],[100,100]]);M.key(M.opacity(button),[8.5,9.1],[0,100]);
 var action=tx('Action','加入创意现场  ↗',43,acid,540,1570,8.7,12);N.reveal(action,8.7,9.3,25);
 tx('End label','BRAND EVENT / CONCEPT',21,dark,540,1740,8.2,12,'HelveticaNeue');
 tx('End top','OPEN / STUDIO',28,dark,245,200,7.5,12,'HelveticaNeue-Medium');tx('End index','05',30,dark,880,200,7.5,12,'HelveticaNeue');
 c.openInViewer();
})();
