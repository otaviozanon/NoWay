"use client";

import { useMemo, useCallback, memo } from "react";
import { GameResult } from "@/game-engine/types";
import { calculateScore } from "@/game-engine/scoring";
import { getSocket } from "@/lib/socket";
import { Trophy, RotateCcw, CheckCircle2, ThumbsDown, Users } from "lucide-react";
import { DuckIcon } from "./duck-icon";

interface Props { result: GameResult; ruleSet: "basic" | "advanced"; myPlayerId: string | null; playAgainVotes: string[]; players: { id: string; name: string }[]; }

const CARD_ANGLES = [-3, 0, 3];

const CONFETTI_DOTS = [
  { color: "bg-brand",            top: -4,  left: 28,  delay: 0 },
  { color: "bg-accent-success",   top: 8,   right: -4,  delay: 0.25 },
  { color: "bg-accent-warning",   bottom: 20, right: 4, delay: 0.45 },
  { color: "bg-accent-danger",    bottom: -4, left: 24, delay: 0.65 },
  { color: "bg-brand-light",      top: 44,  left: -6,  delay: 0.85 },
  { color: "bg-brand-dark",       top: 28,  right: 22, delay: 1.05 },
];

function GameResultDisplay({ result, ruleSet, myPlayerId, playAgainVotes, players }: Props) {
  const sorted = useMemo(() => [...result.players].sort((a, b) => calculateScore(a, ruleSet) - calculateScore(b, ruleSet)), [result.players, ruleSet]);
  const handlePlayAgain = useCallback(() => { getSocket().emit("game:playAgain"); }, []);
  const hasVoted = myPlayerId ? playAgainVotes.includes(myPlayerId) : false;
  const connectedCount = result.players.length;
  const scoreLabel = ruleSet === "advanced" ? "Pts Pato" : "Cartas";

  return (
    <div className="space-y-8 animate-bounce-in">
      <div className="text-center space-y-5">
        {result.isTie ? (
          <>
            <h2 className="text-4xl font-black text-accent-warning"
              style={{ textShadow: "0 0 24px rgba(234,179,8,0.4), 0 0 48px rgba(234,179,8,0.15)" }}>
              Empate!
            </h2>
            <p className="text-text-secondary font-medium text-lg">
              Multiplos perdedores!
            </p>
          </>
        ) : (
          <>
            <div className="relative mx-auto w-28 h-28">
              <div
                className="absolute inset-0 w-28 h-28 rounded-full border-2 border-brand/30 bg-surface-card flex items-center justify-center animate-crown-entrance"
              >
                <DuckIcon size={44} className="text-brand-light" />
              </div>
              {CONFETTI_DOTS.map((d, i) => (
                <div
                  key={i}
                  className={`absolute w-3 h-3 rounded-full ${d.color} animate-confetti-bob`}
                  style={{
                    top: d.top !== undefined ? `${d.top}px` : undefined,
                    left: d.left !== undefined ? `${d.left}px` : undefined,
                    right: d.right !== undefined ? `${d.right}px` : undefined,
                    bottom: d.bottom !== undefined ? `${d.bottom}px` : undefined,
                    animationDelay: `${d.delay}s`,
                    zIndex: 10,
                  }}
                />
              ))}
            </div>

            <h2 className="text-5xl font-black text-accent-danger"
              style={{ textShadow: "0 0 24px rgba(239,68,68,0.45), 0 0 48px rgba(239,68,68,0.2)" }}>
              {result.loser.name}
            </h2>

            <div className="relative inline-block -rotate-3">
              <div className="relative bg-accent-danger/10 border-2 border-accent-danger/40 rounded-xl px-6 py-3 shadow-lg shadow-accent-danger/10">
                <ThumbsDown size={22} className="text-accent-danger absolute -top-2 -right-2" />
                <p className="text-accent-danger font-black text-xl">
                  é o(a) PATO da partida!
                </p>
              </div>
            </div>
          </>
        )}
      </div>

      <div className="space-y-3">
        <h3 className="text-sm text-text-muted font-medium px-1">Ranking</h3>
        {sorted.map((p, i) => {
          const isLoser = p.id === result.loser.id && !result.isTie;
          const isFirst = i === 0;
          const score = calculateScore(p, ruleSet);
          const cardCount = p.cards.length;
          return (
            <div
              key={p.id}
              className={`flex items-center gap-3 px-5 py-4 rounded-2xl border transition-all animate-slide-up ${
                isLoser
                  ? "border-accent-danger/30 bg-accent-danger/5"
                  : isFirst
                    ? "border-accent-success/20 bg-accent-success/5"
                    : "border-border bg-surface-raised"
              }`}
              style={{ animationDelay: `${i * 80}ms`, animationFillMode: "both" }}
            >
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                isLoser
                  ? "bg-accent-danger/10"
                  : isFirst
                    ? "bg-accent-success/10"
                    : "bg-surface-card"
              }`}>
                {isLoser
                  ? <ThumbsDown size={16} className="text-accent-danger" />
                  : isFirst
                    ? <Trophy size={16} className="text-accent-warning" />
                    : <span className="font-mono text-xs font-bold text-text-muted">#{i + 1}</span>
                }
              </div>

              <span className={`flex-1 font-semibold text-sm truncate ${
                isLoser ? "text-accent-danger" : "text-text-primary"
              }`}>
                {p.name}
              </span>

              <div className="flex items-center">
                {cardCount > 0 ? (
                  <div className="flex items-center">
                    {Array.from({ length: Math.min(cardCount, 6) }).map((_, ci) => {
                      const angle = CARD_ANGLES[ci % CARD_ANGLES.length];
                      return (
                        <div
                          key={ci}
                          className={`w-4 h-6 rounded-[2px] border transition-all ${
                            isLoser
                              ? "bg-accent-danger/20 border-accent-danger/30"
                              : isFirst
                                ? "bg-accent-success/15 border-accent-success/30"
                                : "bg-surface-card border-border"
                          }`}
                          style={{
                            marginLeft: ci > 0 ? "-8px" : 0,
                            rotate: `${angle}deg`,
                            animationDelay: `${i * 80 + ci * 60}ms`,
                          }}
                        />
                      );
                    })}
                    {cardCount > 6 && (
                      <span className="text-[10px] text-text-muted font-bold ml-1">+{cardCount - 6}</span>
                    )}
                  </div>
                ) : (
                  <span className="text-text-muted text-xs italic">0 cartas</span>
                )}
              </div>

              <span className={`font-bold text-sm min-w-[2.5rem] text-right ${
                isLoser ? "text-accent-danger" : isFirst ? "text-accent-success" : "text-text-secondary"
              }`}>
                {score}
              </span>
            </div>
          );
        })}
      </div>

      <div className="p-3 rounded-xl bg-surface-card border border-border space-y-2.5">
        <div className="flex items-center gap-1.5 text-[11px] text-text-muted font-bold uppercase tracking-wider"><Users size={13} />Nova partida</div>
        <div className="flex flex-wrap gap-1.5">
          {players.map(p => {
            const voted = playAgainVotes.includes(p.id);
            return (
              <span key={p.id} className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${voted ? "bg-accent-success/15 text-accent-success border border-accent-success/30" : "bg-surface-raised text-text-muted border border-border"}`}>
                {p.name} {voted ? "✓" : ""}
              </span>
            );
          })}
        </div>
        <div className="flex items-center gap-2">
          <div className="flex-1 h-1.5 rounded-full bg-surface-raised overflow-hidden">
            <div className="h-full rounded-full bg-accent-success transition-all duration-500" style={{ width: `${(playAgainVotes.length / connectedCount) * 100}%` }} />
          </div>
          <span className="text-[10px] text-text-muted font-mono">{playAgainVotes.length}/{connectedCount}</span>
        </div>
      </div>

      <button
        onClick={handlePlayAgain}
        disabled={hasVoted}
        className={`w-full flex items-center justify-center gap-3 px-6 py-5 rounded-2xl font-bold text-lg transition-all duration-200 touch-target ${
          hasVoted
            ? "bg-surface-raised text-text-muted cursor-not-allowed border border-border"
            : "bg-gradient-to-r from-brand to-brand-dark hover:from-brand-light hover:to-brand active:scale-[0.98] text-black font-black shadow-2xl shadow-brand/30"
        }`}
      >
        <RotateCcw size={22} />
        {hasVoted ? "Aguardando outros jogadores..." : "Jogar Novamente"}
      </button>
    </div>
  );
}

export default memo(GameResultDisplay);
