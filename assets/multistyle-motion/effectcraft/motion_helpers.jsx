var V=(function(){
 var M=MuseNative,r=M.rgb;
 function e(x,k){if(k==='linear')return x;if(k==='out')return 1-Math.pow(1-x,4);if(k==='in')return x*x*x;return x*x*x*(x*(x*6-15)+10);}
 function mix(a,b,t){if(typeof a==='number')return a+(b-a)*t;var v=[];for(var i=0;i<a.length;i++)v.push(mix(a[i],b[i],t));return v;}
 function key(p,knots){var ts=[],vs=[];for(var i=0;i<knots.length-1;i++){var a=knots[i],b=knots[i+1],fa=Math.round(a[0]*30),fb=Math.round(b[0]*30);for(var f=fa;f<fb;f++){ts.push(f/30);vs.push(mix(a[1],b[1],e((f-fa)/(fb-fa),b[2])));}}ts.push(knots[knots.length-1][0]);vs.push(knots[knots.length-1][1]);p.setValuesAtTimes(ts,vs);for(var k=1;k<=p.numKeys;k++){p.setInterpolationTypeAtKey(k,KeyframeInterpolationType.LINEAR,KeyframeInterpolationType.LINEAR);if(p.isSpatial){var z=p.propertyValueType===PropertyValueType.ThreeD_SPATIAL?[0,0,0]:[0,0];p.setSpatialAutoBezierAtKey(k,false);p.setSpatialContinuousAtKey(k,false);p.setSpatialTangentsAtKey(k,z,z);}}return p;}
 function pos(l,k){key(M.pos(l),k);return l;}function scale(l,k){var a=[];for(var i=0;i<k.length;i++)a.push([k[i][0],typeof k[i][1]==='number'?[k[i][1],k[i][1]]:k[i][1],k[i][2]]);key(M.scale(l),a);return l;}
 function alpha(l,k){key(M.opacity(l),k);return l;}function rot(l,k){key(M.rotation(l),k);return l;}
 function tx(c,n,s,z,col,x,y,a,b,left,font){return U.text(c,n,s,z,col,x,y,font||'HiraginoSansGB-W6',a,b,!left);}
 function shadow(l,opacity,soft){N.fx(l,'Drop Shadow',{'Shadow Color':r('6D7983'),'Opacity':opacity||16,'Distance':12,'Softness':soft||36,'Direction':135});}
 function shapeKeys(l,knots,closed){var times=[],shapes=[];for(var i=0;i<knots.length-1;i++){var a=knots[i],b=knots[i+1],f0=Math.round(a[0]*30),f1=Math.round(b[0]*30);for(var f=f0;f<f1;f++){times.push(f/30);shapes.push(N.shape(mix(a[1],b[1],e((f-f0)/(f1-f0),b[2])),closed));}}times.push(knots[knots.length-1][0]);shapes.push(N.shape(knots[knots.length-1][1],closed));var p=N.pathProp(l);p.setValuesAtTimes(times,shapes);for(var k=1;k<=p.numKeys;k++)p.setInterpolationTypeAtKey(k,KeyframeInterpolationType.LINEAR,KeyframeInterpolationType.LINEAR);}
 function ring(c,n,x,y,rad,col,w,a,b){var points=[];for(var i=0;i<=96;i++){var th=i/96*Math.PI*2-Math.PI/2;points.push([x+rad*Math.cos(th),y+rad*Math.sin(th)]);}return U.line(c,n,points,col,w,a,b);}
 function outline(l,col,w){var p=l.property('ADBE Text Properties').property('ADBE Text Document'),d=p.value;d.applyFill=false;d.applyStroke=true;d.strokeColor=col;d.strokeWidth=w||3;p.setValue(d);return l;}
 function rect(c,n,w,h,col,x,y,a,b,rad){return U.rect(c,n,w,h,col,x,y,rad||0,a,b);}
 function add(c,co,n,x,y,s,a,b){return U.add(c,co,n,x,y,s,a,b);}
 return {r:r,e:e,mix:mix,key:key,pos:pos,scale:scale,alpha:alpha,rot:rot,tx:tx,shadow:shadow,shapeKeys:shapeKeys,ring:ring,outline:outline,rect:rect,add:add};
})();
