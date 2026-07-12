"use client";

import { useMemo, useCallback, memo } from "react";
import { GameResult } from "@/game-engine/types";
import { calculateScore } from "@/game-engine/scoring";
import { getSocket } from "@/lib/socket";

function Icon({ d, size = 20 }: { d: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d={d} />
    </svg>
  );
}

const TrophyIcon = "M6 9H4.5a2.5 2.5 0 0 1 0-5C6 4 6 7.5 6 9z M18 9h1.5a2.5 2.5 0 0 0 0-5C18 4 18 7.5 18 9z M4 22h16 M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22 M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22 M18 2H6v7a6 6 0 0 0 12 0V2z";
const RotateCcwIcon = "M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8 M3 3v5h5";
const CameraIcon = "M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z M12 10a4 4 0 1 0 0 8 4 4 0 0 0 0-8z";
const CheckIcon = "M20 6L9 17l-5-5";
const XIcon = "M18 6L6 18 M6 6l12 12";

interface Props {
  result: GameResult;
  ruleSet: "basic" | "advanced";
}

function GameResultDisplay({ result, ruleSet }: Props) {
  const sorted = useMemo(
    () => [...result.players].sort((a, b) => calculateScore(a, ruleSet) - calculateScore(b, ruleSet)),
    [result.players, ruleSet],
  );

  const handlePlayAgain = useCallback(() => {
    getSocket().emit("game:playAgain");
  }, []);

  return (
    <div className="space-y-8 animate-scale-in">
      <div className="text-center space-y-3">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-brand-glow flex items-center justify-center">
          <Icon d={TrophyIcon} size={32} />
        </div>
        <h2 className="text-3xl font-bold text-text-primary">Fim de Jogo!</h2>
        <p className="text-text-secondary text-lg">O grande perdedor e...</p>
      </div>

      <div className="text-center p-8 rounded-2xl bg-surface-raised border border-accent-danger/20 shadow-lg shadow-accent-danger/5">
        <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-accent-danger/10 flex items-center justify-center">
          <Icon d={XIcon} size={40} />
        </div>
        <div className="text-2xl font-bold text-accent-danger">
          {result.isTie ? "Empate!" : result.loser.name}
        </div>
        {result.isTie ? <p className="text-text-muted mt-2">Multiplos patos da mesa!</p> : null}
      </div>

      <div className="space-y-2">
        {sorted.map((p, i) => {
          const isLoser = p.id === result.loser.id && !result.isTie;
          return (
            <div key={p.id}
              className={`flex items-center justify-between px-5 py-4 rounded-xl transition-all duration-200 animate-slide-up ${
                isLoser ? "bg-accent-danger/5 border border-accent-danger/20" : "bg-surface-raised border border-white/5"
              }`}
              style={{ animationDelay: `${i * 60}ms` }}>
              <div className="flex items-center gap-3">
                {isLoser ? <Icon d={XIcon} size={22} /> : <Icon d={CheckIcon} size={22} />}
                <span className={`font-medium ${isLoser ? "text-accent-danger" : "text-text-primary"}`}>{p.name}</span>
              </div>
              <span className="text-text-muted font-mono text-sm tabular-nums">
                {calculateScore(p, ruleSet)} {ruleSet === "advanced" ? "pts" : "cartas"}
              </span>
            </div>
          );
        })}
      </div>

      <div className="flex items-center gap-3 px-5 py-4 rounded-xl bg-surface-raised border border-accent-warning/10">
        <Icon d={CameraIcon} size={20} />
        <p className="text-accent-warning text-sm">
          Tire uma foto do Pato da Mesa! <span className="font-mono text-xs">#patodamesa</span>
        </p>
      </div>

      <button onClick={handlePlayAgain}
        className="w-full flex items-center justify-center gap-3 px-6 py-5 rounded-xl bg-brand hover:bg-brand/90
                   active:scale-[0.98] text-black font-semibold text-lg transition-all duration-200 touch-target shadow-lg shadow-brand/25">
        <Icon d={RotateCcwIcon} size={22} />Nova Partida
      </button>
    </div>
  );
}

export default memo(GameResultDisplay);
