import { Room, Card } from "./types";

export function qualifiesForDobrei(room: Room, newGuessValue: number): boolean {
  const lastGuess = room.guesses[room.guesses.length - 1];
  if (!lastGuess) return false;
  return newGuessValue >= lastGuess.value * 2;
}

export function handleQuerApostar(
  room: Room,
  challengerKeepsContest: boolean,
): { cardCount: number } {
  return { cardCount: challengerKeepsContest ? 2 : 1 };
}

export function handleNaMosca(
  room: Room,
  card: Card,
  questionIndex: number,
): { naMosca: boolean; allCards?: Card[] } {
  const lastGuess = room.guesses[room.guesses.length - 1];
  if (!lastGuess) return { naMosca: false };
  const answer = card.questions[questionIndex].answer;
  if (lastGuess.value === answer) return { naMosca: true };
  const remainingCards: Card[] = [];
  for (let i = room.currentCardIndex; i < room.deck.length; i++) {
    remainingCards.push(room.deck[i]);
  }
  return { naMosca: false, allCards: remainingCards };
}
