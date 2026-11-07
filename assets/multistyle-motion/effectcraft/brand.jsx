(function(){
 var M=MuseNative,r=V.r,D=18,c=U.comp('SHIFT / Shape the next',1920,1080,D,false),cream=r('F4F0E7'),blue=r('3553BD'),ink=r('273A60'),pale=r('E1E7F3'),orange=r('D8684E');
 F.base(c,cream);
 V.tx(c,'Early signature','SHIFT',28,blue,90,78,0,3.05,true,'HelveticaNeue-Bold');
 V.tx(c,'Early proposition','MAKE YOUR NEXT MOVE',18,blue,1490,79,0,3.05,false,'HelveticaNeue-Medium');
 // Type has mass: the primary mark opens the phrase and carries the stage.
 var idea=V.tx(c,'Idea','想法',330,ink,696,442,0,3.2,false);
 V.pos(idea,[[0,[-680,442]],[.65,[712,442],'out'],[.82,[696,442]],[2.55,[696,442]],[3.2,[-840,442],'in']]);
 var next=V.tx(c,'Next step','向前一步。',108,blue,1030,754,.65,3.15,false);V.pos(next,[[.65,[1030,880]],[1.25,[1030,754],'out'],[2.55,[1030,754]],[3.15,[1920,754],'in']]);
 var mark=[];
 for(var i=0;i<2;i++){var l=F.slash(c,'Persistent slash '+i,1320+i*190,442,80,440,blue,0,D);mark.push(l);V.pos(l,[[0,[2080+i*180,442]],[.75+i*.09,[1320+i*190,442],'out'],[2.6,[1320+i*190,442]],[3.15,[-420+i*190,442]],[3.16,[2120+i*160,490]],[5.85,[2120+i*160,490]],[6.45,[2240+i*160,490]],[13.25,[2240+i*160,490]],[14.05,[365+i*135,450],'out'],[18,[365+i*135,450]]]);V.scale(l,[[0,100],[2.6,100],[3.15,[1900,330]],[3.16,100],[13.25,100],[14.05,64],[18,64]]);}
 // A narrow window opens into an editable typographic depth field.
 var space=U.comp('SHIFT / Open space',1920,1080,D,false);V.rect(space,'Pale space',1920,1080,pale,960,540,0,D);
 for(var j=7;j>=0;j--){var w=V.tx(space,'SPACE echo '+j,'OPEN',690,j===0?blue:r('A3B2DA'),960,485,0,D,false,'HelveticaNeue-CondensedBold');if(j>0)V.outline(w,r('A3B2DA'),2);V.scale(w,[[3.05,34+j*13],[5.8,70+j*17],[6.45,105+j*19]]);V.rot(w,[[3.05,j*.8],[6.45,0]]);}
 var st=V.add(c,space,'Space revealed',960,540,1,3.02,6.95);var aperture=V.rect(c,'Window expands',32,1080,cream,960,540,3.02,6.95);V.key(M.shapeSize(aperture),[[3.02,[32,1080]],[3.65,[2160,1080],'out'],[5.85,[2160,1080]],[6.5,[2160,1080]]]);st.setTrackMatte(aperture,TrackMatteType.ALPHA);
 var spaceCN=V.tx(c,'Space word','打开空间',116,blue,960,819,3.75,6.95,false);V.alpha(spaceCN,[[3.75,0],[4.1,100],[6.3,100],[6.9,0]]);
 // The old field remains until every tile is fully closed (6.875–6.98s).
 // Switch the underlying scene at 6.9s, then uncover it with the same tiles.
 var work=U.comp('SHIFT / Work from modules',1920,1080,D,false);V.rect(work,'Warm work field',1920,1080,cream,960,540,0,D);
 var possibility=V.tx(work,'Possibility','可能',310,ink,960,500,0,8.45,false);V.scale(possibility,[[6.4,94],[7.2,100],[7.8,100],[8.45,140]]);V.alpha(possibility,[[6.4,100],[7.7,100],[8.45,0]]);
 var workLayer=V.add(c,work,'Work field',960,540,1,6.9,11.2);
 var tiles=U.comp('SHIFT / Travelling modules',1920,1080,D,false);
 for(var row=0;row<5;row++)for(var col=0;col<10;col++){
  var a=6.08+(col*.025+row*.055),x=96+col*192,y=108+row*216;
  var t=V.rect(tiles,'Module '+row+' '+col,194,218,(row+col)%4===0?orange:blue,x,y,0,D,0);
  V.scale(t,[[a,[0,100]],[a+.35,[100,100],'out'],[a+.9,[100,100]],[a+1.3,[0,100],'in']]);
 }
 var tw=V.add(c,tiles,'Tile transition',960,540,1,6.08,8.2);
 var works=V.tx(c,'Work becomes visible','作品',350,blue,960,500,8.05,11.25,false);V.scale(works,[[8.05,[88,115]],[8.55,[100,100],'out'],[10.4,[100,100]],[11.25,[140,140],'in']]);
 var pattern=U.comp('SHIFT / Work texture',2400,1400,D,false);for(var k=0;k<17;k++){var sl=F.slash(pattern,'Texture '+k,k*160,650,45,1300,k%3===0?orange:r('4A68C8'),0,D);}
 var pat=V.add(c,pattern,'Texture inside work',960,540,1,8.25,11.25);V.pos(pat,[[8.25,[500,540]],[11.25,[1200,540],'linear']]);
 var typeMatte=V.tx(c,'Editable work matte','作品',350,blue,960,500,8.25,11.25,false);V.scale(typeMatte,[[8.25,[97,103]],[8.55,[100,100]],[10.4,[100,100]],[11.25,[140,140],'in']]);pat.setTrackMatte(typeMatte,TrackMatteType.ALPHA);
 V.tx(c,'Materialized caption','MAKE SOMETHING REAL',24,blue,960,850,8.6,10.8,false,'HelveticaNeue-Medium');
 // The same angular rhythm becomes three moving bands of the closing verb.
 V.rect(c,'Create warm field',1920,1080,cream,960,540,10.9,13.8);
 var create=U.comp('SHIFT / Create type',1920,1080,D,false);V.tx(create,'Create','创造',380,orange,960,520,0,D,false);
 for(var b=0;b<3;b++){var cl=V.add(c,create,'Create band '+b,960,540,1,10.9,13.6);M.mask(cl,0,265+b*170,1920,265+(b+1)*170);V.pos(cl,[[10.9+b*.06,[960+(b%2?-1300:1300),540]],[11.5+b*.04,[960,540],'out'],[12.9,[960,540]],[13.6,[960+(b%2?1400:-1400),540],'in']]);}
 // Mark settles, letters reveal in a deliberate stagger, ending holds still.
 V.rect(c,'Brand return field',1920,1080,cream,960,540,13.6,D);
 var letters='SHIFT',letterX=700;for(var z=0;z<letters.length;z++){var lt=V.tx(c,'Brand letter '+z,letters[z],230,blue,letterX,450,13.6+z*.065,D,true,'HelveticaNeue-Bold');V.pos(lt,[[13.6+z*.065,[letterX,660]],[14.2+z*.045,[letterX,450],'out']]);V.alpha(lt,[[13.6+z*.065,0],[14+z*.045,100]]);letterX+=lt.sourceRectAtTime(14.8,false).width+16;}
 // Move persistent slashes above the final field.
 mark[0].moveToBeginning();mark[1].moveToBeginning();
 var promise=V.tx(c,'Final promise','让下一步发生。',70,ink,960,737,14.4,D,false);V.pos(promise,[[14.4,[960,777]],[14.95,[960,737],'out']]);V.alpha(promise,[[14.4,0],[14.95,100]]);
 V.tx(c,'Brand footer','THINK. SHAPE. CREATE.',18,blue,960,900,15.1,D,false,'HelveticaNeue-Medium');
 c.openInViewer();
})();
