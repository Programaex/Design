import csv, io, os, sys, html, datetime as dt
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from tarefas import T, CLUSTERS, POR_QUE
from cap import FERIADOS, p, f, horas_dia, dias, util, cap, carga, JANELAS

OUT = sys.argv[1]
os.makedirs(OUT, exist_ok=True)
SLUG = "executar-epic01"
PER = "2026-10-a-2027-04"
EMISSAO = "17/10/2026"
INI, FIM = p("17/10/2026"), p("30/04/2027")
TID = {t["id"]: t for t in T}

def h(x):
    return (f"{x:.1f}".replace(".", ",")) + "h"

def janela_de(t):
    d = p(t["ini"])
    for j, n, a, b in JANELAS:
        if p(a) <= d <= p(b):
            return j, n, a, b

# ---------------------------------------------------------------- prompts
def prompt(t):
    clu = CLUSTERS[t["clu"]]
    j, n, a, b = janela_de(t)
    c = cap(p(a), p(b))
    restr = ["Não inventar dados: o que não existir fica TBD.",
             "Conteúdo educativo: sem diagnóstico, sem promessa de cura, sem tom de coach.",
             "Português do Brasil."]
    if t["restr"]:
        restr.insert(0, t["restr"])
    if t["dep"]:
        d = TID[t["dep"]]
        restr.insert(0, f"Bloqueio: só começar depois de concluída a tarefa {d['id']} ({d['titulo']}).")
    linhas = [
        f'<tarefa id="{t["id"]}">',
        f'  <contexto>Programa EXECUTAR — lançamento do ecossistema riscocognitivo.org (gestão de riscos cognitivos para pessoas neurodivergentes) e realocação profissional do titular na Europa. Frente: {clu}. {POR_QUE[t["clu"]]}</contexto>',
        f'  <objetivo>{t["resultado"]}</objetivo>',
        f'  <entrada>{t["entrada"]}</entrada>',
        f'  <restricoes>{" ".join(restr)} Escopo: {t["esp"]}</restricoes>',
        "  <passos>\n" + "\n".join("    " + x + "." for x in t["passos"]) + "\n  </passos>",
        f'  <criterio_de_conclusao>{t["concl"]}</criterio_de_conclusao>',
        f'  <formato_de_saida>{t["evid"]} Prazo: {t["prazo"]}. Tempo previsto: {h(t["h"])}.</formato_de_saida>',
        f'  <evidencia_esperada>{t["evid"]}</evidencia_esperada>',
    ]
    import re
    lac = [re.sub(r"\s*\(GAP-[0-9.]+\)", "", l) for l in t["lacunas"]]
    if t["prazo"] == "TBD":
        lac.append("Prazo exato TBD")
    if lac:
        linhas.append("  <lacunas_conhecidas>" + "; ".join(lac) + ". Não preencher com valor inventado.</lacunas_conhecidas>")
    linhas.append("</tarefa>")
    return "\n".join(linhas)

def smart_temporal(t):
    if t["prazo"] == "TBD":
        return f"TBD — janela recomendada {t['janela'][0]} a {t['janela'][1]}; data exata depende do calendário oficial."
    if t["ini"] == t["prazo"]:
        return f"Em {t['prazo']}."
    return f"De {t['ini']} até {t['prazo']}."

def smart_ating(t):
    j, n, a, b = janela_de(t)
    c = cap(p(a), p(b))
    return f"Estimativa de {h(t['h'])} dentro da janela {a} a {b}, cuja capacidade de execução é {h(c['E'])}."

COLS = ["tarefa_id", "cluster_id", "cluster_nome", "titulo", "verbo_acao", "camada_operacional",
        "resultado_esperado", "criterio_smart_especifico", "criterio_smart_mensuravel",
        "criterio_smart_atingivel", "criterio_smart_relevante", "criterio_smart_temporal",
        "prompt_ia_self_contained", "passos", "concluido_quando", "evidencia_conclusao", "tags",
        "tarefas_relacionadas", "dependencia_bloqueante", "responsavel", "prioridade", "prazo",
        "tempo_estimado", "status", "fonte_id"]

def linha(t):
    return [t["id"], t["clu"], CLUSTERS[t["clu"]], t["titulo"], t["verbo"], t["agora"], t["resultado"],
            t["esp"], t["mens"], smart_ating(t), t["rel"], smart_temporal(t), prompt(t),
            "|".join(t["passos"]), t["concl"], t["evid"], t["tags"], t["relac"], t["dep"], t["resp"],
            t["prio"], t["prazo"], h(t["h"]).replace("h", " horas"),
            "Não iniciada",
            t["fonte"]]

def csv_text(cols_n):
    buf = io.StringIO()
    w = csv.writer(buf, quoting=csv.QUOTE_MINIMAL, lineterminator="\n")
    w.writerow(COLS[:cols_n])
    for t in T:
        w.writerow(linha(t)[:cols_n])
    return buf.getvalue()

def md_cell(s):
    return html.escape(str(s), quote=False).replace("|", "\\|").replace("\n", "<br>")

def md_cell_prompt(s):
    return html.escape(s).replace("|", "\\|").replace("\n", "<br>")

# validações estruturais das tarefas
for t in T:
    assert t["titulo"] != t["agora"], t["id"]
    assert len(t["passos"]) <= 3, t["id"]
    assert 2 <= len(t["tags"].split("|")) <= 5, (t["id"], t["tags"])
    assert t["dep"] != t["id"]
    if t["dep"]:
        assert t["dep"] in TID, t["id"]
        d = TID[t["dep"]]
        if d["prazo"] != "TBD" and t["prazo"] != "TBD":
            assert p(d["prazo"]) <= p(t["prazo"]), (t["id"], "depende de", d["id"])

open(os.path.join(OUT, f"registro-tarefas-{SLUG}-{PER}.csv"), "w", encoding="utf-8").write(csv_text(25))
open(os.path.join(OUT, f"linear-import-{SLUG}-{PER}.csv"), "w", encoding="utf-8").write(csv_text(22))

# ---------------------------------------------------------------- semanas
def semanas():
    out = []
    a = INI
    # S01 = 17/10 a 25/10 (arranque no fim de semana + 1ª semana civil); depois seg–dom
    b = p("25/10/2026")
    n = 1
    while a <= FIM:
        out.append((f"S{n:02d}", a, min(b, FIM)))
        a = b + dt.timedelta(1)
        b = a + dt.timedelta(6)
        n += 1
    return out

SEM = semanas()
OBJ_SEM = {
    "S01": ("Fundar o lançamento: escopo, rotas, pesquisa, artigo fundador e base do site", "GATE-00, GATE-01"),
    "S02": ("Construir o site completo, produzir o núcleo do pacote e agendar o ciclo 1 até 01/11", "GATE-02"),
    "S03": ("Testar e lançar o riscocognitivo.org em 05/11; iniciar liberações da onda 2", "GATE-03"),
    "S04": ("Operar o ciclo 1, liberar peças da onda 2, agendar o ciclo 2 e consolidar os dados", "GATE-04"),
    "S05": ("Planejar a campanha 02 com os dados, abrir o épico de emprego (19/11) e liberar pilares", "GATE-05"),
    "S06": ("Produzir a campanha 02 e concluir e-books, apps e recursos do pacote", "—"),
    "S07": ("Fechar o pacote da campanha 02 (30/11), o ciclo de 30 dias (05/12) e definir o escopo do app", "GATE-06, GATE-07"),
    "S08": ("Desenvolver o Executar App; iniciar épicos posteriores escolhidos; otimizar o LinkedIn", "—"),
    "S09": ("Desenvolver o app, preparar épicos posteriores e agendar a campanha 02", "GATE-08"),
    "S10": ("Concluir o desenvolvimento do app e dos épicos posteriores (semana de Natal)", "—"),
    "S11": ("Testar e publicar a versão do app; reserva para imprevistos", "—"),
    "S12": ("Lançar o app e o ecossistema em 05/01; iniciar portfólio, currículo e landing profissional", "GATE-09"),
}
def obj_semana(s, a, b):
    if s in OBJ_SEM:
        return OBJ_SEM[s]
    if b < p("01/02/2027"):
        return ("Concluir portfólio, currículo e landing; estudar e fazer a prova de projetos", "GATE-10" if a <= p("31/01/2027") <= b else "—")
    if b <= p("04/04/2027") and a <= p("30/03/2027"):
        g = "GATE-11" if a <= p("30/03/2027") <= b else "—"
        return ("Enviar candidaturas semanais; estudar e fazer as provas de processos e governança de IA; publicar no LinkedIn", g)
    return ("Preparar a documentação e a logística da viagem de 30/04", "—")

def tarefas_ativas(a, b):
    r = []
    for t in T:
        ti = p(t["ini"]); tf = p(t["janela"][1]) if t["prazo"] == "TBD" else p(t["prazo"])
        if ti <= b and tf >= a:
            r.append(t)
    return r

def tarefas_prazo(a, b):
    r = []
    for t in T:
        tf = p(t["janela"][1]) if t["prazo"] == "TBD" else p(t["prazo"])
        if a <= tf <= b:
            r.append(t)
    return r

# ---------------------------------------------------------------- documento interno
L = []
w = L.append
c_tot = cap(INI, FIM)
c1 = cap(p("17/10/2026"), p("04/11/2026"))
carga_tot = carga(T, INI, FIM)
# opção A: tudo do EPIC 01 listado até 04/11
EPIC01_ONDA2 = [t for t in T if t["clu"] in ("CLU-02", "CLU-03", "CLU-04", "CLU-05", "CLU-06", "CLU-07", "CLU-08")
                and p(t["ini"]) > p("04/11/2026") and t["id"] not in ("TSK-0028", "TSK-0037", "TSK-0038", "TSK-0040", "TSK-0053")]
carga_A = round(carga(T, p("17/10/2026"), p("04/11/2026")) + sum(t["h"] for t in EPIC01_ONDA2), 1)
carga_B = carga(T, p("17/10/2026"), p("04/11/2026"))

