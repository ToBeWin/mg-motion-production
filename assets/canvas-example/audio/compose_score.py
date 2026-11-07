#!/usr/bin/env python3
"""Rearrange the original score, synthesize cue-driven effects, export linear stems."""
from pathlib import Path
import argparse
import json
import math
import re
import subprocess
import numpy as np
import music_bed as b


def wav(path, samples):
    subprocess.run(['ffmpeg', '-y', '-v', 'error', '-f', 'f32le', '-ar', str(b.SR),
                    '-ac', '2', '-i', 'pipe:0', '-c:a', 'pcm_s24le', str(path)],
                   input=np.asarray(samples, dtype='<f4').tobytes(), check=True)


def measure(path):
    r = subprocess.run(['ffmpeg', '-hide_banner', '-i', str(path), '-af',
                        'loudnorm=I=-16:TP=-1.8:LRA=11:print_format=json',
                        '-f', 'null', '-'], capture_output=True, text=True, check=True)
    return json.loads(re.search(r'\{\s*"input_i".*?\}', r.stderr, re.S).group(0))


def build(style, cues, out):
    out.mkdir(parents=True, exist_ok=True)
    if style == 'brand':
        bed = b.music + b.air + b.wet + b.drums * .85
    else:
        bed = (b.music + b.wet) * .82 + b.air * 1.1 + b.drums * .48
    effects = np.zeros_like(bed)
    b.RNG = np.random.default_rng(2412 if style == 'brand' else 2422)
    observations = []
    for cue in cues:
        kind, at = cue['type'], float(cue['time'])
        if kind == 'click':
            signal = b.click(cue.get('pitch', 1100))
        elif kind == 'whoosh':
            signal = b.whoosh(cue['duration'])
        elif kind == 'chime':
            signal = b.chime(cue.get('note', 81), cue.get('duration', 1.2))
        elif kind == 'impact':
            signal = b.impact(cue.get('note', 38))
        elif kind == 'bounce':
            t = b.clock(.24)
            frequency = cue.get('pitch', 260) + 130 * np.exp(-t * 28)
            signal = np.sin(2 * np.pi * np.cumsum(frequency) / b.SR)
            signal *= np.exp(-t * 20) * b.envelope(t, .002, .04)
        else:
            raise ValueError(f'Unknown effect type: {kind}')
        b.add(effects, signal, at, cue['gain'], cue.get('pan', 0))
        observations.append({**cue, 'sample_peak_time': round(at + int(np.argmax(np.abs(signal))) / b.SR, 4),
                             'synth_duration': round(len(signal) / b.SR, 4)})
    # Keep the score out of the way of the important product interactions.
    duck = np.ones(b.N)
    for cue in cues:
        db = cue.get('duck_db', 0)
        if not db:
            continue
        center = cue['time']; a = max(0, round((center - .05) * b.SR))
        z = min(b.N, round((center + .25) * b.SR))
        t = np.arange(a, z) / b.SR - center
        depth = np.where(t < 0, np.clip((t + .05) / .05, 0, 1), np.exp(-t * 12))
        duck[a:z] = np.minimum(duck[a:z], 10 ** (-db * depth / 20))
    bed *= duck[:, None]
    time = np.arange(b.N) / b.SR
    fade = np.clip(time / .012, 0, 1) * np.clip((31.95 - time) / 1.15, 0, 1) ** 1.2
    for stem in (bed, effects):
        stem -= stem.mean(axis=0)
        stem *= fade[:, None]
    combined = bed + effects
    raw = out / 'measure-input.wav'
    wav(raw, combined)
    before = measure(raw)
    gain_db = min(-16 - float(before['input_i']), -1.8 - float(before['input_tp']))
    gain = 10 ** (gain_db / 20)
    bed *= gain; effects *= gain
    wav(out / 'music.wav', bed)
    wav(out / 'sfx.wav', effects)
    wav(out / 'score.wav', bed + effects)
    after = measure(out / 'score.wav')
    raw.unlink()
    report = {'style': style, 'sample_rate': b.SR, 'channels': 2, 'duration': b.DURATION,
              'linear_gain_db': round(gain_db, 3), 'integrated_lufs': float(after['input_i']),
              'true_peak_dbtp': float(after['input_tp']), 'loudness_range_lu': float(after['input_lra']),
              'sample_peak': float(np.max(np.abs(bed + effects))),
              'stem_policy': 'music.wav + sfx.wav = score.wav, apart from 24-bit quantization',
              'listening_review': 'not performed by a human in this build', 'cues': observations}
    (out / 'mix-report.json').write_text(json.dumps(report, ensure_ascii=False, indent=2) + '\n')
    print(json.dumps({k: v for k, v in report.items() if k != 'cues'}, ensure_ascii=False))


if __name__ == '__main__':
    p = argparse.ArgumentParser()
    p.add_argument('--style', choices=['brand', 'product'], required=True)
    p.add_argument('--cues', type=Path, required=True)
    p.add_argument('--out', type=Path, required=True)
    args = p.parse_args()
    build(args.style, json.loads(args.cues.read_text())['cues'], args.out)
