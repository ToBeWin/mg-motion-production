/* A component verification reel, not a finished advertising film. */
var M=MuseNative,K=ScenarioModules,scenes=[];
function scene(id,title,sub){var c=M.comp(id,1280,720,6,30);c.bgColor=M.rgb('F2F4F7');K.left(K.text(c,'Component title',title,34,[82,100]));K.left(K.text(c,'Component description',sub,18,[82,155],K.palette.muted));K.left(K.text(c,'Scope','组件验证 · 需结合实际素材重新设计',14,[82,674],K.palette.muted));scenes.push(c);return c;}
var c=scene('focus-highlight','焦点高亮','同一焦点从任务区域移动到可用结果');
var labels=['输入资料','生成摘要','导出报告'];
for(var i=0;i<3;i++){M.rect(c,'Example card '+i,[300,220],K.palette.white,[260+i*380,385],20,0,6);K.text(c,'Example label '+i,labels[i],28,[260+i*380,385]);}
K.focus(c,[260,385,320,240],[1020,385,320,240],1,4.5);
c=scene('workflow-handoff','任务交接','同一个任务跨越三个职责，保留身份');K.handoff(c,['收集需求','处理内容','交付结果'],[[240,350],[640,350],[1040,350]],.8,4.8);
c=scene('data-compare','同尺度数据对比','演示数据 / 分 · 两组数值共享 0–100 标尺');K.compare(c,[{label:'方案 A',value:64},{label:'方案 B',value:92}],100,1,3.5);
c=scene('route-draw','路径与端点','路线示意，非地理底图；标记沿同一路径移动');
var pts=[[160,470],[450,470],[700,290],[1080,290]];K.route(c,pts,.6,5);
for(var i=0;i<pts.length;i++){M.circle(c,'Station '+i,10,K.palette.ink,pts[i],0,6);K.text(c,'Station name '+i,['起点','交接','检查','终点'][i],22,[pts[i][0],pts[i][1]+43]);}
c=scene('title-banner','可复用姓名与主题条','入场、驻留与退出分别可调；字段保持可编辑');K.banner(c,'姓名字段 · 可替换','职位 / 栏目 / 主题信息',.25,4.7,5.8);
c=scene('countdown','倒计时与交接','数字、进度与结束状态使用同一时钟');K.countdown(c,5,0,1);
var master=M.comp('MG_SCENARIO_COMPONENTS',1280,720,36,30);master.bgColor=M.rgb('F2F4F7');
for(var i=0;i<scenes.length;i++){var l=master.layers.add(scenes[i]);l.startTime=i*6;l.inPoint=i*6;l.outPoint=(i+1)*6;}
master.openInViewer();'Six native components created';
