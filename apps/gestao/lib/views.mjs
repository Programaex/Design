// Configuração das duas views: épico, marcos, agrupamento das barras e KPIs específicos.

// Trilhas do épico de emprego, pelo alias TSK do plano (a frente é a mesma para todas: "Carreira na Europa").
const TRILHAS_EMPREGO = {
	'Planejamento e viagem': ['TSK-0050', 'TSK-0077', 'TSK-0078'],
	'Certificações e estudos': ['TSK-0051', 'TSK-0052', 'TSK-0061', 'TSK-0064', 'TSK-0071', 'TSK-0066', 'TSK-0075', 'TSK-0076'],
	'Portfólio, currículo e landing': ['TSK-0067', 'TSK-0068', 'TSK-0069', 'TSK-0072'],
	'LinkedIn, editorial e rede': ['TSK-0062', 'TSK-0065', 'TSK-0070', 'TSK-0074', 'TSK-0063'],
	Candidaturas: ['TSK-0073'],
};
const trilhaDe = alias => Object.entries(TRILHAS_EMPREGO).find(([, a]) => a.includes(alias))?.[0] || 'Outras';

export const VIEWS = {
	epic01: {
		id: 'epic01',
		epic: 3,
		label: 'EPIC 01 · riscocognitivo.org',
		short: 'EPIC 01',
		icon: 'ph-rocket-launch',
		objective: 'Lançar o riscocognitivo.org em 05/11 com o pacote do EPIC 01 e sustentar 30 dias de publicações multiplataforma até 05/12.',
		milestones: [
			{ date: '2026-11-01', label: 'Produção e agendamentos' },
			{ date: '2026-11-05', label: 'Lançamento público' },
			{ date: '2026-12-05', label: 'Fim do ciclo de 30 dias' },
		],
		groupOf: i => (i.type === 'gate' ? 'Pontos de decisão' : i.frente || 'Sem frente'),
		groupOrder: ['Planejamento e controle', 'Site riscocognitivo.org', 'Conteúdo do blog', 'Apps e ferramentas', 'E-books', 'Vídeos', 'Loja e afiliados', 'Distribuição multiplataforma'],
		withSoloCampaign: true,
	},
	emprego: {
		id: 'emprego',
		epic: 5,
		label: 'Emprego e realocação · Europa',
		short: 'Emprego',
		icon: 'ph-briefcase',
		objective: 'Certificar-se em projetos, processos e governança de IA, montar portfólio e presença, candidatar-se a vagas na Europa (01/02–30/03) e viajar em 30/04.',
		milestones: [
			{ date: '2026-11-19', label: 'Início do épico' },
			{ date: '2027-02-01', label: 'Início das candidaturas' },
			{ date: '2027-03-30', label: 'Fim do épico' },
			{ date: '2027-04-30', label: 'Viagem' },
		],
		groupOf: i => (i.type === 'gate' ? 'Pontos de decisão' : trilhaDe(i.alias)),
		groupOrder: Object.keys(TRILHAS_EMPREGO),
		exams: ['TSK-0066', 'TSK-0075', 'TSK-0076'],
		withSoloCampaign: false,
	},
};

export const viewByEpic = n => Object.values(VIEWS).find(v => v.epic === Number(n));
