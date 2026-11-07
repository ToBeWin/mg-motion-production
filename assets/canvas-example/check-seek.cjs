const {createCanvas,GlobalFonts}=require('@napi-rs/canvas');
const fs=require('node:fs'),crypto=require('node:crypto');
for(const [p,f] of [[process.env.MG_LATIN_FONT||'/System/Library/Fonts/Supplemental/Arial Black.ttf','MG Sans'],[process.env.MG_CJK_FONT||'/System/Library/Fonts/Hiragino Sans GB.ttc','MG Chinese']]){
  if(!fs.existsSync(p))throw Error(`Font missing: ${p}`);GlobalFonts.registerFromPath(p,f);
}
const film=require('./film.js'),c=createCanvas(film.width,film.height),g=c.getContext('2d');
const input=process.argv.slice(2).map(Number);
const times=input.length?input:[0,.5,3.8,4,7.8,8,11.8,12,15.6,15.9,16.2,17.7,18,19.9,20,23.8,24,27.8,28,30,31.98];
const hash=t=>{film.draw(g,t);const data=g.getImageData(0,0,film.width,film.height).data;return crypto.createHash('sha256').update(data).digest('hex')};
const forward=new Map(times.map(t=>[t,hash(t)]));
for(const t of [...times].reverse())if(hash(t)!==forward.get(t))throw Error(`Frame changed after reverse seek at ${t}s`);
for(const t of times)if(hash(t)!==forward.get(t))throw Error(`Frame changed after repeat at ${t}s`);
console.log(JSON.stringify({seek_deterministic:true,checked_times:times,meaning:'Pixel identity across render orders; not an aesthetic review.'},null,2));