w(f"# Plano Operacional Rastreável — Programa EXECUTAR — EPIC 01 riscocognitivo.org, Campanha 02 e EPIC Emprego — 17/10/2026 a 30/04/2027")
w("")
w("```")
w("Titular: titular do Programa EXECUTAR (nome completo não informado nas fontes — GAP-01)")
w("Período coberto: 17/10/2026 a 30/04/2027 (detalhamento diário até 05/01/2027; semanal até 30/04/2027)")
w(f"Data de emissão: {EMISSAO}")
w("Fuso horário: America/Sao_Paulo (BRT/GMT-3) — suposição ASM-07")
w("Versão: 1.0 — emissão inicial")
w("Metodologia de produção: motor de evidência com hierarquia de fontes e classificação rastreável")
w("Natureza deste documento: planejamento operacional executável. Não é auditoria, certificação,")
w("opinião legal, aprovação regulatória, nem declaração formal de conformidade normativa.")
w("```")
w("")
w("## 1. Resumo Executivo")
w("")
w("| Item | Conteúdo |")
w("|---|---|")
w("| Objetivo operacional central | Lançar o riscocognitivo.org em 05/11/2026 com o pacote do EPIC 01, sustentar um ciclo de 30 dias de publicações multiplataforma até 05/12/2026, produzir a Campanha 02 (15/11–30/11) a partir dos dados da Campanha 01 e lançar o Executar App e o ecossistema em 05/01/2027; em paralelo, executar o EPIC Emprego e realocação (19/11/2026–30/03/2027) até a viagem de 30/04/2027 (DEC-03). |")
w("| Resultado mais importante | KR-01: riscocognitivo.org público em 05/11/2026 com as rotas do lançamento respondendo (fonte: DEC-03, FACT-01). |")
w(f"| Capacidade realista total | {h(c_tot['E'])} de execução planejada + {h(c_tot['C'])} de reserva, sobre {h(c_tot['nom'])} nominais no período (ver §7; base em suposições ASM-01 a ASM-03 até confirmação no GATE-00). |")
w("| Frentes ativas e WIP | 10 frentes de trabalho no período; no máximo 4 frentes simultâneas por semana e 1 tarefa em execução por vez (WIP = 1, FACT-06 — decisão de desenho operacional própria, não requisito ISO). |")
w(f"| Restrição principal | Capacidade da janela 17/10–04/11: {h(c1['E'])} de execução para um pacote cuja produção integral foi estimada em {h(carga_A)} (RSK-01). |")
w("| Risco principal | RSK-01 — sobrecarga da janela de lançamento; sem a decisão do GATE-00 o lançamento de 05/11 fica comprometido. |")
w("| Próxima ação imediata | TSK-0001 — confirmar capacidade real e escopo de 05/11 (§17). |")
w("")
w("## 2. Inventário de Fontes e Evidências")
w("")
w("| ID | Fonte | Tipo | Data/versão | Papel na análise | Confiabilidade/limitação |")
w("|---|---|---|---|---|---|")
w("| SRC-01 | Mensagem do titular nesta conversa (datas, escopo do EPIC 01, Campanha 02, EPIC Emprego, ordem de lançamento) | Instrução explícita (nível 1) | 17/10/2026 | Fonte primária de escopo, datas e decisões | Alta autoridade; texto digitado rapidamente, com ambiguidades registradas como CONF/GAP |")
w("| SRC-02 | EXECUTAR_rotas.csv (78 rotas, 14 colunas) | Registro operacional do projeto (nível 3) | Anexo de 17/10/2026 | Arquitetura de rotas, filtros e instruções de agente do site | Alta; descreve o site-alvo, não prova implementação |")
w("| SRC-03 | AIKB-0001 — Process Doc Creator-Led Growth multiplataforma (PD-CLB-20260906-F01-DOC-V01) | Documento de processo do projeto (nível 3/5) | 06/09/2026, rascunho de pré-produção V01 | Padrão de ciclo (15 dias), peça-mãe → derivados, matriz de canais, tarefas 01–22, nomenclatura | Média; o próprio documento se declara rascunho sujeito a revisão |")
w("| SRC-04 | Pacote da skill plano-operacional-rastreavel (zip anexado) | Metodologia da empresa | Conferido em 17/10/2026 | Método deste documento | Idêntico, arquivo a arquivo, à cópia em Design/.claude/skills/ (verificado por diff) |")
w("| SRC-05 | Repositório Design (apps/site, apps/workflow, apps/scroll-task, content/articles, agentes e skills) | Registro operacional (nível 5) | Branch de trabalho em 17/10/2026 | Ativos já existentes (CMS, Manifesto, 3 artigos, protótipo Scroll Task, workflow) | Existência observada; não prova prontidão para uso público (GAP-17) |")
w("| SRC-06 | Repositório workbook — CLAUDE.md, OWNERS.csv, MACROAREAS.csv | Regras do projeto (nível 3) | Branch de trabalho em 17/10/2026 | Regra de tripla clonagem de épicos e owners | Alta |")
w("| SRC-07 | Conjunto normativo fixo da metodologia (ISO 9001:2015/Amd 1:2024, ISO 10005, ISO 10006, ISO 21502, ISO 31000, ISO 10075-2) | Normativo (nível 4) | Texto fixo da skill | Limite normativo (§4–§5) | Metadados não confirmados em iso.org nesta sessão (CONF-08) |")
w("| SRC-08 | LRQA — \"ISO 9001 revision update: publication date confirmed\" (lrqa.com/en-us/latest-news/iso-9001-revision-update-publication-date-confirmed/) | EXTERNAL CURRENT SOURCE, secundária | Acesso em 17/10/2026 | Indica publicação prevista da nova ISO 9001 em 16/09/2026 | Secundária; iso.org não foi acessado; não confirma publicação efetiva |")
w("")
w("**Fontes NÃO consultadas (por escolha justificada):** pesquisa de mercado nova sobre canais e tendências (o SRC-03 já traz o Anexo A de 06/09/2026; nova pesquisa é a TSK-0006, executada pelo agente de pesquisa — DEC-12); páginas oficiais de preço e calendário das certificações (dependem da escolha do titular — TSK-0051, GAP-10); conectores de calendário, Linear e ferramentas de agendamento (não autenticados nesta sessão).")
w("")
w("## 3. Fatos, Decisões, Suposições, Lacunas e Conflitos")
w("")
w("### 3.1 Fatos observáveis (FACT)")
w("")
w("| ID | Fato | Fonte | Citação literal/localização |")
w("|---|---|---|---|")
facts = [
 ("FACT-01", "O pacote do EPIC 01 inclui: home premium com Manifesto; blog com Peça 01 (artigo fundador) e pilares; mapa simplificado; apps (Prisma standalone, Meu processo de trabalho, Plano Operacional Rastreável, workflow visual/mapa builder/task operator); família de templates por déficit executivo + ferramenta de metacognição; plugins e agentes; photo prompt de rotina, Obsidian dislexia e infográficos de IDs; 4 e-books; 3 vídeos de 5 min; produtos e afiliados na loja; CMS para desmembrar o pacote.", "SRC-01", "\"Ordem de lançamento : EPIC 01 — 1. Risco cogntivo.org | Landign page | Blog | Mapa | Apps | Ferramentas | Cms\""),
 ("FACT-02", "O arquivo de rotas define 78 rotas; /apps/executar exige \"configurar URL real do aplicativo antes de ativar acesso\"; /loja/[slug] exige \"não inventar integração de pagamento\"; /riscos-cognitivos: \"Não apresentar classificação como diagnóstico\"; comentários exigem conta e moderação.", "SRC-02", "Linhas inicio…admin_parceiros; colunas instrucao_agente"),
 ("FACT-03", "O padrão editorial usa ciclo de 15 dias ancorado em uma peça-mãe, com derivados por plataforma (carrosséis, imagens, verticais, stories, newsletters, e-books) e as Fases 1–5 (produção → imagens/vídeos → revisão → agendamento → análise).", "SRC-03", "Tópico 5, Tabela 5.1; Tópico 8, Tabela 8.1"),
 ("FACT-04", "De 17/10/2026 a 05/01/2027 há 80 dias (11 semanas e 3 dias); o titular declarou \"11 semanas até 05/01\".", "SRC-01 + calendário", "\"Temos 11 semas ate 05/01\""),
 ("FACT-05", "Já existem no repositório Design: CMS em Worker Cloudflare (apps/site), rascunho do Manifesto e 3 artigos (content/articles), protótipo Scroll Task do Executar App, app de workflow e analytics da Cloudflare no CMS.", "SRC-05", "apps/site/README.md; apps/site/content/articles/; apps/scroll-task/README.md"),
 ("FACT-06", "O CMS aplica WIP = 1 global (uma tarefa por vez) e os agentes do fluxo trabalham com WIP = 1.", "SRC-05", "apps/site/README.md — view Foco; .claude/agents/plano-ops-agent.md"),
 ("FACT-07", "Épico, projeto ou issue citado exige tripla clonagem: GitHub, pasta de tarefas do owner, registro de tarefas do workbook.", "SRC-06", "CLAUDE.md — \"Regra de operações (tarefas)\""),
 ("FACT-08", "O EPIC Emprego vai de 19/11/2026 a 30/03/2027; candidaturas de 01/02/2027 a 30/03/2027; viagem em 30/04/2027.", "SRC-01", "\"esse epic incia em 19/11 e encerra em 30/03\"; \"as apliccoes … iniciam se em 01/02 e vao ate 30/03\"; \"a vigem sera em 30/04\""),
]
for r in facts:
    w("| " + " | ".join(r) + " |")
