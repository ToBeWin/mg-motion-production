var PLAN={"version": "3.4.0", "fps": 30, "cases": {"api": {"title": "PULSE API · 一句话成为下一步", "composition": "PULSE / Developer launch", "size": [1920, 1080], "duration": 24, "scenario": "developer-api", "filename": "PULSE_API发布_1080p30.mp4", "bpm": 112, "close": 20.5, "cues": [{"time": 0.3, "type": "arrival"}, {"time": 3.2, "type": "sweep", "duration": 0.75}, {"time": 4.6, "type": "tick"}, {"time": 5.0, "type": "tick"}, {"time": 5.4, "type": "tick"}, {"time": 8, "type": "sweep", "duration": 0.9}, {"time": 9.35, "type": "confirm"}, {"time": 13.8, "type": "sweep", "duration": 1}, {"time": 15.5, "type": "confirm"}, {"time": 19.3, "type": "sweep", "duration": 0.8}, {"time": 20.5, "type": "arrival"}], "focus": [[9.3, 13.3, 0.62], [15.3, 18.8, 0.72]]}, "brand": {"title": "SHIFT · 让想法向前一步", "composition": "SHIFT / Brand manifesto", "size": [1920, 1080], "duration": 18, "scenario": "brand-manifesto", "filename": "SHIFT_品牌宣言_1080p30.mp4", "bpm": 124, "close": 14.0, "cues": [{"time": 0.18, "type": "impact"}, {"time": 2.4, "type": "sweep", "duration": 0.55}, {"time": 3.05, "type": "impact"}, {"time": 6.05, "type": "sweep", "duration": 0.65}, {"time": 6.7, "type": "impact"}, {"time": 9.45, "type": "sweep", "duration": 0.5}, {"time": 9.65, "type": "impact"}, {"time": 12.2, "type": "sweep", "duration": 0.65}, {"time": 13.2, "type": "impact"}, {"time": 14.0, "type": "confirm"}], "focus": [[14.8, 18, 0.68]]}, "service": {"title": "LOOP · 服务有回音", "composition": "LOOP / Service journey", "size": [1080, 1920], "duration": 26, "scenario": "business-process", "filename": "LOOP_服务旅程_1080x1920_30fps.mp4", "bpm": 96, "close": 22, "cues": [{"time": 0.3, "type": "paper", "duration": 0.7}, {"time": 3.2, "type": "paper", "duration": 0.75}, {"time": 5.5, "type": "tick"}, {"time": 6.8, "type": "soft"}, {"time": 8.1, "type": "paper", "duration": 0.4}, {"time": 9.8, "type": "paper", "duration": 0.55}, {"time": 10.6, "type": "confirm"}, {"time": 12.0, "type": "paper", "duration": 0.65}, {"time": 14.8, "type": "tick"}, {"time": 16.7, "type": "paper", "duration": 0.55}, {"time": 18.2, "type": "confirm"}, {"time": 19.5, "type": "paper", "duration": 0.8}, {"time": 22, "type": "arrival"}], "focus": [[6.7, 10.5, 0.65], [20.5, 25, 0.76]]}}, "art_direction": {"constraint": "本批不使用黑色或近黑色背景；深色仅用于文字、线条或小面积标识。", "api": "冷白环境、纯白面板、深蓝字与绿蓝赭字段", "brand": "奶油白、浅长春花蓝与钴蓝色场", "service": "暖纸色、白色申请单与森林绿字"}};
var API={"request_id": "req_024", "request": {"text": "周五前，林岚完成首页草稿。", "schema": {"due_text": "string", "owner": "string", "task": "string"}}, "response": {"due_text": "周五前", "owner": "林岚", "task": "首页草稿"}, "scope": "Fictional API contract and deterministic fixture; no online AI service or date resolution."};
var FLOW={"request_id": "SR-024", "reason": "尺码不合适", "sequence": [{"time": 0.4, "role": "顾客", "state": "已提交"}, {"time": 6.8, "role": "客服", "state": "待补充商品照片"}, {"time": 9.8, "role": "顾客", "state": "商品照片已补充"}, {"time": 10.6, "role": "客服", "state": "资料完整"}, {"time": 14.8, "role": "仓库", "state": "换货处理中"}, {"time": 18.2, "role": "通知", "state": "换货已寄出"}], "scope": "Fictional service example, no live order or fulfillment."};
/* Native EffectCraft 0.16 / AE-style helpers. No scene is created by this file. */
var MuseNative = (function () {
    var count = { layers: 0, keyedProperties: 0 };
    function rgb(hex) {
        hex = hex.replace('#', '');
        return [parseInt(hex.substr(0,2),16)/255, parseInt(hex.substr(2,2),16)/255, parseInt(hex.substr(4,2),16)/255];
    }
    function prop(l,n) { return l.property('ADBE Transform Group').property(n); }
    function pos(l) { return prop(l,'ADBE Position'); }
    function scale(l) { return prop(l,'ADBE Scale'); }
    function opacity(l) { return prop(l,'ADBE Opacity'); }
    function rotation(l) { return prop(l,'ADBE Rotate Z'); }
    function anchor(l) { return prop(l,'ADBE Anchor Point'); }
    function comp(name,w,h,duration,fps,folder) {
        var c=app.project.items.addComp(name,w,h,1,duration,fps);
        if (folder) c.parentFolder=folder;
        c.bgColor=rgb('FAFCFD'); c.motionBlur=true;
        c.shutterAngle=120; c.shutterPhase=-60; c.motionBlurSamplesPerFrame=8;
        c.workAreaStart=0; c.workAreaDuration=duration;
        return c;
    }
    function setup(l,name,xy,start,end) {
        l.name=name;
        if (typeof start==='number') l.inPoint=start;
        if (typeof end==='number') l.outPoint=end;
        if(xy) pos(l).setValue(xy);
        l.motionBlur=true; count.layers++;
        return l;
    }
    function paint(contents,fill,stroke,width) {
        if(fill) {
            var f=contents.addProperty('ADBE Vector Graphic - Fill');
            f.property('ADBE Vector Fill Color').setValue(fill);
        }
        if(stroke && width) {
            var s=contents.addProperty('ADBE Vector Graphic - Stroke');
            s.property('ADBE Vector Stroke Color').setValue(stroke);
            s.property('ADBE Vector Stroke Width').setValue(width);
            s.property('ADBE Vector Stroke Line Cap').setValue(2);
        }
    }
    function shape(c,name,kind,size,fill,xy,radius,stroke,width,start,end) {
        var l=setup(c.layers.addShape(),name,xy,start,end);
        var g=l.property('ADBE Root Vectors Group').addProperty('ADBE Vector Group');
        g.name=name+' geometry'; var ct=g.property('ADBE Vectors Group'),p;
        if(kind==='ellipse') {
            p=ct.addProperty('ADBE Vector Shape - Ellipse');
            p.property('ADBE Vector Ellipse Size').setValue(size);
        } else {
            p=ct.addProperty('ADBE Vector Shape - Rect');
            p.property('ADBE Vector Rect Size').setValue(size);
            p.property('ADBE Vector Rect Roundness').setValue(radius||0);
        }
        paint(ct,fill,stroke,width); return l;
    }
    function rect(c,name,size,color,xy,radius,start,end) {
        return shape(c,name,'rect',size,color,xy,radius,null,0,start,end);
    }
    function circle(c,name,size,color,xy,start,end) {
        return shape(c,name,'ellipse',[size,size],color,xy,0,null,0,start,end);
    }
    function shapeSize(l,kind) {
        var g=l.property('ADBE Root Vectors Group').property(1).property('ADBE Vectors Group');
        return g.property(kind==='ellipse'?'ADBE Vector Shape - Ellipse':'ADBE Vector Shape - Rect').property(kind==='ellipse'?'ADBE Vector Ellipse Size':'ADBE Vector Rect Size');
    }
    function roundness(l) {
        return l.property('ADBE Root Vectors Group').property(1).property('ADBE Vectors Group').property('ADBE Vector Shape - Rect').property('ADBE Vector Rect Roundness');
    }
    function path(c,name,vertices,fill,stroke,width,xy,closed,start,end) {
        var l=setup(c.layers.addShape(),name,xy,start,end);
        var ct=l.property('ADBE Root Vectors Group').addProperty('ADBE Vector Group').property('ADBE Vectors Group');
        var p=ct.addProperty('ADBE Vector Shape - Group').property('ADBE Vector Shape');
        var s=new Shape();s.vertices=vertices;s.inTangents=[];s.outTangents=[];s.closed=closed!==false;
        for(var i=0;i<vertices.length;i++){s.inTangents.push([0,0]);s.outTangents.push([0,0]);}
        p.setValue(s);paint(ct,fill,stroke,width);return l;
    }
    function text(c,name,str,size,color,xy,font,start,end,tracking) {
        var l=setup(c.layers.addText(str),name,xy,start,end);
        var p=l.property('ADBE Text Properties').property('ADBE Text Document'),d=p.value;
        d.font=font||'HelveticaNeue-Medium';d.fontSize=size;d.fillColor=color;
        d.applyFill=true;d.applyStroke=false;d.tracking=tracking||0;
        d.justification=ParagraphJustification.CENTER_JUSTIFY;p.setValue(d);
        var b=l.sourceRectAtTime(0,false);
        anchor(l).setValue([b.left+b.width/2,b.top+b.height/2]);
        return l;
    }
    function fitWidth(l,width) {
        var b=l.sourceRectAtTime(0,false),s=scale(l).value;
        scale(l).setValue([width/b.width*100,s[1]]);return l;
    }
    function baseline(l) {
        var b=l.sourceRectAtTime(0,false);anchor(l).setValue([b.left+b.width/2,0]);return l;
    }
    function key(p,times,values,opts) {
        opts=opts||{};p.setValuesAtTimes(times,values);count.keyedProperties++;
        var n=1;
        if(p.propertyValueType===PropertyValueType.TwoD)n=2;
        if(p.propertyValueType===PropertyValueType.ThreeD)n=3;
        for(var k=1;k<=p.numKeys;k++) {
            if(opts.hold){p.setInterpolationTypeAtKey(k,KeyframeInterpolationType.HOLD,KeyframeInterpolationType.HOLD);continue;}
            if(opts.linear){p.setInterpolationTypeAtKey(k,KeyframeInterpolationType.LINEAR,KeyframeInterpolationType.LINEAR);continue;}
            var a=[],b=[];
            for(var i=0;i<n;i++){a.push(new KeyframeEase(0,opts.influence||70));b.push(new KeyframeEase(0,opts.influence||70));}
            p.setInterpolationTypeAtKey(k,KeyframeInterpolationType.BEZIER,KeyframeInterpolationType.BEZIER);
            p.setTemporalEaseAtKey(k,a,b);
        }
        return p;
    }
    function group(c,name,start,end) {
        var l=setup(c.layers.addNull(),name,[0,0],start,end);anchor(l).setValue([0,0]);return l;
    }
    function footage(c,name,path,width,xy,start,end) {
        var source=app.project.importFile(new ImportOptions(new File(path)));
        var l=setup(c.layers.add(source),name,xy,start,end);
        scale(l).setValue([width/source.width*100,width/source.width*100]);return l;
    }
    function mask(l,left,top,right,bottom) {
        var m=l.property('ADBE Mask Parade').addProperty('ADBE Mask Atom');
        var s=new Shape();s.vertices=[[left,top],[right,top],[right,bottom],[left,bottom]];
        s.inTangents=[[0,0],[0,0],[0,0],[0,0]];s.outTangents=[[0,0],[0,0],[0,0],[0,0]];s.closed=true;
        m.property('ADBE Mask Shape').setValue(s);return m;
    }
    function ellipseMask(l,cx,cy,r) {
        var m=l.property('ADBE Mask Parade').addProperty('ADBE Mask Atom'),s=new Shape(),k=r*0.55228475;
        s.vertices=[[cx+r,cy],[cx,cy+r],[cx-r,cy],[cx,cy-r]];
        s.inTangents=[[0,-k],[k,0],[0,k],[-k,0]];s.outTangents=[[0,k],[-k,0],[0,-k],[k,0]];s.closed=true;
        m.property('ADBE Mask Shape').setValue(s);return m;
    }
    function gradient(c,name,size,from,to,start,end,startColor,endColor,radial) {
        var l=rect(c,name,size,startColor,[(size[0]/2),(size[1]/2)],0,start,end);
        var e=l.property('ADBE Effect Parade').addProperty('ADBE Ramp');
        e.property('Start of Ramp').setValue(from);e.property('End of Ramp').setValue(to);
        e.property('Start Color').setValue(startColor);e.property('End Color').setValue(endColor);
        e.property('Ramp Shape').setValue(radial?2:1);
        l.motionBlur=false;return l;
    }
    return {rgb:rgb,comp:comp,setup:setup,pos:pos,scale:scale,opacity:opacity,rotation:rotation,anchor:anchor,shape:shape,rect:rect,circle:circle,path:path,shapeSize:shapeSize,roundness:roundness,text:text,baseline:baseline,fitWidth:fitWidth,key:key,group:group,footage:footage,mask:mask,ellipseMask:ellipseMask,gradient:gradient,count:count};
})();

