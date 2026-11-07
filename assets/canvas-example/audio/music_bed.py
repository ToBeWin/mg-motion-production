#!/usr/bin/env python3
"""Original deterministic 120 BPM electronic score for MAKE IT MOVE.

All voices, percussion and movement sounds are synthesized here; no samples.
NumPy + standard library + ffmpeg. Run from any working directory.
"""
from pathlib import Path
import json
import math
import re
import subprocess
import wave
import numpy as np

SR = 48000
DURATION = 32.0
N = int(SR * DURATION)
ROOT = Path(__file__).resolve().parent
RNG = np.random.default_rng(2401024)
music = np.zeros((N, 2), dtype=np.float64)
sfx = np.zeros_like(music)
drums = np.zeros_like(music)
air = np.zeros_like(music)
events = []


def midi(n):
    return 440 * 2 ** ((n - 69) / 12)


def clock(length):
    return np.arange(round(length * SR), dtype=np.float64) / SR


def smooth(x):
    return x * x * (3 - 2 * x)


def envelope(t, attack=.008, release=.06):
    return np.minimum(1, t / attack) * np.minimum(1, np.maximum(0, (t[-1] - t) / release))


def filt(x, low=0, high=20000):
    # Smooth sixth-order spectral filter, intentionally no scipy dependency.
    f = np.fft.rfftfreq(len(x), 1 / SR)
    response = 1 / np.sqrt(1 + (f / high) ** 8)
    if low:
        response *= 1 / np.sqrt(1 + (low / np.maximum(f, .1)) ** 8)
    return np.fft.irfft(np.fft.rfft(x) * response, n=len(x))


def add(bus, x, start, gain=1, pan=0):
    pos = round(start * SR)
    if pos < 0:
        x = x[-pos:]
        pos = 0
    size = min(len(x), N - pos)
    if size <= 0:
        return
    if x.ndim == 1:
        left = math.cos((pan + 1) * math.pi / 4)
        right = math.sin((pan + 1) * math.pi / 4)
        x = x[:size, None] * np.array([left, right])
    bus[pos:pos + size] += gain * x[:size]


def pluck(note, duration=.55, soft=False):
    t = clock(duration)
    f = midi(note)
    mod = np.sin(2 * np.pi * f * 2 * t) * (1.1 if soft else 2.2) * np.exp(-t * 16)
    x = np.sin(2 * np.pi * f * t + mod)
    x += .18 * np.sin(2 * np.pi * f * 2 * t) * np.exp(-t * 12)
    x += .06 * np.sin(2 * np.pi * f * 3 * t) * np.exp(-t * 25)
    x *= (1 - np.exp(-t * 650)) * np.exp(-t * (7 if soft else 5.2))
    return x * envelope(t, .002, .08)


def bass(note, duration=.36):
    t = clock(duration)
    f = midi(note)
    phase = 2 * np.pi * f * t
    x = .72 * np.sin(phase)
    x += .2 * np.sin(phase * 2) * np.exp(-t * 6)
    x += .1 * np.sin(phase * 3) * np.exp(-t * 9)
    x = np.tanh(x * 1.7) * .7
    return x * envelope(t, .009, .07) * np.exp(-t * 1.2)


def pad(notes, duration=2.8):
    t = clock(duration)
    x = np.zeros((len(t), 2))
    for j, note in enumerate(notes):
        f = midi(note)
        for ch in (0, 1):
            detune = 1 + (.0017 if ch else -.0015)
            phase = 2 * np.pi * f * detune * t + j * .6
            voice = np.sin(phase) + .14 * np.sin(phase * 2) + .035 * np.sin(phase * 3)
            x[:, ch] += voice * (1 + .03 * np.sin(2 * np.pi * .17 * t + j))
    return x / len(notes) * envelope(t, .16, .7)[:, None]


def kick():
    t = clock(.48)
    freq = 48 + 115 * np.exp(-t * 45)
    phase = 2 * np.pi * np.cumsum(freq) / SR
    body = np.sin(phase) * np.exp(-t * 10)
    attack = filt(RNG.normal(size=len(t)), 1800, 6500) * np.exp(-t * 160) * .14
    return (body + attack) * envelope(t, .001, .02)


def snare():
    t = clock(.24)
    noise = filt(RNG.normal(size=len(t)), 950, 7600)
    body = .3 * np.sin(2 * np.pi * 184 * t) * np.exp(-t * 30)
    x = .6 * noise * np.exp(-t * 19) + body
    # Three very short clap arrivals soften the synthetic snare attack.
    for off in (.009, .018):
        k = int(off * SR)
        x[k:] += .12 * noise[:-k] * np.exp(-t[:-k] * 46)
    return x * envelope(t, .001, .04)