w("")
w("### 3.2 Decisões aprovadas (DECISION)")
w("")
w("| ID | Decisão | Fonte | Nota |")
w("|---|---|---|---|")
decs = [
 ("DEC-01", "Reserva de contingência em 15% da capacidade de execução planejada.", "SRC-04 (padrão fixo da metodologia)", "Nenhum pedido de outro percentual."),
 ("DEC-02", "Ordem e conteúdo do EPIC 01 conforme a lista do titular; épicos posteriores: CMS e automação, completude de rotas/news, Executar App e Expo, consultoria/studio/portfólio, cursos, loja e marketplace, comunidade/ONG.", "SRC-01", "A lista termina com \"......\" — itens adicionais são GAP-19."),
 ("DEC-03", "Datas-marco: produção do EPIC 01 17/10–01/11; lançamento 05/11; ciclo de 30 dias até 05/12; produção da Campanha 02 15/11–30/11; lançamento do app, épicos posteriores e Campanha 02 em 05/01; EPIC Emprego 19/11–30/03; candidaturas 01/02–30/03; viagem 30/04.", "SRC-01", "Interpretação de 01/11 × 05/11 em CONF-01."),
 ("DEC-04", "Campanha 02: objetivo estratégico de lançar todo o ecossistema com foco no app e nos produtos à venda, aproveitando a demanda de início de ano (janeiro).", "SRC-01", ""),
 ("DEC-05", "A Campanha 02 é planejada a partir da coleta de dados da Campanha 01.", "SRC-01", "Relatório parcial em 14/11 (TSK-0039) e final em 05/12 (TSK-0053)."),
 ("DEC-06", "Acompanhamento da produção por objetivos macro semanais divididos por dias.", "SRC-01", "Implementado em §9 e §11."),
 ("DEC-07", "EPIC Emprego inclui: 0) planejamento estratégico; 1) capacitação em gestão de projetos, processos e governança de IA; 2) provas e certificados pagos de referência (padrão-ouro) para o mercado europeu; 3) portfólio; 3) redes sociais e landing page; 4) currículo e candidaturas; 5) LinkedIn e linha editorial. Plano de estudos com autoestudo, cursos, simulados e provas.", "SRC-01", "Numeração \"3\" repetida na fonte, preservada."),
 ("DEC-08", "Portfólio com as soluções e produtos do titular + apps para a empresa real Clean Sea e outra a definir.", "SRC-01", "Segunda empresa = \"tbd\" na fonte (GAP-11)."),
 ("DEC-09", "Toda tarefa carrega prompt self-contained completo, no registro interno e no entregável de importação.", "SRC-04", "Decisão fixa da metodologia."),
 ("DEC-10", "Linha editorial estratégica para a Frankwatching sobre riscos cognitivos, LinkedIn editorial e contato estratégico com profissional na Holanda para soluções personalizadas.", "SRC-01", "\"frankswaching\" interpretado como Frankwatching (ASM-08)."),
 ("DEC-11", "O arquivo de rotas é a fonte da arquitetura do site.", "SRC-02", ""),
 ("DEC-12", "Pesquisa, distribuição, agendamento e analytics podem ser executados pelos agentes do fluxo EXECUTAR (research, clp, analytics), com revisão do titular; marcação por tags no-<nó>.", "SRC-05", "Agentes existentes; execução depende de token do fluxo (DEP-04)."),
]
for r in decs:
    w("| " + " | ".join(r) + " |")
w("")
w("### 3.3 Suposições (ASSUMPTION)")
w("")
w("| ID | Suposição | Por que foi necessária | Risco se errada |")
w("|---|---|---|---|")
asms = [
 ("ASM-01", "Jornada nominal de 8h por dia útil (segunda a sexta) e 4h aos sábados; domingo sem trabalho.", "Nenhuma fonte informa horas (GAP-02); a metodologia exige modelo de capacidade.", "Todas as janelas e a viabilidade do lançamento mudam."),
 ("ASM-02", "Feriados nacionais (02/11, 20/11, 25/12, 01/01, 26/03, 21/04) indisponíveis.", "Titular aparenta estar no Brasil (fuso BRT).", "Pequena variação de capacidade."),
 ("ASM-03", "Overhead operacional (mensagens, administração, contas) de 10% das horas disponíveis.", "Sem dado de agenda fixa.", "Capacidade de execução superestimada se o overhead for maior."),
 ("ASM-04", "As horas estimadas das tarefas consideram rascunho assistido por agentes de IA e revisão humana do titular.", "Sem histórico de produtividade.", "Carga real maior; acionar RSK-01."),
 ("ASM-05", "De 19/11 a 05/01 o EPIC Emprego usa até 30% da execução; de 06/01 a 30/03, até 50%.", "Distribuição entre frentes não informada.", "Atraso de estudos ou do ecossistema."),
 ("ASM-06", "Os pilares do blog são 4 artigos (gestão de riscos/projetos/processos; funções executivas; dark partners; riscos no estudo, trabalho, rotina e ambientes), além do artigo fundador.", "A lista da fonte mistura tema do fundador e pilares.", "Número de artigos diferente."),
 ("ASM-07", "Fuso America/Sao_Paulo.", "Fuso não informado.", "Horários de agendamento deslocados."),
 ("ASM-08", "\"frankswaching\" = Frankwatching (portal holandês de marketing digital); \"CSM\" nos épicos posteriores = CMS.", "Grafia da fonte.", "Pauta enviada ao veículo errado."),
 ("ASM-09", "As \"3 principais neurodivergências\" dos templates são TDAH, dislexia e autismo (filtros de perfil do SRC-02).", "Fonte não nomeia as três.", "Templates para perfis errados."),
 ("ASM-10", "As 4 janelas de lançamento do EPIC 01 (onda 1 até 04/11, onda 2 até 05/12) são a opção B recomendada, sujeita ao GATE-00.", "Carga da opção A excede a capacidade (RSK-01).", "Se o titular escolher a opção A, o plano semanal precisa ser refeito."),
]
for r in asms:
    w("| " + " | ".join(r) + " |")
w("")
w("### 3.4 Lacunas (GAP)")
w("")
w("| ID | Lacuna | Fonte que deveria cobrir | Impacto | Ação recomendada |")
w("|---|---|---|---|---|")
gaps = [
 ("GAP-01", "Nome completo do titular.", "Intake", "Baixo", "Informar no próximo intake."),
 ("GAP-02", "Capacidade semanal real, melhor janela de energia, dias de descanso.", "Intake", "Alto", "TSK-0001 / GATE-00."),
 ("GAP-03", "Situação do domínio riscocognitivo.org (registro, DNS).", "Titular / Cloudflare", "Alto", "TSK-0004."),
 ("GAP-04", "Checkout, preços e links de afiliado dos 6 produtos.", "Titular", "Alto para receita", "TSK-0017."),
 ("GAP-05", "Linha de base das métricas (tráfego, seguidores, lista de e-mail).", "Analytics / plataformas", "Médio", "Medir antes de fixar metas (TSK-0025)."),
 ("GAP-06", "Metas numéricas da Campanha 01 (inscritos, cliques, vendas).", "Titular", "Médio", "Definir após a linha de base, até GATE-04."),
 ("GAP-07", "Lista final de plataformas, contas ativas e ferramenta de agendamento.", "Titular", "Alto", "TSK-0022/0023."),
 ("GAP-08", "Definição de \"dark partners\" adotada pelo EXECUTAR.", "Titular", "Médio", "TSK-0043."),
 ("GAP-09", "Escopo funcional do Executar App e do Expo para 05/01 e canal de publicação (lojas/Expo).", "Titular", "Alto", "TSK-0054 / GATE-08."),
 ("GAP-10", "Certificações escolhidas, preços, datas de prova e orçamento.", "Sites oficiais dos certificadores", "Alto", "TSK-0051 / GATE-05."),
 ("GAP-11", "Autorização da Clean Sea para uso no portfólio e identidade da segunda empresa.", "Titular / Clean Sea", "Médio", "TSK-0067."),
 ("GAP-12", "Identidade e contato do profissional estratégico na Holanda.", "Titular", "Médio", "TSK-0063."),
 ("GAP-13", "Requisitos editoriais e idioma aceito pela Frankwatching.", "Diretrizes do veículo", "Médio", "TSK-0070."),
 ("GAP-14", "Destino, visto e documentação da viagem de 30/04.", "Titular / órgãos oficiais", "Alto", "TSK-0050 e TSK-0078."),
 ("GAP-15", "Meta de candidaturas por semana.", "Titular", "Médio", "Definir no GATE-10."),
 ("GAP-16", "Responsáveis além do titular (revisores, equipe) e owner de cada épico no workbook.", "Titular / OWNERS.csv", "Médio", "TSK-0002."),
 ("GAP-17", "Status real dos apps (Prisma standalone, Meu processo de trabalho, Plano Operacional Rastreável, workflow).", "Repositórios / titular", "Alto", "TSK-0003."),
 ("GAP-18", "Uso do nome Barkley no título do e-book e nos produtos de afiliado.", "Titular / editoras", "Médio", "TSK-0046."),
 ("GAP-19", "Itens adicionais dos épicos posteriores (lista termina com \"......\").", "Titular", "Baixo", "Registrar no GATE-08."),
 ("GAP-6.2-01", "Objetivos com medição definida (ver §5).", "Intake", "Médio", "Ver §5."),
 ("GAP-9.1-01", "Método de monitoramento e frequência formalizados (ver §5).", "Intake", "Médio", "Ver §5 e §13."),
]
for r in gaps:
    w("| " + " | ".join(r) + " |")
w("")
w("### 3.5 Conflitos (CONFLICT)")
w("")
w("| ID | Fonte A | Fonte B | Fonte priorizada | Regra de precedência usada |")
w("|---|---|---|---|---|")
confs = [
 ("CONF-01", "SRC-01: \"Entre 17/10 e 01/11 é necessário … lançar riscocognitivo.org\"", "SRC-01: \"no dia 05/11 o lançamento inclui todo conteúdo listado\"", "Ambas preservadas: 01/11 = fim da produção e dos agendamentos; 05/11 = lançamento público", "Mesmo nível; leitura que preserva as duas instruções; a mais específica (05/11) define a data pública. Confirmar no GATE-02."),
 ("CONF-02", "SRC-03: 3 e-books por ciclo", "SRC-01: 4 e-books", "SRC-01 (4 e-books)", "Instrução explícita do titular (nível 1) prevalece sobre documento de processo."),
 ("CONF-03", "SRC-03: vídeo-mãe de 8–12 min", "SRC-01: 3 vídeos de 5 min", "SRC-01", "Nível 1 prevalece."),
 ("CONF-04", "SRC-03: ciclo de 15 dias", "SRC-01: ciclo de 30 dias até 05/12", "SRC-01, conciliado como 2 subciclos de 15 dias", "Nível 1 define o horizonte; o padrão de 15 dias organiza os subciclos."),
 ("CONF-05", "SRC-01: \"Produtos a venda e afiliados na loja\" no EPIC 01", "SRC-01: \"Loja e mkt place\" nos épicos posteriores", "Ambas: vitrine mínima no EPIC 01; marketplace completo depois", "Mesmo nível; separação por escopo. Confirmar no GATE-00."),
 ("CONF-06", "SRC-01: \"Cms: desmembrar esse pack\" no EPIC 01", "SRC-01: \"CSM e automação\" nos posteriores", "Ambas: desmembramento e agendamento com o CMS atual; automação depois", "Mesmo nível; separação por escopo."),
 ("CONF-07", "SRC-02: rota /apps/executar com CTA de acesso", "SRC-01: \"Executar app e expo\" posterior (05/01)", "SRC-01 quanto à data; SRC-02 quanto à regra de não inventar destino", "Página publicada como 'em breve' até 05/01."),
 ("CONF-08", "SRC-07: ISO 9001:2015/Amd 1:2024", "SRC-08: nova edição da ISO 9001 com publicação prevista para 16/09/2026", "SRC-07 (mantido)", "SRC-08 é secundária e não confirma publicação; atualizar a skill se iso.org confirmar."),
 ("CONF-09", "SRC-02: comentários com conta e moderação", "SRC-01: comunidade/ONG é posterior", "SRC-01", "Comentários desativados no EPIC 01."),
 ("CONF-10", "SRC-03: \"nenhum ativo pago deve ser lançado sem que o problema … tenha sido validado … em pelo menos um ciclo de conteúdo gratuito\"", "SRC-01: produtos à venda no lançamento de 05/11", "SRC-01", "Nível 1 prevalece; risco registrado (RSK-03) e recomendação de priorizar afiliados e ferramentas gratuitas."),
]
for r in confs:
    w("| " + " | ".join(r) + " |")
