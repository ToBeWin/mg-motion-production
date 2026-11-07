/** Pure local state machines. No API or product claims are made. */
export function parseSample(csv){
 const lines=csv.trim().split(/\r?\n/); if(lines.shift()!=='name,value')throw new Error('需要 name,value 两列');
 const rows=lines.map(line=>{const [name,value,...rest]=line.split(',');if(!name||rest.length||!Number.isFinite(Number(value))||value.trim()==='')throw new Error('数据格式错误');return{name,value:Number(value)};});
 if(!rows.length)throw new Error('没有数据');return rows;
}
export function onboarding(state,event){
 switch(event.type){
 case 'IMPORT':try{return{step:'review',rows:parseSample(event.csv),scope:'private',error:null};}catch(e){return{...state,error:e.message};}
 case 'CONNECT':if(state.step!=='review')return state;return{...state,step:'scope'};
 case 'CREATE':if(state.step!=='scope'||state.scope!=='private')return state;return{...state,step:'done',workspace:{name:'First workspace',scope:'private',rows:state.rows}};
 case 'RESET':return{step:'choose',rows:[],scope:'private',error:null};
 default:return state;
 }
}
export const initialFeedback=Object.freeze({status:'idle',request:0});
export function feedback(state,event){
 if(event.type==='START'&&['idle','error','cancelled','success'].includes(state.status))return{status:'loading',request:state.request+1};
 if(event.type==='CANCEL'&&state.status==='loading')return{status:'cancelled',request:state.request};
 if(['SUCCESS','ERROR'].includes(event.type)&&state.status==='loading'&&event.request===state.request)return{...state,status:event.type.toLowerCase()};
 if(event.type==='RESET')return{status:'idle',request:state.request+1};return state;
}
