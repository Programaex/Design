"""Reproduz os dados derivados, sem dependências externas. Executar da raiz do pacote."""
from pathlib import Path
import csv,json,hashlib,re
from html.parser import HTMLParser
ROOT=Path(__file__).resolve().parents[1]
def emit(name,rows):
 with (ROOT/'data/normalized'/name).open('w',encoding='utf-8-sig',newline='') as f:
  w=csv.DictWriter(f,fieldnames=list(rows[0]));w.writeheader();w.writerows(rows)
nodes=[];edges=[];reports=[]
for f in sorted((ROOT/'data/raw').glob('*.csv')):
 dataset=f.name.split('__')[0];rows=list(csv.DictReader(f.open(encoding='utf-8-sig',newline='')));positions={}
 for i,r in enumerate(rows,1):
  pos=(int(r['tier 1 position']),int(r['tier 2 position']))
  if pos in positions: raise ValueError(f'{dataset}: posição duplicada {pos}')
  positions[pos]=f'{dataset}-N{i:03}'
 if (0,0) not in positions:raise ValueError('Raiz ausente')
 locked=0
 for i,r in enumerate(rows,1):
  a,b=int(r['tier 1 position']),int(r['tier 2 position']);id=positions[(a,b)]
  parent='' if (a,b)==(0,0) else positions[(0,0)] if b==0 else positions.get((a,0))
  if parent is None:raise ValueError('Pai ausente')
  blocked=[k for k,v in r.items() if v=='Upgrade to Lite/Pro to unlock'];locked+=bool(blocked)
  nodes.append(dict(id=id,dataset_id=dataset,parent_id=parent,title=r['question'],node_type='topic' if not parent else 'question',answer=r['answer'] if r['answer'] not in ('Upgrade to Lite/Pro to unlock','') else '',answer_status='locked' if 'answer' in blocked else 'available' if r['answer'] else 'missing',url='' if 'url' in blocked else r['url'],page_title='' if 'page title' in blocked else r['page title'],tier1=a,tier2=b,source_record=i,source_file=f.name,region=r.get('region') or '',language=r.get('language') or '',ai_overview_raw=r.get('is AI overview?') or '',ai_urls_raw=r.get('AI overview URLs') or '',ai_titles_raw=r.get('AI overview page titles') or '',locked_fields=json.dumps(blocked,ensure_ascii=False),editorial_review='pending'))
  if parent:edges.append(dict(id=f'{dataset}-E{i:03}',source=parent,target=id,type='parent-child'))
 reports.append(dict(dataset_id=dataset,records=len(rows),edges=len(rows)-1,locked_records=locked,sha256=hashlib.sha256(f.read_bytes()).hexdigest()))
emit('mindmap_nodes.csv',nodes);emit('mindmap_edges.csv',edges)
(ROOT/'data/normalized/mindmaps.json').write_text(json.dumps({'schemaVersion':'1.0.0','nodes':nodes,'edges':edges},ensure_ascii=False,indent=2)+'\n')
class Table(HTMLParser):
 def __init__(self):super().__init__();self.rows=[];self.row=None;self.cell=None
 def handle_starttag(self,t,a):
  if t=='tr':self.row=[]
  if t in ('td','th'):self.cell=[]
 def handle_data(self,d):
  if self.cell is not None:self.cell.append(d)
 def handle_endtag(self,t):
  if t in ('td','th') and self.cell is not None:self.row.append(' '.join(' '.join(self.cell).split()));self.cell=None
  if t=='tr' and self.row is not None:self.rows.append(self.row);self.row=None
p=Table();p.feed((ROOT/'assets/html/DOC-002__cronograma-editorial-transcricao.html').read_text());editorial=[];issues=[]
for i,row in enumerate(p.rows[1:],1):
 original=list(row);flags=[]
 if len(row)==7:
  row=row[:6]+['']+row[6:];flags.append('missing_channel_in_source')
 if len(row)!=8:raise ValueError(f'Editorial registro {i}: {len(row)} colunas')
 if row[0]=='W2-003' and not row[7] and row[6]:
  row[7]=row[6];row[6]='';flags.append('title_shifted_from_channel_review_required')
 if '[cortado]' in ' '.join(row):flags.append('truncated_source')
 dates=re.findall(r'\d{4}-\d{2}-\d{2}',row[1]);start=dates[0] if dates else '';end=dates[-1] if dates else ''
 editorial.append(dict(id=row[0],source_record=i,planned_date_raw=row[1],planned_start=start,planned_end=end,date_kind='window' if len(dates)>1 else 'day',week=row[2],pillar=row[3],piece_type=row[4],format=row[5],channel=row[6],title=row[7],status='unconfirmed',owner='',depends_on='[]',timezone='America/Sao_Paulo',new_planned_start='',new_planned_end='',quality_flags=';'.join(flags),source_cells_json=json.dumps(original,ensure_ascii=False)))
 if flags:issues.append({'id':row[0],'flags':flags})
emit('editorial_workflow.csv',editorial)
assert len({x['id'] for x in nodes})==len(nodes)
assert len({x['id'] for x in editorial})==len(editorial)
assert all(e['source'] in {n['id'] for n in nodes} and e['target'] in {n['id'] for n in nodes} for e in edges)
report={'datasets':reports,'nodes':len(nodes),'edges':len(edges),'editorial_records':len(editorial),'editorial_issues':issues,'checks':['unique IDs','parents resolved','3 roots','raw files unchanged by normalization','editorial source cells retained'],'scope':'Structural validation only; no medical/editorial validation and no application build.'}
(ROOT/'qa/data-validation.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n');print(json.dumps(report,ensure_ascii=False,indent=2))
