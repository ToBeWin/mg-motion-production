(function(){
 var M=MuseNative,r=M.rgb,D=20,c=U.comp(PLAN.cases.shift.composition,1920,1080,D),blue=r('3554CB'),cream=r('F4F0E6'),ink=r('29354A'),mint=r('E5EAC0'),pale=r('E1E7F0');
 F.base(c,cream);
 F.txt(c,'Brand at start','SHIFT',27,blue,94,88,0,2.55,true,'HelveticaNeue-Bold');
 F.txt(c,'Manifesto label','MAKE YOUR NEXT MOVE',18,ink,1380,90,0,2.55,true,'HelveticaNeue-Medium');
 // The mother shape is a cutter. It reveals the verb, then moves the whole stage.
 var open=U.comp('SHIFT / Opening typography',1920,1080,D,true);
 U.text(open,'Idea first line','让想法',184,ink,124,389,'HiraginoSansGB-W6');U.text(open,'Idea second line','向前一步。',184,ink,124,643,'HiraginoSansGB-W6');
 var o=U.add(c,open,'Opening phrase',960,540,1,0,2.65);
 var om=X.rect(c,'Opening aperture',1800,1080,cream,-860,540,0,0,2.65);X.move(om,[0,.82],[[-860,540],[960,540]]);o.setTrackMatte(om,TrackMatteType.ALPHA);
 var slash=F.slash(c,'Primary slash',1610,540,175,650,blue,0,3.12);X.move(slash,[0,.8,2.5,3.1],[[2070,540],[1610,540],[1610,540],[-600,540]]);X.scale(slash,[0,.8,2.5,3.1],[80,100,100,[900,300]]);
 var sl2=F.slash(c,'Echo slash',1810,540,175,650,blue,0,3.12);X.move(sl2,[.1,.9,2.5,3.1],[[2270,540],[1810,540],[1810,540],[-400,540]]);
 F.txt(c,'Opening small','一个动作，新的可能。',28,ink,129,880,.9,2.45,true);
 // Full-bleed blue is a deliberate beat, with one giant legible word.
 var openingCut=M.path(c,'The slash carries the next field',[[-2000,-2000],[2000,-2000],[1200,2000],[-2800,2000]],blue,null,0,[4400,540],true,2.35,2.96);X.move(openingCut,[2.35,2.95],[[4400,540],[960,540]]);
 X.rect(c,'Forward cobalt',1920,1080,blue,960,540,0,2.95,6.1);
 var word=U.comp('SHIFT / Forward type',1920,1080,D,true);U.text(word,'Forward word','向前',430,cream,960,540,'HiraginoSansGB-W6',0,D,true);
 for(var i=0;i<4;i++){
  var band=U.add(c,word,'Forward type band '+i,960,540,1,2.65,5.55);M.mask(band,0,(248+i*146)*2,3840,(248+(i+1)*146)*2);
  X.move(band,[2.65+i*.045,3.32+i*.035,4.78,5.55],[[960+(i%2?420:-420),540],[960,540],[960,540],[960+(i%2?-1000:1000),540]]);
 }
 // Narration captions carry this sentence; avoid a second subtitle-like line.
 // An optical slit reveals a type tunnel. Native 3D planes and a real camera
 // create parallax; the letters are still editable text, not a prerendered video.
 X.rect(c,'Build pale stage',1920,1080,pale,960,540,0,8.0,11.1);
 var tunnel=U.comp('SHIFT / Type corridor',1920,1080,D,false);U.rect(tunnel,'Mint space',1920,1080,mint,960,540,0);
 for(var j=9;j>=0;j--){
  var w=U.text(tunnel,'Spatial NEXT '+j,'NEXT',700,j%2?blue:ink,960,540,'HelveticaNeue-CondensedBold',0,D,true);w.threeDLayer=true;M.pos(w).setValue([960+j*36,540,j*520]);
  if(j>0){var tp=w.property('ADBE Text Properties').property('ADBE Text Document'),td=tp.value;td.applyFill=false;td.applyStroke=true;td.strokeWidth=4;td.strokeColor=j%2?blue:ink;tp.setValue(td);}
  U.key(w.property('ADBE Transform Group').property('ADBE Rotate Z'),[5.5,8.5],[j*.8,j*.8-3],'quiet');
 }
 var cam=N.camera(tunnel,'Type corridor camera');U.key(M.pos(cam),[5.5,7.9,8.5],[[960,540,-2700],[960,540,-1700],[960,540,-1500]],'travel');
 var tun=U.add(c,tunnel,'Moving through the next step',960,540,1,5.5,8.5);X.scale(tun,[5.5,8.0,8.5],[100,100,[3,100]]);var aperture=X.rect(c,'Slit matte',80,1300,cream,960,540,0,5.5,8.5);U.key(M.shapeSize(aperture,'rect'),[5.5,6.05],[[80,1300],[2200,1300]],'travel');tun.setTrackMatte(aperture,TrackMatteType.ALPHA);
 // Horizontal compression becomes a tall column, then the Chinese word opens.
 var create=F.txt(c,'Create action','创造',360,blue,960,540,8.5,11.1,false);X.scale(create,[8.5,9.05,10.5,11.1],[[12,110],[100,100],[100,100],[180,100]]);
 // Native repeaters make a velocity field. It becomes texture inside the word.
 var field=U.comp('SHIFT / Slash velocity field',2500,1500,D,false);var seed=F.slash(field,'Pattern seed',-160,0,55,320,blue,0,D);N.repeater(seed,16,[180,0],0);N.repeater(seed,7,[0,290],0);
 X.rect(c,'Happen cream stage',1920,1080,cream,960,540,0,11,14.65);
 var large=F.txt(c,'Happen solid','发生',410,ink,960,525,11,14.65,false);X.scale(large,[11,11.5,13.9,14.65],[72,100,100,170]);
 var pattern=U.add(c,field,'Moving pattern in type',960,540,1,11,14.65);X.move(pattern,[11,14.65],[[350,250],[1420,540]]);
 var typeMask=F.txt(c,'Happen editable matte','发生',410,cream,960,525,11,14.65,false);X.scale(typeMask,[11,11.5,13.9,14.65],[72,100,100,170]);pattern.setTrackMatte(typeMask,TrackMatteType.ALPHA);
 F.txt(c,'Happen invitation','MAKE IT HAPPEN',28,blue,960,900,11.7,14.35,false,'HelveticaNeue-Bold');
 // The slashes cut back into the wordmark instead of a generic fade to logo.
 var closeCut=M.path(c,'Final slash carries the brand',[[-2000,-2000],[2000,-2000],[1200,2000],[-2800,2000]],blue,null,0,[4400,540],true,14.15,14.85);X.move(closeCut,[14.15,14.85],[[4400,540],[960,540]]);
 var end=X.rect(c,'Closing cobalt',1920,1080,blue,960,540,0,14.85,D);
 var cA=F.slash(c,'Closing slash A',645,540,95,435,cream,14.15,D),cB=F.slash(c,'Closing slash B',845,540,95,435,cream,14.25,D);
 X.move(cA,[14.15,14.6,15.3,16.0],[[2100,540],[1180,540],[645,540],[308,484]]);X.move(cB,[14.25,14.7,15.4,16.0],[[2320,540],[1400,540],[845,540],[430,484]]);
 X.scale(cA,[14.15,15.3,16],[180,100,70]);X.scale(cB,[14.25,15.4,16],[180,100,70]);
 var brand=F.txt(c,'Closing SHIFT','SHIFT',285,cream,1155,484,15.3,D,false,'HelveticaNeue-Bold');X.move(brand,[15.3,16.1],[[1900,484],[1155,484]]);
 F.title(c,'Closing promise','让下一步发生。',75,cream,510,772,16.1,D);
 F.txt(c,'Closing subline','A NEW WAY TO CREATE',19,cream,960,934,16.8,D,false,'HelveticaNeue-Medium');

 c.openInViewer();$.writeln('SHIFT v2: aperture, text slicing, native 3D camera, repeaters, alpha type matte.');
})();
