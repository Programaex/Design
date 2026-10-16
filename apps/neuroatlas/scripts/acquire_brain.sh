#!/usr/bin/env bash
set -euo pipefail
# A distribuição final depende da revisão da licença dos subassets.
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
URL='https://raw.githubusercontent.com/itayinbarr/brainproject/main/brain-atlas/models/brain.glb'
OUT="$ROOT/assets/models/brain.glb"
echo 'Baixando binário público (não incluído na distribuição NEUROATLAS)...'
curl --fail --location --retry 2 "$URL" --output "$OUT.tmp"
mv "$OUT.tmp" "$OUT"
python3 "$ROOT/scripts/inspect_glb.py" "$OUT" "$ROOT/research/brain.glb.inventory.json"
(sha256sum "$OUT" || shasum -a 256 "$OUT") | tee "$ROOT/research/brain.glb.sha256.txt"
cat <<'MSG'
Download e inspeção superficial concluídos. PRÓXIMOS GATES:
- Revisar o NOTICE/licenças de todas as estruturas e proveniências.
- Validar árvore de nós, ID bx_id e congruência com o manifesto;
- Preencher object_name e verified_object no MASTER_SOURCE.json.
- Executar scripts/regenerate_json.py e scripts/check_package.py.
- NÃO habilitar corte, crânio, pele ou explodido sem assets co-registrados.
MSG
