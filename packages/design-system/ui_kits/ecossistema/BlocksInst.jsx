// Institutional family blocks (REF-01): HeroCampaign · PromoGrid · FeatureSplit · PageIntro · RelatedContent · Newsletter · BenefitsRow · DetailHeader.
function Heading({ level = 2, className, children }) {
  const H = 'h' + Math.min(Math.max(level, 1), 3);
  return <H className={className}>{children}</H>;
}

function HeroCampaign({ id, title, description, media, actions, theme = 'light', headingLevel = 2, first }) {
  return (
    <div className={'eco-campaign t-' + theme} data-theme={theme === 'dark' ? 'dark' : 'light'}>
      <div className="eco-campaign-copy">
        {first && <BuildTag dark={theme === 'dark'} />}
        <Heading level={headingLevel} className="eco-campaign-title">{title}</Heading>
        {description && <p className="eco-campaign-sub">{description}</p>}
        <Actions actions={actions} />
      </div>
      <Media kind={media.kind || 'hero'} name={id} className="eco-campaign-media" alt={media.alt} />
    </div>
  );
}

function PromoGrid({ id, items }) {
  return (
    <div className="eco-promo">
      {items.map((it, k) => (
        <div key={k} className={'eco-tile t-' + (it.theme || 'alt')} data-theme={it.theme === 'dark' ? 'dark' : 'light'}>
          <div className="eco-tile-copy">
            <h2 className="eco-tile-title">{it.title}</h2>
            <p className="eco-tile-sub">{it.description}</p>
            <Actions actions={it.actions} size="sm" />
          </div>
          <Media kind="landscape" name={`${id}-${k + 1}`} className="eco-tile-media" alt={it.alt} />
        </div>
      ))}
    </div>
  );
}

function FeatureSplit({ id, title, body, media, alignment = 'left', actions, eyebrow }) {
  return (
    <div className="eco-wrap eco-pad">
      <div className={'eco-split' + (alignment === 'right' ? ' rev' : '')}>
        <div className="eco-split-copy">
          {eyebrow && <p className="eco-eyebrow">{eyebrow}</p>}
          <h2 className="eco-section-title">{title}</h2>
          <p className="eco-lead">{body}</p>
          <Actions actions={actions} center={false} />
        </div>
        <Media kind={media.kind || 'landscape'} name={id} className="r24" alt={media.alt} />
      </div>
    </div>
  );
}

function PageIntro({ id, title, description, actions, links, variant = 'showroom', first, note }) {
  const { go } = useEco();
  if (variant === 'cta') return (
    <div className="eco-wrap eco-pad">
      <div className="eco-cta-card">
        <h2 className="eco-section-title">{title}</h2>
        {description && <p className="eco-lead">{description}</p>}
        <Actions actions={actions} center={false} />
        {note && <p className="eco-note"><i className="ph ph-info"></i>{note}</p>}
      </div>
    </div>
  );
  return (
    <div className={'eco-wrap eco-intro v-' + variant}>
      <div className="eco-intro-main">
        {first && <BuildTag />}
        <h1 className={variant === 'center' ? 'eco-campaign-title' : 'eco-showroom-title'}>{title}</h1>
        {description && <p className="eco-lead">{description}</p>}
        {actions && <Actions actions={actions} center={variant === 'center'} />}
      </div>
      {links && <div className="eco-intro-links">{links.map(([l, to], k) => to ? <A key={k} to={to}>{l} <i className="ph ph-arrow-up-right"></i></A> : <span key={k} className="muted">{l} · a configurar</span>)}</div>}
    </div>
  );
}

function RelatedContent({ id, title, items, variant = 'rail' }) {
  if (variant === 'featured') return (
    <div className="eco-wrap eco-pad-sm">
      <A to={items[0].href} className="eco-feat">
        <Media kind="cover" name={`${id}-1`} className="r24" />
        <div className="eco-feat-copy"><span className="eco-kicker">{items[0].kicker}</span><h2 className="eco-section-title">{items[0].title}</h2><p className="eco-lead">{items[0].description}</p></div>
      </A>
    </div>
  );
  if (variant === 'cards') return (
    <div className="eco-wrap eco-pad">
      {title && <h2 className="eco-section-title eco-mb">{title}</h2>}
      <div className="eco-cards3">
        {items.map((it, k) => (
          <A key={k} to={it.href} className="eco-rcard">
            <Media kind="cover" name={`${id}-${k + 1}`} className="r18" />
            <span className="eco-kicker">{it.kicker}</span><h3>{it.title}</h3>
          </A>
        ))}
      </div>
    </div>
  );
  return <RailCarousel id={id} title={title} items={items} />;
}

