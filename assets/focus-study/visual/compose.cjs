// Original editorial overlays over an editable Blender scene; absolute time only.
const{createCanvas,loadImage,GlobalFonts}=require('@napi-rs/canvas');
const{spawn}=require('child_process');const{once}=require('events');const fs=require('fs'),path=require('path');
GlobalFonts.registerFromPath(process.env.MG_LATIN_FONT || '/System/Library/Fonts/HelveticaNeue.ttc');GlobalFonts.registerFromPath(process.env.MG_CJK_FONT || '/System/Library/Fonts/Hiragino Sans GB.ttc');
const plan=JSON.parse(fs.readFileSync(path.join(__dirname,'../production-plan.json'))),M=plan.markers;
const W=1920,H=1080,FPS=plan.fps,DURATION=plan.duration,B=path.join(__dirname,'../blender');
const points=JSON.parse(fs.readFileSync(path.join(B,'projection.json'))),c=createCanvas(W,H),g=c.getContext('2d');
const clamp=x=>Math.max(0,Math.min(1,x)),out=x=>1-(1-clamp(x))**4,smooth=x=>{x=clamp(x);return x*x*(3-2*x)},mix=(a,b,q)=>a+(b-a)*q;
const ink='#17372d',accent='#087f67';
function txt(s,x,y,size,col=ink,weight=400,align='left'){g.font=`${weight} ${size}px "Helvetica Neue","PingFang SC","Hiragino Sans GB",sans-serif`;g.fillStyle=col;g.textAlign=align;g.textBaseline='alphabetic';g.fillText(s,x,y)}
function rect(x,y,w,h,color,r=0){g.fillStyle=color;g.beginPath();g.roundRect(x,y,w,h,r);g.fill()}
function disc(x,y,r,color){g.fillStyle=color;g.beginPath();g.arc(x,y,r,0,Math.PI*2);g.fill()}
function cursor(x,y,press){g.save();g.translate(x,y);g.scale(1-.12*press,1-.12*press);g.beginPath();g.moveTo(0,0);g.lineTo(0,39);g.lineTo(10,30);g.lineTo(18,46);g.lineTo(25,42);g.lineTo(17,27);g.lineTo(31,26);g.closePath();g.fillStyle='white';g.strokeStyle=ink;g.lineWidth=2;g.shadowBlur=6;g.shadowColor='#0003';g.fill();g.stroke();g.restore()}
function mark(x,y,size){g.save();g.translate(x,y);g.rotate(-.18);for(let i=0;i<3;i++){g.save();g.rotate(i*Math.PI*2/3);rect(-size*.15,-size*.62,size*.30,size*.68,accent,size*.15);g.restore()}disc(0,0,size*.13,'#e8eee8');g.restore()}
function overlays(t){
 const p=points[Math.min(419,Math.max(0,Math.floor(t*30)))];
 if(t<14){g.save();g.globalAlpha=.76*(1-smooth((t-12.6)/.8));mark(93,77,19);txt('一念 Focus',126,89,28,ink,500);txt('AI RESEARCH WORKSPACE',1828,86,18,ink,400,'right');g.restore()}
 if(t<4){let a=out((t-M.title)/1.0),leave=smooth((t-2.4)/1.0);g.save();g.globalAlpha=a*(1-leave);txt('从纷繁，找到重点。',960,177+20*(1-a)-24*leave,82,ink,500,'center');g.restore()}
 if(t<5.1){let a=out((t-M.prompt)/.7)*(1-smooth((t-4.1)/.65));g.save();g.globalAlpha=a;g.shadowColor='#17372d14';g.shadowBlur=24;g.shadowOffsetY=10;rect(450,925,1020,94,'#fafcf9',24);g.shadowColor='transparent';txt('整理这次发布的关键信息，并保留来源。',495,983,31,ink);disc(1418,972,27,accent);txt('↑',1418,983,32,'#fff',500,'center');g.restore()}
 // Same source documents remain visible; trajectories land on the corresponding answer rows.
 for(let i=0;i<3;i++){
  const q=out((t-(M.link+i*.43))/.65),fade=1-smooth((t-10.15)/.5);if(q<=0||fade<=0)continue;
  const a=p['source'+i],b=p['answer'+i],dx=b[0]-a[0];g.save();g.globalAlpha=fade;g.lineWidth=2;g.strokeStyle='#10896c70';g.setLineDash([6,7]);g.lineDashOffset=-t*15;
  g.beginPath();g.moveTo(...a);g.bezierCurveTo(a[0]+dx*.5,a[1],b[0]-dx*.5,b[1],...b);g.stroke();g.setLineDash([]);
  const x=mix(a[0],b[0],q),y=mix(a[1],b[1],smooth(q));g.shadowColor='#6ee4ba';g.shadowBlur=16;disc(x,y,5,accent);g.shadowBlur=0;disc(b[0],b[1],4,'#fbfcfa');g.strokeStyle=accent;g.beginPath();g.arc(b[0],b[1],5,0,Math.PI*2);g.stroke();g.restore();
 }
 if(t>M.read&&t<9.9){let a=out((t-M.read)/.6)*(1-smooth((t-9.2)/.5));g.save();g.globalAlpha=a;txt('线索相连。答案成形。',960,1020,34,ink,400,'center');g.restore()}
 if(t>M.pointer&&t<12.7){let a=out((t-M.pointer)/.6),f=1-smooth((t-12.2)/.4),xy=p.cite;g.save();g.globalAlpha=f;let x=mix(1760,xy[0],a),y=mix(940,xy[1]+8,a);cursor(x,y,Math.sin(Math.PI*clamp((t-M.click)/.22)));
  if(t>M.citation){let e=out((t-M.citation)/.48);g.globalAlpha=e*f;g.shadowColor='#17372d28';g.shadowBlur=35;g.shadowOffsetY=18;rect(1140,548+(1-e)*16,610,252,'#fdfefd',25);g.shadowColor='transparent';rect(1140,573,4,50,accent,2);txt('来源 01 · 产品简报',1180,604,25,accent,500);txt('“让信息，在同一处工作。”',1180,673,32,ink,500);txt('返回原文，继续理解上下文。',1180,722,25,'#74827b');txt('打开原文 ↗',1705,766,22,accent,400,'right')}
  g.restore();
 }
 if(t>M.brand){let a=out((t-M.brand)/1.2);g.save();g.globalAlpha=a;mark(960,370,60*a);g.beginPath();g.rect(70,445,1780,150);g.clip();txt('每个结论，都有来处。',960,568+(1-a)*150,91,ink,500,'center');g.restore();
  let b=out((t-M.name)/.8);g.save();g.globalAlpha=b;txt('一念 Focus',960,690,45,ink,500,'center');txt('AI 研究工作台 · 概念演示',960,756,26,'#738179',400,'center');g.restore();
 }
}
async function frame(t){const n=Math.min(420,Math.max(1,Math.floor(t*30)+1));const image=await loadImage(path.join(B,'frames',String(n).padStart(4,'0')+'.png'));g.setTransform(1,0,0,1,0,0);g.globalAlpha=1;g.drawImage(image,0,0,W,H);overlays(t)}
(async()=>{
 const mode=process.argv[2]||'stills';if(mode==='stills'){const ts=process.argv.slice(3).map(Number);const d=path.join(__dirname,'../../qa');fs.mkdirSync(d,{recursive:true});for(const t of ts){await frame(t);fs.writeFileSync(path.join(d,`focus-${t.toFixed(3)}.png`),c.toBuffer('image/png'))}return}
 const dest=process.argv[3]||path.join(__dirname,'../../focus-silent.mp4');const ff=spawn('ffmpeg',['-y','-v','error','-f','rawvideo','-pix_fmt','rgba','-s',`${W}x${H}`,'-r',String(FPS),'-i','pipe:0','-an','-c:v','libx264','-crf','16','-preset','fast','-pix_fmt','yuv420p','-movflags','+faststart','-color_primaries','bt709','-color_trc','bt709','-colorspace','bt709',dest]);ff.stderr.pipe(process.stderr);const done=once(ff,'close');
 for(let i=0;i<DURATION*FPS;i++){await frame(i/FPS);const data=g.getImageData(0,0,W,H).data;if(!ff.stdin.write(Buffer.from(data.buffer)))await once(ff.stdin,'drain');if(i%90===0)console.log(i,'/',DURATION*FPS)}ff.stdin.end();const[code]=await done;if(code)throw Error('ffmpeg '+code);console.log('DONE',dest);
})().catch(e=>{console.error(e);process.exit(1)});
