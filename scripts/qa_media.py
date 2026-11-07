#!/usr/bin/env python3
"""Measure/decode actual media and extract review frames; does not score aesthetics."""
from pathlib import Path
import argparse
import hashlib
import json
import re
import shutil
import subprocess


def run(args):
    return subprocess.run(args, capture_output=True, text=True, check=True)


def inspect(media, out, times):
    if not media.is_file():
        raise FileNotFoundError(media)
    for executable in ('ffprobe', 'ffmpeg'):
        if not shutil.which(executable):
            raise RuntimeError(f'Missing dependency: {executable}')
    out.mkdir(parents=True, exist_ok=True)
    probe = json.loads(run(['ffprobe', '-v', 'error', '-show_streams', '-show_format',
                            '-of', 'json', str(media)]).stdout)
    duration = float(probe['format']['duration'])
    if not times:
        times = [duration * p for p in (.02, .15, .30, .45, .60, .75, .90, .98)]
    if any(not 0 <= t < duration for t in times):
        raise ValueError(f'Frame times must be within [0, {duration})')
    decode = run(['ffmpeg', '-v', 'error', '-progress', 'pipe:1', '-i', str(media),
                  '-map', '0:v:0', '-map', '0:a:0?', '-f', 'null', '-'])
    frames = re.findall(r'^frame=(\d+)', decode.stdout, re.M)
    digest = hashlib.sha256()
    with media.open('rb') as handle:
        for block in iter(lambda: handle.read(1024 * 1024), b''):
            digest.update(block)
    report = {'file': str(media), 'sha256': digest.hexdigest(),
              'duration': duration, 'streams': probe['streams'],
              'decode_ok': not bool(decode.stderr.strip()), 'decode_messages': decode.stderr.strip(),
              'decoded_frames': int(frames[-1]) if frames else None,
              'review_scope': 'Full decode and signal measurements; extracted frames require visual inspection. No listening or customer acceptance is inferred.'}
    if any(s['codec_type'] == 'audio' for s in probe['streams']):
        audio = run(['ffmpeg', '-hide_banner', '-i', str(media), '-vn', '-af',
                     'loudnorm=I=-16:TP=-1.8:LRA=11:print_format=json', '-f', 'null', '-'])
        match = re.search(r'\{\s*"input_i".*?\}', audio.stderr, re.S)
        if match:
            measured = json.loads(match.group(0))
            report['audio_measurement'] = {
                'integrated_lufs': float(measured['input_i']),
                'true_peak_dbtp': float(measured['input_tp']),
                'loudness_range_lu': float(measured['input_lra']),
                'method': 'ffmpeg loudnorm input measurements; this script does not normalize the media'}
        else:
            report['audio_measurement'] = {'error': 'No measurement'}
    extracted = []
    for i, t in enumerate(times):
        p = out / f'frame-{i:03d}-{t:.4f}.png'
        run(['ffmpeg', '-y', '-v', 'error', '-ss', str(t), '-i', str(media),
             '-frames:v', '1', '-update', '1', str(p)])
        if not p.is_file():
            raise RuntimeError(f'Failed to extract frame at {t}')
        extracted.append({'time': t, 'file': p.name})
    report['extracted_frames'] = extracted
    try:
        from PIL import Image, ImageDraw
        cols = min(4, len(extracted)); cell_w = 480
        v = next(s for s in probe['streams'] if s['codec_type'] == 'video')
        image_h = round(cell_w * v['height'] / v['width']); cell_h = image_h + 32
        sheet = Image.new('RGB', (cols * cell_w, ((len(extracted) + cols - 1)//cols) * cell_h), '#e4e4e1')
        draw = ImageDraw.Draw(sheet)
        for i, item in enumerate(extracted):
            with Image.open(out / item['file']) as im:
                im = im.convert('RGB'); im.thumbnail((cell_w, image_h))
                x, y = (i % cols)*cell_w, (i//cols)*cell_h
                sheet.paste(im, (x, y+32)); draw.text((x+8, y+9), f"{item['time']:.4f}s", fill='#111111')
        sheet.save(out / 'contact-sheet.jpg', quality=90)
        report['contact_sheet'] = 'contact-sheet.jpg'
    except ImportError:
        report['contact_sheet'] = 'Pillow unavailable; inspect individual PNG files'
    (out / 'report.json').write_text(json.dumps(report, ensure_ascii=False, indent=2) + '\n')
    return {k: report[k] for k in ('file', 'duration', 'decode_ok', 'decoded_frames')}


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('media', type=Path)
    parser.add_argument('--out', type=Path, required=True)
    parser.add_argument('--times', default='', help='Comma-separated seconds')
    args = parser.parse_args()
    times = [float(t.strip()) for t in args.times.split(',') if t.strip()]
    print(json.dumps(inspect(args.media.expanduser().resolve(), args.out.expanduser().resolve(), times), ensure_ascii=False))
