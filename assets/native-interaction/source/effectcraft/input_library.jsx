/* Actual native input pixels, with authored focus/typing/submit timing.
   The local draft was captured and cleared without submitting a new inference. */
var U=(function(){
 var M=MuseNative,D=CFG.duration;
 function shape(w,h){return N.shape([[0,0],[w,0],[w,h],[0,h]],true);}
 function add(c,k,style){
  if(!k.input)return;
  var p=k.input,s=CFG.input_sources[k.source_id||k.case_id],a=p.start,b=p.end;
  var q=I.comp(k.case_id+' / Native input choreography',1920,1080),w=1720,scale=w/s.width,left=(1920-w)/2,top=618-s.height*scale/2;
  var dest=style==='graphic'?[1220,616,84]:style==='companion'?[1152,622,84]:[960,636,92];var landed=style==='graphic'?[1120,590]:style==='companion'?[1110,590]:[960,596];
  var plane=I.rect(q,'Input / Shape handoff to workspace',1430,800,960,618,'FFFFFF',20,p.submit+.10,b);N.shadow(plane,11,14,30);
  I.smooth(M.pos(plane),p.submit+.10,k.workspace,[960,618],[dest[0],dest[1]]);
  I.smooth(M.scale(plane),p.submit+.10,k.workspace,[w/1430*100,s.height*scale/800*100],[dest[2],dest[2]]);I.reveal(plane,p.submit+.10,p.submit+.17);I.smooth(M.pos(plane),k.workspace,k.workspace+.48,[dest[0],dest[1]],landed);
  var surface=I.img(q,s.empty_asset,'Actual product input / empty',w,960,618,a,b);
  M.key(M.opacity(surface),[a,a+.20,p.submit+.10,k.workspace+.03],[0,100,100,0],{linear:true});
  var ready=I.img(q,s.ready_asset,'Input / Actual enabled state',w,960,618,p.type_start,b);
  M.key(M.opacity(ready),[p.type_start,p.type_start+.08,p.submit+.10,k.workspace+.03],[0,100,100,0],{linear:true});
  var focus=M.shape(q,'Input / Focus boundary','rect',[w-2,s.height*scale-2],null,[960,618],52,M.rgb(CFG.colors.accent),1.7,p.focus-.04,k.workspace);
  M.key(M.opacity(focus),[p.focus-.04,p.focus+.10,p.submit+.10,k.workspace],[0,38,38,0],{linear:true});
  var inputHit=[left+s.text_box[0]*scale+8,top+(s.text_box[1]+22)*scale];
  I.cursor(q,'Input focus',a+.08,inputHit,p.focus,p.focus+.42,style);
  // Erase only the real placeholder, then reveal the captured original request pixels.
  var blank=I.rect(q,'Input / Placeholder clearance',s.clear_box[2]*scale,s.clear_box[3]*scale,left+(s.clear_box[0]+s.clear_box[2]/2)*scale,top+(s.clear_box[1]+s.clear_box[3]/2)*scale,'FFFFFF',0,p.type_start,b);
  M.key(M.opacity(blank),[p.type_start,p.submit+.10,k.workspace+.03],[100,100,0],{linear:true});
  var tx=left+s.text_box[0]*scale,ty=top+s.text_box[1]*scale,tw=s.text_box[2],th=s.text_box[3];
  var text=I.img(q,s.text_asset,'Input / Captured request glyphs',tw*scale,tx+tw*scale/2,ty+th*scale/2,p.type_start,b);
  M.key(M.opacity(text),[p.type_start,p.submit+.10,k.workspace+.03],[100,100,0],{linear:true});
  var mask=M.mask(text,0,0,1,th),times=[p.type_start],widths=[1],shapes=[shape(1,th)],positions=[[tx+1,ty+th*scale/2]];
  for(var j=0;j<s.glyph_ends.length;j++){
   var t=p.type_start+(p.type_end-p.type_start)*(j+1)/s.glyph_ends.length;
   times.push(t-1/30,t);widths.push(j===0?1:s.glyph_ends[j-1],s.glyph_ends[j]);
   shapes.push(shape(widths[widths.length-2],th),shape(s.glyph_ends[j],th));
   positions.push([tx+widths[widths.length-2]*scale+3,ty+th*scale/2],[tx+s.glyph_ends[j]*scale+3,ty+th*scale/2]);
  }
  M.key(mask.property('ADBE Mask Shape'),times,shapes,{linear:true});
  var caret=I.rect(q,'Input / Insertion caret',2,34*scale,tx,ty+th*scale/2,'accent',0,p.type_start,p.submit-.16);
  M.key(M.pos(caret),times,positions,{linear:true});
  var ct=[p.type_start,p.type_end,p.type_end+.16,p.type_end+.38,p.type_end+.62,p.submit-.18];
  M.key(M.opacity(caret),ct,[100,100,100,0,100,100],{linear:true});
  var hit=[left+s.submit_hotspot[0]*scale,top+s.submit_hotspot[1]*scale];
  I.cursor(q,'Submit original request',p.submit-.97,hit,p.submit,b-.02,style);
  var note=I.text(q,'Input / Replay provenance',s.note,22,960,top-35,'secondary',a,k.workspace);M.key(M.opacity(note),[a,a+.20,k.workspace-.20,k.workspace],[0,100,100,0],{linear:true});
  var group=I.sub(c,q,k.case_id+' / Real input and authored keystrokes',960,540,a,b);
  M.key(M.opacity(group),[a,a+.22,b-.24,b],[0,100,100,0],{linear:true});

  if(style!=='evidence'){
   var title=E.txt(c,k.case_id+' / Input value',k.case_id==='analysis'?'一句话，开启一次分析。':'一个目标，开始一套方案。',68,960,342,'ink',a,b);
   I.reveal(title,a+.10,a+.32);I.smooth(M.pos(title),a+.10,a+.48,[960,375],[960,342]);
   M.key(M.opacity(title),[a,a+.26,k.workspace-.25,k.workspace-.03],[0,100,100,0],{linear:true});
  }
 }
 return {add:add};
})();
