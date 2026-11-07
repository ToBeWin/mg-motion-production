const ids=[], vars={}, allVariableIds=[];
const oldPage=figma.root.children.find(p=>p.name==='FOLD · 设计与运动');
if(oldPage)throw new Error('FOLD page already exists: inspect saved state before retry.');
const fonts=[{family:'Bricolage Grotesque',style:'Regular'},{family:'Bricolage Grotesque',style:'SemiBold'},{family:'Bricolage Grotesque',style:'96pt ExtraBold'},{family:'Noto Sans SC',style:'Regular'},{family:'Noto Sans SC',style:'Bold'}];
await Promise.all(fonts.map(f=>figma.loadFontAsync(f)));
const page=figma.createPage();page.name='FOLD · 设计与运动';ids.push(page.id);await figma.setCurrentPageAsync(page);
const foundation=await createVariableCollection('FOLD / Foundations',['Light']);
const collection=foundation.collection,mode=foundation.modeIds.Light;
function rgb(hex){return {r:parseInt(hex.slice(0,2),16)/255,g:parseInt(hex.slice(2,4),16)/255,b:parseInt(hex.slice(4,6),16)/255};}
for(const [key,hex] of Object.entries(D.colors)){
 const primitive=figma.variables.createVariable('primitive/'+key,collection,'COLOR');primitive.scopes=[];primitive.setValueForMode(mode,rgb(hex));primitive.setVariableCodeSyntax('WEB','var(--fold-raw-'+key+')');
 const variable=figma.variables.createVariable('color/'+key,collection,'COLOR');variable.scopes=['FRAME_FILL','SHAPE_FILL','TEXT_FILL','STROKE_COLOR'];variable.setValueForMode(mode,{type:'VARIABLE_ALIAS',id:primitive.id});variable.setVariableCodeSyntax('WEB','var(--fold-'+key+')');vars[key]=variable;allVariableIds.push(primitive.id,variable.id);
}
function paint(color){return color?[figma.variables.setBoundVariableForPaint({type:'SOLID',color:rgb(D.colors[color]||color)},'color',vars[color])]:[];}
function add(parent,node,name){parent.appendChild(node);node.name=name;ids.push(node.id);return node;}
function rect(parent,name,x,y,w,h,color,r=0){const n=add(parent,figma.createRectangle(),name);n.resize(w,h);n.x=x-w/2;n.y=y-h/2;n.fills=paint(color);n.cornerRadius=r;return n;}
function font(e){return e.font==='han'?(e.weight>=700?fonts[4]:fonts[3]):(e.weight>=800?fonts[2]:(e.weight>=600?fonts[1]:fonts[0]));}
const styles={};
function txt(parent,name,value,x,y,size,color='ink',family='display',weight=400,align='left'){
 const e={font:family,weight},f=font(e);const n=add(parent,figma.createText(),name);n.fontName=f;n.fontSize=size;n.characters=value;n.lineHeight={unit:'PERCENT',value:118};n.fills=paint(color);
 const key=f.family+'/'+f.style+'/'+size;
 if(!styles[key]){const s=figma.createTextStyle();s.name='FOLD/'+key;s.fontName=f;s.fontSize=size;s.lineHeight={unit:'PERCENT',value:118};styles[key]=s;}
 n.textStyleId=styles[key].id;n.x=x-(align==='center'?n.width/2:align==='right'?n.width:0);n.y=y-n.height/2;return n;
}
function dataPath(e){const v=e.vertices;let d='M '+v[0].join(' ');for(let k=1;k<v.length+(e.closed?1:0);k++){const a=(k-1)%v.length,b=k%v.length;d+=' C '+[v[a][0]+e.outTangents[a][0],v[a][1]+e.outTangents[a][1],v[b][0]+e.inTangents[b][0],v[b][1]+e.inTangents[b][1],...v[b]].join(' ');}return d+(e.closed?' Z':'');}
function draw(parent,e){
 if(e.type==='text')return txt(parent,e.name,e.text,e.x,e.y,e.size,e.color,e.font,e.weight,e.align);
 if(e.type==='rect')return rect(parent,e.name,e.x,e.y,e.w,e.h,e.color,e.r);
 if(e.type==='ellipse'){const n=add(parent,figma.createEllipse(),e.name);n.resize(e.w,e.h);n.x=e.x-e.w/2;n.y=e.y-e.h/2;n.fills=paint(e.color);return n;}
 const n=add(parent,figma.createVector(),e.name);n.vectorPaths=[{windingRule:'NONZERO',data:dataPath(e)}];const first=n.vectorPaths[0].data.match(/M\s*([-+\d.eE]+)[, ]+([-+\d.eE]+)/);if(first){n.x=e.vertices[0][0]-Number(first[1]);n.y=e.vertices[0][1]-Number(first[2]);}n.fills=paint(e.color);n.strokes=[];if(e.stroke){n.strokes=paint(e.stroke);n.strokeWeight=e.sw;n.strokeCap='ROUND';n.strokeJoin='ROUND';}return n;
}
function group(parent,name,w,h,x,y){const f=add(parent,figma.createFrame(),name);f.resize(w,h);f.x=x;f.y=y;f.fills=[];f.clipsContent=true;return f;}
function artwork(parent,kind,x,y,scale){const s=D.artworks[kind],f=group(parent,'晴野 / '+kind,s.w,s.h,x,y);s.elements.forEach(e=>draw(f,e));f.rescale(scale);return f;}
function instance(parent,component,x,y){const n=add(parent,component.createInstance(),component.name+' / instance');n.x=x;n.y=y;return n;}
const library=group(page,'FOLD / Master components',1900,760,180,1450);library.clipsContent=false;
// Content relationships use auto layout; geometry inside each icon remains explicit.
const prompt=add(library,figma.createComponent(),'FOLD / Prompt');prompt.description='A creative brief that expands into named idea chips; film states preserve the same content.';prompt.layoutMode='HORIZONTAL';prompt.resize(1120,168);prompt.primaryAxisSizingMode='FIXED';prompt.counterAxisSizingMode='FIXED';prompt.counterAxisAlignItems='CENTER';prompt.paddingLeft=38;prompt.paddingRight=38;prompt.itemSpacing=30;prompt.cornerRadius=28;prompt.fills=paint('surface');
const copy=add(prompt,figma.createAutoLayout('VERTICAL'),'Prompt copy');copy.fills=[];copy.itemSpacing=20;copy.resize(932,90);copy.layoutSizingHorizontal='FIXED';copy.layoutSizingVertical='HUG';
txt(copy,'Prompt eyebrow','从一句想法开始',0,0,18,'muted','han');txt(copy,'Prompt content','为周末的公园音乐会，设计一套活动视觉。',0,0,33,'ink','han');
const submit=group(prompt,'Submit',82,82,0,0);submit.cornerRadius=41;submit.fills=paint('ink');draw(submit,{type:'path',name:'Submit arrow',vertices:[[25,41],[56,41],[42,27],[56,41],[42,55]],inTangents:Array(5).fill([0,0]),outTangents:Array(5).fill([0,0]),closed:false,color:null,stroke:'surface',sw:3});
const colors=add(library,figma.createComponent(),'FOLD / Color ribbon');colors.description='Contextual theme control. Choosing citrus changes the same artwork, its inspector and export assets.';colors.layoutMode='HORIZONTAL';colors.resize(540,108);colors.primaryAxisSizingMode='FIXED';colors.counterAxisSizingMode='FIXED';colors.counterAxisAlignItems='CENTER';colors.paddingLeft=30;colors.paddingRight=30;colors.itemSpacing=32;colors.cornerRadius=54;colors.fills=paint('surface');colors.y=240;
const label=txt(colors,'Color caption','主题',0,0,22,'muted','han');label.resize(52,label.height);
for(const key of ['lilac','orange','citrus','gold','ink']){const sw=add(colors,figma.createEllipse(),'Swatch '+key);sw.resize(52,52);sw.fills=paint(key);}
const toolMaster=add(library,figma.createComponent(),'FOLD / Tool rail');toolMaster.description='Six original vector tools with shared stroke and active state.';toolMaster.resize(80,488);toolMaster.x=1250;toolMaster.y=0;toolMaster.fills=[];D.components.tools.elements.forEach(e=>draw(toolMaster,e));
const inspector=add(library,figma.createComponent(),'FOLD / Inspector');inspector.description='Theme, typography and an editable motion curve describe one visual system.';inspector.resize(228,584);inspector.x=1440;inspector.y=0;inspector.fills=[];D.components.inspector.elements.forEach(e=>draw(inspector,e));
const hero=group(page,'FOLD / 01 · Creative workspace',1920,1080,180,180);hero.fills=paint('paper');
const app=group(hero,'Product window',1760,900,80,78);app.cornerRadius=24;app.fills=paint('surface');app.effects=[{type:'DROP_SHADOW',color:{...rgb(D.colors.ink),a:.12},offset:{x:0,y:18},radius:48,spread:0,visible:true,blendMode:'NORMAL'}];
const shell=add(app,figma.createAutoLayout('VERTICAL'),'Workspace structure');shell.resize(1760,900);shell.primaryAxisSizingMode='FIXED';shell.counterAxisSizingMode='FIXED';shell.itemSpacing=0;shell.fills=[];
const header=group(shell,'Product header',1760,90,0,0);D.logo.forEach(e=>{const q=JSON.parse(JSON.stringify(e));q.vertices=q.vertices.map(v=>[v[0]*.65+28,v[1]*.65+22]);draw(header,q);});txt(header,'Brand','FOLD',79,46,31,'ink','display',800);txt(header,'Project','晴野 / 周末计划',268,46,20,'muted','han');rect(header,'Design tab',844,45,84,39,'soft',19);txt(header,'Tab / design','设计',844,45,19,'ink','han',700,'center');txt(header,'Tab / motion','动效',946,45,19,'muted','han',400,'center');txt(header,'Tab / outputs','输出',1048,45,19,'muted','han',400,'center');rect(header,'Export button',1656,45,130,46,'ink',23);txt(header,'Export label','导出作品',1656,45,18,'surface','han',700,'center');rect(header,'Divider',880,89,1760,1,'line');
const body=add(shell,figma.createAutoLayout('HORIZONTAL'),'Workspace zones');body.resize(1760,810);body.primaryAxisSizingMode='FIXED';body.counterAxisSizingMode='FIXED';body.itemSpacing=0;body.fills=[];
const rail=group(body,'Tools zone',86,810,0,0);instance(rail,toolMaster,3,45);rect(rail,'Rail rule',85,405,1,810,'line');
const canvas=group(body,'Canvas zone',1380,810,0,0);canvas.fills=paint('paper');const poster=artwork(canvas,'portrait',375,33,.94);poster.effects=[{type:'DROP_SHADOW',color:{...rgb(D.colors.ink),a:.13},offset:{x:0,y:15},radius:25,spread:0,visible:true,blendMode:'NORMAL'}];txt(canvas,'Canvas register','画板 01 / 主视觉',44,34,14,'muted','han');txt(canvas,'Canvas zoom','65%     600 × 760',1140,776,15,'muted');
const side=group(body,'Inspector zone',294,810,0,0);rect(side,'Inspector rule',0,405,1,810,'line');instance(side,inspector,32,28);
const showcase=group(page,'FOLD / 02 · Designed components',1920,1080,2300,180);showcase.fills=paint('paper');txt(showcase,'Heading','每个组件，都为变化而设计。',96,116,52,'ink','han',700);instance(showcase,prompt,96,238);instance(showcase,colors,96,482);instance(showcase,toolMaster,1435,260);instance(showcase,inspector,1580,260);txt(showcase,'Footer','PROMPT → PALETTE → MOTION → OUTPUT',96,927,23,'muted','display',600);
const output=group(page,'FOLD / 03 · Campaign output',1920,1080,4420,180);output.fills=paint('paper');txt(output,'Heading','同一个想法。不同的展开。',96,110,52,'ink','han',700);artwork(output,'portrait',98,218,.83);artwork(output,'wide',692,218,.88);artwork(output,'ticket',692,786,.84);txt(output,'Output note','三种比例，一套语言。',98,960,25,'ink','han',700);
figma.viewport.scrollAndZoomIntoView([hero]);
return {createdNodeIds:ids,collectionId:collection.id,variableIds:allVariableIds,styleIds:Object.values(styles).map(s=>s.id),pageId:page.id,frames:{hero:hero.id,components:showcase.id,outputs:output.id},components:{prompt:prompt.id,colors:colors.id,tools:toolMaster.id,inspector:inspector.id},counts:{nodes:ids.length,variables:Object.keys(vars).length*2,textStyles:Object.keys(styles).length},bounds:[hero,showcase,output].map(f=>({id:f.id,x:f.x,y:f.y,width:f.width,height:f.height}))};
