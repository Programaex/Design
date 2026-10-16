// A4 page renderer — the markup of Claude Design's "Prisma Export" as a pure HTML string, so the web viewer,
// the shared standalone HTML and the native app (expo-print) print the exact same pages. Every value is escaped.
import { TEMPLATES, standaloneHtml, viewModel, type Face, type Page, type PlacedFace, type TemplateId } from './export';
import type { Plan } from './types';

const esc = (v: unknown): string => String(v ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
/** Values that land inside style="" (colors, widths) come from the view-model, never from user text; still strip quotes/semicolon breakouts. */
const css = (v: unknown): string => String(v ?? '').replace(/["<>;{}]/g, '');
const MONO = "font-family:'IBM Plex Mono',ui-monospace,monospace";
const ELL = 'white-space:nowrap;overflow:hidden;text-overflow:ellipsis';
const clampN = (n: number) => `display:-webkit-box;-webkit-line-clamp:${n};-webkit-box-orient:vertical;overflow:hidden`;
const map = <T,>(xs: T[], f: (x: T, i: number) => string) => xs.map(f).join('');

function kpiGrid(kpis: Extract<Face, { type: 'cover' }>['kpis'], big: boolean): string {
  return `<div style="margin-top:auto;display:grid;grid-template-columns:repeat(4,minmax(0,1fr));border:1px solid #EAEAE8">` +
    map(kpis, k => big
      ? `<div style="padding:12px 14px;border-right:1px solid #EAEAE8;min-width:0"><div style="${MONO};font-size:9px;letter-spacing:.1em;text-transform:uppercase;color:#6B7280;margin-bottom:8px;${ELL}">${esc(k.label)}</div><div style="${MONO};font-size:24px;font-weight:700;line-height:1;color:${css(k.color)};white-space:nowrap">${esc(k.value)}</div><div data-clamp="1" style="font-size:11px;color:#6B7280;margin-top:4px;${ELL}">${esc(k.caption)}</div></div>`
      : `<div style="padding:8px 12px;border-right:1px solid #EAEAE8;min-width:0"><div style="${MONO};font-size:8.5px;letter-spacing:.1em;text-transform:uppercase;color:#6B7280;${ELL}">${esc(k.label)}</div><div style="${MONO};font-size:20px;font-weight:700;line-height:1.1;margin-top:4px;color:${css(k.color)}">${esc(k.value)}</div><div style="font-size:10px;color:#6B7280;${ELL}">${esc(k.caption)}</div></div>`) +
    '</div>';
}

function faceBody(f: Face): string {
  switch (f.type) {
    case 'cover':
      return `<div style="flex:1;min-height:0;display:flex;flex-direction:column">` +
        `<div data-clamp="1" style="${MONO};font-size:10px;letter-spacing:.12em;text-transform:uppercase;color:#6B7280;margin-bottom:4px;${ELL}">${esc(f.eyebrow)}</div>` +
        `<h1 data-clamp="1" style="margin:0 0 10px;font-size:32px;font-weight:700;letter-spacing:-.025em;line-height:1.08;${clampN(2)}">${esc(f.h1)}</h1>` +
        `<p data-clamp="1" style="margin:0;font-size:12.5px;line-height:1.55;color:#6B7280;max-width:60ch;${clampN(3)}">${esc(f.lede)}</p>` +
        kpiGrid(f.kpis, true) + '</div>';
    case 'epic': {
      const left = f.left ? `<div style="min-width:0;min-height:0;overflow:hidden;padding:12px 16px;border-right:1px solid #EAEAE8;display:flex;flex-direction:column">` +
        `<div style="display:flex;align-items:center;gap:6px;margin-bottom:8px"><span style="${MONO};font-size:9px;letter-spacing:.06em;text-transform:uppercase;border:1px solid #D1D5DB;border-radius:4px;padding:2px 6px;background:#FFFFFF">${esc(f.left.tag)}</span><span style="${MONO};font-size:9px;color:#6B7280">${esc(f.left.id)}</span></div>` +
        `<div data-clamp="1" style="font-size:12.5px;font-weight:700;line-height:1.4;margin-bottom:6px;${clampN(2)}">${esc(f.left.title)}</div>` +
        `<div data-clamp="1" style="font-size:11px;line-height:1.5;color:#6B7280;${clampN(5)}">${esc(f.left.desc)}</div>` +
        (f.left.hasMicro ? `<div style="margin-top:auto;padding:6px 8px;background:#F5F5F4;border-radius:2px"><div style="${MONO};font-size:8.5px;letter-spacing:.1em;text-transform:uppercase;color:#5F6670">${esc(f.left.microLabel)}</div><div data-clamp="1" style="font-size:11px;line-height:1.4;margin-top:2px;${clampN(2)}">${esc(f.left.micro)}</div></div>` : '') +
        '</div>' : '';
      return `<div style="flex:1;min-height:0;border:1px solid #EAEAE8;border-radius:2px;overflow:hidden;display:flex;flex-direction:column">` +
        `<div style="flex:none;display:flex;align-items:flex-start;gap:14px;padding:12px 16px;border-bottom:1px solid #EAEAE8;background:#F5F5F4">` +
        `<span style="flex:none;width:28px;height:28px;background:#2563EB;color:#FFFFFF;display:flex;align-items:center;justify-content:center;${MONO};font-size:12px;font-weight:700;border-radius:2px">${esc(f.num)}</span>` +
        `<div style="flex:1;min-width:0"><div style="${MONO};font-size:9px;letter-spacing:.08em;text-transform:uppercase;color:#5F6670;margin-bottom:2px;${ELL}">${esc(f.eyebrow)}</div><div data-clamp="1" style="font-size:16px;font-weight:700;line-height:1.25;${ELL}">${esc(f.title)}</div></div>` +
        `<div style="flex:none;text-align:right"><div style="${MONO};font-size:13px;font-weight:700">${esc(f.pct)}</div><div style="width:64px;height:3px;background:#D6D6D3;margin-top:4px;position:relative"><span style="position:absolute;left:0;top:0;bottom:0;background:#2563EB;width:${css(f.pct)}"></span></div></div></div>` +
        `<div style="flex:1;min-height:0;display:grid;grid-template-columns:${css(f.cols)}">${left}` +
        `<div style="min-width:0;min-height:0;overflow:hidden;padding:12px 16px"><div style="${MONO};font-size:9px;letter-spacing:.08em;text-transform:uppercase;color:#6B7280;margin-bottom:6px">${esc(f.countLabel)}</div>` +
        map(f.tasks, t => `<div style="display:flex;align-items:flex-start;gap:10px;padding:6px 0;border-bottom:1px solid #EAEAE8;font-size:11.5px">` +
          `<span style="flex:none;margin-top:3px;width:10px;height:10px;border-radius:50%;box-sizing:border-box;border:1.5px solid ${css(t.dot)};background:${css(t.fill)}"></span>` +
          `<span data-clamp="1" style="flex:1;min-width:0;line-height:1.35;${clampN(2)}"><span style="${MONO};font-size:9px;color:#6B7280">${esc(t.code)}</span> <span style="color:${css(t.color)};text-decoration:${css(t.deco)}">${esc(t.text)}</span></span>` +
          `<span style="flex:none;${MONO};font-size:8.5px;letter-spacing:.04em;text-transform:uppercase;padding:3px 8px;border-radius:40px;white-space:nowrap;background:${css(t.bg)};color:${css(t.fg)}">${esc(t.label)}</span></div>`) +
        '</div></div></div>';
    }
    case 'routine':
      return `<div style="flex:1;min-height:0;display:flex;flex-direction:column;gap:12px">` +
        `<div style="flex:none;border:1px solid #EAEAE8;border-radius:2px;overflow:hidden"><div style="${MONO};font-size:9px;letter-spacing:.1em;text-transform:uppercase;color:#6B7280;padding:12px 16px 0">${esc(f.label)}</div>` +
        `<div style="display:flex;align-items:stretch;gap:8px;padding:12px 16px 14px">` +
        (f.steps.length ? map(f.steps, s => `<div style="flex:1;min-width:0;display:flex;align-items:stretch;gap:8px"><div style="flex:1;min-width:0;display:flex;align-items:center;gap:10px;padding:10px 12px;background:${css(s.bg)};border-left:3px solid ${css(s.bl)}">` +
          `<span style="flex:none;${MONO};font-size:14px;font-weight:700;color:${css(s.nc)}">${esc(s.num)}</span><div style="min-width:0"><div data-clamp="1" style="font-size:11.5px;font-weight:700;line-height:1.3;${clampN(2)}">${esc(s.name)}</div><div style="${MONO};font-size:9px;color:#6B7280;margin-top:2px;${ELL}">${esc(s.time)}</div></div></div>` +
          (s.arrow ? '<span style="flex:none;width:12px;display:flex;align-items:center;justify-content:center;font-size:14px;color:#6B7280">→</span>' : '') + '</div>')
          : '<div style="font-size:11.5px;color:#6B7280">Nenhuma rotina escolhida.</div>') +
        '</div></div>' +
        `<div style="flex:1;min-height:0;display:grid;grid-template-columns:1fr 1fr;border:1px solid #EAEAE8;border-radius:2px;overflow:hidden">` +
        `<div style="padding:12px 16px;border-right:1px solid #EAEAE8;min-width:0"><div style="${MONO};font-size:9px;letter-spacing:.1em;text-transform:uppercase;color:#6B7280">Pergunta de controle</div><div data-clamp="1" style="font-size:12px;line-height:1.5;margin-top:6px;${clampN(5)}">${esc(f.controle)}</div></div>` +
        `<div style="padding:12px 16px;min-width:0"><div style="${MONO};font-size:9px;letter-spacing:.1em;text-transform:uppercase;color:#6B7280">Regras de uso</div><div data-clamp="1" style="font-size:12px;line-height:1.5;margin-top:6px;${clampN(5)}">${esc(f.regras)}</div></div>` +
        '</div></div>';
    case 'days':
      return `<div style="flex:1;min-height:0;border:1px solid #EAEAE8;border-radius:2px;overflow:hidden;display:flex;flex-direction:column">` +
        `<div style="flex:none;display:flex;align-items:center;gap:16px;padding:10px 16px;border-bottom:1px solid #D6D6D3;background:#F5F5F4;${MONO};font-size:8.5px;letter-spacing:.08em;text-transform:uppercase;color:#5F6670"><span style="flex:none;width:44px">Dia</span><span style="flex:1;min-width:0">Foco da entrega</span><span style="flex:none;width:170px">Trilhas</span></div>` +
        map(f.rows, r => `<div style="display:flex;align-items:center;gap:16px;padding:10px 16px;border-bottom:1px solid #EAEAE8;background:${css(r.bg)}">` +
          `<div style="flex:none;width:44px;${MONO};font-size:15px;font-weight:700">${esc(r.num)}<span style="display:block;font-size:8px;font-weight:400;color:#6B7280;margin-top:1px;white-space:nowrap">${esc(r.date)}</span></div>` +
          `<div style="flex:1;min-width:0"><div data-clamp="1" style="font-size:12px;font-weight:700;line-height:1.35;${clampN(2)}">${esc(r.action)}</div>` +
          `<div style="display:flex;align-items:center;gap:6px;margin-top:3px;min-width:0"><span style="flex:none;${MONO};font-size:8.5px;color:#6B7280">${esc(r.count)}</span>` +
          (r.hasMarco ? `<span style="min-width:0;${MONO};font-size:8.5px;font-weight:700;letter-spacing:.04em;text-transform:uppercase;padding:2px 6px;border-radius:4px;background:#EFF6FF;color:#2563EB;${ELL}">${esc(r.marco)}</span>` : '') + '</div></div>' +
          `<div style="flex:none;width:170px;display:flex;flex-wrap:wrap;gap:4px">` +
          map(r.tracks, t => `<span style="${MONO};font-size:8px;letter-spacing:.02em;padding:3px 7px;border-radius:40px;white-space:nowrap;background:${css(t.bg)};color:${css(t.fg)};font-weight:${css(t.fw)}">${esc(t.t)}</span>`) +
          '</div></div>') + '</div>';
    case 'map':
      return `<div style="flex:1;min-height:0;display:flex;flex-direction:column">` +
        (f.root ? `<div style="flex:none;${MONO};font-size:10px;letter-spacing:.12em;text-transform:uppercase;color:#6B7280;margin-bottom:6px">Mapa mental · grupos, entregáveis e tarefas</div>` +
          `<div style="flex:none;padding:10px 14px;background:#202124;color:#FFFFFF;border-radius:2px"><div data-clamp="1" style="font-size:15px;font-weight:700;${ELL}">${esc(f.root.nome)}</div><div style="${MONO};font-size:9px;color:#D6D6D3;margin-top:2px">${esc(f.root.range)} · ${esc(f.root.d)}/${esc(f.root.n)} feitas · ${esc(f.root.pct)}</div></div>` : '') +
        `<div style="flex:1;min-height:0;margin-left:14px;padding:8px 0 0 14px;border-left:2px solid #D6D6D3;display:flex;flex-direction:column;gap:6px">` +
        map(f.items, it => '<div style="min-width:0">' + (it.kind === 'group'
          ? `<div style="display:flex;align-items:center;gap:8px;padding:7px 12px;border:1px solid #D1D5DB;border-radius:2px"><span data-clamp="1" style="flex:1;min-width:0;font-size:12.5px;font-weight:700;${ELL}">${esc(it.nome)}</span><span style="flex:none;${MONO};font-size:9px;color:#6B7280">${esc(it.sub)}</span></div>`
          : `<div style="margin-left:14px;padding:7px 10px;background:#F5F5F4;border-radius:2px"><div style="display:flex;align-items:center;gap:8px;min-width:0"><span style="flex:none;${MONO};font-size:8.5px;text-transform:uppercase;padding:2px 7px;border-radius:40px;background:${css(it.bg)};color:${css(it.fg)};white-space:nowrap">${esc(it.hz)}</span><span style="flex:none;${MONO};font-size:9px;color:#5F6670">${esc(it.code)}</span><span data-clamp="1" style="flex:1;min-width:0;font-size:11.5px;font-weight:700;${ELL}">${esc(it.titulo)}</span><span style="flex:none;${MONO};font-size:9px;color:#6B7280">${esc(it.d)}/${esc(it.n)}</span></div>` +
            `<div data-clamp="1" style="font-size:10.5px;color:#5F6670;margin-top:3px;${ELL}">${esc(it.line)}</div></div>`) + '</div>') +
        '</div></div>';
    case 'day':
      return `<div style="flex:1;min-height:0;display:flex;flex-direction:column">` +
        `<div style="flex:none;display:flex;justify-content:space-between;align-items:flex-end;gap:12px;padding-bottom:6px;border-bottom:2px solid #202124"><div style="min-width:0"><div style="${MONO};font-size:10px;letter-spacing:.12em;text-transform:uppercase;color:#2563EB;${ELL}">${esc(f.eyebrow)}</div><div style="font-size:26px;font-weight:700;letter-spacing:-.025em;line-height:1.1;margin-top:2px;white-space:nowrap">${esc(f.title)}</div></div>` +
        `<div style="flex:none;text-align:right"><div style="${MONO};font-size:9px;letter-spacing:.1em;text-transform:uppercase;color:#6B7280">Data</div><div style="${MONO};font-size:13px;font-weight:700">${esc(f.date)}</div></div></div>` +
        `<div style="flex:none;display:flex;gap:4px;margin-top:8px">` + map(f.strip, s => `<span style="flex:1;min-width:0;padding:3px 0;text-align:center;border:1px solid ${css(s.bc)};border-radius:2px;background:${css(s.bg)};color:${css(s.fg)};${MONO};font-size:8.5px;font-weight:700;line-height:1.3">${esc(s.t)}<br>${esc(s.s)}</span>`) + '</div>' +
        `<div style="flex:none;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px;margin-top:8px">` +
        map(f.boxes, b => `<div style="padding:8px 10px;border:1px solid #EAEAE8;border-radius:2px;background:${css(b.bg)};color:${css(b.fg)};min-width:0"><div style="${MONO};font-size:8.5px;letter-spacing:.1em;text-transform:uppercase;color:${css(b.lc)}">${esc(b.label)}</div><div data-clamp="1" style="font-size:11px;line-height:1.4;margin-top:3px;${clampN(3)}">${esc(b.text)}</div></div>`) + '</div>' +
        kpiGrid(f.kpis, false) + '</div>';
    case 'cards':
      return `<div style="flex:1;min-height:0;display:grid;grid-template-rows:repeat(2,minmax(0,1fr));gap:8px">` +
        map(f.cards, c => `<div style="min-height:0;border:1px solid #EAEAE8;border-radius:2px;overflow:hidden;display:flex;flex-direction:column">` +
          `<div style="flex:none;display:flex;align-items:center;gap:8px;padding:5px 12px;background:#F5F5F4;border-bottom:1px solid #EAEAE8"><span style="${MONO};font-size:11px;font-weight:700">${esc(c.n)}</span><span style="${MONO};font-size:8.5px;letter-spacing:.06em;text-transform:uppercase;border:1px solid #D1D5DB;border-radius:4px;padding:1px 6px;background:#FFFFFF">${esc(c.grupo)}</span><span style="${MONO};font-size:9px;color:#6B7280">${esc(c.code)}</span><span style="flex:1"></span><span style="flex:none;${MONO};font-size:8.5px;letter-spacing:.04em;text-transform:uppercase;padding:2px 8px;border-radius:40px;white-space:nowrap;background:${css(c.bg)};color:${css(c.fg)}">${esc(c.label)}</span></div>` +
          `<div style="flex:1;min-height:0;display:grid;grid-template-columns:minmax(0,1.2fr) minmax(0,1fr);gap:14px;padding:8px 12px"><div style="min-width:0;min-height:0;overflow:hidden">` +
          `<div data-clamp="1" style="font-size:13px;font-weight:700;line-height:1.3;color:${css(c.color)};text-decoration:${css(c.deco)};${clampN(2)}">${esc(c.text)}</div>` +
          `<div data-clamp="1" style="font-size:10.5px;color:#6B7280;margin-top:4px;${ELL}">${esc(c.ent)}</div>` +
          `<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:6px"><div style="min-width:0"><div style="${MONO};font-size:8px;letter-spacing:.1em;text-transform:uppercase;color:#6B7280">Depende de</div><div style="${MONO};font-size:10px;${ELL}">${esc(c.dep)}</div></div><div style="min-width:0"><div style="${MONO};font-size:8px;letter-spacing:.1em;text-transform:uppercase;color:#6B7280">Desbloqueia</div><div style="${MONO};font-size:10px;${ELL}">${esc(c.unlocks)}</div></div></div></div>` +
          `<div style="min-width:0;min-height:0;overflow:hidden;display:flex;flex-direction:column"><div style="${MONO};font-size:8px;letter-spacing:.1em;text-transform:uppercase;color:#6B7280">Pronto quando</div><div data-clamp="1" style="font-size:10.5px;line-height:1.4;${clampN(2)}">${esc(c.dod)}</div>` +
          `<div style="${MONO};font-size:8px;letter-spacing:.1em;text-transform:uppercase;color:#6B7280;margin-top:6px">Evidência · nota</div><div data-clamp="1" style="min-height:16px;border-bottom:1px solid #D1D5DB;font-size:10.5px;${ELL}">${esc(c.note)}</div>` +
          `<div style="margin-top:auto;padding-top:4px;text-align:right;${MONO};font-size:9px;font-weight:700">${esc(c.feito)}</div></div></div></div>`) + '</div>';
    case 'notes':
      return `<div style="flex:1;min-height:0;display:flex;flex-direction:column"><div style="flex:none;${MONO};font-size:9px;letter-spacing:.1em;text-transform:uppercase;color:#6B7280;margin-bottom:6px">${esc(f.label)}</div>` +
        `<div style="flex:1;min-height:0;background:repeating-linear-gradient(to bottom,transparent 0,transparent 23px,#EAEAE8 23px,#EAEAE8 24px)"></div>` +
        (f.trace ? `<div data-clamp="1" style="flex:none;${MONO};font-size:8px;color:#6B7280;margin-top:8px;padding-top:8px;border-top:1px dashed #D6D6D3;${clampN(2)}">${esc(f.trace)}</div>` : '') + '</div>';
  }
}

function faceHtml(f: PlacedFace, meta: string): string {
  return `<div data-face="${esc(f.idx)}" style="min-height:0;overflow:hidden;display:flex;flex-direction:column;box-sizing:border-box;padding-top:${css(f.pt)};padding-bottom:${css(f.pb)};border-top:${css(f.bt)}">` +
    (f.first ? `<div style="flex:none;display:flex;justify-content:space-between;align-items:center;gap:12px;border-bottom:1px solid #EAEAE8;padding-bottom:8px;margin-bottom:12px"><span style="font-size:12px;font-weight:700;letter-spacing:-.02em">RISCO COGNITIVO</span><span style="${MONO};font-size:8px;letter-spacing:.12em;text-transform:uppercase;color:#6B7280">${esc(meta)}</span></div>` : '') +
    faceBody(f) + '</div>';
}

/** One <section class="page"> per A4 sheet: 10 mm margin, 190 × 277 mm box, 3 equal faces. */
export function pageHtml(pg: Page): string {
  return `<section class="page" style="width:210mm;height:297mm;overflow:hidden;background:#fff;flex:none"><div lang="pt-BR" style="margin:10mm;width:190mm;height:277mm;box-sizing:border-box;display:grid;grid-template-rows:repeat(3,minmax(0,1fr));font-family:Inter,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#202124;-webkit-print-color-adjust:exact;print-color-adjust:exact">` +
    map(pg.faces, f => faceHtml(f, pg.meta)) + '</div></section>';
}
export const pagesHtml = (pages: Page[]): string => map(pages, pageHtml);

/** Complete, self-contained HTML document for a template + plan (share, save, native print). */
export function documentHtml(id: TemplateId, plan: Plan, today?: string): { html: string; title: string; pages: number; filename: string } {
  const T = TEMPLATES.find(t => t.id === id) || TEMPLATES[0];
  const vm = viewModel(T.id, plan, today);
  const title = T.t + ' · ' + plan.nome;
  const filename = ('prisma-' + T.id + '-' + plan.nome).toLowerCase().normalize('NFD').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') + '.html';
  return { html: standaloneHtml(title, pagesHtml(vm.pages)), title, pages: vm.pages.length, filename };
}