/* Native modifiers, mattes, 3D transforms and shared controls. */
var N=(function(){
 var M=MuseNative;
 function ct(l){return l.property('ADBE Root Vectors Group').property(1).property('ADBE Vectors Group');}
 function fill(l){return ct(l).property('ADBE Vector Graphic - Fill').property('ADBE Vector Fill Color');}
 function trim(l,start,end){var e=ct(l).addProperty('ADBE Vector Filter - Trim');M.key(e.property('ADBE Vector Trim End'),[start,end],[0,100]);return e;}
 function fx(l,name,values){var e=l.property('ADBE Effect Parade').addProperty(name);for(var k in values)e.property(k).setValue(values[k]);return e;}
 function shadow(l,opacity,distance,soft){return fx(l,'Drop Shadow',{'Opacity':opacity,'Distance':distance,'Softness':soft,'Direction':135});}
 function clean(p){while(p.numKeys)p.removeKey(1);}
 function reveal(l,start,finish,amount){var e=fx(l,'Linear Wipe',{'Wipe Angle':0,'Feather':0});M.key(e.property('Transition Completion'),[start,finish],[100,0]);var v=M.pos(l).value;M.key(M.pos(l),[start,finish],[[v[0],v[1]+(amount||35)],v]);return e;}
 function line(c,name,pts,color,w,a,b){var l=M.path(c,name,pts,null,color,w,[0,0],false,a,b);return l;}
 function pathProp(l){return ct(l).property('ADBE Vector Shape - Group').property('ADBE Vector Shape');}
 function shape(pts,closed){var s=new Shape();s.vertices=pts;s.inTangents=[];s.outTangents=[];s.closed=closed;for(var i=0;i<pts.length;i++){s.inTangents.push([0,0]);s.outTangents.push([0,0]);}return s;}
 function repeater(l,copies,offset,rotation){var e=ct(l).addProperty('ADBE Vector Filter - Repeater');e.property('ADBE Vector Repeater Copies').setValue(copies);var t=e.property('ADBE Vector Repeater Transform');t.property('ADBE Vector Position').setValue(offset||[0,0]);t.property('ADBE Vector Rotation').setValue(rotation||0);return e;}
 function camera(c,name){var l=c.layers.addCamera(name,[c.width/2,c.height/2]);M.pos(l).setValue([c.width/2,c.height/2,-2200]);l.property('ADBE Camera Options Group').property('ADBE Camera Zoom').setValue(2200);return l;}
 return {ct:ct,fill:fill,trim:trim,fx:fx,shadow:shadow,clean:clean,reveal:reveal,line:line,pathProp:pathProp,shape:shape,repeater:repeater,camera:camera};
})();

