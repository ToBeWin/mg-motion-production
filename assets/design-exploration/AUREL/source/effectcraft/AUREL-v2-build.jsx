var ROOT="~/Documents/Codex/2026-10-24/gpt-6-astra-mg-mg-mg/outputs/MG\u98ce\u683c\u63a2\u7d22_\u6620\u5e8fAUREL_v2.1_\u58f0\u97f3\u91cd\u914d/source";var D={"brand": "AUREL / 映序", "thought": "让想象，有形。", "duration": 16, "fps": 30, "colors": {"paper": "F7F5EE", "blue": "244CFF", "ink": "091E91", "accent": "D6F045", "silver": "D5D9E5"}, "parts": [{"name": "left-stem", "points": [[-3, 0], [-1.55, 0], [0, 5.8], [-0.55, 5.8]], "color": "244CFF"}, {"name": "right-stem", "points": [[1.55, 0], [3, 0], [0.55, 5.8], [0, 5.8]], "color": "244CFF"}, {"name": "crossbar", "points": [[-1.94, 2.25], [1.94, 2.25], [1.66, 2.82], [-1.66, 2.82]], "color": "244CFF"}, {"name": "citron-inlay", "points": [[-0.86, 3.87], [0.86, 3.87], [0.73, 4.14], [-0.73, 4.14]], "color": "D6F045"}], "font": "AurelGrotesk-Black", "principle": "The same four authored paths become dimensional sculpture, moving graphic strips and a reconstructed A. The 3D-to-2D transition uses actual projected front-face vertices, not an unrelated wipe."};var PLATES={"unfold": "~/Documents/Codex/2026-10-24/gpt-6-astra-mg-mg-mg/outputs/MG\u98ce\u683c\u63a2\u7d22_\u6620\u5e8fAUREL_v2.1_\u58f0\u97f3\u91cd\u914d/source/blender/unfold.mov", "hero": "~/Documents/Codex/2026-10-24/gpt-6-astra-mg-mg-mg/outputs/MG\u98ce\u683c\u63a2\u7d22_\u6620\u5e8fAUREL_v2.1_\u58f0\u97f3\u91cd\u914d/source/blender/hero.mov"};var PROJECTED={"unfold": {"start": [[[573.8302, 1095.8671], [816.8511, 1162.3876], [1129.4592, -209.8032], [1008.3203, -200.425]], [[1465.2072, 1339.858], [1850.0947, 1445.2106], [1258.1058, -219.7629], [1129.4592, -209.8032]], [[736.3002, 655.7927], [1579.9889, 777.9567], [1511.582, 612.7866], [785.3697, 532.5039]], [[1004.3369, 287.5207], [1376.3323, 303.7743], [1347.3767, 232.3365], [1030.5014, 223.5802]]], "end": [[[507.9218, 863.6778], [662.6415, 887.7912], [705.1263, 110.6059], [636.5524, 121.8853]], [[1271.8744, 982.7411], [1466.6416, 1013.096], [1302.2945, 147.3394], [1220.6976, 129.2234]], [[536.5236, 645.1482], [1065.8282, 583.738], [1006.8607, 499.3119], [553.2987, 558.7993]], [[881.4282, 212.4571], [1110.6462, 223.9902], [1093.2342, 183.7277], [898.0167, 175.0142]]]}, "hero": {"start": [[[565.6793, 914.8007], [756.2676, 914.8007], [960.0, 151.938], [887.6113, 151.938]], [[1163.7324, 914.8007], [1354.3207, 914.8007], [1032.3888, 151.938], [960.0, 151.938]], [[704.3794, 619.2828], [1215.6205, 619.2828], [1178.7556, 544.1792], [741.2444, 544.1792]], [[849.2444, 408.5635], [1070.7556, 408.5635], [1054.0192, 373.7817], [865.9808, 373.7817]]], "end": [[[566.4264, 1000.2664], [790.2287, 1049.8284], [1066.4527, -160.7308], [959.7915, -154.1179]], [[1364.4886, 1177.0008], [1690.5304, 1249.2043], [1178.4384, -167.6738], [1066.4527, -160.7308]], [[716.714, 599.9414], [1459.1953, 686.5428], [1400.1505, 546.2506], [761.335, 489.4204]], [[954.4275, 272.0566], [1281.6146, 283.6215], [1256.1947, 221.9222], [977.6141, 215.6975]]]}};
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

