/* Authored typography, path and motion helpers shared by these three cases. */
var X=(function(){
 var M=MuseNative,r=M.rgb;
 function tx(c,n,s,size,col,x,y,font,a,b,left){return U.text(c,n,s,size,col,x,y,font||'HiraginoSansGB-W6',a||0,b||c.duration,!left);}
 function rect(c,n,w,h,col,x,y,rad,a,b){return U.rect(c,n,w,h,col,x,y,rad||0,a,b);}
 function move(l,ts,values){U.key(M.pos(l),ts,values,'travel');return l;}
 function scale(l,ts,values){var factor=(l.containingComp?U.s(l.containingComp):1)/(l.source?U.s(l.source):1),vs=[];for(var i=0;i<values.length;i++){var v=typeof values[i]==='number'?[values[i],values[i]]:values[i];vs.push([v[0]*factor,v[1]*factor]);}U.key(M.scale(l),ts,vs,'travel');return l;}
 function fade(l,a,b,c,d){return U.fade(l,a,b,c,d);}
 function on(l,a,d,dy){var p=M.pos(l).value;M.opacity(l).setValue(0);U.key(M.opacity(l),[a,a+Math.min(d,.22)],[0,100],'quiet');if(dy)move(l,[a,a+d],[[p[0],p[1]+dy],p]);return l;}
 function off(l,a,b){U.key(M.opacity(l),[a,b],[100,0],'quiet');return l;}
 function ring(c,n,x,y,diam,col,width,a,b){return M.shape(c,n,'ellipse',[diam,diam],null,[x,y],0,col,width,a,b);}
 function find(g,n){for(var i=1;i<=g.numProperties;i++){var p=g.property(i);if(p.name===n)return p;if(p.numProperties){var f=find(p,n);if(f)return f;}}return null;}
 function grain(l,v){var e=l.property('ADBE Effect Parade').addProperty('Add Grain'),params={'Viewing Mode':3,'Intensity':v,'Size':.65,'Monochromatic':true,'Animation Speed':0,'Random Seed':41};for(var k in params){var p=find(e,k);if(!p)throw new Error('Missing grain '+k);p.setValue(params[k]);}return e;}
 function line(c,n,points,col,width,a,b){return U.line(c,n,points,col,width,a,b);}
 function draw(c,n,points,col,width,a,b,end){var l=line(c,n,points,col,width,a,end||c.duration);N.trim(l,a,b);return l;}
 function shadow(l,opacity,distance,softness){N.shadow(l,opacity,distance,softness);return l;}
 function splitText(c,n,str,size,col,x,y,width,t,end){var l=U.title(c,n,str,size,col,x,y,width,t,.58,end);if(end>=c.duration){N.clean(M.opacity(l));U.key(M.opacity(l),[t,t+.16],[0,100],'quiet');}return l;}
 function checked(c,n,x,y,col,t,end,size){size=size||20;return draw(c,n,[[x-size*.55,y],[x-size*.1,y+size*.4],[x+size*.7,y-size*.5]],col,4,t,t+.3,end);}
 function pinHeader(c,brand,note,col,muted,foot){var w=c.width,h=c.height;tx(c,'Brand label',brand,26,col,76,62,'HelveticaNeue-Bold',0,c.duration,true);var noteLayer=tx(c,'Category label',note,17,muted,w-74,62,'HelveticaNeue-Medium'),bb=noteLayer.sourceRectAtTime(0,false);M.anchor(noteLayer).setValue([bb.left+bb.width,bb.top+bb.height/2]);var l=line(c,'Header rule',[[76,102],[w-76,102]],muted,.7,0,c.duration);M.opacity(l).setValue(24);if(foot)tx(c,'Concept scope',foot,h>w?21:15,muted,w/2,h-36,'HiraginoSansGB-W3');}
 return {tx:tx,rect:rect,move:move,scale:scale,fade:fade,on:on,off:off,ring:ring,grain:grain,line:line,draw:draw,shadow:shadow,splitText:splitText,checked:checked,pinHeader:pinHeader};
})();
