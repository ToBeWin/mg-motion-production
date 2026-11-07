// Read-only probe. Open TRACE.ecproj, then run this through EffectCraft MCP or CLI.
function comp(name){for(var i=1;i<=app.project.numItems;i++){var it=app.project.item(i);if(it.name===name)return it;}throw new Error(name);}
function at(l,p,t){return l.property('ADBE Transform Group').property(p).valueAtTime(t,false);}
var c=comp('TRACE / Answers with sources'),out={reading:[],quotes:[],sources:[]};
for(var t of [10.2,12.8,16,20.8,23.5,26.5,30,31.9666667]){
 var row={time:t};
 for(var name of ['Evidence object / release','Evidence object / sync','Source document / sync','Answer with attached evidence']){
  var l=c.layer(name);row[name]={layer_id:l.id,source_id:l.source?l.source.id:null,position:at(l,'ADBE Position',t),scale:at(l,'ADBE Scale',t),opacity:at(l,'ADBE Opacity',t),rotation_y:at(l,'ADBE Rotate Y',t),threeD:l.threeDLayer};
 }out.reading.push(row);
}
for(var j of [1,2]){
 var e=comp('TRACE / Evidence '+j),q={citation:j,lines:[]};
 for(var i=1;i<=e.numLayers;i++){var l=e.layer(i);if(l.name.indexOf('Exact quote')===0)q.lines.push({name:l.name,text:l.property('ADBE Text Properties').property('ADBE Text Document').value.text});}
 out.quotes.push(q);
}
for(var id of ['release','sync']){
 var d=comp('TRACE / Document '+id),q={id:id,lines:[]};
 for(var i=1;i<=d.numLayers;i++){var l=d.layer(i);if(l.name.indexOf('Source paragraph')===0)q.lines.push({name:l.name,text:l.property('ADBE Text Properties').property('ADBE Text Document').value.text});}
 out.sources.push(q);
}
out.pointer=at(c.layer('Citation cursor'),'ADBE Position',21.2);
out.route=c.layer('Citation to original paragraph').property('ADBE Root Vectors Group').property(1).property('ADBE Vectors Group').property('ADBE Vector Shape - Group').property('ADBE Vector Shape').value.vertices;
out.end_opacity={one:at(c.layer('Closing one'),'ADBE Opacity',31.9666667),two:at(c.layer('Closing two'),'ADBE Opacity',31.9666667)};
out.handoffs={opening_out:c.layer('Opening one').outPoint,question_in:c.layer('User question').inPoint,closing_in:c.layer('Closing one').inPoint,excerpt_opacity_at_entry:[at(c.layer('Evidence object / release'),'ADBE Opacity',8.8),at(c.layer('Evidence object / sync'),'ADBE Opacity',9.7)]};
JSON.stringify(out);
