'use client';
// Risco Cognitivo design-system primitives — 1:1 with the Claude Design bundle (Button, Tag, TextField,
// SegmentedControl) plus the iOS-style Switch and the Phosphor icon used across the prototypes.
import { useId, type ButtonHTMLAttributes, type InputHTMLAttributes, type ReactNode } from 'react';

const cx = (...xs: (string | false | null | undefined)[]) => xs.filter(Boolean).join(' ');

/** Phosphor Regular icon (web font). `name` without the `ph-` prefix. */
export function Icon({ name, className, style, label }: { name: string; className?: string; style?: React.CSSProperties; label?: string }) {
	return <i className={cx('ph', 'ph-' + name, className)} style={style} aria-hidden={label ? undefined : true} aria-label={label} role={label ? 'img' : undefined} />;
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
	variant?: 'primary' | 'secondary' | 'ghost';
	size?: 'md' | 'sm';
	block?: boolean;
	icon?: ReactNode;
};
export function Button({ variant = 'primary', size = 'md', block, icon, className, children, type = 'button', ...rest }: ButtonProps) {
	return (
		<button type={type} className={cx('btn', 'btn-' + variant, size === 'sm' && 'btn-sm', block && 'btn-block', 'min-h-11', size === 'sm' && 'min-h-8', className)} {...rest}>
			{icon}
			{children}
		</button>
	);
}

export type TagTone = 'neutral' | 'accent' | 'outline' | 'success' | 'warning' | 'danger';
export function Tag({ tone = 'neutral', className, children }: { tone?: TagTone; className?: string; children: ReactNode }) {
	return <span className={cx('tag', 'tag-' + tone, className)}>{children}</span>;
}

type FieldProps = InputHTMLAttributes<HTMLInputElement> & { label: string };
export function TextField({ label, id, className, ...rest }: FieldProps) {
	const auto = useId();
	const fid = id || auto;
	return (
		<div className={cx('field', className)}>
			<label htmlFor={fid}>{label}</label>
			<input className="input" id={fid} {...rest} />
		</div>
	);
}

export function SegmentedControl<T extends string>({ name, options, value, onChange, ariaLabel, className }: {
	name: string; options: { value: T; label: string }[]; value: T; onChange: (v: T) => void; ariaLabel: string; className?: string;
}) {
	return (
		<div className={cx('seg', className)} role="radiogroup" aria-label={ariaLabel}>
			{options.map(o => (
				<label className="seg-opt flex-1 justify-center whitespace-nowrap" key={o.value}>
					<input type="radio" name={name} value={o.value} checked={value === o.value} onChange={() => onChange(o.value)} />
					{o.label}
				</label>
			))}
		</div>
	);
}

/** 51 × 31 iOS switch from the prototype (green track when on). */
export function Switch({ on, onToggle, label }: { on: boolean; onToggle: () => void; label: string }) {
	return (
		<button
			type="button" role="switch" aria-checked={on} aria-label={label} onClick={onToggle}
			className="relative h-[31px] w-[51px] flex-none cursor-pointer rounded-full border-0 p-0 transition-colors duration-200"
			style={{ background: on ? 'var(--color-success)' : 'var(--color-neutral-300)' }}
		>
			<span className="absolute top-[2px] h-[27px] w-[27px] rounded-full bg-white shadow-[0_1px_3px_rgba(0,0,0,.2)] transition-[left] duration-200 ease-[var(--ease-standard)]" style={{ left: on ? 22 : 2 }} />
		</button>
	);
}

/** Round check used by tasks and routines. */
export function Check({ done, size = 22 }: { done: boolean; size?: number }) {
	return (
		<span
			className="box-border grid flex-none place-items-center rounded-full text-white"
			style={{ width: size, height: size, border: `1.5px solid ${done ? 'var(--color-success)' : 'var(--color-neutral-400)'}`, background: done ? 'var(--color-success)' : 'transparent', fontSize: size * 0.6 }}
		>
			<Icon name="check" style={{ opacity: done ? 1 : 0 }} />
		</span>
	);
}

export function ProgressBar({ pct, height = 4, color = 'var(--color-text)', track = 'var(--color-surface)', className }: { pct: number; height?: number; color?: string; track?: string; className?: string }) {
	return (
		<div className={cx('overflow-hidden rounded-full', className)} style={{ height, background: track }} role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(pct)}>
			<div className="h-full rounded-full transition-[width] duration-[240ms] ease-[var(--ease-standard)]" style={{ width: pct + '%', background: color }} />
		</div>
	);
}

export { cx };
