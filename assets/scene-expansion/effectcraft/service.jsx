(function(){
 var M=MuseNative,r=M.rgb,P=PLAN.cases.service,D=P.duration,c=U.comp(P.composition,1080,1920,D),paper=r('F3EDE1'),white=r('FFFDF7'),forest=r('234B3F'),muted=r('7A8275'),line=r('D9DACD'),orange=r('CF6B43'),pale=r('F3E0C7');
 var bg=M.gradient(c,'Warm paper studio',[1080,1920],[280,-100],[1100,1900],0,D,r('FBF8F0'),paper,false);X.grain(bg,.085);
 var light=X.rect(c,'Diffuse paper light',450,2700,r('FFFFFF'),200,580,0,0,D);M.rotation(light).setValue(-22);M.opacity(light).setValue(18);N.fx(light,'Gaussian Blur',{'Blurriness':180,'Repeat Edge Pixels':false});
 X.splitText(c,'Opening one','每一份请求，',77,forest,90,330,940,.15,3.2);X.splitText(c,'Opening two','都值得有回音。',77,forest,90,443,970,.34,3.2);
 // A complete designed service receipt, with one identity throughout the journey.
 var ticket=U.comp('LOOP / Request SR-024',800,660,D,true);U.rect(ticket,'Receipt paper',800,660,white,400,330,22);M.shape(ticket,'Receipt edge','rect',[1598,1318],null,[800,660],44,r('E5DED0'),2,0,D);
 U.rect(ticket,'Left brand strip',10,568,forest,33,330,5);U.text(ticket,'Receipt brand','LOOP',31,forest,74,66,'HelveticaNeue-Bold');U.text(ticket,'Receipt identity','SR-024',29,muted,626,65,'Menlo-Regular');
 U.line(ticket,'Receipt first rule',[[74,113],[739,113]],line,1);U.text(ticket,'Receipt title','换货申请',73,forest,72,201,'HiraginoSansGB-W6');U.text(ticket,'Reason label','申请原因',23,muted,74,292,'HiraginoSansGB-W3');U.text(ticket,'Reason','尺码不合适',37,forest,74,348,'HiraginoSansGB-W3');
 U.text(ticket,'Evidence label','随单资料',23,muted,74,420,'HiraginoSansGB-W3');
 var missing=U.text(ticket,'Evidence pending','商品照片待补充',28,orange,74,474,'HiraginoSansGB-W3',0,10.6);X.fade(missing,0,.3,10.25,10.6);
 var got=U.text(ticket,'Evidence received','已收到：商品照片.jpg',28,forest,74,474,'HiraginoSansGB-W3',10.25,D);X.on(got,10.25,.35,0);
 var statusBand=U.rect(ticket,'Status band',668,75,r('EAF0E5'),408,575,12);var stain=N.fill(statusBand);U.key(stain,[0,6.7,7.0,10.3,10.6,D],[r('EAF0E5'),r('EAF0E5'),pale,pale,r('EAF0E5'),r('EAF0E5')],'quiet');
 var states=[['已提交',0,6.8,forest],['待补充商品照片',6.8,10.6,orange],['资料完整',10.6,14.8,forest],['换货处理中',14.8,18.2,forest],['换货已寄出',18.2,D,forest]];
 for(var si=0;si<states.length;si++){var st=states[si];U.text(ticket,'Request state '+si,st[0],31,st[3],106,574,'HiraginoSansGB-W6',st[1],st[2]);}
 U.text(ticket,'Receipt scope','同一编号 · 持续跟进',17,muted,74,630,'HiraginoSansGB-W3');
 // Folded corner remains a shape and light response, not a bitmap mockup.
 M.path(ticket,'Fold shadow',[[1472,0],[1600,128],[1472,128]],r('E8DFCD'),null,0,[0,0],true,0,D);M.path(ticket,'Fold lit face',[[1472,0],[1600,128],[1472,128]],r('F6EFDF'),r('DAD3C4'),1,[0,0],true,0,D);
 var doc=U.add(c,ticket,'Persistent service request',540,1060,1,.3,D);X.shadow(doc,19,25,65);
 var ts=[.3,1.1,3.15,4.3,5.5,6.8,10.7,12,14.8,16.7,18.2,19.5,20.9,D];
 X.move(doc,ts,[[540,1195],[540,1060],[540,1060],[650,600],[650,600],[650,930],[650,930],[650,1250],[650,1250],[650,1580],[650,1580],[650,1580],[540,1090],[540,1090]]);
 X.scale(doc,ts,[92,100,100,64,64,64,64,64,64,60,60,60,100,100]);U.key(M.rotation(doc),[.3,1.1,3.15,4.3,19.5,20.9,D],[-5,-2,-2,0,0,-1,-1],'travel');X.on(doc,.3,.5,0);
 // Role lane, not a decorative network. Each handoff retains SR-024.
 var y=[600,930,1250,1580],roles=['顾客','客服','仓库','通知'],arrivals=[4.3,6.8,12,16.7],completes=[5.5,10.6,14.8,18.2];
 var route=U.comp('LOOP / Service roles',1080,1920,D,false);
 var basePath=X.line(route,'Responsibility baseline',[[174,600],[174,1580]],line,3,3.2,20.3);X.fade(basePath,3.2,4,19.5,20.3);
 for(var i=0;i<4;i++){
  var nd=X.ring(route,'Role node '+i,174,y[i],112,forest,2,3.2,20.3);X.fade(nd,3.2,4,19.5,20.3);
  var num=X.tx(route,'Role number '+i,'0'+(i+1),28,forest,174,y[i],'Menlo-Regular',3.2,20.3);X.fade(num,3.2,4,completes[i]-.1,completes[i]+.2);
  var who=X.tx(route,'Role name '+i,roles[i],31,forest,174,y[i]+92,'HiraginoSansGB-W6',3.2,20.3);X.fade(who,3.2,4,19.5,20.3);
  var mark=X.checked(route,'Role complete '+i,174,y[i],forest,completes[i],20.3,30);X.fade(mark,completes[i],completes[i]+.25,19.5,20.3);
  if(i){var lineSeg=X.draw(route,'Handoff '+i,[[174,y[i-1]+56],[174,y[i]-56]],forest,4,arrivals[i]-.9,arrivals[i],20.3);X.fade(lineSeg,arrivals[i]-.9,arrivals[i]-.7,19.5,20.3);}
 }
 var rolesLayer=U.add(c,route,'Responsibility lane',540,960,1,3.2,20.3);rolesLayer.moveAfter(doc);
 X.splitText(c,'Follow title','一张申请，持续跟进。',59,forest,90,294,950,3.3,6.65);
 X.splitText(c,'Missing title','补齐，再继续。',76,forest,90,294,960,6.8,11.9);
 X.splitText(c,'Warehouse title','进度，接力向前。',67,forest,90,294,960,12.0,16.5);
 X.splitText(c,'Notice title','结果，主动送达。',67,forest,90,294,960,16.7,19.6);
 // The exception carries an attachment back to the same request, with a visible exit.
 var loop=X.draw(c,'Missing evidence branch',[[230,930],[300,930],[300,1178],[390,1178]],orange,3,7.05,7.75,10.6);X.fade(loop,7.05,7.25,10.2,10.6);
 var attachment=U.comp('LOOP / Attachment',520,180,D,true);U.rect(attachment,'Attachment paper',520,180,white,260,90,17);M.shape(attachment,'Attachment border','rect',[1040,360],null,[520,180],34,r('D0C5AF'),2,0,D);U.rect(attachment,'Picture tile',94,106,pale,76,90,12);
 U.line(attachment,'Picture mountains',[[40,114],[67,82],[86,103],[106,71],[117,114]],orange,3);U.circle(attachment,'Picture sun',13,orange,58,61);U.text(attachment,'Attachment name','商品照片.jpg',29,forest,147,69,'HiraginoSansGB-W6');U.text(attachment,'Attachment label','补充资料 · SR-024',20,muted,147,118,'HiraginoSansGB-W3');
 var file=U.add(c,attachment,'Evidence added',650,1190,1,8.1,10.6);X.shadow(file,14,12,30);X.move(file,[8.1,8.7,9.8,10.6],[[650,1260],[650,1190],[650,1190],[650,1022]]);X.scale(file,[8.1,8.7,9.8,10.6],[92,100,100,59]);X.fade(file,8.1,8.5,10.25,10.6);
 var prompt=X.tx(c,'Evidence explanation','资料回到原申请，流程继续。',27,muted,600,1380,'HiraginoSansGB-W3',8.4,10.8);X.fade(prompt,8.4,8.8,10.4,10.8);
 // A dispatch stamp confirms the illustrated terminal state, without promising timing.
 var sent=U.comp('LOOP / Dispatch mark',300,110,D,true);U.rect(sent,'Dispatch pill',300,110,forest,150,55,55);U.text(sent,'Dispatch type','已寄出  ↗',39,white,150,55,'HiraginoSansGB-W6',0,D,true);
 var stamp=U.add(c,sent,'Dispatch confirmed',760,1770,.72,18.2,19.65);X.on(stamp,18.2,.35,20);X.fade(stamp,18.2,18.4,19.3,19.65);
 X.splitText(c,'End one','每一步，',92,forest,90,337,940,20.0,D);X.splitText(c,'End two','都有回音。',92,forest,90,476,970,20.2,D);
 var ending=X.tx(c,'End brand','LOOP',91,forest,540,1632,'HelveticaNeue-Bold',21,D);X.on(ending,21,.6,25);var tag=X.tx(c,'End service','服务有回音',32,forest,540,1746,'HiraginoSansGB-W3',21.3,D);X.on(tag,21.3,.6,18);
 X.pinHeader(c,'LOOP','SERVICE JOURNEY',forest,muted,'服务流程概念 · 示例申请 SR-024');
 c.openInViewer();$.writeln('LOOP created: one request, missing-evidence return, role handoffs and terminal notice.');
})();
