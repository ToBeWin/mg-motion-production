#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
BLENDER_BIN="${BLENDER_BIN:-/Applications/Blender.app/Contents/MacOS/Blender}"
node visual/make-textures.cjs
"$BLENDER_BIN" --background --factory-startup --python-exit-code 1 --python blender/build_scene.py -- --render
node visual/compose.cjs video silent.mp4
python3 compile_cues.py production-plan.json --out audio/cues.json
python3 audio/compose_score.py
ffmpeg -y -v error -i audio/mix-raw.wav -af loudnorm=I=-18:TP=-2:LRA=11 -ar 48000 -c:a pcm_s24le audio/mix.wav
ffmpeg -y -v error -i silent.mp4 -i audio/mix.wav -map 0:v:0 -map 1:a:0 -c:v copy -c:a aac -b:a 320k -movflags +faststart -t 18 focus.mp4
