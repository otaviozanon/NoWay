// Regra de ouro: cada palpite deve ser MAIOR que o anterior
// Contestacao: palpite > resposta → desafiado leva | palpite <= resposta → desafiante leva
import { Room, Guess, Card } from "./types";

export function canGuess(room: Room, value: number): boolean {
  if (room.guesses.length === 0) return value > 0;
  const lastGuess = room.guesses[room.guesses.length - 1];
  return value > lastGuess.value;
}

export function addGuess(room: Room, playerId: string, value: number): Room {
  if (!canGuess(room, value)) {
    throw new Error("Palpite deve ser maior que o anterior");
  }
  const guess: Guess = { playerId, value };
  return {
    ...room,
    guesses: [...room.guesses, guess],
    currentPlayerIndex: getNextPlayerIndex(room.players.length, room.currentPlayerIndex),
  };
}

export function resolveContest(
  room: Room,
  challengerId: string,
  challengedId: string,
  card: Card,
  questionIndex: number,
): { loserId: string; card: Card } {
  const answer = card.questions[questionIndex].answer;
  const guess = room.guesses[room.guesses.length - 1];
  if (guess.value > answer) {
    return { loserId: challengedId, card };
  }
  return { loserId: challengerId, card };
}

export function getNextPlayerIndex(totalPlayers: number, currentIndex: number): number {
  return (currentIndex + 1) % totalPlayers;
}

export function setQuestionNumber(questionNumber: number): number {
  if (questionNumber < 1 || questionNumber > 6) {
    throw new Error("Numero da pergunta deve ser entre 1 e 6");
  }
  return questionNumber;
}

export function getLastGuess(room: Room): Guess | undefined {
  return room.guesses[room.guesses.length - 1];
}
