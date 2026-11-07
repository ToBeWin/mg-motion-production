var U=(function(){
 var M=MuseNative,S={},r=M.rgb;
 function factor(c){return S[c.id]||1;}
 function comp(n,w,h,d,hi){var s=hi?2:1,c=M.comp(n,w*s,h*s,d,30);S[c.id]=s;return c;}
 function rect(c,n,w,h,col,x,y,rad,a,b){var s=factor(c);return M.rect(c,n,[w*s,h*s],col,[x*s,y*s],(rad||0)*s,a,b);}
 function text(c,n,str,size,col,x,y,font,a,b,center){var s=factor(c),l=M.text(c,n,str,size*s,col,[x*s,y*s],font||'HiraginoSansGB-W3',a||0,b||c.duration);if(!center){var bb=l.sourceRectAtTime(0,false);M.anchor(l).setValue([bb.left,bb.top+bb.height/2]);}return l;}
 function add(c,src,n,x,y,scale,a,b){var s=factor(c),l=M.setup(c.layers.add(src),n,[x*s,y*s],a||0,b||c.duration);M.scale(l).setValue([scale*s/factor(src)*100,scale*s/factor(src)*100]);return l;}
 function photo(c,src,n,x,y,w,h,d){var s=factor(c),co=comp(n+' crop',w,h,d,s===2),l=co.layers.add(src);var sc=Math.max(w*s/src.width,h*s/src.height)*100;M.scale(l).setValue([sc,sc]);M.pos(l).setValue([w*s/2,h*s/2]);return add(c,co,n,x+w/2,y+h/2,1);}
 function key(p,ts,vs,kind){M.key(p,ts,vs,{influence:kind==='quiet'?48:62});for(var k=1;k<=p.numKeys;k++){if(p.isSpatial){var zero=p.propertyValueType===PropertyValueType.ThreeD_SPATIAL?[0,0,0]:[0,0];p.setSpatialAutoBezierAtKey(k,false);p.setSpatialContinuousAtKey(k,false);p.setSpatialTangentsAtKey(k,zero,zero);}if(kind==='travel'){var dim=p.propertyValueType===PropertyValueType.TwoD?2:1,a=[],b=[];for(var q=0;q<dim;q++){a.push(new KeyframeEase(0,76));b.push(new KeyframeEase(0,32));}p.setTemporalEaseAtKey(k,a,b);}}return p;}
 function fade(l,a,b,c,d){key(M.opacity(l),[a,b,c,d],[0,100,100,0],'quiet');return l;}
 function line(c,n,pts,col,w,a,b){var s=factor(c),p=[];for(var i=0;i<pts.length;i++)p.push([pts[i][0]*s,pts[i][1]*s]);return M.path(c,n,p,null,col,w*s,[0,0],false,a,b);}
 function circle(c,n,diam,col,x,y,a,b){var s=factor(c);return M.circle(c,n,diam*s,col,[x*s,y*s],a,b);}
 function title(c,n,str,size,col,x,y,w,a,settle,end){var co=comp('Type / '+n,w,size*1.6,c.duration,true),l=text(co,n,str,size,col,0,size*.76,'HiraginoSansGB-W6');key(M.pos(l),[a,a+settle],[[0,size*3.6],[0,size*1.52]],'quiet');var q=add(c,co,n,x+w/2,y,1,a,Math.min(end,c.duration));key(M.opacity(q),[a,a+.16,end-.18,end],[0,100,100,0],'quiet');return q;}
 function colorText(l,col){return N.fx(l,'Fill',{'Color':col}).property('Color');}
 function pointer(c,n,pts,ts,a,b){var s=factor(c),shape=[[0,0],[0,25],[7,19],[14,32],[20,29],[13,17],[25,17]],v=[];for(var i=0;i<shape.length;i++)v.push([shape[i][0]*s,shape[i][1]*s]);var l=M.path(c,n,v,r('FFFEFA'),r('16302E'),1.8*s,[0,0],true,a,b),p=[];for(var j=0;j<pts.length;j++)p.push([pts[j][0]*s,pts[j][1]*s]);key(M.pos(l),ts,p,'quiet');return l;}
 function fmt(n){return String(n).replace(/\B(?=(\d{3})+(?!\d))/g,',');}
 return{r:r,comp:comp,s:factor,rect:rect,text:text,add:add,photo:photo,key:key,fade:fade,line:line,circle:circle,title:title,colorText:colorText,pointer:pointer,fmt:fmt};
})();
