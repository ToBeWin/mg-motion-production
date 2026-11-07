/* Evidence-led showcase v1. Native editable layers; private screenshots are external inputs. */
var E=(function(){
 var M=MuseNative,D=CFG.duration,FPS=30,C=CFG.colors,FONT='FOLDHan-Regular',BOLD='FOLDHan-Bold',P='Evidence / '+CFG.variant+' / ';
 function co(c){return M.rgb(C[c]||c);}
 function comp(n,w,h){var c=M.comp(P+n,w||1920,h||1080,D,FPS);c.shutterAngle=90;c.motionBlurSamplesPerFrame=4;return c;}
 function txt(c,n,s,z,x,y,col,a,b,regular){return M.text(c,n,s,z,co(col||'ink'),[x,y],regular?FONT:BOLD,a,b);}
 function left(c,n,s,z,x,y,col,a,b,regular){var l=txt(c,n,s,z,x,y,col,a,b,regular),r=l.sourceRectAtTime(0,false);M.anchor(l).setValue([r.left,r.top+r.height/2]);return l;}
 function box(c,n,w,h,x,y,col,rad,a,b){return M.rect(c,n,[w,h],co(col),[x,y],rad||0,a,b);}
 function sub(c,child,n,x,y,a,b){return M.setup(c.layers.add(child),n,[x,y],a,b);}
 function fade(l,a,di,b,dout){M.key(M.opacity(l),[a,a+di,b-dout,b],[0,100,100,0],{linear:true});return l;}
 function on(l,a,d){M.key(M.opacity(l),[a,a+d],[0,100],{linear:true});return l;}
 function tween(p,a,b,v0,v1){var ts=[],vs=[];var steps=Math.max(2,Math.round((b-a)*FPS));for(var i=0;i<=steps;i++){var u=i/steps;u=u*u*u*(u*(u*6-15)+10);ts.push(a+(b-a)*i/steps);if(typeof v0==='number')vs.push(v0+(v1-v0)*u);else{var v=[];for(var j=0;j<v0.length;j++)v.push(v0[j]+(v1[j]-v0[j])*u);vs.push(v);}}M.key(p,ts,vs,{linear:true});}
 function plate(c,n,w,h,x,y,a,b){var l=box(c,n,w,h,x,y,'FFFFFF',20,a,b);N.shadow(l,11,12,30);return l;}
 function asset(c,file,name,width,x,y,a,b){var f=M.footage(c,name,ROOT+'/assets/'+file,width,[x,y],a,b);return f;}
 function background(c){
  M.gradient(c,'Persistent bright environment',[1920,1080],[220,80],[1680,1040],0,D,co('F9FAFF'),co('EFF2FB'),false);
  var a=M.shape(c,'Soft blue field','ellipse',[1250,780],co('glow1'),[185,100],0,null,0,0,D);N.fx(a,'Gaussian Blur',{'Blurriness':200,'Repeat Edge Pixels':false});M.opacity(a).setValue(47);a.motionBlur=false;
  var b=M.shape(c,'Soft violet field','ellipse',[1050,680],co('glow2'),[1750,800],0,null,0,0,D);N.fx(b,'Gaussian Blur',{'Blurriness':180,'Repeat Edge Pixels':false});M.opacity(b).setValue(50);b.motionBlur=false;
  asset(c,CFG.logo,'Official logo, unchanged',51,99,66,0,D);left(c,'Product identity',CFG.brand,29,140,66,'ink',0,D);
  txt(c,'Editorial context',CFG.topline||'真实任务  /  实际成果',21,1670,66,'secondary',0,D,true);
  box(c,'Persistent header rule',1752,1,960,111,'line',0,0,D);
 }
 function heading(c,id,lines,start,dock,end){
  var q=comp(id+' / Question',1800,260),z=72,gap=93;
  for(var k=0;k<lines.length;k++){
   var s=lines[k],span=s.length*z,x0=900-span/2+z/2,y=130+(k-(lines.length-1)/2)*gap,row=comp(id+' / Masked line '+k,1800,96);
   for(var j=0;j<s.length;j++){
    var l=txt(row,id+' / Character '+k+'-'+j,s[j],z,x0+j*z,48,'ink',0,D);
    var t=start+.09+j*.038+k*.11;
    M.key(M.pos(l),[t,t+.48],[[x0+j*z,94],[x0+j*z,48]],{influence:65});on(l,t,.16);
   }
   sub(q,row,id+' / Line clipping viewport '+k,900,y,0,D);
  }
  // Clip belongs to the question viewport; the persistent instance shrinks into the reading header.
  var l=sub(c,q,id+' / Persistent question',960,326,0,end);
  tween(M.pos(l),dock,dock+.62,[960,326],[960,176]);tween(M.scale(l),dock,dock+.62,[100,100],[57,57]);
  M.key(M.opacity(l),[end-.20,end],[100,0],{linear:true});return l;
 }
 function request(c,k){
  var q=comp(k.case_id+' / Intent',1280,236);
  plate(q,'Request surface',1240,210,640,118,0,D);
  var im=asset(q,k.request_asset,'Actual request crop',1160,640,122,0,D);
  var src=im.source,s=Math.min(1160/src.width,166/src.height)*100;M.scale(im).setValue([s,s]);
  var l=sub(c,q,k.case_id+' / Foreground intent',960,592,k.start+.58,k.dock+.80);
  on(l,k.start+.58,.38);tween(M.pos(l),k.start+.58,k.start+1.1,[960,626],[960,592]);
  M.key(M.opacity(l),[k.start+.58,k.start+.96,k.dock+.42,k.dock+.80],[0,100,100,0],{linear:true});
  return l;
 }
 var cache={};
 function viewport(r,isUI){
  var key=(isUI?'UI ':'Result ')+r.result_id;if(cache[key])return cache[key];
  var q=comp(key,1440,810);
  box(q,'Paper boundary',1430,800,720,405,'FFFFFF',18,0,D);
  box(q,'Editorial label rule',1380,1,720,48,'line',0,0,D);
  left(q,'Actual source label',isUI?(CFG.workspace_label||CFG.brand+' / 已完成任务回放'):r.label+' / 实际成果',21,30,26,'secondary',0,D,true);
  var im=asset(q,r.asset,'Evidence pixels / '+r.result_id,1392,720,427,0,D);
  var s=Math.min(1392/im.source.width,738/im.source.height)*100;M.scale(im).setValue([s,s]);im.motionBlur=false;
  cache[key]=q;return q;
 }
 function resultByID(id){for(var i=0;i<CFG.results.length;i++)if(CFG.results[i].result_id===id)return CFG.results[i];throw new Error('Unknown result '+id);}
 function proof(c,r,a,b){
  var q=comp('Proof / '+r.result_id,400,460);
  box(q,'Proof rail',2,302,24,230,'line',0,0,D);
  left(q,'Proof eyebrow','看见结果',23,52,63,'accent',0,D);
  for(var i=0;i<r.proof_points.length;i++){
   var y=147+i*119,at=a+.10+i*.38;
   on(M.circle(q,'Proof anchor '+i,9,co('accent'),[25,y],at,D),at,.20);
   on(left(q,'Proof point '+i,r.proof_points[i],27,52,y,'ink',at,D),at,.20);
   on(left(q,'Proof association '+i,r.proof_descriptions?r.proof_descriptions[i]:'',20,52,y+40,'secondary',at,D,true),at,.20);
  }
  var l=sub(c,q,'Proof bound to '+r.result_id,1575,570,a,b);on(l,a,.30);M.key(M.opacity(l),[a,a+.30,b-.18,b],[0,100,100,0],{linear:true});return l;
 }
 function caseScene(c,k){
  var badge=txt(c,k.case_id+' / Chapter',k.chapter,22,960,163,'accent',k.start,k.end,true);
  on(badge,k.start,.24);tween(M.pos(badge),k.dock,k.dock+.62,[960,163],[272,176]);
  M.key(M.opacity(badge),[k.start,k.start+.24,k.end-.2,k.end],[0,100,100,0],{linear:true});
  heading(c,k.case_id,k.problem,k.start,k.dock,k.end);
  var r={result_id:k.case_id+'-ui',asset:k.capture,label:'真实工作台'},w=sub(c,viewport(r,true),k.case_id+' / Product workspace',960,599,k.workspace,k.result_start+.35);
  M.scale(w).setValue([92,92]);N.shadow(w,12,14,32);tween(M.pos(w),k.workspace,k.workspace+.55,[960,654],[960,599]);fade(w,k.workspace,.42,k.result_start+.35,.30);
  // Composer is added after workspace, so it remains foreground during the actual handoff.
  request(c,k);
  for(var i=0;i<k.result_ids.length;i++){
   var out=resultByID(k.result_ids[i]),a=i===0?k.result_start:k.change,b=i===k.result_ids.length-1?k.end:k.change+.24;
   var l=sub(c,viewport(out,false),k.case_id+' / Evidence '+out.result_id,757,596,a,b);M.scale(l).setValue([84,84]);N.shadow(l,12,14,32);
   fade(l,a,.35,b,.20);if(i===0)tween(M.pos(l),a,a+.52,[810,629],[757,596]);
   proof(c,out,a+.25,b);
   var scope=txt(c,'Scope / '+out.result_id,out.scope_note,20,960,954,'secondary',a+.4,b,true);fade(scope,a+.4,.20,b,.18);
  }
 }
 function nav(c,start,items,segments,collect,end){
  var gap=14,total=1710,w=(total-gap*(items.length-1))/items.length;
  for(var i=0;i<items.length;i++){
   var x=(1920-total)/2+w/2+i*(w+gap),b=box(c,'Nav idle / '+items[i].result_id,w,52,x,162,'E7EAF5',26,start,end);
   var active=box(c,'Nav active / '+items[i].result_id,w,52,x,162,'accent',26,segments[i][0],segments[i][1]);
   txt(c,'Nav text idle / '+items[i].result_id,items[i].label,24,x,162,'secondary',start,end,true);
   txt(c,'Nav text active / '+items[i].result_id,items[i].label,24,x,162,'FFFFFF',segments[i][0],segments[i][1],true);
   var all=box(c,'Nav collection / '+items[i].result_id,w,52,x,162,'accent',26,collect,end);on(all,collect,.22);
   var lab=txt(c,'Nav collection text / '+items[i].result_id,items[i].label,24,x,162,'FFFFFF',collect,end,true);on(lab,collect,.22);
  }
 }
 function tour(c){
  var T=CFG.tour,start=T.start,items=CFG.results,segments=[],t=start;
  for(var i=0;i<items.length;i++){segments.push([t,t+T.hold_durations[i]]);t+=T.hold_durations[i];}
  var collect=t,end=collect+T.matrix_hold,cols=T.columns,rows=Math.ceil(items.length/cols),gap=32,w=Math.min((1600-(cols-1)*gap)/cols,((590-(rows-1)*64)/rows)*1440/810),scale=w/1440*100,h=w*810/1440;
  nav(c,start,items,segments,collect,end);
  var gridW=cols*w+(cols-1)*gap,gridH=rows*h+(rows-1)*64;
  var poses=[];for(var i=0;i<items.length;i++)poses.push([960-gridW/2+w/2+(i%cols)*(w+gap),310+(590-gridH)/2+h/2+Math.floor(i/cols)*(h+64)]);
  for(var i=0;i<items.length;i++){
   var a=segments[i][0],b=segments[i][1],isLast=i===items.length-1;
   var l=sub(c,viewport(items[i],false),'Tour instance / '+items[i].result_id,960,626,a,isLast?end:b+.16);M.scale(l).setValue([78,78]);N.shadow(l,11,10,28);
   if(!isLast){on(l,a,.16);}else{
    on(l,a,.12);tween(M.pos(l),collect,collect+.60,[960,626],poses[i]);tween(M.scale(l),collect,collect+.60,[78,78],[scale,scale]);
    // This very same layer persists from the final full window into the final matrix cell.
    M.key(M.opacity(l),[a,a+.12,end-.25,end],[0,100,100,0],{linear:true});
   }
   var title=txt(c,'Tour title / '+items[i].result_id,items[i].title,50,960,244,'ink',a,b);on(title,a,.13);
   txt(c,'Tour source / '+items[i].result_id,items[i].scope_note,19,960,959,'secondary',a,b,true);
   if(!isLast){var q=sub(c,viewport(items[i],false),'Matrix instance / '+items[i].result_id,poses[i][0],poses[i][1],collect+.06+i*.055,end);M.scale(q).setValue([scale,scale]);N.shadow(q,10,8,22);on(q,collect+.06+i*.055,.30);tween(M.pos(q),collect+.06+i*.055,collect+.42+i*.055,[poses[i][0],poses[i][1]+25],poses[i]);M.key(M.opacity(q),[collect+.06+i*.055,collect+.36+i*.055,end-.25,end],[0,100,100,0],{linear:true});}
   var lab=txt(c,'Matrix label / '+items[i].result_id,items[i].label,23,poses[i][0],poses[i][1]+h/2+25,'secondary',collect+.65,end,true);on(lab,collect+.65,.20);
  }
  var htitle=txt(c,'Collection conclusion',CFG.collection_title||'从一个问题，走向一组成果。',51,960,244,'ink',collect,end);on(htitle,collect,.26);
  txt(c,'Collection scope',CFG.collection_scope||'',19,960,954,'secondary',collect,end,true);
  return {segments:segments,collect:collect,end:end,positions:poses,finalScale:scale};
 }
 function close(c){var a=CFG.close.start;
  var q=comp('Brand close');asset(q,CFG.logo,'Official brand mark',155,659,443,0,D);left(q,'Brand wordmark',CFG.brand,100,767,445,'ink',0,D);
  txt(q,'Human value',CFG.close.title,59,960,597,'ink',0,D);txt(q,'Brand descriptor',CFG.close.sub,26,960,685,'secondary',0,D,true);
  var l=sub(c,q,'Closing brand',960,540,a,D);on(l,a,.60);tween(M.pos(l),a,a+.65,[960,572],[960,540]);return l;}
 return {comp:comp,background:background,caseScene:caseScene,tour:tour,close:close,txt:txt,sub:sub,co:co};
})();