w("")
w("## 4. Limite Normativo e Disclaimer")
w("")
w("- Frameworks operacionais próprios (WIP = 1, ondas de lançamento, distribuição percentual de capacidade, uma entrega dominante por dia, ciclo de 15/30 dias) foram excluídos da seção normativa: são decisões de desenho operacional próprio.")
w("- Afirmações normativas são rastreáveis às normas do conjunto fixo (SRC-07). Apenas a ISO 9001 contém requisitos; ISO 10005, 10006, 21502, 31000 e 10075-2 orientam.")
w("- Evidência observável é exigida; ausência de cláusula ou de registro impede conclusão.")
w("- A Estrutura Harmonizada é usada apenas para organizar evidência.")
w("- O status de edição da ISO 9001 está em CONF-08; o texto das normas não foi reproduzido.")
w("- Este documento não é auditoria, certificação, opinião legal, aprovação regulatória nem declaração formal de conformidade.")
w("")
w("## 5. Evidência Organizada pela Estrutura Harmonizada")
w("")
w("| Cabeçalho | Norma aplicável | Cláusula | Requisito | Evidência observável | Status | Lacuna/ação |")
w("|---|---|---|---|---|---|---|")
hs = [
 ("Contexto", "ISO 9001:2015/Amd 1:2024", "4.1 / 4.2", "Determinar questões internas/externas e partes interessadas", "SRC-01 (nicho, demanda de janeiro, mercado europeu); §12", "PARCIALMENTE EVIDENCIADO", "Partes interessadas externas sem identificação (GAP-12, GAP-13)."),
 ("Liderança", "ISO 9001:2015/Amd 1:2024", "5.3", "Atribuir papéis, responsabilidades e autoridades", "Titular como responsável único; owners do workbook reservados", "PARCIALMENTE EVIDENCIADO", "GAP-16."),
 ("Planejamento", "ISO 9001:2015/Amd 1:2024", "6.1", "Ações para abordar riscos e oportunidades", "§14 (orientado por ISO 31000)", "PARCIALMENTE EVIDENCIADO", "Riscos com probabilidade qualitativa; revisar no GATE-04."),
 ("Planejamento", "ISO 9001:2015/Amd 1:2024", "6.2", "Objetivos mensuráveis e planejamento para alcançá-los", "§6 com KR; metas numéricas ausentes", "PARCIALMENTE EVIDENCIADO", "GAP-6.2-01: objetivos sem meta numérica e linha de base (GAP-05, GAP-06); definir até GATE-04."),
 ("Suporte", "ISO 9001:2015/Amd 1:2024", "7.1.6 / 7.5", "Conhecimento organizacional e informação documentada", "SRC-03 (process doc), SRC-05 (repositórios), registro de tarefas §10", "EVIDENCIADO", "Manter versão e nomenclatura (SRC-03 Tópico 9)."),
 ("Operação", "ISO 9001:2015/Amd 1:2024", "8.1", "Planejar e controlar a operação", "§9, §10, §11; gates §16 (orientação ISO 10005/10006/21502)", "PARCIALMENTE EVIDENCIADO", "Capacidade sustentada por suposições (ASM-01); confirmar no GATE-00."),
 ("Operação", "ISO 9001:2015/Amd 1:2024", "8.3", "Projeto e desenvolvimento de produtos (apps, site)", "SRC-05 (código existente); TSK-0054/0055/0056", "NÃO EVIDENCIADO", "Escopo e critérios de validação do app ausentes (GAP-09)."),
 ("Operação", "ISO 9001:2015/Amd 1:2024", "8.6", "Liberação de produtos e serviços", "GATE-03 e GATE-09 com critérios", "PARCIALMENTE EVIDENCIADO", "Executar os gates com registro."),
 ("Avaliação de Desempenho", "ISO 9001:2015/Amd 1:2024", "9.1", "Monitoramento, medição, análise e avaliação", "§13; TSK-0025, TSK-0039, TSK-0053", "PARCIALMENTE EVIDENCIADO", "GAP-9.1-01: frequência e método definidos neste plano, ainda não em uso."),
 ("Melhoria", "ISO 9001:2015/Amd 1:2024", "10.3", "Melhoria contínua", "Campanha 02 planejada com dados da Campanha 01 (DEC-05)", "NÃO AVALIADO", "Avaliar em 05/12 (GATE-07)."),
]
for r in hs:
    w("| " + " | ".join(r) + " |")
w("")
w("> **ID:** GAP-6.2-01 · **Estrutura transversal:** Planejamento · **Subcláusula primária:** ISO 9001:2015/Amd 1:2024 — 6.2 · **Subcláusula complementar:** ISO 9001:2015/Amd 1:2024 — 9.1 · **Lacuna:** objetivos do período têm resultado verificável, mas não meta numérica nem linha de base. · **Evidência localizada:** datas e entregas declaradas em SRC-01. · **Status:** PARCIALMENTE EVIDENCIADO. · **Ação:** medir a linha de base (TSK-0025) e fixar metas numéricas no GATE-04.")
w("")
w("> **ID:** GAP-9.1-01 · **Estrutura transversal:** Avaliação de Desempenho · **Subcláusula primária:** ISO 9001:2015/Amd 1:2024 — 9.1 · **Subcláusula complementar:** ISO 9001:2015/Amd 1:2024 — 6.2 · **Lacuna:** não havia método nem frequência de monitoramento antes deste plano. · **Evidência localizada:** §13 propõe métricas e cadência. · **Status:** NÃO EVIDENCIADO até o primeiro registro semanal (TSK-0040). · **Ação:** executar o primeiro registro em 13/11/2026.")
w("")
w("A carga de trabalho mental (ISO 10075-2, orientação) foi considerada no desenho da visão diária (§11): no máximo 3 passos por dia, uma frente dominante e WIP = 1 — decisão de desenho operacional próprio, informada pela orientação, não requisito.")
w("")
w("## 6. Objetivos do Mês e Resultados Mensuráveis")
w("")
w("Período de vários meses; os objetivos abaixo cobrem 17/10/2026 a 30/04/2027.")
w("")
w("| ID Objetivo | Objetivo do período | Fonte | Resultado mensurável | Baseline | Meta do período | Método de validação |")
w("|---|---|---|---|---|---|---|")
objs = [
 ("OBJ-01", "Lançar o riscocognitivo.org com o pacote do EPIC 01", "DEC-02, DEC-03", "KR-01: site público em 05/11 com as rotas do lançamento respondendo; KR-02: 100% dos itens listados do EPIC 01 publicados até 05/12", "Baseline não evidenciado — medir antes de confirmar meta.", "KR-01 em 05/11/2026; KR-02 em 05/12/2026", "Lista de testes (TSK-0026) e checklist de itens publicados"),
 ("OBJ-02", "Sustentar o ciclo de 30 dias de publicações multiplataforma", "DEC-03", "KR-03: 100% dos derivados dos ciclos 1 e 2 agendados (ciclo 1 até 01/11; ciclo 2 até 14/11)", "Baseline não evidenciado — medir antes de confirmar meta.", "100%", "Export da ferramenta de agendamento"),
 ("OBJ-03", "Planejar e produzir a Campanha 02 a partir dos dados da Campanha 01", "DEC-04, DEC-05", "KR-04: relatório de aprendizado em 14/11 e 05/12; KR-05: pacote da Campanha 02 aprovado em 30/11", "Baseline não evidenciado — medir antes de confirmar meta.", "Binário (entregue/não entregue)", "Relatórios e aprovação no GATE-06"),
 ("OBJ-04", "Lançar o Executar App e o ecossistema em 05/01", "DEC-03, DEC-04", "KR-06: versão do app publicada e link real ativo em 05/01/2027 no escopo do GATE-08", "Baseline não evidenciado — medir antes de confirmar meta.", "Binário", "GATE-09"),
 ("OBJ-05", "Preparar a realocação profissional na Europa", "DEC-07, DEC-08, DEC-10", "KR-07: 3 provas de certificação realizadas até 30/03/2027; KR-08: portfólio, currículo e landing publicados até 31/01/2027; KR-09: candidaturas semanais de 01/02 a 30/03 (meta numérica GAP-15)", "Baseline não evidenciado — medir antes de confirmar meta.", "KR-07: 3; KR-08: binário; KR-09: a definir", "Comprovantes de prova, links, planilha de candidaturas"),
]
for r in objs:
    w("| " + " | ".join(r) + " |")
