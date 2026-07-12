// Orquestracao do jogo: iniciar, avancar rodadas, distribuir cartas, verificar fim
// 10 rodadas por partida. Cartas Dobrei anulam Pontos de Pato na contagem final.
import { Room, Card, Player, GameResult } from "./types";
import { buildGameResult } from "./scoring";

export function startGame(room: Room): Room {
  if (room.players.length < 2) throw new Error("Minimo de 2 jogadores");
  return { ...room, status: "playing", currentRound: 1, currentCardIndex: 0, currentPlayerIndex: 0, guesses: [] };
}

export function isGameOver(room: Room): boolean {
  return room.currentRound > 10;
}

export function getLoserCards(room: Room): GameResult {
  return buildGameResult(room.players, room.ruleSet);
}

export function endRound(room: Room, loserId: string, card: Card): Room {
  const updatedPlayers = room.players.map((p) =>
    p.id === loserId ? { ...p, cards: [...p.cards, card] } : p,
  );
  return {
    ...room,
    players: updatedPlayers,
    guesses: [],
    currentCardIndex: room.currentCardIndex + 1,
    currentRound: room.currentRound + 1,
    usedCardIds: [...room.usedCardIds, card.id],
    currentPlayerIndex: 0,
    activeContest: undefined,
  };
}

export function addCardToPlayer(room: Room, playerId: string, card: Card): Room {
  return {
    ...room,
    players: room.players.map((p) =>
      p.id === playerId ? { ...p, cards: [...p.cards, card] } : p,
    ),
  };
}

export function addDobreiCard(room: Room, playerId: string): Room {
  return {
    ...room,
    players: room.players.map((p) =>
      p.id === playerId ? { ...p, dobreiCards: p.dobreiCards + 1 } : p,
    ),
  };
}

export function setContestWinnerAsInitialPlayer(room: Room, winnerId: string): Room {
  const winnerIndex = room.players.findIndex((p) => p.id === winnerId);
  return { ...room, currentPlayerIndex: winnerIndex >= 0 ? winnerIndex : 0 };
}
