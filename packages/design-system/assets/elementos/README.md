---
ID: EV-CONTEXTOS-001
VERSION: 1.0.0
AREA: Design e produção de assets
WORKFLOW: inspecionar → recortar → classificar → vetorizar → validar → organizar
OWNER: A DEFINIR
STATUS: VERIFIED_LOCAL
AUTOMATION_LEVEL: A4
DEPENDS_ON: nenhuma para usar os SVGs prontos
BLOCKS: nenhuma para baixar os arquivos
HANDOFF: escolher a cena no catálogo e importar seu SVG no Canva
---

# Elementos visuais por contexto

92 cenas/componentes extraídos das 13 pranchas do ZIP enviado. Cada cena recebe ID, nome descritivo, contexto, recorte de origem, PNG transparente, SVG, template Jinja e paleta editável. Os SVGs são vetorização das imagens fornecidas, com curvas Bézier e cores aproximadas. Não são substituições por ícones genéricos.

## Diretório

| Pasta/arquivo | Conteúdo |
|---|---|
| 00_fontes | 13 JPGs originais, preservados |
| 01_elementos/contexto/EV-XXX__nome-da-cena | Cena individual, com todos os formatos juntos |
| 02_catalogo/CATALOGO.html | Catálogo autossuficiente, por contexto, com os SVGs incorporados |
| 02_catalogo/IMG_*.jpg | Pranchas de conferência dos recortes, com IDs |
| 03_verificacao | Renderizações dos SVGs para conferência |
| inventario.csv / manifest.json | Inventário completo, fonte, bounding box, contexto, caminho e hash |
| recortes.json | Coordenadas e ajustes de recorte, fonte canônica da exportação |
| exportar.py | Regenera o diretório a partir das fontes e dos recortes |
| render_jinja.py | Renderiza um template usando a paleta original ou personalizada |

## Contextos

| Contexto | Cenas |
|---|---:|
| Trabalho | 28 |
| Comunicação | 15 |
| Projeto | 10 |
| Rotina | 9 |
| Bem-estar | 7 |
| Processo | 6 |
| Pessoas | 6 |
| Estudo | 5 |
| Colaboração | 2 |
| Finanças | 2 |
| Componentes | 2 |
| **Total** | **92** |

Contextos e nomes são classificações editoriais inferidas a partir do que está visível; não são descrições fornecidas pelos autores. Cenas de interação, como conversa, reunião, negociação e ajuda mútua, ficam juntas para preservar seu sentido. Algumas imagens mostram a mesma ideia em pranchas diferentes; cada ocorrência mantém sua origem, sem exclusão silenciosa.

## Conteúdo de cada cena

- `recorte_fonte.jpg`: recorte retangular, antes do tratamento de fundo.
- `recorte_transparente.png`: recorte tratado, útil quando a fidelidade do raster for preferível.
- `EV-XXX__nome.svg`: vetor para importar.
- `EV-XXX__nome.svg.jinja`: o mesmo desenho com cores parametrizadas.
- `paleta.json`: valores hexadecimais das variáveis cor_01, cor_02 etc.
- `metadados.json`: rastreabilidade, geometria, método e integridade.

## Uso no Canva

Localize a cena pelo catálogo e faça upload do SVG correspondente. O SVG não incorpora PNG/JPG: suas formas são paths vetoriais. A recoloração/desagregação disponível depende da importação do Canva e não foi testada na conta. Para preparar uma cor exata, altere a paleta e renderize o template antes de importar. Jinja é um template de geração; não é um formato importável no Canva. O PNG transparente é uma alternativa visual, mas não permite edição de nós.

## Jinja

Instale as dependências de regeneração com `python -m pip install -r requirements.txt`.

Exemplo, a partir da raiz do pacote:

```bash
python render_jinja.py 01_elementos/estudo/EV-001__leitura-e-descoberta/EV-001__leitura-e-descoberta.svg.jinja --output leitura.svg
```

Para personalizar, copie `paleta.json`, altere seus valores e passe `--palette minha-paleta.json`. O gerador usa StrictUndefined: uma variável ausente produz erro, em vez de um SVG incompleto. `python exportar.py` regenera o lote; `recortes.json` é o controle dos enquadramentos.

## Qualidade e limites

As cores originais foram preservadas por aproximação, com redução de paleta para conter o número de paths. Gradientes dos JPGs tornam-se faixas de cor, não gradientes reconstruídos. Fotografias em IMG_1993 tornam-se ilustrações vetoriais simplificadas; os PNGs preservam mais detalhes. A resolução dos personagens pequenos limita detalhes de rostos e mãos. EV-092 já apresenta parte do personagem cortada na borda da fonte; essa geometria não foi inventada.

Os arquivos de origem contêm estilos diferentes (flat, isométrico e fotográfico), mantidos como famílias distintas. A organização por contexto não altera automaticamente esse estilo. Nenhuma uniformização de anatomia/traço foi aplicada aos recortes desta entrega.

## Evidência e origem

Aceite local: 92 entradas rastreáveis, 92 SVGs sem bitmaps, 92 templates renderizados com paleta original e igualdade de conteúdo, 92 PNGs transparentes, validação XML, renderização de cada SVG e inspeção das pranchas. Resultado em `verificacao.json`. Integração no Canva não executada.

Créditos visíveis preservados nos JPGs originais: IMG_1986 traz “Kakao work” e informações da prancha; IMG_1992 traz Adobe Stock #1881037097 e marcas d'água. A licença comercial das fontes não foi fornecida. Os recortes não transferem direitos autorais nem constituem arquivos originais licenciados de bancos de imagem.
