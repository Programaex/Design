import type { ReactNode } from 'react';
import { KeyboardAvoidingView, Modal, Platform, Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { radius, useTheme } from '@/lib/theme';
import { Button, Icon } from './ui';

/** Bottom sheet from the prototype: grabber, title, close, description, content and one primary action. */
export function Sheet({ open, title, desc, cta, onConfirm, onClose, children }: { open: boolean; title: string; desc?: string; cta: string; onConfirm: () => void; onClose: () => void; children?: ReactNode }) {
	const t = useTheme();
	const insets = useSafeAreaInsets();
	return (
		<Modal visible={open} transparent animationType="slide" onRequestClose={onClose}>
			<KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: t.scrim }}>
				<Pressable style={{ flex: 1 }} onPress={onClose} accessibilityLabel="Fechar" />
				<View accessibilityViewIsModal style={{ backgroundColor: t.bg, borderTopLeftRadius: radius.xl, borderTopRightRadius: radius.xl, paddingHorizontal: 20, paddingTop: 10, paddingBottom: insets.bottom + 24, gap: 14 }}>
					<View style={{ alignSelf: 'center', width: 36, height: 5, borderRadius: 3, backgroundColor: t.divider }} />
					<View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
						<Text accessibilityRole="header" style={{ fontSize: 21, fontWeight: '600', color: t.text }}>{title}</Text>
						<Pressable accessibilityRole="button" accessibilityLabel="Fechar" onPress={onClose} style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: t.surface, alignItems: 'center', justifyContent: 'center' }}><Icon name="x" size={16} color={t.muted} /></Pressable>
					</View>
					{desc ? <Text style={{ fontSize: 15, lineHeight: 22, color: t.muted }}>{desc}</Text> : null}
					{children}
					<Button block onPress={onConfirm}>{cta}</Button>
				</View>
			</KeyboardAvoidingView>
		</Modal>
	);
}
