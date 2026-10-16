// Native counterparts of the design-system primitives (web: apps/executar-web/src/components/ds.tsx).
import * as Haptics from 'expo-haptics';
import * as P from 'phosphor-react-native';
import { forwardRef, type ReactNode } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View, type PressableProps, type StyleProp, type TextInputProps, type TextStyle, type ViewStyle } from 'react-native';
import { radius, tone, type, useTheme } from '@/lib/theme';

const ICONS: Record<string, P.Icon> = {
	'pen-nib': P.PenNib, code: P.Code, handshake: P.Handshake, 'gear-six': P.GearSix, 'book-open': P.BookOpen, house: P.House,
	'list-checks': P.ListChecks, 'play-circle': P.PlayCircle, 'tree-structure': P.TreeStructure, 'sun-horizon': P.SunHorizon, 'user-circle': P.UserCircle,
	'caret-left': P.CaretLeft, 'caret-right': P.CaretRight, 'caret-down': P.CaretDown, 'caret-up': P.CaretUp, check: P.Check, 'check-circle': P.CheckCircle,
	circle: P.Circle, plus: P.Plus, trash: P.Trash, warning: P.Warning, 'warning-circle': P.WarningCircle, x: P.X, 'dots-three': P.DotsThree,
	play: P.Play, pause: P.Pause, 'arrow-counter-clockwise': P.ArrowCounterClockwise, alarm: P.Alarm, bell: P.Bell, 'bell-slash': P.BellSlash,
	cloud: P.Cloud, 'cloud-check': P.CloudCheck, 'cloud-slash': P.CloudSlash, 'arrows-clockwise': P.ArrowsClockwise, 'device-mobile': P.DeviceMobile,
	users: P.Users, 'download-simple': P.DownloadSimple, 'sign-out': P.SignOut, clock: P.Clock, 'file-arrow-down': P.FileArrowDown,
	'file-arrow-up': P.FileArrowUp, 'file-pdf': P.FilePdf, 'squares-four': P.SquaresFour, 'calendar-blank': P.CalendarBlank, notebook: P.Notebook,
	'chart-bar': P.ChartBar, 'share-network': P.ShareNetwork, printer: P.Printer
};
export function Icon({ name, size = 20, color }: { name: string; size?: number; color?: string }) {
	const t = useTheme();
	const C = ICONS[name] ?? P.Circle;
	return <C size={size} color={color ?? t.text} weight="regular" />;
}

export function Txt({ style, ...rest }: React.ComponentProps<typeof Text>) {
	const t = useTheme();
	return <Text style={[{ color: t.text }, type.body, style]} {...rest} />;
}

type BtnProps = Omit<PressableProps, 'style' | 'children'> & { variant?: 'primary' | 'secondary' | 'ghost'; size?: 'md' | 'sm'; block?: boolean; children: ReactNode; style?: StyleProp<ViewStyle> };
export function Button({ variant = 'primary', size = 'md', block, children, style, onPress, ...rest }: BtnProps) {
	const t = useTheme();
	const sm = size === 'sm';
	return (
		<Pressable accessibilityRole="button" onPress={e => { void Haptics.selectionAsync(); onPress?.(e); }}
			style={({ pressed }) => [{
				minHeight: sm ? 32 : 44, paddingHorizontal: variant === 'ghost' ? 4 : sm ? 12 : 16, borderRadius: radius.pill, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 6,
				backgroundColor: variant === 'primary' ? (pressed ? t.accent700 : t.accent) : pressed && variant === 'secondary' ? t.link + '1F' : 'transparent',
				borderWidth: variant === 'secondary' ? 1 : 0, borderColor: t.link, alignSelf: block ? 'stretch' : 'flex-start', opacity: rest.disabled ? 0.45 : 1
			}, style]} {...rest}>
			<Text style={{ color: variant === 'primary' ? t.onAccent : t.link, fontSize: sm ? 12 : 17, letterSpacing: -0.37 }}>{children}</Text>
		</Pressable>
	);
}

export function Tag({ toneKey = 'neutral', children }: { toneKey?: Parameters<typeof tone>[1]; children: ReactNode }) {
	const t = useTheme();
	const [bg, fg] = tone(t, toneKey);
	return <View style={{ backgroundColor: bg, borderRadius: radius.pill, paddingHorizontal: 10, paddingVertical: 3, alignSelf: 'flex-start' }}><Text style={{ color: fg, fontSize: 12, fontWeight: '500' }}>{children}</Text></View>;
}

