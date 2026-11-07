/* Authored light stages. Backgrounds remain native, independent of chart geometry. */
var B=(function(){
 var M=MuseNative,r=M.rgb;
 function find(group,name){for(var i=1;i<=group.numProperties;i++){var p=group.property(i);if(p.name===name)return p;if(p.numProperties){var child=find(p,name);if(child)return child;}}return null;}
 function grain(l,intensity){var e=l.property('ADBE Effect Parade').addProperty('Add Grain');var values={'Viewing Mode':3,'Intensity':intensity,'Size':0.65,'Monochromatic':true,'Animation Speed':0,'Random Seed':37};for(var name in values){var p=find(e,name);if(!p)throw new Error('Missing native grain property: '+name);p.setValue(values[name]);}return e;}
 function softShape(c,name,pts,col,opacity,blur){var l=U.line(c,name,pts,r(col),0,0,c.duration);var ct=N.ct(l);var p=ct.property('ADBE Vector Shape - Group').property('ADBE Vector Shape');var sh=p.value;sh.closed=true;p.setValue(sh);var f=ct.addProperty('ADBE Vector Graphic - Fill');f.property('ADBE Vector Fill Color').setValue(r(col));M.opacity(l).setValue(opacity);N.fx(l,'Gaussian Blur',{'Blurriness':blur,'Repeat Edge Pixels':false});l.motionBlur=false;return l;}
 function rim(l,col,opacity){var s=N.ct(l).addProperty('ADBE Vector Graphic - Stroke');s.property('ADBE Vector Stroke Color').setValue(r(col));s.property('ADBE Vector Stroke Width').setValue(1.2);s.property('ADBE Vector Stroke Opacity').setValue(opacity);return l;}
 function graphite(parent,d){
  var c=U.comp('Stage / Graphite light',1920,1080,d),base=M.gradient(c,'Neutral graphite',[1920,1080],[1040,-220],[840,1120],0,d,r('45494B'),r('101418'),false);
  grain(base,0.12);
  var sweep=softShape(c,'Broad warm studio bounce',[[-450,-500],[200,-500],[1780,1300],[950,1500]],'A2A39E',16,180);
  U.key(M.pos(sweep),[0,14.2,15.2,20.4,21.3,d],[[0,0],[0,0],[95,-20],[95,-20],[170,-15],[170,-15]],'quiet');
  var flag=softShape(c,'Soft flag at right',[[1620,-350],[2350,-350],[2440,1500],[900,1500]],'05080B',28,145);
  U.key(M.pos(flag),[0,14.2,15.2,20.4,21.3,d],[[0,0],[0,0],[30,0],[30,0],[145,0],[145,0]],'quiet');
  var horizon=M.gradient(c,'Low reflected fill',[1920,1080],[960,1080],[960,510],0,d,r('525B5C'),r('11161A'),false);M.opacity(horizon).setValue(16);
  var result=U.add(parent,c,'Graphite stage',960,540,1);result.motionBlur=false;return result;
 }
 function paper(parent,d){
  var c=U.comp('Stage / Porcelain paper',1920,1080,d),base=M.gradient(c,'Daylight ground',[1920,1080],[820,330],[1800,1030],0,d,r('FCFCFA'),r('D9DEE5'),true);
  grain(base,0.075);
  var light=softShape(c,'Wide window wash',[[450,-650],[1150,-650],[2440,1200],[1300,1450]],'FFFFFF',70,155);
  U.key(M.pos(light),[0,5.5,6.45,16.35,17.15,20.5,21.15,d],[[0,0],[0,0],[-80,0],[-80,0],[55,0],[55,0],[110,-15],[110,-15]],'quiet');
  var shadow=softShape(c,'Cool peripheral shade',[[-500,250],[-140,-150],[650,1300],[-500,1300]],'95A6BC',9,180);
  var warm=M.gradient(c,'Warm reflected daylight',[1920,1080],[600,100],[1500,950],0,d,r('FFF9EC'),r('E7EBF1'),true);M.opacity(warm).setValue(15);
  var result=U.add(parent,c,'Paper',960,540,1);result.motionBlur=false;return result;
 }
 function cobalt(l){var e=N.fx(l,'Gradient Ramp',{'Start of Ramp':[200,80],'End of Ramp':[1800,1050],'Start Color':r('405AE8'),'End Color':r('121B50'),'Ramp Shape':1});grain(l,0.1);return e;}
 return {graphite:graphite,paper:paper,rim:rim,cobalt:cobalt,grain:grain};
})();
