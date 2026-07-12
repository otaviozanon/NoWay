"use client";

import { useGameStore } from "@/lib/store";
import CardDisplay from "./card-display";
import GuessSection from "./guess-section";
import GameResultDisplay from "./game-result";

export default function GameBoard() {
  const { room, myPlayerId, gameResult } = useGameStore();

  if (gameResult && room) {
    return <GameResultDisplay result={gameResult} ruleSet={room.ruleSet} />;
  }

  if (!room || room.status !== "playing") return null;

  const card = room.deck[room.currentCardIndex];
  if (!card) return <p className="text-center text-gray-400 py-8">Sem mais cartas</p>;

  const currentPlayer = room.players[room.currentPlayerIndex];
  const isMyTurn = currentPlayer?.id === myPlayerId;
  const questionIndex = 0;
  const isChallengedInQuerApostar = room.activeContest?.challengedId === myPlayerId;
  const hasActiveContest = !!room.activeContest && !room.activeContest.querApostar;

  return (
    <div className="space-y-6">
      <CardDisplay card={card} questionIndex={questionIndex} round={room.currentRound} />

      {room.guesses.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm text-gray-500">Historico de palpites:</p>
          {room.guesses.map((g, i) => (
            <div key={i} className="flex justify-between items-center p-2 rounded bg-gray-800/50 text-sm">
              <span className="text-gray-300">
                {room.players.find((p) => p.id === g.playerId)?.name}
              </span>
              <span className="font-mono text-white font-bold text-lg">{g.value}</span>
            </div>
          ))}
        </div>
      )}

      <div className="text-center text-sm">
        <span className="text-gray-400">Turno de </span>
        <span className="text-white font-semibold text-lg">
          {currentPlayer?.name}
          {isMyTurn ? " (voce)" : ""}
        </span>
      </div>

      <GuessSection
        room={room}
        myPlayerId={myPlayerId}
        isMyTurn={isMyTurn}
        hasActiveContest={hasActiveContest}
        isChallengedInQuerApostar={isChallengedInQuerApostar}
      />

      <div className="grid grid-cols-2 gap-2">
        {room.players.map((p) => (
          <div
            key={p.id}
            className={`p-3 rounded-lg text-sm transition ${
              currentPlayer?.id === p.id
                ? "bg-purple-900/30 border border-purple-700"
                : "bg-gray-800"
            }`}
          >
            <div className="flex justify-between items-center">
              <span className="truncate">{p.name}</span>
              <span className="text-gray-400 text-xs ml-1">
                {p.cards.length}c
                {p.dobreiCards > 0 && (
                  <span className="text-green-400"> -{p.dobreiCards}</span>
                )}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
