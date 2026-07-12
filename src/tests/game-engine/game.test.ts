import { describe, it, expect } from "vitest";
import { startGame, isGameOver, endRound } from "@/game-engine/game";
import { createRoom, joinRoom } from "@/game-engine/room";

describe("startGame", () => {
  it("changes status to playing", () => {
    const room = startGame(joinRoom(createRoom("h", "basic"), "p2"));
    expect(room.status).toBe("playing");
  });

  it("throws with < 2 players", () => {
    expect(() => startGame(createRoom("h", "basic"))).toThrow("Minimo");
  });
});

describe("isGameOver", () => {
  it("true after round 10", () => {
    const room = startGame(joinRoom(createRoom("h", "basic"), "p2"));
    expect(isGameOver(room)).toBe(false);
    expect(isGameOver({ ...room, currentRound: 11 })).toBe(true);
  });
});

describe("endRound", () => {
  it("resets guesses and advances round", () => {
    const room = startGame(joinRoom(createRoom("h", "basic"), "p2"));
    const card = room.deck[0];
    const withGuesses = { ...room, guesses: [{ playerId: "x", value: 10 }] };
    const ended = endRound(withGuesses, room.players[0].id, card);
    expect(ended.guesses).toHaveLength(0);
    expect(ended.currentRound).toBe(2);
    expect(ended.currentCardIndex).toBe(1);
  });
});
