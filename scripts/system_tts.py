#!/usr/bin/env python3
"""Generate a local draft voiceover with the OS speech engine and FFmpeg."""
import argparse,shutil,subprocess,sys,tempfile
from pathlib import Path

def main():
    p=argparse.ArgumentParser(description=__doc__);p.add_argument('--text-file',type=Path,required=True);p.add_argument('--out',type=Path,required=True);p.add_argument('--voice');a=p.parse_args()
    if a.out.exists():p.error('output already exists; choose a new file')
    if a.out.suffix.lower()!='.wav':p.error('output must end in .wav')
    text=a.text_file.read_text(encoding='utf-8').strip()
    if not text:p.error('input is empty')
    if not shutil.which('ffmpeg'):p.error('FFmpeg is required')
    a.out.parent.mkdir(parents=True,exist_ok=True)
    with tempfile.TemporaryDirectory() as d:
        if sys.platform=='darwin' and shutil.which('say'):
            raw=Path(d)/'voice.aiff';cmd=['say','-o',str(raw),'-f',str(a.text_file)]
            if a.voice:cmd+=['-v',a.voice]
            subprocess.run(cmd,check=True)
        elif shutil.which('espeak-ng'):
            raw=Path(d)/'voice.wav';cmd=['espeak-ng','--stdin','-w',str(raw)]
            if a.voice:cmd+=['-v',a.voice]
            subprocess.run(cmd,input=text,text=True,check=True)
        else:p.error('No supported local speech engine: macOS say or espeak-ng')
        subprocess.run(['ffmpeg','-v','error','-n','-i',str(raw),'-ar','48000','-ac','2',str(a.out)],check=True)
    print(f'Local draft narration saved to {a.out}; review pronunciation and pacing.')

if __name__=='__main__':main()
