

# Refazer Pagina "Jogar contra o Computador"

## Problema Atual

A pagina tem varios problemas de layout:

1. **Desktop**: A sidebar e muito alta e nao cabe no viewport, gerando barras de scroll
2. **Mobile**: O tabuleiro placeholder some e so aparece a sidebar em coluna infinita
3. **Layout rigido**: Larguras fixas (`w-[320px]`, `w-[500px]`) nao se adaptam
4. **TimeControlSelector**: Ocupa espaco demais com 3 categorias em blocos separados
5. **Bot info card + bot list + time controls + color selector + piece theme + play button** = conteudo demais para caber sem scroll

## Solucao

Redesenhar o layout com uma abordagem "viewport-first" que garante que tudo cabe na tela sem scroll, tanto em desktop quanto mobile.

### Estrategia Principal

- **Desktop**: Layout horizontal (tabuleiro + sidebar), ambos com altura limitada ao viewport
- **Mobile**: Layout vertical com tabuleiro menor no topo e sidebar compacta abaixo, com scroll apenas no body
- **Sidebar mais compacta**: Usar tabs para separar "Config" e "Bots", economizando espaco vertical
- **TimeControlSelector**: Layout em grid mais compacto (todos os controles em uma unica grid sem headers de categoria)

## Alteracoes

### 1. `src/pages/PlayComputer.jsx`
- Usar `h-[calc(100vh-64px)]` com `overflow-hidden` no desktop
- No mobile, permitir scroll natural do body
- Tabuleiro com tamanho responsivo usando `min()` ou clamp via Tailwind
- Remover larguras fixas, usar `flex` com `max-w` para adaptabilidade
- Centralizar verticalmente o conteudo no desktop

### 2. `src/components/PlayComputer/GameSetupSidebar.jsx`
- Reorganizar em layout mais compacto:
  - Bot selecionado: card menor (padding reduzido, sem mensagem por padrao)
  - Cor + Tempo: lado a lado ou em grid compacta
  - Bot list: area com scroll proprio, altura dinamica (`flex-1 overflow-y-auto`)
  - Remover secao "Tema das Pecas" (mover para Settings ou deixar como icone)
- Usar `max-h-[calc(100vh-80px)]` com `flex flex-col` para que o conteudo se distribua
- No mobile: `w-full` em vez de `w-[320px]`

### 3. `src/components/PlayComputer/TimeControlSelector.jsx`
- Compactar para um unico grid sem headers de categoria
- Usar chips/pills menores em vez de botoes grandes
- Grid de 5 colunas mostrando os controles mais populares, com botao "mais" para expandir

### 4. `src/components/PlayComputer/ColorSelector.jsx`
- Reduzir padding dos botoes (`p-2` em vez de `p-3`)
- Icones menores (`text-xl` em vez de `text-2xl`)

### 5. `src/components/PlayComputer/BotCatalog.jsx`
- Itens mais compactos (`p-2` em vez de `p-3`, avatar menor)
- Scroll proprio controlado pelo parent

### 6. `src/components/PlayComputer/GameSidebar.jsx` (durante jogo)
- Remover altura fixa `h-[650px]`
- Usar `h-full` ou `max-h-[calc(100vh-80px)]` com flex
- No mobile: `w-full`

## Detalhes Tecnicos

| Arquivo | Tipo | Descricao |
|---------|------|-----------|
| `src/pages/PlayComputer.jsx` | Edicao | Layout responsivo viewport-first, sem overflow |
| `src/components/PlayComputer/GameSetupSidebar.jsx` | Edicao | Sidebar compacta com flex-col e scroll apenas na lista de bots |
| `src/components/PlayComputer/TimeControlSelector.jsx` | Edicao | Grid unica mais compacta sem headers de categoria |
| `src/components/PlayComputer/ColorSelector.jsx` | Edicao | Botoes menores |
| `src/components/PlayComputer/BotCatalog.jsx` | Edicao | Items mais compactos |
| `src/components/PlayComputer/GameSidebar.jsx` | Edicao | Remover altura fixa, responsivo |
| `src/components/PlayComputer/ChessBoardGame.jsx` | Edicao | Tamanho responsivo adaptavel ao viewport |

## Resultado Esperado

- **Desktop 1920x1080**: Tabuleiro grande a esquerda, sidebar compacta a direita, sem scroll
- **Desktop 1366x768**: Tudo visivel sem scroll, tamanhos reduzidos proporcionalmente
- **Mobile 390x844**: Tabuleiro compacto no topo, sidebar compacta abaixo com scroll natural
- Zero barras de scroll internas (exceto lista de bots quando expandida)

