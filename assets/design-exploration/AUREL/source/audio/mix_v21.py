"""Music replacement with preserved IndexTTS2 speech and picture timing."""
from pathlib import Path
import argparse, hashlib, json, subprocess
import numpy as np

P = Path(__file__).resolve().parent
ap = argparse.ArgumentParser()
ap.add_argument('--music', required=True)
ap.add_argument('--source-in', type=float, default=0)
ap.add_argument('--out', required=True)
args = ap.parse_args()
R = Path(args.out).resolve()
R.mkdir(parents=True, exist_ok=True)
SR, D = 48000, 16
N = SR * D

def decode(path):
    data = subprocess.run(['ffmpeg', '-v', 'error', '-i', str(path), '-ac', '2', '-ar', str(SR), '-f', 'f32le', '-'], capture_output=True, check=True).stdout
    return np.frombuffer(data, dtype='<f4').reshape(-1, 2).copy()

def write(path, data):
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'f32le', '-ar', str(SR), '-ac', '2', '-i', '-', '-c:a', 'pcm_s24le', str(path)], input=data.astype('<f4').tobytes(), check=True)

voice = decode(P / 'voice-edit.wav')
assert len(voice) == N
plans = json.loads((P / 'voice-timing.json').read_text())
raw = decode(P / args.music)
first = round(args.source_in * SR)
music = raw[first:first + N].copy()
assert len(music) == N
# A continuous excerpt retains its original tempo and stereo image.
# Broad musical changes carry the motion; effects mark only four key actions.
music[:round(.04 * SR)] *= np.linspace(0, 1, round(.04 * SR))[:, None]
end = np.clip((np.arange(N) / SR - 14.35) / 1.5, 0, 1)
music *= (np.cos(end * np.pi / 2) ** 2)[:, None]
music[round(15.85 * SR):] = 0
music *= .045 / max(float(np.sqrt(np.mean(music * music))), 1e-7)

sfx = np.zeros_like(music)
rng = np.random.default_rng(4139)
events = [(4.67, 'air', .012), (5.65, 'soft-contact', .009), (8.1, 'air', .010), (10.87, 'soft-contact', .008)]
for at, kind, gain in events:
    n = round(.38 * SR)
    t = np.arange(n) / SR
    noise = rng.normal(size=n)
    filtered = np.convolve(noise, np.ones(35) / 35, 'same')
    if kind == 'soft-contact':
        z = (np.sin(2 * np.pi * (150 * t - 40 * t * t)) + .08 * filtered) * np.exp(-t * 48)
    else:
        z = (filtered - np.convolve(noise, np.ones(180) / 180, 'same')) * np.sin(np.linspace(0, np.pi, n)) ** 2
    z[:96] *= np.linspace(0, 1, 96)
    x = np.column_stack([z, .96 * z]) * gain
    j = round(at * SR)
    sfx[j:j + n] += x

duck = np.ones(N)
for cue in plans:
    attack = round(.18 * SR)
    release = round(.35 * SR)
    start = round(cue['start'] * SR)
    stop = round(cue['end'] * SR)
    duck[start - attack:start] = np.minimum(duck[start - attack:start], np.linspace(1, .5, attack))
    duck[start:stop] = .5
    duck[stop:stop + release] = np.minimum(duck[stop:stop + release], np.linspace(.5, 1, release))
duck[round(plans[-1]['end'] * SR):] = .5
write(R / 'music-edit.wav', music)
write(R / 'sfx-edit.wav', sfx)
write(R / 'mix-premaster.wav', voice + music * duck[:, None] + sfx)
write(R / 'music-premaster.wav', music + sfx)

norm = {}
for src, dest, target in [('mix-premaster.wav', 'master-voice.wav', -16), ('music-premaster.wav', 'master-music.wav', -18)]:
    spec = f'loudnorm=I={target}:TP=-2:LRA=9'
    report = subprocess.run(['ffmpeg', '-hide_banner', '-i', str(R / src), '-af', spec + ':print_format=json', '-f', 'null', '-'], capture_output=True, text=True, check=True).stderr
    m = json.JSONDecoder().raw_decode(report[report.rfind('{'):])[0]
    filt = spec + ':linear=true:measured_I=' + m['input_i'] + ':measured_TP=' + m['input_tp'] + ':measured_LRA=' + m['input_lra'] + ':measured_thresh=' + m['input_thresh'] + ':offset=' + m['target_offset']
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', str(R / src), '-af', filt, '-ar', str(SR), '-c:a', 'pcm_s24le', str(R / dest)], check=True)
    norm[dest] = {'target_lufs': target, 'first_pass': m}

timeline = dict(duration=D, captions=plans, voice_engine='IndexTTS2 / original v2 speech unchanged', music_engine='MiniMax Music3 local MLX q6 / 30 steps', music_source=args.music, music_source_duration=len(raw) / SR, music_edits=[dict(source_in=args.source_in, source_out=args.source_in + D, atempo=1, ending='Continuous excerpt, cosine fade 14.35–15.85 s, 0.15 s silence; final voice duck held')], normalization=norm, sfx_events=events, source_hashes={n: hashlib.sha256((P / n).read_bytes()).hexdigest() for n in [args.music, 'voice-edit.wav']})
(R / 'timeline.json').write_text(json.dumps(timeline, ensure_ascii=False, indent=2))
print(json.dumps({'music': args.music, 'out': str(R)}, ensure_ascii=False))
