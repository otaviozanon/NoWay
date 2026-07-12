"use client";

import { useMemo, useCallback, memo } from "react";
import { GameResult } from "@/game-engine/types";
import { calculateScore } from "@/game-engine/scoring";
import { getSocket } from "@/lib/socket";
import { Trophy, RotateCcw, Camera, CheckCircle2, XCircle } from "lucide-react";

interface Props { result: GameResult; ruleSet: "basic" | "advanced"; }

function GameResultDisplay({ result, ruleSet }: Props) {
  const sorted = useMemo(() => [...result.players].sort((a, b) => calculateScore(a, ruleSet) - calculateScore(b, ruleSet)), [result.players, ruleSet]);
  const handlePlayAgain = useCallback(() => { getSocket().emit("game:playAgain"); }, []);

  return (
    <div className="space-y-8 animate-scale-in">
      <div className="text-center space-y-3">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-brand-glow flex items-center justify-center"><Trophy size={32} className="text-brand-light" /></div>
        <h2 className="text-3xl font-bold text-text-primary">Fim de Jogo!</h2>
        <p className="text-text-secondary text-lg">O grande perdedor e...</p>
      </div>
      <div className="text-center p-8 rounded-2xl bg-surface-raised border border-accent-danger/20 shadow-lg shadow-accent-danger/5">
        <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-accent-danger/10 flex items-center justify-center"><XCircle size={40} className="text-accent-danger" /></div>
        <div className="text-2xl font-bold text-accent-danger">{result.isTie ? "Empate!" : result.loser.name}</div>
        {result.isTie ? <p className="text-text-muted mt-2">Multiplos patos da mesa!</p> : null}
      </div>
      <div className="space-y-2">
        {sorted.map((p, i) => {
          const isLoser = p.id === result.loser.id && !result.isTie;
          return (
            <div key={p.id} className={`flex items-center justify-between px-5 py-4 rounded-xl transition-all duration-200 animate-slide-up ${isLoser ? "bg-accent-danger/5 border border-accent-danger/20" : "bg-surface-raised border border-white/5"}`} style={{ animationDelay: `${i * 60}ms` }}>
              <div className="flex items-center gap-3">
                {isLoser ? <XCircle size={22} className="text-accent-danger" /> : <CheckCircle2 size={22} className="text-accent-success" />}
                <span className={`font-medium ${isLoser ? "text-accent-danger" : "text-text-primary"}`}>{p.name}</span>
              </div>
              <span className="text-text-muted font-mono text-sm tabular-nums">{calculateScore(p, ruleSet)} {ruleSet === "advanced" ? "pts" : "cartas"}</span>
            </div>
          );
        })}
      </div>
      <div className="flex items-center gap-3 px-5 py-4 rounded-xl bg-surface-raised border border-accent-warning/10">
        <Camera size={20} className="text-accent-warning" />
        <p className="text-accent-warning text-sm">Tire uma foto do Pato da Mesa! <span className="font-mono text-xs">#patodamesa</span></p>
      </div>
      <button onClick={handlePlayAgain} className="w-full flex items-center justify-center gap-3 px-6 py-5 rounded-xl bg-brand hover:bg-brand/90 active:scale-[0.98] text-black font-semibold text-lg transition-all duration-200 touch-target shadow-lg shadow-brand/25"><RotateCcw size={22} />Nova Partida</button>
    </div>
  );
}

export default memo(GameResultDisplay);
