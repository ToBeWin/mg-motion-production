(function(){
 var M=MuseNative,r=U.r,P=PLAN.agent,T=P.times,D=P.duration,ink=r('173E37'),white=r('F4F7EF'),mint=r('91D9C1'),muted=r('AAB4B0'),line=r('4A5557'),violet=r('C8C7F4'),sand=r('E7C49A');
 var c=U.comp(P.composition,1920,1080,D);B.graphite(c,D);
 var state=M.group(c,'Task state',0,D),route=state.property('ADBE Effect Parade').addProperty('ADBE Slider Control');route.name='Route';M.key(route.property('Slider'),[0,T.explore],[0,2],{hold:true});
 var selected="comp('"+P.composition+"').layer('Task state').effect('Route')('Slider')";
 var img=app.project.importFile(new ImportOptions(new File(ASSET_ROOT+'/roam-coast.png')));
 var page=U.comp('ROAM / Interactive website',1040,650,D,true);U.rect(page,'Warm page',1040,650,r('F0F2E9'),520,325);
 U.text(page,'ROAM','ROAM',31,ink,28,38,'HelveticaNeue-Bold');U.text(page,'Chinese brand','漫游',15,ink,134,38);U.text(page,'Navigation','目的地     灵感     关于',16,ink,785,38);
 var hero=U.photo(page,img,'Original travel photo',20,80,1000,395,D);var photoWipe=N.fx(hero,'Linear Wipe',{'Wipe Angle':90,'Feather':22});U.key(photoWipe.property('Transition Completion'),[0,T.build_photo,T.build_photo+.65,D],[100,100,0,0],'quiet');
 U.text(page,'Eyebrow','GO SOMEWHERE NEW.',12,white,62,140,'HelveticaNeue-Medium');U.text(page,'Headline','去发现。',75,white,58,240,'HiraginoSansGB-W6');U.text(page,'Subhead','未曾抵达的风景。',31,white,63,320);
 U.rect(page,'Explore button',182,49,r('E8D4A3'),153,403,25);U.text(page,'Explore label','开始漫游  ↗',20,ink,90,403);
 U.text(page,'Explore header','下一程，想去哪里？',22,ink,24,505);
 var topics=PLAN.agent.requirements,tabColors=[mint,violet,sand];
 for(var i=0;i<3;i++){
  var bg=U.rect(page,'Topic '+i,318,54,r('E4EBDD'),180+i*340,555,8);N.fill(bg).expression='('+selected+'=='+i+')?'+JSON.stringify(ink)+':'+JSON.stringify(r('E4EBDD'));
  var tt=U.text(page,'Topic type '+i,topics[i],20,ink,48+i*340,555);U.colorText(tt,ink).expression='('+selected+'=='+i+')?'+JSON.stringify(white)+':'+JSON.stringify(ink);
  U.text(page,'Topic arrow '+i,'↗',22,ink,298+i*340,555);
 }
 var before=U.text(page,'City detail','在街角，遇见另一种日常。',23,ink,28,613);before.outPoint=T.explore;
 U.text(page,'Trail detail','把视线，交给远方。',23,ink,28,613,null,T.explore,D);
 U.text(page,'Detail meta','ROAM / JOURNAL',11,r('738575'),838,613,'HelveticaNeue-Medium');
 U.pointer(page,'Browse pointer',[[980,630],[858,555],[858,555],[874,572],[990,640]],[T.explore-.8,T.explore-.08,T.explore,T.explore+.16,T.explore+.85],T.explore-.8,T.explore+.9);
 // The editable page is constructed in meaningful groups, not faded as a finished card.
 function buildGroup(names,start,span){for(var n=0;n<names.length;n++){var l=page.layer(names[n]);U.key(M.opacity(l),[0,start,start+span,D],[0,0,100,100],'quiet');}}
 buildGroup(['ROAM','Chinese brand','Navigation'],7.35,.3);
 buildGroup(['Eyebrow','Headline','Subhead'],T.build_headline,.45);
 buildGroup(['Explore button','Explore label'],T.build_cta,.35);
 buildGroup(['Explore header'],T.build_topics-.15,.3);
 for(var bi=0;bi<3;bi++)buildGroup(['Topic '+bi,'Topic type '+bi,'Topic arrow '+bi],T.build_topics+bi*.15,.35);
 buildGroup(['City detail','Detail meta'],9.1,.4);
 // Inspection outlines touch the corresponding elements and end before browsing.
 function focus(co,name,w,h,x,y,start,end){var sc=U.s(co),l=M.shape(co,name,'rect',[w*sc,h*sc],null,[x*sc,y*sc],8*sc,mint,2.2*sc,start,end);U.key(M.opacity(l),[start,start+.14,end-.14,end],[0,100,100,0],'quiet');return l;}
 focus(page,'Inspect topic navigation',1006,69,520,555,T.check_first,T.check_first+.48);
 focus(page,'Inspect navigation targets',260,46,898,38,T.check_second,T.check_second+.48);
 var phone=U.comp('ROAM / Mobile preview',300,620,D,true);U.rect(phone,'Phone rim',300,620,r('061B1B'),150,310,36);U.rect(phone,'Screen',288,608,r('F0F2E9'),150,310,30);
 U.rect(phone,'Speaker',72,16,r('061B1B'),150,23,8);U.text(phone,'Mobile brand','ROAM',29,ink,25,79,'HelveticaNeue-Bold');U.text(phone,'Mobile Chinese','漫游',13,ink,122,80);
 U.photo(phone,img,'Mobile travel',16,117,268,315,D);U.text(phone,'Mobile title','去发现。',41,white,35,243,'HiraginoSansGB-W6');U.text(phone,'Mobile subtitle','未曾抵达的风景。',17,white,36,290);
 U.rect(phone,'Mobile CTA',174,40,r('E8D4A3'),123,365,20);U.text(phone,'Mobile CTA type','开始漫游 ↗',14,ink,61,365);
 U.text(phone,'Mobile chooser','下一程，想去哪里？',17,ink,24,464);for(var q=0;q<3;q++){var mb=U.rect(phone,'Mobile topic '+q,76,45,r('E0E8D9'),60+q*90,520,7);N.fill(mb).expression='('+selected+'=='+q+')?'+JSON.stringify(ink)+':'+JSON.stringify(r('E0E8D9'));var mt=U.text(phone,'Mobile topic type '+q,['城市','海岸','山野'][q],14,ink,46+q*90,520);U.colorText(mt,ink).expression='('+selected+'=='+q+')?'+JSON.stringify(white)+':'+JSON.stringify(ink);}
 var old=U.text(phone,'Mobile city detail','在街角，遇见日常。',16,ink,24,578);old.outPoint=T.explore;U.text(phone,'Mobile trail detail','把视线，交给远方。',16,ink,24,578,null,T.explore,D);U.rect(phone,'Home',94,4,ink,150,604,2);focus(phone,'Inspect mobile bounds',278,596,150,310,T.check_done,T.check_done+.65);

 // One brief surface contracts into the task bar; the task itself remains visible.
 var task=U.rect(c,'Brief becomes task bar',1150,360,r('2B3337'),960,565,24);U.key(M.shapeSize(task),[0,T.submit,T.workspace],[[1150,360],[1150,360],[1670,78]],'travel');U.key(M.pos(task),[0,T.submit,T.workspace],[[960,565],[960,565],[960,224]],'travel');U.fade(task,0,.45,14.0,14.5);
 B.rim(task,'98AAA5',32);N.shadow(task,28,22,62);
 var briefLabel=U.text(c,'Brief identifier','ROAM / SITE BRIEF',18,mint,432,424,'HelveticaNeue-Medium');U.fade(briefLabel,0,.5,3.17,3.36);
 var taskText=U.text(c,'Persistent task',P.task,44,white,432,510,'HiraginoSansGB-W6');U.key(M.pos(taskText),[0,T.submit,T.workspace],[[432,510],[432,510],[296,224]],'travel');U.key(M.scale(taskText),[0,T.submit,T.workspace],[[100,100],[100,100],[65,65]],'travel');U.fade(taskText,0,.5,14.0,14.5);
 for(var i=0;i<3;i++){var ch=U.rect(c,'Brief chip '+i,178,43,r('3E494A'),521+i*202,601,21),tt=U.text(c,'Brief topic '+i,topics[i],20,white,455+i*202,601);U.fade(ch,.4,.9,3.2,3.4);U.fade(tt,.4,.9,3.2,3.4);}
 var submit=U.rect(c,'Submit',181,48,mint,1400,678,24),submitText=U.text(c,'Submit type','开始协作  ↗',21,ink,1331,678);U.fade(submit,.6,1.1,3.2,3.37);U.fade(submitText,.6,1.1,3.2,3.37);
 U.pointer(c,'Submit pointer',[[1600,895],[1402,676],[1402,676],[1411,687]],[T.submit-.85,T.submit-.08,T.submit,T.submit+.16],T.submit-.85,T.submit+.35);
 U.title(c,'Opening','让需求，成为页面。',61,white,492,229,1100,0,.65,3.25);

 // Three specific output surfaces, not stand-in role orbs.
 var research=U.comp('Work / Research',430,530,D,true);U.rect(research,'Panel',430,530,r('252C30'),215,265,19);B.rim(research.layer('Panel'),'A7B0AD',24);U.text(research,'Role','01 / 需求',19,mint,28,37);U.text(research,'Artifact','把需求落到内容',29,white,28,103,'HiraginoSansGB-W6');U.text(research,'Source','来自 brief.md 的三项需求',17,muted,28,151);
 for(var i=0;i<3;i++){var y=228+i*94;U.rect(research,'Row '+i,370,71,r('323D3F'),215,y,9);U.text(research,'Number '+i,'0'+(i+1),16,tabColors[i],49,y,'HelveticaNeue-Medium');var tx=U.text(research,'Source text '+i,topics[i],26,white,105,y);U.fade(tx,T.research+i*.3,T.research+.45+i*.3,11.0,11.4);}
 U.text(research,'Research file','CONTENT / 3 SECTIONS',14,muted,28,487,'HelveticaNeue-Medium');
 var rl=U.add(c,research,'Research output',350,610,1,4.0,11.6);U.fade(rl,4.0,4.7,11.0,11.6);U.key(M.pos(rl),[4,4.7,11,11.6],[[350,665],[350,610],[350,610],[100,610]],'travel');
 N.shadow(rl,30,16,52);
 var designBase=U.rect(c,'Design workspace',936,585,r('252C30'),1230,605,18,4,7.8);U.fade(designBase,4,4.7,7.3,7.8);
 B.rim(designBase,'A7B0AD',20);N.shadow(designBase,24,14,50);
 var empty=U.text(c,'Design pending','先结构，再内容',26,muted,1065,605,null,4,7.4);U.fade(empty,4,4.7,7.0,7.4);
 var deslabel=U.text(c,'Design role','02 / 页面生成',20,violet,762,296,null,4.1,11.5);U.fade(deslabel,4.1,4.7,11,11.5);
 var wl=U.add(c,page,'Same website throughout',1230,605,.9,0,D);N.shadow(wl,42,28,75);U.key(M.opacity(wl),[0,T.design,T.design+.35,D],[0,0,100,100],'quiet');
 var wts=[0,T.design,11.2,12.2,14.2,15.1,20.4,21.3,23.5,D];
 U.key(M.pos(wl),wts,[[1230,605],[1230,605],[1230,605],[1100,615],[1100,615],[960,582],[960,582],[1315,595],[1315,588],[1315,588]],'travel');
 U.key(M.scale(wl),wts,[[45,45],[45,45],[45,45],[37,37],[37,37],[62.5,62.5],[62.5,62.5],[42,42],[42,42],[42,42]],'travel');
 var check=U.comp('Work / Verification',408,530,D,true);U.rect(check,'Panel',408,530,r('252C30'),204,265,19);B.rim(check.layer('Panel'),'A7B0AD',24);U.text(check,'Role','03 / 交付检查',19,sand,27,37);U.text(check,'Verification heading','交付前，逐项确认。',26,white,27,103,'HiraginoSansGB-W6');
 var pending=U.text(check,'Pending','等待页面完成',20,muted,29,168);pending.outPoint=T.check;
 U.text(check,'Checked state','可浏览网页 / 实际检查',16,muted,27,166,null,T.check,D);
 var checks=['3 类内容可切换','3 个导航可达','390 px 无横向溢出'],ct=[T.check_first,T.check_second,T.check_done];
 for(var j=0;j<3;j++){
  U.rect(check,'Check rule '+j,352,1,line,204,228+j*90);var text=U.text(check,'Verified '+j,checks[j],22,white,58,264+j*90);U.fade(text,ct[j],ct[j]+.35,D,D+.3);
  var tick=U.line(check,'Tick '+j,[[26,263+j*90],[33,270+j*90],[46,254+j*90]],mint,2.4,ct[j],D);N.trim(tick,ct[j],ct[j]+.32);
 }
 var ck=U.add(c,check,'Verification output',1600,610,1,4,D);U.fade(ck,11.45,11.95,14.0,14.6);U.key(M.pos(ck),[4,11.2,12.2,14.0,14.6],[[1600,610],[1600,610],[385,610],[385,610],[-300,610]],'travel');
 ck.moveAfter(wl);N.shadow(ck,30,16,52);
 var ph=U.add(c,phone,'Same mobile preview',2000,620,.72,11,D);U.key(M.pos(ph),[11.2,12.3,14.2,15.0,23.5,24.3,D],[[2020,620],[1680,620],[1680,620],[2150,620],[2150,720],[1755,730],[1755,730]],'travel');U.key(M.opacity(ph),[11,11.3,14.7,15.1,23.4,24.1,D],[0,100,100,0,0,100,100],'quiet');N.shadow(ph,40,22,48);
 // Handoffs connect actual artifacts at their existing edges.
 var hand=U.line(c,'Content to design',[[565,582],[646,582],[646,580],[762,580]],mint,2.5,6.4,8.3);N.trim(hand,6.4,7.15);U.fade(hand,6.4,6.6,7.8,8.3);
 var stamp=U.text(c,'Ready status','ROAM / READY TO EXPLORE',18,mint,727,143,'HelveticaNeue-Medium',14.8,20.6);U.fade(stamp,14.8,15.25,20.2,20.6);
 U.title(c,'Deliver one','网页、素材、',53,white,121,407,740,20.9,.55,23.45);U.title(c,'Deliver two','检查记录。',53,white,121,482,740,21.04,.55,23.45);
 var files=['index.html','assets/roam-coast.png','checks.json'];for(var z=0;z<3;z++){var f=U.text(c,'Delivered file '+z,files[z],23,z===0?mint:muted,126,596+z*52,'HelveticaNeue-Medium',21.3,D);U.fade(f,21.3+z*.1,21.7+z*.1,23.25,23.55);}
 U.title(c,'End one','从想到，',73,white,120,430,820,23.55,.6,27.3);U.title(c,'End two','一起做到。',73,mint,120,535,820,23.7,.6,27.3);
 U.text(c,'Identity','一念协作',28,white,105,67,'HiraginoSansGB-W6');U.text(c,'Series','TASK → RESULT / 01',17,muted,1560,67,'HelveticaNeue-Medium');U.rect(c,'Header rule',1710,1,line,960,111);M.opacity(c.layer('Header rule')).setValue(24);
 U.text(c,'Concept','AI 协作概念演示 · 附可浏览网页与实际检查记录',14,muted,706,1045);
 c.openInViewer();$.writeln('Agent film created with native task contraction, linked website and verification artifacts.');
})();