def hat(opened=False):
    length = .21 if opened else .065
    t = clock(length)
    noise = filt(RNG.normal(size=len(t)), 6800, 14000)
    return noise * np.exp(-t * (19 if opened else 70)) * envelope(t, .0005, .02)


def click(pitch=1300):
    t = clock(.07)
    x = np.sin(2 * np.pi * pitch * t) * np.exp(-t * 90)
    x += .15 * filt(RNG.normal(size=len(t)), 2000, 9000) * np.exp(-t * 150)
    return x * envelope(t, .0006, .01)


def whoosh(length=.55, rise=True):
    t = clock(length)
    n = RNG.normal(size=len(t))
    # Moving emphasis by crossfading two filtered noise bands.
    progress = t / length if rise else 1 - t / length
    x = filt(n, 100, 1600) * (1 - progress) + filt(n, 1000, 8000) * progress
    shape = np.sin(np.pi * np.clip(t / length, 0, 1)) ** 1.5
    return x * shape * .6


def impact(note=38):
    t = clock(1.15)
    f = midi(note)
    phase = 2 * np.pi * (f * t + 50 / 24 * (1 - np.exp(-t * 24)))
    x = .7 * np.sin(phase) * np.exp(-t * 5)
    x += .1 * filt(RNG.normal(size=len(t)), 400, 4500) * np.exp(-t * 20)
    return x * envelope(t, .002, .15)


def chime(note=86, duration=1.3):
    t = clock(duration)
    f = midi(note)
    x = sum(a * np.sin(2 * np.pi * f * r * t) * np.exp(-t * decay)
            for a, r, decay in [(1, 1, 3.8), (.2, 2, 5.8), (.11, 3.01, 9)])
    return x * envelope(t, .002, .3)


# D minor 9 -> B-flat major 9 -> F major 9 -> C add9. Voicings remain open.
chords = [[62, 65, 69, 72, 76], [58, 62, 65, 69, 72],
          [57, 60, 65, 67, 72], [55, 60, 64, 67, 74]]
roots = [38, 34, 41, 36]

# Opening: one point. Space is a deliberate part of the composition.
add(sfx, click(980), .12, .15)
add(music, pluck(74, 1.2, True), .12, .22, -.16)
add(music, pluck(81, 1.0, True), 1.0, .13, .25)
add(music, pad(chords[0], 3.7), .45, .17)
add(sfx, click(1600), 2.0, .09, -.35)
add(sfx, click(1200), 2.5, .08, .35)
add(music, pluck(77, .8, True), 2.5, .12, .15)
add(sfx, whoosh(.6), 3.4, .2, -.1)
events.append({"time": .12, "action": "single seed click + D bell"})

