import { Server as SocketIOServer, Socket } from "socket.io";
import {
  createRoom, joinRoom, removePlayer, isPlayerTurn,
  setPlayerDisconnected,
} from "@/game-engine/room";
import {
  startGame, endRound, getLoserCards, isGameOver,
  addCardToPlayer, addDobreiCard, setContestWinnerAsInitialPlayer,
} from "@/game-engine/game";
import { addGuess, resolveContest } from "@/game-engine/round";
import { qualifiesForDobrei, handleQuerApostar, handleNaMosca } from "@/game-engine/advanced";
import {
  getRoom, setRoom, deleteRoom,
  mapSocketToPlayer, removeSocketMapping,
  getRoomBySocketId, getPlayerIdBySocketId,
} from "./rooms";
import { Room } from "@/game-engine/types";

export function setupSocket(io: SocketIOServer): void {
  io.on("connection", (socket: Socket) => {

    socket.on("room:create", ({ playerName, ruleSet }: { playerName: string; ruleSet: "basic" | "advanced" }) => {
      if (!playerName?.trim()) { socket.emit("error", { message: "Nome nao pode ser vazio" }); return; }
      const room = createRoom(playerName.trim(), ruleSet || "advanced");
      setRoom(room.id, room);
      const player = room.players[0];
      mapSocketToPlayer(socket.id, room.id, player.id);
      socket.join(room.id);
      socket.emit("player:id", player.id);
      socket.emit("room:state", room);
    });

    socket.on("room:join", ({ roomId, playerName }: { roomId: string; playerName: string }) => {
      const room = getRoom(roomId);
      if (!room) { socket.emit("error", { message: "Sala nao encontrada" }); return; }
      if (!playerName?.trim()) { socket.emit("error", { message: "Nome nao pode ser vazio" }); return; }
      try {
        const updated = joinRoom(room, playerName.trim());
        setRoom(roomId, updated);
        const player = updated.players[updated.players.length - 1];
        mapSocketToPlayer(socket.id, roomId, player.id);
        socket.join(roomId);
        socket.emit("player:id", player.id);
        io.to(roomId).emit("room:state", updated);
      } catch (e: any) {
        socket.emit("error", { message: e.message });
      }
    });

    socket.on("game:start", () => {
      const room = getRoomBySocketId(socket.id);
      if (!room) return;
      const playerId = getPlayerIdBySocketId(socket.id);
      if (room.host !== playerId) {
        socket.emit("error", { message: "Apenas o host pode iniciar" }); return;
      }
      try {
        const started = startGame(room);
        setRoom(room.id, started);
        io.to(room.id).emit("room:state", started);
      } catch (e: any) {
        socket.emit("error", { message: e.message });
      }
    });

    socket.on("game:guess", ({ value }: { value: number }) => {
      const room = getRoomBySocketId(socket.id);
      if (!room || room.status !== "playing") return;
      const playerId = getPlayerIdBySocketId(socket.id);
      if (!playerId || !isPlayerTurn(room, playerId)) {
        socket.emit("error", { message: "Nao e seu turno" }); return;
      }
      try {
        let updated = addGuess(room, playerId, value);
        if (room.ruleSet === "advanced" && qualifiesForDobrei(room, value)) {
          updated = addDobreiCard(updated, playerId);
          const player = updated.players.find(p => p.id === playerId);
          updated = { ...updated, lastEvent: { type: "dobrei", message: `${player?.name} ganhou Dobrei!`, playerId } };
        }
        setRoom(room.id, updated);
        io.to(room.id).emit("room:state", updated);
      } catch (e: any) {
        socket.emit("error", { message: e.message });
      }
    });

    socket.on("game:contest", () => {
      const room = getRoomBySocketId(socket.id);
      if (!room || room.status !== "playing") return;
      const challengerId = getPlayerIdBySocketId(socket.id);
      if (!challengerId) return;
      const lastGuess = room.guesses[room.guesses.length - 1];
      if (!lastGuess) return;
      if (lastGuess.playerId === challengerId) {
        socket.emit("error", { message: "Voce nao pode contestar seu proprio palpite" }); return;
      }
      if (room.ruleSet === "advanced") {
        const updated: Room = {
          ...room,
          activeContest: { challengerId, challengedId: lastGuess.playerId, guessValue: lastGuess.value },
        };
        setRoom(room.id, updated);
        io.to(room.id).emit("room:state", updated);
      } else {
        doResolve(room, challengerId, lastGuess.playerId, io);
      }
    });

    socket.on("game:contest:accept", () => {
      const room = getRoomBySocketId(socket.id);
      if (!room?.activeContest) return;
      const playerId = getPlayerIdBySocketId(socket.id);
      if (playerId !== room.activeContest.challengedId) return;
      doResolve(room, room.activeContest.challengerId, room.activeContest.challengedId, io);
    });

    socket.on("game:querApostar", () => {
      const room = getRoomBySocketId(socket.id);
      if (!room?.activeContest) return;
      const playerId = getPlayerIdBySocketId(socket.id);
      if (playerId !== room.activeContest.challengedId) return;
      const updated: Room = { ...room, activeContest: { ...room.activeContest, querApostar: true } };
      setRoom(room.id, updated);
      io.to(room.id).emit("room:state", updated);
    });

    socket.on("game:querApostar:response", ({ keep }: { keep: boolean }) => {
      const room = getRoomBySocketId(socket.id);
      if (!room?.activeContest?.querApostar) return;
      const playerId = getPlayerIdBySocketId(socket.id);
      if (playerId !== room.activeContest.challengerId) return;

      if (keep) {
        const { cardCount } = handleQuerApostar(room, true);
        doResolve(room, room.activeContest.challengerId, room.activeContest.challengedId, io, cardCount);
      } else {
        const updated: Room = { ...room, activeContest: undefined };
        setRoom(room.id, updated);
        io.to(room.id).emit("room:state", updated);
      }
    });

    socket.on("game:naMosca", () => {
      const room = getRoomBySocketId(socket.id);
      if (!room || room.status !== "playing") return;
      const playerId = getPlayerIdBySocketId(socket.id);
      if (!playerId) return;
      const card = room.deck[room.currentCardIndex];
      if (!card) return;
      const questionIndex = 0;
      const result = handleNaMosca(room, card, questionIndex);
      if (result.naMosca) {
        const player = room.players.find(p => p.id === playerId);
        const updated = {
          ...endRound(room, "", card),
          lastEvent: { type: "naMosca" as const, message: `Na Mosca! Ninguem leva carta.`, playerId },
          playAgainVotes: [],
        };
        setRoom(room.id, updated);
        io.to(room.id).emit("room:state", updated);
        checkGameEnd(updated, io);
      } else {
        let updated = room;
        const player = room.players.find(p => p.id === playerId);
        for (const c of result.allCards || []) {
          updated = addCardToPlayer(updated, playerId, c);
        }
        updated = {
          ...updated,
          status: "finished" as const,
          lastEvent: { type: "naMosca" as const, message: `${player?.name} errou Na Mosca! Levou TODAS!`, playerId },
          playAgainVotes: [],
        };
        setRoom(room.id, updated);
        io.to(room.id).emit("room:state", updated);
        const gameResult = getLoserCards(updated);
        io.to(room.id).emit("game:end", gameResult);
      }
    });

    socket.on("game:playAgain", () => {
      const room = getRoomBySocketId(socket.id);
      if (!room) return;
      const playerId = getPlayerIdBySocketId(socket.id);
      if (!playerId) return;
      const votes = [...new Set([...room.playAgainVotes, playerId])];
      const connectedPlayers = room.players.filter(p => p.connected).length;
      const updated = { ...room, playAgainVotes: votes };
      setRoom(room.id, updated);
      io.to(room.id).emit("room:state", updated);

      if (votes.length >= connectedPlayers && connectedPlayers >= 2) {
        const names = room.players.map((p) => p.name);
        const roomId = room.id;
        deleteRoom(roomId);
        let newRoom = createRoom(names[0], room.ruleSet);
        newRoom.id = roomId;
        setRoom(roomId, newRoom);
        for (const name of names.slice(1)) {
          try {
            const current = getRoom(roomId);
            if (current) {
              const updated = joinRoom(current, name);
              updated.id = roomId;
              setRoom(roomId, updated);
            }
          } catch {}
        }
        const finalRoom = getRoom(roomId);
        if (finalRoom) {
          const started = startGame(finalRoom);
          started.id = roomId;
          setRoom(roomId, started);
          io.to(roomId).emit("room:state", started);
        }
      }
    });

    socket.on("disconnect", () => {
      const mapping = removeSocketMapping(socket.id);
      if (!mapping) return;
      const room = getRoom(mapping.roomId);
      if (!room) return;
      const updated = setPlayerDisconnected(room, mapping.playerId);
      setRoom(mapping.roomId, updated);
      io.to(mapping.roomId).emit("room:state", updated);
      setTimeout(() => {
        const r = getRoom(mapping.roomId);
        if (r) {
          const p = r.players.find((x) => x.id === mapping.playerId);
          if (p && !p.connected) {
            const cleaned = removePlayer(r, mapping.playerId);
            if (cleaned.players.length === 0) deleteRoom(mapping.roomId);
            else { setRoom(mapping.roomId, cleaned); io.to(mapping.roomId).emit("room:state", cleaned); }
          }
        }
      }, 60000);
    });
  });
}

