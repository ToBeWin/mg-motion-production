#!/usr/bin/env python3
"""Select a scenario recipe and create an editable production brief, not a film."""
import argparse
import json
import math
from pathlib import Path
from compile_cues import compile_plan

ROOT=Path(__file__).resolve().parents[1]
SIZES={'16:9':(1920,1080),'9:16':(1080,1920),'1:1':(1080,1080),'4:5':(1080,1350)}
def catalog():return json.loads((ROOT/'assets/scenario-catalog.json').read_text())

def allocate(total,weights):
    if total<len(weights):raise ValueError('时长不足以给每个叙事段分配一帧；请重组镜头链。')
    # A frame per beat; distribute the remainder without drifting past the end.
    rest=total-len(weights);exact=[rest*w/sum(weights) for w in weights]
    values=[1+math.floor(v) for v in exact]
    order=sorted(range(len(weights)),key=lambda i:exact[i]-math.floor(exact[i]),reverse=True)
    for i in order[:total-sum(values)]:values[i]+=1
    return values

def make_plan(data,scene,title,duration,fps,aspect,style,silent,size=None):
    if not math.isfinite(duration) or duration<=0:raise ValueError('时长须为正的有限数值。')
    if not 1<=fps<=120:raise ValueError('本规划器的 fps 须为 1–120 的整数。')
    if style not in data['styles']:raise ValueError(f'未知风格：{style}')
    width,height=size or SIZES[aspect]
    if width<1 or height<1:raise ValueError('画幅尺寸须为正整数。')
    total=round(duration*fps);actual=total/fps
    frames=allocate(total,[b['weight'] for b in scene['beats']]);shots=[];markers={};cues=[];warnings=[];start=0
    silent=silent or scene['silent']
    for beat,count in zip(scene['beats'],frames):
        a,b=start/fps,(start+count)/fps;key=beat['id'];markers[key]=round(a,8)
        shot=dict(id=key,start=round(a,8),end=round(b,8),start_frame=start,end_frame_exclusive=start+count,
                  purpose=beat['purpose'],visual=beat['visual'],continuity=beat['continuity'],
                  reading_seconds=beat['reading_seconds'],asset_refs=[],status='planned')
        if count/fps<beat['reading_seconds']:
            warnings.append(f"{key} 分配 {count/fps:.2f}s，低于该配方的阅读建议 {beat['reading_seconds']}s；制作时删减内容或重排时长。")
        shots.append(shot)
        if not silent and a>0:
            cues.append(dict(id=key+'_cue',anchor=key,type=beat['sound'],duration=round(min(.3,count/fps*.45),8),
                             intent=beat['purpose'],status='timing_suggestion_not_audio'))
        start+=count
    if style not in scene['styles']:warnings.append('所选风格不在此配方的常用组合中；保留场景证据链，先验证关键画面。')
    if width<height:
        layout='竖屏重新构图：复杂并排关系改为分步接力；放大关键操作与结果，保留定位锚点，按目标渠道核对遮挡区。'
    elif width==height:
        layout='方形重排：保持主对象与标签的中心关系，限制横向展开，重新安排长文字和 CTA。'
    else:
        layout='横向构图：主动作与可读结果建立层级；多屏 / LED 项目另按真实像素与拼接位置布局。'
    style_config=data['styles'][style]
    example_ids=list(dict.fromkeys(scene['evidence']+style_config.get('evidence',[])))
    checks=list(dict.fromkeys(scene['checks']+style_config.get('checks',[])))
    plan=dict(schema_version='1.0',title=title,scenario=scene['id'],status='production_plan_draft',
                scope='这是可编辑制作规划，不是已渲染视频；事实、素材和产品状态按本次任务核实。',
                duration=round(actual,8),requested_duration=duration,fps=fps,total_frames=total,
                canvas=dict(width=width,height=height,aspect=aspect if not size else 'custom'),layout=layout,
                style=dict(id=style,**data['styles'][style]),engine=style_config.get('engine',scene['engine']),
                inputs=[dict(id=f'asset_{i+1}',requirement=x,status='resolve_from_context_or_collect') for i,x in enumerate(scene['inputs'])],
                shots=shots,markers=markers,cues=cues,silent=silent,checks=checks,avoid=scene['avoid'],
                reusable_components=scene['components'],related_examples=[data['evidence'][k] for k in example_ids],
                warnings=warnings)
    motion_library=style_config.get('motion_recipe_library')
    if motion_library:
        source=json.loads((ROOT/motion_library['path']).read_text())
        plan['reference_motion_recipes']=source['groups'][motion_library['group']]
    component_library=style_config.get('component_recipe_library')
    if component_library:
        source=json.loads((ROOT/component_library['path']).read_text())
        plan['component_blueprints']=source['components']
    enhancement=style_config.get('interaction_motion_profile')
    if enhancement:
        source=json.loads((ROOT/enhancement['path']).read_text())
        plan['shared_motion_enhancements']={
            'guide':source['guide'],
            'effect_families':source['effect_families'],
            'shared_checks':source['shared_checks'],
            'style_choreography':source['styles'][enhancement['style']],
            'implementation':source['implementation'],
        }
        plan['checks']=list(dict.fromkeys(plan['checks']+source['shared_checks']))
    return plan

