/* A separate 9:16 edit; no center-crop of the landscape master. */
(function(){
 var M=MuseNative,r=M.rgb,D=18,ink=r('202827'),muted=r('777B74'),paper=r('F1F0EB');
 var c=M.comp('CLUE — Brand Color / Vertical 18s',1080,1920,D,30);c.bgColor=paper;
 M.rect(c,'Backdrop',[1080,1920],paper,[540,960]);
 function find(name){for(var i=1;i<=app.project.numItems;i++){var p=app.project.item(i);if(p.name===name)return p;}throw new Error('Missing '+name);}
 var times=[0,2.4,3.6,4.2,5.3,8.1,9.3,11.4,12.4,13.6,14.8,18];
 function art(name,poses,sizes,opacity){var co=find('Artwork / '+name),l=M.setup(c.layers.add(co),name,poses[0],0,D);N.shadow(l,15,16,32);M.key(M.pos(l),times,poses,{influence:58});var s=[];for(var k=0;k<sizes.length;k++)s.push([sizes[k]/2,sizes[k]/2]);M.key(M.scale(l),times,s,{influence:64});if(opacity)M.key(M.opacity(l),[0,2.4,3.5,D],[0,0,100,100]);return l;}
 art('Website',[[540,800],[540,800],[540,820],[540,820],[540,-500],[540,-500],[540,820],[540,820],[540,1070],[540,1070],[455,1045],[455,1045]],[64,64,88,88,80,80,88,88,98,98,72,72],true);
 var p=art('Poster',[[575,1160],[575,1160],[350,1460],[350,1460],[-400,1110],[-400,1110],[350,1460],[350,1460],[-400,1480],[-400,1480],[352,1470],[352,1470]],[146,147,89,89,99,99,89,89,100,100,88,88]);
 M.key(M.rotation(p),times,[-3,-2,0,0,0,0,0,0,0,0,3,3]);
 art('Mobile',[[1200,1400],[1200,1400],[798,1460],[798,1460],[247,1110],[247,1110],[798,1460],[798,1460],[1340,1480],[1340,1480],[846,1470],[846,1470]],[80,80,88,88,100,100,88,88,100,100,83,83],true);
 var I=M.setup(c.layers.add(find('UI / Brand inspector')),'Inspector',[1540,1110],0,D);N.shadow(I,15,16,32);M.key(M.pos(I),[0,4.2,5.3,8.1,9.3,D],[[1540,1110],[1540,1110],[740,1110],[740,1110],[1540,1110],[1540,1110]],{influence:58});M.scale(I).setValue([66.5,66.5]);
 // Fixed editorial heading zone occludes artwork that travels above the stage.
 M.rect(c,'Heading zone occlusion',[1080,500],paper,[540,250]);
 function tx(n,s,sz,col,x,y,font){var l=M.text(c,n,s,sz,col,[x,y],font||'HiraginoSansGB-W6',0,D),b=l.sourceRectAtTime(0,false);M.anchor(l).setValue([b.left,b.top+b.height/2]);return l;}
 function title(n,a,b,start,end){var t1=tx(n+' one',a,65,ink,90,300),t2=tx(n+' two',b,65,n==='End'?r('315FF1'):ink,90,393);
  var ls=[t1,t2];for(var i=0;i<2;i++){var l=ls[i];l.inPoint=start+i*.12;l.outPoint=Math.min(end,D);M.key(M.pos(l),[start+i*.12,start+.6+i*.12],[[90,337+i*93],[90,300+i*93]],{influence:62});M.key(M.opacity(l),[start+i*.12,start+.25+i*.12,end-.24,end],[0,100,100,0],{linear:true});}}
 title('Opening','一个品牌色。','每一份设计。',0,2.85);title('Overview','三种版式。','一个品牌。',2.8,4.55);title('Action','选一个颜色。','同步每一处。',4.55,8.65);title('Synced','网站、海报、','移动端。同步。',8.75,11.6);title('Results','版式保留。','品牌焕新。',11.65,13.8);title('End','改一处。','焕新每一处。',14,18.4);
 var proof=tx('Result evidence','1 个品牌变量 · 3 份同步设计',26,muted,94,536,'HiraginoSansGB-W3');M.key(M.opacity(proof),[0,14.5,15.1,18],[0,0,100,100],{linear:true});
 tx('Brand','一念',28,ink,80,110);tx('Studio','STUDIO',21,ink,155,110,'HelveticaNeue-Medium');tx('Feature','BRAND COLOR',17,muted,828,110,'HelveticaNeue-Medium');
 M.rect(c,'Header line',[920,1],r('D8DBD3'),[540,159]);tx('Concept','概念功能演示 · CLUE 为虚构设计品牌',18,muted,335,1840,'HiraginoSansGB-W3');
 c.openInViewer();$.writeln('Built separate 18s vertical composition.');
})();
