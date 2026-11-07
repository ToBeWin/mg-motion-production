/* Native motion beyond interaction: masked type, page choreography, depth and collection. */
var V=(function(){
 var M=MuseNative,D=CFG.duration,C=CFG.colors;
 function type(c,n,s,z,x,y,a,b){
  var q=I.comp(n+' / Type mask',1600,120),start=800-(s.length-1)*z/2;
  for(var j=0;j<s.length;j++){
   var l=M.text(q,n+' / Glyph '+j,s[j],z,M.rgb(C.ink),[start+j*z,60],'FOLDHan-Bold',0,D);
   I.smooth(M.pos(l),a+j*.035,a+.50+j*.035,[start+j*z,145],[start+j*z,60]);I.reveal(l,a+j*.035,a+.15+j*.035);
  }
  var t=I.sub(c,q,n,x,y,a,b);M.key(M.opacity(t),[b-.25,b],[100,0],{linear:true});return t;
 }
 function paper(item,i){
  var q=I.comp('Outcome / '+i,1440,810);I.rect(q,'Result paper',1430,800,720,405,'FFFFFF',12,0,D);
  var im=I.img(q,item.file,'Actual outcome / '+item.label,1370,720,387,0,D),sc=Math.min(1370/im.source.width,718/im.source.height)*100;M.scale(im).setValue([sc,sc]);
  return q;
 }
 function stage(c,opt,style){
  if(!opt)return;var a=opt.start,b=opt.end,items=opt.items;
  var cam=N.camera(c,'Outcome / Native depth camera');cam.inPoint=a;cam.outPoint=b;
  var grid=style==='luminous'?[[880,334],[1400,334],[880,581],[1400,581],[880,828],[1400,828]]:[[440,432],[960,432],[1480,432],[440,755],[960,755],[1480,755]],size=style==='luminous'?25:31;
  if(style==='luminous'){
   type(c,'Outcome statement 1','让每一步',56,260,366,a+.12,b);
   type(c,'Outcome statement 2','都有成果。',56,260,454,a+.27,b);
   var rule=M.path(c,'Outcome / Growing statement rule',[[95,532],[412,532]],null,M.rgb(C.accent),3,[0,0],false,a,b);N.trim(rule,a+.5,a+1.0);
  }else type(c,'Outcome / Kinetic statement',style==='companion'?'一组成果，团队接着做。':opt.title,60,960,174,a+.12,b);
  if(style==='companion'){
   var edges=[[[665,432],[735,432]],[[1185,432],[1255,432]],[[1705,432],[1745,432],[1745,755],[1705,755]],[[1255,755],[1185,755]],[[735,755],[665,755]]];for(var ei=0;ei<edges.length;ei++){var path=M.path(c,'Outcome / Inter-card flow '+ei,edges[ei],null,M.rgb(C.accent),2,[0,0],false,a+1.30,a+6.02);N.trim(path,a+1.30+ei*.35,a+1.70+ei*.35);M.key(M.opacity(path),[a+1.30,a+5.70,a+6.02],[42,42,0],{linear:true});}
  }
  // Back-to-front creation: the first outcome is the foreground object throughout.
  for(var j=items.length-1;j>=0;j--){
   var q=paper(items[j],j),enter=j===0?a:a+1.05+j*.11,l=I.sub(c,q,'Outcome / Persistent page '+j,1120,618,enter,b);
   l.threeDLayer=true;N.shadow(l,14,12,30);var ry=l.property('ADBE Transform Group').property('ADBE Rotate Y');
   M.pos(l).setValue([1120,618,0]);M.scale(l).setValue([73,73,100]);
   if(j===0){I.smooth(M.pos(l),a,a+.72,[1120,618,0],[960,578,0]);I.smooth(M.scale(l),a,a+.72,[73,73,100],[69,69,100]);}
   else{I.reveal(l,enter,enter+.17);M.scale(l).setValue([54,54,100]);M.pos(l).setValue([960,578,42+j*22]);}
   if(style==='graphic'){
    var fanx=960+(j%3-1)*375,fany=580+(j>2?55:-35);
    I.smooth(M.pos(l),Math.max(enter,a+1.15),a+2.25,[960,578,j===0?0:42+j*22],[fanx,fany,j*32]);
    I.smooth(M.scale(l),Math.max(enter,a+1.15),a+2.25,[j===0?69:54,j===0?69:54,100],[48,48,100]);
    I.smooth(ry,Math.max(enter,a+1.15),a+2.25,0,(j%3-1)*-17);
    I.smooth(M.rotation(l),Math.max(enter,a+1.15),a+2.25,0,(j%3-1)*7);
    I.smooth(M.pos(l),a+2.60+j*.035,a+3.48+j*.035,[fanx,fany,j*32],[grid[j][0],grid[j][1],0]);
    I.smooth(M.scale(l),a+2.60,a+3.48,[48,48,100],[size,size,100]);I.smooth(ry,a+2.60,a+3.48,(j%3-1)*-17,0);I.smooth(M.rotation(l),a+2.60,a+3.48,(j%3-1)*7,0);
   }else{
    var go=a+1.2+j*.12,end=go+.90;
    I.smooth(M.pos(l),Math.max(go,enter),end,[960,578,j===0?0:42+j*22],[grid[j][0],grid[j][1],0]);I.smooth(M.scale(l),Math.max(go,enter),end,[j===0?69:54,j===0?69:54,100],[size,size,100]);
    if(style==='luminous'){I.smooth(ry,Math.max(go,enter),end,-9,0);}
   }
   var label=I.text(c,'Outcome / Readable label '+j,items[j].label,25,grid[j][0],grid[j][1]+810*size/200+25,'secondary',a+3.85,a+6.15);I.reveal(label,a+3.85,a+4.05);M.key(M.opacity(label),[a+3.85,a+4.05,a+5.95,a+6.15],[0,100,100,0],{linear:true});
   // A stable collection is readable before the same pages converge into the brand close.
   I.smooth(M.pos(l),a+6.0+j*.04,a+7.55,[grid[j][0],grid[j][1],0],[659,443,j*8]);
   I.smooth(M.scale(l),a+6.0+j*.04,a+7.55,[size,size,100],[8,8,100]);I.smooth(M.rotation(l),a+6.0+j*.04,a+7.55,0,(j-2.5)*3);
   M.key(M.opacity(l),[enter,enter+.17,b-.30,b],[j===0?100:0,100,100,0],{linear:true});
  }
 }
 return {stage:stage,type:type};
})();
