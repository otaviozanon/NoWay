"use client";

import { memo } from "react";
import { useGameStore } from "@/lib/store";
import CardDisplay from "./card-display";
import GuessSection from "./guess-section";
import GameResultDisplay from "./game-result";

function Icon({ d, size = 16 }: { d: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d={d} />
    </svg>
  );
}

const MessageIcon = "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z";
const ClockIcon = "M12 2v4 M12 22v-2 M4.93 4.93l2.83 2.83 M16.24 16.24l2.83 2.83 M2 12h4 M22 12h-2 M4.93 19.07l2.83-2.83 M16.24 7.76l2.83-2.83 M12 6a6 6 0 1 0 0 12 6 6 0 0 0 0-12z M12 10v4 M12 14l2 2";
const UsersIcon = "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2 M22 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75 M8 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8z";

function GameBoard() {
  const { room, myPlayerId, gameResult } = useGameStore();

  if (gameResult && room) {
    return <GameResultDisplay result={gameResult} ruleSet={room.ruleSet} />;
  }

  if (!room || room.status !== "playing") return null;

  const card = room.deck[room.currentCardIndex];
  if (!card) return <div className="text-center py-12 text-text-muted"><p className="text-lg">Sem mais cartas</p></div>;

  const currentPlayer = room.players[room.currentPlayerIndex];
  const isMyTurn = currentPlayer?.id === myPlayerId;
  const questionIndex = 0;
  const isChallengedInQuerApostar = room.activeContest?.challengedId === myPlayerId;
  const hasActiveContest = !!room.activeContest && !room.activeContest.querApostar;

  return (
    <div className="space-y-6">
      <CardDisplay card={card} questionIndex={questionIndex} round={room.currentRound} />

      {room.guesses.length > 0 ? (
        <div className="space-y-2 animate-fade-in">
          <div className="flex items-center gap-2 text-sm text-text-muted mb-1">
            <Icon d={MessageIcon} size={14} />Historico de palpites
          </div>
          {room.guesses.map((g, i) => (
            <div key={i} className="flex justify-between items-center px-4 py-3 rounded-xl bg-surface-raised border border-white/5 transition-all duration-200">
              <span className="text-text-secondary text-sm">{room.players.find((p) => p.id === g.playerId)?.name}</span>
              <span className="font-mono text-text-primary font-bold text-lg tabular-nums">{g.value}</span>
            </div>
          ))}
        </div>
      ) : null}

      <div className="flex items-center justify-center gap-2 py-4">
        <Icon d={ClockIcon} size={16} />
        <span className="text-text-secondary text-sm">Turno de </span>
        <span className={`font-semibold text-lg ${isMyTurn ? "text-brand-light" : "text-text-primary"}`}>
          {currentPlayer?.name}{isMyTurn ? " (voce)" : ""}
        </span>
      </div>

      <GuessSection room={room} myPlayerId={myPlayerId} isMyTurn={isMyTurn} hasActiveContest={hasActiveContest} isChallengedInQuerApostar={isChallengedInQuerApostar} />

      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm text-text-muted">
          <Icon d={UsersIcon} size={14} />Jogadores
        </div>
        <div className="grid grid-cols-2 gap-2">
          {room.players.map((p) => {
            const isActive = currentPlayer?.id === p.id;
            return (
              <div key={p.id}
                className={`px-4 py-3 rounded-xl text-sm transition-all duration-300 ${
                  isActive ? "bg-brand-glow border border-brand/30 shadow-[0_0_12px_rgba(249,115,22,0.1)]" : "bg-surface-raised border border-white/5"
                }`}>
                <div className="flex justify-between items-center">
                  <span className={`truncate font-medium ${isActive ? "text-brand-light" : "text-text-primary"}`}>{p.name}</span>
                  <span className={`text-xs font-mono ml-2 tabular-nums ${isActive ? "text-brand-light" : "text-text-muted"}`}>
                    {p.cards.length}c{p.dobreiCards > 0 ? <span className="text-accent-success ml-1">-{p.dobreiCards}</span> : null}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default memo(GameBoard);
