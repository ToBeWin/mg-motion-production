var picture=E.comp('Picture');
E.background(picture);
for(var i=0;i<CFG.cases.length;i++)E.caseScene(picture,CFG.cases[i]);
var timeline=E.tour(picture);
E.close(picture);
var captions=E.comp('Captions');
for(var j=0;j<CFG.captions.length;j++){
 var r=CFG.captions[j];var l=E.txt(captions,'VO '+r.id,r.text,33,960,1013,'secondary',r.start,r.end,true);l.motionBlur=false;
}
var final=E.comp('Delivery');E.sub(final,picture,'Editable picture',960,540,0,CFG.duration);E.sub(final,captions,'Transparent sentence captions',960,540,0,CFG.duration);
$.writeln(JSON.stringify({variant:CFG.variant,layers:MuseNative.count.layers,timeline:timeline}));
