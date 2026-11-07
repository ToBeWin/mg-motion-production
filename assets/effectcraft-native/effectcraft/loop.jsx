(function(){
 var c=app.project.activeItem,M=MuseNative;
 var bg=M.gradient(c,'Deep navy field',[1920,1080],[1300,500],[300,1100],0,8,M.rgb('244153'),M.rgb('07131D'),true);bg.moveToEnd();
 var names=['Native alloy orbit A','Native copper orbit B','Native porcelain orbit C'];
 for(var i=0;i<3;i++){
  var l=c.layer(names[i]);M.pos(l).setValue([1310,540,0]);l.motionBlur=true;M.scale(l).setValue([125,125,125]);
  l.property('ADBE Transform Group').property('ADBE Rotate X').setValue(65+i*24+20*Math.sin(i));
  l.property('ADBE Transform Group').property('ADBE Rotate Y').setValue(i*25-18+38*Math.sin(i*.7));
  M.rotation(l).setValue(i*35);
  l.property('ADBE Transform Group').property('ADBE Rotate X').expression=(65+i*24)+'+20*Math.sin(time*Math.PI/4+'+i+')';
  l.property('ADBE Transform Group').property('ADBE Rotate Y').expression=(i*25-18)+'+38*Math.sin(time*Math.PI/4+'+(i*.7)+')';
  M.rotation(l).expression=(i*35)+'+time*45';
 }
 M.pos(c.layer('Native core')).setValue([1310,540,0]);
 var cam=N.camera(c,'Native orbital camera');M.pos(cam).setValue([960,555,-2200]);M.pos(cam).expression='[960+40*Math.sin(time*Math.PI/4),540+15*Math.cos(time*Math.PI/4),-2200]';
 M.text(c,'Series','ORBIT / STUDIO',26,M.rgb('B0C9D3'),[260,90],'HelveticaNeue-Medium',0,8);
 M.text(c,'Hero','灵感，自有引力。',78,M.rgb('ECF3EC'),[510,440],'HiraginoSansGB-W6',0,8);
 M.text(c,'Supporting','让创意持续流动。',37,M.rgb('B4CECD'),[400,570],'HiraginoSansGB-W3',0,8);
 M.text(c,'Usage','WEB HERO / SILENT LOOP',21,M.rgb('79949F'),[340,980],'HelveticaNeue',0,8);
 var env=app.project.importFile(new ImportOptions(new File(__ENVIRONMENT_PATH__)));var envLayer=c.layers.add(env);envLayer.name='Studio reflection environment';
 c.duration=16;c.workAreaDuration=8;for(var i=1;i<=c.numLayers;i++)c.layer(i).outPoint=16;
 c.openInViewer();
})();
