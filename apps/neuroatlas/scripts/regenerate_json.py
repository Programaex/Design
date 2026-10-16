#!/usr/bin/env python3
from pathlib import Path
import json
root=Path(__file__).resolve().parents[1]
m=json.loads((root/'data/MASTER_SOURCE.json').read_text(encoding='utf-8'))
for kind in ('structures','layers','materials','controls','cameras','animations','labels','presets'):
 p=root/'data'/f'{kind}.json'
 p.write_text(json.dumps({'schema_version':m['schema_version'],'derived_from':'MASTER_SOURCE.json','items':m[kind]},ensure_ascii=False,indent=2),encoding='utf-8')
 print('generated',p.relative_to(root))
