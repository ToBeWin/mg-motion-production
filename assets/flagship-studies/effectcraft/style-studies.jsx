(function(){
 var M=MuseNative,r=M.rgb,ink=r('243340'),blue=r('475CE8'),cream=r('F5F1E7'),muted=r('79848D');
 function find(n){for(var i=1;i<=app.project.numItems;i++){var p=app.project.item(i);if(p.name===n)return p;}throw new Error('Missing comp '+n);}
 function label(c,domain,name){F.txt(c,'Route label',domain,19,muted,87,72,0,8,true,'HelveticaNeue-Medium');F.txt(c,'Style title',name,28,ink,87,122,0,8,true);}
 var ed=U.comp('Style / Software editorial',1920,1080,8),edLayer=ed.layers.add(find('TRACE / Editorial reference'));edLayer.startTime=-10.5;M.pos(edLayer).setValue([960,540]);edLayer.outPoint=8;
 // A work surface with two source planes and a front-facing answer space.
 var sc=U.comp('Style / Software spatial',1920,1080,8);M.gradient(sc,'Porcelain workspace light',[1920,1080],[1100,400],[2160,1150],0,8,r('FDFDFC'),r('E0E5EF'),true);
 var contact=M.shape(sc,'Broad contact under the work surface','ellipse',[1320,82],r('667590'),[1090,887],0,null,0,0,8);N.fx(contact,'Gaussian Blur',{'Blurriness':70});M.opacity(contact).setValue(9);
 var sceneSources=['TRACE / Source page 0','TRACE / Source page 1','TRACE / Product workspace'];
 var poses=[[380,405,260],[380,740,400],[1295,535,140]];
 for(var si=0;si<3;si++){
  var sl=U.add(sc,find(sceneSources[si]),'Spatial document '+si,poses[si][0],poses[si][1],si===2?.73:.61,0,8);sl.threeDLayer=true;if(si===2)sl.startTime=-14;sl.inPoint=0;sl.outPoint=8;N.fx(sl,'Drop Shadow',{'Shadow Color':r('67738B'),'Opacity':si===2?22:14,'Distance':si===2?16:10,'Softness':si===2?62:42,'Direction':135});U.key(M.pos(sl),[0,1.4,6.5,8],[[poses[si][0],poses[si][1]+140,poses[si][2]],[poses[si][0],poses[si][1],poses[si][2]],[poses[si][0],poses[si][1],0],[poses[si][0],poses[si][1],0]],'travel');U.key(sl.property('ADBE Transform Group').property('ADBE Rotate Y'),[0,1.5,6.5,8],[-11+si*5,-7+si*4,0,0],'travel');
 }
 var ca=N.camera(sc,'Workspace camera');U.key(M.pos(ca),[0,1.4,6.5,8],[[1010,540,-2700],[990,540,-2520],[960,540,-2520],[960,540,-2520]],'travel');label(sc,'SOFTWARE / SPATIAL','让资料与答案，在同一空间相遇。');
 // Restrained brand route: typography, a single line, and one punctuation mark.
 var editorialInk=r('3E4B48'),editorialAccent=r('B7755F');
 var be=U.comp('Style / Brand editorial',1920,1080,8);F.base(be,r('F3EFE6'));F.txt(be,'Signature','SHIFT',24,editorialInk,110,100,0,8,true,'HelveticaNeue-Medium');F.txt(be,'Edition','A THOUGHT, IN MOTION',18,r('8C8C80'),1360,100,0,8,true,'HelveticaNeue-Medium');
 var one=F.txt(be,'Make','Make',210,editorialInk,220,398,0,8,true,'Georgia');var two=F.txt(be,'Meaning','meaning.',210,editorialInk,220,649,0,8,true,'Georgia');X.on(one,.15,.9,70);X.on(two,.65,1.1,75);
 var dot=U.circle(be,'Moving punctuation',72,editorialAccent,1600,450,0,8);X.move(dot,[0,2,4.5,6,8],[[1600,320],[1600,450],[1600,450],[1580,660],[1580,660]]);X.draw(be,'Editorial rule',[[220,838],[1670,838]],r('B9B5A8'),1,.9,2.3,8);F.txt(be,'Brand invitation','从一个想法开始。',31,editorialInk,225,904,2,8,true);
 // Fluid route uses authored Bezier ribbons; no stock liquid/particle footage.
 var bf=U.comp('Style / Brand fluid',1920,1080,8);M.gradient(bf,'Pearl porcelain field',[1920,1080],[960,470],[2030,1120],0,8,r('FDFCF9'),r('E6ECF6'),true);
 // Two related ribbons frame a clear wordmark, with their shading in native mattes.
 for(var wi=0;wi<2;wi++){
  var ribbon=U.comp('Style / Satin ribbon '+wi,1920,1080,8,false);
  var paint=M.gradient(ribbon,'Satin color roll',[1920,1080],[180,260],[1580,790],0,8,r(wi?'D9E2F3':'AEBEE3'),r(wi?'8FA6D3':'506CB5'),false);
  var l=M.path(ribbon,'Continuous ribbon silhouette '+wi,[[-400,0],[400,0],[1200,0],[2300,0]],null,r('FFFFFF'),wi?64:102,[0,0],false,0,8);var shapes=[];
  for(var t=0;t<3;t++){var sh=new Shape();var bend=t===1?85:0;sh.vertices=wi?[[-300,700],[490,790-bend],[1390,794-bend],[2220,360]]:[[-300,680],[460,260+bend],[1340,224+bend],[2220,650]];sh.inTangents=[[-300,0],[-360,0],[-360,0],[-300,0]];sh.outTangents=[[300,0],[360,0],[360,0],[300,0]];sh.closed=false;shapes.push(sh);}U.key(N.pathProp(l),[0,4,8],shapes,'quiet');paint.setTrackMatte(l,TrackMatteType.ALPHA);
  var silk=U.add(bf,ribbon,'Floating satin form '+wi,960,540,1,0,8);N.fx(silk,'Drop Shadow',{'Shadow Color':r('7485A7'),'Opacity':10,'Distance':12,'Softness':42,'Direction':135});
 }
 var bm=F.txt(bf,'Fluid wordmark','SHIFT',230,r('3C527D'),960,518,.5,8,false,'HelveticaNeue-Medium');X.on(bm,.5,1.1,45);F.txt(bf,'Fluid statement','让创造，自然流动。',37,r('596D92'),960,901,1.3,8,false,'HiraginoSansGB-W3');F.txt(bf,'Fluid label','BRAND / CONTINUOUS FORM',18,r('7988A2'),90,80,0,8,true,'HelveticaNeue-Medium');
 var ho=U.comp('Style / Hardware optical',1920,1080,8);var gl=M.footage(ho,'Original FORM optical plate',MEDIA.form,1920,[960,540],0,8);gl.startTime=-4;gl.inPoint=0;gl.outPoint=8;F.txt(ho,'FORM identity','FORM',108,ink,110,349,.4,8,true,'HelveticaNeue-Medium');F.title(ho,'Optical claim','光，成为触感。',53,blue,111,506,.9,8);F.txt(ho,'Optical small','HARDWARE / OPTICAL',18,muted,110,80,0,8,true,'HelveticaNeue-Medium');
 var he=U.comp('Style / Hardware engineering',1920,1080,8);M.gradient(he,'Ivory studio cyclorama',[1920,1080],[1050,500],[2090,1220],0,8,r('FCFBF7'),r('E4E9ED'),true);var st=M.footage(he,'Relit ORBIT assembly and contact shadow',MEDIA.structure,1920,[960,540],0,8);st.startTime=0;st.inPoint=0;st.outPoint=8;
 var metalInk=r('40566A'),metalAccent=r('5B7699');
 F.txt(he,'ORBIT engineering title','ORBIT',66,metalInk,106,190,.25,8,true,'HelveticaNeue-Medium');F.txt(he,'Engineering claim','每一层，都有作用。',34,metalAccent,110,281,.6,8,true);F.txt(he,'Engineering role','HARDWARE / ENGINEERING',18,r('7D8E9B'),110,80,0,8,true,'HelveticaNeue-Medium');
 var names=['金属旋盖','编码器','电路层','陶瓷底座'];for(var ii=0;ii<4;ii++){F.txt(he,'Part number '+ii,'0'+(ii+1),22,metalAccent,1450,272+ii*160,1.1+ii*.12,7.5,true,'Menlo-Regular');F.txt(he,'Part name '+ii,names[ii],24,metalInk,1520,272+ii*160,1.1+ii*.12,7.5,true);}
 $.writeln('Six authored style studies created.');
})();
