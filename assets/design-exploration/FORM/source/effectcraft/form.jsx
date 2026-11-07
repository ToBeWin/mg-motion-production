(function(){
var M=MuseNative,ink=M.rgb('214E4B'),teal=M.rgb('247A73'),copper=M.rgb('DFAF85'),mint=M.rgb('AFD7C6'),paper=M.rgb('F2EFE7');
var C=M.comp('FORM / Picture',1920,1080,18,30);C.motionBlur=true;C.shutterAngle=150;
function txt(name,str,size,x,y,a,b,font){return M.text(C,name,str,size,ink,[x,y],font||'HelveticaNeue-Medium',a,b);}
function alpha(l,a,b,v){M.key(M.opacity(l),[a,b],v||[0,100]);}
var bg=null;for(var i=1;i<=app.project.numItems;i++)if(app.project.item(i).name==='FORM-studio')bg=app.project.item(i);
if(!bg)throw new Error('Layered PhotoCraft composition missing');bg.duration=18;bg.frameRate=30;
for(var j=1;j<=bg.numLayers;j++){bg.layer(j).inPoint=0;bg.layer(j).outPoint=18;}
var base=M.setup(C.layers.add(bg),'PhotoCraft / three editable layers',[960,540],0,18);
var small=txt('Opening register','01 / LINE',24,166,91,0,5.55);alpha(small,0,.5);
var foot=txt('Opening footer','A STUDY IN LIGHT & MOTION',20,321,985,0,5.55);alpha(foot,.15,.7);
var orbit=M.group(C,'Contour choreography',0,5.55);M.pos(orbit).setValue([570,530]);
var contours=[];
for(var k=0;k<CONTOURS.length;k++){
 var d=CONTOURS[k],l=M.path(C,'VectorCraft / '+d.name,d.vertices,null,M.rgb(d.stroke),d.strokeWidth,[0,0],d.closed,0,5.55),s=new Shape();
 s.vertices=d.vertices;s.inTangents=d.inTangents;s.outTangents=d.outTangents;s.closed=d.closed;N.pathProp(l).setValue(s);M.anchor(l).setValue([500,350]);l.parent=orbit;M.pos(l).setValue([0,0]);
 if(k<3){N.trim(l,.3+k*.21,1.65+k*.25);M.key(M.rotation(l),[.3,2.3,4.8],[55+k*23,0,-18-k*7]);}
 else alpha(l,1.8,2.4);
 contours.push(l);
}
M.key(M.scale(orbit),[0,1.7,3.6,5.45],[[68,68],[100,100],[100,100],[278,278]]);
M.key(M.pos(orbit),[0,1.7,3.6,5.45],[[570,530],[570,530],[570,530],[960,540]]);
var title=txt('Title / FORM','FORM',180,1385,455,.55,4.65);N.reveal(title,.55,1.25,65);M.key(M.pos(title),[3.55,4.6],[[1385,455],[2050,455]]);
var zh=txt('Title / 形的发生','形的发生',64,1345,625,1.2,4.65,'HiraginoSansGB-W6');N.reveal(zh,1.2,1.85,36);alpha(zh,3.8,4.55,[100,0]);
var descriptor=txt('Subline / purpose','SHAPE WHAT COMES NEXT',19,1345,713,1.65,4.6);alpha(descriptor,1.65,2.2);alpha(descriptor,3.85,4.6,[100,0]);
// A shared aperture carries the line into the optical space.
var source=app.project.importFile(new ImportOptions(new File(ROOT+'/assets/'+PLATE)));
var plate=M.setup(C.layers.add(source),'Blender Cycles / physical ribbon sculpture',[960,540],5.1,11.1);plate.startTime=5.1;plate.inPoint=5.1;plate.outPoint=11.1;M.scale(plate).setValue([1920/source.width*100,1080/source.height*100]);
var aperture=M.ellipseMask(plate,source.width/2,source.height/2,source.height*.46);var mp=aperture.property('ADBE Mask Shape');
function circlePath(r){var s=new Shape(),k=r*.55228475,x=source.width/2,y=source.height/2;s.vertices=[[x+r,y],[x,y+r],[x-r,y],[x,y-r]];s.inTangents=[[0,-k],[k,0],[0,k],[-k,0]];s.outTangents=[[0,k],[-k,0],[0,-k],[k,0]];s.closed=true;return s;}
mp.setValueAtTime(5.1,circlePath(50));mp.setValueAtTime(5.55,circlePath(source.width*1.2));
var reg=txt('Optical register','02 / LIGHT',24,174,91,5.5,10.9);alpha(reg,5.5,6.05);alpha(reg,10.5,10.9,[100,0]);
var opticalTag=txt('Optical label','PORCELAIN  /  COPPER  /  GLASS',18,1475,90,6.1,10.7);alpha(opticalTag,6.1,6.6);alpha(opticalTag,10.2,10.7,[100,0]);
// Sweeping blades pick up the sculpture's tangent and resolve to type.
for(var n=0;n<12;n++){
 var x=-200+n*216,l=M.rect(C,'Material shutter '+n,[228,1800],n%3===0?copper:(n%3===1?paper:mint),[x,-1100],0,10.62,12.3);
 M.rotation(l).setValue(-18);M.key(M.pos(l),[10.62+n*.012,10.94+n*.012,11.55+n*.012,12.1+n*.012],[[x,-1100],[x,540],[x,540],[x,2200]]);
}
var closeReg=txt('Closing register','03 / POSSIBILITY',24,232,91,11.1,18);
var closeFoot=txt('Closing footer','FORM  —  A MOTION EXPERIMENT',19,351,985,11.1,18);
// Add later layers below the shutters to keep the transition physically continuous.
var endGroup=M.group(C,'Closing type choreography',11.1,18);endGroup.moveAfter(plate);
var word='FORM',xs=[455,785,1120,1485];
for(var n=0;n<4;n++){
 var letter=txt('Kinetic glyph '+word[n],word[n],390,xs[n],477,11.1,18,'HelveticaNeue-Bold');letter.moveAfter(plate);
 M.key(M.pos(letter),[11.5+n*.14,12.35+n*.14,14.75,15.5],[[xs[n],780],[xs[n],477],[xs[n],477],[xs[n],438]]);
 M.key(M.scale(letter),[11.5+n*.14,12.35+n*.14],[[100,50],[100,100]]);
}
var finalLine=txt('Closing thought','让想象成形。',65,960,750,12.6,18,'HiraginoSansGB-W6');finalLine.moveAfter(plate);N.reveal(finalLine,12.6,13.35,46);
var endRing=M.shape(C,'Form / continuity token','ellipse',[50,50],null,[1665,785],0,teal,7,13.35,18);endRing.moveAfter(plate);N.trim(endRing,13.35,14.2);M.key(M.rotation(endRing),[13.35,17.4],[0,130]);
// Retain type and native vector editability; no whole-frame screenshot layer.
app.project.activeItem=C;
writeLn('FORM: '+C.numLayers+' native layers; '+M.count.keyedProperties+' animated properties.');
})();
