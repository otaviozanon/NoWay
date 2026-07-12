import { describe, it, expect } from "vitest";
import { canGuess, addGuess, resolveContest } from "@/game-engine/round";
import { Card, Room } from "@/game-engine/types";
import { createRoom, joinRoom } from "@/game-engine/room";
import { startGame } from "@/game-engine/game";

const card: Card = { id: 1, theme: "T", patoPoints: 2, questions: [{ text: "Q", answer: 50 }] };

function room(): Room {
  return startGame(joinRoom(createRoom("h", "basic"), "p2"));
}

describe("canGuess", () => {
  it("allows guess > previous", () => {
    const r = { ...room(), guesses: [{ playerId: "p1", value: 5 }] };
    expect(canGuess(r, 10)).toBe(true);
  });

  it("rejects guess <= previous", () => {
    const r = { ...room(), guesses: [{ playerId: "p1", value: 5 }] };
    expect(canGuess(r, 5)).toBe(false);
    expect(canGuess(r, 3)).toBe(false);
  });

  it("allows any positive when no guesses", () => {
    expect(canGuess(room(), 1)).toBe(true);
  });
});

describe("addGuess", () => {
  it("adds guess and advances player", () => {
    const r = addGuess(room(), "p1", 15);
    expect(r.guesses).toHaveLength(1);
    expect(r.guesses[0].value).toBe(15);
    expect(r.currentPlayerIndex).toBe(1);
  });

  it("throws on invalid guess", () => {
    const r = { ...room(), guesses: [{ playerId: "p1", value: 10 }] };
    expect(() => addGuess(r, "p2", 5)).toThrow();
  });
});

describe("resolveContest", () => {
  it("loser is challenged if guess > answer", () => {
    const r = { ...room(), guesses: [{ playerId: "p1", value: 100 }] };
    const result = resolveContest(r, "p2", "p1", card, 0);
    expect(result.loserId).toBe("p1");
  });

  it("loser is challenger if guess <= answer", () => {
    const r = { ...room(), guesses: [{ playerId: "p1", value: 30 }] };
    const result = resolveContest(r, "p2", "p1", card, 0);
    expect(result.loserId).toBe("p2");
  });
});
