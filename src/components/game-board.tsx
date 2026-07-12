"use client";

import { memo, useEffect, useState } from "react";
import { useGameStore } from "@/lib/store";
import CardDisplay from "./card-display";
import GuessSection from "./guess-section";
import GameResultDisplay from "./game-result";
import { MessageCircle, Clock, Users, X, Zap, Swords, Sparkles } from "lucide-react";

function MiniCard({ color = "bg-accent-danger" }: { color?: string }) {
  return (
    <div className={`w-5 h-7 rounded border border-white/10 ${color} rotate-3 shadow-sm`} />
  );
}

function GameBoard() {
  const { room, myPlayerId, gameResult } = useGameStore();
  const [toast, setToast] = useState<{ message: string; type: string } | null>(null);

  useEffect(() => {
    if (room?.lastEvent) {
      setToast({ message: room.lastEvent.message, type: room.lastEvent.type });
      setTimeout(() => setToast(null), 3000);
    }
  }, [room?.lastEvent]);

  if (gameResult && room) {
    return (
      <div className="max-w-lg mx-auto">
        <GameResultDisplay result={gameResult} ruleSet={room.ruleSet} myPlayerId={myPlayerId} playAgainVotes={room.playAgainVotes || []} players={room.players.map(p => ({ id: p.id, name: p.name }))} />
        {toast ? <MiniToast message={toast.message} type={toast.type} onClose={() => setToast(null)} /> : null}
      </div>
    );
  }

  if (!room || room.status !== "playing") return null;

  const card = room.deck[room.currentCardIndex];
  if (!card) return <div className="text-center py-20 text-text-muted font-bold text-xl">Sem mais cartas!</div>;

  const currentPlayer = room.players[room.currentPlayerIndex];
  const isMyTurn = currentPlayer?.id === myPlayerId;
  const isChallenged = room.activeContest?.challengedId === myPlayerId && !room.activeContest?.querApostar;
  const hasActiveContest = !!room.activeContest && !room.activeContest.querApostar;

  return (
    <div className="max-w-lg mx-auto space-y-5">
      {toast ? <MiniToast message={toast.message} type={toast.type} onClose={() => setToast(null)} /> : null}

      <CardDisplay card={card} questionIndex={0} round={room.currentRound} />

      {room.guesses.length > 0 ? (
        <div className="space-y-1.5 animate-fade-in">
          <div className="flex items-center gap-2 text-[10px] text-text-muted font-bold uppercase tracking-widest mb-1">
            <MessageCircle size={11} />Palpites
          </div>
          <div className="flex flex-wrap gap-1.5">
            {room.guesses.map((g, i) => (
              <div key={i} className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-surface-raised border border-white/5 text-xs">
                <span className="text-text-muted">{room.players.find((p) => p.id === g.playerId)?.name}</span>
                <span className="font-mono text-text-primary font-bold tabular-nums">{g.value}</span>
                {i < room.guesses.length - 1 ? <span className="text-text-muted/50">&gt;</span> : null}
              </div>
            ))}
          </div>
        </div>
      ) : null}

      <div className="flex items-center justify-center gap-2 py-2">
        <div className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${isMyTurn ? "bg-brand shadow-[0_0_10px_rgba(249,115,22,0.5)] animate-glow-pulse" : "bg-text-muted/30"}`} />
        <span className="text-text-secondary text-sm">Turno de </span>
        <span className={`font-bold ${isMyTurn ? "text-brand-light text-base" : "text-text-primary"}`}>
          {currentPlayer?.name}{isMyTurn ? " (voce)" : ""}
        </span>
      </div>

      <GuessSection room={room} myPlayerId={myPlayerId} isMyTurn={isMyTurn} hasActiveContest={hasActiveContest} isChallengedInQuerApostar={isChallenged} />

      <div className="space-y-2">
        <div className="flex items-center gap-2 text-[10px] text-text-muted font-bold uppercase tracking-widest">
          <Users size={11} />Jogadores
        </div>
        <div className="grid grid-cols-2 gap-2">
          {room.players.map((p) => {
            const isActive = currentPlayer?.id === p.id;
            const cardColors = ["bg-red-500/30", "bg-orange-500/30", "bg-yellow-500/30", "bg-green-500/30", "bg-blue-500/30", "bg-purple-500/30", "bg-pink-500/30", "bg-cyan-500/30"];
            return (
              <div key={p.id} className={`px-3 py-2.5 rounded-xl transition-all duration-300 ${
                isActive ? "bg-brand/5 border border-brand/20 shadow-[0_0_20px_rgba(249,115,22,0.08)]" : "bg-surface-raised border border-white/5"
              }`}>
                <div className="flex items-center justify-between gap-1 mb-1.5">
                  <span className={`truncate font-bold text-xs ${isActive ? "text-brand-light" : "text-text-primary"}`}>
                    {p.name}
                  </span>
                  <div className="flex items-center gap-1">
                    {p.dobreiCards > 0 ? (
                      <span className="inline-flex items-center justify-center w-5 h-5 rounded-md bg-accent-success/20 border border-accent-success/30 text-accent-success text-[10px] font-black">
                        {p.dobreiCards}
                      </span>
                    ) : null}
                  </div>
                </div>
                {p.cards.length > 0 ? (
                  <div className="flex gap-1 flex-wrap">
                    {p.cards.slice(0, 6).map((c, ci) => (
                      <div key={ci} className={`w-5 h-7 rounded border border-white/10 ${cardColors[ci % cardColors.length]} shadow-sm`}
                           title={c.theme} />
                    ))}
                    {p.cards.length > 6 ? (
                      <span className="text-[10px] text-text-muted font-bold self-end ml-1">+{p.cards.length - 6}</span>
                    ) : null}
                  </div>
                ) : (
                  <div className="h-7 flex items-center text-[10px] text-text-muted italic">Sem cartas</div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function MiniToast({ message, type, onClose }: { message: string; type: string; onClose: () => void }) {
  const Icon = type === "dobrei" ? Zap : type === "naMosca" ? Sparkles : Swords;
  const color = type === "dobrei" ? "border-accent-success/30 bg-accent-success/5 text-accent-success"
    : type === "naMosca" ? "border-accent-warning/30 bg-accent-warning/5 text-accent-warning"
    : "border-accent-danger/30 bg-accent-danger/5 text-accent-danger";

  return (
    <div className="fixed top-4 left-0 right-0 z-50 flex justify-center pointer-events-none">
      <div className={`animate-toast-in pointer-events-auto flex items-center gap-2 px-4 py-2.5 rounded-full border ${color} backdrop-blur-xl shadow-2xl max-w-xs`}>
        <Icon size={14} />
        <p className="text-xs font-bold truncate">{message}</p>
        <button onClick={onClose} className="p-0.5 rounded-full hover:bg-white/5"><X size={12} /></button>
      </div>
    </div>
  );
}

export default memo(GameBoard);