var U=(function(){
 var M=MuseNative,S={},r=M.rgb;
 function factor(c){return S[c.id]||1;}
 function comp(n,w,h,d,hi){var s=hi?2:1,c=M.comp(n,w*s,h*s,d,30);S[c.id]=s;return c;}
 function rect(c,n,w,h,col,x,y,rad,a,b){var s=factor(c);return M.rect(c,n,[w*s,h*s],col,[x*s,y*s],(rad||0)*s,a,b);}
 function text(c,n,str,size,col,x,y,font,a,b,center){var s=factor(c),l=M.text(c,n,str,size*s,col,[x*s,y*s],font||'HiraginoSansGB-W3',a||0,b||c.duration);if(!center){var bb=l.sourceRectAtTime(0,false);M.anchor(l).setValue([bb.left,bb.top+bb.height/2]);}return l;}
 function add(c,src,n,x,y,scale,a,b){var s=factor(c),l=M.setup(c.layers.add(src),n,[x*s,y*s],a||0,b||c.duration);M.scale(l).setValue([scale*s/factor(src)*100,scale*s/factor(src)*100]);return l;}
 function photo(c,src,n,x,y,w,h,d){var s=factor(c),co=comp(n+' crop',w,h,d,s===2),l=co.layers.add(src);var sc=Math.max(w*s/src.width,h*s/src.height)*100;M.scale(l).setValue([sc,sc]);M.pos(l).setValue([w*s/2,h*s/2]);return add(c,co,n,x+w/2,y+h/2,1);}
 function key(p,ts,vs,kind){M.key(p,ts,vs,{influence:kind==='quiet'?48:62});for(var k=1;k<=p.numKeys;k++){if(p.isSpatial){var zero=p.propertyValueType===PropertyValueType.ThreeD_SPATIAL?[0,0,0]:[0,0];p.setSpatialAutoBezierAtKey(k,false);p.setSpatialContinuousAtKey(k,false);p.setSpatialTangentsAtKey(k,zero,zero);}if(kind==='travel'){var dim=p.propertyValueType===PropertyValueType.TwoD?2:1,a=[],b=[];for(var q=0;q<dim;q++){a.push(new KeyframeEase(0,76));b.push(new KeyframeEase(0,32));}p.setTemporalEaseAtKey(k,a,b);}}return p;}
 function fade(l,a,b,c,d){key(M.opacity(l),[a,b,c,d],[0,100,100,0],'quiet');return l;}
 function line(c,n,pts,col,w,a,b){var s=factor(c),p=[];for(var i=0;i<pts.length;i++)p.push([pts[i][0]*s,pts[i][1]*s]);return M.path(c,n,p,null,col,w*s,[0,0],false,a,b);}
 function circle(c,n,diam,col,x,y,a,b){var s=factor(c);return M.circle(c,n,diam*s,col,[x*s,y*s],a,b);}
 function title(c,n,str,size,col,x,y,w,a,settle,end){var co=comp('Type / '+n,w,size*1.6,c.duration,true),l=text(co,n,str,size,col,0,size*.76,'HiraginoSansGB-W6');key(M.pos(l),[a,a+settle],[[0,size*3.6],[0,size*1.52]],'quiet');var q=add(c,co,n,x+w/2,y,1,a,Math.min(end,c.duration));key(M.opacity(q),[a,a+.16,end-.18,end],[0,100,100,0],'quiet');return q;}
 function colorText(l,col){return N.fx(l,'Fill',{'Color':col}).property('Color');}
 function pointer(c,n,pts,ts,a,b){var s=factor(c),shape=[[0,0],[0,25],[7,19],[14,32],[20,29],[13,17],[25,17]],v=[];for(var i=0;i<shape.length;i++)v.push([shape[i][0]*s,shape[i][1]*s]);var l=M.path(c,n,v,r('FFFEFA'),r('16302E'),1.8*s,[0,0],true,a,b),p=[];for(var j=0;j<pts.length;j++)p.push([pts[j][0]*s,pts[j][1]*s]);key(M.pos(l),ts,p,'quiet');return l;}
 function fmt(n){return String(n).replace(/\B(?=(\d{3})+(?!\d))/g,',');}
 return{r:r,comp:comp,s:factor,rect:rect,text:text,add:add,photo:photo,key:key,fade:fade,line:line,circle:circle,title:title,colorText:colorText,pointer:pointer,fmt:fmt};
})();

