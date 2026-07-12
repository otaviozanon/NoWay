import { describe, it, expect } from "vitest";
import { shuffleDeck, drawCard, getCurrentCard } from "@/game-engine/deck";
import { cards } from "@/cards/data";

describe("shuffleDeck", () => {
  it("returns 50 cards", () => {
    expect(shuffleDeck()).toHaveLength(50);
  });

  it("does not mutate original cards", () => {
    const original = [...cards].map((c) => c.id);
    shuffleDeck();
    expect(cards.map((c) => c.id)).toEqual(original);
  });
});

describe("drawCard", () => {
  it("returns card at index", () => {
    const deck = shuffleDeck();
    expect(drawCard(deck, 0)).toBe(deck[0]);
  });

  it("returns undefined out of bounds", () => {
    const deck = shuffleDeck();
    expect(drawCard(deck, 50)).toBeUndefined();
  });
});

describe("getCurrentCard", () => {
  it("returns card at index", () => {
    const deck = shuffleDeck();
    expect(getCurrentCard(deck, 5)).toBe(deck[5]);
  });
});
