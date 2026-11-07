(function(){
 var M=MuseNative,r=M.rgb,ink=r('183F43'),paper=r('EEEFE5'),blue=r('2C777C'),orange=r('D9683E'),muted=r('7B9291');
 var c=M.comp('06 SIGNAL — Explainer',1920,1080,20,30);c.bgColor=paper;c.motionBlurSamplesPerFrame=4;
 M.rect(c,'Paper',[1920,1080],paper,[960,540]);
 function tx(name,str,size,color,x,y,a,b,font){return M.text(c,name,str,size,color,[x,y],font||'HiraginoSansGB-W6',a||0,b||20);}
 tx('Series','SIGNAL / 知识可视化',25,ink,280,80);tx('Index','EXPLAIN / 06',20,muted,1640,80,0,20,'HelveticaNeue');
 var title=tx('Title','声音，怎样成为数字？',69,ink,960,195,0,16.6);N.reveal(title,0,.8,35);M.key(M.opacity(title),[0,15.8,16.6],[100,100,0]);
 function section(n,a,b,head,sub){var l=tx('Step '+n,n,79,blue,204,392,a,b,'HelveticaNeue-Light');N.reveal(l,a,a+.5,30);M.key(M.opacity(l),[a,b-.35,b],[100,100,0]);l=tx('Explain '+n,head,39,ink,220,510,a,b);N.reveal(l,a+.12,a+.65,30);M.key(M.opacity(l),[a,b-.35,b],[100,100,0]);l=tx('Detail '+n,sub,24,muted,220,582,a,b);M.key(M.opacity(l),[a,a+.6,b-.35,b],[0,100,100,0]);}
 section('01',0,5,'连续变化','先看完整的波形');section('02',5,9,'等间隔采样','记录每个时刻的值');section('03',9,12.8,'分级量化','取最接近的等级');section('04',12.8,16.6,'二进制编码','把等级写成数字');
 var left=470,right=1770,base=570,amp=175;
 function signal(u,phase){return .73*Math.sin(u*Math.PI*2*1.4+phase)+.22*Math.sin(u*Math.PI*2*3.2+.6+phase);}
 function vertices(phase){var p=[];for(var i=0;i<=180;i++){var u=i/180;p.push([left+(right-left)*u,base-amp*signal(u,phase)]);}return p;}
 var axis=N.line(c,'Time axis',[[left,base],[right,base]],r('C3D0C8'),2,0,12.8);N.trim(axis,0,.7);M.key(M.opacity(axis),[0,12.2,12.8],[100,100,0]);
 var wave=N.line(c,'Continuous waveform',vertices(0),blue,7,0,8.6);N.trim(wave,.35,1.6);
 M.key(N.pathProp(wave),[0,1.3,2.7,4.2,8.6],[N.shape(vertices(.4),false),N.shape(vertices(-.35),false),N.shape(vertices(.2),false),N.shape(vertices(0),false),N.shape(vertices(0),false)]);
 M.key(M.opacity(wave),[0,5.1,6.3,8.6],[100,100,22,0]);
 var grid=M.path(c,'Native grid repeater',[[left,base-amp],[right,base-amp]],null,r('C5D1CA'),1,[0,0],false,8.7,12.8);N.repeater(grid,16,[0,amp*2/15],0);M.key(M.opacity(grid),[8.7,9.4,12.2,12.8],[0,75,75,0]);
 for(var j=0;j<4;j++){var q=j*5;var l=tx('Quantization level '+q,String(q),20,muted,425,base+amp-q/15*amp*2,8.9,12.8,'HelveticaNeue');M.key(M.opacity(l),[8.9,9.4,12.2,12.8],[0,100,100,0]);}
 var nums=[];
 for(var i=0;i<16;i++){
  var u=i/15,x=left+(right-left)*u,value=signal(u,0),y=base-amp*value,q=Math.round((value+1)*7.5),qy=base+amp-q/15*amp*2;nums.push(q);
  var stem=N.line(c,'Sample stem '+i,[[x,base],[x,y]],blue,2,5+i*.035,12.8);N.trim(stem,5+i*.035,5.65+i*.035);M.key(N.pathProp(stem),[8.85,9.5],[N.shape([[x,base],[x,y]],false),N.shape([[x,base],[x,qy]],false)]);M.key(M.opacity(stem),[5+i*.035,11.9,12.8],[55,55,0]);
  var sx=530+i%8*167,sy=480+Math.floor(i/8)*218;
  var dot=M.rect(c,'Sample to code cell '+i,[18,18],blue,[x,y],9,4.8+i*.035,16.6);
  M.key(M.pos(dot),[4.8,8.85,9.5,12.05+i*.025,13.3+i*.025,16.6],[[x,y],[x,y],[x,qy],[x,qy],[sx,sy],[sx,sy]]);
  M.key(M.shapeSize(dot),[4.8,12.05+i*.025,13.3+i*.025],[[18,18],[18,18],[146,104]]);M.key(M.roundness(dot),[4.8,12.05,13.3],[9,9,17]);
  M.key(N.fill(dot),[8.85,9.5],[blue,orange]);M.key(M.opacity(dot),[4.8+i*.035,5.2+i*.035,16,16.6],[0,100,100,0]);
  var binary=('0000'+q.toString(2)).slice(-4);var bits=tx('Binary '+i,binary,33,r('FFF6E9'),sx,sy,13+i*.025,16.6,'Menlo-Regular');N.reveal(bits,13+i*.025,13.7+i*.025,12);M.key(M.opacity(bits),[13,16,16.6],[100,100,0]);
  var decimal=tx('Decimal '+i,String(q),22,muted,sx,sy+83,13.5+i*.025,16.6,'HelveticaNeue');M.key(M.opacity(decimal),[13.5+i*.025,14+i*.025,16,16.6],[0,100,100,0]);
 }
 var note=tx('Four bits note','4 bit 示例：16 个量化等级',28,ink,1115,884,9,16.6);M.key(M.opacity(note),[9,9.7,16,16.6],[0,100,100,0]);
 tx('Disclaimer','原理示意 · 低采样数用于解释，不代表真实音频保真度',20,muted,960,1014,0,20);
 var final=tx('Final','把连续，变成可计算。',84,ink,960,465,16.5,20);N.reveal(final,16.5,17.3,45);
 var stages=['采样','量化','编码'];for(var i=0;i<3;i++){var l=tx('Review '+i,stages[i],39,blue,610+i*350,630,17+i*.13,20);N.reveal(l,17+i*.13,17.6+i*.13,24);if(i<2){var arrow=N.line(c,'Review arrow '+i,[[725+i*350,630],[845+i*350,630],[830+i*350,618]],orange,3,17.3+i*.13,20);N.trim(arrow,17.3+i*.13,17.9+i*.13);}}
 c.openInViewer();
})();
