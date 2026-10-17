'use client';
import { Button, TextField } from '../ds';
import type { PrismaApp } from '../use-prisma-app';

export function Login({ app }: { app: PrismaApp }) {
	const { s, a } = app;
	return (
		<div data-screen-label="Login" className="flex flex-1 flex-col overflow-auto px-7 pt-6 pb-10">
			<div className="flex flex-1 flex-col justify-center gap-3.5 text-center">
				<div className="text-[12px] font-semibold text-text-muted">EXECUTAR · Prisma</div>
				<h1 className="m-0 text-[40px] leading-[1.05] font-semibold tracking-[-0.015em]">Planeje menos.<br />Execute mais.</h1>
				<p className="m-0 text-[17px] leading-[1.47] text-text-muted">Responda oito perguntas e receba seu plano em três horizontes.</p>
			</div>
			<form className="flex flex-col gap-3" onSubmit={e => { e.preventDefault(); void a.requestLogin(s.email); }}>
				<TextField label="E-mail" type="email" autoComplete="email" placeholder="voce@exemplo.com" value={s.email} onChange={e => a.up({ email: e.target.value })} />
				<Button type="submit" variant="primary" block>Continuar com e-mail</Button>
				<div className="grid grid-cols-2 gap-2">
					<Button variant="secondary" block onClick={() => a.oauth('Apple')}>Apple</Button>
					<Button variant="secondary" block onClick={() => a.oauth('Google')}>Google</Button>
				</div>
				<div className="flex justify-center"><Button variant="ghost" onClick={a.guest}>Usar sem conta</Button></div>
				<p className="m-0 text-center text-[12px] text-text-muted">Sem conta, o plano fica só neste aparelho.</p>
			</form>
		</div>
	);
}
