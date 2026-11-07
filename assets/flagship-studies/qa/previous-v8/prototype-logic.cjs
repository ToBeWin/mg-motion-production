
const fs=require('fs');
const nodes={};
function create(tag){return {tag,children:[],textContent:'',hidden:false,value:'',events:{},append(...x){this.children.push(...x)},replaceChildren(...x){this.children=x},addEventListener(k,fn){this.events[k]=fn},focus(){this.focused=true}}}
const document={createElement:create,querySelector(k){return nodes[k]||(nodes[k]=create(k))}};
const blobs=[];class Blob{constructor(parts){this.parts=parts;blobs.push(this)}}
const URL={createObjectURL:()=> 'blob:logic-test'};
const api=new Function('document','Blob','URL',fs.readFileSync(process.argv[2],'utf8')+';return {DATA,retrieve,showSource}')(document,Blob,URL);
const expected=[['支持哪些文件？更新后怎样生效？',['release','sync']],['权限和访问',['access']],['Markdown',['release']],['重新同步',['sync']],['天气如何',[]]];
let assertions=0;const assert=(ok,msg)=>{if(!ok)throw Error(msg);assertions++};
for(const[q,ids]of expected)assert(JSON.stringify(api.retrieve(q).map(x=>x.id))===JSON.stringify(ids),'retrieval '+q);
for(const claim of api.DATA.claims){const source=api.DATA.documents.find(d=>d.id===claim.document_id);assert(JSON.stringify(claim.lines)===JSON.stringify(source.excerpt),'quote identity');}
nodes['#question']=create('textarea');nodes['#question'].value=expected[0][0];nodes['#query'].events.submit({preventDefault(){}});
assert(nodes['#answer'].hidden===false,'answer visible');
const quotes=nodes['#answer-content'].children.filter(x=>x.className==='quote');assert(quotes.length===2,'two citations');quotes[1].onclick();assert(nodes['#source'].children.some(x=>x.textContent==='同步与更新'),'citation two original source');
assert(JSON.parse(blobs.at(-1).parts[0]).answers.length===2,'download contains both sources');
nodes['#question'].value='天气如何';nodes['#query'].events.submit({preventDefault(){}});assert(nodes['#answer'].hidden===true,'no invented answer');nodes['#reset'].onclick();assert(nodes['#question'].focused,'reset focus');
console.log(JSON.stringify({assertions,scope:'Node logic harness only; not a browser interaction or visual test',passed:true}));