/* Authored typography, path and motion helpers shared by these three cases. */
var X=(function(){
 var M=MuseNative,r=M.rgb;
 function tx(c,n,s,size,col,x,y,font,a,b,left){return U.text(c,n,s,size,col,x,y,font||'HiraginoSansGB-W6',a||0,b||c.duration,!left);}
 function rect(c,n,w,h,col,x,y,rad,a,b){return U.rect(c,n,w,h,col,x,y,rad||0,a,b);}
 function move(l,ts,values){U.key(M.pos(l),ts,values,'travel');return l;}
 function scale(l,ts,values){var factor=(l.containingComp?U.s(l.containingComp):1)/(l.source?U.s(l.source):1),vs=[];for(var i=0;i<values.length;i++){var v=typeof values[i]==='number'?[values[i],values[i]]:values[i];vs.push([v[0]*factor,v[1]*factor]);}U.key(M.scale(l),ts,vs,'travel');return l;}
 function fade(l,a,b,c,d){return U.fade(l,a,b,c,d);}
 function on(l,a,d,dy){var p=M.pos(l).value;M.opacity(l).setValue(0);U.key(M.opacity(l),[a,a+Math.min(d,.22)],[0,100],'quiet');if(dy)move(l,[a,a+d],[[p[0],p[1]+dy],p]);return l;}
 function off(l,a,b){U.key(M.opacity(l),[a,b],[100,0],'quiet');return l;}
 function ring(c,n,x,y,diam,col,width,a,b){return M.shape(c,n,'ellipse',[diam,diam],null,[x,y],0,col,width,a,b);}
 function find(g,n){for(var i=1;i<=g.numProperties;i++){var p=g.property(i);if(p.name===n)return p;if(p.numProperties){var f=find(p,n);if(f)return f;}}return null;}
 function grain(l,v){var e=l.property('ADBE Effect Parade').addProperty('Add Grain'),params={'Viewing Mode':3,'Intensity':v,'Size':.65,'Monochromatic':true,'Animation Speed':0,'Random Seed':41};for(var k in params){var p=find(e,k);if(!p)throw new Error('Missing grain '+k);p.setValue(params[k]);}return e;}
 function line(c,n,points,col,width,a,b){return U.line(c,n,points,col,width,a,b);}
 function draw(c,n,points,col,width,a,b,end){var l=line(c,n,points,col,width,a,end||c.duration);N.trim(l,a,b);return l;}
 function shadow(l,opacity,distance,softness){N.shadow(l,opacity,distance,softness);return l;}
 function splitText(c,n,str,size,col,x,y,width,t,end){var l=U.title(c,n,str,size,col,x,y,width,t,.58,end);if(end>=c.duration){N.clean(M.opacity(l));U.key(M.opacity(l),[t,t+.16],[0,100],'quiet');}return l;}
 function checked(c,n,x,y,col,t,end,size){size=size||20;return draw(c,n,[[x-size*.55,y],[x-size*.1,y+size*.4],[x+size*.7,y-size*.5]],col,4,t,t+.3,end);}
 function pinHeader(c,brand,note,col,muted,foot){var w=c.width,h=c.height;tx(c,'Brand label',brand,26,col,76,62,'HelveticaNeue-Bold',0,c.duration,true);var noteLayer=tx(c,'Category label',note,17,muted,w-74,62,'HelveticaNeue-Medium'),bb=noteLayer.sourceRectAtTime(0,false);M.anchor(noteLayer).setValue([bb.left+bb.width,bb.top+bb.height/2]);var l=line(c,'Header rule',[[76,102],[w-76,102]],muted,.7,0,c.duration);M.opacity(l).setValue(24);if(foot)tx(c,'Concept scope',foot,h>w?21:15,muted,w/2,h-36,'HiraginoSansGB-W3');}
 return {tx:tx,rect:rect,move:move,scale:scale,fade:fade,on:on,off:off,ring:ring,grain:grain,line:line,draw:draw,shadow:shadow,splitText:splitText,checked:checked,pinHeader:pinHeader};
})();