export const Field = forwardRef<TextInput, TextInputProps & { label: string }>(function Field({ label, style, ...rest }, ref) {
	const t = useTheme();
	return (
		<View>
			<Text style={[type.micro, { color: t.muted, marginBottom: 6 }]}>{label}</Text>
			<TextInput ref={ref} placeholderTextColor={t.muted} accessibilityLabel={label}
				style={[{ minHeight: 44, paddingHorizontal: 12, fontSize: 17, color: t.text, backgroundColor: t.surface, borderWidth: StyleSheet.hairlineWidth * 2, borderColor: t.divider, borderRadius: radius.md }, style as StyleProp<TextStyle>]} {...rest} />
		</View>
	);
});

export function Segmented<T extends string>({ options, value, onChange, label }: { options: { value: T; label: string }[]; value: T; onChange: (v: T) => void; label: string }) {
	const t = useTheme();
	return (
		<View accessibilityRole="radiogroup" accessibilityLabel={label} style={{ flexDirection: 'row', gap: 2, padding: 2, backgroundColor: t.surface, borderRadius: radius.md }}>
			{options.map(o => {
				const on = o.value === value;
				return (
					<Pressable key={o.value} accessibilityRole="radio" accessibilityState={{ checked: on }} onPress={() => onChange(o.value)}
						style={{ flex: 1, alignItems: 'center', paddingVertical: 6, borderRadius: radius.md - 2, backgroundColor: on ? t.surfaceRaised : 'transparent', borderWidth: on ? StyleSheet.hairlineWidth * 2 : 0, borderColor: t.divider }}>
						<Text style={{ fontSize: 14, color: on ? t.text : t.muted }}>{o.label}</Text>
					</Pressable>
				);
			})}
		</View>
	);
}

/** 51 × 31 switch from the prototype (green track when on). */
export function Switch({ on, onToggle, label }: { on: boolean; onToggle: () => void; label: string }) {
	const t = useTheme();
	return (
		<Pressable accessibilityRole="switch" accessibilityState={{ checked: on }} accessibilityLabel={label} onPress={() => { void Haptics.selectionAsync(); onToggle(); }} hitSlop={8}
			style={{ width: 51, height: 31, borderRadius: 16, backgroundColor: on ? t.success : t.neutral300, justifyContent: 'center' }}>
			<View style={{ position: 'absolute', left: on ? 22 : 2, width: 27, height: 27, borderRadius: 14, backgroundColor: '#fff', shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 2, shadowOffset: { width: 0, height: 1 }, elevation: 2 }} />
		</Pressable>
	);
}

export function Check({ done, size = 22 }: { done: boolean; size?: number }) {
	const t = useTheme();
	return (
		<View style={{ width: size, height: size, borderRadius: size / 2, borderWidth: 1.5, borderColor: done ? t.success : t.neutral400, backgroundColor: done ? t.success : 'transparent', alignItems: 'center', justifyContent: 'center' }}>
			{done && <P.Check size={size * 0.6} color="#fff" weight="bold" />}
		</View>
	);
}

export function Progress({ pct, height = 4, color, track }: { pct: number; height?: number; color?: string; track?: string }) {
	const t = useTheme();
	return (
		<View accessibilityRole="progressbar" accessibilityValue={{ min: 0, max: 100, now: Math.round(pct) }} style={{ height, borderRadius: height, backgroundColor: track ?? t.surface, overflow: 'hidden' }}>
			<View style={{ height: '100%', width: `${pct}%`, backgroundColor: color ?? t.text, borderRadius: height }} />
		</View>
	);
}

/** Grouped list container (iOS inset-grouped look of the prototype). */
export function Group({ children, style }: { children: ReactNode; style?: StyleProp<ViewStyle> }) {
	const t = useTheme();
	return <View style={[{ backgroundColor: t.surface, borderRadius: radius.lg, overflow: 'hidden' }, style]}>{children}</View>;
}
export function Row({ first, children, onPress, style }: { first?: boolean; children: ReactNode; onPress?: () => void; style?: StyleProp<ViewStyle> }) {
	const t = useTheme();
	const s: StyleProp<ViewStyle> = [{ flexDirection: 'row', alignItems: 'center', gap: 12, minHeight: 52, paddingHorizontal: 16, paddingVertical: 8, borderTopWidth: first ? 0 : StyleSheet.hairlineWidth, borderTopColor: t.divider }, style];
	return onPress ? <Pressable accessibilityRole="button" onPress={onPress} style={({ pressed }) => [s, pressed && { opacity: 0.6 }]}>{children}</Pressable> : <View style={s}>{children}</View>;
}
export function SectionLabel({ children }: { children: ReactNode }) {
	const t = useTheme();
	return <Text style={[type.kicker, { color: t.muted, paddingHorizontal: 4, paddingBottom: 8, paddingTop: 24 }]}>{children}</Text>;
}
