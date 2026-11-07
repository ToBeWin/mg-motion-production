(function(){
 var M=MuseNative,r=M.rgb,D=PLAN.duration,T=PLAN.timing,c=U.comp(PLAN.composition,1920,1080,D),ink=r('25384D'),muted=r('68798B'),blue=r('365BDF'),pale=r('E8EDFF'),white=r('FFFFFF'),edge=r('D7E0EB');
 var bg=M.gradient(c,'Daylight environment',[1920,1080],[400,0],[1700,1150],0,D,r('F9FAF5'),r('EAF0FA'),false);X.grain(bg,.08);
 function label(co,n,s,size,col,x,y,a,b){return U.text(co,n,s,size,col,x,y,'HiraginoSansGB-W3',a,b);}
 function bold(co,n,s,size,col,x,y,a,b){return U.text(co,n,s,size,col,x,y,'HiraginoSansGB-W6',a,b);}
 function planeScale(l,t,v){var values=[];for(var i=0;i<v.length;i++)values.push([v[i]/2,v[i]/2,100]);U.key(M.scale(l),t,values,'travel');}
 function ripple(x,y,t){var circle=X.ring(c,'Click response '+t,x,y,36,blue,2,t,t+.6);X.scale(circle,[t,t+.6],[80,210]);X.fade(circle,t,t+.06,t+.12,t+.6);}
 // An enclosing reference mark becomes the small product identity in the header.
 var logo=U.comp('TRACE / Reference mark',420,420,D,false);
 U.line(logo,'Left bracket',[[132,54],[66,54],[66,366],[132,366]],blue,17);U.line(logo,'Right bracket',[[288,54],[354,54],[354,366],[288,366]],blue,17);
 U.circle(logo,'Reference dot',42,blue,210,210);
 var mark=U.add(c,logo,'Reference identity',1480,530,1,0,D);X.scale(mark,[0,.7,2.8,3.8,D],[76,100,100,11,11]);X.move(mark,[0,.7,2.8,3.8,D],[[1480,570],[1480,530],[1480,530],[103,62],[103,62]]);
 X.splitText(c,'Opening one','让每个答案，',95,ink,145,440,1300,.12,2.9);X.splitText(c,'Opening two','都有来处。',95,blue,145,580,1200,.3,2.9);
 var intro=label(c,'Opening descriptor','从资料出发，把依据带进答案。',28,muted,151,747,.6,2.85);X.on(intro,.6,.5,15);
 var brand=X.tx(c,'Brand name','TRACE',29,ink,145,62,'HelveticaNeue-Bold',3.8,D,true);X.on(brand,3.8,.4,0);
 var series=X.tx(c,'Series label','KNOWLEDGE STUDIO',18,muted,1845,62,'HelveticaNeue-Medium',0,D,true);var bb=series.sourceRectAtTime(0,false);M.anchor(series).setValue([bb.left+bb.width,bb.top+bb.height/2]);
 var rule=X.line(c,'Header rule',[[76,104],[1844,104]],edge,1,0,D);
 label(c,'Concept scope','原创产品概念 · 示例资料 · 配套答案可回看原文',16,muted,683,1045,0,D);
 // The input view uses three complete documents, not grey placeholder bars.
 var query=U.comp('TRACE / Question',1600,220,D,true);U.rect(query,'Question surface',1600,220,white,800,110,26);bold(query,'Question one',DATA.question[0],48,ink,55,73);bold(query,'Question two',DATA.question[1],48,ink,55,146);
 U.circle(query,'Question icon disc',72,pale,1505,110);U.text(query,'Question icon','?',42,blue,1505,110,'HelveticaNeue-Medium',0,D,true);
 var queryLayer=U.add(c,query,'User question',960,325,1,T.workspace,7.45);X.shadow(queryLayer,9,14,38);X.on(queryLayer,T.workspace,.55,30);X.fade(queryLayer,T.workspace,T.workspace+.5,7.0,7.45);
 var library=label(c,'Library summary','产品知识库  /  3 份资料',23,muted,173,900,3.8,7.3);X.on(library,3.8,.5,12);
 var submit=X.rect(c,'Submit button',104,104,blue,1650,650,52,4.2,7.3);X.on(submit,4.2,.5,15);var arrow=X.line(c,'Submit arrow',[[1630,650],[1670,650],[1653,633],[1670,650],[1653,667]],white,4,4.2,7.3);X.on(arrow,4.2,.5,15);
 U.pointer(c,'Submit cursor',[[1790,846],[1664,671],[1650,650],[1650,650],[1730,790]],[5.4,6.15,T.submit,T.submit+.15,7.2],5.4,7.2);ripple(1650,650,T.submit);
 var docs=[],docComps=[],focusX=[510,1410],stripY=598;
 for(var i=0;i<DATA.documents.length;i++){
  var d=DATA.documents[i],co=U.comp('TRACE / Document '+d.id,720,690,D,true);docComps.push(co);
  U.rect(co,'Document paper',720,690,white,360,345,24);M.shape(co,'Document edge','rect',[1438,1378],null,[720,690],48,edge,2,0,D);
  U.text(co,'Document number',d.number,24,blue,55,49,'Menlo-Regular');U.text(co,'Document format',d.format,21,muted,610,49,'Menlo-Regular');U.line(co,'Top divider',[[54,88],[666,88]],edge,1);
  bold(co,'Document title',d.title,43,ink,54,147);label(co,'Document metadata','产品知识库  ·  示例版本 '+d.version,19,muted,55,199);label(co,'Section heading',d.section,24,muted,55,240);
  // Original excerpt yields to an identical highlighted object when extraction begins.
  var h=i===0?T.highlight1:i===1?T.highlight2:D;
  for(var j=0;j<d.excerpt.length;j++){
   label(co,'Source paragraph '+j,d.excerpt[j],30,ink,72,311+j*48,0,h);
   if(i===1)label(co,'Returned source paragraph '+j,d.excerpt[j],30,ink,72,311+j*48,21.35,D);
  }
  if(i===1){var hi=U.rect(co,'Returned source highlight',640,142,pale,360,328,12,21.35,D);hi.moveToEnd();hi.moveBefore(co.layer('Document paper'));}
  U.line(co,'Context divider',[[55,437],[665,437]],edge,1);label(co,'Context heading','补充说明',21,muted,55,484);
  for(var v=0;v<d.context.length;v++)label(co,'Context '+v,d.context[v],24,muted,55,532+v*42);
  label(co,'Document footer',d.number+' / '+d.section,18,muted,55,643);U.text(co,'Page number','01',18,muted,624,643,'Menlo-Regular');
  var l=U.add(c,co,'Source document / '+d.id,460+i*395,655,.43,3.4,D);l.threeDLayer=true;docs.push(l);X.shadow(l,14,24,55);
  var ry=l.property('ADBE Transform Group').property('ADBE Rotate Y');
  if(i<2){
   U.key(M.pos(l),[3.4,4.3,7.1,8.4+i*.14,13.1,14.5,21.35,22.4,26.9,28.2,D],[[460+i*395,730,120+i*40],[460+i*395,655,0],[460+i*395,655,0],[focusX[i],615,0],[focusX[i],615,0],[i===0?-470:2370,680,220],[i===0?-470:2370,680,220],[i===0?-470:1400,615,0],[i===0?-470:1400,615,0],[i===0?-470:2370,600,200],[i===0?-470:2370,600,200]],'travel');
   planeScale(l,[3.4,4.3,7.1,8.4+i*.14,13.1,14.5,21.35,22.4,26.9,28.2,D],[40,43,43,100,100,86,86,93,93,72,72]);
   U.key(ry,[3.4,4.3,7.1,8.4+i*.14,13.1,14.5,21.35,22.4,26.9,28.2],[-12+i*8,-6+i*6,-6+i*6,0,0,i===0?14:-14,-14,0,0,-14],'travel');
   X.on(l,3.4+i*.1,.5,0);
  }else{
   U.key(M.pos(l),[3.4,4.5,7.1,8.2],[[1250,745,250],[1250,655,0],[1250,655,0],[2080,850,700]],'travel');planeScale(l,[3.4,4.5,7.1,8.2],[40,43,43,35]);U.key(ry,[3.4,4.5,7.1,8.2],[15,6,6,20],'travel');X.fade(l,3.4,4.25,7.2,8.2);
  }
 }
 N.camera(c,'Source plane camera');
 X.splitText(c,'Source claim','从资料里，找到依据。',68,ink,140,201,1670,7.2,13.1);
 var extracts=[],extractComps=[];
 for(var e=0;e<DATA.claims.length;e++){
  var first=e===0?T.highlight1:T.highlight2,claim=DATA.claims[e],strip=U.comp('TRACE / Evidence '+claim.citation,640,142,D,true);extractComps.push(strip);
  var fill=U.rect(strip,'Evidence highlight',640,142,pale,320,71,12);U.key(M.opacity(fill),[0,first,first+.3,13.1,15.6,D],[0,0,100,100,0,0],'quiet');
  for(var line=0;line<claim.lines.length;line++)label(strip,'Exact quote '+line,claim.lines[line],30,ink,32,54+line*48);
  var chip=U.rect(strip,'Citation chip',49,45,r('DAE3FF'),601,71,10);var num=U.text(strip,'Citation identity',String(claim.citation),25,blue,601,71,'Menlo-Regular',0,D,true);
  if(e===1){U.key(N.fill(chip),[0,21.1,21.2,26.8,27.2,D],[r('DAE3FF'),r('DAE3FF'),blue,blue,r('DAE3FF'),r('DAE3FF')],'quiet');U.key(U.colorText(num,blue),[0,21.1,21.2,26.8,27.2,D],[blue,blue,white,white,blue,blue],'quiet');}
  var ext=U.add(c,strip,'Evidence object / '+claim.document_id,focusX[e],stripY,1,e===0?T.highlight1:T.highlight2,D);extracts.push(ext);
  X.on(chip,first,.3,0);X.on(num,first,.3,0);
  var ay=e===0?530:735,small=[500,625+(ay-615)*.58],close=[1360,625+(ay-615)*.68];
  X.move(ext,[first,13.1,14.1,15.6,21.2,22.4,27.2,28.5,D],[[focusX[e],stripY],[focusX[e],stripY],[e===0?790:1190,e===0?570:770],[960,ay],[960,ay],small,small,close,close]);
  X.scale(ext,[first,13.1,15.6,21.2,22.4,27.2,28.5,D],[100,100,135,135,78.3,78.3,91.8,91.8]);
 }
 // The result is a designed answer with citations; evidence objects enter its columns.
 var answer=U.comp('TRACE / Answer surface',1420,730,D,true);U.rect(answer,'Answer paper',1420,730,white,710,365,28);M.shape(answer,'Answer edge','rect',[2838,1458],null,[1420,730],56,edge,2,0,D);
 U.text(answer,'Answer badge','TRACE / ANSWER',22,blue,80,61,'HelveticaNeue-Medium');bold(answer,'Answer title','根据资料，答案如下。',54,ink,80,133);
 label(answer,'Answer subject','知识库的文件支持与更新方式',26,muted,82,200);
 label(answer,'Answer category one','文件格式',28,muted,82,257);label(answer,'Answer category two','更新方式',28,muted,82,462);
 U.line(answer,'Answer separator',[[80,394],[1340,394]],edge,1);U.line(answer,'Answer lower rule',[[80,625],[1340,625]],edge,1);
 label(answer,'Answer source label','来源',19,muted,80,670);label(answer,'Answer source list','1  知识库发布说明     2  同步与更新',22,blue,160,670);
 // Reveal answer furniture after the moving quotes clear the heading area.
 for(var ui=1;ui<=answer.numLayers;ui++){var al=answer.layer(ui);if(al.name!=='Answer paper'&&al.name!=='Answer edge'){var enter=al.name.indexOf('category')>=0?15.15:14.35;X.on(al,enter,.45,0);}}
 var answerLayer=U.add(c,answer,'Answer with attached evidence',960,615,1,12.9,D);answerLayer.moveAfter(extracts[0]);X.shadow(answerLayer,14,25,60);
 X.move(answerLayer,[12.9,14.1,21.2,22.4,27.2,28.5,D],[[960,660],[960,615],[960,615],[500,625],[500,625],[1360,625],[1360,625]]);X.scale(answerLayer,[12.9,14.1,21.2,22.4,27.2,28.5,D],[92,100,100,58,58,68,68]);X.on(answerLayer,12.9,.6,0);
 X.splitText(c,'Answer claim','把依据，带进答案。',68,ink,145,178,1650,13.2,20.85);
 // Clicking the second citation returns to the same original document and span.
 var clickX=960+(601-320)*1.35,clickY=735;
 U.pointer(c,'Citation cursor',[[1575,1000],[clickX+55,clickY+70],[clickX,clickY],[clickX,clickY],[1510,1050]],[20.1,20.8,T.click,T.click+.15,22.05],20.1,22.05);ripple(clickX,clickY,T.click);
 X.splitText(c,'Return claim','一句答案，回到原文。',68,ink,145,181,1650,21.35,27.1);
 var route=X.draw(c,'Citation to original paragraph',[[500+(clickX-960)*.58,625+(clickY-615)*.58],[980,625+(clickY-615)*.58],[980,615+(328-345)*.93],[1400+(40-360)*.93,615+(328-345)*.93]],blue,2,22.4,23.2,27.2);X.fade(route,22.4,22.75,26.8,27.2);
 var sourceTag=X.tx(c,'Returned source identity','来源 2 · 内容更新',23,blue,1400,991,'HiraginoSansGB-W3',22.4,27.2);X.fade(sourceTag,22.4,22.8,26.8,27.2);
 X.splitText(c,'Closing one','问得明白。',93,ink,116,425,1030,28.0,D);X.splitText(c,'Closing two','答得有据。',93,blue,116,565,1030,28.15,D);
 var closingBrand=X.tx(c,'Closing brand','TRACE',47,ink,121,774,'HelveticaNeue-Bold',28.8,D,true);X.on(closingBrand,28.8,.5,15);
 var ending=label(c,'Closing promise','让知识，带着出处流动。',24,muted,123,844,29,D);X.on(ending,29,.5,12);
 c.openInViewer();$.writeln('TRACE: source spans, persistent evidence objects, native 3D document planes and citation return.');
})();
