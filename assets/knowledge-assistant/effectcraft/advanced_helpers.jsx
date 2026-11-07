/* Native modifiers, mattes, 3D transforms and shared controls. */
var N=(function(){
 var M=MuseNative;
 function ct(l){return l.property('ADBE Root Vectors Group').property(1).property('ADBE Vectors Group');}
 function fill(l){return ct(l).property('ADBE Vector Graphic - Fill').property('ADBE Vector Fill Color');}
 function trim(l,start,end){var e=ct(l).addProperty('ADBE Vector Filter - Trim');M.key(e.property('ADBE Vector Trim End'),[start,end],[0,100]);return e;}
 function fx(l,name,values){var e=l.property('ADBE Effect Parade').addProperty(name);for(var k in values)e.property(k).setValue(values[k]);return e;}
 function shadow(l,opacity,distance,soft){return fx(l,'Drop Shadow',{'Opacity':opacity,'Distance':distance,'Softness':soft,'Direction':135});}
 function clean(p){while(p.numKeys)p.removeKey(1);}
 function reveal(l,start,finish,amount){var e=fx(l,'Linear Wipe',{'Wipe Angle':0,'Feather':0});M.key(e.property('Transition Completion'),[start,finish],[100,0]);var v=M.pos(l).value;M.key(M.pos(l),[start,finish],[[v[0],v[1]+(amount||35)],v]);return e;}
 function line(c,name,pts,color,w,a,b){var l=M.path(c,name,pts,null,color,w,[0,0],false,a,b);return l;}
 function pathProp(l){return ct(l).property('ADBE Vector Shape - Group').property('ADBE Vector Shape');}
 function shape(pts,closed){var s=new Shape();s.vertices=pts;s.inTangents=[];s.outTangents=[];s.closed=closed;for(var i=0;i<pts.length;i++){s.inTangents.push([0,0]);s.outTangents.push([0,0]);}return s;}
 function repeater(l,copies,offset,rotation){var e=ct(l).addProperty('ADBE Vector Filter - Repeater');e.property('ADBE Vector Repeater Copies').setValue(copies);var t=e.property('ADBE Vector Repeater Transform');t.property('ADBE Vector Position').setValue(offset||[0,0]);t.property('ADBE Vector Rotation').setValue(rotation||0);return e;}
 function camera(c,name){var l=c.layers.addCamera(name,[c.width/2,c.height/2]);M.pos(l).setValue([c.width/2,c.height/2,-2200]);l.property('ADBE Camera Options Group').property('ADBE Camera Zoom').setValue(2200);return l;}
 return {ct:ct,fill:fill,trim:trim,fx:fx,shadow:shadow,clean:clean,reveal:reveal,line:line,pathProp:pathProp,shape:shape,repeater:repeater,camera:camera};
})();
