/* Verified-state interaction rig. Cursor/intermediate timing is editorial, not continuous recording.
   Hotspots and scroll offsets come from interaction-capture-manifest.json. */
var I=(function(){
 var M=MuseNative,D=CFG.duration,C=CFG.colors,FPS=30,P='Evidence / '+CFG.variant+' / Interaction / ';
 function rgb(k){return M.rgb(C[k]||k);}
 function comp(n,w,h){var q=M.comp(P+n,w||1440,h||810,D,FPS);q.shutterAngle=72;q.shutterPhase=-36;q.motionBlurSamplesPerFrame=8;return q;}
 function sub(c,q,n,x,y,a,b){return M.setup(c.layers.add(q),n,[x,y],a,b);}
 function img(c,file,n,width,x,y,a,b){var l=M.footage(c,n,ROOT+'/assets/'+file,width,[x,y],a,b);l.motionBlur=false;return l;}
 function text(c,n,s,z,x,y,col,a,b){var l=M.text(c,n,s,z,rgb(col),[x,y],'FOLDHan-Regular',a,b);l.motionBlur=false;return l;}
 function rect(c,n,w,h,x,y,col,r,a,b){return M.rect(c,n,[w,h],rgb(col),[x,y],r||0,a,b);}
 function fade(l,a,b,peak){M.key(M.opacity(l),[a,a+.14,b-.14,b],[0,peak||100,peak||100,0],{linear:true});}
 function smooth(p,a,b,v0,v1){var ts=[],vs=[],n=Math.max(2,Math.round((b-a)*FPS));for(var i=0;i<=n;i++){var u=i/n;u=u*u*u*(u*(u*6-15)+10);ts.push(a+(b-a)*i/n);if(typeof v0==='number')vs.push(v0+(v1-v0)*u);else{var v=[];for(var j=0;j<v0.length;j++)v.push(v0[j]+(v1[j]-v0[j])*u);vs.push(v);}}M.key(p,ts,vs,{linear:true});}
 function reveal(l,a,b){M.key(M.opacity(l),[a,b],[0,100],{linear:true});}
 function outline(c,n,box,a,b,opacity){var l=M.shape(c,n,'rect',[box[2]-box[0],box[3]-box[1]],null,[(box[0]+box[2])/2,(box[1]+box[3])/2],12,rgb('accent'),2,a,b);fade(l,a,b,opacity||65);return l;}
 function mapPoint(p,crop,s,x,y){return [x+(p[0]-crop[0])*s,y+(p[1]-crop[1])*s];}
 function shapeBox(b){return N.shape([[b[0],b[1]],[b[2],b[1]],[b[2],b[3]],[b[0],b[3]]],true);}
 function cursor(c,n,at,hit,click,end,style){
  // The point [0,0] is the hotspot. All motion is local to the actual product viewport.
  var pts=[[0,0],[0,32],[8.5,24],[15.5,38],[21,35],[14,21],[27,21]];
  var l=M.path(c,n+' / Hotspot-anchored cursor',pts,rgb('ink'),rgb('FFFFFF'),2.2,[0,0],true,at,end);M.anchor(l).setValue([0,0]);N.shadow(l,22,2,5);
  var begin=[hit[0]+176,hit[1]+110],bend=[hit[0]+24,hit[1]+16],ts=[],vs=[];
  var land=click-.22,duration=land-at;
  // Cubic path with eased travel; an intentional 220ms dwell precedes the click.
  for(var f=0;f<=Math.ceil(duration*FPS);f++){var z=f/Math.ceil(duration*FPS),u=1-Math.pow(1-z,3);var v=1-u;ts.push(at+duration*z);vs.push([v*v*v*begin[0]+3*v*v*u*(begin[0]-45)+3*v*u*u*bend[0]+u*u*u*hit[0],v*v*v*begin[1]+3*v*v*u*(begin[1]-72)+3*v*u*u*bend[1]+u*u*u*hit[1]]);}
  ts.push(click+.18,click+.55,end);vs.push(hit,[hit[0]+53,hit[1]+74],[hit[0]+53,hit[1]+74]);M.key(M.pos(l),ts,vs,{linear:true});
  M.key(M.scale(l),[at,click-.033,click+.033,click+.10,click+.18],[[100,100],[100,100],[87,87],[93,93],[100,100]],{linear:true});
  fade(l,at,end,100);
  var ring=M.shape(c,n+' / Release cue','ellipse',[25,25],null,hit,0,rgb('accent'),2,click+.07,click+.43);
  M.key(M.scale(ring),[click+.07,click+.43],[[55,55],[155,155]]);M.key(M.opacity(ring),[click+.07,click+.16,click+.43],[0,48,0],{linear:true});ring.motionBlur=false;
  return l;
 }
 function viewer(kind,k){
  var src=CFG.interaction_sources[k.source_id||kind],v=src.viewer;var q=comp(k.case_id+' / Real preview'),body=comp(k.case_id+' / Clipped scrolling document',1372,696),a=k.click+.12;
  rect(q,'Actual preview surface',1430,800,720,405,'FFFFFF',18,0,D);
  img(q,src.toolbar_asset,'Captured native toolbar',1380,720,40,0,D);
  rect(q,'Toolbar separation',1380,1,720,80,'line',0,0,D);
  if(v.type==='strip'){
   var strip=img(body,v.asset,'Registered real report pixels',1372,686,0,0,D),s=1372/v.width,h=v.height*s;M.pos(strip).setValue([686,h/2]);
   var scroll1=a+.95,scroll2=Math.min(a+3.2,k.end-2.25);
   smooth(M.pos(strip),scroll1,scroll1+.95,[686,h/2],[686,h/2-v.scroll_offsets[0]*s]);
   smooth(M.pos(strip),scroll2,scroll2+1.0,[686,h/2-v.scroll_offsets[0]*s],[686,h/2-v.scroll_offsets[1]*s]);
   // Scroll thumb and content share the same editorial cue; toolbar never moves.
   var thumb=rect(q,'Scroll position cue',4,92,1421,190,'line',2,a,k.end);
   smooth(M.pos(thumb),scroll1,scroll1+.95,[1421,190],[1421,294]);smooth(M.pos(thumb),scroll2,scroll2+1,[1421,294],[1421,398]);
  }else{
   var w=1232,h=w/v.aspect,gap=32,sh=Math.ceil((h+gap)*v.pages.length),stack=comp(k.case_id+' / Actual PDF page stack',1372,sh);
   for(var j=0;j<v.pages.length;j++)img(stack,v.pages[j],'Actual document / page '+j,w,686,(h+gap)*j+h/2,0,D);
   var page=sub(body,stack,'Same document / vertical translation',686,sh/2,0,D),start=a+.55,stop=Math.min(a+1.50,k.end-.50);
   smooth(M.pos(page),start,stop,[686,sh/2],[686,sh/2-h-gap]);
  }
  sub(q,body,'Fixed document viewport',720,440,0,D);
  if(v.type==='strip' && v.focus_crop){
   // A magnifier uses the SAME captured pixels, retaining the label, value and comparison.
   var f=v.focus_crop,fw=f[2]-f[0],fh=f[3]-f[1],mw=600,mh=mw*fh/fw;
   var magnified=comp(k.case_id+' / Actual metric magnifier',mw,Math.ceil(mh));
   var mi=img(magnified,v.asset,'Same report / metric crop',v.width*mw/fw,(v.width/2-f[0])*mw/fw,(v.height/2-f[1])*mw/fw,0,D);
   var ma=a+1.98,mb=a+3.12;
   var wire=M.path(q,'Metric-to-detail connecting path',[[722,286],[722,376],[920,376],[1043,488]],null,rgb('accent'),1.6,[0,0],false,ma,mb);N.trim(wire,ma,ma+.34);fade(wire,ma,mb,62);
   var mag=sub(q,magnified,'Actual value / readable magnification',1095,606,ma,mb);N.shadow(mag,18,12,28);
   smooth(M.pos(mag),ma,ma+.38,[721,202],[1095,606]);smooth(M.scale(mag),ma,ma+.38,[73,73],[100,100]);fade(mag,ma,mb,100);
   var border=outline(q,'Recent months / reading brackets',[595,324,1062,712],a+4.35,k.end-.08,68);N.trim(border,a+4.35,a+4.72);
   var word=text(q,'Reading direction label','近期变化',22,1027,300,'accent',a+4.5,k.end-.08);fade(word,a+4.5,k.end-.08,100);
  }
  if(v.type==='pages'){
   // Editorial guide only: do not invent a product selection or modify the document.
   var at=a+1.62,stop=k.end-.10;
   if(stop-at>.35){var line=M.path(q,'Summary headline / reading underline',[[174,211],[685,211]],null,rgb('accent'),2,[0,0],false,at,stop);N.trim(line,at,at+.38);fade(line,at,stop,62);}
  }
  return q;
 }
 function workspace(k,style){
  var kind=k.source_id||k.case_id,src=CFG.interaction_sources[kind],q=comp(k.case_id+' / Operation and response'),a=k.workspace,b=k.end;
  if(!src)throw new Error('Missing verified interaction source: '+kind);
  var crop=src.crop,hot=src.hotspot,row=src.row,cw=crop[2]-crop[0],ch=crop[3]-crop[1];
  k.click=k.click===undefined?k.result_start-.55:k.click;
  rect(q,'Workspace paper',1430,800,720,405,'FFFFFF',18,a,b);
  text(q,'Product evidence label',CFG.brand+'  /  已完成任务的实际附件',22,720,44,'secondary',a,k.click+.30);
  var file=img(q,src.files_asset,'Real attachment rows and real controls',cw,720,440,a,k.click+.32),s=Math.min(1260/cw,650/ch);
  M.scale(file).setValue([s*100,s*100]);var x=720-cw*s/2,y=440-(crop[3]-crop[1])*s/2;
  var target=mapPoint(hot,crop,s,x,y),r0=mapPoint([row[0],row[1]],crop,s,x,y),r1=mapPoint([row[2],row[3]],crop,s,x,y),bounds=[r0[0]-7,r0[1]-5,r1[0]+7,r1[1]+5];
  var focus=outline(q,'Actual attachment / focus boundary',bounds,k.click-.66,k.click+.27,60);
  var la=k.click-.82,lb=k.click+.10,ly=Math.max(110,target[1]-130),lx=1290;
  var lead=M.path(q,'Preview action / directional guide',[[lx,ly+24],[1330,ly+24],[1330,target[1]-32],[target[0],target[1]-32],[target[0],target[1]-16]],null,rgb('accent'),1.6,[0,0],false,la,lb);N.trim(lead,la,la+.36);fade(lead,la,lb,68);
  var action=text(q,'Preview action / reading cue','打开'+(src.viewer.type==='strip'?'报告':'方案'),22,lx,ly,'accent',la,lb);fade(action,la,lb,100);
  // Native feather-free shape matte expands from the selected real file row into its result.
  var content=viewer(kind,k),l=sub(q,content,'Verified response / native reveal matte',720,405,k.click+.12,b),m=M.mask(l,bounds[0],bounds[1],bounds[2],bounds[3]);
  M.key(m.property('ADBE Mask Shape'),[k.click+.12,k.click+.12+(style==='graphic'? .44:.36)],[shapeBox(bounds),shapeBox([0,0,1440,810])],{influence:68});
  reveal(l,k.click+.12,k.click+.24);
  cursor(q,k.case_id,a+.38,target,k.click,k.click+.75,style);
  return {comp:q,hotspot:target,click:k.click};
 }
 function add(c,k,style){
  var op=workspace(k,style||'evidence'),w=sub(c,op.comp,k.case_id+' / Linked UI, pointer, focus and response',960,596,k.workspace,k.end);
  M.scale(w).setValue([92,92]);N.shadow(w,13,15,30);reveal(w,k.workspace,k.workspace+.26);smooth(M.pos(w),k.workspace,k.workspace+.50,[960,634],[960,596]);
  if(!k.full_stage){
   smooth(M.pos(w),k.click+.27,k.click+.87,[960,596],[757,596]);smooth(M.scale(w),k.click+.27,k.click+.87,[92,92],[84,84]);
  }
  M.key(M.opacity(w),[k.workspace,k.workspace+.26,k.end-.17,k.end],[0,100,100,0],{linear:true});
  return w;
 }
 return {comp:comp,sub:sub,rect:rect,text:text,img:img,smooth:smooth,reveal:reveal,outline:outline,cursor:cursor,workspace:workspace,add:add};
})();
