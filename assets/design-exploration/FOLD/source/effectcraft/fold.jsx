/* FOLD: original design-to-output choreography. All artwork and UI remain native. */
(function(){
var M=MuseNative, dur=32, ink=M.rgb(D.colors.ink), paper=M.rgb(D.colors.paper);
var C=M.comp('FOLD / Picture',1920,1080,dur,30);C.shutterAngle=135;
var folder=app.project.items.addFolder('FOLD / Editable design system');
function col(k){return k?M.rgb(D.colors[k]||k):null;}
function alpha(l,a,b,v){return M.key(M.opacity(l),[a,b],v||[0,100]);}
function txt(c,name,str,size,x,y,a,b,font,align,color){
 var l=M.text(c,name,str,size,col(color||'ink'),[x,y],font||D.fonts.han700,a,b);
 var r=l.sourceRectAtTime(0,false);if(align==='left')M.anchor(l).setValue([r.left,r.top+r.height/2]);if(align==='right')M.anchor(l).setValue([r.left+r.width,r.top+r.height/2]);return l;
}
function pathShape(e,st){var s=new Shape();s.vertices=[];s.inTangents=[];s.outTangents=[];s.closed=e.closed;st=st||{x:0,y:0,s:1};for(var i=0;i<e.vertices.length;i++){s.vertices.push([st.x+e.vertices[i][0]*st.s,st.y+e.vertices[i][1]*st.s]);s.inTangents.push([e.inTangents[i][0]*st.s,e.inTangents[i][1]*st.s]);s.outTangents.push([e.outTangents[i][0]*st.s,e.outTangents[i][1]*st.s]);}return s;}
function draw(c,e,a,b){
 var l;if(e.type==='text')l=txt(c,e.name,e.text,e.size,e.x,e.y,a,b,D.fonts[e.font+(e.weight===400?'':e.weight)]||D.fonts[e.font],e.align,e.color);
 else if(e.type==='path'){l=M.path(c,e.name,e.vertices,col(e.color),col(e.stroke),e.sw||0,[0,0],e.closed,a,b);N.pathProp(l).setValue(pathShape(e));}
 else l=M.shape(c,e.name,e.type==='ellipse'?'ellipse':'rect',[e.w,e.h],col(e.color),[e.x,e.y],e.r||0,null,0,a,b);return l;
}
function designComp(name,spec){var c=M.comp(name,spec.w,spec.h,dur,30,folder);for(var i=0;i<spec.elements.length;i++)draw(c,spec.elements[i],0,dur);return c;}
function place(c,src,name,x,y,s,a,b){var l=M.setup(c.layers.add(src),name,[x,y],a,b);M.anchor(l).setValue([0,0]);M.scale(l).setValue([s,s]);return l;}
function rectMask(l,st,w,h){return N.shape([[st.x,st.y],[st.x+w*st.s,st.y],[st.x+w*st.s,st.y+h*st.s],[st.x,st.y+h*st.s]],true);}
var bg=null;for(var i=1;i<=app.project.numItems;i++)if(app.project.item(i).name==='FOLD-space')bg=app.project.item(i);
if(!bg)throw new Error('Layered PhotoCraft background missing');bg.duration=dur;bg.frameRate=30;for(var i=1;i<=bg.numLayers;i++){bg.layer(i).inPoint=0;bg.layer(i).outPoint=dur;}
M.setup(C.layers.add(bg),'PhotoCraft / paper, reflected light, microtexture',[960,540],0,dur);
var prompt=designComp('FOLD / Component / Creative brief',D.components.prompt),colors=designComp('FOLD / Component / Theme ribbon',D.components.colors),tools=designComp('FOLD / Component / Tools',D.components.tools),inspect=designComp('FOLD / Component / Inspector',D.components.inspector);
for(var i=1;i<=inspect.numLayers;i++){var il=inspect.layer(i);if(il.name==='Inspector citrus')N.fill(il).setValue(col('lilac'));if(il.name==='Inspector orange')N.fill(il).setValue(col('ink'));if(il.name==='Inspector gold')N.fill(il).setValue(col('surface'));}
var poster=designComp('FOLD / Artwork / Portrait',D.artworks.portrait),ticket=designComp('FOLD / Artwork / Ticket',D.artworks.ticket);
// Opening: deliberately large typography gives way to an editable input.
var opentag=txt(C,'Opening register','FOLD / A CANVAS FOR WHAT’S NEXT',20,124,99,0,4.9,D.fonts.display600,'left','muted');alpha(opentag,0,.45);
var t1=txt(C,'Opening / 好设计','好设计，',112,960,270,.2,4.85);N.reveal(t1,.2,.85,76);
var t2=txt(C,'Opening / 一个想法','从一个想法开始。',96,960,412,.65,4.85);N.reveal(t2,.65,1.35,70);
M.key(M.pos(t1),[3.75,4.65],[[960,270],[960,60]]);alpha(t1,3.75,4.65,[100,0]);
M.key(M.pos(t2),[3.9,4.8],[[960,412],[960,160]]);alpha(t2,3.9,4.8,[100,0]);alpha(opentag,4.1,4.7,[100,0]);
var pr=place(C,prompt,'One brief / persistent input',400,614,100,1.5,4.6);N.shadow(pr,12,18,44);alpha(pr,1.5,2.0);M.key(M.pos(pr),[1.5,2.2,3.8,4.5],[[400,704],[400,614],[400,614],[400,456]]);
// The input surface expands into the same product canvas.
var U=M.comp('FOLD / Workspace anatomy',1920,1080,dur,30,folder);
var shell=M.rect(U,'Workspace shell',[1120,168],col('surface'),[960,540],28,4.35,11.25);N.shadow(shell,14,24,55);M.key(M.shapeSize(shell),[4.35,5.35],[[1120,168],[1680,900]]);M.key(M.pos(shell),[4.35,5.35],[[960,540],[960,520]]);
var inside=M.rect(U,'Canvas surface',[1300,810],paper,[870,565],0,5.0,11.25);alpha(inside,5.0,5.4);
var line=M.rect(U,'Header rule',[1680,1],col('line'),[960,160],0,5.0,11.25);alpha(line,5,5.4);
var rail=place(U,tools,'Original tool component',151,220,90,5.15,11.25);alpha(rail,5.15,5.7);
var ins=place(U,inspect,'Design inspector / source component',1552,215,86,5.25,11.25);alpha(ins,5.25,5.85);
var markComp=M.comp('FOLD / Mark',60,64,dur,30,folder);for(var i=0;i<D.logo.length;i++)draw(markComp,D.logo[i],0,dur);
var mark=place(U,markComp,'Folded ribbon mark',153,92,60,5.05,11.25);alpha(mark,5.05,5.6);
var htxt=[['Wordmark','FOLD',28,205,116,D.fonts.display800,'left','ink'],['Project','晴野 / 周末计划',20,370,116,D.fonts.han,'left','muted'],['Design tab','设计',20,916,116,D.fonts.han700,'center','ink'],['Motion tab','动效',20,1018,116,D.fonts.han,'center','muted'],['Output tab','输出',20,1120,116,D.fonts.han,'center','muted'],['Canvas name','画板 01 / 主视觉',16,262,194,D.fonts.han,'left','muted'],['Canvas size','86%    600 × 760',15,1370,928,D.fonts.display,'right','muted']];
var tab=M.rect(U,'Selected design tab',[82,38],col('soft'),[916,116],19,5,11.25);alpha(tab,5,5.5);
var ex=M.rect(U,'Export action',[130,46],col('ink'),[1680,116],23,5,11.25);alpha(ex,5,5.5);
htxt.push(['Export','导出作品',18,1680,116,D.fonts.han700,'center','surface']);
for(var i=0;i<htxt.length;i++){var q=htxt[i],l=txt(U,q[0],q[1],q[2],q[3],q[4],5.05,11.25,q[5],q[6],q[7]);alpha(l,5.05,5.6);}
var ui=M.setup(C.layers.add(U),'Product establishes location',[960,540],4.35,11.25);alpha(ui,10.1,11.25,[100,0]);
// The same art nodes survive generation, theme selection, responsive layout, and output.
var A=M.comp('FOLD / Persistent editable artwork',1920,1080,dur,30,folder);
var times=[6.7,9.7,11.1,15.5,18.3,19.7,21.3,24.55];
var states=[{k:'portrait',x:560,y:212,s:.86},{k:'portrait',x:560,y:212,s:.86},{k:'portrait',x:305,y:130,s:1.06},{k:'portrait',x:305,y:130,s:1.06},{k:'wide',x:300,y:265,s:1.18},{k:'wide',x:300,y:265,s:1.18},{k:'wide',x:800,y:224,s:.78},{k:'wide',x:800,y:224,s:.78}];
function named(kind,name){var es=D.artworks[kind].elements;for(var j=0;j<es.length;j++)if(es[j].name===name)return es[j];return null;}
var base=D.artworks.portrait.elements;
for(var i=0;i<base.length;i++){
 var e=base[i],l=draw(A,e,5.45,24.55),positions=[],scales=[],sizes=[],shapes=[];
 for(var j=0;j<states.length;j++){var st=states[j],ee=named(st.k,e.name)||e;positions.push([st.x+ee.x*st.s,st.y+ee.y*st.s]);scales.push([st.s*(ee.size||1)/(e.size||1)*100,st.s*(ee.size||1)/(e.size||1)*100]);sizes.push([ee.w*st.s,ee.h*st.s]);if(e.type==='path')shapes.push(pathShape(ee,st));}
 if(e.type==='path'){M.key(N.pathProp(l),times,shapes,{influence:64});M.pos(l).setValue([0,0]);}
 else {M.key(M.pos(l),times,positions,{influence:64});if(e.type==='text'){
   M.key(M.scale(l),times,scales,{influence:64});
   var bounds=l.sourceRectAtTime(0,false),anchors=[];
   for(var j=0;j<states.length;j++){var ee=named(states[j].k,e.name)||e,af=ee.align==='right'?1:ee.align==='center'?.5:0;anchors.push([bounds.left+bounds.width*af,bounds.top+bounds.height/2]);}
   M.key(M.anchor(l),times,anchors,{influence:64});
 }else M.key(M.shapeSize(l,e.type==='ellipse'?'ellipse':'rect'),times,sizes,{influence:64});}
 if(e.name==='Canvas'){
   M.key(N.fill(l),[5.45,13.46,14.2],[col('lilac'),col('lilac'),col('citrus')]);alpha(l,5.45,5.95);
 } else if(e.name.indexOf('Petal ')===0){
   var n=e.petal;M.key(N.fill(l),[5.45,13.5+n*.035,14.1+n*.035],[col(n%2?'surface':'ink'),col(n%2?'surface':'ink'),col(e.color)]);
   var start=5.65+n*.055, end=6.55+n*.055;
   var original=pathShape(e,states[0]),small=new Shape();small.vertices=[];small.inTangents=[];small.outTangents=[];small.closed=true;
   var cx=states[0].x+358*states[0].s,cy=states[0].y+446*states[0].s;
   for(var z=0;z<original.vertices.length;z++){small.vertices.push([cx+(original.vertices[z][0]-cx)*.025,cy+(original.vertices[z][1]-cy)*.025]);small.inTangents.push([original.inTangents[z][0]*.025,original.inTangents[z][1]*.025]);small.outTangents.push([original.outTangents[z][0]*.025,original.outTangents[z][1]*.025]);}
   N.pathProp(l).setValueAtTime(start,small);N.pathProp(l).setValueAtTime(end,original);alpha(l,start,start+.2);
 } else {alpha(l,5.75+i*.02,6.3+i*.02);}
 if(e.name==='Bloom aperture')M.key(N.fill(l),[13.45,14.2],[col('lilac'),col('citrus')]);
 if(e.name==='Rule')alpha(l,15.5,16.4,[100,0]);
}
var art=M.setup(C.layers.add(A),'Same artwork / native path and layout morph',[960,540],5.45,24.55);
var mask=M.mask(art,560,212,1076,865.6).property('ADBE Mask Shape'),ms=[];for(var i=0;i<states.length;i++){var st=states[i],spec=D.artworks[st.k];ms.push(rectMask(art,st,spec.w,spec.h));}M.key(mask,times,ms,{influence:64});N.shadow(art,13,16,36);
// Brief keywords move into the artwork before its shapes grow.
var words=['公园','音乐','周末'],wx=[650,960,1270],wc=['lilac','orange','citrus'];
for(var i=0;i<3;i++){
 var B=M.comp('FOLD / Brief token '+words[i],230,88,dur,30,folder);M.rect(B,'Token',[230,88],col(wc[i]),[115,44],44,0,dur);txt(B,'Meaning',words[i],33,115,44,0,dur,D.fonts.han700);
 var l=M.setup(C.layers.add(B),'Brief becomes '+words[i],[wx[i],540],4.15,6.1);M.key(M.pos(l),[4.15+i*.07,4.65+i*.07,5.7+i*.06],[[wx[i],540],[wx[i],500-i*40],[867,596]]);M.key(M.scale(l),[4.15,4.65,5.95],[[25,25],[100,100],[9,9]]);alpha(l,5.55,6.05,[100,0]);
}
// Contextual palette: a causal change reaches the canvas, petals, and seed.
var h1=txt(C,'Theme heading 1','换一种',76,1115,315,10.5,16.4,D.fonts.han700,'left');N.reveal(h1,10.5,11.25,44);
var h2=txt(C,'Theme heading 2','好心情。',76,1115,411,10.75,16.4,D.fonts.han700,'left');N.reveal(h2,10.75,11.5,44);
var h3=txt(C,'Theme microcopy','色彩跟着灵感走。',24,1118,505,11.3,16.4,D.fonts.han,'left','muted');alpha(h3,11.3,11.85);
var pal=place(C,colors,'Contextual theme / original component',1040,568,100,11.5,16.6);N.shadow(pal,12,16,40);alpha(pal,11.5,12.0);M.key(M.pos(pal),[11.5,12,15.6,16.5],[[1040,632],[1040,568],[1040,568],[760,520]]);M.key(M.scale(pal),[15.6,16.5],[[100,100],[15,15]]);alpha(pal,16.0,16.6,[100,0]);
var ring=M.shape(C,'Selected citrus swatch','ellipse',[68,68],null,[1336,622],0,ink,2.5,13.4,16.2);alpha(ring,13.4,13.65);M.key(M.scale(ring),[13.4,13.62,13.82],[[124,124],[94,94],[100,100]]);alpha(ring,15.65,16.1,[100,0]);
for(var q=0;q<3;q++){var z=[h1,h2,h3][q];alpha(z,15.55,16.25,[100,0]);}
var cursorSpec={type:'path',name:'Cursor',vertices:[[0,0],[0,31],[8,23],[16,41],[23,38],[15,20],[30,20]],inTangents:[[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]],outTangents:[[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]],closed:true,color:'ink',stroke:'surface',sw:2};
var cur=draw(C,cursorSpec,12.3,19.4);M.key(M.pos(cur),[12.3,13.25,13.42,13.55,15.7,16.6,18.3,19.25],[[1510,790],[1336,622],[1336,622],[1336,622],[1336,622],[941,533],[1622,619],[1750,820]]);M.key(M.scale(cur),[13.3,13.43,13.6],[[100,100],[83,83],[100,100]]);alpha(cur,12.3,12.7);alpha(cur,18.9,19.4,[100,0]);
var handle=M.circle(C,'Swatch becomes resize handle',52,col('citrus'),[1336,622],15.8,19.0);M.key(M.pos(handle),[15.8,16.6,18.3],[[1336,622],[941,533],[1622,619]]);M.key(M.shapeSize(handle,'ellipse'),[15.8,16.6],[[52,52],[16,16]]);M.key(N.fill(handle),[15.8,16.6],[col('citrus'),col('ink')]);alpha(handle,18.7,19,[100,0]);
var resizeTitle=txt(C,'Responsive statement','一个画面，自由展开。',64,960,136,16.3,20.4);N.reveal(resizeTitle,16.3,16.95,46);alpha(resizeTitle,19.8,20.4,[100,0]);
var dimension=txt(C,'Responsive output size','1120 × 600',19,1560,991,18.4,20,D.fonts.display600,'right','muted');alpha(dimension,18.4,18.75);alpha(dimension,19.6,20,[100,0]);
// New ratios are designed compositions, not an indiscriminate crop.
var outputHead=txt(C,'Output statement','同一个想法。不同的展开。',58,146,113,20,24.6,D.fonts.han700,'left');N.reveal(outputHead,20,20.65,48);
var p2=place(C,poster,'Designed output / portrait',150,224,90,20.2,24.6);N.shadow(p2,13,14,34);M.key(M.pos(p2),[20.2,21.45],[[800,224],[150,224]]);M.key(M.scale(p2),[20.2,21.45],[[32,32],[90,90]]);M.key(M.rotation(p2),[20.2,21.45],[-9,0]);alpha(p2,20.2,20.55);
var p3=place(C,ticket,'Designed output / ticket',800,744,72,20.6,24.6);N.shadow(p3,13,14,34);M.key(M.pos(p3),[20.6,21.8],[[800,620],[800,744]]);M.key(M.scale(p3),[20.6,21.8],[[44,44],[72,72]]);M.key(M.rotation(p3),[20.6,21.8],[6,0]);alpha(p3,20.6,21.0);
var outLabel=txt(C,'Output family','POSTER / BANNER / PASS',18,150,953,21.65,24.6,D.fonts.display600,'left','muted');alpha(outLabel,21.65,22.1);
// The campaign's fold becomes a full-frame rhythmic transition into the brand.
for(var i=0;i<7;i++){
 var x=-200+i*390,l=M.rect(C,'Fold shutter '+i,[430,1800],col(i%2?'citrus':'lilac'),[x,-1200],0,24.05,25.5);M.rotation(l).setValue(-24);M.key(M.pos(l),[24.05+i*.025,24.45+i*.025,24.8+i*.025,25.4+i*.025],[[x,-1200],[x,530],[x,530],[x,2200]]);
}
var burstbg=M.rect(C,'Brand color field',[1920,1080],col('citrus'),[960,540],0,24.5,28.4);burstbg.moveAfter(p2);
var burst1=txt(C,'Brand rhythm / one idea','一份灵感',174,960,395,24.7,26.1);burst1.moveAfter(p2);M.key(M.scale(burst1),[24.7,25.2],[[130,68],[100,100]]);M.key(M.pos(burst1),[25.6,26.1],[[960,395],[960,-230]]);
var burst2=txt(C,'Brand rhythm / many forms','一整套作品',144,960,649,25.2,28.3);burst2.moveAfter(p2);M.key(M.pos(burst2),[25.2,25.8,26.25,27.9],[[960,1050],[960,649],[960,510],[960,510]]);M.key(M.scale(burst2),[27.55,28.3],[[100,100],[35,35]]);alpha(burst2,27.8,28.3,[100,0]);
var bsmall=txt(C,'Brand rhythm / system','ONE IDEA. OPEN POSSIBILITIES.',24,960,797,25.7,27.8,D.fonts.display600);bsmall.moveAfter(p2);alpha(bsmall,25.7,26.1);alpha(bsmall,27.3,27.8,[100,0]);
// Last transition returns to a warm paper field with the original folded mark.
var endPaper=M.rect(C,'Closing paper aperture',[1920,1080],paper,[960,540],0,27.9,32);var em=M.ellipseMask(endPaper,0,0,10).property('ADBE Mask Shape');
function ellipse(r){var k=r*.55228475,s=new Shape();s.vertices=[[r,0],[0,r],[-r,0],[0,-r]];s.inTangents=[[0,-k],[k,0],[0,k],[-k,0]];s.outTangents=[[0,k],[-k,0],[0,-k],[k,0]];s.closed=true;return s;}
M.key(em,[27.9,28.65],[ellipse(10),ellipse(1300)]);
var markHQ=M.comp('FOLD / Mark / large-scale master',600,640,dur,30,folder);for(var i=0;i<D.logo.length;i++){var ml=draw(markHQ,D.logo[i],0,dur);N.pathProp(ml).setValue(pathShape(D.logo[i],{x:0,y:0,s:10}));}
var finalLogo=place(C,markHQ,'FOLD / closing mark',600,340,22,28.25,32);M.key(M.pos(finalLogo),[28.25,29],[[600,470],[600,340]]);M.key(M.rotation(finalLogo),[28.25,29],[-14,0]);alpha(finalLogo,28.25,28.85);
var endWord=txt(C,'FOLD / closing wordmark','FOLD',198,802,420,28.35,32,D.fonts.display800,'left');N.reveal(endWord,28.35,29.05,75);
var ending=txt(C,'FOLD / closing thought','让灵感，展开。',59,960,644,28.7,32);N.reveal(ending,28.7,29.35,42);
var concept=txt(C,'Concept disclosure','ORIGINAL SOFTWARE CONCEPT / 2026',17,960,912,29.2,32,D.fonts.display600,'center','muted');alpha(concept,29.2,29.8);
writeLn('FOLD native project: '+M.count.layers+' layers, '+M.count.keyedProperties+' animated properties.');
})();
