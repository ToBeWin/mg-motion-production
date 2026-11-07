(function(scope){
  'use strict';
  const node=typeof module!=='undefined';
  const base=node?require('./base-film.js'):scope.MGBase;
  const makeCanvas=()=>{if(node)return require('@napi-rs/canvas').createCanvas(1920,1080);let c=document.createElement('canvas');c.width=1920;c.height=1080;return c};
  const live=makeCanvas(),lc=live.getContext('2d');
  const W=1920,H=1080,TAU=Math.PI*2,C={ink:'#18191c',paper:'#f7f8fa',blue:'#4156f4',grey:'#78808a'};
  const clamp=v=>Math.max(0,Math.min(1,v)),mix=(a,b,t)=>a+(b-a)*t;
  const smooth=v=>{v=clamp(v);return v*v*(3-2*v)};
  const out=v=>1-Math.pow(1-clamp(v),4);
  const io=v=>{v=clamp(v);return v<.5?8*v**4:1-(-2*v+2)**4/2};
  function rect(g,x,y,w,h,c,r=0){g.fillStyle=c;g.beginPath();g.roundRect(x,y,w,h,r);g.fill()}
  function disc(g,x,y,r,c){if(r<=0)return;g.fillStyle=c;g.beginPath();g.arc(x,y,r,0,TAU);g.fill()}
  function txt(g,s,x,y,size,c=C.ink,align='left',zh=false,weight=700){g.font=`${weight} ${size}px "${zh?'MG Chinese':'MG Sans'}",sans-serif`;g.fillStyle=c;g.textAlign=align;g.textBaseline='alphabetic';g.fillText(s,x,y)}
  function line(g,pts,w,c){g.beginPath();g.strokeStyle=c;g.lineWidth=w;g.lineCap='round';pts.forEach((v,i)=>i?g.lineTo(...v):g.moveTo(...v));g.stroke()}
  function bg(g,c=C.paper){g.fillStyle=c;g.fillRect(0,0,W,H)}
  function shadow(g,x,y,w,h,r=24){g.save();g.shadowColor='#1e2a4c22';g.shadowBlur=42;g.shadowOffsetY=25;rect(g,x,y,w,h,'#fff',r);g.restore()}
  function cursor(g,x,y,t,click=0){g.save();g.translate(x,y);g.rotate(-.12);g.beginPath();g.moveTo(0,0);g.lineTo(0,52);g.lineTo(14,39);g.lineTo(24,60);g.lineTo(34,55);g.lineTo(23,35);g.lineTo(43,34);g.closePath();g.fillStyle='#fff';g.strokeStyle=C.ink;g.lineWidth=3;g.fill();g.stroke();if(click>0){g.globalAlpha=1-click;g.strokeStyle=C.blue;g.lineWidth=3;g.beginPath();g.arc(0,0,12+click*45,0,TAU);g.stroke()}g.restore()}
  function arrow(g,x,y,col){line(g,[[x-15,y+11],[x,y-6],[x+15,y+11]],4,col);line(g,[[x,y-5],[x,y+24]],4,col)}
  function brand(g,x,y,s=1){g.save();g.translate(x,y);g.scale(s,s);disc(g,0,0,14,C.blue);g.strokeStyle=C.blue;g.lineWidth=4;g.beginPath();g.arc(0,0,25,-.7,4.1);g.stroke();txt(g,'一念',44,12,32,C.ink,'left',true);g.restore()}
  const themes=[{ink:'#151515',paper:'#F0EBDD',lime:'#D7FF3F',blue:'#364BFF'},{ink:'#17222b',paper:'#e8eee9',lime:'#d8ddce',blue:'#82a6a0'},{ink:'#2c1825',paper:'#fff1e0',lime:'#ffb88c',blue:'#ef6d57'}];
  const selectedTheme=2;
  function mixColor(a,b,t){const aa=parseInt(a.slice(1),16),bb=parseInt(b.slice(1),16);return '#'+[16,8,0].map(n=>Math.round(mix((aa>>n)&255,(bb>>n)&255,t)).toString(16).padStart(2,'0')).join('')}
  function themeAt(t){const q=smooth((t-15.6)/.6);return Object.fromEntries(Object.keys(themes[0]).map(k=>[k,mixColor(themes[0][k],themes[selectedTheme][k],q)]))}
  function baseAt(t,theme=0){let old={...base.palette};Object.assign(base.palette,typeof theme==='number'?themes[theme]:theme);try{base.draw(lc,t);return live}finally{Object.assign(base.palette,old)}}
  const cached={};
  function thumb(t,theme=0){let key=t+'-'+(typeof theme==='number'?theme:JSON.stringify(theme));if(!cached[key]){const cv=makeCanvas();cv.getContext('2d').drawImage(baseAt(t,theme),0,0);cached[key]=cv}return cached[key]}
  function imageIn(g,img,x,y,w,h,r=0){g.save();g.beginPath();g.roundRect(x,y,w,h,r);g.clip();g.drawImage(img,x,y,w,h);g.restore()}
  function note(g,s,y=1015){txt(g,s,960,y,22,C.grey,'center',true,500)}
  function prompt(g,t){
    bg(g);let q=io((t-3.15)/.85),fade=1-smooth((t-2.8)/.55);
    g.save();g.globalAlpha=1-q;brand(g,122,104);txt(g,'MOTION LAB / CONCEPT FILM',1798,112,18,C.grey,'right');g.restore();
    g.save();g.globalAlpha=fade;txt(g,'把想法',960,354,124,C.ink,'center',true);txt(g,'变成画面。',960,505,124,C.blue,'center',true);g.restore();
    let x=mix(305,145,q),y=mix(600,100,q),w=mix(1310,1630,q),h=mix(144,880,q);shadow(g,x,y,w,h,30);
    if(q>.18){g.save();g.beginPath();g.roundRect(x,y,w,h,30);g.clip();workspace(g,t);g.restore()}
    g.save();g.globalAlpha=1-smooth(q/.2);
    const phrase='让一个点，变成无限可能。';let n=Math.floor(clamp((t-.5)/1.65)*phrase.length);txt(g,phrase.slice(0,n),365,687,42,C.ink,'left',true,500);g.font='500 42px "MG Chinese"';let tw=g.measureText(phrase.slice(0,n)).width;
    if(t<2.55&&Math.sin(t*14)>-.4)rect(g,370+tw,645,3,50,C.blue);
    disc(g,1528,672,42,C.blue);arrow(g,1528,663,'#fff');g.restore();
    if(t>2.3&&t<3.7){let k=out((t-2.3)/.65);cursor(g,mix(1700,1531,k),mix(845,675,k),t,clamp((t-3)/.35));}
    g.save();g.globalAlpha=fade;note(g,'一个想法，一条连续的创作路径。',872);g.restore();
  }
  function workspace(g,t){
    bg(g);let enter=out((t-3.4)/.6),q=io((t-7)/2),z=mix(1,1.6,q);
    const sourceTime=t<5.5?8.2+Math.max(0,t-4)*1.7:t<6.7?10.75+(t-5.5)*1.45:12.49+(t-6.7)*(1.01/2.3);
    const selected=Math.min(3,Math.floor(sourceTime/4));
    g.save();g.translate(960,540);g.scale(z,z);g.translate(-mix(960,1050,q),-mix(540,557.5,q));
    shadow(g,145,100,1630,880,30);g.save();g.beginPath();g.roundRect(145,100,1630,880,30);g.clip();
    rect(g,145,100,1630,70,'#fff');line(g,[[145,170],[1775,170]],1,'#e5e7eb');
    disc(g,180,135,6,'#e0e3e7');disc(g,202,135,6,'#e0e3e7');disc(g,224,135,6,'#e0e3e7');txt(g,'一念成形',950,145,24,C.ink,'center',true);rect(g,1630,117,112,37,C.blue,10);txt(g,'预览',1686,143,18,'#fff','center',true);
    rect(g,145,171,270,809,'#f7f8fa');g.save();g.globalAlpha=enter;txt(g,'你的想法',175,230,18,C.grey,'left',true);txt(g,'让一个点，',175,280,26,C.ink,'left',true);txt(g,'变成无限可能。',175,320,26,C.ink,'left',true);
    const names=['弹性与重力','轨迹与节奏','图案与秩序','空间与想象'];names.forEach((s,i)=>{let a=out((t-4.25-i*.23)/.4);g.globalAlpha=a;rect(g,165,385+i*72,230,55,i===selected?'#e9edff':'#fff',10);disc(g,189,412+i*72,5,i===selected?C.blue:'#c5cad1');txt(g,s,207,420+i*72,20,i===selected?C.blue:C.ink,'left',true)});g.restore();
    let img=baseAt(sourceTime);imageIn(g,img,450,220,1200,675,9);
    g.save();g.globalAlpha=enter;txt(g,'画面',450,203,16,C.grey,'left',true);txt(g,'实时预览',1650,203,16,C.grey,'right',true);
    const labels=['点火','动能','阵列','空间','排版','变形','汇聚','成形'];for(let i=0;i<8;i++){let xx=450+i*150;rect(g,xx,919,143,32,i===selected?'#dbe1ff':'#eef0f3',5);txt(g,labels[i],xx+71,941,14,i===selected?C.blue:C.grey,'center',true)}let p=450+sourceTime/32*1200;rect(g,p,908,2,52,C.blue);disc(g,p+1,909,4,C.blue);g.restore();
    g.restore();g.restore();
  }
  function fullscreen(g,t){g.drawImage(baseAt(13.5+(t-9)*.25),0,0)}
  function project(v,angle,scale,xc,yc,zoff){let [x,y]=v;let z=-x*Math.sin(angle)+zoff;let xp=x*Math.cos(angle);let p=1400/(1400-z);return [xc+xp*p*scale,yc+y*p*scale]}
  function triangle(g,img,src,dst){
    const [s0,s1,s2]=src,[d0,d1,d2]=dst;const den=s0[0]*(s1[1]-s2[1])+s1[0]*(s2[1]-s0[1])+s2[0]*(s0[1]-s1[1]);
    function coeff(k){return [(d0[k]*(s1[1]-s2[1])+d1[k]*(s2[1]-s0[1])+d2[k]*(s0[1]-s1[1]))/den,(d0[k]*(s2[0]-s1[0])+d1[k]*(s0[0]-s2[0])+d2[k]*(s1[0]-s0[0]))/den,(d0[k]*(s1[0]*s2[1]-s2[0]*s1[1])+d1[k]*(s2[0]*s0[1]-s0[0]*s2[1])+d2[k]*(s0[0]*s1[1]-s1[0]*s0[1]))/den]}
    const a=coeff(0),b=coeff(1),cx=(d0[0]+d1[0]+d2[0])/3,cy=(d0[1]+d1[1]+d2[1])/3;g.save();g.beginPath();dst.forEach((p,i)=>{let dx=p[0]-cx,dy=p[1]-cy,l=Math.hypot(dx,dy);let v=[p[0]+dx/l*.75,p[1]+dy/l*.75];i?g.lineTo(...v):g.moveTo(...v)});g.closePath();g.clip();g.transform(a[0],b[0],a[1],b[1],a[2],b[2]);g.drawImage(img,0,0);g.restore();
  }
  function plane(g,img,x,y,scale,angle,alpha=1){
    let pts=[[-960,-540],[960,-540],[960,540],[-960,540]].map(v=>project(v,angle,scale,x,y,0));g.save();g.globalAlpha=alpha;g.shadowColor='#18254d22';g.shadowBlur=40;g.shadowOffsetY=30;g.fillStyle='#fff';g.beginPath();pts.forEach((p,i)=>i?g.lineTo(...p):g.moveTo(...p));g.closePath();g.fill();g.shadowColor='transparent';
    triangle(g,img,[[0,0],[1920,0],[1920,1080]],[pts[0],pts[1],pts[2]]);triangle(g,img,[[0,0],[1920,1080],[0,1080]],[pts[0],pts[2],pts[3]]);g.restore();
  }
  function gallery(g,t){
    bg(g);let q=io((t-12)/1.5),p=smooth((t-14.5)/1.2),end=io((t-17.25)/.75);
    g.save();g.globalAlpha=q*(1-out((t-17.1)/.45));txt(g,'一个想法，不止一种表达。',960,190,66,C.ink,'center',true);g.restore();
    let centerScale=mix(1,.48,q),y=mix(540,565,q);let ang=.05*Math.sin((t-12)*.6)*q;
    if(q>.01){
      plane(g,thumb(14,1),mix(960,170,q)-end*1000,565,.36*q,-.28,q);
      plane(g,thumb(14,2),mix(960,1750,q)+end*1000,565,.36*q,.28,q);
    }
    // Keep the preview within the complete orbit shot while the chosen palette settles.
    let img=baseAt(14.25+(t-12)*.14,themeAt(t));
    let scale=centerScale*(1+end*1.3);plane(g,img,960, y+end*560,scale,ang,1-end);
    g.save();g.globalAlpha=q*(1-end);const cols=['#364BFF','#82a6a0','#ef6d57'];cols.forEach((c,i)=>{let x=880+i*80;disc(g,x,911,24,c);const selected=smooth((t-15.6)/.6),alpha=i===0?1-selected:i===selectedTheme?selected:0;if(alpha>0){g.save();g.globalAlpha*=alpha;g.strokeStyle='#fff';g.lineWidth=4;g.beginPath();g.arc(x,911,17,0,TAU);g.stroke();g.restore()}});txt(g,'选择配色，让风格属于你',960,1000,24,C.grey,'center',true,500);g.restore();
    if(t>14.5&&t<16.7){let a=out((t-14.5)/1);cursor(g,mix(1240,1043,a),mix(1030,915,a),t,clamp((t-15.6)/.4))}
    if(t>17.5)typography(g,t,true);
  }
  function typography(g,t,overlay=false){
    if(!overlay)bg(g);let p=t-17.5;
    const lines=[['YOUR',320,350],['IDEAS.',320,590],['IN MOTION.',320,830]];
    lines.forEach(([s,x,y],i)=>{let a=out((p-i*.36)/.7);g.save();g.beginPath();g.rect(250,y-210,1500,230);g.clip();txt(g,s,x,y+(1-a)*250,205,i===2?themes[selectedTheme].blue:C.ink);g.restore()});
    if(p>1.8){let a=out((p-1.8)/.6);g.save();g.globalAlpha=a;txt(g,'你定义想法，运动赋予它形状。',326,952,34,C.grey,'left',true,500);g.restore()}
    const q=io((t-23)/1);if(q>0){g.save();g.translate(960,540);g.rotate(-Math.PI*.5*(1-q));g.beginPath();g.rect(-W/2,-H*q/2,W,H*q);g.clip();g.rotate(Math.PI*.5*(1-q));g.translate(-960,-540);deliver(g,t);g.restore()}
  }
  function deliver(g,t){
    bg(g,C.ink);let p=t-23.4,enter=out(p/.65),close=io((t-27.2)/.8);
    g.save();g.globalAlpha=1-close;txt(g,'从创作，到成片。',128,255,84,'#f7f8fa','left',true);txt(g,'同一个想法，完整交付。',135,326,30,'#aaaeb7','left',true,500);
    let x=920+(1-enter)*650,y=204,w=830,h=467;imageIn(g,baseAt(17.5+p*.15,selectedTheme),x,y,w,h,18);
    rect(g,128,426,545,2,'#41444a');txt(g,'作品画面',128,515,45,'#fff','left',true);txt(g,'配乐节奏',128,601,45,'#fff','left',true);txt(g,'可编辑源稿',128,687,45,'#fff','left',true);
    let fill=clamp((p-.5)/1.5);rect(g,920,730,830,62,'#303238',14);rect(g,920,730,Math.max(2,830*out(fill)),62,themes[selectedTheme].blue,14);txt(g,fill===1?'成片已生成':'渲染画面',1335,770,23,'#fff','center',true);
    g.save();g.globalAlpha=out((p-2)/.4);txt(g,'视频 · 配乐 · 可编辑源文件',1335,862,24,'#b7bbc5','center',true,500);g.restore();g.restore();
    if(close>0){g.save();g.beginPath();g.arc(960,540,1250*close,0,TAU);g.clip();ending(g,t);g.restore()}
  }
  function ending(g,t){bg(g);let p=t-27.45;let a=out(p/.7);g.save();g.translate(960,250);g.scale(a,a);disc(g,0,0,52,themes[selectedTheme].blue);g.strokeStyle=themes[selectedTheme].blue;g.lineWidth=10;g.beginPath();g.arc(0,0,82,-.6,4.1);g.stroke();g.restore();
    g.save();g.beginPath();g.rect(100,380,1720,235);g.clip();txt(g,'一念成形',960,577+(1-out((p-.15)/.7))*250,180,C.ink,'center',true);g.restore();
    g.save();g.globalAlpha=out((p-.7)/.6);txt(g,'IDEAS INTO MOTION.',960,712,65,themes[selectedTheme].blue,'center');txt(g,'原创动效工作台 · 概念演示',960,840,28,C.grey,'center',true,500);g.restore();}
  function draw(g,time){let t=Math.max(0,Math.min(31.999,time));g.save();g.setTransform(1,0,0,1,0,0);g.globalAlpha=1;
    if(t<4)prompt(g,t);else if(t<9)workspace(g,t);else if(t<12)fullscreen(g,t);else if(t<18)gallery(g,t);else if(t<24)typography(g,t);else if(t<28)deliver(g,t);else ending(g,t);g.restore();}
  const api={draw,width:W,height:H,duration:32,fps:60,palette:C};if(node)module.exports=api;else scope.MGFilm=api;
})(typeof window!=='undefined'?window:globalThis);
