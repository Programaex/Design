# SPEC-03 — Impressão e cálculo de página
Esta é a especificação do render a implementar. Nenhum PDF das novas views foi produzido ou validado neste handoff.

## Contrato ExportOptions
view: calendar|mindmap|workflow|gantt; scope: selection|filtered|all; paper: A4|A3|custom; orientation: portrait|landscape; marginsMm (top/right/bottom/left); includeLegend; includeHeader; includeDetails; layoutDirection: LR|TB|bilateral; overflowMode: ask|paginate. Padrão proposto: A4 paisagem, margens 10 mm, escopo filtrado, ask. Mostrar a contagem de registros antes de exportar.

## Cálculo
A4 = 210×297 mm; A3 = 297×420 mm. Primeiro trocar largura/altura conforme orientação. Área útil = dimensões da folha menos margens, cabeçalho, rodapé e legenda medidos. Trabalhar na mesma unidade: px CSS a 96 dpi, px = mm × 96/25,4. Medir fontes carregadas e os bounds reais de nós, setas, labels e sombras que serão impressos, não o viewport visível.

Se bounds B=(Bw,Bh), área U=(Uw,Uh), escala s=min(1,Uw/Bw,Uh/Bh). Centralizar com dx=(Uw−s×Bw)/2 e dy=(Uh−s×Bh)/2, compensando origem negativa de B. Fonte física final em pt = fontPx × s × 72/96. Piso proposto = 9 pt; detalhes secundários podem ser excluídos apenas mediante seleção explícita no preview. Se qualquer título selecionado ficar abaixo do piso, o modo uma página exige A3/custom ou redução explícita do escopo. Não gerar uma página ilegível para alegar sucesso.

Exemplo de calibração: A4 paisagem com margens de 10 mm, cabeçalho 12 mm e rodapé/legenda 10 mm → área 277×168 mm (~1047×635 px). Bounds 1600×900 px → s≈0,654. Fonte de 16 px vira ~7,85 pt, logo a exportação deve pedir ajuste. Margens do navegador e cabeçalhos automáticos devem estar desativados no pipeline automatizado para não serem contados duas vezes.

## Calendário
Medir o texto de cada evento depois de aplicar largura de célula, padding e fonte. H mínima da célula = cabeçalho do dia + soma das alturas dos cartões + gaps + padding. Altura de uma linha semanal = máximo das células daquela semana. Somar as 4–6 linhas. Não usar ellipsis, line-clamp nem “+N” no PDF. Agenda pode paginar por registros; mês em uma página pode requerer papel maior ou seleção reduzida. Em semana/dia, colisões mantêm título legível ou mudam para lista por horário mediante escolha do usuário. Janela e data exata recebem rótulos diferentes.

## Mapa/workflow
Exportar SVG/DOM vetorial sempre que possível, texto selecionável e fontes locais carregadas. O modo “todo o mapa” expande todos os nós da seleção para impressão; não reutiliza o crop do canvas. O modo “estado visível” deve ser escolha explícita com contagem de nós ocultos. Uma página não inclui automaticamente o anexo de PrintSheet.tsx; tabela de detalhes é opção de exportação separada. Não juntar três datasets sem raiz/grupo explícito.

## CSS e prontidão
O renderer deve gerar @page conforme opções validadas; um preset de base seria:
```css
@page { size: A4 landscape; margin: 10mm; }
@media print {
  .screen-only { display: none !important; }
  .print-root { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
  .event, .node { break-inside: avoid; overflow: visible; }
}
```
@page sozinho não calcula escala nem impede overflow. Criar área de impressão dedicada; remover toolbar, transform de pan e scroll clipping. Aguardar document.fonts.ready, imagens e layout estável; emitir printReady apenas após medição final. Pipeline existente deve passar printBackground=true e preferCSSPageSize=true quando suportado pelo motor escolhido, validado na implementação. Conferir número de páginas, bounds e presença de títulos no PDF gerado, além de inspeção visual.

## Cores e overflow
Categorias usam fundo claro + texto escuro + rótulo; manter legenda no PDF. Impressão física depende do dispositivo, portanto não codificar informação apenas na cor. ask é padrão: nunca mudar de uma página para várias sem informar. paginate opcional mostra total de páginas, repete cabeçalho/legenda e preserva células/nós inteiros; conexões entre páginas precisam de referência por ID. Para grafo grande, papel custom ou subconjunto é preferível a arestas cortadas sem continuidade.

## Casos de aceite
Calendário vazio; mês com 6 semanas; vários eventos no mesmo dia; títulos longos; evento multidiário; acentos; uma semana útil; mapa de 53 nós; mapa com bounds negativos; nós recolhidos e escopo completo; A4/A3 e orientação dupla. Verificar todos os títulos selecionados e ausência de páginas em branco extras. O preview e o PDF devem usar o mesmo snapshot/version de dados.
