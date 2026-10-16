import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, Text, View } from 'react-native';
import { Screen } from '@/components/Screen';
import { Sheet } from '@/components/Sheet';
import { Button, Field, Group, Icon, Row, Tag } from '@/components/ui';
import { syncInfo, useStore } from '@/lib/store';
import { radius, type, useTheme } from '@/lib/theme';

const ROLE = { owner: 'Dono', editor: 'Editor', viewer: 'Leitura', invited: 'Convite enviado' } as const;

export default function Conta() {
	const t = useTheme();
	const { s, a } = useStore();
	const [share, setShare] = useState(false);
	const [email, setEmail] = useState('');
	const sy = syncInfo(s);
	const redo = () => Alert.alert('Refazer questionário?', 'Suas respostas ficam preenchidas. O progresso das tarefas recomeça ao gerar de novo.', [
		{ text: 'Cancelar', style: 'cancel' },
		{ text: 'Refazer', style: 'destructive', onPress: () => { a.up({ plan: null, base: null, step: 0 }); router.replace('/wizard'); } }
	]);
	const rows: [string, string, string, () => void][] = [
		['cloud', 'Sincronização', sy.label, () => router.push('/sync')],
		['users', 'Compartilhar plano', s.members.length > 1 ? s.members.length + ' pessoas' : '', () => setShare(true)],
		['download-simple', 'Exportar e importar', '', () => router.push('/dados')],
		['gear-six', 'Ajustes', '', () => router.push('/ajustes')],
		['arrow-counter-clockwise', 'Refazer questionário', '', redo],
		['sign-out', s.user ? 'Sair' : 'Entrar', '', () => { if (s.user) void a.logout(); else router.push('/login'); }]
	];
	return (
		<Screen title="Conta">
			<View style={{ flexDirection: 'row', alignItems: 'center', gap: 14, padding: 16, borderRadius: radius.lg, backgroundColor: t.surface }}>
				<View style={{ width: 52, height: 52, borderRadius: 26, backgroundColor: t.text, alignItems: 'center', justifyContent: 'center' }}><Text style={{ fontSize: 21, fontWeight: '600', color: t.bg }}>{s.user ? s.user.name[0]?.toUpperCase() : '?'}</Text></View>
				<View style={{ flex: 1 }}><Text style={[type.headline, { color: t.text }]}>{s.user ? s.user.name : 'Sem conta'}</Text><Text numberOfLines={1} style={[type.caption, { color: t.muted }]}>{s.user ? s.user.email : 'Dados só neste aparelho'}</Text></View>
				{!s.user && <Button size="sm" onPress={() => router.push('/login')}>Criar conta</Button>}
			</View>
			<Group style={{ marginTop: 20 }}>
				{rows.map(([icon, label, value, onPress], i) => (
					<Row key={label} first={!i} onPress={onPress}>
						<Icon name={icon} size={20} color={label === 'Sair' ? t.danger : t.text} />
						<Text style={{ flex: 1, fontSize: 17, color: label === 'Sair' ? t.danger : t.text }}>{label}</Text>
						<Text style={[type.caption, { color: t.muted }]}>{value}</Text>
						<Icon name="caret-right" size={14} color={t.muted} />
					</Row>
				))}
			</Group>
			<Text style={[type.micro, { color: t.muted, marginTop: 20, marginHorizontal: 4 }]}>Prisma · EXECUTAR</Text>
			<Sheet open={share} title="Compartilhar plano" desc="Quem você convidar pode marcar e editar tarefas." cta="Enviar convite" onClose={() => setShare(false)} onConfirm={async () => { if (await a.share(email)) setEmail(''); }}>
				<Field label="E-mail" value={email} onChangeText={setEmail} placeholder="nome@exemplo.com" keyboardType="email-address" autoCapitalize="none" autoFocus />
				<Group>
					{s.members.map((m, i) => (
						<Row key={m.email || m.name} first={!i} style={{ minHeight: 48 }}>
							<View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: t.bg, alignItems: 'center', justifyContent: 'center' }}><Text style={{ fontWeight: '600', color: t.text }}>{(m.name || m.email)[0]?.toUpperCase()}</Text></View>
							<Text style={{ flex: 1, fontSize: 15, color: t.text }}>{m.name || m.email}</Text>
							<Tag toneKey={m.role === 'owner' ? 'accent' : 'neutral'}>{ROLE[m.role]}</Tag>
						</Row>
					))}
				</Group>
			</Sheet>
		</Screen>
	);
}