function doResolve(room: Room, challengerId: string, challengedId: string, io: SocketIOServer, extraCards: number = 1): void {
  const card = room.deck[room.currentCardIndex];
  if (!card) return;
  const questionIndex = 0;
  const { loserId } = resolveContest(room, challengerId, challengedId, card, questionIndex);
  let updated = endRound(room, loserId, card);
  updated = setContestWinnerAsInitialPlayer(updated, loserId === challengerId ? challengedId : challengerId);
  for (let i = 0; i < extraCards - 1; i++) {
    const nextCard = updated.deck[updated.currentCardIndex];
    if (nextCard) updated = endRound(updated, loserId, nextCard);
  }
    const loser = updated.players.find(p => p.id === loserId);
    const totalCards = extraCards > 1 ? `${extraCards} cartas` : "1 carta";
  const answer = card.questions[questionIndex].answer;
  updated = {
    ...updated,
    playAgainVotes: [],
    lastEvent: {
      type: "contest",
      message: `${loser?.name || "Alguem"} levou ${totalCards}!`,
      playerId: loserId,
      answer,
    }
  };
  setRoom(room.id, updated);
  io.to(room.id).emit("room:state", updated);
  checkGameEnd(updated, io);
}

function checkGameEnd(room: Room, io: SocketIOServer): void {
  if (isGameOver(room)) {
    const result = getLoserCards(room);
    setRoom(room.id, { ...room, status: "finished" });
    io.to(room.id).emit("game:end", result);
  }
}