(function(){
 var M=MuseNative,r=M.rgb,P=PLAN.cases.api,D=P.duration,c=U.comp(P.composition,1920,1080,D);
 var bg=r('EAF1F7'),panel=r('FFFFFF'),white=r('203951'),muted=r('62778C'),mint=r('137964'),blue=r('445AC5'),sand=r('9C6222'),colors=[mint,blue,sand];
 var ground=M.gradient(c,'Cool daylight studio',[1920,1080],[820,-260],[1600,1200],0,D,r('FAFCFE'),bg,false);X.grain(ground,.1);
 // Quiet peripheral rules establish technical scale without becoming a code wall.
 for(var g=0;g<6;g++){var rule=X.line(c,'Peripheral line '+g,[[130+g*330,130],[130+g*330,1005]],r('B4C5D4'),.7,0,D);M.opacity(rule).setValue(18);}
 var opening=X.splitText(c,'Opening claim','让一句话，进入工作流。',90,white,205,320,1560,.15,3.1);
 var sub=X.tx(c,'Opening context','自然语言输入',22,muted,960,430,'HiraginoSansGB-W3',.55,3.15);X.on(sub,.55,.4,12);
 var values=[API.response.due_text,API.response.owner,API.response.task],keys=['due_text','owner','task'],initialX=[440,820,1320],tokens=[],widths=[];
 // A token is one editable precomp that survives input, schema, JSON and task views.
 for(var i=0;i<3;i++){
  var co=U.comp('PULSE / Field '+keys[i],380,124,D,true),v=U.text(co,'Field value',values[i],64,colors[i],190,62,'HiraginoSansGB-W6',0,D,true);
  var actual=v.sourceRectAtTime(0,false).width/2;widths.push(actual);
  var fill=U.rect(co,'Field backing',360,112,panel,190,62,18);fill.moveToEnd();M.opacity(fill).setValue(0);U.key(M.opacity(fill),[0,3.15,3.55,7.9,8.4,D],[0,0,100,100,0,0],'quiet');
  var rim=M.shape(co,'Field rim','rect',[720,224],null,[380,124],36,colors[i],2,3.15,8.5);X.fade(rim,3.15,3.55,7.9,8.5);
  for(var side=-1;side<=1;side+=2){var quote=U.text(co,'JSON quote '+side,'"',46,colors[i],190+side*(actual/2+13),62,'Menlo-Regular',8,14.3,true);X.fade(quote,8.0,8.7,13.65,14.0);}
  var tok=U.add(c,co,'Value / '+keys[i],initialX[i],584,1,.35,D);X.on(tok,.35+i*.10,.6,25);tokens.push(tok);
 }
 var comma=X.tx(c,'Input comma','，',64,white,635,584,'HiraginoSansGB-W3',.35,3.5),verb=X.tx(c,'Input verb','完成',64,white,1030,584,'HiraginoSansGB-W3',.35,3.5),period=X.tx(c,'Input period','。',64,white,1545,584,'HiraginoSansGB-W3',.35,3.5);
 X.fade(comma,.35,.65,3.15,3.5);X.fade(verb,.35,.65,3.15,3.5);X.fade(period,.35,.65,3.15,3.5);
 var segments=[tokens[0],comma,tokens[1],verb,tokens[2],period],segmentWidths=[widths[0],comma.sourceRectAtTime(0,false).width,widths[1],verb.sourceRectAtTime(0,false).width,widths[2],period.sourceRectAtTime(0,false).width],total=40;
 for(var sw=0;sw<segmentWidths.length;sw++)total+=segmentWidths[sw];var cursor=960-total/2;
 for(var sg=0;sg<segments.length;sg++){var xx=cursor+segmentWidths[sg]/2;if(sg%2===0)initialX[sg/2]=xx;else M.pos(segments[sg]).setValue([xx,sg===3?584:604]);cursor+=segmentWidths[sg]+8;}
 var schemaTitle=X.splitText(c,'Schema claim','先约定，返回什么。',82,white,255,260,1480,3.25,7.95);
 var schemaX=[420,960,1500];
 for(var k=0;k<3;k++){
  var key=X.tx(c,'Schema key '+k,keys[k].toUpperCase(),29,colors[k],schemaX[k],460,'Menlo-Regular',3.5,8.05);X.on(key,3.5+k*.12,.4,15);
  var datatype=X.tx(c,'Schema type '+k,'string',22,muted,schemaX[k],713,'Menlo-Regular',3.65,8.05);X.on(datatype,3.65+k*.12,.4,10);
  var bracket=X.draw(c,'Schema bracket '+k,[[schemaX[k]-205,510],[schemaX[k]-220,510],[schemaX[k]-220,665],[schemaX[k]-205,665]],colors[k],2,3.5+k*.12,4.3+k*.12,8.2);
  var right=X.draw(c,'Schema close '+k,[[schemaX[k]+205,510],[schemaX[k]+220,510],[schemaX[k]+220,665],[schemaX[k]+205,665]],colors[k],2,3.5+k*.12,4.3+k*.12,8.2);
 }
 var call=X.tx(c,'Call signature','POST /v1/extract',29,white,960,852,'Menlo-Regular',4.1,8.05);X.on(call,4.1,.4,12);
 var req=X.tx(c,'Request id','req_024  /  Task schema',19,muted,960,912,'Menlo-Regular',4.2,8.05);X.on(req,4.2,.4,8);
 // Response is a coherent readable object, not animated random source code.
 var response=U.comp('PULSE / JSON panel',1320,640,D,true);U.rect(response,'JSON surface',1320,640,panel,660,320,28);var border=M.shape(response,'JSON border','rect',[2640,1280],null,[1320,640],56,r('CFDDE8'),2,0,D);
 var back=U.add(c,response,'Response surface',960,585,1,8,14.7);X.shadow(back,12,18,50);X.scale(back,[8,8.9],[91,100]);X.fade(back,8,8.7,13.8,14.35);
 // Place the background beneath existing value objects.
 back.moveAfter(tokens[0]);
 var status=X.tx(c,'Response status','200 OK',24,mint,385,296,'Menlo-Regular',8.3,14.3,true),rid=X.tx(c,'Response identity','req_024',22,muted,1440,296,'Menlo-Regular',8.3,14.3);
 X.fade(status,8.3,8.7,13.65,14.0);X.fade(rid,8.3,8.7,13.65,14.0);
 var left=X.tx(c,'JSON opening brace','{',230,muted,430,581,'Menlo-Regular',8.3,14.3),right=X.tx(c,'JSON closing brace','}',230,muted,1480,581,'Menlo-Regular',8.3,14.3);X.fade(left,8.3,8.8,13.65,14.0);X.fade(right,8.3,8.8,13.65,14.0);
 var rowY=[436,575,714],jsonX=[];
 for(var j=0;j<3;j++){
  jsonX.push(1000+widths[j]/2);
  var field=X.tx(c,'JSON key '+keys[j],'"'+keys[j]+'":',37,muted,563,rowY[j],'Menlo-Regular',8.3,14.3,true);X.fade(field,8.3+j*.1,8.95+j*.1,13.65,14.0);
  if(j<2){var sep=X.tx(c,'JSON comma '+j,',',42,white,1000+widths[j]+31,rowY[j]+13,'Menlo-Regular',8.4,14.3);X.fade(sep,8.4,9.1,13.65,14.0);}
 }
 // The same response fields become a result that an application can use.
 var task=U.comp('PULSE / Task result',1180,490,D,true);U.rect(task,'Task surface',1180,490,panel,590,245,30);M.shape(task,'Task edge','rect',[2360,980],null,[1180,490],60,r('CFDDE8'),2,0,D);
 U.text(task,'Result context','示例应用 / 任务看板',25,muted,48,57,'HiraginoSansGB-W3');U.rect(task,'Task status',158,46,r('E3F2E9'),1037,58,23);U.text(task,'Task status type','待开始',22,mint,1037,58,'HiraginoSansGB-W3',0,D,true);
 U.text(task,'Owner label','负责人',23,muted,48,364,'HiraginoSansGB-W3');U.text(task,'Due label','截止描述',23,muted,865,287,'HiraginoSansGB-W3');U.rect(task,'Task rule',1084,1,r('D7E3EB'),590,421,0);U.text(task,'Task identity','req_024 → task_024',17,muted,48,454,'Menlo-Regular');
 var card=U.add(c,task,'Usable task',960,622,1,13.65,D);card.moveAfter(tokens[0]);X.shadow(card,14,24,65);X.fade(card,13.65,14.6,D-.03,D);X.scale(card,[13.65,14.6,19.3,20.5,D],[80,100,100,65,65]);X.move(card,[13.65,14.6,19.3,20.5,D],[[960,660],[960,622],[960,622],[1335,622],[1335,622]]);
 var outcome=X.splitText(c,'Result claim','返回值，直接成为下一步。',72,white,200,235,1600,13.8,19.25);
 var taskPositions=[[1302,736],[580,741],[564,575]],closePositions=[];
 for(var cp=0;cp<3;cp++)closePositions.push([1335+(taskPositions[cp][0]-960)*.65,622+(taskPositions[cp][1]-622)*.65]);
 for(var f=0;f<3;f++){
  N.clean(M.pos(tokens[f]));
  var moveTimes=[.35,3.15,4.5+f*.18,7.95,9.25,13.65],moveValues=[[initialX[f],584],[initialX[f],584],[schemaX[f],588],[schemaX[f],588],[jsonX[f],rowY[f]],[jsonX[f],rowY[f]]];
  // Owner clears the left lane before the task travels upward; no crossed labels.
  if(f===1){moveTimes.push(14.25,14.75);moveValues.push([580,575],taskPositions[f]);}
  if(f===2){moveTimes.push(14.25);moveValues.push([jsonX[f],rowY[f]]);}
  moveTimes=moveTimes.concat([15.3,19.3,20.5,D]);moveValues=moveValues.concat([taskPositions[f],taskPositions[f],closePositions[f],closePositions[f]]);X.move(tokens[f],moveTimes,moveValues);
  X.scale(tokens[f],[.35,13.65,15.3,19.3,20.5,D],[100,100,f===2?114:70,f===2?114:70,f===2?74.1:45.5,f===2?74.1:45.5]);
 }
 var endOne=X.splitText(c,'Close one','从输入，',104,white,110,440,900,19.45,D),endTwo=X.splitText(c,'Close two','到可用的结果。',104,mint,110,587,1100,19.62,D);
 var sig=X.tx(c,'Close call','POST /v1/extract',27,muted,116,770,'Menlo-Regular',20.1,D,true);X.on(sig,20.1,.45,12);
 X.pinHeader(c,'PULSE / API','STRUCTURED OUTPUT',white,muted,'接口与产品为概念示例 · 字段对应附可校验 JSON');
 c.openInViewer();$.writeln('PULSE API created: same values through request, schema, JSON and task.');
})();

