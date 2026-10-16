import React from 'react';
import { createRoot } from 'react-dom/client';
import { Button, TextField } from './ds.js';

// Só aceita destino interno ("/algo", nunca "//host" ou URL absoluta).
const safeNext = () => { const n = new URLSearchParams(location.search).get('next') || '/'; return /^\/(?!\/)/.test(n) ? n : '/'; };

function Login() {
	const [error, setError] = React.useState('');
	const [busy, setBusy] = React.useState(false);
	const submit = async e => {
		e.preventDefault();
		setBusy(true); setError('');
		const f = new FormData(e.currentTarget);
		const r = await fetch('/api/login', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ user: f.get('user'), pass: f.get('pass') }) }).catch(() => null);
		setBusy(false);
		if (r && r.ok) location.replace(safeNext());
		else setError((r && (await r.json().catch(() => ({}))).error) || 'Não foi possível entrar.');
	};
	return (
		<main className="login">
			<form className="login-card" onSubmit={submit}>
				<img src="/assets/brand/svg/01_stack_check.svg" alt="" width="48" height="48" />
				<h1>CMS EXECUTAR</h1>
				<p className="text-muted">Central de controle do ecossistema.</p>
				<TextField label="Usuário" name="user" autoComplete="username" inputMode="numeric" required autoFocus />
				<TextField label="Senha" name="pass" type="password" autoComplete="current-password" required />
				{error && <p className="login-error" role="alert">{error}</p>}
				<Button type="submit" block disabled={busy}>{busy ? 'Entrando…' : 'Entrar'}</Button>
			</form>
		</main>
	);
}
createRoot(document.getElementById('root')).render(<Login />);
