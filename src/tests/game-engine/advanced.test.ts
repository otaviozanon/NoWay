import { describe, it, expect } from "vitest";
import { qualifiesForDobrei, handleQuerApostar, handleNaMosca } from "@/game-engine/advanced";
import { Card, Room } from "@/game-engine/types";
import { createRoom, joinRoom } from "@/game-engine/room";
import { startGame } from "@/game-engine/game";

const card: Card = { id: 1, theme: "T", patoPoints: 2, questions: [{ text: "Q", answer: 50 }] };

function room(): Room {
  return startGame(joinRoom(createRoom("h", "advanced"), "p2"));
}

describe("qualifiesForDobrei", () => {
  it("true when 2x", () => {
    const r = { ...room(), guesses: [{ playerId: "p1", value: 10 }] };
    expect(qualifiesForDobrei(r, 20)).toBe(true);
  });
  it("false when not 2x", () => {
    const r = { ...room(), guesses: [{ playerId: "p1", value: 10 }] };
    expect(qualifiesForDobrei(r, 19)).toBe(false);
  });
  it("false when no previous", () => {
    expect(qualifiesForDobrei(room(), 10)).toBe(false);
  });
});

describe("handleQuerApostar", () => {
  it("returns 2 cards when challenger keeps", () => {
    expect(handleQuerApostar(room(), true).cardCount).toBe(2);
  });
  it("returns 1 card when challenger backs down", () => {
    expect(handleQuerApostar(room(), false).cardCount).toBe(1);
  });
});

describe("handleNaMosca", () => {
  it("naMosca true when exact", () => {
    const r = { ...room(), guesses: [{ playerId: "p1", value: 50 }] };
    const result = handleNaMosca(r, card, 0);
    expect(result.naMosca).toBe(true);
  });

  it("naMosca false and returns all cards", () => {
    const r = { ...room(), guesses: [{ playerId: "p1", value: 99 }], deck: [card, card, card] };
    const result = handleNaMosca(r, card, 0);
    expect(result.naMosca).toBe(false);
    expect(result.allCards).toHaveLength(3);
  });
});
