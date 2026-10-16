// Risco Cognitivo tokens (tokens/colors.css, spacing.css) for React Native. Light is the default; dark mirrors [data-theme="dark"].
import { useColorScheme } from 'react-native';

const base = {
	accent: '#0071e3', accent100: '#eff7ff', accent700: '#0066cc', onAccent: '#ffffff',
	neutral300: '#d2d2d7', neutral400: '#a1a1a6',
	brain: { pink: '#f08de7', blue: '#429fe8', green: '#488600', orange: '#f58200', violet: '#4054e9', yellow: '#f8d800' }
};
export const light = {
	...base, bg: '#ffffff', surface: '#f5f5f7', surfaceRaised: '#ffffff', text: '#1d1d1f', muted: '#6e6e73', link: '#0066cc',
	divider: 'rgba(29,29,31,0.16)', scrim: 'rgba(0,0,0,0.4)', success: '#248a3d', warning: '#b25000', danger: '#d70015',
	section: '#000000', onSection: '#f5f5f7', sectionGhost: '#424245',
	tag: { accent: ['#eff7ff', '#0066cc'], neutral: ['#e8e8ed', '#1d1d1f'] }
};
export const dark: typeof light = {
	...base, bg: '#000000', surface: '#1d1d1f', surfaceRaised: '#333336', text: '#f5f5f7', muted: '#a1a1a6', link: '#2997ff',
	divider: 'rgba(245,245,247,0.24)', scrim: 'rgba(0,0,0,0.6)', success: '#30d158', warning: '#ff9f0a', danger: '#ff453a',
	section: '#f5f5f7', onSection: '#1d1d1f', sectionGhost: '#d2d2d7',
	tag: { accent: ['#003a77', '#eff7ff'], neutral: ['#333336', '#f5f5f7'] }
};
export type Theme = typeof light;
export const useTheme = (): Theme => (useColorScheme() === 'dark' ? dark : light);

export const radius = { sm: 8, md: 12, lg: 18, xl: 28, pill: 980 } as const;
export const type = {
	large: { fontSize: 34, lineHeight: 37, fontWeight: '600', letterSpacing: -0.5 },
	title: { fontSize: 28, lineHeight: 32, fontWeight: '600', letterSpacing: -0.3 },
	card: { fontSize: 21, lineHeight: 25, fontWeight: '600', letterSpacing: -0.2 },
	body: { fontSize: 17, lineHeight: 25 },
	headline: { fontSize: 17, lineHeight: 22, fontWeight: '600', letterSpacing: -0.37 },
	callout: { fontSize: 15, lineHeight: 22 },
	caption: { fontSize: 14, lineHeight: 20 },
	micro: { fontSize: 12, lineHeight: 16 },
	kicker: { fontSize: 12, lineHeight: 16, fontWeight: '600' }
} as const;
/** Tag tone → [background, foreground] with the 16% tint of the web `.tag-*` classes. */
export function tone(t: Theme, k: 'success' | 'danger' | 'accent' | 'warning' | 'neutral' | 'outline'): [string, string] {
	if (k === 'accent') return t.tag.accent as [string, string];
	if (k === 'neutral' || k === 'outline') return t.tag.neutral as [string, string];
	const c = t[k];
	return [c + '29', c];
}
