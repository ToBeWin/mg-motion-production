(function(){
 var M=MuseNative,r=V.r,D=16,c=U.comp('ORBIT / Turn into response',1920,1080,D,false),white=r('F8F9F6'),blue=r('3E67B4'),ink=r('344D64'),muted=r('738C9F'),line=r('C9D6E0');
 F.base(c,white);M.gradient(c,'Luminous neutral studio',[1920,1080],[900,430],[2200,1080],0,D,r('FDFDF8'),r('E6EDF0'),true);
 V.tx(c,'Opening identity','ORBIT',27,ink,94,82,0,12,true,'HelveticaNeue-Medium');V.tx(c,'Opening category','A TACTILE POINT OF VIEW',18,muted,1540,82,0,12,false,'HelveticaNeue-Medium');
 var one=V.tx(c,'Opening detail','细节',194,ink,122,420,0,3.1,true);V.pos(one,[[0,[122,520]],[.7,[122,420],'out'],[2.25,[122,420]],[3.1,[-780,420],'in']]);V.alpha(one,[[0,0],[.6,100],[2.6,100],[3.1,0]]);
 var two=V.tx(c,'Opening restraint','自有分寸。',93,ink,128,650,.4,3.1,true);V.alpha(two,[[.4,0],[.95,100],[2.4,100],[3.1,0]]);
 var product=M.footage(c,'New Cycles rotary assembly',SOURCE_ROOT+'/media/hardware-control.mov',1024,[1410,530],2.8,D);product.startTime=2.8;product.inPoint=2.8;product.outPoint=D;
 V.pos(product,[[2.8,[1410,530]],[3.75,[550,575],'out'],[11.85,[550,575]],[13.05,[1300,570]],[D,[1300,570]]]);V.scale(product,[[2.8,18],[3.75,112,'out'],[11.85,112],[13.05,100],[D,100]]);V.alpha(product,[[2.8,0],[3.3,100]]);
 function arc(percent){var p=[];for(var i=0;i<=64;i++){var th=(-225+270*percent*i/64)*Math.PI/180;p.push([1410+170*Math.cos(th),530+170*Math.sin(th)]);}return p;}
 function rail(percent){var p=[];for(var i=0;i<=64;i++)p.push([1110+650*percent*i/64,600]);return p;}
 function oshape(cy){var p=[];for(var i=0;i<=64;i++){var th=(-225+360*i/64)*Math.PI/180;p.push([285+75*Math.cos(th),(cy||464)+75*Math.sin(th)]);}return p;}
 var base=U.line(c,'Reference arc becomes rail',arc(1),line,9,0,11.9);V.shapeKeys(base,[[0,arc(1)],[7.7,arc(1)],[9.35,rail(1)],[11.1,rail(1)],[11.9,rail(1)]],false);V.alpha(base,[[0,0],[.85,100],[11.0,100],[11.4,0]]);
 var progress=U.line(c,'Dial response becomes brand O',arc(.24),blue,12,0,D);var times=[],shapes=[];
 for(var f=0;f<=231;f++){
  var t=f/30,idx=Math.max(0,Math.min(119,Math.round((t-2.8)*30))),value=HARDWARE_DATA[idx].illustrative_brightness/100;
  times.push(t);shapes.push(N.shape(arc(value),false));
 }
 var pp=N.pathProp(progress);pp.setValuesAtTimes(times,shapes);V.shapeKeys(progress,[[7.7,arc(.8)],[9.35,rail(.8)],[11.4,rail(.8)],[11.85,rail(.8).map(function(p){return [p[0],230];})],[12.5,oshape(260)],[13.05,oshape()],[D,oshape()]],false);N.trim(progress,0,.9);
 var point=U.circle(c,'Persistent adjustment point',24,blue,1410,530,.6,12.3),pv=[],pt=[];
 for(var f=18;f<=231;f++){var t=f/30,idx=Math.max(0,Math.min(119,Math.round((t-2.8)*30))),th=(-225+270*HARDWARE_DATA[idx].illustrative_brightness/100)*Math.PI/180;pt.push(t);pv.push([1410+170*Math.cos(th),530+170*Math.sin(th)]);}M.pos(point).setValuesAtTimes(pt,pv);V.pos(point,[[7.7,pv[pv.length-1]],[9.35,[1630,600]],[11.4,[1630,600]],[11.85,[1630,230]],[12.3,[285,185]]]);V.alpha(point,[[.6,0],[1,100],[11.4,100],[11.85,0]]);
 // The number is sampled from the exact same rotation curve as the Cycles plate.
 var num=V.tx(c,'Live brightness','24',125,ink,1404,530,3.5,11.9,false,'Menlo-Regular'),prop=num.property('ADBE Text Properties').property('ADBE Text Document');
 num.motionBlur=false;
 for(var f=0;f<120;f++){var doc=prop.value;doc.text=String(Math.round(HARDWARE_DATA[f].illustrative_brightness));prop.setValueAtTime(2.8+f/30,doc);}
 V.pos(num,[[3.5,[1404,530]],[6.9,[1404,530]],[7.65,[1404,300]],[8.65,[1404,300]],[9.35,[1404,437]],[11.1,[1404,437]],[11.9,[1404,380]]]);V.alpha(num,[[3.5,0],[3.85,100],[11.0,100],[11.35,0]]);
 var pct=V.tx(c,'Percent unit','%',35,muted,1525,565,3.5,11.9,false,'HelveticaNeue-Medium');V.pos(pct,[[3.5,[1525,565]],[6.9,[1525,565]],[7.65,[1525,335]],[8.65,[1525,335]],[9.35,[1525,472]],[11.9,[1525,415]]]);V.alpha(pct,[[3.5,0],[3.85,100],[11.0,100],[11.35,0]]);
 // Keep the readout in front of the curve while it crosses its rim: an actual
 // inverted alpha matte cuts the lines, without painting a fake background plate.
 var clearance=V.rect(c,'Readout clearance matte',258,166,[1,1,1],1437,530,0,D,12);
 V.pos(clearance,[[0,[1437,530]],[6.9,[1437,530]],[7.65,[1437,300]],[8.65,[1437,300]],[9.35,[1437,437]],[11.1,[1437,437]],[11.9,[1437,380]]]);
 V.alpha(clearance,[[0,0],[3.49,0],[3.5,100],[11.35,100],[11.4,0],[D,0]]);
 progress.setTrackMatte(clearance,TrackMatteType.ALPHA_INVERTED);
 base.setTrackMatte(clearance,TrackMatteType.ALPHA_INVERTED);
 var title=V.tx(c,'Action becomes feedback','转动，即反馈。',63,ink,1410,282,3.5,11.5,false);V.alpha(title,[[3.5,0],[4.0,100],[6.8,100],[7.2,0]]);
 var label=V.tx(c,'Function label','亮度',30,muted,1410,793,3.7,11.5,false);V.pos(label,[[3.7,[1410,793]],[7.7,[1410,793]],[9.35,[1410,735]]]);V.alpha(label,[[3.7,0],[4.1,100],[10.9,100],[11.5,0]]);
 // A graduated rail appears as the arc straightens, holding the selected value.
 for(var i=0;i<=10;i++){var x=1110+i*65,tk=U.line(c,'Graduation '+i,[[x,625],[x,638+(i%5===0?12:0)]],muted,2,8.55,11.85);V.alpha(tk,[[8.55+i*.025,0],[9.35+i*.015,80],[11.0,80],[11.4,0]]);}
 var low=V.tx(c,'Minimum','0',19,muted,1110,688,9.15,11.6,false,'Menlo-Regular'),high=V.tx(c,'Maximum','100',19,muted,1760,688,9.15,11.6,false,'Menlo-Regular');V.alpha(low,[[9.15,0],[9.5,100],[11.0,100],[11.4,0]]);V.alpha(high,[[9.15,0],[9.5,100],[11.0,100],[11.4,0]]);
 var rb=V.tx(c,'Brand complement','RBIT',150,ink,404,464,12.8,D,true,'HelveticaNeue-Medium');V.pos(rb,[[12.8,[480,464]],[13.2,[404,464],'out']]);V.alpha(rb,[[12.8,0],[13.2,100]]);
 var promise=V.tx(c,'Final promise','把精密，握在手中。',43,ink,150,681,13.05,D,true);V.alpha(promise,[[13.05,0],[13.45,100]]);
 V.tx(c,'Final category','DESIGNED TO RESPOND',19,blue,152,790,13.2,D,true,'HelveticaNeue-Medium');
 c.openInViewer();
})();
