#!/usr/bin/env python3
from pathlib import Path
import json
root=Path(__file__).resolve().parents[1]
m=json.loads((root/'data/MASTER_SOURCE.json').read_text(encoding='utf-8'))
errors=[]
for kind in ('structures','layers','materials','controls','cameras','animations','labels','presets'):
 p=root/'data'/f'{kind}.json'; d=json.loads(p.read_text(encoding='utf-8'))
 if d['items']!=m[kind]:errors.append('OUT_OF_SYNC: '+kind)
 ids=[x['id'] for x in m[kind]]
 if len(ids)!=len(set(ids)):errors.append('DUPLICATE_IDS: '+kind)
sids={s['id'] for s in m['structures']}
for l in m['layers']:
 for sid in l['structure_ids']:
  if sid not in sids:errors.append('BAD_LAYER_REF '+sid)
for l in m['labels']:
 if l['structure_id'] not in sids:errors.append('BAD_LABEL_REF '+l['id'])
for s in m['structures']:
 if s['verified_object'] and not s['object_name']:errors.append('MISSING_MESH '+s['id'])
 if s['position'] is not None or s['anchor'] is not None:errors.append('UNVERIFIED_GEOMETRY '+s['id'])
for a in m['animations']:
 if a['ready'] and a['exploded_offsets'] is None:errors.append('READY_WITHOUT_TRANSFORMS '+a['id'])
print('WARN: no anatomical model files supplied; this is consistency QA only')
print('RESULT:', 'PASS' if not errors else 'FAIL', '|',len(m['structures']),'sample structures')
for e in errors:print('-',e)
raise SystemExit(bool(errors))
