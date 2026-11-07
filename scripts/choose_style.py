"""Inspect a domain-specific motion style and its actual example level."""
from pathlib import Path
import argparse,json
P=Path(__file__).resolve().parents[1]
ap=argparse.ArgumentParser();ap.add_argument('--domain',choices=['software','brand','hardware']);ap.add_argument('--show');a=ap.parse_args()
routes=json.loads((P/'assets/domain-style-routes.json').read_text())
if a.show:
 found=[r for group in routes.values() for r in group if r['id']==a.show]
 if not found:ap.error('Unknown route; use --domain software, brand or hardware.')
 print(json.dumps(found[0],ensure_ascii=False,indent=2))
else:
 for domain,group in routes.items():
  if a.domain and domain!=a.domain:continue
  for r in group:print(f'{domain:10} {r["id"]:24} {r["name"]} / {r["level"]} / {r["purpose"]}')
