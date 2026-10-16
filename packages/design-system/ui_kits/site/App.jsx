const { NavBar, Button } = window.RiscoCognitivoDesignSystem_fab0ba;
function App() {
  const [page, setPage] = React.useState(() => localStorage.getItem('rc-page') || 'home');
  const go = p => { setPage(p); localStorage.setItem('rc-page', p); window.scrollTo(0, 0); };
  const links = [{ id: 'explore', label: 'Explorar' }, { id: 'topic', label: 'Funções executivas' }, { id: 'topic2', label: 'Neurobiologia' }, { id: 'assess', label: 'Riscos' }].map(l => ({ ...l, current: l.id === page }));
  const Screen = { home: window.Home, explore: window.Explore, topic: window.Topic, assess: window.Assessment }[page] || window.Home;
  return (
    <>
      <NavBar logoSrc="../../assets/brand/svg/02_brain.svg" links={links} onBrandClick={() => go('home')} onNavigate={l => go(l.id === 'topic2' ? 'explore' : l.id)} action={<Button size="sm" onClick={() => go('assess')}>Avaliar</Button>} />
      <main data-screen-label={page}><Screen go={go} /></main>
      <footer style={{ maxWidth: 'var(--layout-column)', margin: '0 auto', padding: 'var(--space-6) var(--layout-edge) var(--space-8)', fontSize: 'var(--text-micro)', lineHeight: 1.33, color: 'var(--color-text-muted)', borderTop: '1px solid var(--color-divider)' }}>
        Conteúdo educativo. Não substitui avaliação clínica. © 2026 Risco Cognitivo.
      </footer>
    </>
  );
}
ReactDOM.createRoot(document.getElementById('root')).render(<App />);