w("")
w("## 7. Capacidade e Alocação do Mês")
w("")
w("Tabela principal — período inteiro (17/10/2026 a 30/04/2027):")
w("")
w("| Categoria de capacidade | Horas | Evidência ou suposição | Notas |")
w("|---|---|---|---|")
w(f"| Capacidade nominal | {h(c_tot['nom'])} | ASM-01 | Dias úteis × 8 + sábados × 4 |")
w(f"| Compromissos fixos (feriados) | {h(c_tot['ind'])} | ASM-02 | Indisponível |")
w(f"| Overhead operacional | {h(c_tot['ov'])} | ASM-03 | 10% das horas disponíveis |")
w(f"| Execução focada e revisão/validação | {h(c_tot['E'])} | Cálculo | Inclui revisão humana dos rascunhos de agentes e os gates |")
w(f"| Reserva de contingência | {h(c_tot['C'])} (15%) | Padrão fixo da metodologia (DEC-01) | 15% da execução planejada |")
w(f"| Total alocado | {h(c_tot['aloc'])} | Cálculo | Menor que a nominal |")
w(f"| Carga estimada das 78 tarefas | {h(carga_tot)} | ASM-04 | Folga de {h(c_tot['E'] - carga_tot)} concentrada após 06/01, reservada à operação do ecossistema pós-lançamento (a planejar no próximo intake) |")
w("")
w("Por janela (mesma regra de cálculo):")
w("")
w("| Janela | Período | Nominal da janela | Execução da janela | Reserva da janela (15%) | Carga estimada | Folga |")
w("|---|---|---|---|---|---|---|")
for j, n, a, b in JANELAS:
    c = cap(p(a), p(b)); cg = carga(T, p(a), p(b))
    w(f"| {j} — {n} | {a} a {b} | {h(c['nom'])} | {h(c['E'])} | {h(c['C'])} | {h(cg)} | {h(c['E'] - cg)} |")
w("")
w(f"**Teste de viabilidade da J1 (GATE-00):** opção A — todo o pacote do EPIC 01 pronto até 04/11 — exige cerca de {h(carga_A)} na J1, contra {h(c1['E'])} de execução ({str(round(carga_A / c1['E'], 1)).replace('.', ',')} vez a capacidade). Opção B (plano-base, ASM-10) — núcleo em 05/11 e liberações semanais até 05/12 — exige {h(carga_B)} na J1 e cabe nas janelas J1–J3. A opção A só seria viável com cerca de {carga_A / 12:.0f}h por dia útil, carga incompatível com a orientação da ISO 10075-2 sobre carga mental.")
w("")
w("## 8. Plano de Frentes de Trabalho (Workstreams)")
w("")
w("| Frente | Resultado do período | Prioridade | Responsável | Stakeholders | Dependências | Capacidade alocada | Evidência de conclusão |")
w("|---|---|---|---|---|---|---|---|")
RES = {
 "CLU-01": "Escopo, capacidade e gates decididos e registrados; épicos clonados",
 "CLU-02": "riscocognitivo.org público em 05/11 com home, blog, mapa, apps, ferramentas, loja, institucionais e CMS",
 "CLU-03": "Artigo fundador + 4 pilares publicados até 21/11",
 "CLU-04": "Prisma, 3 outros apps, família de templates, metacognição, plugins/agentes e recursos publicados até 28/11",
 "CLU-05": "4 e-books publicados até 27/11",
 "CLU-06": "3 vídeos de 5 min publicados até 13/11",
 "CLU-07": "Vitrine com 6 produtos e destinos reais",
 "CLU-08": "Ciclos 1 e 2 agendados; métricas e relatórios até 05/12",
 "CLU-09": "Campanha 02 produzida e agendada; app e épicos escolhidos lançados em 05/01",
 "CLU-10": "3 provas, portfólio, currículo, landing, LinkedIn, Frankwatching, candidaturas e viagem preparada",
}
STK = {"CLU-01": "STK-01", "CLU-02": "STK-01, STK-02, STK-09", "CLU-03": "STK-02", "CLU-04": "STK-02", "CLU-05": "STK-02",
       "CLU-06": "STK-02, STK-08", "CLU-07": "STK-02, STK-10", "CLU-08": "STK-02, STK-08", "CLU-09": "STK-02, STK-08",
       "CLU-10": "STK-03, STK-04, STK-05, STK-06, STK-07"}
DEPS = {"CLU-01": "—", "CLU-02": "DEP-01", "CLU-03": "TSK-0006", "CLU-04": "TSK-0003", "CLU-05": "CLU-03", "CLU-06": "CLU-03, CLU-04",
        "CLU-07": "DEP-02", "CLU-08": "DEP-03, CLU-03", "CLU-09": "TSK-0039, DEP-05", "CLU-10": "TSK-0051, DEP-06"}
for k, n in CLUSTERS.items():
    ts = [t for t in T if t["clu"] == k]
    pr = "Alta" if any(t["prio"] == "Alta" for t in ts) else "Média"
    w(f"| {k} {n} | {RES[k]} | {pr} | Titular | {STK[k]} | {DEPS[k]} | {h(sum(t['h'] for t in ts))} | Tarefas {ts[0]['id']}–{ts[-1]['id']} com evidência registrada |")
w("")
w("## 9. Plano Operacional Semanal")
w("")
w("| Semana | Resultado principal | Tarefas | Responsável | Dependência | Métrica | Evidência de conclusão | Gate |")
w("|---|---|---|---|---|---|---|---|")
for s, a, b in SEM:
    o, g = obj_semana(s, a, b)
    ts = tarefas_prazo(a, b)
    at = [t for t in tarefas_ativas(a, b) if t not in ts]
    ids = ", ".join(t["id"] for t in ts) or "—"
    if at:
        ids += " (em andamento: " + ", ".join(t["id"] for t in at) + ")"
    deps = sorted({t["dep"] for t in ts if t["dep"] and t["dep"] not in [x["id"] for x in ts]})
    w(f"| {s} ({f(a)[:5]}–{f(b)[:5]}) | {o} | {ids} | Titular | {', '.join(deps) or '—'} | Tarefas com prazo na semana concluídas: {len(ts)} | Evidências das tarefas listadas | {g} |")
w("")
w("## 10. Registro Executável de Tarefas")
w("")
w(f"Registro completo com as 25 colunas do schema canônico, sincronizado com o arquivo `registro-tarefas-{SLUG}-{PER}.csv`. Tabela resumida para leitura e, em seguida, o bloco CSV integral (inclui `prompt_ia_self_contained` e `fonte_id`).")
w("")
w("| tarefa_id | cluster | titulo | responsavel | prioridade | prazo | tempo_estimado | dependencia_bloqueante | status | fonte_id |")
w("|---|---|---|---|---|---|---|---|---|---|")
for t in T:
    r = linha(t)
    w(f"| {r[0]} | {r[2]} | {r[3]} | {r[19]} | {r[20]} | {r[21]} | {r[22]} | {r[18] or '—'} | {r[23]} | {r[24]} |")
w("")
w("```csv")
w(csv_text(25).rstrip("\n"))
w("```")
w("")
w("## 11. Visão Diária de Baixa Carga Cognitiva")
w("")
w("Dias ativos de 17/10/2026 a 05/01/2027 (domingos e feriados fora). Após 05/01, a visão semanal (§9) é a adequada: as tarefas do épico de emprego são blocos recorrentes de estudo e candidatura. Bloco de tempo: a janela de maior energia não foi informada (GAP-02).")
w("")
w("| Data | Fluxo principal | Passo 1 | Passo 2 | Passo 3 | Entregável esperado | Bloco de tempo | Validação de fim de dia |")
w("|---|---|---|---|---|---|---|---|")
d = INI
while d <= p("05/01/2027"):
    if util(d):
        at = sorted(tarefas_ativas(d, d), key=lambda t: (p(t["janela"][1]) if t["prazo"] == "TBD" else p(t["prazo"]), t["prio"] != "Alta"))
        if at:
            m = at[0]
            outros = at[1:3]
            passo2 = m["passos"][1] if not outros else f"{outros[0]['id']}: {outros[0]['agora']}"
            passo3 = m["passos"][2] if len(outros) < 2 else f"{outros[1]['id']}: {outros[1]['passos'][0]}"
            due = [t for t in at if t["prazo"] == f(d)]
            ent = "; ".join(f"{t['id']} concluída" for t in due) or f"Avanço registrado em {m['id']}"
            hrs = horas_dia(d)
            bloco = "2 blocos de 90 min + 1 de 60 min" if hrs == 8 else "1 bloco de 90 min (sábado leve)"
            w(f"| {f(d)} ({['seg','ter','qua','qui','sex','sáb','dom'][d.weekday()]}) | {m['id']} — {m['titulo']} | {m['agora']} | {passo2} | {passo3} | {ent} | {bloco} | Marcar o 'concluído quando' ou registrar % e bloqueio |")
    d += dt.timedelta(1)
w("")
w("## 12. Mapa de Stakeholders e Dependências")
w("")
w("| ID | Stakeholder ou dependência | Papel | Input necessário | Data necessária | Responsável pelo acompanhamento | Impacto se falhar |")
w("|---|---|---|---|---|---|---|")
stks = [
 ("STK-01", "Titular do Programa EXECUTAR", "Decisor e executor", "Decisões dos gates e horas reais", "17/10/2026", "Titular", "Plano inteiro parado"),
 ("STK-02", "Audiência neurodivergente e leitores", "Público do conteúdo", "Engajamento e dados", "A partir de 05/11/2026", "Titular", "Sem dados para a Campanha 02"),
 ("STK-03", "Clean Sea (empresa real)", "Caso do portfólio", "Autorização de uso", "15/01/2027", "Titular", "Portfólio sem o caso (GAP-11)"),
 ("STK-04", "Profissional estratégico na Holanda", "Parceria de soluções personalizadas", "Resposta ao contato", "15/12/2026", "Titular", "Frente NL sem apoio (GAP-12)"),
 ("STK-05", "Editor da Frankwatching", "Veículo da linha editorial", "Aceite de pauta", "31/01/2027", "Titular", "Linha editorial sem vitrine (GAP-13)"),
 ("STK-06", "Organismos certificadores", "Provas pagas", "Datas e preços oficiais", "25/11/2026", "Titular", "Provas fora do prazo (GAP-10)"),
 ("STK-07", "Recrutadores e empresas na Europa", "Contratantes", "Vagas abertas", "01/02/2027", "Titular", "Candidaturas sem retorno"),
 ("STK-08", "Plataformas (YouTube, Instagram, TikTok, LinkedIn, e-mail)", "Canais", "Contas ativas e agendamento", "31/10/2026", "Titular", "Ciclo de 30 dias sem distribuição (GAP-07)"),
 ("STK-09", "Cloudflare", "Hospedagem e analytics", "Domínio e Worker", "20/10/2026", "Titular", "Sem site em 05/11 (GAP-03)"),
 ("STK-10", "Programas de afiliados", "Destino de compra", "Links de afiliado", "23/10/2026", "Titular", "Loja sem receita (GAP-04)"),
 ("DEP-01", "Domínio riscocognitivo.org ativo", "Dependência técnica", "DNS e certificado", "20/10/2026", "Titular", "Lançamento adiado"),
 ("DEP-02", "Checkout e links de afiliado", "Dependência comercial", "Destinos reais", "23/10/2026", "Titular", "Vitrine sem compra"),
 ("DEP-03", "Ferramenta de agendamento multiplataforma", "Dependência operacional", "Contas conectadas", "31/10/2026", "Titular", "Agendamento manual"),
 ("DEP-04", "Token do fluxo EXECUTAR para os agentes", "Dependência operacional", "Variável EXECUTAR_AGENT_TOKEN na sessão", "19/10/2026", "Titular", "Agentes não executam; horas humanas sobem"),
 ("DEP-05", "Escopo aprovado do Executar App", "Decisão", "Lista de funções", "02/12/2026", "Titular", "App sem lançamento em 05/01"),
 ("DEP-06", "Certificações e datas oficiais", "Decisão externa", "Calendário de provas", "25/11/2026", "Titular", "KR-07 em risco"),
]
for r in stks:
    w("| " + " | ".join(r) + " |")
