"""Replace this case's soundtrack using local picture sources, preserving history."""
from pathlib import Path
import argparse
import hashlib
import json
import subprocess

SOURCE = Path(__file__).resolve().parent
CASE = SOURCE.parent


def video_hash(path):
    return subprocess.run(
        ['ffmpeg', '-v', 'error', '-i', str(path), '-map', '0:v:0',
         '-c:v', 'copy', '-f', 'hash', '-hash', 'sha256', '-'],
        capture_output=True, text=True, check=True,
    ).stdout.strip()


def file_hash(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--out', type=Path, default=CASE,
                        help='Output directory; default is this copied case folder.')
    parser.add_argument('--baseline', type=Path,
                        help='Optional original v2 delivery for historical comparison.')
    args = parser.parse_args()
    out = args.out.resolve()
    baseline = args.baseline.resolve() if args.baseline else None
    picture = CASE / 'AUREL_v2.1_让想象有形_画面.mp4'
    voice = SOURCE / 'audio/voice-edit.wav'
    variants = [
        ('配音字幕版', 'master-voice.wav', SOURCE / 'picture/captioned-picture.mp4'),
        ('无字幕配音版', 'master-voice.wav', picture),
        ('纯音乐版', 'master-music.wav', picture),
    ]
    required = [voice, picture]
    for _, master, source_picture in variants:
        required.extend([source_picture, SOURCE / 'audio' / master])
    if baseline:
        required.extend([baseline / 'source/audio/voice-edit.wav'])
        required.extend(baseline / ('AUREL_v2_让想象有形_' + name + '.mp4')
                        for name in ['画面'] + [v[0] for v in variants])
    for path in required:
        if not path.is_file():
            raise FileNotFoundError(path)
    voice_before = file_hash(voice)
    if baseline:
        assert voice_before == file_hash(baseline / 'source/audio/voice-edit.wav')
        assert video_hash(picture) == video_hash(baseline / 'AUREL_v2_让想象有形_画面.mp4')
    out.mkdir(parents=True, exist_ok=True)
    checks = []
    for name, master, source_picture in variants:
        expected = video_hash(source_picture)
        target = out / ('AUREL_v2.1_让想象有形_' + name + '.mp4')
        subprocess.run(
            ['ffmpeg', '-v', 'error', '-y', '-i', str(source_picture),
             '-i', str(SOURCE / 'audio' / master), '-map', '0:v:0',
             '-map', '1:a:0', '-c:v', 'copy', '-c:a', 'aac', '-b:a',
             '320k', '-movflags', '+faststart', str(target)], check=True,
        )
        actual = video_hash(target)
        assert actual == expected, name
        check = {'variant': name, 'video_stream_sha256': actual,
                 'matches_local_picture_source': True}
        if baseline:
            assert actual == video_hash(baseline / ('AUREL_v2_让想象有形_' + name + '.mp4'))
            check['matches_v2'] = True
        checks.append(check)
    assert voice_before == file_hash(voice)
    report = {
        'video_streams': checks,
        'voice_stem_unchanged_during_remux': True,
        'voice_stem_sha256': voice_before,
        'historical_baseline_checked': str(baseline) if baseline else None,
        'scope': 'Local encoded picture preserved. Optional v2 comparison is explicit. '
                 'This structural check does not review new sound or subtitle timing.',
    }
    review = out / 'review'
    review.mkdir(exist_ok=True)
    (review / 'remux-check.json').write_text(json.dumps(report, ensure_ascii=False, indent=2) + '\n')
    print(json.dumps(report, ensure_ascii=False, indent=2))


if __name__ == '__main__':
    main()
