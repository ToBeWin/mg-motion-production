import fs from 'node:fs';import {onboarding,feedback,initialFeedback} from './controller.mjs';
const csv='name,value\n探索,12\n构建,8\n分享,5';let s=onboarding({}, {type:'RESET'});const events=[{time:0,state:s}];
for(const [time,event] of [[2.3,{type:'IMPORT',csv}],[6.6,{type:'CONNECT'}],[13.8,{type:'CREATE'}]]){s=onboarding(s,event);events.push({time,event,state:s});}
let f={...initialFeedback};const feedbackEvents=[{time:.5,state:f}];
for(const [time,type] of [[2,'START'],[4.1,'ERROR'],[5.5,'START'],[7.2,'SUCCESS']]){f=feedback(f,{type,request:f.request});feedbackEvents.push({time,state:f});}
fs.writeFileSync(new URL('../data/runtime-capture.json',import.meta.url),JSON.stringify({csv,rows:s.rows,workspace:s.workspace,onboardingEvents:events,feedbackEvents},null,2));
fs.writeFileSync(new URL('../records/first-workspace.json',import.meta.url),JSON.stringify(s.workspace,null,2));
