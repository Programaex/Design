import { router } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button, Field } from '@/components/ui';
import { api, ApiError } from '@/lib/api';
import { useStore } from '@/lib/store';
import { type, useTheme } from '@/lib/theme';

export default function Login() {
	const t = useTheme();
	const insets = useSafeAreaInsets();
	const { a } = useStore();
	const [email, setEmail] = useState('');
	const [sent, setSent] = useState(false);
	// the entry route decides: questionnaire when there is no plan yet, tabs otherwise
	const enter = () => router.replace('/');
	const submit = async () => {
		const em = email.trim();
		if (!/\S+@\S+\.\S+/.test(em)) return a.say('Digite um e-mail válido');
		try {
			const r = await api.requestLogin(em);
			// development servers hand the link back; production e-mails it and the app opens through executar://entrar
			const token = r.devLink && new URL(r.devLink).searchParams.get('token');
			if (token) { await api.verify(token); a.up({ started: true }); await a.refreshAccount(); a.say('Conectado'); enter(); return; }
			setSent(true);
		} catch (e) { a.say(e instanceof ApiError ? e.message : 'Sem conexão. Tente de novo.'); }
	};
	return (
		<KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1, backgroundColor: t.bg, paddingTop: insets.top + 24, paddingBottom: insets.bottom + 40, paddingHorizontal: 28 }}>
			<View style={{ flex: 1, justifyContent: 'center', gap: 14 }}>
				<Text style={[type.kicker, { color: t.muted, textAlign: 'center' }]}>EXECUTAR · Prisma</Text>
				<Text accessibilityRole="header" style={{ fontSize: 40, lineHeight: 42, fontWeight: '600', letterSpacing: -0.6, color: t.text, textAlign: 'center' }}>Planeje menos.{'\n'}Execute mais.</Text>
				<Text style={[type.body, { color: t.muted, textAlign: 'center' }]}>Responda oito perguntas e receba seu plano em três horizontes.</Text>
			</View>
			<View style={{ gap: 12 }}>
				{sent ? <Text style={[type.callout, { color: t.text, textAlign: 'center' }]}>Enviamos um link de acesso para {email}. Abra-o neste aparelho.</Text> : null}
				<Field label="E-mail" value={email} onChangeText={setEmail} placeholder="voce@exemplo.com" keyboardType="email-address" autoCapitalize="none" autoComplete="email" textContentType="emailAddress" onSubmitEditing={submit} returnKeyType="go" />
				<Button block onPress={submit}>Continuar com e-mail</Button>
				<View style={{ flexDirection: 'row', gap: 8 }}>
					<Button variant="secondary" block style={{ flex: 1 }} onPress={() => a.say('Entrar com Apple ainda não está configurado.')}>Apple</Button>
					<Button variant="secondary" block style={{ flex: 1 }} onPress={() => a.say('Entrar com Google ainda não está configurado.')}>Google</Button>
				</View>
				<View style={{ alignItems: 'center' }}><Button variant="ghost" onPress={() => { a.up({ started: true, user: null }); enter(); }}>Usar sem conta</Button></View>
				<Text style={[type.micro, { color: t.muted, textAlign: 'center' }]}>Sem conta, o plano fica só neste aparelho.</Text>
			</View>
		</KeyboardAvoidingView>
	);
}
