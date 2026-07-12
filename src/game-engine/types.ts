// Tipos do jogo:
// Card = carta de tema com 30 perguntas e 2-3 Pontos de Pato
// Room = sala com jogadores, deck, palpites, estado da rodada
// activeContest = estado da contestacao em andamento (modo avancado)
// lastEvent = feedback visual da ultima acao (toast + resposta correta)
export interface Question {
  text: string;
  answer: number;
}

export interface Card {
  id: number;
  theme: string;
  patoPoints: number;
  questions: Question[];
}

export interface Player {
  id: string;
  name: string;
  cards: Card[];
  dobreiCards: number;
  connected: boolean;
}

export interface Guess {
  playerId: string;
  value: number;
}

export type RoomStatus = "waiting" | "playing" | "finished";
export type RuleSet = "basic" | "advanced";

export interface Room {
  id: string;
  host: string;
  players: Player[];
  status: RoomStatus;
  deck: Card[];
  currentCardIndex: number;
  currentRound: number;
  currentPlayerIndex: number;
  guesses: Guess[];
  usedCardIds: number[];
  ruleSet: RuleSet;
  activeContest?: {
    challengerId: string;
    challengedId: string;
    guessValue: number;
    querApostar?: boolean;
  };
  playAgainVotes: string[];
  lastEvent?: {
    type: "contest" | "naMosca" | "dobrei";
    message: string;
    playerId: string;
    answer?: number;
  };
}

export interface RoundResult {
  card: Card;
  round: number;
  loser: string;
  reason: "contest" | "naMosca";
}

export interface GameResult {
  players: Player[];
  loser: Player;
  isTie: boolean;
}