w("")
w("## 13. Métricas e Cadência de Revisão")
w("")
w("| ID Métrica | Métrica | Fórmula | Fonte de dado | Frequência | Meta | Decisão acionada |")
w("|---|---|---|---|---|---|---|")
mets = [
 ("MET-01", "Visitas ao site", "Soma de visitas por página", "Analytics Cloudflare (CMS)", "Semanal (sexta)", "Baseline não evidenciado — medir antes de confirmar meta.", "Ajustar canais no ciclo 2"),
 ("MET-02", "Inscritos na newsletter", "Novas inscrições no período", "Formulário do CMS", "Semanal", "Baseline não evidenciado — medir antes de confirmar meta.", "Revisar CTA da home"),
 ("MET-03", "Cliques em CTA de ferramentas", "Cliques / visitas do artigo", "Links com parâmetros", "Semanal", "Baseline não evidenciado — medir antes de confirmar meta.", "Trocar CTA do artigo"),
 ("MET-04", "Downloads de ferramentas e e-books", "Downloads por recurso", "CMS", "Semanal", "Baseline não evidenciado — medir antes de confirmar meta.", "Priorizar temas na Campanha 02"),
 ("MET-05", "Cliques de afiliado e vendas", "Cliques e pedidos por produto", "Programas de afiliado / checkout", "Semanal", "Baseline não evidenciado — medir antes de confirmar meta.", "Revisar mix da loja"),
 ("MET-06", "Cumprimento do agendamento", "Publicadas / agendadas", "Ferramenta de agendamento", "Semanal", "100%", "Replanejar o ciclo"),
 ("MET-07", "Tarefas concluídas no prazo", "Concluídas no prazo / com prazo na semana", "Registro de tarefas", "Semanal", "Baseline não evidenciado — medir antes de confirmar meta.", "Acionar contingência"),
 ("MET-08", "Horas de estudo", "Horas registradas / horas planejadas", "Registro de estudos", "Semanal", "Meta definida no plano de estudos (TSK-0052)", "Reprogramar prova"),
 ("MET-09", "Nota de simulado", "Acertos / questões", "Simulados", "Por simulado", "Nota de corte oficial de cada certificação (GAP-10)", "Adiar ou manter a prova"),
 ("MET-10", "Candidaturas enviadas", "Envios por semana", "Planilha de candidaturas", "Semanal", "A definir (GAP-15)", "Ajustar foco de vagas"),
]
for r in mets:
    w("| " + " | ".join(r) + " |")
w("")
w("## 14. Riscos e Controles")
w("")
w("| ID Risco | Risco | Evidência | Probabilidade | Impacto | Ação preventiva | Contingência | Responsável | Gatilho |")
w("|---|---|---|---|---|---|---|---|---|")
rsks = [
 ("RSK-01", "Sobrecarga da janela de lançamento", f"§7: opção A ≈ {h(carga_A)} contra {h(c1['E'])}", "Alta", "Alto", "Adotar a opção B no GATE-00; usar agentes para rascunhos", "Mover itens de prioridade Média para a onda 2", "Titular", "Tarefa Alta atrasada mais de 1 dia em S01–S02"),
 ("RSK-02", "Domínio ou hospedagem indisponível", "GAP-03", "Média", "Alto", "TSK-0004 em 19–20/10", "Lançar no endereço do Worker e redirecionar depois", "Titular", "DNS sem resposta em 20/10"),
 ("RSK-03", "Venda antes de validar o problema", "CONF-10", "Média", "Médio", "Priorizar afiliados e ferramentas gratuitas; medir MET-05", "Retirar produto pago sem tração da vitrine", "Titular", "MET-05 sem cliques até 14/11"),
 ("RSK-04", "Conteúdo lido como diagnóstico ou promessa de saúde", "FACT-02", "Média", "Alto", "Restrição em todos os prompts; revisão TSK-0024", "Corrigir e publicar nota editorial", "Titular", "Comentário ou denúncia"),
 ("RSK-05", "Uso indevido de obra protegida (Barkley)", "GAP-18", "Média", "Médio", "Citação curta e referência completa", "Renomear o e-book", "Titular", "Dúvida de direitos em 23/11"),
 ("RSK-06", "Sobreposição da Campanha 02 com o início do épico de emprego e com a onda 2", "§7 J3", "Média", "Médio", "Limite de 30% para o épico (ASM-05)", "Adiar estudos de 1 semana", "Titular", "Carga J3 acima da execução"),
 ("RSK-07", "Dados da Campanha 01 insuficientes em 14/11 (9 dias)", "DEC-05", "Alta", "Médio", "Relatório parcial + final em 05/12", "Ajustar a Campanha 02 em 05/12", "Titular", "Menos de 1 semana de dados por canal"),
 ("RSK-08", "App não pronto em 05/01 (festas de fim de ano)", "GAP-09; J4", "Média", "Alto", "Escopo mínimo em 02/12; GATE-08 em 20/12", "Lançar lista de espera e versão web", "Titular", "Funções do escopo abertas em 20/12"),
 ("RSK-09", "Datas de prova indisponíveis ou custo acima do orçamento", "GAP-10", "Média", "Alto", "Escolha em 25/11 com datas oficiais", "Trocar a ordem das provas", "Titular", "Sem vaga na janela"),
 ("RSK-10", "Candidaturas sem retorno por idioma, visto ou portfólio", "GAP-14", "Média", "Alto", "GATE-10 com checklist", "Rever o alvo de vagas", "Titular", "Zero entrevistas até 01/03"),
 ("RSK-11", "Fadiga e sobrecarga cognitiva do titular", "ISO 10075-2 (orientação); FACT-06", "Média", "Alto", "WIP = 1, 3 passos por dia, domingos livres", "Usar a reserva de 15%", "Titular", "2 dias seguidos sem validação de fim de dia"),
 ("RSK-12", "Mudança de edição da ISO 9001", "CONF-08", "Média", "Baixo", "Confirmar em iso.org", "Atualizar a skill e o §4", "Titular", "Confirmação da nova edição"),
]
for r in rsks:
    w("| " + " | ".join(r) + " |")
w("")
w("## 15. Itens Adiados e Excluídos")
w("")
w("| Item | Motivo do adiamento/exclusão | Evidência | Condição de reconsideração |")
w("|---|---|---|---|")
adi = [
 ("CMS com automação completa", "Épico posterior", "DEC-02, CONF-06", "Após 05/01, com dados de uso"),
 ("Completude das rotas, notícias etc.", "Épico posterior", "DEC-02", "GATE-08"),
 ("Consultoria, studio e portfólio do studio", "Épico posterior; entra em 05/01 só se escolhido", "DEC-02", "GATE-08"),
 ("Cursos", "Épico posterior", "DEC-02", "GATE-08"),
 ("Marketplace completo", "Épico posterior; vitrine mínima no EPIC 01", "CONF-05", "GATE-08"),
 ("Comunidade/ONG, comentários, conta e login", "Épico posterior; exige moderação", "CONF-09, FACT-02", "Após 05/01"),
 ("Mapas adicionais (/mapas/[slug])", "Excede a capacidade da J1", "§7", "Após 05/12"),
 ("Página Parceiros", "Sem parceiros identificados", "SRC-02", "Quando houver parceiro"),
 ("Itens \"......\" dos épicos posteriores", "Não especificados", "GAP-19", "GATE-08"),
 ("Plano detalhado da operação do ecossistema após 05/01", "Depende dos dados da Campanha 02", "DEC-05", "Novo intake em janeiro"),
]
for r in adi:
    w("| " + " | ".join(r) + " |")
