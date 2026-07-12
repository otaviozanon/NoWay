# Nem a Pato! - Design Spec

**Data:** 2026-07-11
**Status:** Aprovado
**Stack:** Next.js 14 (App Router) + TypeScript + Socket.IO + Tailwind CSS

---

## 1. Visao Geral

Versao digital multiplayer online do jogo de tabuleiro "Nem a Pato!" (How Dare You). Jogadores entram em salas, respondem perguntas numericas com palpites e blefes. O jogador com mais cartas no final **perde**. Suporte completo as regras basicas e avancadas.

---

## 2. Regras do Jogo (referencia)

### Regras Basicas
- 50 Cartas de Tema, cada uma com 6 perguntas numericas
- Jogador inicial diz um numero de 1 a 6 e le a pergunta correspondente
- Turnos em sentido horario: cada jogador diz um palpite (numero inteiro) **maior** que o anterior
- A qualquer momento, um jogador pode contestar dizendo "Nem a Pato!"
- **Palpite > resposta:** desafiado leva a carta
- **Palpite <= resposta:** desafiante leva a carta
- 10 rodadas. Quem tiver **mais cartas PERDE**. Empate → desempata por Pontos de Pato.

### Regras Avancadas
| Regra | Descricao |
|-------|-----------|
| **Pontos de Pato** | Contam-se pontos de pato nas cartas (2 ou 3 por carta) ao inves da quantidade de cartas |
| **Quer Apostar?** | Ao ser contestado, pode intimidar o desafiante. Se ele mantiver, quem perder leva a carta da rodada + a proxima da pilha |
| **Dobrei** | Palpite >= 2x o anterior → ganha 1 Carta Dobrei (anula 1 Ponto de Pato). Perde se o palpite for incorreto. |
| **Na Mosca** | Se achar que o palpite anterior e exatamente a resposta, pode arriscar. Acertou → ninguem ganha carta. Errou → leva TODAS as cartas da pilha e perde. |

---

## 3. Arquitetura

```
Navegador (React + Socket.IO client)
    |  REST + WebSocket
Servidor Next.js
    |-- /api/room/       -> REST: criar/entrar/sair sala
    |-- /api/cards/      -> REST: listar cartas (debug)
    |-- /app/            -> Paginas: home, sala/[id], jogo/[id]
    |-- server.ts        -> Socket.IO: eventos de jogo em tempo real
    |
    +-- game-engine/     -> Logica pura (zero dependencia web)
    +-- cards/           -> 50 cartas em JSON
```

### Stack

| Camada | Tecnologia |
|--------|-----------|
| Framework | Next.js 14 (App Router) |
| Linguagem | TypeScript |
| Tempo real | Socket.IO |
| UI | Tailwind CSS |
| Estado cliente | Zustand |
| Dados | Em memoria + JSON estatico |
| Testes | Vitest + React Testing Library |

---

## 4. Modelo de Dados

```typescript
type Card = {
  id: number;
  theme: string;
  patoPoints: number; // 2 ou 3
  questions: Question[];
}

type Question = {
  text: string;
  answer: number;
}

type Player = {
  id: string;
  name: string;
  cards: Card[];
  dobreiCards: number;
  connected: boolean;
}

type Room = {
  id: string;
  host: string;
  players: Player[];
  status: "waiting" | "playing" | "finished";
  deck: Card[];
  currentCardIndex: number;
  currentRound: number;
  currentPlayerIndex: number;
  guesses: Guess[];
  usedCardIds: number[];
  ruleSet: "basic" | "advanced";
}
```

---

## 5. Telas

| Tela | Descricao |
|------|-----------|
| **Home** | Nome do jogador, criar sala ou entrar com codigo |
| **Sala** | Codigo da sala, lista de jogadores, host inicia partida |
| **Jogo** | Pergunta atual, historico de palpites, botoes de acao (Palpite, Nem a Pato, avancadas) |
| **Resultado** | Placar final, destaque do "Pato da Mesa", botao nova partida |

Responsivo (mobile-first com Tailwind).

---

## 6. Eventos Socket.IO

| Evento (client → server) | Payload |
|--------------------------|---------|
| `room:create` | `{ playerName }` |
| `room:join` | `{ roomId, playerName }` |
| `game:start` | `{ ruleSet }` |
| `game:guess` | `{ value: number }` |
| `game:contest` | `{}` |
| `game:querApostar` | `{}` |
| `game:querApostar:response` | `{ keep: boolean }` |
| `game:naMosca` | `{}` |
| `game:playAgain` | `{}` |

| Evento (server → client) | Payload |
|---------------------------|---------|
| `room:state` | `Room` |
| `game:update` | `Room` (estado completo) |
| `game:roundEnd` | `{ winner, loser, card }` |
| `game:end` | `{ players, loser }` |
| `error` | `{ message }` |

---

## 7. Game Engine (modulos isolados)

```
game-engine/
  deck.ts       -> shuffle, draw, getUsedCards
  round.ts      -> addGuess, getValidGuesses, resolveContest
  scoring.ts    -> calculateScore, determineLoser, tiebreaker
  advanced.ts   -> querApostar, dobreiCheck, naMosca
  room.ts       -> createRoom, joinRoom, removePlayer, transferHost
  game.ts       -> startGame, nextTurn, endGame
```

Cada modulo e uma funcao pura ou classe sem efeitos colaterais. Testavel com Vitest.

---

## 8. Edge Cases & Tratamento de Erros

| Situacao | Comportamento |
|----------|--------------|
| Jogador desconecta | Timeout 60s, remove se nao reconectar. Se era host → transfere. |
| Palpite invalido (<= anterior) | Bloqueado no cliente e servidor |
| Sala cheia (10) | Mensagem de erro |
| Codigo de sala invalido | "Sala nao encontrada" |
| Acao fora de turno | Bloqueado |
| Nome vazio | Validacao cliente + servidor |

---

## 9. Cartas

50 Cartas de Tema com 6 perguntas cada (300 perguntas no total). Dados estaticos em `cards/data.json`. Cada carta:
- Tema (string)
- 6 perguntas com resposta numerica
- Pontos de Pato (2 ou 3)

---

## 10. Fora do Escopo (v2)

- Chat na sala
- Avatar / perfil de jogador
- Cartas customizadas
- Ranking / historico de partidas
- Temporizador por turno

---

## 11. Testes

- **Unitarios**: Todas as funcoes da game-engine (Vitest)
- **Componentes**: RTL para componentes React
- **Integracao**: Socket.IO cliente-servidor simulado
- **Validacao**: 50 cartas, 6 perguntas cada, respostas numericas
