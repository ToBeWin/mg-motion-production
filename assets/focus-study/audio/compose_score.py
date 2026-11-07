#!/usr/bin/env python3
"""Original 18-second felt-key / air score; cues resolved from the visual plan."""
from pathlib import Path
import json, subprocess
import numpy as np

P = Path(__file__).resolve().parent
plan = json.loads((P / 'cues.json').read_text())
SR = 48000
N = round(plan['duration'] * SR)
music, sfx = np.zeros((N, 2)), np.zeros((N, 2))
rng = np.random.default_rng(20261025)

def freq(note): return 440 * 2 ** ((note - 69) / 12)

def add(dst, mono, at, gain=1, pan=0):
    start = round(at * SR)
    length = min(len(mono), N - start)
    if start < 0 or length <= 0: raise ValueError('Invalid sound position')
    angle = (pan + 1) * np.pi / 4
    dst[start:start+length] += mono[:length, None] * np.array([np.cos(angle), np.sin(angle)]) * gain

def key(note, length=3.5):
    t = np.arange(round(length * SR)) / SR
    f = freq(note)
    body = np.sin(2*np.pi*f*t) * np.exp(-t/1.2)
    body += .28 * np.sin(2*np.pi*f*2.002*t) * np.exp(-t/.42)
    body += .08 * np.sin(2*np.pi*f*3.005*t) * np.exp(-t/.20)
    return body * (1 - np.exp(-t/.007)) * np.minimum(1, (length-t)/.1)

# Long harmonic beds with slow attacks; thinner under the citation interaction.
for start, notes in [(0, [40, 55, 59, 66]), (4.25, [36, 55, 59, 64]), (8.4, [43, 54, 59, 62]), (13.2, [40, 55, 59, 66])]:
    length = min(5.5, plan['duration'] - start)
    t = np.arange(round(length*SR)) / SR
    env = np.minimum(t/.9, 1) * np.minimum((length-t)/1.8, 1)
    for k, note in enumerate(notes):
        wave = np.sin(2*np.pi*freq(note)*t) + .14*np.sin(2*np.pi*freq(note)*2*t+.3)
        wave *= env * (.90+.10*np.sin(2*np.pi*.24*t+k))
        add(music, wave, start, .020 if start != 8.4 else .012, (k-1.5)*.2)

for t, note, gain, pan in [(0.25, 71, .09, -.2), (1.55, 66, .055, .2), (2.9, 67, .06, -.15),
    (4.45, 76, .075, .2), (5.35, 71, .045, -.1), (7.5, 74, .065, .15),
    (11.25, 71, .045, -.2), (13.65, 76, .08, .12), (14.45, 78, .04, -.12), (15.2, 83, .035, .2)]:
    add(music, key(note), t, gain, pan)

for cue in plan['cues']:
    length = cue['duration']; t = np.arange(round(length*SR))/SR
    if cue['type'] == 'tap':
        wave = np.sin(2*np.pi*(780*t-1800*t*t))*np.exp(-t/0.014)
        wave += .15*rng.standard_normal(len(t))*np.exp(-t/.007)
        wave *= np.minimum(t/.0015, 1)
    elif cue['type'] == 'link':
        wave = key(cue['note'], length)
    else:
        noise = rng.standard_normal(len(t))
        # Smooth air instead of sharp broadband whooshes.
        noise = np.convolve(noise, np.ones(26)/26, mode='same')
        wave = noise * np.sin(np.pi*t/length)**2
    add(sfx, wave, cue['time'], cue['gain'], cue.get('pan', 0))

# Deterministic, quiet spatial tail on the musical stem; no brickwall saturation.
dry = music.copy()
for delay, gain in [(.109, .16), (.173, .12), (.293, .09), (.421, .065), (.647, .04)]:
    n = round(delay*SR)
    music[n:] += dry[:-n, ::-1] * gain
end = np.arange(N)/SR
fade = np.minimum(end/.08, 1) * np.minimum((plan['duration']-end)/1.3, 1)
music *= fade[:, None]; sfx *= fade[:, None]
raw = music + sfx

def write(name, data):
    if np.max(np.abs(data)) >= 1: raise ValueError('Clipping before PCM write')
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'f32le', '-ar', str(SR), '-ac', '2', '-i', 'pipe:0', '-c:a', 'pcm_s24le', str(P/name)], input=data.astype('<f4').tobytes(), check=True)

write('music.wav', music); write('sfx.wav', sfx); write('mix-raw.wav', raw)
print('Original music and SFX: 18 s / stereo / 48 kHz / PCM 24 bit')