w("")
w("## 16. Gates de Decisão")
w("")
w("| ID Gate | Decisão | Evidência necessária | Responsável pela decisão | Prazo | Consequência de não decidir |")
w("|---|---|---|---|---|---|")
gates = [
 ("GATE-00", "Confirmar horas reais e escolher a opção A (tudo em 05/11) ou B (núcleo + liberações até 05/12)", "§7 e TSK-0001", "Titular", "17/10/2026", "J1 sem escopo viável"),
 ("GATE-01", "Confirmar domínio, hospedagem, checkout e plataformas", "TSK-0004, TSK-0017, GAP-07", "Titular", "23/10/2026", "Site e loja sem destino"),
 ("GATE-02", "Congelar o pacote da onda 1 e confirmar os agendamentos do ciclo 1", "TSK-0022, TSK-0023", "Titular", "01/11/2026", "Ciclo de 30 dias sem base"),
 ("GATE-03", "Liberar o lançamento de 05/11", "TSK-0026, TSK-0027", "Titular", "04/11/2026", "Lançamento com erro público"),
 ("GATE-04", "Validar os dados da Campanha 01 e fixar metas numéricas", "TSK-0039", "Titular", "14/11/2026", "Campanha 02 sem base (DEC-05)"),
 ("GATE-05", "Escolher as certificações e confirmar a distribuição de horas do épico de emprego", "TSK-0051, ASM-05", "Titular", "25/11/2026", "Estudos sem rumo"),
 ("GATE-06", "Aprovar o pacote da Campanha 02", "TSK-0042", "Titular", "30/11/2026", "Agendamento atrasado"),
 ("GATE-07", "Fechar o ciclo de 30 dias", "TSK-0053", "Titular", "05/12/2026", "Lições perdidas"),
 ("GATE-08", "Confirmar escopo do app e épicos posteriores que entram em 05/01", "TSK-0054, TSK-0055, TSK-0057", "Titular", "20/12/2026", "Lançamento de 05/01 sem escopo"),
 ("GATE-09", "Liberar o lançamento de 05/01", "TSK-0056, TSK-0059", "Titular", "04/01/2027", "Lançamento com erro"),
 ("GATE-10", "Liberar o início das candidaturas", "TSK-0067, TSK-0068, TSK-0069, TSK-0072", "Titular", "31/01/2027", "Candidaturas fracas"),
 ("GATE-11", "Encerrar o épico de emprego e decidir a viagem", "TSK-0073, TSK-0077", "Titular", "30/03/2027", "Viagem sem preparo"),
]
for r in gates:
    w("| " + " | ".join(r) + " |")
w("")
w("## 17. Próxima Ação Imediata")
w("")
w("| Campo | Conteúdo |")
w("|---|---|")
w("| Responsável | Titular |")
w("| Ação concreta | TSK-0001 — confirmar quantas horas por dia estão disponíveis até 04/11 e escolher a opção A ou B do lançamento (GATE-00) |")
w("| Fonte | DEC-03, §7, RSK-01 |")
w("| Resultado esperado | Decisão escrita: horas/semana + opção A ou B |")
w("| Duração máxima | 30 minutos |")
w("| Evidência de conclusão | Nota de decisão datada no registro de tarefas |")
w("| Por que esta ação e não outra | Todas as tarefas da J1 dependem da capacidade real; sem ela o plano pode exigir cerca de 1,7 vez as horas disponíveis antes de 05/11 |")
w("")
w("## Apêndice A — Tabela Mínima de Rastreabilidade")
w("")
w("| ID | Requisito | Fonte original | Citação da fonte | Classificação | Status de evidência | Dependência | Ação |")
w("|---|---|---|---|---|---|---|---|")
reqs = [
 ("REQ-01", "Concluir a produção do EPIC 01 e os agendamentos até 01/11", "SRC-01", "\"Entre 17/10 e 01/11 é necessario completar todo o packge epic 01 e agendar\"", "REQUIREMENT (instrução)", "Planejado; capacidade em risco", "GATE-00", "TSK-0001…TSK-0023"),
 ("REQ-02", "Lançar riscocognitivo.org em 05/11 com o conteúdo listado", "SRC-01", "\"no dia 05/11 o lançamento inclui todo conteúdo listado\"", "REQUIREMENT (instrução)", "Planejado (opção B); CONF-01", "GATE-03", "TSK-0028"),
 ("REQ-03", "Conteúdos sustentam ciclo de 30 dias até 05/12", "SRC-01", "\"os conteudos devem suportar ciclo de 30 dias ate 05/12\"", "REQUIREMENT", "Planejado", "TSK-0023, TSK-0037", "TSK-0040, TSK-0053"),
 ("REQ-04", "Cada artigo conecta com CTA de ferramenta/solução", "SRC-01", "\"Cada artigo conecta com um cta relacionado às ferramentas e soluções\"", "REQUIREMENT", "Planejado", "CLU-04", "TSK-0009, 0029, 0030, 0043, 0044"),
 ("REQ-05", "Produzir a Campanha 02 entre 15/11 e 30/11 a partir dos dados da Campanha 01", "SRC-01", "\"A próxima campanha será produzida entre 15/11 e 30/11 … a partir de coleta de dados\"", "REQUIREMENT", "Planejado", "TSK-0039", "TSK-0041, TSK-0042"),
 ("REQ-06", "Lançar app, épicos posteriores e Campanha 02 em 05/01", "SRC-01", "\"a previsão do lançamento do app e dos epics posteriores e campanha 2 é para 5/01\"", "REQUIREMENT", "Planejado; escopo GAP-09", "GATE-08", "TSK-0054…TSK-0060"),
 ("REQ-07", "Acompanhar produção por objetivos macro semanais divididos por dias", "SRC-01", "\"organizaremos acompanhamento de produção a partir de objetivos macros por semana, divididos por dias\"", "REQUIREMENT", "EVIDENCIADO neste documento", "—", "§9, §11"),
 ("REQ-08", "Executar o EPIC Emprego de 19/11 a 30/03 com itens 0–5", "SRC-01", "\"esse epic inicia em 19/11 e encerra em 30/03\"", "REQUIREMENT", "Planejado", "GATE-05", "TSK-0050…TSK-0077"),
 ("REQ-09", "Certificações pagas de referência para o mercado europeu", "SRC-01", "\"provas e validações pagas das referências gold standard para mercado europeu\"", "REQUIREMENT", "NÃO EVIDENCIADO (escolha pendente)", "GAP-10", "TSK-0051"),
 ("REQ-10", "Candidaturas de 01/02 a 30/03; viagem em 30/04", "SRC-01", "\"as aplicações … iniciam-se em 01/02 e vão até 30/03. a viagem será em 30/04\"", "REQUIREMENT", "Planejado", "GATE-10", "TSK-0073, TSK-0078"),
 ("REQ-11", "Não apresentar classificação como diagnóstico", "SRC-02", "\"Não apresentar classificação como diagnóstico.\"", "CONSTRAINT", "Aplicado nos prompts", "—", "Restrição em todas as tarefas"),
 ("REQ-12", "Não inventar destino do app nem integração de pagamento", "SRC-02", "\"Não inventar destino externo\"; \"não inventar integração de pagamento\"", "CONSTRAINT", "Aplicado", "DEP-02", "TSK-0013, TSK-0017, TSK-0019"),
 ("REQ-13", "Tripla clonagem de épicos", "SRC-06", "\"Epic, project, issue ou sub-issue citado = tripla clonagem\"", "REQUIREMENT (projeto)", "NÃO EVIDENCIADO", "Acesso ao GitHub", "TSK-0002"),
 ("REQ-14", "Planejar ações para riscos e objetivos mensuráveis", "SRC-07", "ISO 9001:2015/Amd 1:2024 — 6.1 e 6.2", "NORMATIVE REQUIREMENT", "PARCIALMENTE EVIDENCIADO", "GAP-6.2-01", "§6, §14"),
]
for r in reqs:
    w("| " + " | ".join(r) + " |")
w("")
w("## Apêndice B — Referências Cruzadas Rápidas")
w("")
w("- Meta do período e resultados → §6")
w("- Quantas horas cabem em cada janela → §7")
w("- O que fazer nesta semana → §9")
w("- O que fazer hoje → §11 + §17")
w("- Prompt completo de cada tarefa → §10 (bloco CSV) e arquivo de registro")
w("- Conflito de fontes → §3.5")
w("- O que falta saber → §3.4")
w("- Decisões pendentes → §16")
w("- O que ficou para depois → §15")
w("")
w("## Registro Final de Honestidade")
w("")
w("Todas as lacunas foram preservadas como GAP e refletidas como TBD ou \"a definir\" nas tarefas. Nenhuma linha de base ou meta numérica foi inventada: onde a fonte silenciou, o documento declara \"Baseline não evidenciado\". A capacidade foi calculada sobre suposições explícitas (ASM-01 a ASM-05), a confirmar no GATE-00. Não se afirma conformidade normativa. Os dez conflitos entre fontes foram registrados com as duas versões, e nenhum foi resolvido em silêncio. Recomendações (opção B, priorizar afiliados, uso de agentes) foram rotuladas como tais e não como requisitos.")
w("")
w(f"Fim do documento. Emitido em {EMISSAO} às 12:00 (horário de Brasília).")

INT = os.path.join(OUT, f"plano-interno-{SLUG}-{PER}.md")
open(INT, "w", encoding="utf-8").write("\n".join(L) + "\n")

# ---------------------------------------------------------------- roadmap (cliente)
R = []
r = R.append
r("# Plano de Ação — Programa EXECUTAR — 17/10/2026 a 30/04/2027")
r("")
r("## Meta do período")
r("Lançar o riscocognitivo.org em 05/11/2026, manter 30 dias de publicações até 05/12/2026, lançar o Executar App e todo o ecossistema em 05/01/2027 e preparar a mudança profissional para a Europa até a viagem de 30/04/2027.")
r("")
r("## Antes de tudo: uma decisão para hoje (17/10)")
r(f"O pacote completo do lançamento foi estimado em cerca de {carga_A:.0f} horas de trabalho, e até 04/11 cabem cerca de {c1['E']:.0f} horas (a confirmar). Este plano segue a **opção recomendada**: lançar em 05/11 o núcleo (site, artigo fundador, mapa, Prisma, primeiros templates, e-book 1, vídeo comercial e loja) e liberar o restante, toda semana, até 05/12 — o que também alimenta o ciclo de 30 dias. Se você preferir lançar tudo em 05/11, o cronograma precisa ser refeito.")
r("")
r("## Frentes de trabalho")
r("| Frente | O que vamos entregar | Por quê importa |")
r("|---|---|---|")
for k, n in CLUSTERS.items():
    r(f"| {n} | {RES[k]} | {POR_QUE[k]} |")
r("")
r("## Cronograma por semana")
for s, a, b in SEM:
    o, g = obj_semana(s, a, b)
    ts = tarefas_prazo(a, b)
    r(f"### Semana de {f(a)[:5]} a {f(b)[:5]} — {o}")
    if ts:
        r("| Tarefa | Responsável | Prazo | Resultado esperado |")
        r("|---|---|---|---|")
        for t in ts:
            pz = t["prazo"] if t["prazo"] != "TBD" else f"A definir (janela até {t['janela'][1]})"
            r(f"| {t['titulo']} | Você | {pz} | {t['resultado']} |")
    else:
        at = tarefas_ativas(a, b)
        r("Semana de continuidade: " + ("; ".join(t["titulo"] for t in at) if at else "sem tarefas com prazo.") )
    r("")
