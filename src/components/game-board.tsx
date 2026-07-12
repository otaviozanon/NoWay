"use client";

import { memo, useEffect, useState } from "react";
import { useGameStore } from "@/lib/store";
import CardDisplay from "./card-display";
import GuessSection from "./guess-section";
import GameResultDisplay from "./game-result";
import { MessageCircle, Clock, Users, X, AlertTriangle, Zap } from "lucide-react";

function GameBoard() {
  const { room, myPlayerId, gameResult } = useGameStore();
  const [toast, setToast] = useState<{ message: string; type: string } | null>(null);

  useEffect(() => {
    if (room?.lastEvent) {
      setToast({ message: room.lastEvent.message, type: room.lastEvent.type });
      const timer = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [room?.lastEvent]);

  if (gameResult && room) {
    return (
      <>
        <GameResultDisplay
          result={gameResult}
          ruleSet={room.ruleSet}
          myPlayerId={myPlayerId}
          playAgainVotes={room.playAgainVotes || []}
          players={room.players.map(p => ({ id: p.id, name: p.name }))}
        />
        {toast ? <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} /> : null}
      </>
    );
  }

  if (!room || room.status !== "playing") return null;

  const card = room.deck[room.currentCardIndex];
  if (!card) return <div className="text-center py-12 text-text-muted"><p className="text-lg">Sem mais cartas</p></div>;

  const currentPlayer = room.players[room.currentPlayerIndex];
  const isMyTurn = currentPlayer?.id === myPlayerId;
  const isChallengedInQuerApostar = room.activeContest?.challengedId === myPlayerId && !room.activeContest?.querApostar;
  const hasActiveContest = !!room.activeContest && !room.activeContest.querApostar;

  return (
    <div className="space-y-6">
      {toast ? <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} /> : null}

      <CardDisplay card={card} questionIndex={0} round={room.currentRound} />

      {room.guesses.length > 0 ? (
        <div className="space-y-2 animate-fade-in">
          <div className="flex items-center gap-2 text-sm text-text-muted mb-1"><MessageCircle size={14} />Historico de palpites</div>
          {room.guesses.map((g, i) => (
            <div key={i} className="flex justify-between items-center px-4 py-3 rounded-xl bg-surface-raised border border-white/5">
              <span className="text-text-secondary text-sm">{room.players.find((p) => p.id === g.playerId)?.name}</span>
              <span className="font-mono text-text-primary font-bold text-lg tabular-nums">{g.value}</span>
            </div>
          ))}
        </div>
      ) : null}

      <div className="flex items-center justify-center gap-2 py-4">
        <Clock size={16} className="text-text-muted" />
        <span className="text-text-secondary text-sm">Turno de </span>
        <span className={`font-semibold text-lg ${isMyTurn ? "text-brand-light" : "text-text-primary"}`}>{currentPlayer?.name}{isMyTurn ? " (voce)" : ""}</span>
      </div>

      <GuessSection room={room} myPlayerId={myPlayerId} isMyTurn={isMyTurn} hasActiveContest={hasActiveContest} isChallengedInQuerApostar={isChallengedInQuerApostar} />

      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm text-text-muted"><Users size={14} />Jogadores</div>
        <div className="grid grid-cols-2 gap-2">
          {room.players.map((p) => {
            const isActive = currentPlayer?.id === p.id;
            return (
              <div key={p.id} className={`px-4 py-3 rounded-xl text-sm transition-all duration-300 ${isActive ? "bg-brand-glow border border-brand/30 shadow-[0_0_12px_rgba(249,115,22,0.1)]" : "bg-surface-raised border border-white/5"}`}>
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

function Toast({ message, type, onClose }: { message: string; type: string; onClose: () => void }) {
  const Icon = type === "dobrei" ? Zap : type === "naMosca" ? AlertTriangle : MessageCircle;
  const color = type === "dobrei" ? "border-accent-success/20 bg-accent-success/5" : type === "naMosca" ? "border-accent-warning/20 bg-accent-warning/5" : "border-accent-danger/20 bg-accent-danger/5";
  return (
    <div className={`fixed top-4 left-4 right-4 z-50 flex items-center gap-3 px-5 py-4 rounded-xl border ${color} shadow-lg animate-slide-up max-w-md mx-auto`}>
      <Icon size={20} className="text-brand-light" />
      <p className="flex-1 text-sm text-text-primary">{message}</p>
      <button onClick={onClose} className="p-1 rounded-lg hover:bg-surface-card"><X size={16} /></button>
    </div>
  );
}

export default memo(GameBoard);
