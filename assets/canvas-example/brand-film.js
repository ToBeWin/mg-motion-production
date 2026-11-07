(function (scope) {
  'use strict';
  const W=1920,H=1080,TAU=Math.PI*2;
  const C={ink:'#151515',paper:'#F0EBDD',lime:'#D7FF3F',blue:'#364BFF'};
  const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
  const mix=(a,b,t)=>a+(b-a)*t;
  const ease=v=>{v=clamp(v);return v*v*(3-2*v)};
  const out=v=>1-Math.pow(1-clamp(v),4);
  const io=v=>{v=clamp(v);return v<.5?8*v*v*v*v:1-Math.pow(-2*v+2,4)/2};
  const spring=v=>v<=0?0:v>=1?1:1-Math.exp(-7*v)*Math.cos(11*v);
  const pop=(t,s,d=.7)=>spring((t-s)/d);
  function disc(g,x,y,r,col){if(r<=0)return;g.fillStyle=col;g.beginPath();g.arc(x,y,r,0,TAU);g.fill()}
  function line(g,pts,width,col,closed=false){g.strokeStyle=col;g.lineWidth=width;g.lineCap='round';g.lineJoin='round';g.beginPath();pts.forEach((p,i)=>i?g.lineTo(...p):g.moveTo(...p));if(closed)g.closePath();g.stroke()}
  function rect(g,x,y,w,h,col,r=0){g.fillStyle=col;g.beginPath();g.roundRect(x,y,w,h,r);g.fill()}
  function text(g,s,x,y,size,col,align='left',family='MG Sans',stroke=false){g.font=`900 ${size}px "${family}", sans-serif`;g.textAlign=align;g.textBaseline='alphabetic';g.fillStyle=col;g.strokeStyle=col;g.lineWidth=2;if(stroke)g.strokeText(s,x,y);else g.fillText(s,x,y)}
  function zh(g,s,x,y,size,col,align='left'){text(g,s,x,y,size,col,align,'MG Chinese')}
  function arc(g,x,y,r,a,b,w,col){if(r<=0||b<=a)return;g.strokeStyle=col;g.lineWidth=w;g.lineCap='round';g.beginPath();g.arc(x,y,r,a,b);g.stroke()}
  function background(g,col){g.fillStyle=col;g.fillRect(0,0,W,H)}
  function tag(g,t,label,col,chapter){g.save();g.globalAlpha=.7;text(g,`MOTION / ${String(chapter).padStart(2,'0')}`,72,77,20,col);text(g,label,1848,77,20,col,'right');g.restore()}
  function grain(g,t){ // Seeded fine stipple: stable across seeking, never random state.
    g.save();g.globalAlpha=.025;g.fillStyle=C.ink;for(let i=0;i<800;i++){let x=(i*719.37)%W,y=(i*i*11.23)%H;g.fillRect(x,y,1.2,1.2)}g.restore();
  }
  function ringMark(g,x,y,r,t,col){
    g.save();g.translate(x,y);g.rotate(t);for(let i=0;i<3;i++)arc(g,0,0,r*(.45+i*.25),-.65,4.8-i*.42,r*.12,col);disc(g,r*.93,-r*.32,r*.15,col);g.restore();
  }
  // Render the incoming shot inside the outgoing object's silhouette.
  function iris(g,x,y,r,paint){if(r<=0)return;g.save();g.beginPath();g.arc(x,y,r,0,TAU);g.clip();paint();g.restore()}
  function band(g,x,y,w,h,paint){if(w<=0||h<=0)return;g.save();g.beginPath();g.rect(x,y,w,h);g.clip();paint();g.restore()}
  // 01 — an elastic body establishes the single recurring character.
  function seed(g,t){
    background(g,C.paper);tag(g,t,'A SINGLE IDEA',C.ink,1);
    g.save();g.globalAlpha=1-ease((t-2.9)/.5);zh(g,'一念',115,400,218,C.ink);zh(g,'从一个点开始。',126,480,35,C.ink);text(g,'EVERYTHING STARTS WITH A DOT.',128,935,21,C.ink);g.restore();
    let x=1280,y=475,r=108;
    if(t<.75){r=mix(32,108,out(t/.75));y=475-25*Math.sin(t/.75*Math.PI)}
    else if(t<1.5){y=mix(475,764,io((t-.75)/.75))}
    else if(t<2.5){y=764-405*Math.sin(clamp((t-1.5)/1)*Math.PI)}
    else{y=mix(764,540,out((t-2.5)/.6));x=mix(1280,960,ease((t-2.5)/.7))}
    const squish=1+.62*Math.exp(-Math.pow((t-1.5)/.07,2))+.28*Math.exp(-Math.pow((t-2.5)/.09,2));
    const stretch=out((t-3.12)/.52);
    g.save();g.translate(x,y);g.scale(squish*(1+9*stretch),1/squish*(1-.3*stretch));disc(g,0,0,r,C.blue);g.restore();
    if(t<3){g.save();g.globalAlpha=.12*(1-ease((t-2.7)/.3));g.translate(x,884);g.scale(1,.09);disc(g,0,0,100+90*clamp((y-400)/400),C.ink);g.restore()}
    for(let j=0;j<3;j++){const p=(t-1.5)-j*.09;if(p>0&&p<.7){g.save();g.globalAlpha=(1-p/.7)*.5;arc(g,1280,872,60+p*260,Math.PI*1.08,Math.PI*1.92,3,C.blue);g.restore()}}
    if(t>3.54){const q=out((t-3.54)/.46);band(g,0,H*(1-q)/2,W,H*q,()=>flow(g,t-4))}
  }
  // 02 — traced ribbons. The traveling point draws every visible path.
  function pathPoint(u,k=0){return [960+(u-.5)*2400,540+Math.sin(u*TAU*1.35+k*.28)*170+Math.sin(u*TAU*.4)*50]}
  function flow(g,t){
    background(g,C.blue);tag(g,t,'GIVE IT MOMENTUM',C.paper,2);
    const zoom=1+.035*Math.sin(t*1.4);g.save();g.translate(960,540);g.rotate(-.07+Math.sin(t*.7)*.045);g.scale(zoom,zoom);g.translate(-960,-540);
    g.save();g.globalAlpha=.16;text(g,'MOVE',960,795,540,C.paper,'center', 'MG Sans',true);g.restore();
    const lead=mix(.20,1.3,clamp((t+.30)/4));
    for(let k=5;k>=0;k--){let pts=[];let end=lead-k*.035;for(let i=0;i<=120;i++){let u=mix(end-.73,end,i/120);let p=pathPoint(u,k);p[1]+=k*39-90;pts.push(p)}line(g,pts,k===0?68:13,k===0?C.lime:(k%2?C.paper:C.ink));}
    let p=pathPoint(lead,0);disc(g,p[0],p[1]-90,46,C.paper);
    g.restore();
    zh(g,'给想象，一点动能。',128,924,42,C.paper);
    if(t>2.9){let a=out((t-2.9)/.8);g.save();g.globalAlpha=a;arc(g,960,540,125+90*(1-a),-Math.PI/2,-Math.PI/2+TAU*a,55,C.lime);g.restore()}
    if(t>3.55){const q=io((t-3.55)/.45);iris(g,960,540,1200*q,()=>grid(g,t-4))}
  }
  // Reusable quarter-turn vocabulary. One silhouette, many states.
  function tile(g,x,y,s,kind,p,col,back){
    g.save();g.translate(x,y);g.rotate(p);g.fillStyle=col;
    if(kind===0){disc(g,0,0,s*.36,col);disc(g,0,0,s*.14,back)}
    else if(kind===1){rect(g,-s*.36,-s*.36,s*.72,s*.72,col,s*.36*(.5+.5*Math.sin(p)));disc(g,s*.14,-s*.14,s*.17,back)}
    else if(kind===2){for(let j=-1;j<=1;j++)rect(g,-s*.36,j*s*.23-s*.055,s*.72,s*.11,col,s*.06)}
    else if(kind===3){g.beginPath();g.arc(0,0,s*.38,0,Math.PI);g.closePath();g.fill();g.beginPath();g.arc(0,0,s*.38,Math.PI,TAU);g.strokeStyle=col;g.lineWidth=s*.055;g.stroke()}
    else {for(let j=0;j<4;j++){g.rotate(Math.PI/2);g.beginPath();g.moveTo(0,0);g.arc(s*.17,s*.17,s*.23,Math.PI,TAU);g.closePath();g.fill()}}
    g.restore();
  }
  function grid(g,t){
    background(g,C.paper);tag(g,t,'REPEAT / REIMAGINE',C.ink,3);
    const z=1+7*io((t-3.18)/.82);g.save();g.translate(960,540);g.scale(z,z);g.rotate(io((t-3.18)/.82)*Math.PI/2);g.translate(-960,-540);
    const cols=9,rows=4,s=188;
    for(let y=0;y<rows;y++)for(let x=0;x<cols;x++){
      const xx=208+x*s,yy=255+y*s;let delay=(Math.abs(x-4)+Math.abs(y-1.5))*.045;let a=pop(t+.40,delay,.65);
      let step=Math.floor(Math.max(0,t-.65)*2);let turn=ease(((Math.max(0,t-.65)*2)%1-.08)/.64)+step;
      let angle=(turn+(x+y)*.25)*Math.PI/2;
      const hero=x===4&&y===1;
      g.save();g.translate(xx,yy);g.scale(a,a);tile(g,0,0,s,hero?0:(x+y*2)%5,hero?t*.6:angle,hero?C.blue:C.ink,C.paper);if(hero)disc(g,0,0,s*.115,C.lime);g.restore();
    }
    g.restore();
    g.save();g.globalAlpha=1-ease((t-2.9)/.4);zh(g,'秩序，也可以很自由。',128,1000,34,C.ink);g.restore();
    if(t>3.75){iris(g,960,540,1200*io((t-3.75)/.25),()=>orbit(g,t-4))}
  }
  function rot3(p,ax,ay,az){let [x,y,z]=p;let a=y*Math.cos(ax)-z*Math.sin(ax),b=y*Math.sin(ax)+z*Math.cos(ax);y=a;z=b;a=x*Math.cos(ay)+z*Math.sin(ay);b=-x*Math.sin(ay)+z*Math.cos(ay);x=a;z=b;return [x*Math.cos(az)-y*Math.sin(az),x*Math.sin(az)+y*Math.cos(az),z]}
  function proj(p,cx=1190,cy=550){let d=1250/(1250-p[2]);return [cx+p[0]*d,cy+p[1]*d]}
  // 04 — actual depth-sorted ribbon geometry, not flat rotating ellipses.
  function orbit(g,t){
    background(g,C.ink);tag(g,t,'THINK IN ANOTHER DIMENSION',C.paper,4);
    let enter=out((t+.32)/.75),zoom=1+.08*Math.sin(t*1.1)+2*io((t-3.45)/.55);
    g.save();g.globalAlpha=enter*(1-ease((t-3.1)/.4));zh(g,'不止于',124,425,85,C.paper);zh(g,'平面',112,610,164,C.lime);text(g,'BEYOND THE SURFACE',128,704,24,C.paper);g.restore();
    const polys=[];let ax=.5+t*.33,ay=.4+t*.58,az=-.35+t*.12;
    for(let j=0;j<9;j++){
      const beta=(j-4)*.19;const rad=Math.sqrt(1-Math.pow((j-4)/5.1,2))*365;const z0=(j-4)*67;
      for(let k=0;k<100;k++){
        const a=k/100*TAU,b=(k+1)/100*TAU;
        let points=[[Math.cos(a)*rad,Math.sin(a)*rad,z0-12],[Math.cos(b)*rad,Math.sin(b)*rad,z0-12],[Math.cos(b)*rad,Math.sin(b)*rad,z0+12],[Math.cos(a)*rad,Math.sin(a)*rad,z0+12]].map(p=>rot3(p,ax,ay,az));
        let z=points.reduce((s,p)=>s+p[2],0)/4;polys.push({z,pts:points.map(p=>proj(p.map(n=>n*zoom*enter))),col:j%3===0?C.blue:j%3===1?C.lime:C.paper,alpha:.45+.55*clamp((z+400)/750)});
      }
    }
    polys.sort((a,b)=>a.z-b.z);for(const p of polys){g.globalAlpha=p.alpha;g.fillStyle=p.col;g.beginPath();p.pts.forEach((v,i)=>i?g.lineTo(...v):g.moveTo(...v));g.closePath();g.fill()}g.globalAlpha=1;
    let q=rot3([Math.cos(t*2.5)*445,Math.sin(t*2.5)*445,80],ax,ay,az);let pp=proj(q.map(n=>n*zoom));disc(g,...pp,35*(1250/(1250-q[2])),C.lime);
    if(t>3.6)iris(g,1190,550,1800*io((t-3.6)/.4),()=>type(g,t-4));
  }
  function word(g,s,x,y,size,t,offset,col,width){
    g.font=`900 ${size}px "MG Sans", sans-serif`;let widths=[...s].map(c=>g.measureText(c).width),sum=widths.reduce((a,b)=>a+b,0);let ratio=width/sum;
    let cursor=x;for(let i=0;i<s.length;i++){
      let a=pop(t,offset+i*.07,.6);g.save();g.translate(cursor,y);g.scale(ratio,1);g.translate(0,(1-a)*320);g.scale(1,Math.max(.01,a));text(g,s[i],0,0,size,col);g.restore();cursor+=widths[i]*ratio;
    }
  }
  function type(g,t){
    background(g,C.lime);tag(g,t,'MAKE IT MOVE',C.ink,5);
    g.save();let exit=io((t-3.5)/.5);g.translate(960,540);g.rotate(-.025*(1-exit));g.scale(1+exit*1.8,1-exit*.92);g.translate(-960,-540);
    // Horizontal reveal bands keep overshoot fully inside a deliberate matte.
    g.save();g.beginPath();g.rect(92,115,1740,310);g.clip();word(g,'MAKE',122,412,360,t+.28,0,C.ink,1640);g.restore();
    g.save();g.beginPath();g.rect(100,430,580,200);g.clip();word(g,'IT',130,617,215,t+.28,.45,C.ink,440);g.restore();
    g.save();g.beginPath();g.rect(90,635,1760,365);g.clip();word(g,'MOVE',110,971,390,t+.28,.88,C.ink,1690);g.restore();
    let a=pop(t,1.35,.8);let bx=mix(1750,1110,out((t-1.3)/.85)),by=520-130*Math.sin(clamp((t-1.3)/.85)*Math.PI);let rr=105*a;
    disc(g,bx,by,rr,C.blue);arc(g,bx,by,rr*.58,t*2,t*2+4.8,13,C.lime);
    // v1.1: the direction grows from its stem; the final arrow geometry is unchanged.
    if(t>2.2){let k=out((t-2.2)/.45),stem=out((t-2.2)/.38),head=out((t-2.4)/.22);line(g,[[1320,520],[mix(1320,1745,stem),520]],13,C.ink);if(head>0)line(g,[[mix(1745,1680,head),mix(520,465,head)],[1745,520],[mix(1745,1680,head),mix(520,575,head)]],13,C.ink);g.save();g.globalAlpha=k;zh(g,'让想象动起来',1400,605,27,C.ink,'center');g.restore()}
    g.restore();if(t>3.75)band(g,0,0,W,H*io((t-3.75)/.25),()=>mechanism(g,t-4));
  }
  // 06 — a four-part mechanical flower; scale and quarter turns have physical momentum.
  function mechanism(g,t){
    background(g,C.ink);tag(g,t,'FIND A NEW FORM',C.paper,6);
    const beatTime=Math.max(0,t),step=Math.floor(beatTime*2),phase=(beatTime*2)%1,spin=(step+io((phase-.08)/.76))*Math.PI/2;
    const centers=[[620,350],[1300,350],[620,750],[1300,750]];
    const collapse=io((t-2.9)/1.1);
    g.save();g.translate(960,540);g.rotate(-.07*Math.sin(t*.7));g.translate(-960,-540);
    for(let i=0;i<4;i++){
      let [x,y]=centers[i];x=mix(x,960,collapse);y=mix(y,540,collapse);
      let e=pop(t+.20,i*.08,.6),s=340*e*(1-collapse*.25);g.save();g.translate(x,y);g.rotate(spin*(i%2?1:-1)+i*Math.PI/2);
      let col=[C.lime,C.paper,C.blue,C.lime][i];
      for(let j=0;j<4;j++){
        g.save();g.rotate(j*Math.PI/2);let sep=20+38*Math.sin(t*3+i);g.translate(sep,sep);g.fillStyle=col;g.beginPath();g.moveTo(0,0);g.lineTo(s*.5,0);g.arc(0,0,s*.5,0,Math.PI/2);g.closePath();g.fill();g.restore();
      }
      disc(g,0,0,54,C.ink);disc(g,0,0,17,col);g.restore();
    }
    g.restore();if(t>3.65)iris(g,960,540,1300*io((t-3.65)/.35),()=>converge(g,t-4));
  }
  // 07 — many paths converge into the exact point that will become the brand mark.
  function converge(g,t){
    background(g,C.blue);tag(g,t,'BRING IT ALL TOGETHER',C.paper,7);
    let open=out((t+.35)/.6),shrink=io((t-2.1)/1.2),rotation=t*.55+shrink*1.4;
    g.save();g.translate(960,540);g.rotate(rotation);g.scale(open,open);
    for(let j=12;j>=0;j--){
      let r=(115+j*58)*(1-shrink)+42*shrink;let a=t*.45+j*.19;let len=TAU*(.5+.14*Math.sin(j+t));
      arc(g,0,0,r,a,a+len,Math.max(3,20*(1-shrink)),j%3===0?C.paper:C.lime);
      let bx=Math.cos(a+len)*r,by=Math.sin(a+len)*r;disc(g,bx,by,9*(1-shrink)+3,j%3===0?C.paper:C.lime);
    }
    disc(g,0,0,27+12*Math.sin(t*4),C.lime);g.restore();
    if(t>3.12){let q=io((t-3.12)/.88);disc(g,960,540,1250*q,C.paper)}
    // v1.1: retain the brand mark through the paper iris and across the scene cut.
    if(t>3.45){g.save();g.globalAlpha=out((t-3.45)/.35);ringMark(g,960,540,58,.95,C.blue);g.restore()}
  }
  function finale(g,t){
    background(g,C.paper);tag(g,t,'AN ORIGINAL MOTION STUDY',C.ink,8);
    let a=out(t/.7);ringMark(g,960,mix(540,246,a),mix(58,100,a),.15+(.8*(1-a)),C.blue);
    g.save();g.beginPath();g.rect(100,375,1720,255);g.clip();zh(g,'一念成形',960,590+250*(1-pop(t,.14,.8)),215,C.ink,'center');g.restore();
    g.save();g.globalAlpha=out((t-.65)/.6);text(g,'MAKE IT MOVE.',960,744,82,C.ink,'center');g.restore();
    g.save();g.globalAlpha=out((t-1.1)/.6);zh(g,'从一个点，到无限可能。',960,841,34,C.ink,'center');g.restore();
    rect(g,128,970,1664,2,C.ink);text(g,'DESIGN IN MOTION',128,1015,20,C.ink);text(g,'32 SECONDS / ONE IDEA',1792,1015,20,C.ink,'right');
  }
  const scenes=[seed,flow,grid,orbit,type,mechanism,converge,finale];
  function draw(g,time){let t=clamp(time,0,31.99999);let i=Math.floor(t/4);g.save();g.setTransform(1,0,0,1,0,0);g.globalAlpha=1;g.globalCompositeOperation='source-over';scenes[i](g,t-i*4);grain(g,t);g.restore()}
  const api={draw,width:W,height:H,duration:32,fps:60,palette:C};
  if(typeof module!=='undefined')module.exports=api;else scope.MGFilm=api;
})(typeof window!=='undefined'?window:globalThis);
