import { Room, Player, RuleSet } from "./types";
import { shuffleDeck } from "./deck";

function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

function generateRoomCode(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

export function createRoom(playerName: string, ruleSet: RuleSet): Room {
    const playerId = generateId();
  const hostPlayer: Player = {
    id: playerId,
    name: playerName,
    cards: [],
    dobreiCards: 0,
    connected: true,
  };
  return {
    id: generateRoomCode(),
    host: playerId,
    players: [hostPlayer],
    status: "waiting",
    deck: shuffleDeck(),
    currentCardIndex: 0,
    currentRound: 1,
    currentPlayerIndex: 0,
    guesses: [],
    usedCardIds: [],
    ruleSet,
  };
}

export function joinRoom(room: Room, playerName: string): Room {
  if (room.status !== "waiting") throw new Error("Nao e possivel entrar em uma partida em andamento");
  if (room.players.length >= 10) throw new Error("Sala cheia (maximo 10 jogadores)");
  const newPlayer: Player = {
    id: generateId(),
    name: playerName,
    cards: [],
    dobreiCards: 0,
    connected: true,
  };
  return { ...room, players: [...room.players, newPlayer] };
}

export function removePlayer(room: Room, playerId: string): Room {
  const updatedPlayers = room.players.filter((p) => p.id !== playerId);
  let updatedHost = room.host;
  if (room.host === playerId && updatedPlayers.length > 0) {
    updatedHost = updatedPlayers[0].id;
  }
  return { ...room, players: updatedPlayers, host: updatedHost };
}

export function transferHost(room: Room): Room {
  if (room.players.length <= 1) return room;
  const hostIndex = room.players.findIndex((p) => p.id === room.host);
  const nextIndex = (hostIndex + 1) % room.players.length;
  return { ...room, host: room.players[nextIndex].id };
}

export function findPlayer(room: Room, playerId: string): Player | undefined {
  return room.players.find((p) => p.id === playerId);
}

export function isPlayerTurn(room: Room, playerId: string): boolean {
  const currentPlayer = room.players[room.currentPlayerIndex];
  return currentPlayer?.id === playerId;
}

export function setPlayerDisconnected(room: Room, playerId: string): Room {
  return {
    ...room,
    players: room.players.map((p) =>
      p.id === playerId ? { ...p, connected: false } : p,
    ),
  };
}

export function setPlayerReconnected(room: Room, playerId: string): Room {
  return {
    ...room,
    players: room.players.map((p) =>
      p.id === playerId ? { ...p, connected: true } : p,
    ),
  };
}
