(function(){
 var M=MuseNative,r=M.rgb,D=20,c=U.comp(PLAN.cases.orbit.composition,1920,1080,D),ink=r('263440'),blue=r('385BB8');
 M.footage(c,'Original Cycles photographic plate',ORBIT_PLATE,1920,[960,540],0,D);
 F.txt(c,'Opening precision label','ORBIT  /  PRECISION STUDY',19,ink,106,89,0,3.95,true,'HelveticaNeue-Medium');
 F.title(c,'Macro opening','细节，自有分寸。',55,ink,108,181,1.5,3.95);
 F.txt(c,'Optical face label','01 / 光学表面',22,ink,110,960,4.25,7.9,true);
 F.txt(c,'Profile label','02 / 精密切边',22,ink,110,960,8.25,11.9,true);
 F.title(c,'Full product line one','每次转动，',65,ink,104,360,12.4,15.9);
 F.title(c,'Full product line two','都恰到好处。',65,ink,104,457,12.6,15.9);
 F.txt(c,'Full product material','金属 · 玻璃 · 光',24,blue,110,636,13.15,15.9,true);
 var name=F.txt(c,'ORBIT wordmark','ORBIT',143,ink,108,358,16.2,D,true,'HelveticaNeue-Medium');X.on(name,16.2,.7,42);
 F.title(c,'ORBIT closing promise','把精密，握在手中。',38,blue,110,517,16.6,D);
 F.txt(c,'Product descriptor','A TACTILE POINT OF VIEW',17,ink,112,654,17.1,D,true,'HelveticaNeue-Medium');
 F.txt(c,'Concept scope','原创硬件设计概念',14,ink,110,1015,17.1,D,true,'HiraginoSansGB-W3');
 c.openInViewer();$.writeln('ORBIT v4: five Cycles shots, native editable type, light studio.');
})();
