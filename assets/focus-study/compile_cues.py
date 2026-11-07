#!/usr/bin/env python3
"""Resolve sound cues from named visual markers; validate bounds, IDs and shots."""
import argparse
import json
import math
from pathlib import Path


def number(value, label):
    if isinstance(value, bool) or not isinstance(value, (int, float)) or not math.isfinite(value):
        raise ValueError(f'{label} must be a finite number')
    return value


def compile_plan(plan):
    duration = number(plan['duration'], 'duration')
    fps = number(plan['fps'], 'fps')
    if duration <= 0 or fps <= 0:
        raise ValueError('duration and fps must be positive')
    markers = plan['markers']
    for name, time in markers.items():
        if not 0 <= number(time, name) < duration:
            raise ValueError(f'Marker outside film: {name}')
    seen = set()
    for shot in plan.get('shots', []):
        if shot['id'] in seen:
            raise ValueError(f'Duplicate shot: {shot["id"]}')
        seen.add(shot['id'])
        a, b = number(shot['start'], 'shot start'), number(shot['end'], 'shot end')
        if not 0 <= a < b <= duration:
            raise ValueError(f'Invalid shot interval: {shot["id"]}')
    cues, seen = [], set()
    for cue in plan.get('cues', []):
        name, anchor = cue['id'], cue['anchor']
        if name in seen:
            raise ValueError(f'Duplicate cue: {name}')
        seen.add(name)
        if anchor not in markers:
            raise ValueError(f'Unknown marker: {anchor}')
        t = markers[anchor] + number(cue.get('offset', 0), 'offset')
        length = number(cue.get('duration', 0), 'cue duration')
        if length < 0 or not 0 <= t < duration or t + length > duration + 1e-9:
            raise ValueError(f'Cue outside film: {name}')
        item = dict(cue, time=round(t, 6), frame=math.floor(t * fps + .5))
        cues.append(item)
    return dict(duration=duration, fps=fps, cues=sorted(cues, key=lambda c: c['time']))


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('plan', type=Path)
    parser.add_argument('--out', type=Path, required=True)
    args = parser.parse_args()
    result = compile_plan(json.loads(args.plan.read_text()))
    args.out.parent.mkdir(parents=True, exist_ok=True)
    args.out.write_text(json.dumps(result, ensure_ascii=False, indent=2) + '\n')
    print(f'{len(result["cues"])} cues / {result["duration"]} seconds')
