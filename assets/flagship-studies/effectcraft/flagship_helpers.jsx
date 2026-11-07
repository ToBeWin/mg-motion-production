var F=(function(){
 var M=MuseNative,r=M.rgb;
 function title(c,n,s,size,color,x,y,a,b,font){return X.splitText(c,n,s,size,color,x,y,1860-x,a,b);}
 function key(l,ts,vs,kind){return U.key(M.pos(l),ts,vs,kind||'travel');}
 function txt(c,n,s,size,col,x,y,a,b,left,font){return X.tx(c,n,s,size,col,x,y,font||'HiraginoSansGB-W6',a,b,left);}
 function wipe(c,n,col,a,b,reverse){var l=M.path(c,n,[[-360,-1000],[360,-1000],[-150,1000],[-870,1000]],col,null,0,[reverse?2400:-500,540],true,a,b+.04);X.move(l,[a,b],[[reverse?2400:-500,540],[reverse?-500:2400,540]]);return l;}
 function slash(c,n,x,y,w,h,col,a,b){return M.path(c,n,[[w*.45,-h/2],[w,-h/2],[-w*.45,h/2],[-w,h/2]],col,null,0,[x,y],true,a,b);}
 function pathKeys(l,ts,verts){var vals=[];for(var i=0;i<verts.length;i++)vals.push(N.shape(verts[i],false));U.key(N.pathProp(l),ts,vals,'travel');}
 function base(c,color){return X.rect(c,'Stage',1920,1080,color,960,540,0,0,c.duration);}
 function mark(c,n,x,y,s,col,a,b){var co=U.comp(n,400,400,c.duration,true);U.line(co,'Opening bracket',[[100,60],[45,60],[45,340],[100,340]],col,18);U.line(co,'Closing bracket',[[300,60],[355,60],[355,340],[300,340]],col,18);U.circle(co,'Evidence point',40,col,200,200);return U.add(c,co,n,x,y,s,a,b);}
 return {title:title,key:key,txt:txt,wipe:wipe,slash:slash,pathKeys:pathKeys,base:base,mark:mark};
})();
