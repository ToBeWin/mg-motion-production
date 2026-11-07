/* Reusable native EffectCraft components. Inputs are local coordinates and facts. */
var ScenarioModules=(function(){
 var M=MuseNative,C={ink:M.rgb('1D2834'),muted:M.rgb('71808E'),accent:M.rgb('3267E3'),pale:M.rgb('E4EAF1'),white:M.rgb('FFFFFF')};
 function text(c,name,str,size,xy,color){return M.text(c,name,str,size,color||C.ink,xy,'HiraginoSansGB-W6',0,c.duration);}
 function left(l){var b=l.sourceRectAtTime(0,false);M.anchor(l).setValue([b.left,b.top+b.height/2]);return l;}
 function focus(c,from,to,t0,t1){
  var l=M.shape(c,'Focus frame','rect',[from[2],from[3]],null,[from[0],from[1]],18,C.accent,3,0,c.duration);
  M.key(M.pos(l),[t0,t1],[[from[0],from[1]],[to[0],to[1]]]);M.key(M.shapeSize(l),[t0,t1],[[from[2],from[3]],[to[2],to[3]]]);return l;
 }
 function route(c,pts,t0,t1){
  if(pts.length<2||t1<=t0)throw 'Route needs at least two projected points and a positive duration';
  var base=N.line(c,'Route background',pts,C.pale,6,0,c.duration),line=N.line(c,'Route reveal',pts,C.accent,6,0,c.duration);
  var trim=N.trim(line,t0,t1);M.key(trim.property('ADBE Vector Trim End'),[t0,t1],[0,100],{linear:true});
  var distances=[0],total=0;
  for(var i=1;i<pts.length;i++){var dx=pts[i][0]-pts[i-1][0],dy=pts[i][1]-pts[i-1][1];if(dx===0&&dy===0)throw 'Remove duplicate adjacent route points';total+=Math.sqrt(dx*dx+dy*dy);distances.push(total);}
  if(total===0)throw 'Route length must be positive';
  var times=[];for(var j=0;j<pts.length;j++)times.push(t0+(t1-t0)*distances[j]/total);
  var pin=M.circle(c,'Path-bound marker',18,C.accent,pts[0],0,c.duration);M.key(M.pos(pin),times,pts,{linear:true});return {path:line,marker:pin};
 }
 function handoff(c,labels,pts,t0,t1){
  if(labels.length!==pts.length||pts.length<2||t1<=t0)throw 'Workflow needs two or more labelled points and a positive duration';
  for(var i=0;i<pts.length;i++){
   M.rect(c,'Stage '+i,[210,120],C.white,pts[i],18,0,c.duration);
   text(c,'Stage label '+i,labels[i],28,[pts[i][0],pts[i][1]-14]);
   text(c,'Stage index '+i,'0'+(i+1),16,[pts[i][0],pts[i][1]+30],C.muted);
  }
  var line=N.line(c,'Handoff path',pts,C.pale,3,0,c.duration);line.moveToEnd();
  var g=M.group(c,'Persistent task',0,c.duration);M.pos(g).setValue(pts[0]);
  // Assigning parent preserves world position; restore the intended local offset.
  var plate=M.rect(c,'Task chip',[150,46],C.accent,[0,85],10,0,c.duration);plate.parent=g;M.pos(plate).setValue([0,85]);
  var tag=text(c,'Task identity','TASK / 01',17,[0,85],C.white);tag.parent=g;M.pos(tag).setValue([0,85]);
  var times=[];for(var j=0;j<pts.length;j++)times.push(t0+(t1-t0)*j/(pts.length-1));
  M.key(M.pos(g),times,pts);return g;
 }
 function compare(c,rows,maxValue,t0,t1){
  if(!isFinite(maxValue)||maxValue<=0||t1<=t0||rows.length<1||rows.length>2)throw 'This layout requires 1–2 rows, a positive finite maximum and duration';
  var x0=290,y0=300,length=700;
  for(var i=0;i<rows.length;i++){
   var value=rows[i].value;if(!isFinite(value)||value<0||value>maxValue)throw 'Comparison value outside explicit scale';
   var y=y0+i*130;
   left(text(c,'Data label '+i,rows[i].label,25,[100,y]));
   M.rect(c,'Scale '+i,[length,34],C.pale,[x0+length/2,y],4,0,c.duration);
   var bar=M.rect(c,'Data bar '+i,[1,34],i?C.accent:C.ink,[x0,y],4,0,c.duration);
   M.anchor(bar).setValue([0,0]);
   // Value, bar width and center share one smooth progress function.
   var end=length*value/maxValue;
   var progress='var u=Math.min(1,Math.max(0,(time-'+t0+')/'+(t1-t0)+'));var p=u*u*(3-2*u);';
   M.shapeSize(bar).expression=progress+'['+end+'*p,34]';M.pos(bar).expression=progress+'['+x0+'+'+end+'/2*p,'+y+']';
   var number=text(c,'Data number '+i,String(value),36,[1110,y]);
   number.property('ADBE Text Properties').property('ADBE Text Document').expression=progress+'Math.round(p*'+value+').toString()';
  }
  left(text(c,'Scale origin','0',16,[x0,570],C.muted));left(text(c,'Scale maximum',String(maxValue),16,[x0+length-24,570],C.muted));
 }
 function banner(c,name,role,start,holdEnd,end){
  var g=M.group(c,'Reusable lower third',0,c.duration),width=700,x=90,y=c.height-145;
  M.pos(g).setValue([x,y]);
  var plate=M.rect(c,'Banner body',[width,118],C.ink,[width/2,0],14,0,c.duration);plate.parent=g;M.pos(plate).setValue([width/2,0]);
  var accent=M.rect(c,'Banner accent',[5,74],C.accent,[23,0],1,0,c.duration);accent.parent=g;M.pos(accent).setValue([23,0]);
  var nameLayer=left(text(c,'Editable name',name,34,[48,-21],C.white));nameLayer.parent=g;M.pos(nameLayer).setValue([48,-21]);
  var roleLayer=left(text(c,'Editable role',role,20,[48,24],M.rgb('B7C3D0')));roleLayer.parent=g;M.pos(roleLayer).setValue([48,24]);
  var fields=[nameLayer,roleLayer],sizes=[34,20];
  for(var f=0;f<fields.length;f++){var bound=fields[f].sourceRectAtTime(0,false);if(bound.width>width-82){var p=fields[f].property('ADBE Text Properties').property('ADBE Text Document'),d=p.value;d.fontSize=sizes[f]*(width-82)/bound.width;p.setValue(d);left(fields[f]);}}
  M.key(M.pos(g),[start,start+.65,holdEnd,end],[[-width-30,y],[x,y],[x,y],[-width-30,y]]);return g;
 }
 function countdown(c,count,start,step){
  if(count<1||count>99||Math.floor(count)!==count||step<=.26||start+count*step>=c.duration)throw 'Countdown needs 1–99 counts, step > .26s and time for the end state';
  var x=c.width/2,y=c.height*.52;
  M.shape(c,'Dial guide','ellipse',[340,340],null,[x,y],0,C.pale,3,0,c.duration);
  var arc=M.shape(c,'Countdown arc','ellipse',[340,340],null,[x,y],0,C.accent,5,0,c.duration);var trim=N.trim(arc,start,start+count*step);M.key(trim.property('ADBE Vector Trim End'),[start,start+count*step],[0,100],{linear:true});
  for(var i=0;i<count;i++){
   var a=start+i*step,b=a+step,l=text(c,'Count '+(count-i),('0'+(count-i)).slice(-2),112,[x,y]);l.inPoint=a;l.outPoint=b;
   M.key(M.opacity(l),[a,a+.1,b-.16,b],[0,100,100,0]);M.key(M.scale(l),[a,b],[[92,92],[103,103]]);
  }
  var done=text(c,'End state','开始',62,[x,y]);done.inPoint=start+count*step;M.key(M.opacity(done),[done.inPoint,done.inPoint+.25],[0,100]);return arc;
 }
 return {palette:C,text:text,left:left,focus:focus,route:route,handoff:handoff,compare:compare,banner:banner,countdown:countdown};
})();
