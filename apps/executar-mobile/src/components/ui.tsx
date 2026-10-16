// Native counterparts of the design-system primitives (web: apps/executar-web/src/components/ds.tsx).
import * as Haptics from 'expo-haptics';
import * as P from 'phosphor-react-native';
import { forwardRef, type ReactNode } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View, type PressableProps, type StyleProp, type TextInputProps, type TextStyle, type ViewStyle } from 'react-native';
import { radius, tone, type, useTheme } from '@/lib/theme';

const ICONS: Record<string, P.Icon> = {
	'pen-nib': P.PenNibIcon, code: P.CodeIcon, handshake: P.HandshakeIcon, 'gear-six': P.GearSixIcon, 'book-open': P.BookOpenIcon, house: P.HouseIcon,
	'list-checks': P.ListChecksIcon, 'play-circle': P.PlayCircleIcon, 'tree-structure': P.TreeStructureIcon, 'sun-horizon': P.SunHorizonIcon, 'user-circle': P.UserCircleIcon,
	'caret-left': P.CaretLeftIcon, 'caret-right': P.CaretRightIcon, 'caret-down': P.CaretDownIcon, 'caret-up': P.CaretUpIcon, check: P.CheckIcon, 'check-circle': P.CheckCircleIcon,
	circle: P.CircleIcon, plus: P.PlusIcon, trash: P.TrashIcon, warning: P.WarningIcon, 'warning-circle': P.WarningCircleIcon, x: P.XIcon, 'dots-three': P.DotsThreeIcon,
	play: P.PlayIcon, pause: P.PauseIcon, 'arrow-counter-clockwise': P.ArrowCounterClockwiseIcon, alarm: P.AlarmIcon, bell: P.BellIcon, 'bell-slash': P.BellSlashIcon,
	cloud: P.CloudIcon, 'cloud-check': P.CloudCheckIcon, 'cloud-slash': P.CloudSlashIcon, 'arrows-clockwise': P.ArrowsClockwiseIcon, 'device-mobile': P.DeviceMobileIcon,
	users: P.UsersIcon, 'download-simple': P.DownloadSimpleIcon, 'sign-out': P.SignOutIcon, clock: P.ClockIcon, 'file-arrow-down': P.FileArrowDownIcon,
	'file-arrow-up': P.FileArrowUpIcon, 'file-pdf': P.FilePdfIcon, 'squares-four': P.SquaresFourIcon, 'calendar-blank': P.CalendarBlankIcon, notebook: P.NotebookIcon,
	'chart-bar': P.ChartBarIcon, 'share-network': P.ShareNetworkIcon, printer: P.PrinterIcon
};
export function Icon({ name, size = 20, color }: { name: string; size?: number; color?: string }) {
	const t = useTheme();
	const C = ICONS[name] ?? P.CircleIcon;
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

export const Field = forwardRef<React.ComponentRef<typeof TextInput>, TextInputProps & { label: string }>(function Field({ label, style, ...rest }, ref) {
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
			{done && <P.CheckIcon size={size * 0.6} color="#fff" weight="bold" />}
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
