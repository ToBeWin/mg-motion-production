/* Continuous graphic narration. Source objects, quotes and focus brackets persist. */
(function(){
var M=MuseNative,r=M.rgb,D=16,c=U.comp('TRACE / Motion narrative',1920,1080,D,false);
var ink=r('303B55'),blue=r('5862C7'),soft=r('E7E9FA'),muted=r('79839A'),white=r('FFFFFF'),edge=r('D9DDEB');
F.base(c,r('F5F5F0'));
M.gradient(c,'Quiet light field',[1920,1080],[950,430],[2100,1200],0,D,r('FDFDFB'),r('ECEEF7'),true);
// Every segment is sampled at the delivery frame rate. Holds have no drift.
function ease(x,kind){if(kind==='out')return 1-Math.pow(1-x,4);if(kind==='in')return x*x*x;return x*x*x*(x*(x*6-15)+10);}
function mix(a,b,x){if(typeof a==='number')return a+(b-a)*x;var q=[];for(var i=0;i<a.length;i++)q.push(mix(a[i],b[i],x));return q;}
function animate(p,knots){var ts=[],vs=[];for(var i=0;i<knots.length-1;i++){var a=knots[i],b=knots[i+1],fa=Math.round(a[0]*30),fb=Math.round(b[0]*30);for(var f=fa;f<fb;f++){ts.push(f/30);vs.push(mix(a[1],b[1],ease((f-fa)/(fb-fa),b[2])));}}ts.push(knots[knots.length-1][0]);vs.push(knots[knots.length-1][1]);p.setValuesAtTimes(ts,vs);for(var k=1;k<=p.numKeys;k++){p.setInterpolationTypeAtKey(k,KeyframeInterpolationType.LINEAR,KeyframeInterpolationType.LINEAR);if(p.isSpatial){var z=p.propertyValueType===PropertyValueType.ThreeD_SPATIAL?[0,0,0]:[0,0];p.setSpatialAutoBezierAtKey(k,false);p.setSpatialContinuousAtKey(k,false);p.setSpatialTangentsAtKey(k,z,z);}}return p;}
function pos(l,k){animate(M.pos(l),k);return l;}function scale(l,k){var q=[];for(var i=0;i<k.length;i++)q.push([k[i][0],[k[i][1],k[i][1]],k[i][2]]);animate(M.scale(l),q);return l;}
function alpha(l,k){animate(M.opacity(l),k);return l;}function rot(l,k){animate(M.rotation(l),k);return l;}
function rect(n,w,h,col,x,y,a,b,rad){return U.rect(c,n,w,h,col,x,y,rad===undefined?18:rad,a,b);}
function tx(co,n,s,sz,col,x,y,a,b,left,font){return U.text(co,n,s,sz,col,x,y,font||'HiraginoSansGB-W3',a,b,!left);}
function shadow(l){N.fx(l,'Drop Shadow',{'Shadow Color':r('6D7894'),'Opacity':17,'Distance':12,'Softness':44,'Direction':135});}
function layer(src,name,x,y,s,a,b){return U.add(c,src,name,x,y,s,a,b);}
var logo=tx(c,'Small identity','TRACE',27,blue,92,88,0,12.6,true,'HelveticaNeue-Bold');
tx(c,'Product category','KNOWLEDGE / IN MOTION',17,muted,1660,88,0,12.6,false,'HelveticaNeue-Medium');

// One question bar changes size and joins the answer, instead of cutting to a new slide.
var query=rect('Persistent question surface',1240,172,white,960,510,0,12.6,30);shadow(query);
animate(M.shapeSize(query),[[0,[1240,172]],[1.55,[1240,172]],[2.3,[760,76]],[4.9,[760,76]],[6,[1180,62]],[9.1,[1180,62]],[10.2,[790.6,41.54]],[12.25,[790.6,41.54]],[12.6,[300,14]]]);
pos(query,[[0,[960,510]],[1.55,[960,510]],[2.3,[960,166]],[4.9,[960,166]],[6,[960,310]],[9.1,[960,310]],[10.2,[520,339.2]],[12.25,[520,339.2]],[12.6,[-400,339.2],'in']]);
var qt=tx(c,'Persistent entered question','',46,ink,910,510,0,12.6,false,'HiraginoSansGB-W6');
var textprop=qt.property('ADBE Text Properties').property('ADBE Text Document');
var chunks=['支持哪些文件？','支持哪些文件？更新','支持哪些文件？更新如何生效？'];
for(var qi=0;qi<chunks.length;qi++){var doc=textprop.value;doc.text=chunks[qi];textprop.setValueAtTime(.18+qi*.22,doc);}
// Anchor is measured from the complete string for stable typing.
var qb=qt.sourceRectAtTime(1,false);M.anchor(qt).setValue([qb.left+qb.width/2,qb.top+qb.height/2]);
pos(qt,[[0,[900,510]],[1.55,[900,510]],[2.3,[960,166]],[4.9,[960,166]],[6,[960,310]],[9.1,[960,310]],[10.2,[520,339.2]],[12.25,[520,339.2]],[12.6,[-400,339.2],'in']]);
scale(qt,[[0,100],[1.55,100],[2.3,66],[4.9,66],[6,64],[9.1,64],[10.2,42.88],[12.25,42.88],[12.6,42.88]]);
var send=U.circle(c,'Submit control',70,blue,1500,510,0,1.85);scale(send,[[0,0],[.42,100,'out'],[1.47,100],[1.57,84],[1.7,112],[1.85,0]]);
var arrow=U.line(c,'Submit arrow',[[1483,510],[1516,510],[1504,498],[1516,510],[1504,522]],white,3,.4,1.65);
var tap=X.ring(c,'Submit impulse',1500,510,72,blue,3,1.52,1.95);scale(tap,[[1.52,80],[1.95,230,'out']]);alpha(tap,[[1.52,70],[1.95,0]]);

// Three source sheets unfold from the submitted question.
var papers=[],bodies=[],origins=[360,960,1560],bodyEnd=5.6;
for(var i=0;i<3;i++){
 var d=DATA.documents[i],a=1.64+i*.11;
 var p=rect('Source '+d.id+' / persistent surface',540,520,white,960,510,a,i===0?12.7:i===1?13.0:5.5,20);papers.push(p);shadow(p);
 var docComp=U.comp('Source content / '+d.id,540,520,D,false);
 U.rect(docComp,'Format tile',70,46,soft,63,59,10);tx(docComp,'Format',d.format,20,blue,63,59,0,D,false,'Menlo-Regular');
 tx(docComp,'Document title',d.title,30,ink,34,139,0,D,true,'HiraginoSansGB-W6');tx(docComp,'Section',d.section,21,muted,34,191,0,D,true);U.line(docComp,'Divider',[[34,225],[506,225]],edge,1);
 tx(docComp,'Context label','资料 '+d.number,17,muted,34,408,0,D,true,'Menlo-Regular');
 tx(docComp,'Context',d.context[0],19,muted,34,454,0,D,true);
 if(i===2){tx(docComp,'Unselected passage',d.excerpt[0],24,ink,34,297,0,D,true);tx(docComp,'Not selected','与本次问题无关',18,muted,34,343,0,D,true);}
 var b=layer(docComp,'Source '+d.id+' / content',960,510,1,a,bodyEnd);bodies.push(b);
 var pk=[[a,[960,510]],[a+.22,[960+(origins[i]-960)*.4,620]],[2.7+i*.07,[origins[i],552],'out'],[4.64,[origins[i],552]]];
 var sk=[[a,28],[a+.22,68],[2.7+i*.07,100,'out'],[4.64,100]],rk=[[a,(i-1)*18],[2.4,(i-1)*3],[2.82+i*.04,0,'out'],[4.64,0]];
 pos(b,pk.concat([[5.48,[origins[i],i===2?1200:330],'in']]));scale(b,sk);rot(b,rk);alpha(b,[[a,0],[a+.18,100],[4.72,100],[4.98,0]]);
 if(i===0){pos(p,pk.concat([[5.95,[960,550]],[9.1,[960,550]],[10.2,[520,500]],[12.15,[520,500]],[12.7,[-650,500],'in']]));scale(p,sk);rot(p,rk);animate(M.shapeSize(p),[[a,[540,520]],[4.64,[540,520]],[5.95,[1380,700]],[9.1,[1380,700]],[10.2,[924.6,469]],[12.7,[924.6,469]]]);}
 if(i===1){pos(p,pk.concat([[5.95,[1360,700]],[9.1,[1360,700]],[10.2,[1320,550]],[12.3,[1320,550]],[13,[548,470]]]));scale(p,sk);rot(p,rk);animate(M.shapeSize(p),[[a,[540,520]],[4.64,[540,520]],[5.95,[310,104]],[9.1,[310,104]],[10.2,[650,700]],[12.3,[650,700]],[13,[30,30]]]);alpha(p,[[a,100],[12.6,100],[13,0]]);}
 if(i===2){pos(p,pk.concat([[5.5,[2060,1180],'in']]));scale(p,sk.concat([[5.5,52]]));rot(p,rk.concat([[5.5,19]]));alpha(p,[[a,100],[4.64,100],[5.5,0]]);}
}

// Quoted spans are their own objects from source highlight to final answer.
var qcomps=[],quotes=[];
for(var j=0;j<2;j++){
 var qh=j?140:90;var q=U.comp('Persistent quotation '+(j+1),480,qh,D,false);qcomps.push(q);
 var h=U.rect(q,'Quotation highlight',480,qh,soft,240,qh/2,12);animate(M.shapeSize(h),[[0,[0,qh]],[3.0+j*.42,[0,qh]],[3.38+j*.42,[480,qh]]]);
 for(var li=0;li<DATA.claims[j].lines.length;li++)tx(q,'Exact source text '+li,DATA.claims[j].lines[li],24,ink,24,DATA.claims[j].lines.length===1?45:48+li*42,0,D,true);
 var ql=layer(q,'Evidence '+(j+1)+' / same object',origins[j],582,1,2.35+j*.1,12.7);quotes.push(ql);
 pos(ql,[[2.35+j*.1,[960+(origins[j]-960)*.75,650]],[2.82+j*.08,[origins[j],582],'out'],[4.82+j*.1,[origins[j],582]],[6.12+j*.12,[680,j?722:513]],[9.1,[680,j?722:513]],[10.2,j?[1320,565]:[332.4,475.21]],[12.3,j?[1320,565]:[332.4,475.21]],[12.7,j?[548,470]:[-600,475.21],'in']]);
 scale(ql,[[2.35+j*.1,70],[2.82+j*.08,100,'out'],[4.82+j*.1,100],[6.12+j*.12,124],[9.1,124],[10.2,j?115:83.08],[12.3,j?115:83.08],[12.7,j?4:83.08]]);
 alpha(ql,[[2.35+j*.1,0],[2.7+j*.1,100],[12.3,100],[12.7,0]]);
}

// Answer is composed around the arriving quotations; the first source surface is its panel.
var answer=U.comp('Answer structure',1380,700,D,false);
tx(answer,'Product name','TRACE',25,blue,46,42,0,D,true,'HelveticaNeue-Bold');tx(answer,'Application location','知识库 / 新对话',21,muted,170,42,0,D,true);U.line(answer,'Header divider',[[40,80],[1340,80]],edge,1);
tx(answer,'Answer heading','根据产品资料',43,ink,60,177,0,D,true,'HiraginoSansGB-W6');tx(answer,'Section one','文件支持',25,ink,60,226,0,D,true,'HiraginoSansGB-W6');tx(answer,'Section two','更新方式',25,ink,60,407,0,D,true,'HiraginoSansGB-W6');
U.line(answer,'Sources separator',[[820,168],[820,640]],edge,1);tx(answer,'Sources label','本回答的来源',22,muted,900,177,0,D,true,'HiraginoSansGB-W6');
U.rect(answer,'Reference one background',310,104,r('F3F4FC'),1090,313,13);tx(answer,'Reference number 0','01',18,blue,954,286,0,D,true,'Menlo-Regular');tx(answer,'Reference title 0',DATA.documents[0].title,25,ink,954,328,0,D,true,'HiraginoSansGB-W6');
var aLayer=layer(answer,'Answer UI assembled',960,550,1,5.95,12.7);pos(aLayer,[[5.95,[960,550]],[6.25,[960,550],'out'],[9.1,[960,550]],[10.2,[520,500]],[12.15,[520,500]],[12.7,[-650,500],'in']]);scale(aLayer,[[5.95,100],[6.25,100],[9.1,100],[10.2,67],[12.7,67]]);alpha(aLayer,[[5.95,0],[6.25,100]]);
aLayer.moveAfter(quotes[0]);
// An answer copy stays visible when its citation returns to the source.
var retained=layer(qcomps[1],'Answer quotation 2 remains',680,722,1.24,9.72,12.7);pos(retained,[[9.1,[680,722]],[10.2,[332.4,615.24]],[12.15,[332.4,615.24]],[12.7,[-837.6,615.24],'in']]);scale(retained,[[9.1,124],[10.2,83.08],[12.7,83.08]]);retained.moveAfter(quotes[1]);alpha(retained,[[9.72,0],[9.98,100]]);

// Citation badges stay attached to their evidence; badge two becomes the brand point.
var badge2=null,number2=null,badgeLayers=[],numberLayers=[];
for(var bi=0;bi<2;bi++){
 var badge=U.circle(c,'Citation '+(bi+1)+' / identity',38,blue,origins[bi]+212,582,3.4+bi*.42,D);var num=tx(c,'Citation numeral '+bi,String(bi+1),20,white,origins[bi]+212,582,3.4+bi*.42,bi?12.9:12.7,false,'HelveticaNeue-Bold');
 var bk=[[3.4+bi*.42,[origins[bi]+212,582]],[4.82+bi*.1,[origins[bi]+212,582]],[6.12+bi*.12,[942.88,bi?722:513]],[9.1,[942.88,bi?722:513]],[10.2,bi?[1563.8,565]:[508.53,475.21]],[12.3,bi?[1563.8,565]:[508.53,475.21]],[13,bi?[548,470]:[-700,475.21]]];pos(badge,bk);pos(num,bk);scale(badge,[[3.4+bi*.42,0],[3.68+bi*.42,100,'out'],[6.24,124],[9.1,124],[10.2,bi?115:83.08],[12.3,bi?115:83.08],[13,bi?100:0]]);scale(num,[[3.4+bi*.42,100],[6.24,124],[9.1,124],[10.2,bi?115:83.08],[12.3,bi?115:83.08],[12.9,bi?0:83.08]]);
 badgeLayers.push(badge);numberLayers.push(num);if(bi){badge2=badge;number2=num;}else badge.outPoint=12.7;
}
var cursor=U.pointer(c,'Open source cursor',[[1110,875],[957,758],[943,722],[943,722]],[8.55,8.95,9.15,9.32],8.55,9.45);var ring=X.ring(c,'Citation response',943,722,48,blue,3,9.15,9.65);scale(ring,[[9.15,80],[9.65,240,'out']]);alpha(ring,[[9.15,75],[9.65,0]]);

var drawer=U.comp('Source 02 detail',650,700,D,false);tx(drawer,'Source breadcrumb','来源 02 / MD',22,blue,45,58,0,D,true,'Menlo-Regular');tx(drawer,'Source title','同步与更新',49,ink,45,159,0,D,true,'HiraginoSansGB-W6');tx(drawer,'Source metadata','内容更新 · 版本 1.0',22,muted,45,227,0,D,true);U.line(drawer,'Source rule',[[45,272],[605,272]],edge,1);tx(drawer,'Source context label','补充说明',23,muted,45,523,0,D,true,'HiraginoSansGB-W6');tx(drawer,'Source context','同步记录可用于确认当前资料版本。',24,muted,45,585,0,D,true);
var dw=layer(drawer,'Original source revealed',1360,700,.25,9.3,12.75);pos(dw,[[9.3,[1360,700]],[10.2,[1320,550]],[12.3,[1320,550]],[12.75,[548,470]]]);scale(dw,[[9.3,25],[10.2,100],[12.3,100],[12.75,2]]);alpha(dw,[[9.3,0],[9.85,100],[12.3,100],[12.65,0]]);dw.moveAfter(quotes[1]);papers[1].moveAfter(dw);
// Keep the original source title and its answer reference above their own surface.
bodies[1].moveBefore(papers[1]);
var ref2=U.comp('Reference 02 label',310,104,D,false);
tx(ref2,'Reference number','02',18,blue,19,25,0,D,true,'Menlo-Regular');
tx(ref2,'Reference title',DATA.documents[1].title,25,ink,19,67,0,D,true,'HiraginoSansGB-W6');
var ref2Layer=layer(ref2,'Reference 02 remains legible',1360,700,1,5.95,9.4);
pos(ref2Layer,[[5.95,[1360,700]],[9.1,[1360,700]],[10.2,[1320,550]]]);
alpha(ref2Layer,[[5.95,0],[6.25,100],[9.1,100],[9.4,0]]);ref2Layer.moveBefore(papers[1]);

function carryCurve(q,b,n,start,end,p0,p1,p2,p3){
 var ts=[],pv=[],bv=[];
 for(var f=Math.round(start*30);f<=Math.round(end*30);f++){
  var u=ease((f-Math.round(start*30))/(Math.round(end*30)-Math.round(start*30)),'smooth'),v=1-u;
  var x=v*v*v*p0[0]+3*v*v*u*p1[0]+3*v*u*u*p2[0]+u*u*u*p3[0],y=v*v*v*p0[1]+3*v*v*u*p1[1]+3*v*u*u*p2[1]+u*u*u*p3[1];
  ts.push(f/30);pv.push([x,y]);bv.push([x+212*(1+.24*u),y]);
 }
 M.pos(q).setValuesAtTimes(ts,pv);M.pos(b).setValuesAtTimes(ts,bv);M.pos(n).setValuesAtTimes(ts,bv);
}
carryCurve(quotes[0],badgeLayers[0],numberLayers[0],4.82,6.12,[360,582],[430,300],[640,315],[680,513]);
carryCurve(quotes[1],badgeLayers[1],numberLayers[1],4.92,6.24,[960,582],[1100,850],[710,900],[680,722]);

// The same two focus brackets migrate from query to source, answer and brand identity.
var states=[
 [0,[310,1610,510,112,32]], [1.55,[310,1610,510,112,32]],
 [2.85,[68,1252,552,278,38]], [4.65,[68,1252,552,278,38]],
 [6.15,[252,1668,550,368,36]], [9.15,[252,1668,550,368,36]],
 [9.4,[252,1668,198,16,36]], [9.8,[977,1663,198,16,36]],
 [10.2,[977,1663,550,368,36]], [12.3,[977,1663,550,368,36]],
 [13.05,[440,656,470,106,34]], [16,[440,656,470,106,34]]];
for(var side=0;side<2;side++){
 var br=U.line(c,'Persistent focus bracket '+side,[[0,0],[0,1],[1,1]],blue,5,0,D),times=[],shapes=[];
 for(var si=0;si<states.length-1;si++){var aa=states[si],bb=states[si+1],start=Math.round(aa[0]*30),stop=Math.round(bb[0]*30);for(var frame=start;frame<stop;frame++){var v=mix(aa[1],bb[1],ease((frame-start)/(stop-start),'smooth')),x=v[side],y=v[2],h=v[3],w=v[4]*(side?-1:1);times.push(frame/30);shapes.push(N.shape([[x+w,y-h],[x,y-h],[x,y+h],[x+w,y+h]],false));}}
 N.pathProp(br).setValuesAtTimes(times,shapes);for(var kk=1;kk<=N.pathProp(br).numKeys;kk++)N.pathProp(br).setInterpolationTypeAtKey(kk,KeyframeInterpolationType.LINEAR,KeyframeInterpolationType.LINEAR);
 var trim=N.trim(br,0,.55);animate(N.ct(br).property('ADBE Vector Graphic - Stroke').property('ADBE Vector Stroke Width'),[[0,5],[12.3,5],[13.05,14],[16,14]]);
}

// Resolve the moving bracket system into a brand, with staggered character arrival.
var letters='TRACE',lx=[770,918,1063,1210,1352];
for(var ci=0;ci<5;ci++){var at=12.72+ci*.065,l=tx(c,'Wordmark letter '+ci,letters[ci],188,ink,lx[ci],470,at,D,false,'HelveticaNeue-Bold');pos(l,[[at,[lx[ci]+145,470]],[at+.65,[lx[ci],470],'out']]);alpha(l,[[at,0],[at+.2,100]]);}
var promise=tx(c,'Brand promise','看见答案，也看见依据。',56,blue,960,727,13.35,D,false,'HiraginoSansGB-W6');N.reveal(promise,13.35,13.85,28);

query.moveToBeginning();qt.moveToBeginning();send.moveToBeginning();arrow.moveToBeginning();tap.moveToBeginning();
c.openInViewer();$.writeln('TRACE 16s continuous motion narrative built.');
})();