// REF-01 bottom row: wide media cards with a caption bar, neighbours peeking, dots + arrows, no autoplay.
function RailCarousel({ id, title, items }) {
  const [i, setI] = React.useState(0);
  const n = items.length;
  const key = e => { if (e.key === 'ArrowRight') setI(x => Math.min(n - 1, x + 1)); if (e.key === 'ArrowLeft') setI(x => Math.max(0, x - 1)); };
  return (
    <div className="eco-rail" tabIndex={0} onKeyDown={key} aria-roledescription="carrossel" aria-label={title}>
      {title && <div className="eco-wrap"><h2 className="eco-section-title eco-mb">{title}</h2></div>}
      <div className="eco-rail-view">
        <div className="eco-rail-track" style={{ transform: `translateX(calc(${-i} * (var(--rail-w) + var(--eco-tile-gap))))` }}>
          {items.map((it, k) => (
            <div key={k} className={'eco-rail-card' + (k === i ? ' on' : '')} aria-hidden={k !== i}>
              <Media kind="cover" name={`${id}-${k + 1}`} />
              <div className="eco-rail-cap">
                <A to={it.href} className="eco-pill-btn" tabIndex={k === i ? 0 : -1}>{it.cta || 'Lorem ipsum'}</A>
                <p><b>{it.kicker}</b> · {it.title}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="eco-dots-row">
        <button className="eco-round sm" aria-label="Anterior" disabled={i === 0} onClick={() => setI(i - 1)}><i className="ph-bold ph-caret-left"></i></button>
        <div className="eco-dots">{items.map((_, k) => <button key={k} aria-label={`Item ${k + 1}`} aria-current={k === i} className={'eco-dot' + (k === i ? ' on' : '')} onClick={() => setI(k)}></button>)}</div>
        <button className="eco-round sm" aria-label="Próximo" disabled={i === n - 1} onClick={() => setI(i + 1)}><i className="ph-bold ph-caret-right"></i></button>
      </div>
    </div>
  );
}

function Newsletter({ id, title, description }) {
  const [state, setState] = React.useState('idle');
  const [email, setEmail] = React.useState('');
  const [ok, setOk] = React.useState(false);
  const [err, setErr] = React.useState('');
  const submit = e => {
    e.preventDefault();
    if (!/.+@.+\..+/.test(email)) return setErr('Informe um e-mail válido.');
    if (!ok) return setErr('Confirme o consentimento.');
    setErr(''); setState('sending'); setTimeout(() => setState('done'), 700);
  };
  return (
    <div className="eco-wrap eco-pad">
      <div className="eco-news">
        <div><h2 className="eco-section-title">{title}</h2>{description && <p className="eco-lead">{description}</p>}</div>
        {state === 'done' ? <p className="eco-done"><i className="ph ph-check-circle"></i>Modo demonstração — nenhuma inscrição foi enviada.</p> : (
          <form onSubmit={submit} noValidate>
            <TextField label="E-mail" type="email" placeholder="nome@exemplo.com" value={email} onChange={e => setEmail(e.target.value)} />
            <label className="eco-check"><input type="checkbox" checked={ok} onChange={e => setOk(e.target.checked)} />Lorem ipsum dolor sit amet — aceito receber comunicações.</label>
            {err && <p className="eco-err" role="alert">{err}</p>}
            <Button type="submit" disabled={state === 'sending'}>{state === 'sending' ? 'Enviando…' : 'Inscrever'}</Button>
          </form>
        )}
      </div>
    </div>
  );
}

function BenefitsRow({ id, title, items }) {
  const [open, setOpen] = React.useState(-1);
  return (
    <div className="eco-wrap eco-pad">
      {title && <h2 className="eco-section-title eco-mb">{title}</h2>}
      <div className="eco-benefits">
        {items.map((it, k) => (
          <div key={k} className="eco-benefit">
            <i className={'ph ' + it.icon}></i>
            <h3>{it.title}</h3>
            <p>{open === k ? it.more : it.description}</p>
            <button className="eco-plus" aria-label={open === k ? 'Recolher' : 'Saiba mais'} aria-expanded={open === k} onClick={() => setOpen(open === k ? -1 : k)}><i className={'ph-bold ' + (open === k ? 'ph-minus' : 'ph-plus')}></i></button>
          </div>
        ))}
      </div>
    </div>
  );
}

function DetailHeader({ id, title, description, media, actions, price, kicker, note, first }) {
  const { scrollTo } = useEco();
  return (
    <>
      <div className="eco-subnav">
        <span className="eco-subnav-title">{title}</span>
        <button className="eco-subnav-link eco-only-desktop" onClick={() => scrollTo('funcionalidades') || scrollTo('descricao')}>Visão geral</button>
        <Actions actions={actions.slice(0, 1)} center={false} size="sm" />
      </div>
      <div className="eco-wrap eco-detail">
        <Media kind={media.kind || 'square'} name={id} className="r24 eco-detail-media" />
        <div className="eco-detail-copy">
          {first && <BuildTag />}
          {kicker && <span className="eco-kicker">{kicker}</span>}
          <h1 className="eco-article-title">{title}</h1>
          <p className="eco-lead">{description}</p>
          {price && <p className="eco-price">{price}</p>}
          <Actions actions={actions} center={false} />
          {note && <p className="eco-note"><i className="ph ph-info"></i>{note}</p>}
        </div>
      </div>
    </>
  );
}

Object.assign(window, { Heading, HeroCampaign, PromoGrid, FeatureSplit, PageIntro, RelatedContent, RailCarousel, Newsletter, BenefitsRow, DetailHeader });