(function(){
 var M=MuseNative,r=M.rgb,P=PLAN.cases.brand,D=P.duration,c=U.comp(P.composition,1920,1080,D),cream=r('F2F0E7'),ink=r('182122'),blue=r('3458EF');
 var sky=X.rect(c,'Pale periwinkle stage',1920,1080,r('DCE5F6'),960,540,0,0,D);X.grain(sky,.055);
 var paper=X.rect(c,'Opening paper',1920,1080,cream,960,540,0,0,3.2);X.grain(paper,.055);
 var openOne=X.splitText(c,'Opening one','让想法',172,ink,145,410,1230,.08,2.62),openTwo=X.splitText(c,'Opening two','向前一步。',172,ink,145,650,1450,.25,2.62);
 var mini=X.tx(c,'Opening brand','SHIFT',28,ink,150,146,'HelveticaNeue-Bold',0,2.8,true);X.on(mini,.08,.3,10);
 var note=X.tx(c,'Opening descriptor','A NEW WAY TO CREATE',18,ink,150,878,'HelveticaNeue-Medium',.6,2.7,true);X.on(note,.6,.4,10);
 // The two forward slashes are the mother shape. One expands into the blue field.
 var barA=M.path(c,'Mother shape A',[[0,-300],[145,-300],[-10,300],[-155,300]],blue,null,0,[1505,540],true,0,D);
 var barB=M.path(c,'Mother shape B',[[0,-300],[145,-300],[-10,300],[-155,300]],blue,null,0,[1690,540],true,0,D);
 X.move(barA,[0,2.35,3.0,5.95,6.7,9.45,10.0,12.25,13.2,14.0,D],[[1505,540],[1505,540],[960,540],[960,540],[1395,540],[1395,540],[1395,540],[1395,540],[960,540],[380,495],[380,495]]);
 X.scale(barA,[0,.6,2.35,3.0,5.95,6.7,12.25,13.2,14.0,D],[70,100,100,[2200,1000],[2200,1000],100,100,[2200,1000],[32,44],[32,44]]);
 X.move(barB,[0,2.35,2.95,5.95,6.7,9.45,10,12.25,13.2,14.0,D],[[1690,540],[1690,540],[2350,540],[2350,540],[1590,540],[1590,540],[1590,540],[1590,540],[2350,540],[466,495],[466,495]]);
 X.scale(barB,[0,.6,5.95,6.7,13.2,14,D],[70,100,100,100,100,[32,44],[32,44]]);
 U.key(N.fill(barA),[0,13.2,14.0,D],[blue,blue,cream,cream],'quiet');U.key(N.fill(barB),[0,13.2,14.0,D],[blue,blue,cream,cream],'quiet');
 // A three-band text reveal recombines into one fully readable word.
 var forward=U.comp('SHIFT / Forward word',1920,1080,D,true);U.text(forward,'Forward','向前',380,cream,960,540,'HiraginoSansGB-W6',0,D,true);
 var ranges=[[260,468],[468,615],[615,845]];
 for(var i=0;i<3;i++){
  var slice=U.add(c,forward,'Forward band '+i,960,540,1,3.0,6.2);M.mask(slice,0,ranges[i][0]*2,3840,ranges[i][1]*2);
  X.move(slice,[3.0+i*.055,3.7+i*.055,5.6,6.2],[[960+(i%2?240:-240),540],[960,540],[960,540],[960+(i%2?-160:160),540]]);X.fade(slice,3.0+i*.055,3.25+i*.055,5.85,6.2);
 }
 var line=X.draw(c,'Forward underline',[[395,843],[1470,843],[1428,805],[1470,843],[1428,881]],cream,5,3.55,4.2,6.2);X.fade(line,3.55,3.7,5.9,6.2);
 var sub=X.tx(c,'Forward subtitle','让改变，从一个动作开始。',33,cream,960,929,'HiraginoSansGB-W3',3.8,6.15);X.on(sub,3.8,.4,13);
 var stepOne=X.splitText(c,'Step one','先迈出',166,ink,135,405,1180,6.35,9.75),stepTwo=X.splitText(c,'Step two','那一步。',166,ink,135,635,1300,6.53,9.75);
 var stepSub=X.tx(c,'Step subtitle','MAKE THE FIRST MOVE',20,ink,145,860,'HelveticaNeue-Medium',6.9,9.7,true);X.on(stepSub,6.9,.4,10);
 // Native repeaters create a moving motif field, revealed through large editable type.
 var field=U.comp('SHIFT / Repeated mother shape',2680,1900,D,false);var stripe=M.path(field,'Repeat slash',[[0,0],[120,0],[-20,360],[-140,360]],blue,null,0,[-160,-160],true,0,D);
 N.repeater(stripe,2,[150,0],0);N.repeater(stripe,7,[480,0],0);N.repeater(stripe,6,[0,440],0);
 var climaxBG=X.rect(c,'Climax paper',1920,1080,cream,960,540,0,9.65,12.9);X.grain(climaxBG,.055);
 var word=X.tx(c,'Climax base word','发生',400,ink,960,530,'HiraginoSansGB-W6',9.65,12.9);X.scale(word,[9.65,10.25,12.2,12.9],[87,100,100,113]);
 var pattern=U.add(c,field,'Motion within type',960,540,1.0,9.65,12.9);X.move(pattern,[9.65,12.9],[[800,530],[1180,530]]);
 var mask=X.tx(c,'Climax type matte','发生',400,cream,960,530,'HiraginoSansGB-W6',9.65,12.9);X.scale(mask,[9.65,10.25,12.2,12.9],[87,100,100,113]);pattern.setTrackMatte(mask,TrackMatteType.ALPHA);
 var turn=X.tx(c,'Climax intent','MAKE IT HAPPEN',25,ink,960,836,'HelveticaNeue-Bold',10.1,12.85);X.on(turn,10.1,.4,12);
 // A second expansion of the same slash resolves into the brand lockup.
 var closingBlue=X.rect(c,'Closing blue field',1920,1080,blue,960,540,0,13.0,D);closingBlue.moveAfter(barA);X.grain(closingBlue,.06);
 var transition=M.path(c,'Closing transition from mother shape',[[0,-300],[145,-300],[-10,300],[-155,300]],blue,null,0,[1395,540],true,12.25,13.2);
 M.pos(transition).expression="thisComp.layer('Mother shape A').transform.position";M.scale(transition).expression="thisComp.layer('Mother shape A').transform.scale";
 var close=X.tx(c,'SHIFT wordmark','SHIFT',265,cream,1125,495,'HelveticaNeue-Bold',13.35,D);X.on(close,13.35,.65,38);
 var motto=X.tx(c,'Brand promise','让想法，向前一步。',58,cream,960,744,'HiraginoSansGB-W6',14.1,D);X.on(motto,14.1,.65,26);
 var fine=X.tx(c,'Brand field','CREATE  /  MOVE  /  MAKE',19,cream,960,937,'HelveticaNeue-Medium',14.45,D);X.on(fine,14.45,.5,12);
 X.tx(c,'Concept scope','原创品牌概念 / 动态宣言',14,r('82909C'),960,1044,'HiraginoSansGB-W3',0,D);
 c.openInViewer();$.writeln('SHIFT created: two-slash mother shape, sliced type, native repeaters and alpha matte.');
})();

