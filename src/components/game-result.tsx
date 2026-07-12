"use client";

import { useMemo, useCallback, memo } from "react";
import { GameResult } from "@/game-engine/types";
import { calculateScore } from "@/game-engine/scoring";
import { getSocket } from "@/lib/socket";
import { Trophy, RotateCcw, CheckCircle2, XCircle, Users } from "lucide-react";

interface Props { result: GameResult; ruleSet: "basic" | "advanced"; myPlayerId: string | null; playAgainVotes: string[]; players: { id: string; name: string }[]; }

function GameResultDisplay({ result, ruleSet, myPlayerId, playAgainVotes, players }: Props) {
  const sorted = useMemo(() => [...result.players].sort((a, b) => calculateScore(a, ruleSet) - calculateScore(b, ruleSet)), [result.players, ruleSet]);
  const handlePlayAgain = useCallback(() => { getSocket().emit("game:playAgain"); }, []);
  const hasVoted = myPlayerId ? playAgainVotes.includes(myPlayerId) : false;
  const connectedCount = result.players.length;
  const scoreLabel = ruleSet === "advanced" ? "Pts Pato" : "Cartas";

  return (
    <div className="space-y-4 animate-bounce-in">
      <div className="text-center space-y-1.5">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-accent-warning/20 to-brand/20 border border-accent-warning/20 flex items-center justify-center animate-float">
          <Trophy size={26} className="text-accent-warning" />
        </div>
        <h2 className="text-2xl font-black text-text-primary tracking-tight">Fim de Jogo!</h2>
      </div>

      <div className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-accent-danger/5 to-surface-card border border-accent-danger/15">
        <div className="w-12 h-12 rounded-full bg-accent-danger/10 border-2 border-accent-danger/20 flex items-center justify-center shrink-0">
          <span className="text-xl font-black text-accent-danger">
            {result.isTie ? "?" : result.loser.name.charAt(0)}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-base font-bold text-accent-danger truncate">
            {result.isTie ? "Empate!" : result.loser.name}
          </div>
          {result.isTie ? <p className="text-text-muted text-xs">Multiplos perdedores!</p> : (
            <p className="text-text-muted text-xs">
              Perdedor &middot; {scoreLabel}: {calculateScore(result.loser, ruleSet)}
            </p>
          )}
        </div>
        <XCircle size={20} className="text-accent-danger/30 shrink-0" />
      </div>

      <div className="space-y-1">
        {sorted.map((p, i) => {
          const isLoser = p.id === result.loser.id && !result.isTie;
          return (
            <div key={p.id} className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg transition-all duration-200 animate-slide-up ${isLoser ? "bg-accent-danger/5 border border-accent-danger/10" : "bg-surface-raised border border-border"}`} style={{ animationDelay: `${i * 60}ms` }}>
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${isLoser ? "bg-accent-danger/10" : "bg-accent-success/10"}`}>
                {isLoser ? <XCircle size={14} className="text-accent-danger" /> : <CheckCircle2 size={14} className="text-accent-success" />}
              </div>
              <div className="flex-1 min-w-0 flex items-baseline gap-1.5">
                <span className={`font-semibold text-sm truncate ${isLoser ? "text-accent-danger" : "text-text-primary"}`}>{p.name}</span>
                <span className="text-[11px] text-text-muted whitespace-nowrap">{p.cards.length} cartas</span>
              </div>
              <div className="flex items-center gap-0.5">
                {p.cards.slice(0, 4).map((_, ci) => (
                  <div key={ci} className={`w-3.5 h-5 rounded-sm border ${isLoser ? "border-accent-danger/30 bg-accent-danger/10" : "border-border bg-surface-card"}`} />
                ))}
                {p.cards.length > 4 ? <span className="text-[9px] text-text-muted font-bold">+{p.cards.length - 4}</span> : null}
              </div>
              <span className="text-text-muted font-mono text-xs tabular-nums w-7 text-right">{calculateScore(p, ruleSet)}</span>
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

      {!hasVoted ? (
        <button onClick={handlePlayAgain} className="w-full flex items-center justify-center gap-2 px-4 py-4 rounded-xl bg-gradient-to-r from-brand to-brand-dark hover:from-brand-light hover:to-brand active:scale-[0.98] text-black font-bold text-base transition-all duration-200 touch-target shadow-xl shadow-brand/30">
          <RotateCcw size={18} />Jogar Novamente
        </button>
      ) : (
        <p className="text-center text-text-muted text-xs animate-pulse">Aguardando outros jogadores...</p>
      )}
    </div>
  );
}

export default memo(GameResultDisplay);
