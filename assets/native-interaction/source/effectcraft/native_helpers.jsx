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