(function(){
 var M=MuseNative,r=M.rgb,P=PLAN.cases.service,D=P.duration,c=U.comp(P.composition,1080,1920,D),paper=r('F3EDE1'),white=r('FFFDF7'),forest=r('234B3F'),muted=r('7A8275'),line=r('D9DACD'),orange=r('CF6B43'),pale=r('F3E0C7');
 var bg=M.gradient(c,'Warm paper studio',[1080,1920],[280,-100],[1100,1900],0,D,r('FBF8F0'),paper,false);X.grain(bg,.085);
 var light=X.rect(c,'Diffuse paper light',450,2700,r('FFFFFF'),200,580,0,0,D);M.rotation(light).setValue(-22);M.opacity(light).setValue(18);N.fx(light,'Gaussian Blur',{'Blurriness':180,'Repeat Edge Pixels':false});
 X.splitText(c,'Opening one','每一份请求，',77,forest,90,330,940,.15,3.2);X.splitText(c,'Opening two','都值得有回音。',77,forest,90,443,970,.34,3.2);
 // A complete designed service receipt, with one identity throughout the journey.
 var ticket=U.comp('LOOP / Request SR-024',800,660,D,true);U.rect(ticket,'Receipt paper',800,660,white,400,330,22);M.shape(ticket,'Receipt edge','rect',[1598,1318],null,[800,660],44,r('E5DED0'),2,0,D);
 U.rect(ticket,'Left brand strip',10,568,forest,33,330,5);U.text(ticket,'Receipt brand','LOOP',31,forest,74,66,'HelveticaNeue-Bold');U.text(ticket,'Receipt identity','SR-024',29,muted,626,65,'Menlo-Regular');
 U.line(ticket,'Receipt first rule',[[74,113],[739,113]],line,1);U.text(ticket,'Receipt title','换货申请',73,forest,72,201,'HiraginoSansGB-W6');U.text(ticket,'Reason label','申请原因',23,muted,74,292,'HiraginoSansGB-W3');U.text(ticket,'Reason','尺码不合适',37,forest,74,348,'HiraginoSansGB-W3');
 U.text(ticket,'Evidence label','随单资料',23,muted,74,420,'HiraginoSansGB-W3');
 var missing=U.text(ticket,'Evidence pending','商品照片待补充',28,orange,74,474,'HiraginoSansGB-W3',0,10.6);X.fade(missing,0,.3,10.25,10.6);
 var got=U.text(ticket,'Evidence received','已收到：商品照片.jpg',28,forest,74,474,'HiraginoSansGB-W3',10.25,D);X.on(got,10.25,.35,0);
 var statusBand=U.rect(ticket,'Status band',668,75,r('EAF0E5'),408,575,12);var stain=N.fill(statusBand);U.key(stain,[0,6.7,7.0,10.3,10.6,D],[r('EAF0E5'),r('EAF0E5'),pale,pale,r('EAF0E5'),r('EAF0E5')],'quiet');
 var states=[['已提交',0,6.8,forest],['待补充商品照片',6.8,10.6,orange],['资料完整',10.6,14.8,forest],['换货处理中',14.8,18.2,forest],['换货已寄出',18.2,D,forest]];
 for(var si=0;si<states.length;si++){var st=states[si];U.text(ticket,'Request state '+si,st[0],31,st[3],106,574,'HiraginoSansGB-W6',st[1],st[2]);}
 U.text(ticket,'Receipt scope','同一编号 · 持续跟进',17,muted,74,630,'HiraginoSansGB-W3');
 // Folded corner remains a shape and light response, not a bitmap mockup.
 M.path(ticket,'Fold shadow',[[1472,0],[1600,128],[1472,128]],r('E8DFCD'),null,0,[0,0],true,0,D);M.path(ticket,'Fold lit face',[[1472,0],[1600,128],[1472,128]],r('F6EFDF'),r('DAD3C4'),1,[0,0],true,0,D);
 var doc=U.add(c,ticket,'Persistent service request',540,1060,1,.3,D);X.shadow(doc,19,25,65);
 var ts=[.3,1.1,3.15,4.3,5.5,6.8,10.7,12,14.8,16.7,18.2,19.5,20.9,D];
 X.move(doc,ts,[[540,1195],[540,1060],[540,1060],[650,600],[650,600],[650,930],[650,930],[650,1250],[650,1250],[650,1580],[650,1580],[650,1580],[540,1090],[540,1090]]);
 X.scale(doc,ts,[92,100,100,64,64,64,64,64,64,60,60,60,100,100]);U.key(M.rotation(doc),[.3,1.1,3.15,4.3,19.5,20.9,D],[-5,-2,-2,0,0,-1,-1],'travel');X.on(doc,.3,.5,0);
 // Role lane, not a decorative network. Each handoff retains SR-024.
 var y=[600,930,1250,1580],roles=['顾客','客服','仓库','通知'],arrivals=[4.3,6.8,12,16.7],completes=[5.5,10.6,14.8,18.2];
 var route=U.comp('LOOP / Service roles',1080,1920,D,false);
 var basePath=X.line(route,'Responsibility baseline',[[174,600],[174,1580]],line,3,3.2,20.3);X.fade(basePath,3.2,4,19.5,20.3);
 for(var i=0;i<4;i++){
  var nd=X.ring(route,'Role node '+i,174,y[i],112,forest,2,3.2,20.3);X.fade(nd,3.2,4,19.5,20.3);
  var num=X.tx(route,'Role number '+i,'0'+(i+1),28,forest,174,y[i],'Menlo-Regular',3.2,20.3);X.fade(num,3.2,4,completes[i]-.1,completes[i]+.2);
  var who=X.tx(route,'Role name '+i,roles[i],31,forest,174,y[i]+92,'HiraginoSansGB-W6',3.2,20.3);X.fade(who,3.2,4,19.5,20.3);
  var mark=X.checked(route,'Role complete '+i,174,y[i],forest,completes[i],20.3,30);X.fade(mark,completes[i],completes[i]+.25,19.5,20.3);
  if(i){var lineSeg=X.draw(route,'Handoff '+i,[[174,y[i-1]+56],[174,y[i]-56]],forest,4,arrivals[i]-.9,arrivals[i],20.3);X.fade(lineSeg,arrivals[i]-.9,arrivals[i]-.7,19.5,20.3);}
 }
 var rolesLayer=U.add(c,route,'Responsibility lane',540,960,1,3.2,20.3);rolesLayer.moveAfter(doc);
 X.splitText(c,'Follow title','一张申请，持续跟进。',59,forest,90,294,950,3.3,6.65);
 X.splitText(c,'Missing title','补齐，再继续。',76,forest,90,294,960,6.8,11.9);
 X.splitText(c,'Warehouse title','进度，接力向前。',67,forest,90,294,960,12.0,16.5);
 X.splitText(c,'Notice title','结果，主动送达。',67,forest,90,294,960,16.7,19.6);
 // The exception carries an attachment back to the same request, with a visible exit.
 var loop=X.draw(c,'Missing evidence branch',[[230,930],[300,930],[300,1178],[390,1178]],orange,3,7.05,7.75,10.6);X.fade(loop,7.05,7.25,10.2,10.6);
 var attachment=U.comp('LOOP / Attachment',520,180,D,true);U.rect(attachment,'Attachment paper',520,180,white,260,90,17);M.shape(attachment,'Attachment border','rect',[1040,360],null,[520,180],34,r('D0C5AF'),2,0,D);U.rect(attachment,'Picture tile',94,106,pale,76,90,12);
 U.line(attachment,'Picture mountains',[[40,114],[67,82],[86,103],[106,71],[117,114]],orange,3);U.circle(attachment,'Picture sun',13,orange,58,61);U.text(attachment,'Attachment name','商品照片.jpg',29,forest,147,69,'HiraginoSansGB-W6');U.text(attachment,'Attachment label','补充资料 · SR-024',20,muted,147,118,'HiraginoSansGB-W3');
 var file=U.add(c,attachment,'Evidence added',650,1190,1,8.1,10.6);X.shadow(file,14,12,30);X.move(file,[8.1,8.7,9.8,10.6],[[650,1260],[650,1190],[650,1190],[650,1022]]);X.scale(file,[8.1,8.7,9.8,10.6],[92,100,100,59]);X.fade(file,8.1,8.5,10.25,10.6);
 var prompt=X.tx(c,'Evidence explanation','资料回到原申请，流程继续。',27,muted,600,1380,'HiraginoSansGB-W3',8.4,10.8);X.fade(prompt,8.4,8.8,10.4,10.8);
 // A dispatch stamp confirms the illustrated terminal state, without promising timing.
 var sent=U.comp('LOOP / Dispatch mark',300,110,D,true);U.rect(sent,'Dispatch pill',300,110,forest,150,55,55);U.text(sent,'Dispatch type','已寄出  ↗',39,white,150,55,'HiraginoSansGB-W6',0,D,true);
 var stamp=U.add(c,sent,'Dispatch confirmed',760,1770,.72,18.2,19.65);X.on(stamp,18.2,.35,20);X.fade(stamp,18.2,18.4,19.3,19.65);
 X.splitText(c,'End one','每一步，',92,forest,90,337,940,20.0,D);X.splitText(c,'End two','都有回音。',92,forest,90,476,970,20.2,D);
 var ending=X.tx(c,'End brand','LOOP',91,forest,540,1632,'HelveticaNeue-Bold',21,D);X.on(ending,21,.6,25);var tag=X.tx(c,'End service','服务有回音',32,forest,540,1746,'HiraginoSansGB-W3',21.3,D);X.on(tag,21.3,.6,18);
 X.pinHeader(c,'LOOP','SERVICE JOURNEY',forest,muted,'服务流程概念 · 示例申请 SR-024');
 c.openInViewer();$.writeln('LOOP created: one request, missing-evidence return, role handoffs and terminal notice.');
})();

for(var ai=1;ai<=app.project.numItems;ai++){var co=app.project.item(ai);if(co.name==="PULSE / Developer launch"){co.layers.add(app.project.importFile(new ImportOptions(new File("~/Documents/Codex/2026-10-24/gpt-6-astra-mg-mg-mg/work/scene-expansion-v5/rebuild-test/source/audio/api/master.wav"))));break;}}
for(var ai=1;ai<=app.project.numItems;ai++){var co=app.project.item(ai);if(co.name==="SHIFT / Brand manifesto"){co.layers.add(app.project.importFile(new ImportOptions(new File("~/Documents/Codex/2026-10-24/gpt-6-astra-mg-mg-mg/work/scene-expansion-v5/rebuild-test/source/audio/brand/master.wav"))));break;}}
for(var ai=1;ai<=app.project.numItems;ai++){var co=app.project.item(ai);if(co.name==="LOOP / Service journey"){co.layers.add(app.project.importFile(new ImportOptions(new File("~/Documents/Codex/2026-10-24/gpt-6-astra-mg-mg-mg/work/scene-expansion-v5/rebuild-test/source/audio/service/master.wav"))));break;}}
