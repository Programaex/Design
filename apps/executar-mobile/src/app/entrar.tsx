// Deep link from the magic-link e-mail: executar://entrar?token=…
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { api, ApiError } from '@/lib/api';
import { useStore } from '@/lib/store';

export default function Entrar() {
	const { token } = useLocalSearchParams<{ token?: string }>();
	const { s, a } = useStore();
	useEffect(() => {
		if (!s.ready) return;
		(async () => {
			try {
				if (!token) throw new ApiError(400, 'Link inválido.');
				await api.verify(String(token));
				a.up({ started: true });
				await a.refreshAccount();
				a.say('Conectado');
			} catch (e) { a.say(e instanceof ApiError ? e.message : 'Não foi possível entrar.'); }
			router.replace('/');
		})();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [s.ready, token]);
	return <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}><ActivityIndicator /></View>;
}