r("## Pontos de decisão")
r("| Quando | O que precisa ser decidido | Quem decide |")
r("|---|---|---|")
for gid, dec, ev, resp, pz, cons in gates:
    r(f"| {pz} | {dec} | Você |")
r("")
r("## O que ainda está a definir")
r("| Item | Situação |")
r("|---|---|")
for gid, lac, *_ in gaps:
    if not gid.startswith("GAP-6") and not gid.startswith("GAP-9"):
        r(f"| {lac} | A definir |")
r("")
r("## O que fica para depois")
r("| Item | Motivo |")
r("|---|---|")
for it, mot, ev, cond in adi:
    r(f"| {it} | {mot} |")
r("")
r(f"Emitido em {EMISSAO}.")
open(os.path.join(OUT, f"roadmap-{SLUG}-{PER}.md"), "w", encoding="utf-8").write("\n".join(R) + "\n")

# ---------------------------------------------------------------- linear import (cliente)
M = []
m = M.append
m("# Lista de tarefas para importar no Linear — Programa EXECUTAR — 17/10/2026 a 30/04/2027")
m("")
m(f"Uma linha por tarefa, 22 colunas. O mesmo conteúdo está em `linear-import-{SLUG}-{PER}.csv` (separador vírgula, aspas no padrão RFC 4180) para importar direto. As etiquetas `no-n4`, `no-n16`, `no-n17`, `no-n19` e `no-n20` ligam a tarefa à casa correspondente do fluxo de agentes do EXECUTAR.")
m("")
m("| " + " | ".join(COLS[:22]) + " |")
m("|" + "---|" * 22)
for t in T:
    rr = linha(t)[:22]
    rr[12] = md_cell_prompt(rr[12])
    m("| " + " | ".join(rr[i] if i == 12 else md_cell(rr[i]) for i in range(22)) + " |")
m("")
m(f"Emitido em {EMISSAO}.")
open(os.path.join(OUT, f"linear-import-{SLUG}-{PER}.md"), "w", encoding="utf-8").write("\n".join(M) + "\n")

# ---------------------------------------------------------------- calendário HTML
CORES = {"CLU-01": "#5b5f6b", "CLU-02": "#1f6feb", "CLU-03": "#8250df", "CLU-04": "#0a7d6f", "CLU-05": "#bf3989",
         "CLU-06": "#d1242f", "CLU-07": "#bc4c00", "CLU-08": "#9a6700", "CLU-09": "#0550ae", "CLU-10": "#1a7f37"}
total_dias = (FIM - INI).days + 1
def pct(d):
    return (d - INI).days / total_dias * 100
rows = []
for k, n in CLUSTERS.items():
    ts = [t for t in T if t["clu"] == k]
    bars = []
    for t in ts:
        a = p(t["ini"]); b = p(t["janela"][1]) if t["prazo"] == "TBD" else p(t["prazo"])
        bars.append(f'<span class="bar" style="left:{pct(a):.2f}%;width:{max(pct(b + dt.timedelta(1)) - pct(a), 0.45):.2f}%;background:{CORES[k]}" title="{html.escape(t["titulo"])} ({t["ini"]}–{t["prazo"]})"></span>')
    rows.append(f'<div class="row"><div class="lbl"><i style="background:{CORES[k]}"></i>{html.escape(n)}</div><div class="track">{"".join(bars)}</div></div>')
meses = []
d = INI.replace(day=1)
while d <= FIM:
    nx = (d.replace(day=28) + dt.timedelta(4)).replace(day=1)
    a = max(d, INI); b = min(nx - dt.timedelta(1), FIM)
    nome = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"][d.month - 1]
    meses.append(f'<span style="left:{pct(a):.2f}%;width:{pct(b + dt.timedelta(1)) - pct(a):.2f}%">{nome}/{str(d.year)[2:]}</span>')
    d = nx
marcos = [("05/11/2026", "Lançamento do site"), ("05/12/2026", "Fim do ciclo de 30 dias"), ("05/01/2027", "Lançamento do app"),
          ("01/02/2027", "Início das candidaturas"), ("30/03/2027", "Fim do épico de emprego"), ("30/04/2027", "Viagem")]
ms = "".join(f'<span class="mk{" end" if pct(p(x)) > 90 else ""}" style="left:{pct(p(x)):.2f}%"><b>{x[:5]}</b> {html.escape(y)}</span>' for x, y in marcos)
lines = "".join(f'<span class="ml" style="left:{pct(p(x)):.2f}%"></span>' for x, y in marcos)
cards = []
gate_by = {}
for g in gates:
    gate_by.setdefault(g[4], []).append(g[0])
for s, a, b in SEM:
    o, g = obj_semana(s, a, b)
    ts = tarefas_prazo(a, b)
    destaques = [t for t in ts if t["prio"] == "Alta"][:3] or ts[:2]
    mk = [y for x, y in marcos if a <= p(x) <= b]
    gs = [k for dd, v in gate_by.items() if a <= p(dd) <= b for k in v]
    items = "".join(f'<li><i style="background:{CORES[t["clu"]]}"></i>{html.escape(t["titulo"][:62] + ("…" if len(t["titulo"]) > 62 else ""))}</li>' for t in destaques)
    flag = (f'<div class="flag">★ {html.escape(" · ".join(mk))}</div>' if mk else "") + ('<div class="dec">◆ ponto de decisão</div>' if gs else "")
    cards.append(f'<div class="card{" hot" if mk else ""}"><div class="wk">{f(a)[:5]}–{f(b)[:5]}</div><div class="ob">{html.escape(o)}</div>{flag}<ul>{items}</ul></div>')
legend = "".join(f'<span><i style="background:{CORES[k]}"></i>{html.escape(n)}</span>' for k, n in CLUSTERS.items())
HTML = f"""<!doctype html>
<html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Calendário EXECUTAR</title>
<style>
:root{{--bg:#fff;--fg:#111;--mut:#555;--line:#d0d7de;--card:#f6f8fa}}
@media (prefers-color-scheme:dark){{:root:not([data-theme=light]){{--bg:#0d1117;--fg:#e6edf3;--mut:#9da7b3;--line:#30363d;--card:#161b22}}}}
*{{box-sizing:border-box}}body{{margin:0;background:var(--bg);color:var(--fg);font:14px/1.35 system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;padding:16px}}
h1{{font-size:22px;margin:0}}.sub{{color:var(--mut);margin:2px 0 12px}}
.gantt{{border:1px solid var(--line);border-radius:8px;padding:8px 10px;margin-bottom:10px}}
.axis,.marks{{position:relative;height:18px;margin-left:200px}}.axis span{{position:absolute;top:0;font-size:11px;color:var(--mut);border-left:1px solid var(--line);padding-left:3px}}
.marks{{height:30px}}.mk{{position:absolute;top:0;font-size:10.5px;transform:translateX(-2px);border-left:2px solid var(--fg);padding-left:3px;white-space:nowrap;line-height:1.15}}
.mk:nth-child(even){{top:14px}}.mk.end{{transform:translateX(-100%);border-left:0;border-right:2px solid var(--fg);padding:0 3px 0 0}}body{{overflow-x:hidden}}
.row{{display:flex;align-items:center;height:20px}}.lbl{{width:200px;flex:none;font-size:12.5px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}}
.lbl i,.legend i,li i{{display:inline-block;width:10px;height:10px;border-radius:2px;margin-right:6px;vertical-align:-1px}}
.track{{position:relative;flex:1;height:12px;background:var(--card);border-radius:3px}}.bar{{position:absolute;top:0;height:12px;border-radius:2px;opacity:.9}}
.lines{{position:relative;margin-left:200px}}.ml{{position:absolute;top:-10px;height:calc(100% + 10px)}}
.grid{{display:grid;grid-template-columns:repeat(7,1fr);gap:6px}}
.card{{border:1px solid var(--line);border-radius:6px;padding:5px 6px;background:var(--bg);min-height:78px}}.card.hot{{border:2px solid var(--fg)}}
.wk{{font-weight:700;font-size:12px}}.ob{{font-size:10.5px;color:var(--mut);margin:1px 0 2px}}
.flag{{font-size:11px;font-weight:700}}.dec{{font-size:10.5px}}
ul{{margin:2px 0 0;padding:0;list-style:none}}li{{font-size:10.5px;line-height:1.2;margin:1px 0}}
.legend{{display:flex;flex-wrap:wrap;gap:4px 14px;font-size:12px;margin:6px 0}}footer{{color:var(--mut);font-size:11px;margin-top:6px}}
@media screen and (max-width:800px){{.grid{{grid-template-columns:repeat(2,1fr)}}.lbl{{width:110px}}.axis,.marks,.lines{{margin-left:110px}}}}
@media print{{@page{{size:A4 landscape;margin:6mm}}body{{zoom:.8;padding:0;font-size:11px;background:#fff;color:#000}}.gantt{{padding:4px 6px;margin-bottom:5px}}.card{{min-height:0;padding:3px 4px}}.grid{{gap:3px}}li,.ob{{font-size:8.6px}}.wk{{font-size:9.5px}}.row{{height:15px}}.track,.bar{{height:10px}}h1{{font-size:17px}}.sub{{margin-bottom:4px}}}}
</style></head><body>
<h1>Calendário do Programa EXECUTAR — 17/10/2026 a 30/04/2027</h1>
<div class="sub">Lançamento do riscocognitivo.org, ciclo de 30 dias, campanha 02, lançamento do app e carreira na Europa</div>
<section class="gantt">
<div class="axis">{''.join(meses)}</div>
<div class="marks">{ms}</div>
{''.join(rows)}
</section>
<div class="legend">{legend}</div>
<div class="grid">{''.join(cards)}</div>
<footer>Emitido em {EMISSAO} · Programa EXECUTAR · ★ marco · ◆ ponto de decisão · borda forte = semana com marco</footer>
</body></html>
"""
open(os.path.join(OUT, f"calendario-{SLUG}-{PER}.html"), "w", encoding="utf-8").write(HTML)
print("ok", INT, len(T), "tarefas", "cargaA", carga_A, "cargaB", carga_B, "semanas", len(SEM))
