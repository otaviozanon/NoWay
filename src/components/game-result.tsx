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

  return (
    <div className="space-y-8 animate-bounce-in">
      <div className="text-center space-y-3">
        <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-br from-accent-warning/20 to-brand/20 border border-accent-warning/20 flex items-center justify-center animate-float">
          <Trophy size={36} className="text-accent-warning" />
        </div>
        <h2 className="text-3xl font-black text-text-primary tracking-tight">Fim de Jogo!</h2>
        <p className="text-text-secondary text-lg">O grande perdedor e...</p>
      </div>

      <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-accent-danger/5 to-surface-card border border-accent-danger/20 shadow-lg shadow-accent-danger/5">
        <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-accent-danger/10 border-2 border-accent-danger/20 flex items-center justify-center">
          <span className="text-4xl font-black text-accent-danger">
            {result.isTie ? "?" : result.loser.name.charAt(0)}
          </span>
        </div>
        <div className="text-2xl font-bold text-accent-danger">
          {result.isTie ? "Empate!" : result.loser.name}
        </div>
        {result.isTie ? <p className="text-text-muted mt-2">Multiplos perdedores!</p> : null}
        <p className="text-text-muted text-sm mt-2">
          {ruleSet === "advanced" ? "Pontos de Pato" : "Cartas"}: {calculateScore(result.loser, ruleSet)}
        </p>
      </div>

      <div className="space-y-1.5">
        {sorted.map((p, i) => {
          const isLoser = p.id === result.loser.id && !result.isTie;
          return (
            <div key={p.id} className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 animate-slide-up ${isLoser ? "bg-accent-danger/5 border border-accent-danger/15" : "bg-surface-raised border border-border"}`} style={{ animationDelay: `${i * 80}ms` }}>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${isLoser ? "bg-accent-danger/10" : "bg-accent-success/10"}`}>
                {isLoser ? <XCircle size={20} className="text-accent-danger" /> : <CheckCircle2 size={20} className="text-accent-success" />}
              </div>
              <div className="flex-1 min-w-0">
                <span className={`font-semibold block truncate ${isLoser ? "text-accent-danger" : "text-text-primary"}`}>{p.name}</span>
                <span className="text-xs text-text-muted">{p.cards.length} cartas</span>
              </div>
              <div className="flex items-center gap-1">
                {p.cards.map((_, ci) => (
                  <div key={ci} className={`w-5 h-7 rounded border ${isLoser ? "border-accent-danger/30 bg-accent-danger/10" : "border-border bg-surface-card"}`} />
                ))}
              </div>
              <span className="text-text-muted font-mono text-sm tabular-nums w-12 text-right">{calculateScore(p, ruleSet)}</span>
            </div>
          );
        })}
      </div>

      <div className="p-4 rounded-xl bg-surface-card border border-border space-y-3">
        <div className="flex items-center gap-2 text-sm text-text-secondary"><Users size={16} />Nova partida</div>
        <div className="flex flex-wrap gap-2">
          {players.map(p => {
            const voted = playAgainVotes.includes(p.id);
            return (
              <span key={p.id} className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all ${voted ? "bg-accent-success/15 text-accent-success border border-accent-success/30" : "bg-surface-raised text-text-muted border border-border"}`}>
                {p.name} {voted ? "✓" : ""}
              </span>
            );
          })}
        </div>
        <div className="flex items-center gap-2">
          <div className="flex-1 h-1.5 rounded-full bg-surface-raised overflow-hidden">
            <div className="h-full rounded-full bg-accent-success transition-all duration-500" style={{ width: `${(playAgainVotes.length / connectedCount) * 100}%` }} />
          </div>
          <span className="text-xs text-text-muted font-mono">{playAgainVotes.length}/{connectedCount}</span>
        </div>
      </div>

      {!hasVoted ? (
        <button onClick={handlePlayAgain} className="w-full flex items-center justify-center gap-3 px-6 py-5 rounded-2xl bg-gradient-to-r from-brand to-brand-dark hover:from-brand-light hover:to-brand active:scale-[0.98] text-black font-bold text-lg transition-all duration-200 touch-target shadow-xl shadow-brand/30">
          <RotateCcw size={22} />Jogar Novamente
        </button>
      ) : (
        <p className="text-center text-text-muted text-sm animate-pulse">Aguardando outros jogadores...</p>
      )}
    </div>
  );
}

export default memo(GameResultDisplay);