def brief(plan):
    text=[f"# {plan['title']} · 制作规划",'',plan['scope'],'',
          f"场景：`{plan['scenario']}` · {plan['duration']:g}s / {plan['fps']}fps · {plan['canvas']['width']}×{plan['canvas']['height']}",
          f"视觉：{plan['style']['name']} · 工具候选：{plan['engine']}",'',
          '## 素材与事实','',*['- '+x['requirement'] for x in plan['inputs']],'',
          '能从当前任务找到的直接使用；缺少的产品事实不要编造。先标明哪些是概念，哪些有证据。','',
          '## 镜头链','', '| 时间 | 目的 | 画面变化 | 连续关系 |','|---|---|---|---|']
    for s in plan['shots']:text.append(f"| {s['start']:.2f}–{s['end']:.2f}s | {s['purpose']} | {s['visual']} | {s['continuity']} |")
    text+=['','## 视觉与画幅','',plan['style']['assets']+'。'+plan['style']['motion']+'。',plan['layout'],'',
           '## 声音','', '无声版本，信息不依赖声音。' if plan['silent'] else 'cues.json 是与命名视觉标记绑定的声音时间建议，不是已生成的配乐；按实际动作修订并混音。','',
           '## 本场景检查','',*['- '+x for x in plan['checks']],'','应避免：'+plan['avoid'],'',
           '## 下一步','', '用本次产品、数据与素材替换规划描述；选关键画面，做最难连接的预演，再执行动画、声音与导出。已有相关样片的认可不会自动转移到新项目。']
    if plan['style'].get('guide'):
        text+=['','## 此风格的制作依据','',f"读取 Skill 内的 `{plan['style']['guide']}`，按本次品牌、内容与画幅应用；关联案例在 production-plan.json 的 related_examples 中，案例数据不是本次项目事实。"]
    if plan.get('shared_motion_enhancements'):
        profile=plan['shared_motion_enhancements'];route=profile['style_choreography']
        text+=['','## 输入、指针与 MG 共用能力','',
               f"读取 `{profile['guide']}`。共有制作检查已合并至本场景检查；按本风格安排动作，不默认把所有效果堆进同一镜。",'',
               *[f'- **{label}：** {route[field]}' for label,field in [
                   ('输入交接','input_handoff'),('指针与引导','cursor_attention'),
                   ('MG 句式','motion_sequence'),('空间与节奏','space_rhythm'),
                   ('声音','sound'),('注意','avoid')]],'',
               '本输出为制作规划；实际交互、渲染和声音需要针对本次素材制作与核验。']
    if plan.get('component_blueprints'):
        text+=['','## 可选组件蓝图','',
               'production-plan.json 包含以下组件的分层、状态、锚点、参考时间码和实现范围。按本次镜头选择，不默认全部制作；蓝图数量不代表即用成品数量。','',
               *[f"- {q['id']} · {q['name']}：{' → '.join(q['states'])}" for q in plan['component_blueprints']]]
    if plan.get('reference_motion_recipes'):
        text+=['','## 参考动作句式','',
               '以下方法保留原片依据与已实现范围，按本次内容重新设计节奏和声音；完整结构在 production-plan.json。','',
               *[f"- {q['id']} · {q['name']}：{q['motion_sequence']}" for q in plan['reference_motion_recipes']]]
    if plan['warnings']:text+=['','## 需要调整的规划项','',*['- '+x for x in plan['warnings']]]
    return '\n'.join(text)+'\n'

def main():
    ap=argparse.ArgumentParser(description=__doc__);ap.add_argument('--list',action='store_true');ap.add_argument('--show');ap.add_argument('--scenario');ap.add_argument('--title');ap.add_argument('--duration',type=float);ap.add_argument('--fps',type=int,default=30);ap.add_argument('--aspect',choices=SIZES,default='16:9');ap.add_argument('--size',help='自定义 WIDTHxHEIGHT');ap.add_argument('--style');ap.add_argument('--silent',action='store_true');ap.add_argument('--out',type=Path)
    args=ap.parse_args();data=catalog();scenes={s['id']:s for s in data['scenarios']}
    if args.list:
        for s in scenes.values():print(f"{s['id']:24} {s['family']} / {s['title']}")
        return
    if args.show:
        if args.show not in scenes:ap.error('未知场景；用 --list 查看。')
        print(json.dumps(scenes[args.show],ensure_ascii=False,indent=2));return
    if args.scenario not in scenes or not args.out:ap.error('需要有效的 --scenario 与 --out；用 --list 查看。')
    scene=scenes[args.scenario]
    try:
        size=tuple(int(x) for x in args.size.lower().split('x')) if args.size else None
        if size and len(size)!=2:raise ValueError('--size 格式为 WIDTHxHEIGHT')
        plan=make_plan(data,scene,args.title or scene['title'],args.duration if args.duration is not None else scene['default_duration'],args.fps,args.aspect,args.style or scene['styles'][0],args.silent,size)
        compiled=compile_plan(plan)
        out=args.out.expanduser().resolve()
        if out.exists() and (not out.is_dir() or any(out.iterdir())):raise ValueError('输出目录非空，请使用新的版本目录；未覆盖已有文件。')
        out.mkdir(parents=True,exist_ok=True)
        (out/'production-plan.json').write_text(json.dumps(plan,ensure_ascii=False,indent=2)+'\n')
        (out/'cues.json').write_text(json.dumps(compiled,ensure_ascii=False,indent=2)+'\n')
        (out/'brief.md').write_text(brief(plan))
        print(json.dumps(dict(out=str(out),scenario=scene['id'],frames=plan['total_frames'],warnings=plan['warnings'],rendered=False),ensure_ascii=False))
    except (ValueError,TypeError) as e:ap.error(str(e))

if __name__=='__main__':main()
