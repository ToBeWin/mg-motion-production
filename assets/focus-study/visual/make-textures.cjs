const {createCanvas,GlobalFonts}=require('@napi-rs/canvas');
const fs=require('fs'),path=require('path');
GlobalFonts.registerFromPath(process.env.MG_LATIN_FONT || '/System/Library/Fonts/HelveticaNeue.ttc');
GlobalFonts.registerFromPath(process.env.MG_CJK_FONT || '/System/Library/Fonts/Hiragino Sans GB.ttc');
const dir=path.join(__dirname,'../blender/textures');fs.mkdirSync(dir,{recursive:true});
const C={paper:'#fbfcfa',ink:'#172721',muted:'#7a8880',accent:'#077f69',line:'#dbe5df',tint:'#e0eee4'};
function text(g,s,x,y,size,col=C.ink,weight=400,align='left'){
 g.font=`${weight} ${size}px "Helvetica Neue","PingFang SC","Hiragino Sans GB",sans-serif`;
 g.fillStyle=col;g.textAlign=align;g.textBaseline='alphabetic';g.fillText(s,x,y);
}
function box(g,x,y,w,h,col,r=0){g.fillStyle=col;g.beginPath();g.roundRect(x,y,w,h,r);g.fill()}
function rule(g,y){box(g,86,y,1228,2,C.line)}
function badge(g,label,x,y){box(g,x,y,77,49,C.tint,12);text(g,label,x+38.5,y+34,25,C.accent,500,'center')}
function make(kind){
 const c=createCanvas(1400,1000),g=c.getContext('2d');box(g,0,0,1400,1000,C.paper);
 text(g,kind==='answer'?'FOCUS / BRIEF':'FOCUS / SOURCE',86,89,26,C.accent,500);text(g,kind==='answer'?'可追溯的研究简报':'工作资料 · 演示内容',1314,89,24,C.muted,400,'right');rule(g,127);
 if(kind==='answer'){
  text(g,'这次发布，值得关注什么？',86,230,55,C.ink,500);
  text(g,'三个重点，一份有依据的答案。',86,290,30,C.muted);
  const rows=[['01','信息放在同一处','文档、访谈和计划，在一个工作空间整理。','1'],['02','每个结论，都有来处','保留引用，随时返回原始材料查看上下文。','1  2'],['03','从理解，走向下一步','把研究整理成清晰、可继续编辑的简报。','3']];
  rows.forEach(([num,h,body,cite],i)=>{let y=390+i*155;text(g,num,86,y+8,26,C.accent,500);text(g,h,170,y,39,C.ink,500);text(g,body,170,y+54,28,C.muted);badge(g,cite,1226,y-32);if(i<2)box(g,170,y+94,1140,1,C.line)});
  rule(g,880);text(g,'3 个来源已关联',86,944,25,C.accent,500);text(g,'继续编辑  ↗',1314,944,26,C.ink,400,'right');
 }else{
  const data={brief:['产品简报','PRODUCT BRIEF','01','让信息，在同一处工作。','从多个资料中发现关联，','把关键内容整理成清晰的研究简报。','产品目标 / 统一的信息工作空间'],interview:['用户访谈','CUSTOMER NOTES','02','“我希望知道，这句话从哪里来。”','读到结论时，可以回到来源，','继续理解它所在的上下文。','访谈摘录 / 可追溯性'],plan:['发布计划','LAUNCH PLAN','03','从整理，到下一步。','把研究转成可以继续编辑的输出，','让团队围绕同一份简报推进。','交付内容 / 研究简报']}[kind];
  text(g,data[0],86,245,74,C.ink,500);text(g,data[1],86,312,28,C.muted);text(g,data[2],1314,254,104,C.tint,300,'right');
  box(g,86,401,1228,92,'#e3eee7',12);box(g,86,401,5,92,C.accent,2);text(g,data[3],118,463,38,C.ink,500);
  text(g,data[4],86,589,34,C.ink);text(g,data[5],86,650,34,C.ink);
  for(let i=0;i<3;i++)box(g,86,727+i*34,[1080,1185,720][i],6,'#e4e9e5',3);
  rule(g,880);text(g,data[6],86,944,24,C.muted);text(g,'Y / RESEARCH',1314,944,22,C.accent,500,'right');
 }
 fs.writeFileSync(path.join(dir,kind+'.png'),c.toBuffer('image/png'));
}
for(const kind of ['brief','interview','plan','answer'])make(kind);
console.log(dir);
