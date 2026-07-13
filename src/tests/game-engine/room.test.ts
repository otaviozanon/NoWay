import { describe, it, expect } from "vitest";
import { createRoom, joinRoom, removePlayer, transferHost } from "@/game-engine/room";

describe("createRoom", () => {
  it("creates room with 6-char code", () => {
    const room = createRoom("host", "basic");
    expect(room.id).toHaveLength(6);
    expect(room.host).toBe(room.players[0].id);
    expect(room.players[0].name).toBe("host");
    expect(room.status).toBe("waiting");
    expect(room.deck).toHaveLength(50);
  });
});

describe("joinRoom", () => {
  it("adds player", () => {
    const room = createRoom("host", "basic");
    const updated = joinRoom(room, "guest");
    expect(updated.players).toHaveLength(2);
  });

  it("throws when full", () => {
    let room = createRoom("host", "basic");
    for (let i = 0; i < 14; i++) room = joinRoom(room, `p${i}`);
    expect(room.players).toHaveLength(15);
    expect(() => joinRoom(room, "extra")).toThrow("cheia");
  });

  it("throws when playing", () => {
    const room = createRoom("host", "basic");
    room.status = "playing";
    expect(() => joinRoom(room, "late")).toThrow("andamento");
  });
});

describe("removePlayer", () => {
  it("removes player", () => {
    const room = createRoom("host", "basic");
    const withGuest = joinRoom(room, "guest");
    const guestId = withGuest.players[1].id;
    const removed = removePlayer(withGuest, guestId);
    expect(removed.players).toHaveLength(1);
  });

  it("transfers host if host leaves", () => {
    const room = createRoom("host", "basic");
    const withGuest = joinRoom(room, "guest");
    const hostId = room.players[0].id;
    const removed = removePlayer(withGuest, hostId);
    expect(removed.host).toBe(withGuest.players[1].id);
  });
});