# Four-bar harmonic blocks. Pad amplitude falls during percussive scenes.
for start in np.arange(4, 28, 2):
    chord_index = (int(start - 4) // 2) % 4
    gain = .14 if 12 <= start < 16 else .12
    add(air, pad(chords[chord_index], 2.65), float(start), gain)

# Drum arrangement: clean dance pulses, then a suspended half-time bridge.
kick_times = []
for bar in range(2, 14):
    start = bar * 2.0
    bridge = 12 <= start < 16
    for beat in ([0, 2] if bridge else [0, 1, 2, 3]):
        t0 = start + beat * .5
        add(drums, kick(), t0, .56 if start >= 16 else .46)
        kick_times.append(t0)
    for beat in ([2] if bridge else [1, 3]):
        add(drums, snare(), start + beat * .5, .24 if start >= 16 else .18, .04)
    if not bridge:
        for eighth in range(8):
            amp = .055 if eighth % 2 else .032
            add(drums, hat(eighth % 4 == 3), start + eighth * .25,
                amp, -.25 if eighth % 2 else .25)
    else:
        for eighth in [1, 5, 7]:
            add(drums, hat(), start + eighth * .25, .025, .25)
    # Precise little fills, never broadband machine-gun noise.
    if start in (10, 18, 22, 26):
        for q in [0, 1, 2]:
            add(drums, click(1700 + q * 300), start + 1.625 + q * .125,
                .035 + q * .008, -.4 + q * .4)

# Bouncy syncopated bass line. Short phrase breath at each bar ending.
for bar in range(2, 14):
    start = bar * 2.0
    root = roots[(bar - 2) % 4]
    pattern = [(0, root, .34), (.75, root, .22), (1, root + 12, .25), (1.5, root + 7, .25)]
    if 12 <= start < 16:
        pattern = [(0, root, .65), (1, root + 12, .5)]
    if 24 <= start < 28:
        pattern += [(1.75, root + 12, .18)]
    for offset, note, duration in pattern:
        add(music, bass(note, duration), start + offset, .34)

# The melody has an actual repeated identity: D-A-C-F, varied in the release.
motifs = [[74, 81, 77, 76, 74, 69, 72, 77],
          [74, 77, 81, 84, 81, 77, 74, 72],
          [72, 77, 79, 81, 77, 72, 69, 67],
          [74, 79, 76, 72, 74, 76, 79, 81]]
for bar in range(2, 14):
    start = bar * 2.
    phrase = motifs[(bar - 2) % 4]
    offsets = [0, .375, .75, 1.25, 1.5]
    if 8 <= start < 12 or 20 <= start < 24:
        offsets = [0, .25, .5, .75, 1, 1.25, 1.5, 1.75]
    if 12 <= start < 16:
        offsets = [.25, 1.25]
    if 16 <= start < 20:
        offsets = [.25, .75, 1.25, 1.75]
    for j, offset in enumerate(offsets):
        note = phrase[j % 8]
        amp = .105 if j % 2 else .14
        if 12 <= start < 16:
            amp = .09
        pan = -.38 + .76 * ((j % 4) / 3)
        add(music, pluck(note, .65), start + offset, amp, pan)

# Match-cut accents at every four-second scene boundary.
for second, pitch in [(4,38), (8,34), (12,41), (16,38), (20,34), (24,41), (28,38)]:
    add(sfx, impact(pitch), second, .31 if second in (4,16,28) else .18)
    if second != 4:
        add(sfx, whoosh(.45), second - .45, .11, -.2)
    add(sfx, whoosh(.26, False), second + .02, .055, .25)
    events.append({"time": second, "action": "scene-boundary impact, short pre-whoosh"})

# Moving points/array taps. Panned pairs are audible but restrained.
for k, t0 in enumerate([5.0, 5.5, 6.25, 7., 8.5, 9., 9.5, 10., 10.5,
                       16.5, 17., 18., 18.5, 20.25, 20.75, 21.25, 21.75, 22.5, 23.]):
    add(sfx, click(1000 + (k % 5) * 210), t0, .035, -.55 if k % 2 else .55)

# Spatial bridge: decaying harmonic glints, no continuous piercing sine.
add(sfx, chime(81, 1.8), 12.2, .085, -.4)
add(sfx, chime(84, 1.5), 13.2, .06, .4)
add(sfx, chime(86, 1.5), 14.2, .06, -.2)

# Ascending aggregation, followed by the final logo landing.
for k, note in enumerate([62, 65, 69, 72, 74, 77, 81, 84]):
    add(music, pluck(note, .65), 26 + k * .25, .09 + k * .008, -.5 + k / 7)
add(sfx, whoosh(1.2), 26.8, .15)
add(music, pad([50, 62, 65, 69, 72, 76], 3.85), 28, .33)
add(music, bass(38, 1.25), 28, .3)
for k, note in enumerate([74, 81, 86]):
    add(music, chime(note, 2.9 - k * .2), 28 + k * .12, .14, -.25 + k * .25)
add(sfx, click(1100), 29, .04)
events.append({"time": 28, "action": "final D minor 9 logo chord, three-note chime"})
events.append({"time": 30.8, "action": "tail only, complete fade by 31.95"})

# Gentle sidechain makes room for the kick without a heavy pumping effect.
duck = np.ones(N)
for t0 in kick_times:
    begin = int(t0 * SR)
    t = clock(.30)
    shape = 1 - .26 * np.exp(-t * 13)
    duck[begin:begin + len(t)] = np.minimum(duck[begin:begin + len(t)], shape)
music *= duck[:, None]
air *= duck[:, None]

# Stereo musical echoes and short room/reflection network.
wet_source = music + air * .5
wet = np.zeros_like(music)
for delay, level in [(.1875,.12), (.375,.085), (.5625,.05), (.75,.03)]:
    k = round(delay * SR)
    wet[k:, 0] += wet_source[:-k, 1] * level
    wet[k:, 1] += wet_source[:-k, 0] * level
for ch in (0,1):
    wet[:,ch] = filt(wet[:,ch], 220, 5800)
    # Broad, quiet room tail keeps taps connected, not washed out.
    room_source = air[:,ch] + music[:,ch] * .15
    for delay, level in [(.043,.11), (.071,.08), (.113,.065), (.173,.045), (.239,.025)]:
        k = round((delay + ch * .004) * SR)
        wet[k:,ch] += room_source[:-k] * level


# The arranger imports the buses above, replaces sfx, then masters linear stems.
