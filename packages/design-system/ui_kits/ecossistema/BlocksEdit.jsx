// Editorial family blocks (REF-02): ArticleHeader · RichText · MediaFigure · EvidenceList · DiscussionFeed · FormSection.
function ArticleHeader({ id, title, publishedAt, authors, readingMinutes, kicker, first }) {
  return (
    <div className="eco-col eco-art-head">
      {first && <BuildTag />}
      {kicker && <span className="eco-kicker">{kicker}</span>}
      <h1 className="eco-article-title">{title}</h1>
      <p className="eco-art-meta">{[publishedAt, authors && authors.join(', '), readingMinutes && `${readingMinutes} min de leitura`].filter(Boolean).join(' · ')}</p>
    </div>
  );
}

// content: [{ t:'p'|'q'|'h2'|'lead', text, by? }] — structured. Artigos do CMS também trazem:
// { t:'html' } (markdown do repositório, gerado no build), { t:'panel'|'ascii' } e { t:'figure' }.
const ECO_DS_CONTENT = window.RiscoCognitivoDesignSystem_fab0ba;
function RichText({ id, content }) {
  return (
    <div className="eco-col eco-rich">
      {content.map((c, k) => c.t === 'html' ? <div key={k} className="eco-md" dangerouslySetInnerHTML={{ __html: c.html }} />
        : c.t === 'panel' ? <ECO_DS_CONTENT.PlainTextPanel key={k} id={c.id} kind={c.kind} title={c.title}>{c.text}</ECO_DS_CONTENT.PlainTextPanel>
        : c.t === 'ascii' ? <ECO_DS_CONTENT.AsciiDiagram key={k} id={c.id} kind={c.kind} title={c.title}>{c.text}</ECO_DS_CONTENT.AsciiDiagram>
        : c.t === 'figure' ? <figure key={k} className="eco-figure eco-figure-inline"><Media kind="landscape" name={id + '-' + k} src={c.src} alt={c.alt} className="r12" fit="contain" />{c.caption && <figcaption>{c.caption}</figcaption>}</figure>
        : c.t === 'h2' ? <h2 key={k}>{c.text}</h2>
        : c.t === 'q' ? <p key={k}><b>{c.by}:</b> {c.text}</p>
        : c.t === 'strong' ? <p key={k}><b>{c.text}</b></p>
        : <p key={k}>{c.text}</p>)}
    </div>
  );
}

function MediaFigure({ id, media, caption, link }) {
  return (
    <figure className="eco-col eco-figure">
      <Media kind={media.kind || 'cover'} name={id} className="r12 eco-figure-media" alt={media.alt} src={media.src} fit={media.src ? 'contain' : undefined} />
      {caption && <figcaption>{caption}{link && <><br /><A to={link[1]}>{link[0]} ›</A></>}</figcaption>}
    </figure>
  );
}

function EvidenceList({ id, title = 'Referências científicas', items, real = false }) {
  return (
    <div className="eco-col eco-evidence">
      <hr />
      <h2>{title}</h2>
      {items.length ? <ol>{items.map((r, k) => <li key={k}>{r}</li>)}</ol> : null}
      {!real && <p className="eco-note"><i className="ph ph-info"></i>Fontes reais a cadastrar no CMS. As linhas acima mostram apenas o formato (autor, ano, título, periódico, DOI).</p>}
    </div>
  );
}

function DiscussionFeed({ id, title, items, allowPosting = false, mode = 'comentarios' }) {
  const { go } = useEco();
  return (
    <div className={mode === 'feed' ? 'eco-wrap eco-pad-sm' : 'eco-col eco-pad-sm'}>
      {title && <h2 className="eco-feed-title">{title}</h2>}
      {items.length === 0 ? <p className="eco-empty"><i className="ph ph-chat-circle-dots"></i>Nenhuma publicação com estes filtros.</p> : (
        <div className="eco-feed">
          {items.map((it, k) => (
            <article key={k} className="eco-post">
              <header><b>{it.author}</b><span>{it.date}</span>{it.tipo && <Tag tone="neutral">{ECO.label(it.tipo)}</Tag>}</header>
              {it.href ? <A to={it.href} className="eco-post-title">{it.title}</A> : null}
              <p>{it.text}</p>
              {it.replies != null && <span className="eco-post-meta"><i className="ph ph-chat-circle"></i>{it.replies} respostas</span>}
            </article>
          ))}
        </div>
      )}
      <div className="eco-feed-cta">
        <Button variant="secondary" onClick={() => go('/entrar')}>{allowPosting ? 'Entrar para publicar' : 'Entrar para comentar'}</Button>
        <span className="muted">Leitura pública. Envio exige conta e passa por moderação.</span>
      </div>
    </div>
  );
}

// fields: [{ name, label, type, required, rows }]; demo mode is explicit — nothing is sent.
function FormSection({ id, formId, fields, submitLabel, title, consent = true }) {
  const [vals, setVals] = React.useState({});
  const [errs, setErrs] = React.useState({});
  const [state, setState] = React.useState('idle');
  const submit = e => {
    e.preventDefault();
    const er = {};
    fields.forEach(f => {
      const v = (vals[f.name] || '').trim();
      if (f.required && !v) er[f.name] = 'Campo obrigatório.';
      else if (f.type === 'email' && v && !/.+@.+\..+/.test(v)) er[f.name] = 'E-mail inválido.';
    });
    if (consent && !vals.__ok) er.__ok = 'Confirme o consentimento.';
    setErrs(er);
    if (Object.keys(er).length) return;
    setState('sending'); setTimeout(() => setState('done'), 800);
  };
  if (state === 'done') return <div className="eco-col eco-pad-sm"><div className="eco-form done"><i className="ph ph-check-circle"></i><h2>Recebido (demonstração).</h2><p className="muted">Endpoint de “{formId}” a configurar no CMS — nenhum dado foi enviado.</p><Button variant="secondary" onClick={() => { setVals({}); setState('idle'); }}>Novo envio</Button></div></div>;
  return (
    <div className="eco-col eco-pad-sm">
      <form className="eco-form" onSubmit={submit} noValidate aria-label={title || formId}>
        {title && <h2>{title}</h2>}
        {fields.map(f => (
          <div key={f.name}>
            {f.rows
              ? <div className="field"><label htmlFor={formId + f.name}>{f.label}{f.required ? ' *' : ''}</label><textarea id={formId + f.name} className="input" rows={f.rows} value={vals[f.name] || ''} onChange={e => setVals({ ...vals, [f.name]: e.target.value })}></textarea></div>
              : <TextField label={f.label + (f.required ? ' *' : '')} type={f.type || 'text'} value={vals[f.name] || ''} onChange={e => setVals({ ...vals, [f.name]: e.target.value })} />}
            {errs[f.name] && <p className="eco-err" role="alert">{errs[f.name]}</p>}
          </div>
        ))}
        {consent && <label className="eco-check"><input type="checkbox" checked={!!vals.__ok} onChange={e => setVals({ ...vals, __ok: e.target.checked })} />Lorem ipsum dolor sit amet — consentimento para tratamento dos dados.</label>}
        {errs.__ok && <p className="eco-err" role="alert">{errs.__ok}</p>}
        <div className="eco-form-foot"><Button type="submit" disabled={state === 'sending'}>{state === 'sending' ? 'Enviando…' : submitLabel}</Button><span className="muted">Modo demonstração</span></div>
      </form>
    </div>
  );
}

Object.assign(window, { ArticleHeader, RichText, MediaFigure, EvidenceList, DiscussionFeed, FormSection });
