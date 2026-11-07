(function(){
 var M=MuseNative,r=U.r,P=PLAN.data,T=P.times,D=P.duration,A=DATA,rows=A.rows,blue=r('2449ED'),ink=r('18313E'),paper=r('EDF0F3'),muted=r('73828A'),line=r('D8DFDF'),white=r('FFFFFF'),colors=[blue,r('42A994'),r('DDA74D'),r('9BA8B3')];
 var c=U.comp(P.composition,1920,1080,D);c.bgColor=paper;B.paper(c,D);
 var panel=U.rect(c,'Source table surface',1090,638,white,1255,605,17,0,6.5);U.fade(panel,0,.55,5.6,6.3);N.shadow(panel,15,22,60);B.rim(panel,'FFFFFF',85);
 var sourceLabel=U.text(c,'Source filename','channel-visits.csv',22,ink,753,337,'HelveticaNeue-Medium');U.fade(sourceLabel,.3,.8,5.5,6.1);
 var verified=U.text(c,'Source context','4 个渠道 · 两个等长 28 天窗口',18,muted,753,382);U.fade(verified,.4,.9,5.5,6.1);
 var headers=['渠道','上期','本期'],hx=[753,1135,1480];for(var h=0;h<3;h++){var he=U.text(c,'Column '+h,headers[h],18,muted,hx[h],431);U.fade(he,.5,1.0,5.4,6.0);}
 U.title(c,'Question one','这期增长，',64,ink,120,398,680,0,.65,3.25);U.title(c,'Question two','来自哪里？',64,ink,120,490,680,.12,.65,3.25);
 var query=U.rect(c,'Analyze query',400,54,blue,320,638,27),queryText=U.text(c,'Analyze type','按渠道分析  ↗',23,white,205,638);U.fade(query,.4,.9,2.9,3.3);U.fade(queryText,.4,.9,2.9,3.3);U.pointer(c,'Analyze pointer',[[615,824],[428,639],[428,639],[441,657]],[T.submit-.7,T.submit-.08,T.submit,T.submit+.2],T.submit-.7,T.submit+.4);
 U.title(c,'Source one','先统一口径。',52,ink,120,398,680,3.35,.6,5.8);
 var context=U.text(c,'Measurement','访问次数 / 28 天对 28 天',25,muted,123,510,null,3.5,5.8);U.fade(context,3.5,4.1,5.5,5.8);
 var sourceNumTs=[0,5.5,6.45,8.95,10.15,13.0,14.15,16.35,17.15,20.55];
 var oldBase=0,newBase=0,shareBase=0,barLayers=[];
 for(var i=0;i<4;i++){
  var row=rows[i],y=497+i*102,rl=U.text(c,'Source channel '+i,row.channel,27,ink,753,y);U.fade(rl,.5+i*.08,1.0+i*.08,5.4,6.0);
  for(var g=0;g<2;g++){
   var val=g?row.after:row.before,base=g?newBase:oldBase,cellx=g?1573:1228;
   var stackW=val/A.after*1000,stackX=780+(base+val/2)/A.after*1000,stackY=g?720:500;
   var deltaW=row.delta/A.max_delta*850,deltaX=800+deltaW/2,deltaY=398+i*121;
   var shareW=row.delta/A.delta*1600,shareX=160+shareBase/A.delta*1600+shareW/2;
   var finalP=g&&i===0?[960,350]:[shareX,655],finalS=g&&i===0?[1400,100]:[shareW,96];
   var cell=U.rect(c,(g?'After / ':'Before / ')+row.channel,255,68,colors[i],cellx,y,8,0,20.8);
   U.key(M.pos(cell),sourceNumTs,[[cellx,y],[cellx,y],[stackX,stackY],[stackX,stackY],[deltaX,deltaY],[deltaX,deltaY],[shareX,655],[shareX,655],finalP,finalP],'travel');
   U.key(M.shapeSize(cell),sourceNumTs,[[255,68],[255,68],[stackW,80],[stackW,80],[deltaW,50],[deltaW,50],[shareW,96],[shareW,96],finalS,finalS],'travel');
   if(!g)U.key(M.opacity(cell),[0,8.9,9.7,D],[100,100,0,0],'quiet');else if(i>0)U.key(M.opacity(cell),[0,16.35,17.0,D],[100,100,0,0],'quiet');else U.key(M.opacity(cell),[0,20.5,20.95],[100,100,0],'quiet');
   if(g)barLayers.push(cell);
   var number=U.text(c,'Source value '+g+' '+i,U.fmt(val),28,i===0?white:ink,cellx,y,'HelveticaNeue-Medium',0,6,true);U.fade(number,.5+i*.08,1.05+i*.08,5.4,5.95);
   U.key(M.pos(number),[0,5.5,6.45],[[cellx,y],[cellx,y],[stackX,stackY]],'travel');
  }
  oldBase+=row.before;newBase+=row.after;shareBase+=row.delta;
 }
 // Same zero, same unit, same source objects become total bars.
 var zero=U.line(c,'Shared zero',[[780,416],[780,796]],r('A8B7BD'),1,5.7,9.7);U.fade(zero,5.7,6.3,9.1,9.7);
 for(var j=0;j<2;j++){var yl=j?720:500;var label=U.text(c,'Period label '+j,j?'本期':'上期',26,ink,780,yl-87,null,5.8,9.45);U.fade(label,5.8,6.4,9.0,9.45);var n=U.text(c,'Period total '+j,U.fmt(j?A.after:A.before),38,ink,1748,yl-87,'HelveticaNeue-Medium',5.8,9.45);U.fade(n,5.8,6.5,9,9.45);}
 U.title(c,'Growth figure','+'+Math.round(A.growth*100)+'%',132,blue,120,449,660,5.9,.65,9.25);
 var growthLabel=U.text(c,'Growth meaning','总访问次数增长',29,ink,126,572,null,6.2,9.25);U.fade(growthLabel,6.2,6.7,9,9.25);
 var totalDelta=U.text(c,'Growth equation',U.fmt(A.before)+' → '+U.fmt(A.after),24,muted,126,638,'HelveticaNeue-Medium',6.2,9.25);U.fade(totalDelta,6.2,6.7,9,9.25);

 U.title(c,'Leader figure',Math.round(A.leader.contribution*100)+'%',132,blue,120,449,660,9.7,.65,13.15);
 var leadLabel=U.text(c,'Leader meaning','增量来自自然搜索',30,ink,126,576,null,10,13.15);U.fade(leadLabel,10,10.5,12.9,13.15);
 var eq=U.text(c,'Contribution equation',U.fmt(A.leader.delta)+' / '+U.fmt(A.delta)+' = 65%',23,muted,126,640,'HelveticaNeue-Medium',10.1,13.15);U.fade(eq,10.1,10.6,12.9,13.15);
 var deltaBaseline=U.line(c,'Delta zero',[[800,325],[800,820]],r('A8B7BD'),1,9.6,13.4);U.fade(deltaBaseline,9.6,10.2,13,13.4);
 for(var k=0;k<4;k++){
  var y2=398+k*121,dl=U.text(c,'Delta name '+k,rows[k].channel,25,k===0?blue:ink,800,y2-48,null,9.7,13.5);U.fade(dl,9.7,10.2,13.1,13.5);
  var dn=U.text(c,'Delta number '+k,'+'+U.fmt(rows[k].delta),28,k===0?blue:muted,825+rows[k].delta/A.max_delta*850,y2,'HelveticaNeue-Medium',10.0,13.5);U.fade(dn,10.0,10.35,13.1,13.5);
 }
 U.title(c,'Contribution headline','65% 的新增访问，来自自然搜索。',58,ink,177,250,1560,13.35,.65,16.55);
 var part=U.text(c,'Part figure','65%',151,blue,159,448,'HelveticaNeue-Medium',13.7,16.7);U.fade(part,13.7,14.2,16.35,16.7);
 var whole=U.text(c,'Whole reference','总新增 '+U.fmt(A.delta)+' 次访问 = 100%',29,ink,1175,465,null,13.7,16.7);U.fade(whole,13.7,14.2,16.35,16.7);
 for(var q=0;q<4;q++){var dot=U.circle(c,'Legend dot '+q,12,colors[q],181+q*399,787,13.7,16.8),tl=U.text(c,'Legend '+q,rows[q].channel+'  '+Math.round(rows[q].contribution*100)+'%',23,ink,200+q*399,787,null,13.7,16.8);U.fade(dot,13.7,14.3,16.4,16.8);U.fade(tl,13.7,14.3,16.4,16.8);}
 // The selected source segment becomes the action-card header; the unit is restated.
 var actionBody=U.rect(c,'Action sheet',1400,490,white,960,645,0,16.4,21.0);actionBody.moveToEnd();
 // Restore paper below this late background: move above base paper with explicit layer order.
 actionBody.moveBefore(c.layer('Paper'));
 U.fade(actionBody,16.4,17,20.55,21.0);N.shadow(actionBody,15,25,65);
 var actionTitle=U.text(c,'Action title','下一步：验证增长的质量。',39,white,311,350,'HiraginoSansGB-W6',17.0,20.65);U.fade(actionTitle,17,17.4,20.4,20.65);
 var act1=U.text(c,'Next action','复盘自然搜索落地页',45,ink,310,487,'HiraginoSansGB-W6',17.2,20.6);U.fade(act1,17.2,17.65,20.3,20.6);
 var act2=U.text(c,'Next question','核对新增访问的转化率与质量。',29,ink,312,574,null,17.3,20.6);U.fade(act2,17.3,17.75,20.3,20.6);
 var act3=U.text(c,'Boundary','依据：增量贡献 65%    ·    待补充：转化数据',22,muted,312,649,null,17.4,20.6);U.fade(act3,17.4,17.85,20.3,20.6);
 var file=U.text(c,'Source citation','SOURCE / channel-visits.csv',19,muted,312,787,'HelveticaNeue-Medium',17.3,20.7);U.fade(file,17.3,17.8,20.4,20.7);
 var exportButton=U.rect(c,'Export button',252,60,blue,1498,786,30,17.4,20.6);U.fade(exportButton,17.4,17.9,20.3,20.6);var ex=U.text(c,'Export label','生成分析简报  ↗',23,white,1397,786,null,17.4,20.6);U.fade(ex,17.4,17.9,20.3,20.6);U.pointer(c,'Export pointer',[[1770,940],[1501,783],[1501,783],[1514,800]],[T.export-.65,T.export-.08,T.export,T.export+.18],T.export-.65,T.export+.4);

 var report=U.comp('DataTalk / Delivered report',1030,710,D,true);U.rect(report,'Report paper',1030,710,white,515,355,10);U.text(report,'Report brand','DataTalk',28,blue,37,45,'HelveticaNeue-Medium');U.text(report,'Report label','增长复盘 / 示例数据',15,muted,775,45);U.text(report,'Report title','增长，主要来自自然搜索。',40,ink,38,119,'HiraginoSansGB-W6');
 for(var z=0;z<2;z++){U.rect(report,'Metric tile '+z,458,145,r('F2F5F4'),268+z*495,252,11);U.text(report,'Metric label '+z,z?'自然搜索的增量贡献':'总访问次数变化',16,muted,58+z*495,207);U.text(report,'Metric '+z,z?'65%':'+20%',60,blue,57+z*495,267,'HelveticaNeue-Medium');U.text(report,'Metric detail '+z,z?'新增 1,300 / 总新增 2,000':'10,000 → 12,000',16,ink,59+z*495,309);}
 U.text(report,'Source details','channel-visits.csv · 28 天对 28 天 · 单位：访问次数',16,muted,39,372);
 var columns=['渠道','上期','本期','增量'],cx=[40,460,630,805];for(var h=0;h<4;h++)U.text(report,'Report column '+h,columns[h],12,muted,cx[h],399);
 for(var f=0;f<4;f++){var yy=428+f*48;U.rect(report,'Report row line '+f,954,1,line,515,yy+24);U.text(report,'Report channel '+f,rows[f].channel,19,f===0?blue:ink,40,yy);U.text(report,'Report before '+f,U.fmt(rows[f].before),19,ink,460,yy,'HelveticaNeue-Medium');U.text(report,'Report after '+f,U.fmt(rows[f].after),19,ink,630,yy,'HelveticaNeue-Medium');U.text(report,'Report delta '+f,'+'+U.fmt(rows[f].delta),19,blue,805,yy,'HelveticaNeue-Medium');}
 U.text(report,'Report next','下一步：复盘落地页，并验证转化质量。',23,ink,40,650);U.text(report,'Report note','数据为虚构示例，增量贡献不等于因果。',12,muted,40,688);
 var cover=U.rect(c,'Blue result field',500,5,blue,1270,292,0,23.2,D);U.key(M.pos(cover),[23.2,24.0],[[1270,292],[960,540]],'travel');U.key(M.shapeSize(cover),[23.2,24.0],[[500,5],[1920,1080]],'travel');
 B.cobalt(cover);
 var rep=U.add(c,report,'Delivered analysis report',960,585,1.06,20.5,D);N.shadow(rep,22,30,70);U.key(M.pos(rep),[20.5,21.15,23.2,24.0,D],[[960,640],[960,585],[960,585],[1380,589],[1380,589]],'travel');U.key(M.scale(rep),[20.5,21.15,23.2,24.0,D],[[48,48],[53,53],[53,53],[36,36],[36,36]],'travel');U.key(M.opacity(rep),[20.5,21.15],[0,100],'quiet');
 U.title(c,'Data end one','从数字，',76,white,121,430,820,23.8,.6,26.3);U.title(c,'Data end two','到下一步。',76,white,121,539,820,23.95,.6,26.3);
 var id=U.text(c,'Identity','DataTalk',31,ink,104,67,'HelveticaNeue-Medium');U.colorText(id,ink).expression='time<23.8?'+JSON.stringify(ink)+':'+JSON.stringify(white);
 var spec=U.text(c,'Series','EVIDENCE → ACTION / 02',16,muted,1500,67,'HelveticaNeue-Medium');U.colorText(spec,muted).expression='time<23.8?'+JSON.stringify(muted)+':'+JSON.stringify(r('CAD5FF'));
 var headLine=U.rect(c,'Header rule',1710,1,line,960,111);M.opacity(headLine).setValue(35);N.fill(headLine).expression='time<23.8?'+JSON.stringify(line)+':'+JSON.stringify(r('5473EE'));
 var disclaimer=U.text(c,'Scope','概念演示 · 虚构访问数据 · 两个等长 28 天窗口',14,muted,712,1045);U.colorText(disclaimer,muted).expression='time<23.8?'+JSON.stringify(muted)+':'+JSON.stringify(r('CAD5FF'));
 c.openInViewer();$.writeln('Data film created from CSV calculations, with same-object chart transforms and delivered report.');
})();
