#!/usr/bin/env python3
"""Copy a self-contained, editable original MG example without modifying existing files."""
import argparse
from pathlib import Path
import shutil


def create(style, dest):
    assets = Path(__file__).resolve().parents[1] / 'assets' / 'canvas-example'
    if dest.exists():
        raise FileExistsError(f'Target already exists: {dest}')
    dest.mkdir(parents=True)
    (dest / 'visual').mkdir(); (dest / 'audio').mkdir()
    for name in ('render.cjs', 'check-seek.cjs', 'package.json', 'package-lock.json'):
        shutil.copy2(assets / name, dest / 'visual' / name)
    shutil.copy2(assets / f'{style}-film.js', dest / 'visual' / 'film.js')
    if style == 'product':
        shutil.copy2(assets / 'base-film.js', dest / 'visual' / 'base-film.js')
    for name in ('music_bed.py', 'compose_score.py'):
        shutil.copy2(assets / 'audio' / name, dest / 'audio' / name)
    shutil.copy2(assets / 'audio' / f'{style}-cues.json', dest / 'audio' / 'cues.json')
    (dest / 'REBUILD.md').write_text(f'''# 可编辑 MG 示例：{style}

这是原创“一念成形”32 秒样例的起点。按用途修改文案、图形、字体、颜色和分镜。
维护实际时长与音画 cue，不能仅改变导出时长来获得新作品。

依赖：Node.js、FFmpeg/ffprobe、Python 3 + NumPy。先确认本机已有依赖。

```bash
cd visual
npm ci
node render.cjs stills 0.5 3.8 4 4.2 15.8 16 27.8 28 30
node check-seek.cjs
# 短区间试渲染（环境变量适用于 POSIX shell）
START=3.5 DURATION=1 FPS=60 SAMPLES=3 node render.cjs video ../transition.mp4
# 完整渲染
FPS=60 SAMPLES=3 node render.cjs video ../silent.mp4
cd ..
python3 audio/compose_score.py --style {style} --cues audio/cues.json --out audio
ffmpeg -y -i silent.mp4 -i audio/score.wav -map 0:v:0 -map 1:a:0 -c:v copy -c:a aac -b:a 320k -ar 48000 -movflags +faststart -shortest film.mp4
```

字体默认查找 macOS Arial Black 与 Hiragino Sans GB；可用 MG_LATIN_FONT、MG_CJK_FONT
指定实际字体文件。系统字体不包含在本项目中。更换字体后检查实际字形和裁剪。

audio/music.wav 与 sfx.wav 为同起点同长度的线性分轨，其相加等于 score.wav（24 位量化误差除外）。
音色、画面与节奏仍需要审看；自动检查不是商业验收。
''')
    return dest


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--style', choices=['brand', 'product'], required=True)
    parser.add_argument('--dest', type=Path, required=True)
    args = parser.parse_args()
    print(create(args.style, args.dest.expanduser().resolve()))
