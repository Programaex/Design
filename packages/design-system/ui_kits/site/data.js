window.RC_DATA = {
  regions: [
    { id: 'frontal', name: 'Lobo frontal', color: 'var(--brain-blue)', x: 30, y: 32, fn: 'Planejamento, inibição, memória de trabalho', body: 'Sede do córtex pré-frontal, o maestro das funções executivas. Organiza metas, segura impulsos e mantém informações ativas enquanto você decide.', risks: ['Impulsividade', 'Sobrecarga de decisões'] },
    { id: 'parietal', name: 'Lobo parietal', color: 'var(--brain-pink)', x: 74, y: 40, fn: 'Atenção espacial, integração sensorial', body: 'Integra o que você vê, toca e sente em um mapa coerente do espaço. Direciona a atenção para o que importa no ambiente.', risks: ['Desatenção seletiva'] },
    { id: 'temporal', name: 'Lobo temporal', color: 'var(--brain-yellow)', x: 48, y: 64, fn: 'Memória, linguagem, emoção', body: 'Abriga o hipocampo e a amígdala. Consolida memórias e atribui peso emocional às experiências — o que influencia cada escolha.', risks: ['Viés emocional', 'Falhas de memória'] }
  ],
  functions: [
    { id: 'inib', kicker: 'Função executiva', title: 'Controle inibitório', body: 'Frear uma resposta automática para escolher a mais adequada.', time: '6 min' },
    { id: 'mem', kicker: 'Função executiva', title: 'Memória de trabalho', body: 'Manter e manipular informações por alguns segundos.', time: '7 min' },
    { id: 'flex', kicker: 'Função executiva', title: 'Flexibilidade cognitiva', body: 'Trocar de estratégia quando o contexto muda.', time: '8 min' }
  ],
  questions: [
    { q: 'Começo tarefas sem planejar as etapas.', opts: ['Raramente', 'Às vezes', 'Com frequência'] },
    { q: 'Perco o fio de uma conversa quando há distrações.', opts: ['Raramente', 'Às vezes', 'Com frequência'] },
    { q: 'Tenho dificuldade em mudar de abordagem quando algo não funciona.', opts: ['Raramente', 'Às vezes', 'Com frequência'] },
    { q: 'Tomo decisões importantes sob pressão de tempo.', opts: ['Raramente', 'Às vezes', 'Com frequência'] }
  ]
};
