import { describe, it, expect } from "vitest";
import { calculateScore, determineLoser } from "@/game-engine/scoring";
import { Player, Card } from "@/game-engine/types";

const makeCard = (pato: number): Card => ({ id: 1, theme: "T", patoPoints: pato, questions: [] });

describe("calculateScore", () => {
  const p: Player = { id: "1", name: "A", cards: [makeCard(2), makeCard(3)], dobreiCards: 0, connected: true };
  it("basic: counts cards", () => expect(calculateScore(p, "basic")).toBe(2));
  it("advanced: counts patoPoints", () => expect(calculateScore(p, "advanced")).toBe(5));
  it("subtracts dobreiCards", () => {
    const pd = { ...p, dobreiCards: 1 };
    expect(calculateScore(pd, "advanced")).toBe(4);
  });
  it("no negative", () => {
    const pn = { ...p, dobreiCards: 10 };
    expect(calculateScore(pn, "advanced")).toBe(0);
  });
});

describe("determineLoser", () => {
  it("finds highest score player", () => {
    const players: Player[] = [
      { id: "1", name: "A", cards: [makeCard(2)], dobreiCards: 0, connected: true },
      { id: "2", name: "B", cards: [makeCard(2), makeCard(2)], dobreiCards: 0, connected: true },
      { id: "3", name: "C", cards: [], dobreiCards: 0, connected: true },
    ];
    const { loser, isTie } = determineLoser(players, "basic");
    expect(loser.name).toBe("B");
    expect(isTie).toBe(false);
  });

  it("true tie when same cards and patoPoints", () => {
    const c = makeCard(3);
    const players: Player[] = [
      { id: "1", name: "A", cards: [c], dobreiCards: 0, connected: true },
      { id: "2", name: "B", cards: [c], dobreiCards: 0, connected: true },
    ];
    const { isTie } = determineLoser(players, "advanced");
    expect(isTie).toBe(true);
  });
});
