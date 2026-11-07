(function(){
 var M=MuseNative,r=M.rgb,P=PLAN.cases.api,D=P.duration,c=U.comp(P.composition,1920,1080,D);
 var bg=r('EAF1F7'),panel=r('FFFFFF'),white=r('203951'),muted=r('62778C'),mint=r('137964'),blue=r('445AC5'),sand=r('9C6222'),colors=[mint,blue,sand];
 var ground=M.gradient(c,'Cool daylight studio',[1920,1080],[820,-260],[1600,1200],0,D,r('FAFCFE'),bg,false);X.grain(ground,.1);
 // Quiet peripheral rules establish technical scale without becoming a code wall.
 for(var g=0;g<6;g++){var rule=X.line(c,'Peripheral line '+g,[[130+g*330,130],[130+g*330,1005]],r('B4C5D4'),.7,0,D);M.opacity(rule).setValue(18);}
 var opening=X.splitText(c,'Opening claim','让一句话，进入工作流。',90,white,205,320,1560,.15,3.1);
 var sub=X.tx(c,'Opening context','自然语言输入',22,muted,960,430,'HiraginoSansGB-W3',.55,3.15);X.on(sub,.55,.4,12);
 var values=[API.response.due_text,API.response.owner,API.response.task],keys=['due_text','owner','task'],initialX=[440,820,1320],tokens=[],widths=[];
 // A token is one editable precomp that survives input, schema, JSON and task views.
 for(var i=0;i<3;i++){
  var co=U.comp('PULSE / Field '+keys[i],380,124,D,true),v=U.text(co,'Field value',values[i],64,colors[i],190,62,'HiraginoSansGB-W6',0,D,true);
  var actual=v.sourceRectAtTime(0,false).width/2;widths.push(actual);
  var fill=U.rect(co,'Field backing',360,112,panel,190,62,18);fill.moveToEnd();M.opacity(fill).setValue(0);U.key(M.opacity(fill),[0,3.15,3.55,7.9,8.4,D],[0,0,100,100,0,0],'quiet');
  var rim=M.shape(co,'Field rim','rect',[720,224],null,[380,124],36,colors[i],2,3.15,8.5);X.fade(rim,3.15,3.55,7.9,8.5);
  for(var side=-1;side<=1;side+=2){var quote=U.text(co,'JSON quote '+side,'"',46,colors[i],190+side*(actual/2+13),62,'Menlo-Regular',8,14.3,true);X.fade(quote,8.0,8.7,13.65,14.0);}
  var tok=U.add(c,co,'Value / '+keys[i],initialX[i],584,1,.35,D);X.on(tok,.35+i*.10,.6,25);tokens.push(tok);
 }
 var comma=X.tx(c,'Input comma','，',64,white,635,584,'HiraginoSansGB-W3',.35,3.5),verb=X.tx(c,'Input verb','完成',64,white,1030,584,'HiraginoSansGB-W3',.35,3.5),period=X.tx(c,'Input period','。',64,white,1545,584,'HiraginoSansGB-W3',.35,3.5);
 X.fade(comma,.35,.65,3.15,3.5);X.fade(verb,.35,.65,3.15,3.5);X.fade(period,.35,.65,3.15,3.5);
 var segments=[tokens[0],comma,tokens[1],verb,tokens[2],period],segmentWidths=[widths[0],comma.sourceRectAtTime(0,false).width,widths[1],verb.sourceRectAtTime(0,false).width,widths[2],period.sourceRectAtTime(0,false).width],total=40;
 for(var sw=0;sw<segmentWidths.length;sw++)total+=segmentWidths[sw];var cursor=960-total/2;
 for(var sg=0;sg<segments.length;sg++){var xx=cursor+segmentWidths[sg]/2;if(sg%2===0)initialX[sg/2]=xx;else M.pos(segments[sg]).setValue([xx,sg===3?584:604]);cursor+=segmentWidths[sg]+8;}
 var schemaTitle=X.splitText(c,'Schema claim','先约定，返回什么。',82,white,255,260,1480,3.25,7.95);
 var schemaX=[420,960,1500];
 for(var k=0;k<3;k++){
  var key=X.tx(c,'Schema key '+k,keys[k].toUpperCase(),29,colors[k],schemaX[k],460,'Menlo-Regular',3.5,8.05);X.on(key,3.5+k*.12,.4,15);
  var datatype=X.tx(c,'Schema type '+k,'string',22,muted,schemaX[k],713,'Menlo-Regular',3.65,8.05);X.on(datatype,3.65+k*.12,.4,10);
  var bracket=X.draw(c,'Schema bracket '+k,[[schemaX[k]-205,510],[schemaX[k]-220,510],[schemaX[k]-220,665],[schemaX[k]-205,665]],colors[k],2,3.5+k*.12,4.3+k*.12,8.2);
  var right=X.draw(c,'Schema close '+k,[[schemaX[k]+205,510],[schemaX[k]+220,510],[schemaX[k]+220,665],[schemaX[k]+205,665]],colors[k],2,3.5+k*.12,4.3+k*.12,8.2);
 }
 var call=X.tx(c,'Call signature','POST /v1/extract',29,white,960,852,'Menlo-Regular',4.1,8.05);X.on(call,4.1,.4,12);
 var req=X.tx(c,'Request id','req_024  /  Task schema',19,muted,960,912,'Menlo-Regular',4.2,8.05);X.on(req,4.2,.4,8);
 // Response is a coherent readable object, not animated random source code.
 var response=U.comp('PULSE / JSON panel',1320,640,D,true);U.rect(response,'JSON surface',1320,640,panel,660,320,28);var border=M.shape(response,'JSON border','rect',[2640,1280],null,[1320,640],56,r('CFDDE8'),2,0,D);
 var back=U.add(c,response,'Response surface',960,585,1,8,14.7);X.shadow(back,12,18,50);X.scale(back,[8,8.9],[91,100]);X.fade(back,8,8.7,13.8,14.35);
 // Place the background beneath existing value objects.
 back.moveAfter(tokens[0]);
 var status=X.tx(c,'Response status','200 OK',24,mint,385,296,'Menlo-Regular',8.3,14.3,true),rid=X.tx(c,'Response identity','req_024',22,muted,1440,296,'Menlo-Regular',8.3,14.3);
 X.fade(status,8.3,8.7,13.65,14.0);X.fade(rid,8.3,8.7,13.65,14.0);
 var left=X.tx(c,'JSON opening brace','{',230,muted,430,581,'Menlo-Regular',8.3,14.3),right=X.tx(c,'JSON closing brace','}',230,muted,1480,581,'Menlo-Regular',8.3,14.3);X.fade(left,8.3,8.8,13.65,14.0);X.fade(right,8.3,8.8,13.65,14.0);
 var rowY=[436,575,714],jsonX=[];
 for(var j=0;j<3;j++){
  jsonX.push(1000+widths[j]/2);
  var field=X.tx(c,'JSON key '+keys[j],'"'+keys[j]+'":',37,muted,563,rowY[j],'Menlo-Regular',8.3,14.3,true);X.fade(field,8.3+j*.1,8.95+j*.1,13.65,14.0);
  if(j<2){var sep=X.tx(c,'JSON comma '+j,',',42,white,1000+widths[j]+31,rowY[j]+13,'Menlo-Regular',8.4,14.3);X.fade(sep,8.4,9.1,13.65,14.0);}
 }
 // The same response fields become a result that an application can use.
 var task=U.comp('PULSE / Task result',1180,490,D,true);U.rect(task,'Task surface',1180,490,panel,590,245,30);M.shape(task,'Task edge','rect',[2360,980],null,[1180,490],60,r('CFDDE8'),2,0,D);
 U.text(task,'Result context','示例应用 / 任务看板',25,muted,48,57,'HiraginoSansGB-W3');U.rect(task,'Task status',158,46,r('E3F2E9'),1037,58,23);U.text(task,'Task status type','待开始',22,mint,1037,58,'HiraginoSansGB-W3',0,D,true);
 U.text(task,'Owner label','负责人',23,muted,48,364,'HiraginoSansGB-W3');U.text(task,'Due label','截止描述',23,muted,865,287,'HiraginoSansGB-W3');U.rect(task,'Task rule',1084,1,r('D7E3EB'),590,421,0);U.text(task,'Task identity','req_024 → task_024',17,muted,48,454,'Menlo-Regular');
 var card=U.add(c,task,'Usable task',960,622,1,13.65,D);card.moveAfter(tokens[0]);X.shadow(card,14,24,65);X.fade(card,13.65,14.6,D-.03,D);X.scale(card,[13.65,14.6,19.3,20.5,D],[80,100,100,65,65]);X.move(card,[13.65,14.6,19.3,20.5,D],[[960,660],[960,622],[960,622],[1335,622],[1335,622]]);
 var outcome=X.splitText(c,'Result claim','返回值，直接成为下一步。',72,white,200,235,1600,13.8,19.25);
 var taskPositions=[[1302,736],[580,741],[564,575]],closePositions=[];
 for(var cp=0;cp<3;cp++)closePositions.push([1335+(taskPositions[cp][0]-960)*.65,622+(taskPositions[cp][1]-622)*.65]);
 for(var f=0;f<3;f++){
  N.clean(M.pos(tokens[f]));
  var moveTimes=[.35,3.15,4.5+f*.18,7.95,9.25,13.65],moveValues=[[initialX[f],584],[initialX[f],584],[schemaX[f],588],[schemaX[f],588],[jsonX[f],rowY[f]],[jsonX[f],rowY[f]]];
  // Owner clears the left lane before the task travels upward; no crossed labels.
  if(f===1){moveTimes.push(14.25,14.75);moveValues.push([580,575],taskPositions[f]);}
  if(f===2){moveTimes.push(14.25);moveValues.push([jsonX[f],rowY[f]]);}
  moveTimes=moveTimes.concat([15.3,19.3,20.5,D]);moveValues=moveValues.concat([taskPositions[f],taskPositions[f],closePositions[f],closePositions[f]]);X.move(tokens[f],moveTimes,moveValues);
  X.scale(tokens[f],[.35,13.65,15.3,19.3,20.5,D],[100,100,f===2?114:70,f===2?114:70,f===2?74.1:45.5,f===2?74.1:45.5]);
 }
 var endOne=X.splitText(c,'Close one','从输入，',104,white,110,440,900,19.45,D),endTwo=X.splitText(c,'Close two','到可用的结果。',104,mint,110,587,1100,19.62,D);
 var sig=X.tx(c,'Close call','POST /v1/extract',27,muted,116,770,'Menlo-Regular',20.1,D,true);X.on(sig,20.1,.45,12);
 X.pinHeader(c,'PULSE / API','STRUCTURED OUTPUT',white,muted,'接口与产品为概念示例 · 字段对应附可校验 JSON');
 c.openInViewer();$.writeln('PULSE API created: same values through request, schema, JSON and task.');
})();