(function(){
var M=MuseNative,C={},k;for(k in D.colors)C[k]=M.rgb(D.colors[k]);
var c=M.comp('AUREL v2 / Picture',1920,1080,16,30),F='AurelGrotesk-Black',H='FOLDHan-Bold';c.shutterAngle=90;
function text(n,str,size,color,x,y,a,b,font){return M.text(c,n,str,size,C[color],[x,y],font||F,a,b);}
function enter(l,a,b,shift){var p=M.pos(l).value;M.key(M.pos(l),[a,a+.55],[[p[0],p[1]+shift],p],{influence:64});M.key(M.opacity(l),[a,a+.25,b-.25,b],[0,100,100,0]);}
function plate(shot,a,b){var f=app.project.importFile(new ImportOptions(new File(PLATES[shot]))),l=M.setup(c.layers.add(f),'Cycles / '+shot,[960,540],a,b);l.startTime=a;l.inPoint=a;l.outPoint=b;M.scale(l).setValue([1920/f.width*100,1080/f.height*100]);l.motionBlur=false;return l;}
M.rect(c,'Chalk ivory / continuous environment',[1920,1080],C.paper,[960,540],0,0,16);
var p=plate('unfold',0,4.8);M.key(M.opacity(p),[4.52,4.8],[100,0]);
var hero=plate('hero',10.8,16);M.key(M.opacity(hero),[10.8,11.12],[0,100]);
var intro=text('Opening / SHIFT','SHIFT',102,'ink',284,437,.4,2.7);enter(intro,.4,2.7,32);
intro=text('Opening / YOUR VIEW','YOUR VIEW.',61,'ink',291,550,.65,2.7);enter(intro,.65,2.7,28);
var starts=PROJECTED.unfold.end,ends=PROJECTED.hero.start;
var bands=[
 [[-100,455],[1810,455],[1730,170],[-100,170]],
 [[100,790],[2020,790],[2020,505],[180,505]],
 [[120,902],[1650,902],[1750,858],[180,858]],
 [[1690,970],[1800,970],[1800,835],[1690,835]]
];
var frames=[
 [[100,960],[250,960],[460,180],[310,180]],
 [[1440,960],[1590,960],[1820,180],[1670,180]],
 [[350,916],[1360,916],[1410,862],[400,862]],
 [[1030,242],[1600,242],[1625,190],[1055,190]]
];
var times=[4.55,4.95,5.65,6.95,8.1,9.1,10.7,11.14];
function states(i){return [starts[i],starts[i],bands[i],bands[i],frames[i],frames[i],ends[i],ends[i]];}
function shapeKeys(prop,i){var ss=states(i),v=[];for(var j=0;j<ss.length;j++)v.push(N.shape(ss[j],true));M.key(prop,times,v,{influence:65});}
for(var i=0;i<4;i++){
 var l=M.path(c,'Morph / '+D.parts[i].name,starts[i],C[i===3?'accent':'blue'],null,0,[0,0],true,4.55,11.14);
 shapeKeys(N.pathProp(l),i);M.key(M.opacity(l),[4.55,4.8,10.8,11.14],[0,100,100,0]);
}
// Full-resolution text is clipped by exactly the same animated polygon as its carrier.
for(i=0;i<2;i++){
 var wc=M.comp('AUREL v2 / '+(i===0?'MAKE':'SPACE'),1920,1080,16,30);
 M.text(wc,'Editable bold type',i===0?'MAKE':'SPACE.',260,C.paper,[i===0?910:1090,i===0?315:650],F,0,16);
 var wl=M.setup(c.layers.add(wc),'Type inside moving geometry / '+i,[960,540],5.25,7.8);
 var mask=wl.property('ADBE Mask Parade').addProperty('ADBE Mask Atom');shapeKeys(mask.property('ADBE Mask Shape'),i);
 M.key(M.opacity(wl),[5.25,5.6,7.0,7.7],[0,100,100,0]);
}
var more=text('Negative space / Chinese','更多可能。',126,'ink',960,450,7.65,9.45,H);enter(more,7.65,9.45,35);
more=text('Negative space / English','MORE TO CREATE.',39,'ink',960,626,7.9,9.45);enter(more,7.9,9.45,18);
// Final composition follows the designed crop; each line has its own breathing room.
var t=text('Closing / SHIFT','SHIFT',112,'ink',301,700,12.1,16);enter(t,12.1,16,30);
t=text('Closing / YOUR VIEW','YOUR VIEW.',75,'ink',336,814,12.35,16);enter(t,12.35,16,25);
t=text('Closing / Chinese thought','让想象，有形。',34,'ink',290,930,14.4,16,H);enter(t,14.4,16,12);
for(var j=1;j<=c.numLayers;j++){var q=c.layer(j);if(q.name.indexOf('Closing /')===0){var op=M.opacity(q);if(op.numKeys>=4){op.removeKey(op.numKeys);op.removeKey(op.numKeys);}}}
text('Identity / AUREL','AUREL',58,'ink',233,103,0,16);
N.line(c,'Identity / rule',[[400,103],[620,103]],C.ink,1.3,0,16);
N.line(c,'Identity / registration',[[662,91],[662,115],[662,103],[650,103],[674,103]],C.ink,1.3,0,16);
text('Identity / 映序','映序',25,'ink',1732,104,0,16,H);
})();

var CAPTIONS=[{"id": "01", "text": "换个视角。", "start": 0.75, "end": 1.7039166666666667, "source": "take-01.wav", "source_in": 0.254625, "source_out": 1.2085416666666666, "file": "voice-01.wav", "gain_db": 14.158705252191668}, {"id": "02", "text": "让想象，有形。", "start": 12.5, "end": 14.153833333333333, "source": "take-02.wav", "source_in": 0.2629375, "source_out": 1.9167708333333333, "file": "voice-02.wav", "gain_db": 13.54859548997036}];
(function(){var M=MuseNative,pic=null;for(var i=1;i<=app.project.numItems;i++)if(app.project.item(i).name==='AUREL v2 / Picture')pic=app.project.item(i);
 for(var v=0;v<3;v++){var c=M.comp(v===0?'AUREL v2 / Voice':v===1?'AUREL v2 / 中文字幕':'AUREL v2 / Music',1920,1080,16,30);M.setup(c.layers.add(pic),'Native picture',[960,540],0,16);var f=v===2?'master-music.wav':'master-voice.wav';M.setup(c.layers.add(app.project.importFile(new ImportOptions(new File(ROOT+'/audio/'+f)))),'Audio / '+f,null,0,16);
 if(v===1)for(var j=0;j<CAPTIONS.length;j++){var q=CAPTIONS[j],l=M.text(c,'Caption / '+q.id,q.text,32,M.rgb('091E91'),[330,1014],'FOLDHan-Regular',Math.floor(q.start*30)/30,Math.ceil(q.end*30)/30);l.motionBlur=false;}
 }})();