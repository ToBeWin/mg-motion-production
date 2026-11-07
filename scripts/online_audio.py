#!/usr/bin/env python3
"""Explicit opt-in online audio generation. Never writes credentials or prompts to logs."""
import argparse,json,os,sys,urllib.request,urllib.error
from pathlib import Path

def request_audio(provider, text, voice, model):
    if provider=='openai-tts':
        token=os.environ.get('OPENAI_API_KEY');url='https://api.openai.com/v1/audio/speech'
        payload={'model':model or 'gpt-4o-mini-tts','voice':voice or 'coral','input':text,'response_format':'wav'}
    else:
        token=os.environ.get('MINIMAX_API_KEY');url='https://api.minimax.io/v1/music_generation'
        payload={'model':model or 'music-3.0','prompt':text,'is_instrumental':True,'output_format':'hex','audio_setting':{'sample_rate':44100,'bitrate':256000,'format':'mp3'}}
    if not token:raise ValueError('Missing provider key in environment')
    req=urllib.request.Request(url,data=json.dumps(payload).encode(),headers={'Authorization':'Bearer '+token,'Content-Type':'application/json'},method='POST')
    try:
        with urllib.request.urlopen(req,timeout=180) as r:data=r.read()
    except urllib.error.HTTPError as e:raise RuntimeError(f'Provider returned HTTP {e.code}; no retry was made') from None
    if provider=='minimax-music':
        result=json.loads(data);status=result.get('base_resp',{}).get('status_code')
        if status!=0:raise RuntimeError(f'Provider returned status {status}; no retry was made')
        data=bytes.fromhex(result['data']['audio'])
    if not data:raise RuntimeError('Provider returned empty audio')
    return data

def main():
    p=argparse.ArgumentParser(description=__doc__);p.add_argument('--provider',required=True,choices=['openai-tts','minimax-music']);p.add_argument('--text-file',required=True,type=Path,help='Narration text or instrumental music prompt');p.add_argument('--out',required=True,type=Path);p.add_argument('--voice');p.add_argument('--model');a=p.parse_args()
    if a.out.exists():p.error('output already exists; choose a new file')
    suffix='.wav' if a.provider=='openai-tts' else '.mp3'
    if a.out.suffix.lower()!=suffix:p.error(f'provider requires output suffix {suffix}')
    content=a.text_file.read_text(encoding='utf-8').strip()
    if not content:p.error('input is empty')
    data=request_audio(a.provider,content,a.voice,a.model)
    a.out.parent.mkdir(parents=True,exist_ok=True)
    with a.out.open('xb') as f:f.write(data)
    print(f'Audio saved to {a.out}; verify format, content and usage rights.')

if __name__=='__main__':main()
