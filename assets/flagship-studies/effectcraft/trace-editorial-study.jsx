(function(){
 var M=MuseNative,r=M.rgb,D=28,c=U.comp(PLAN.cases.trace.composition,1920,1080,D),ink=r('344256'),muted=r('7C8190'),blue=r('6863A3'),paper=r('F7F6F2'),lav=r('ECEAF5'),line=r('D9D8E2');
 F.base(c,paper);
 var label=F.txt(c,'Opening signature','TRACE  /  KNOWLEDGE STUDIO',21,ink,108,90,0,2.8,true,'HelveticaNeue-Medium');
 F.title(c,'Question headline 1','答案，',156,ink,100,383,.08,2.8);F.title(c,'Question headline 2','从哪里来？',156,ink,100,603,.26,2.8);
 F.txt(c,'Opening intent','让每一步判断，都有据可循。',31,muted,112,850,.55,2.8,true);
 // A single reference mark is the spine of the film, not a decorative logo cut.
 var mark=F.mark(c,'Reference identity',1475,512,1.5,blue,0,D);
 X.scale(mark,[0,.8,2.45,3.5,5.5,6.3,23.15,24.1,24.65,D],[105,145,145,28,28,14,14,85,72,72]);
 X.move(mark,[0,.8,2.45,3.5,5.5,6.3,23.15,24.1,24.65,D],[[1475,555],[1475,512],[1475,512],[1560,530],[1560,530],[94,82],[94,82],[408,482],[408,482],[408,482]]);
 var queryBG=X.rect(c,'Question lavender',1920,1080,lav,960,540,0,2.8,6.15);queryBG.moveAfter(mark);
 F.txt(c,'Question stage index','01 / 提出问题',22,blue,110,112,3.05,5.8,true);
 F.title(c,'Question one',DATA.question[0],78,ink,110,395,3.05,5.8);F.title(c,'Question two',DATA.question[1],78,ink,110,525,3.22,5.8);
 var u=X.draw(c,'Question underline becomes reading rail',[[112,645],[1320,645]],blue,3,3.6,4.2,6.1);
 F.txt(c,'Question scope','产品知识库',25,muted,115,743,3.6,5.85,true);
 var qFormats=['PDF','MD','TXT'];for(var qi=0;qi<3;qi++){var qx=447+qi*170;var q=X.rect(c,'Format label '+qi,140,62,paper,qx,744,5,3.75,5.8);X.on(q,3.75+qi*.08,.35,20);F.txt(c,'Format text '+qi,qFormats[qi],23,blue,qx,744,3.85+qi*.08,5.8,false,'Menlo-Regular');}
 // Documents form an editorial spread. Each has real source text and a stable number.
 var page=U.comp('TRACE / Full source spread',1920,1080,D,true);U.rect(page,'Source spread paper',1920,1080,paper,960,540,0);
 U.line(page,'Central binding',[[960,155],[960,970]],line,2);
 var quotes=[];
 for(var i=0;i<2;i++){
  var doc=DATA.documents[i],ox=112+i*960;
  U.text(page,'Chapter '+i,'0'+(i+1),112,blue,ox,261,'HelveticaNeue-Light');
  U.text(page,'Source title '+i,doc.title,49,ink,ox,382,'HiraginoSansGB-W6');
  U.text(page,'Source metadata '+i,doc.format+' / 版本 '+doc.version+' / '+doc.section,21,muted,ox,449,'HiraginoSansGB-W3');
  U.line(page,'Source ruler '+i,[[ox,490],[ox+730,490]],line,1);
  var h=7.05+i*1.2;var hl=U.rect(page,'Read span '+i,740,134,lav,ox+370,607,5,h,D);U.key(M.scale(hl),[h,h+.5],[[0,100],[100,100]],'travel');
  for(var j=0;j<doc.excerpt.length;j++)U.text(page,'Exact source '+i+' '+j,doc.excerpt[j],31,ink,ox+22,doc.excerpt.length===1?605:581+j*51,'HiraginoSansGB-W3',0,10.0);
  U.text(page,'Source context heading '+i,'补充说明',21,muted,ox,762,'HiraginoSansGB-W6');
  for(var j=0;j<doc.context.length;j++)U.text(page,'Context '+i+' '+j,doc.context[j],24,muted,ox,814+j*45,'HiraginoSansGB-W3');
  U.text(page,'Source foot '+i,doc.number+'  /  '+doc.section,18,muted,ox,969,'Menlo-Regular');
 }
 var spread=U.add(c,page,'Read the original documents',960,540,1,5.8,10.75);X.move(spread,[5.8,6.55,9.8,10.75],[[960,1150],[960,540],[960,540],[960,35]]);X.scale(spread,[5.8,6.55,9.8,10.75],[110,100,100,90]);
 spread.moveAfter(mark);F.txt(c,'Read step','02 / 找到依据',22,blue,164,83,6.3,10.1,true);F.txt(c,'Reading descriptor','两段原文，回答两个问题。',23,muted,1195,83,6.5,10.1,true);
 // The original quotations physically leave the documents and become answer lines.
 for(var e=0;e<2;e++){
  var claim=DATA.claims[e],co=U.comp('TRACE / Persistent quote '+e,800,156,D,true);
  U.rect(co,'Evidence tint',800,156,lav,400,78,4);
  U.text(co,'Reference number',String(e+1),32,blue,744,78,'Menlo-Regular',0,D,true);
  for(var j=0;j<claim.lines.length;j++)U.text(co,'Verbatim evidence '+j,claim.lines[j],31,ink,24,claim.lines.length===1?78:54+j*51,'HiraginoSansGB-W3');
  var l=U.add(c,co,'Same evidence / '+claim.document_id,512+960*e,607,1,10.0,23.7);quotes.push(l);
  X.move(l,[10,11,13.2,14.1,19.8,20.6,23.2,23.7],[[512+960*e,607],[482+960*e,575],[482+960*e,575],[480+960*e,782],[480+960*e,782],[e?1374:258,e?632:597],[e?1374:258,e?632:597],[e?1374:258,1250]]);
  X.scale(l,[10,11,13.2,14.1,19.8,20.6,23.2,23.7],[100,94,94,92,92,e?98:36.8,e?98:36.8,85]);
 }
 F.title(c,'Extraction headline','依据，不在答案之外。',94,ink,110,257,10.65,13.2);
 F.txt(c,'Evidence source 1','01  知识库发布说明',24,blue,114,746,11,13.2,true);F.txt(c,'Evidence source 2','02  同步与更新',24,blue,1074,746,11.1,13.2,true);
 var join=X.draw(c,'One line connects two citations',[[115,851],[1790,851]],line,2,11,11.7,13.2);
 // A full-page designed answer replaces the repeated floating-card layout.
 var answer=U.comp('TRACE / Readable answer',1920,1080,D,true);U.rect(answer,'Answer page',1920,1080,paper,960,540,0);
 U.text(answer,'Answer heading','根据资料，答案如下。',58,ink,112,240,'HiraginoSansGB-W6');
 U.text(answer,'Formats count','01',26,blue,112,365,'Menlo-Regular');U.text(answer,'Format value','PDF',116,ink,112,500,'HelveticaNeue-Medium');U.text(answer,'Format value MD','Markdown',68,blue,114,619,'HelveticaNeue-Medium');U.text(answer,'Format value TXT','TXT',68,ink,600,619,'HelveticaNeue-Medium');
 U.line(answer,'Answer gutter',[[960,325],[960,885]],line,1);
 U.text(answer,'Update count','02',26,blue,1072,365,'Menlo-Regular');U.text(answer,'Update action 1','重新同步，',77,ink,1072,495,'HiraginoSansGB-W6');U.text(answer,'Update action 2','让更新生效。',77,blue,1072,609,'HiraginoSansGB-W6');
 U.line(answer,'Bottom rule',[[112,929],[1807,929]],line,1);U.text(answer,'Source annotation','带来源的答案 / 点击编号，回到原文',23,muted,112,982,'HiraginoSansGB-W3');
 var result=U.add(c,answer,'Answer editorial layout',960,540,1,13.2,23.7);result.moveAfter(quotes[0]);X.move(result,[13.2,14.1,19.8,20.6,23.2,23.7],[[960,980],[960,540],[960,540],[450,500],[450,500],[450,1150]]);X.scale(result,[13.2,14.1,19.8,20.6,23.2,23.7],[92,100,100,40,40,38]);
 F.txt(c,'Answer step','03 / 形成答案',22,blue,164,83,13.65,19.8,true);
 // Closeup source return: reference number is the match point of the transition.
 var cursorX=1440+(744-400)*.92;
 U.pointer(c,'Follow reference two',[[1870,950],[cursorX+26,812],[cursorX,782],[cursorX,782]],[19.1,19.65,19.8,20.0],19.1,20.05);
 var click=X.ring(c,'Reference click',cursorX,782,48,blue,3,19.8,20.3);X.scale(click,[19.8,20.3],[50,240]);X.fade(click,19.8,19.86,20,20.3);
 var source=U.comp('TRACE / Return to source two',920,840,D,true);U.rect(source,'Source paper',920,840,r('FFFFFF'),460,420,0);U.text(source,'Source second chapter','02',96,blue,70,133,'HelveticaNeue-Light');U.text(source,'Source second title',DATA.documents[1].title,54,ink,70,260,'HiraginoSansGB-W6');U.text(source,'Source second section','MD / 内容更新 / 原文',23,muted,70,331,'HiraginoSansGB-W3');U.line(source,'Source divider',[[70,375],[850,375]],line,1);U.text(source,'Source context','同步记录可用于确认当前资料版本。',28,muted,70,666,'HiraginoSansGB-W3');
 var ret=U.add(c,source,'Return to the same original source',1374,570,1,19.9,23.7);ret.moveAfter(quotes[0]);X.move(ret,[19.9,20.6,23.2,23.7],[[2170,570],[1374,570],[1374,570],[1374,1250]]);X.shadow(ret,12,20,60);
 F.txt(c,'Return step','04 / 回到原文',22,blue,164,83,20.3,23.7,true);F.txt(c,'Return caption','一句答案，',38,ink,112,838,20.6,23.7,true);F.txt(c,'Return caption two','回到同一段原文。',38,ink,112,899,20.6,23.7,true);
 var returnLine=X.draw(c,'Source reference route',[[780,620],[885,620],[885,632],[982,632]],blue,3,20.6,21.1,23.7);
 var close=X.rect(c,'Closing paper',1920,1080,paper,960,540,0,23.7,D);close.moveAfter(mark);
 var name=F.txt(c,'TRACE wordmark','TRACE',220,ink,1125,485,23.95,D,false,'HelveticaNeue-Bold');X.on(name,23.95,.8,75);
 F.title(c,'Closing claim','看见答案，也看见依据。',66,blue,480,738,24.8,D);
 F.txt(c,'Closing fine','FROM SOURCE TO ANSWER',21,muted,960,919,25.3,D,false,'HelveticaNeue-Medium');
 F.txt(c,'Concept scope','原创产品概念 · 示例资料',15,muted,960,1032,25.3,D,false,'HiraginoSansGB-W3');
 mark.moveToBeginning();c.openInViewer();$.writeln('TRACE v2: editorial spread, persistent evidence, source return.');
})();
