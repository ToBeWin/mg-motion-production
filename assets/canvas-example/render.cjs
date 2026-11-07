const {createCanvas,GlobalFonts}=require('@napi-rs/canvas');
const {spawn}=require('node:child_process');
const {once}=require('node:events');
const fs=require('node:fs'),path=require('node:path');
for(const [p,f] of [[process.env.MG_LATIN_FONT||'/System/Library/Fonts/Supplemental/Arial Black.ttf','MG Sans'],[process.env.MG_CJK_FONT||'/System/Library/Fonts/Hiragino Sans GB.ttc','MG Chinese']]){
  if(!fs.existsSync(p))throw Error(`Font missing: ${p}. Set MG_LATIN_FONT / MG_CJK_FONT, then inspect font output.`);
  GlobalFonts.registerFromPath(p,f);
}
const film=require('./film.js'),mode=process.argv[2]||'stills';
if(!['stills','video'].includes(mode))throw Error('Usage: node render.cjs stills [seconds...] | video [destination.mp4]');
const canvas=createCanvas(film.width,film.height),g=canvas.getContext('2d');
const qa=path.join(__dirname,'../qa');fs.mkdirSync(qa,{recursive:true});
if(mode==='stills'){
  const times=process.argv.slice(3).length?process.argv.slice(3).map(Number):[.5,3.8,4,7.8,8,12,16,20,24,28,30];
  for(const t of times){
    if(!Number.isFinite(t)||t<0||t>=film.duration)throw Error(`Invalid frame time ${t}`);
    film.draw(g,t);const p=path.join(qa,`frame_${t.toFixed(4)}.png`);fs.writeFileSync(p,canvas.toBuffer('image/png'));console.log(p);
  }
}else{
  const dest=path.resolve(process.argv[3]||path.join(__dirname,'../silent.mp4'));
  const fps=Number(process.env.FPS||film.fps),samples=Number(process.env.SAMPLES||3);
  const start=Number(process.env.START||0),duration=Number(process.env.DURATION||film.duration-start);
  if(!Number.isFinite(fps)||fps<=0||!Number.isInteger(samples)||samples<1||samples>32||!Number.isFinite(start)||start<0||!Number.isFinite(duration)||duration<=0||start+duration>film.duration+1e-6)throw Error('Invalid FPS/SAMPLES/START/DURATION');
  fs.mkdirSync(path.dirname(dest),{recursive:true});
  const sample=createCanvas(film.width,film.height),sg=sample.getContext('2d');
  const ff=spawn('ffmpeg',['-y','-hide_banner','-loglevel','warning','-f','rawvideo','-pix_fmt','rgba','-s',`${film.width}x${film.height}`,'-r',`${fps}`,'-i','pipe:0','-an','-c:v','libx264','-preset','fast','-crf','17','-pix_fmt','yuv420p','-movflags','+faststart','-color_primaries','bt709','-color_trc','bt709','-colorspace','bt709',dest],{stdio:['pipe','inherit','inherit']});
  let failure=null;ff.on('error',e=>failure=e);ff.stdin.on('error',e=>failure=e);
  const finished=new Promise(resolve=>ff.once('close',code=>resolve(code)));
  (async()=>{
    const began=Date.now(),total=Math.round(duration*fps);
    for(let i=0;i<total;i++){
      if(failure)throw failure;
      for(let s=0;s<samples;s++){
        const t=start+i/fps+((s+.5)/samples-.5)*(.5/fps);
        film.draw(sg,t);g.globalAlpha=1/(s+1);g.drawImage(sample,0,0);
      }
      g.globalAlpha=1;const pixels=g.getImageData(0,0,film.width,film.height).data;
      if(!ff.stdin.write(Buffer.from(pixels.buffer,pixels.byteOffset,pixels.byteLength)))await once(ff.stdin,'drain');
      if(i%120===0)console.log(`${i}/${total} frames · ${((Date.now()-began)/1000).toFixed(1)} s`);
    }
    ff.stdin.end();const code=await finished;if(code!==0)throw failure||Error(`ffmpeg ${code}`);console.log('DONE '+dest);
  })().catch(e=>{console.error(e);ff.kill();process.exitCode=1});
}
