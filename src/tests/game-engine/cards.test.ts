import { describe, it, expect } from "vitest";
import { cards } from "@/cards/data";

describe("Card data validation", () => {
  it("should have exactly 80 cards", () => {
    expect(cards).toHaveLength(80);
  });

  it("cards 1-50 should have 16 questions, cards 51-80 should have 6", () => {
    for (const card of cards) {
      if (card.id <= 50) {
        expect(card.questions, `Card ${card.id}: ${card.theme}`).toHaveLength(16);
      } else {
        expect(card.questions, `Card ${card.id}: ${card.theme}`).toHaveLength(6);
      }
    }
  });

  it("each question should have a numeric answer", () => {
    for (const card of cards) {
      for (const q of card.questions) {
        expect(typeof q.answer, `Card ${card.id}: ${q.text}`).toBe("number");
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
    expect(new Set(ids).size).toBe(80);
  });

  it("each card should have a theme name", () => {
    for (const card of cards) {
      expect(typeof card.theme).toBe("string");
      expect(card.theme.length).toBeGreaterThan(0);
    }
  });

  it("should have 980 questions total (50x16 + 30x6)", () => {
    const total = cards.reduce((sum, c) => sum + c.questions.length, 0);
    expect(total).toBe(980);
  });
});
