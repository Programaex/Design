#!/usr/bin/env python3
"""Metadados glTF embutidos em GLB; não decodifica buffers Draco nem valida anatomia."""
import json, struct, hashlib, sys
from pathlib import Path
if len(sys.argv)<2: raise SystemExit('USO: python scripts/inspect_glb.py /caminho/modelo.glb')
p=Path(sys.argv[1]);raw=p.read_bytes()
if raw[:4]!=b'glTF':raise SystemExit('Não é GLB 2.0')
_,version,total=struct.unpack_from('<4sII',raw,0)
if version!=2 or total!=len(raw):raise SystemExit('GLB inválido ou truncado')
o=12;model=None
while o<len(raw):
 ln,typ=struct.unpack_from('<I4s',raw,o);o+=8
 if typ==b'JSON':model=json.loads(raw[o:o+ln].decode('utf8').strip(' \x00'))
 o+=ln
if model is None:raise SystemExit('JSON chunk não encontrado')
nodes=model.get('nodes',[])
report={'file':str(p),'sha256':hashlib.sha256(raw).hexdigest(),'size_bytes':len(raw),'format':'glTF 2.0 GLB','node_count':len(nodes),'mesh_count':len(model.get('meshes',[])),'material_count':len(model.get('materials',[])),'texture_count':len(model.get('textures',[])),'image_count':len(model.get('images',[])),'accessors':len(model.get('accessors',[])),'extensionsUsed':model.get('extensionsUsed',[]),'nodes':[{'index':i,'name':n.get('name'),'mesh':n.get('mesh'),'children':n.get('children',[]),'extras':n.get('extras',{}),'matrix':n.get('matrix'),'translation':n.get('translation'),'rotation':n.get('rotation'),'scale':n.get('scale')} for i,n in enumerate(nodes)]}
dest=Path(sys.argv[2]) if len(sys.argv)>2 else p.with_name(p.stem+'.inventory.json')
dest.write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding='utf8')
print(f"OK: {len(nodes)} nodes, {len(model.get('meshes',[]))} meshes, sha256={report['sha256']}")
print('Inventory:',dest)
