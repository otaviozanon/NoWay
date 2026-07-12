"use client";

import { useState, useCallback, memo } from "react";
import { getSocket } from "@/lib/socket";
import { Room } from "@/game-engine/types";

function Icon({ d, size = 20 }: { d: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d={d} />
    </svg>
  );
}

const SendIcon = "M22 2L11 13 M22 2l-7 20-4-9-9-4 20-7z";
const SwordsIcon = "M14.5 17.5L3 6V3h3l11.5 11.5 M13 19l6-6 M16 16l4 4 M19 21l2-2 M14.5 6.5L18 3h3v3l-3.5 3.5 M5 14l4 4 M7 17l-3 3 M3 21l2-2";
const ZapIcon = "M13 2L3 14h9l-1 8 10-12h-9l1-8z";
const AlertTriangleIcon = "M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z M12 9v4 M12 17h.01";
const HandIcon = "M18 11V6a2 2 0 0 0-4 0v5 M14 11V4a2 2 0 0 0-4 0v7 M10 11V5a2 2 0 0 0-4 0v6 M6 11v-2a2 2 0 0 0-4 0v7c0 5 4 8 8 8h4c2.2 0 4-1.8 4-4v-7";

interface Props {
  room: Room;
  myPlayerId: string | null;
  isMyTurn: boolean;
  hasActiveContest: boolean;
  isChallengedInQuerApostar: boolean;
}

function GuessSection({ room, myPlayerId, isMyTurn, hasActiveContest, isChallengedInQuerApostar }: Props) {
  const [guessValue, setGuessValue] = useState("");
  const lastGuess = room.guesses[room.guesses.length - 1];
  const minGuess = lastGuess ? lastGuess.value + 1 : 1;

  const handleGuess = useCallback(() => {
    const val = parseInt(guessValue);
    if (isNaN(val) || val < minGuess) return;
    getSocket().emit("game:guess", { value: val });
    setGuessValue("");
  }, [guessValue, minGuess]);

  const handleContest = useCallback(() => { getSocket().emit("game:contest"); }, []);
  const handleQuerApostar = useCallback(() => { getSocket().emit("game:querApostar"); }, []);
  const handleApostarResponse = useCallback((keep: boolean) => { getSocket().emit("game:querApostar:response", { keep }); }, []);
  const handleNaMosca = useCallback(() => { getSocket().emit("game:naMosca"); }, []);

  if (room.status === "finished") return null;

  if (isMyTurn && !hasActiveContest) {
    return (
      <div className="space-y-4 animate-slide-up">
        <div className="flex gap-3">
          <input
            type="number" min={minGuess}
            className="flex-1 p-5 rounded-xl bg-surface-raised border border-white/10 text-white text-2xl font-mono font-bold
                       placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent
                       transition-all duration-200 touch-target"
            placeholder={`> ${minGuess - 1}`}
            value={guessValue}
            onChange={(e) => setGuessValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" ? handleGuess() : null}
            autoFocus
          />
          <button onClick={handleGuess}
            className="flex items-center gap-2 px-8 py-5 rounded-xl bg-brand hover:bg-brand/90 active:scale-[0.97]
                       text-black font-bold text-lg transition-all duration-200 touch-target shadow-lg shadow-brand/25">
            <Icon d={SendIcon} size={20} />Palpite
          </button>
        </div>

        {lastGuess && lastGuess.playerId !== myPlayerId ? (
          <button onClick={handleContest}
            className="w-full flex items-center justify-center gap-2 p-5 rounded-xl
                       bg-gradient-to-r from-accent-danger/90 to-accent-danger hover:from-accent-danger hover:to-accent-danger/90
                       active:scale-[0.98] text-white font-bold text-xl transition-all duration-200 touch-target shadow-lg shadow-accent-danger/25">
            <Icon d={SwordsIcon} size={24} />Nem a Pato!
          </button>
        ) : null}

        {lastGuess && room.ruleSet === "advanced" ? (
          <button onClick={handleNaMosca}
            className="w-full flex items-center justify-center gap-2 p-4 rounded-xl bg-surface-raised border border-accent-warning/30
                       hover:bg-accent-warning/10 hover:border-accent-warning/50 active:scale-[0.98]
                       text-accent-warning font-semibold text-lg transition-all duration-200 touch-target">
            <Icon d={ZapIcon} size={20} />Na Mosca!
          </button>
        ) : null}
      </div>
    );
  }

  if (isChallengedInQuerApostar) {
    return (
      <div className="p-5 rounded-xl bg-surface-raised border border-accent-warning/30 space-y-4 animate-scale-in">
        <div className="flex items-center gap-3">
          <Icon d={AlertTriangleIcon} size={24} />
          <p className="text-accent-warning font-semibold text-lg">Seu palpite foi contestado!</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => handleApostarResponse(false)}
            className="flex-1 flex items-center justify-center gap-2 p-4 rounded-xl bg-surface-card border border-white/10
                       hover:bg-surface-card/80 active:scale-[0.98] text-text-primary font-semibold transition-all duration-200 touch-target">
            <Icon d={HandIcon} size={20} />Aceitar
          </button>
          <button onClick={handleQuerApostar}
            className="flex-1 flex items-center justify-center gap-2 p-4 rounded-xl bg-accent-warning hover:bg-accent-warning/90
                       active:scale-[0.98] text-black font-bold text-lg transition-all duration-200 touch-target shadow-lg shadow-accent-warning/25">
            <Icon d={SwordsIcon} size={20} />Quer Apostar?
          </button>
        </div>
      </div>
    );
  }

  if (hasActiveContest && !isMyTurn) {
    return <p className="text-center text-text-muted py-4 animate-pulse">Aguardando resposta da aposta...</p>;
  }

  return <p className="text-center text-text-muted py-6 text-lg">Aguardando o turno de outro jogador...</p>;
}

export default memo(GuessSection);
