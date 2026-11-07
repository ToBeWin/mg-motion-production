/* SUNPOP: original kinetic brand identity. Native shape/text animation plus 3D plates. */
(function(){
var M=MuseNative,C={},k;for(k in D.colors)C[k]=M.rgb(D.colors[k]);
var c=M.comp('SUNPOP / Picture',1920,1080,24,30),F='FOLDDisplay-ExtraBold',H='FOLDHan-Bold';
function bg(name,color,a,b){return M.rect(c,name,[1920,1080],C[color],[960,540],0,a,b);}
function txt(name,str,size,color,x,y,a,b,font){return M.text(c,name,str,size,C[color],[x,y],font||F,a,b);}
function sc(l,ts,vs){M.key(M.scale(l),ts,vs,{influence:76});return l;}
function xy(l,ts,vs){M.key(M.pos(l),ts,vs,{influence:76});return l;}
function spin(l,ts,vs){M.key(M.rotation(l),ts,vs,{linear:true});return l;}
function appear(l,t,dy){var p=M.pos(l).value;xy(l,[t,t+.32,t+.46],[[p[0],p[1]+dy],[p[0],p[1]-8],p]);sc(l,[t,t+.32,t+.46],[[93,107],[102,98],[100,100]]);}
function sun(name,x,y,r,color,a,b){
 var p=M.group(c,name,a,b);M.pos(p).setValue([x,y]);
 var core=M.circle(c,name+' / core',r*1.2,C[color],[0,0],a,b);core.parent=p;M.pos(core).setValue([0,0]);
 for(var i=0;i<12;i++){var ang=i*Math.PI/6,l=M.rect(c,name+' / ray '+i,[r*.26,r*.12],C[color],[Math.cos(ang)*r*.88,Math.sin(ang)*r*.88],r*.06,a,b);M.rotation(l).setValue(i*30);l.parent=p;M.pos(l).setValue([Math.cos(ang)*r*.88,Math.sin(ang)*r*.88]);}
 return p;
}
function ring(name,x,y,r,color,width,a,b){return M.shape(c,name,'ellipse',[r*2,r*2],null,[x,y],0,C[color],width,a,b);}
function bubble(name,x,y,r,color,a,b,dx,dy){var l=M.circle(c,name,r*2,C[color],[x,y],a,b);xy(l,[a,b],[[x,y],[x+dx,y+dy]]);return l;}
function plate(name,shot,start,end,x,y,width){var path=PLATES[shot],src=app.project.importFile(new ImportOptions(new File(path)));var l=M.setup(c.layers.add(src),name,[x,y],start,end);l.startTime=start;l.inPoint=start;l.outPoint=end;M.scale(l).setValue([width/src.width*100,width/src.width*100]);return l;}
bg('SUNPOP / cream field','cream',0,24);
// 01. A real pull-tab opens; the graphic sun takes over its circular opening.
var top=txt('Opening / register','OPEN A LITTLE',30,'blue',328,165,0,2.25);M.fitWidth(top,360);
var pop=txt('Opening / POP','POP!',300,'blue',370,510,.26,2.25);M.fitWidth(pop,670);
xy(pop,[.26,.61,.82],[[370,650],[370,487],[370,510]]);M.key(M.rotation(pop),[.26,.61,.82],[-8,3,0]);
txt('Opening / Chinese cue','给今天，一点热烈。',38,'blue',355,750,.73,2.15,H);
var op=plate('01 / Pull tab / Cycles','open',0,2.4,1270,650,1780);
var os=sun('Opening / pop rays',1280,565,110,'orange',1.15,2.25);sc(os,[1.15,1.42,1.8,2.1],[[0,0],[100,100],[128,128],[220,220]]);xy(os,[1.15,1.92],[[1280,565],[1290,460]]);spin(os,[1.15,2.25],[-15,15]);
M.opacity(os).setValue(100);
for(var i=0;i<6;i++){var ang=i*Math.PI/3;var rr=ring('Opening / sparkle '+i,1250+Math.cos(ang)*260,450+Math.sin(ang)*190,18,'orange',5,.65,1.8);sc(rr,[.65,.95,1.8],[[0,0],[140,140],[175,175]]);M.key(M.opacity(rr),[.65,1.1,1.8],[100,100,0]);}
var wipe=M.circle(c,'Transition 01 / sun aperture',40,C.orange,[1290,460],1.92,2.30);sc(wipe,[1.92,2.28],[[100,100],[6500,6500]]);
// 02. Two large typographic statements, each with one readable resting position.
bg('02 / orange field','orange',2.26,5.38);
txt('02 / brand microtype','SUNPOP  /  放晴',28,'cream',279,104,2.26,5.38,H);
var t=txt('02 / 把今天','把今天，',234,'cream',940,355,2.30,5.30,H);appear(t,2.30,330);
var chars=['打','开','。'];for(i=0;i<3;i++){var q=txt('02 / open glyph '+i,chars[i],350,'blue',620+i*350,715,2.89+i*.12,5.30,H);appear(q,2.89+i*.12,450);}
var ss=sun('02 / moving sun',1665,280,115,'blue',2.45,5.34);sc(ss,[2.45,2.85],[[0,0],[100,100]]);spin(ss,[2.45,5.34],[-35,45]);
var cr=M.circle(c,'Transition 02 / punctuation to field',36,C.cream,[1350,800],5.0,5.40);sc(cr,[5.0,5.38],[[100,100],[7200,7200]]);
// 03. The real can rotates continuously across an intentionally simple brand stage.
bg('03 / product field','cream',5.34,11.30);
var halo=M.circle(c,'03 / orange stage',960,C.orange,[960,540],5.34,11.3);sc(halo,[5.34,5.85,9.0],[[40,40],[100,100],[105,105]]);
var s1=txt('03 / SUN left','SUN',290,'blue',360,380,5.5,8.9);M.fitWidth(s1,630);xy(s1,[5.5,6.05,8.75],[[160,380],[370,380],[300,380]]);
var s2=txt('03 / POP right','POP',290,'blue',1550,710,5.68,8.9);M.fitWidth(s2,620);xy(s2,[5.68,6.18,8.75],[[1850,710],[1550,710],[1610,710]]);
var f1=txt('03 / 放晴 / behind product','放晴',690,'blue',950,530,8.9,11.28,H);sc(f1,[8.9,9.24,10.7],[[80,105],[100,100],[103,103]]);
txt('03 / side register','CITRUS\nSODA',24,'blue',245,872,6.1,10.6);
var h=plate('03 / Hero roll / Cycles','hero',5.34,11.34,960,535,1920);
sc(h,[5.34,6.05,10.46,11.25],[[92,92],[100,100],[100,100],[790,790]]);
xy(h,[10.46,11.25],[[960,535],[960,440]]);
for(i=0;i<8;i++){var bx=170+i*230,by=890+(i%2)*130;var bb=bubble('03 / fine rising bubble '+i,bx,by,8+i%3*6,'orange',5.65+i*.14,10.5,(i%2?35:-30),-430);sc(bb,[5.65+i*.14,6.0+i*.14],[[0,0],[100,100]]);}
var bw=M.circle(c,'Transition 03 / print-blue match',40,C.blue,[960,540],11.02,11.42);sc(bw,[11.02,11.35],[[100,100],[6500,6500]]);
// 04. Type has mass: staggered impacts, overshoot, then a clear pause.
bg('04 / electric blue field','blue',11.32,14.68);
var hot1=txt('04 / 热','热',590,'cream',650,505,11.34,14.68,H);appear(hot1,11.34,560);
var hot2=txt('04 / 烈','烈',590,'cream',1245,505,11.47,14.68,H);appear(hot2,11.47,560);
var aBit=txt('04 / 一点','一点。',178,'cream',1325,884,11.72,14.68,H);appear(aBit,11.72,210);
var again=txt('04 / 再','再',180,'orange',270,195,12.55,14.68,H);M.rotation(again).setValue(-13);appear(again,12.55,-260);
var spark=sun('04 / warmth accent',1670,187,113,'yellow',11.59,14.68);sc(spark,[11.59,11.9,12.6,12.83,13.6],[[0,0],[100,100],[100,100],[124,124],[100,100]]);spin(spark,[11.59,14.68],[-15,50]);
M.key(M.scale(hot1),[12.68,12.88,13.08],[[100,100],[106,96],[100,100]]);M.key(M.scale(hot2),[12.78,12.98,13.18],[[100,100],[106,96],[100,100]]);
var ow=M.circle(c,'Transition 04 / hot dot wipe',50,C.orange,[1640,885],14.32,14.73);sc(ow,[14.32,14.69],[[100,100],[6000,6000]]);
// 05. Signature wallpaper: opposing type conveyors, orbiting bubbles and a sun pulse.
bg('05 / orange pattern field','orange',14.67,18.25);
for(var row=0;row<3;row++){
 var yy=174+row*350,dir=row%2?1:-1;
 for(var col=0;col<3;col++){var xx=-800+col*1600;var lt=txt('05 / kinetic ribbon '+row+'-'+col,'SUNPOP',375,row===1?'cream':'blue',xx,yy,14.67,18.22);M.fitWidth(lt,1540);xy(lt,[14.67,18.22],[[xx-dir*260,yy],[xx+dir*600,yy]]);}
}
for(i=0;i<7;i++){var bx=120+i*280,by=850-(i%3)*250;var bl=bubble('05 / graphic bubbles '+i,bx,by,35+i%3*19,i%2?'cream':'yellow',14.8+i*.08,18.25,100*(i%2?1:-1),-520);sc(bl,[14.8+i*.08,15.1+i*.08,18.22],[[0,0],[100,100],[140,140]]);}
var mid=sun('05 / sun bloom',960,550,260,'cream',16.15,18.22);sc(mid,[16.15,16.5,17.48],[[0,0],[105,105],[85,85]]);spin(mid,[16.15,18.22],[-35,35]);
var cw=M.circle(c,'Transition 05 / brand resolution',50,C.cream,[960,550],17.70,18.28);sc(cw,[17.7,18.25],[[100,100],[6300,6300]]);
// 06. Calm, persistent brand lockup; the product keeps a subtle physical movement.
bg('06 / packshot field','cream',18.24,24);
var endSun=sun('06 / orange signature',1375,550,492,'orange',18.24,24);sc(endSun,[18.24,18.9],[[85,85],[100,100]]);spin(endSun,[18.24,24],[-8,3]);
var pk=plate('06 / Three colour editions / Cycles','pack',18,24,1330,558,1810);sc(pk,[18,18.8],[[82,82],[94.27,94.27]]);
var brand=txt('06 / 放晴','放晴',195,'blue',465,352,18.55,24,H);appear(brand,18.55,110);
var sunpop=txt('06 / SUNPOP','SUNPOP',187,'blue',475,548,18.76,24);M.fitWidth(sunpop,720);xy(sunpop,[18.76,19.17],[[475,635],[475,548]]);
var line=txt('06 / brand promise','快乐冒个泡。',58,'blue',476,728,19.17,24,H);appear(line,19.17,58);
txt('06 / editorial top line','OPEN A LITTLE SUNSHINE.',24,'blue',453,145,18.8,24);
txt('06 / category','柑橘气泡饮',29,'blue',470,900,20.2,24,'FOLDHan-Regular');
// A tiny closing motion gives the endpoint a deliberate final accent.
var dot=M.circle(c,'06 / final sun-dot',20,C.orange,[783,730],22.70,24);sc(dot,[22.70,22.87,23.10],[[0,0],[125,125],[100,100]]);
})();
