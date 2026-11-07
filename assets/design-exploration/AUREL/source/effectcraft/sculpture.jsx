(function(){
var M=MuseNative,C={},k;for(k in D.colors)C[k]=M.rgb(D.colors[k]);
var c=M.comp('AUREL v2 / Picture',1920,1080,16,30),F='AurelGrotesk-Black',H='FOLDHan-Bold';c.shutterAngle=90;
function text(n,str,size,color,x,y,a,b,font){return M.text(c,n,str,size,C[color],[x,y],font||F,a,b);}
function enter(l,a,b,shift){var p=M.pos(l).value;M.key(M.pos(l),[a,a+.55],[[p[0],p[1]+shift],p],{influence:64});M.key(M.opacity(l),[a,a+.25,b-.25,b],[0,100,100,0]);}
function plate(shot,a,b){var f=app.project.importFile(new ImportOptions(new File(PLATES[shot]))),l=M.setup(c.layers.add(f),'Cycles / '+shot,[960,540],a,b);l.startTime=a;l.inPoint=a;l.outPoint=b;M.scale(l).setValue([1920/f.width*100,1080/f.height*100]);l.motionBlur=false;return l;}
M.rect(c,'Chalk ivory / continuous environment',[1920,1080],C.paper,[960,540],0,0,16);
var p=plate('unfold',0,4.8);M.key(M.opacity(p),[4.52,4.8],[100,0]);
var hero=plate('hero',10.8,16);M.key(M.opacity(hero),[10.8,11.12],[0,100]);
var intro=text('Opening / SHIFT','SHIFT',102,'ink',284,437,.4,2.7);enter(intro,.4,2.7,32);
intro=text('Opening / YOUR VIEW','YOUR VIEW.',61,'ink',291,550,.65,2.7);enter(intro,.65,2.7,28);
var starts=PROJECTED.unfold.end,ends=PROJECTED.hero.start;
var bands=[
 [[-100,455],[1810,455],[1730,170],[-100,170]],
 [[100,790],[2020,790],[2020,505],[180,505]],
 [[120,902],[1650,902],[1750,858],[180,858]],
 [[1690,970],[1800,970],[1800,835],[1690,835]]
];
var frames=[
 [[100,960],[250,960],[460,180],[310,180]],
 [[1440,960],[1590,960],[1820,180],[1670,180]],
 [[350,916],[1360,916],[1410,862],[400,862]],
 [[1030,242],[1600,242],[1625,190],[1055,190]]
];
var times=[4.55,4.95,5.65,6.95,8.1,9.1,10.7,11.14];
function states(i){return [starts[i],starts[i],bands[i],bands[i],frames[i],frames[i],ends[i],ends[i]];}
function shapeKeys(prop,i){var ss=states(i),v=[];for(var j=0;j<ss.length;j++)v.push(N.shape(ss[j],true));M.key(prop,times,v,{influence:65});}
for(var i=0;i<4;i++){
 var l=M.path(c,'Morph / '+D.parts[i].name,starts[i],C[i===3?'accent':'blue'],null,0,[0,0],true,4.55,11.14);
 shapeKeys(N.pathProp(l),i);M.key(M.opacity(l),[4.55,4.8,10.8,11.14],[0,100,100,0]);
}
// Full-resolution text is clipped by exactly the same animated polygon as its carrier.
for(i=0;i<2;i++){
 var wc=M.comp('AUREL v2 / '+(i===0?'MAKE':'SPACE'),1920,1080,16,30);
 M.text(wc,'Editable bold type',i===0?'MAKE':'SPACE.',260,C.paper,[i===0?910:1090,i===0?315:650],F,0,16);
 var wl=M.setup(c.layers.add(wc),'Type inside moving geometry / '+i,[960,540],5.25,7.8);
 var mask=wl.property('ADBE Mask Parade').addProperty('ADBE Mask Atom');shapeKeys(mask.property('ADBE Mask Shape'),i);
 M.key(M.opacity(wl),[5.25,5.6,7.0,7.7],[0,100,100,0]);
}
var more=text('Negative space / Chinese','更多可能。',126,'ink',960,450,7.65,9.45,H);enter(more,7.65,9.45,35);
more=text('Negative space / English','MORE TO CREATE.',39,'ink',960,626,7.9,9.45);enter(more,7.9,9.45,18);
// Final composition follows the designed crop; each line has its own breathing room.
var t=text('Closing / SHIFT','SHIFT',112,'ink',301,700,12.1,16);enter(t,12.1,16,30);
t=text('Closing / YOUR VIEW','YOUR VIEW.',75,'ink',336,814,12.35,16);enter(t,12.35,16,25);
t=text('Closing / Chinese thought','让想象，有形。',34,'ink',290,930,14.4,16,H);enter(t,14.4,16,12);
for(var j=1;j<=c.numLayers;j++){var q=c.layer(j);if(q.name.indexOf('Closing /')===0){var op=M.opacity(q);if(op.numKeys>=4){op.removeKey(op.numKeys);op.removeKey(op.numKeys);}}}
text('Identity / AUREL','AUREL',58,'ink',233,103,0,16);
N.line(c,'Identity / rule',[[400,103],[620,103]],C.ink,1.3,0,16);
N.line(c,'Identity / registration',[[662,91],[662,115],[662,103],[650,103],[674,103]],C.ink,1.3,0,16);
text('Identity / 映序','映序',25,'ink',1732,104,0,16,H);
})();
