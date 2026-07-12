import { describe, it, expect } from "vitest";
import { cards } from "@/cards/data";

describe("Card data validation", () => {
  it("should have exactly 50 cards", () => {
    expect(cards).toHaveLength(50);
  });

  it("each card should have exactly 30 questions", () => {
    for (const card of cards) {
      expect(card.questions, `Card ${card.id}: ${card.theme}`).toHaveLength(30);
    }
  });

  it("each question should have a numeric integer answer", () => {
    for (const card of cards) {
      for (const q of card.questions) {
        expect(typeof q.answer, `Card ${card.id}: ${q.text}`).toBe("number");
        expect(Number.isInteger(q.answer), `Card ${card.id}: ${q.answer}`).toBe(true);
        expect(q.answer).toBeGreaterThanOrEqual(0);
        expect(typeof q.text).toBe("string");
        expect(q.text.length).toBeGreaterThan(0);
      }
    }
  });

  it("each card should have patoPoints 2 or 3", () => {
    for (const card of cards) {
      expect([2, 3], `Card ${card.id}: ${card.theme}`).toContain(card.patoPoints);
    }
  });

  it("should have unique card IDs", () => {
    const ids = cards.map((c) => c.id);
    expect(new Set(ids).size).toBe(50);
  });

  it("each card should have a theme name", () => {
    for (const card of cards) {
      expect(typeof card.theme).toBe("string");
      expect(card.theme.length).toBeGreaterThan(0);
    }
  });

  it("should have 1500 questions total (50x30)", () => {
    const total = cards.reduce((sum, c) => sum + c.questions.length, 0);
    expect(total).toBe(1500);
  });
});
