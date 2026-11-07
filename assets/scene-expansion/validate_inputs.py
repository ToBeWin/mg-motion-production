"""Validate the fixed authored fixture and prevent silent source/film mismatch."""
from pathlib import Path
import json
import wave

def validate(folder):
    plan = json.loads((folder/'production-plan.json').read_text())
    api = json.loads((folder/'data/api-example.json').read_text())
    flow = json.loads((folder/'data/service-flow.json').read_text())
    expected = {'api': (24, [1920,1080]), 'brand': (18, [1920,1080]), 'service': (26, [1080,1920])}
    if plan['fps'] != 30 or set(plan['cases']) != set(expected):
        raise ValueError('This authored example has three 30 fps films; redesign JSX before changing the layout contract.')
    for key, (duration, size) in expected.items():
        case = plan['cases'][key]
        if (case['duration'], case['size']) != (duration, size):
            raise ValueError(f'{key}: duration and size must match the authored JSX.')
        times = [c['time'] for c in case['cues']]
        if times != sorted(times) or not all(0 <= t < duration for t in times):
            raise ValueError(f'{key}: cues must be ordered and inside the film.')
        cues = json.loads((folder/'audio'/key/'cues.json').read_text())
        if cues['cues'] != case['cues'] or cues['focus'] != case['focus'] or cues['bpm'] != case['bpm']:
            raise ValueError(f'{key}: regenerate audio after editing cues, focus or BPM.')
        with wave.open(str(folder/'audio'/key/'master.wav')) as audio:
            if audio.getnchannels() != 2 or abs(audio.getnframes()/audio.getframerate()-duration) > .03:
                raise ValueError(f'{key}: master audio must be stereo and match the film duration.')
    keys = ['due_text', 'owner', 'task']
    if list(api['request']['schema']) != keys or list(api['response']) != keys or any(v != 'string' for v in api['request']['schema'].values()):
        raise ValueError('The three illustrated fields must match the request schema and response.')
    values = api['response']
    if not all(isinstance(v, str) and v for v in values.values()):
        raise ValueError('All illustrated values must be nonempty strings.')
    if api['request']['text'] != values['due_text']+'，'+values['owner']+'完成'+values['task']+'。':
        raise ValueError('Input sentence must match the authored extraction example.')
    if api['request_id'] != 'req_024':
        raise ValueError('Update the request/result identities in JSX before changing the fixture ID.')
    sequence = [(0.4,'顾客','已提交'),(6.8,'客服','待补充商品照片'),(9.8,'顾客','商品照片已补充'),(10.6,'客服','资料完整'),(14.8,'仓库','换货处理中'),(18.2,'通知','换货已寄出')]
    if flow['request_id'] != 'SR-024' or flow['reason'] != '尺码不合适' or [(e['time'], e['role'], e['state']) for e in flow['sequence']] != sequence:
        raise ValueError('The service fixture documents a fixed authored story. Update JSX and cues together when redesigning it.')
    return {'cases': list(expected), 'fixtures': 'matched', 'audio': 'present_and_cues_matched', 'scope': 'Source consistency only; no live API or service execution.'}

if __name__ == '__main__':
    print(json.dumps(validate(Path(__file__).resolve().parent), ensure_ascii=False))
