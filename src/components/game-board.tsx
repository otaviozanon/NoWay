"use client";

import { memo, useEffect, useState } from "react";
import { useGameStore } from "@/lib/store";
import CardDisplay from "./card-display";
import GuessSection from "./guess-section";
import GameResultDisplay from "./game-result";
import { MessageCircle, Clock, Users, X, AlertTriangle, Zap, Swords } from "lucide-react";

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
        <GameResultDisplay result={gameResult} ruleSet={room.ruleSet} myPlayerId={myPlayerId} playAgainVotes={room.playAgainVotes || []} players={room.players.map(p => ({ id: p.id, name: p.name }))} />
        {toast ? <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} /> : null}
      </>
    );
  }

  if (!room || room.status !== "playing") return null;

  const card = room.deck[room.currentCardIndex];
  if (!card) return <div className="text-center py-20 text-text-muted"><p className="text-xl font-bold">Sem mais cartas!</p></div>;

  const currentPlayer = room.players[room.currentPlayerIndex];
  const isMyTurn = currentPlayer?.id === myPlayerId;
  const isChallenged = room.activeContest?.challengedId === myPlayerId && !room.activeContest?.querApostar;
  const hasActiveContest = !!room.activeContest && !room.activeContest.querApostar;

  return (
    <div className="space-y-5">
      {toast ? <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} /> : null}

      <CardDisplay card={card} questionIndex={0} round={room.currentRound} />

      {room.guesses.length > 0 ? (
        <div className="space-y-1.5 animate-fade-in">
          <div className="flex items-center gap-2 text-xs text-text-muted font-medium uppercase tracking-wider mb-1">
            <MessageCircle size={12} />Palpites
          </div>
          <div className="flex flex-wrap gap-1.5">
            {room.guesses.map((g, i) => (
              <div key={i} className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-surface-raised border border-white/5">
                <span className="text-text-muted text-xs">{room.players.find((p) => p.id === g.playerId)?.name}</span>
                <span className="font-mono text-text-primary font-bold text-sm tabular-nums">{g.value}</span>
                {i < room.guesses.length - 1 ? <span className="text-text-muted text-xs">&gt;</span> : null}
              </div>
            ))}
          </div>
        </div>
      ) : null}

      <div className="flex items-center justify-center gap-2 py-2">
        <div className={`w-2 h-2 rounded-full animate-pulse ${isMyTurn ? "bg-brand shadow-[0_0_8px_rgba(249,115,22,0.5)]" : "bg-text-muted"}`} />
        <span className="text-text-secondary text-sm">Turno de </span>
        <span className={`font-bold text-base ${isMyTurn ? "text-brand-light" : "text-text-primary"}`}>
          {currentPlayer?.name}{isMyTurn ? " (voce)" : ""}
        </span>
      </div>

      <GuessSection room={room} myPlayerId={myPlayerId} isMyTurn={isMyTurn} hasActiveContest={hasActiveContest} isChallengedInQuerApostar={isChallenged} />

      <div className="space-y-2">
        <div className="flex items-center gap-2 text-xs text-text-muted font-medium uppercase tracking-wider">
          <Users size={12} />Jogadores
        </div>
        <div className="grid grid-cols-2 gap-2">
          {room.players.map((p) => {
            const isActive = currentPlayer?.id === p.id;
            return (
              <div key={p.id} className={`px-3.5 py-3 rounded-xl text-sm transition-all duration-300 ${
                isActive ? "bg-brand/5 border border-brand/20 shadow-[0_0_16px_rgba(249,115,22,0.08)]" : "bg-surface-raised border border-white/5"
              }`}>
                <div className="flex items-center justify-between gap-1">
                  <span className={`truncate font-semibold text-xs ${isActive ? "text-brand-light" : "text-text-primary"}`}>
                    {p.name}
                  </span>
                  <div className="flex items-center gap-1 shrink-0">
                    {p.dobreiCards > 0 ? (
                      <span className="inline-flex items-center justify-center w-5 h-5 rounded-md bg-accent-success/20 border border-accent-success/30 text-accent-success text-[10px] font-bold">
                        {p.dobreiCards}
                      </span>
                    ) : null}
                    <span className={`text-xs font-mono tabular-nums ${isActive ? "text-brand-light" : "text-text-muted"}`}>
                      {p.cards.length}
                      <span className="text-[10px] ml-0.5">c</span>
                    </span>
                  </div>
                </div>
                {p.cards.length > 0 ? (
                  <div className="flex gap-0.5 mt-1.5">
                    {p.cards.slice(0, 5).map((_, ci) => (
                      <div key={ci} className={`flex-1 h-1 rounded-full ${isActive ? "bg-brand/30" : "bg-white/5"}`} />
                    ))}
                    {p.cards.length > 5 ? <span className="text-[9px] text-text-muted ml-0.5">+{p.cards.length - 5}</span> : null}
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function Toast({ message, type, onClose }: { message: string; type: string; onClose: () => void }) {
  const Icon = type === "dobrei" ? Zap : type === "naMosca" ? AlertTriangle : Swords;
  const colorMap = { dobrei: "border-accent-success/30 bg-accent-success/5", naMosca: "border-accent-warning/30 bg-accent-warning/5" };
  const color = colorMap[type as keyof typeof colorMap] || "border-accent-danger/30 bg-accent-danger/5";

  return (
    <div className={`fixed top-4 left-4 right-4 z-50 animate-slide-up`}>
      <div className={`flex items-center gap-3 px-5 py-4 rounded-2xl border ${color} shadow-2xl backdrop-blur-xl max-w-md mx-auto`}>
        <div className="w-10 h-10 rounded-xl bg-surface-card flex items-center justify-center shrink-0">
          <Icon size={20} className={type === "dobrei" ? "text-accent-success" : type === "naMosca" ? "text-accent-warning" : "text-accent-danger"} />
        </div>
        <p className="flex-1 text-sm text-text-primary font-medium">{message}</p>
        <button onClick={onClose} className="p-2 rounded-lg hover:bg-surface-card transition-colors"><X size={14} /></button>
      </div>
    </div>
  );
}

export default memo(GameBoard);
