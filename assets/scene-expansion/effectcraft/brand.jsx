(function(){
 var M=MuseNative,r=M.rgb,P=PLAN.cases.brand,D=P.duration,c=U.comp(P.composition,1920,1080,D),cream=r('F2F0E7'),ink=r('182122'),blue=r('3458EF');
 var sky=X.rect(c,'Pale periwinkle stage',1920,1080,r('DCE5F6'),960,540,0,0,D);X.grain(sky,.055);
 var paper=X.rect(c,'Opening paper',1920,1080,cream,960,540,0,0,3.2);X.grain(paper,.055);
 var openOne=X.splitText(c,'Opening one','让想法',172,ink,145,410,1230,.08,2.62),openTwo=X.splitText(c,'Opening two','向前一步。',172,ink,145,650,1450,.25,2.62);
 var mini=X.tx(c,'Opening brand','SHIFT',28,ink,150,146,'HelveticaNeue-Bold',0,2.8,true);X.on(mini,.08,.3,10);
 var note=X.tx(c,'Opening descriptor','A NEW WAY TO CREATE',18,ink,150,878,'HelveticaNeue-Medium',.6,2.7,true);X.on(note,.6,.4,10);
 // The two forward slashes are the mother shape. One expands into the blue field.
 var barA=M.path(c,'Mother shape A',[[0,-300],[145,-300],[-10,300],[-155,300]],blue,null,0,[1505,540],true,0,D);
 var barB=M.path(c,'Mother shape B',[[0,-300],[145,-300],[-10,300],[-155,300]],blue,null,0,[1690,540],true,0,D);
 X.move(barA,[0,2.35,3.0,5.95,6.7,9.45,10.0,12.25,13.2,14.0,D],[[1505,540],[1505,540],[960,540],[960,540],[1395,540],[1395,540],[1395,540],[1395,540],[960,540],[380,495],[380,495]]);
 X.scale(barA,[0,.6,2.35,3.0,5.95,6.7,12.25,13.2,14.0,D],[70,100,100,[2200,1000],[2200,1000],100,100,[2200,1000],[32,44],[32,44]]);
 X.move(barB,[0,2.35,2.95,5.95,6.7,9.45,10,12.25,13.2,14.0,D],[[1690,540],[1690,540],[2350,540],[2350,540],[1590,540],[1590,540],[1590,540],[1590,540],[2350,540],[466,495],[466,495]]);
 X.scale(barB,[0,.6,5.95,6.7,13.2,14,D],[70,100,100,100,100,[32,44],[32,44]]);
 U.key(N.fill(barA),[0,13.2,14.0,D],[blue,blue,cream,cream],'quiet');U.key(N.fill(barB),[0,13.2,14.0,D],[blue,blue,cream,cream],'quiet');
 // A three-band text reveal recombines into one fully readable word.
 var forward=U.comp('SHIFT / Forward word',1920,1080,D,true);U.text(forward,'Forward','向前',380,cream,960,540,'HiraginoSansGB-W6',0,D,true);
 var ranges=[[260,468],[468,615],[615,845]];
 for(var i=0;i<3;i++){
  var slice=U.add(c,forward,'Forward band '+i,960,540,1,3.0,6.2);M.mask(slice,0,ranges[i][0]*2,3840,ranges[i][1]*2);
  X.move(slice,[3.0+i*.055,3.7+i*.055,5.6,6.2],[[960+(i%2?240:-240),540],[960,540],[960,540],[960+(i%2?-160:160),540]]);X.fade(slice,3.0+i*.055,3.25+i*.055,5.85,6.2);
 }
 var line=X.draw(c,'Forward underline',[[395,843],[1470,843],[1428,805],[1470,843],[1428,881]],cream,5,3.55,4.2,6.2);X.fade(line,3.55,3.7,5.9,6.2);
 var sub=X.tx(c,'Forward subtitle','让改变，从一个动作开始。',33,cream,960,929,'HiraginoSansGB-W3',3.8,6.15);X.on(sub,3.8,.4,13);
 var stepOne=X.splitText(c,'Step one','先迈出',166,ink,135,405,1180,6.35,9.75),stepTwo=X.splitText(c,'Step two','那一步。',166,ink,135,635,1300,6.53,9.75);
 var stepSub=X.tx(c,'Step subtitle','MAKE THE FIRST MOVE',20,ink,145,860,'HelveticaNeue-Medium',6.9,9.7,true);X.on(stepSub,6.9,.4,10);
 // Native repeaters create a moving motif field, revealed through large editable type.
 var field=U.comp('SHIFT / Repeated mother shape',2680,1900,D,false);var stripe=M.path(field,'Repeat slash',[[0,0],[120,0],[-20,360],[-140,360]],blue,null,0,[-160,-160],true,0,D);
 N.repeater(stripe,2,[150,0],0);N.repeater(stripe,7,[480,0],0);N.repeater(stripe,6,[0,440],0);
 var climaxBG=X.rect(c,'Climax paper',1920,1080,cream,960,540,0,9.65,12.9);X.grain(climaxBG,.055);
 var word=X.tx(c,'Climax base word','发生',400,ink,960,530,'HiraginoSansGB-W6',9.65,12.9);X.scale(word,[9.65,10.25,12.2,12.9],[87,100,100,113]);
 var pattern=U.add(c,field,'Motion within type',960,540,1.0,9.65,12.9);X.move(pattern,[9.65,12.9],[[800,530],[1180,530]]);
 var mask=X.tx(c,'Climax type matte','发生',400,cream,960,530,'HiraginoSansGB-W6',9.65,12.9);X.scale(mask,[9.65,10.25,12.2,12.9],[87,100,100,113]);pattern.setTrackMatte(mask,TrackMatteType.ALPHA);
 var turn=X.tx(c,'Climax intent','MAKE IT HAPPEN',25,ink,960,836,'HelveticaNeue-Bold',10.1,12.85);X.on(turn,10.1,.4,12);
 // A second expansion of the same slash resolves into the brand lockup.
 var closingBlue=X.rect(c,'Closing blue field',1920,1080,blue,960,540,0,13.0,D);closingBlue.moveAfter(barA);X.grain(closingBlue,.06);
 var transition=M.path(c,'Closing transition from mother shape',[[0,-300],[145,-300],[-10,300],[-155,300]],blue,null,0,[1395,540],true,12.25,13.2);
 M.pos(transition).expression="thisComp.layer('Mother shape A').transform.position";M.scale(transition).expression="thisComp.layer('Mother shape A').transform.scale";
 var close=X.tx(c,'SHIFT wordmark','SHIFT',265,cream,1125,495,'HelveticaNeue-Bold',13.35,D);X.on(close,13.35,.65,38);
 var motto=X.tx(c,'Brand promise','让想法，向前一步。',58,cream,960,744,'HiraginoSansGB-W6',14.1,D);X.on(motto,14.1,.65,26);
 var fine=X.tx(c,'Brand field','CREATE  /  MOVE  /  MAKE',19,cream,960,937,'HelveticaNeue-Medium',14.45,D);X.on(fine,14.45,.5,12);
 X.tx(c,'Concept scope','原创品牌概念 / 动态宣言',14,r('82909C'),960,1044,'HiraginoSansGB-W3',0,D);
 c.openInViewer();$.writeln('SHIFT created: two-slash mother shape, sliced type, native repeaters and alpha matte.');
})();
