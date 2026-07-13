"use client";

import { memo, useEffect, useRef, useState, useLayoutEffect } from "react";
import { useGameStore } from "@/lib/store";
import CardDisplay from "./card-display";
import GuessSection from "./guess-section";
import GameResultDisplay from "./game-result";
import { MessageCircle, Users, X, Zap, Sparkles, ShieldAlert } from "lucide-react";
import type { Card } from "@/game-engine/types";

type ResultPhase = "idle" | "showing" | "exiting";

const CARD_ANGLES = [-3, 0, 3];

function GameBoard() {
  const { room, myPlayerId, gameResult } = useGameStore();
  const [toast, setToast] = useState<{ message: string; type: string } | null>(null);
  const [resultPhase, setResultPhase] = useState<ResultPhase>("idle");
  const [resultAnswer, setResultAnswer] = useState<number | null>(null);

  const frozenCard = useRef<Card | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const exitTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastEventRef = useRef<unknown>(null);
  const prevStatusRef = useRef(room?.status);

  useEffect(() => {
    const prevStatus = prevStatusRef.current;
    prevStatusRef.current = room?.status;
    if (room?.status === "playing" && prevStatus === "finished") {
      setResultPhase("idle");
      setResultAnswer(null);
      setToast(null);
      frozenCard.current = null;
      lastEventRef.current = null;
      clearTimeout(toastTimer.current ?? undefined);
      clearTimeout(exitTimer.current ?? undefined);
    }
  }, [room?.status]);

  useLayoutEffect(() => {
    if (!room?.lastEvent) return;
    if (room.lastEvent === lastEventRef.current) return;
    lastEventRef.current = room.lastEvent;

    clearTimeout(toastTimer.current ?? undefined);
    clearTimeout(exitTimer.current ?? undefined);
    setToast({ message: room.lastEvent.message, type: room.lastEvent.type });

    const evt = room.lastEvent as { type: string; message: string; answer?: number };
    const hasAnswer = evt.answer != null;
    const isResultType = evt.type === "contest" || evt.type === "naMosca";

    if (hasAnswer && isResultType) {
      frozenCard.current = room.deck[Math.max(0, room.currentCardIndex - 1)] || null;
      setResultAnswer(evt.answer ?? null);
      setResultPhase("showing");

      toastTimer.current = setTimeout(() => {
        setResultPhase("exiting");
        exitTimer.current = setTimeout(() => {
          setResultPhase("idle");
          setResultAnswer(null);
          frozenCard.current = null;
          setToast(null);
        }, 400);
      }, 7000);
    } else {
      toastTimer.current = setTimeout(() => setToast(null), 4000);
    }
  }, [room?.lastEvent]);

  useEffect(() => {
    return () => {
      clearTimeout(toastTimer.current ?? undefined);
      clearTimeout(exitTimer.current ?? undefined);
    };
  }, []);

  if (gameResult && room) {
    return (
      <div className="max-w-lg mx-auto">
        <GameResultDisplay result={gameResult} ruleSet={room.ruleSet} myPlayerId={myPlayerId} playAgainVotes={room.playAgainVotes || []} players={room.players.map(p => ({ id: p.id, name: p.name }))} />
        {toast ? <MiniToast message={toast.message} type={toast.type} onClose={() => setToast(null)} /> : null}
      </div>
    );
  }

  if (!room || room.status !== "playing") return null;

  const isFrozen = resultPhase !== "idle" && frozenCard.current;
  const card = isFrozen ? frozenCard.current : room.deck[room.currentCardIndex];

  if (!card) return <div className="text-center py-20 text-text-muted font-bold text-xl">Sem mais cartas!</div>;

  const cur = room.players[room.currentPlayerIndex];
  const isMyTurn = cur?.id === myPlayerId;
  const isChallenged = room.activeContest?.challengedId === myPlayerId && !room.activeContest?.querApostar;
  const hasContest = !!room.activeContest && !room.activeContest.querApostar;
  const round = isFrozen ? room.currentRound - 1 : room.currentRound;
  const cardAnim = resultPhase === "exiting" ? "animate-card-out"
    : resultPhase === "showing" ? ""
    : "animate-card-in";

  return (
    <div className="max-w-lg mx-auto space-y-4">
      {toast ? <MiniToast message={toast.message} type={toast.type} onClose={() => setToast(null)} /> : null}

      <CardDisplay
        card={card}
        questionIndex={0}
        round={round}
        animationClass={cardAnim}
        cardKey={String(card.id)}
      />

      {resultPhase !== "idle" && resultAnswer != null ? (
        <div className="text-center animate-scale-in space-y-1.5">
          <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-surface-card border-2 border-brand/30">
            <span className="text-text-muted text-xs">Resposta correta:</span>
            <span className="text-brand-light font-black text-xl font-mono tabular-nums">{resultAnswer.toLocaleString("pt-BR")}</span>
          </div>
          <p className="text-text-muted text-[11px] animate-pulse">Proxima carta em instantes...</p>
        </div>
      ) : null}

      {room.guesses.length > 0 && resultPhase === "idle" ? (
        <div className="space-y-1 animate-fade-in">
          <span className="text-[10px] text-text-muted font-bold uppercase tracking-widest flex items-center gap-1.5"><MessageCircle size={11} />Palpites</span>
          <div className="flex flex-wrap gap-1.5">
            {room.guesses.map((g, i) => (
              <div key={i} className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-surface-card border border-border text-xs">
                <span className="text-text-muted">{room.players.find(p => p.id === g.playerId)?.name}</span>
                <span className="font-mono text-text-primary font-bold tabular-nums">{g.value.toLocaleString("pt-BR")}</span>
                {i < room.guesses.length - 1 ? <span className="text-text-muted/30">&gt;</span> : null}
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {resultPhase === "idle" ? (
        <>
          <div className="flex items-center justify-center gap-2 py-1">
            <div className={`w-2.5 h-2.5 rounded-full ${isMyTurn ? "bg-brand animate-glow-pulse" : "bg-border"}`} />
            <span className="text-text-secondary text-sm">Turno de </span>
            <span className={`font-bold ${isMyTurn ? "text-brand-light" : "text-text-primary"}`}>
              {cur?.name}{isMyTurn ? " (voce)" : ""}
            </span>
          </div>

          <GuessSection room={room} myPlayerId={myPlayerId} isMyTurn={isMyTurn} hasActiveContest={hasContest} isChallengedInQuerApostar={isChallenged} />
        </>
      ) : null}

      <div className="space-y-1.5">
        <span className="text-[10px] text-text-muted font-bold uppercase tracking-widest flex items-center gap-1.5"><Users size={11} />Jogadores</span>
        <div className="grid grid-cols-2 gap-2">
          {room.players.map((p, i) => {
            const active = cur?.id === p.id;
            return (
              <div
                key={p.id}
                className={`px-2.5 py-2 rounded-xl transition-all duration-300 animate-slide-up ${
                  active ? "bg-brand/5 border border-brand/20 shadow-[0_0_20px_rgba(245,158,11,0.08)]" : "bg-surface-card border border-border"
                }`}
                style={{ animationDelay: `${i * 50}ms`, animationFillMode: "both" }}
              >
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className={`truncate font-bold text-[11px] ${active ? "text-brand-light" : "text-text-primary"}`}>{p.name}</span>
                  {p.dobreiCards > 0 ? (
                    <span className="w-5 h-5 rounded-md bg-accent-success/20 border border-accent-success/30 text-accent-success text-[10px] font-black flex items-center justify-center">{p.dobreiCards}</span>
                  ) : null}
                </div>
                {p.cards.length > 0 ? (
                  <div className="flex items-center">
                    {p.cards.slice(0, 5).map((c, ci) => {
                      const angle = CARD_ANGLES[ci % CARD_ANGLES.length];
                      return (
                        <div
                          key={ci}
                          className="w-4 h-6 rounded-[2px] bg-surface-card border border-brand/40 transition-all animate-card-in"
                          style={{
                            marginLeft: ci > 0 ? "-6px" : 0,
                            rotate: `${angle}deg`,
                            animationDelay: `${i * 50 + ci * 40}ms`,
                          }}
                          title={c.theme}
                        />
                      );
                    })}
                    {p.cards.length > 5 ? (
                      <span className="text-[10px] text-text-muted font-bold ml-1">+{p.cards.length - 5}</span>
                    ) : null}
                  </div>
                ) : (
                  <div className="h-6 flex items-center text-[10px] text-text-muted italic">limpo</div>
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
  const Icon = type === "dobrei" ? Zap : type === "naMosca" ? Sparkles : ShieldAlert;
  const isGood = type === "dobrei" || (type === "naMosca" && message.includes("Ninguem"));
  const style = isGood ? "border-accent-success/30 bg-accent-success/5 text-accent-success"
    : "border-accent-danger/20 bg-accent-danger/5 text-accent-danger";

  return (
    <div className="fixed bottom-4 left-0 right-0 z-50 flex justify-center pointer-events-none">
      <div className={`animate-toast-in pointer-events-auto flex items-center gap-2 px-4 py-2.5 rounded-full border ${style} backdrop-blur-xl shadow-2xl max-w-xs`}>
        <Icon size={14} />
        <p className="text-xs font-bold truncate">{message}</p>
        <button onClick={onClose} className="p-0.5 rounded-full hover:bg-white/5"><X size={12} /></button>
      </div>
    </div>
  );
}

export default memo(GameBoard);
