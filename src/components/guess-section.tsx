"use client";

import { useState, useCallback, memo } from "react";
import { getSocket } from "@/lib/socket";
import { Room } from "@/game-engine/types";
import { Send, Swords, Zap, AlertTriangle, Hand, Clock } from "lucide-react";

interface Props { room: Room; myPlayerId: string | null; isMyTurn: boolean; hasActiveContest: boolean; isChallengedInQuerApostar: boolean; }

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

  const handleContest = useCallback(() => getSocket().emit("game:contest"), []);
  const handleAccept = useCallback(() => getSocket().emit("game:contest:accept"), []);
  const handleQuerApostar = useCallback(() => getSocket().emit("game:querApostar"), []);
  const handleResponse = useCallback((keep: boolean) => getSocket().emit("game:querApostar:response", { keep }), []);
  const handleNaMosca = useCallback(() => getSocket().emit("game:naMosca"), []);

  const isChallenger = room.activeContest?.challengerId === myPlayerId;
  const querApostarActive = room.activeContest?.querApostar === true;

  if (room.status === "finished") return null;

  if (isMyTurn && !hasActiveContest) {
    return (
      <div className="space-y-3 animate-slide-up">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <input type="number" min={minGuess}
              className="w-full p-5 rounded-2xl bg-surface-raised border-2 border-white/5 text-white text-2xl font-mono font-bold
                         placeholder:text-text-muted/50 focus:outline-none focus:border-brand/50 focus:bg-surface-card
                         transition-all duration-300 touch-target text-center tracking-wider"
              placeholder={`Maior que ${minGuess - 1}`}
              value={guessValue} onChange={(e) => setGuessValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleGuess()} autoFocus />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted/30 text-xs font-mono">
              {lastGuess ? `${lastGuess.value} →` : ""}
            </div>
          </div>
          <button onClick={handleGuess}
            className="flex items-center gap-2 px-8 py-5 rounded-2xl bg-gradient-to-br from-brand to-brand-dark
                       hover:from-brand-light hover:to-brand active:scale-[0.97]
                       text-black font-bold text-lg transition-all duration-200 touch-target shadow-xl shadow-brand/30">
            <Send size={20} />Palpite
          </button>
        </div>

        {lastGuess && lastGuess.playerId !== myPlayerId ? (
          <button onClick={handleContest}
            className="w-full flex items-center justify-center gap-3 p-5 rounded-2xl
                       bg-gradient-to-r from-accent-danger to-accent-danger/90
                       hover:from-accent-danger/90 hover:to-accent-danger/80
                       active:scale-[0.98] text-white font-black text-xl
                       transition-all duration-200 touch-target shadow-xl shadow-accent-danger/30 tracking-wide">
            <Swords size={24} />Nem Ferrando!
          </button>
        ) : null}

        {lastGuess && room.ruleSet === "advanced" ? (
          <button onClick={handleNaMosca}
            className="w-full flex items-center justify-center gap-2 p-4 rounded-2xl
                       bg-surface-raised border-2 border-accent-warning/20
                       hover:bg-accent-warning/5 hover:border-accent-warning/40
                       active:scale-[0.98] text-accent-warning font-bold text-lg
                       transition-all duration-200 touch-target">
            <Zap size={20} />Na Mosca!
          </button>
        ) : null}
      </div>
    );
  }

  if (isChallengedInQuerApostar) {
    return (
      <div className="p-5 rounded-2xl bg-surface-card border-2 border-accent-warning/20 space-y-4 animate-scale-in shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-accent-warning/10 flex items-center justify-center"><AlertTriangle size={22} className="text-accent-warning" /></div>
          <p className="text-accent-warning font-bold text-lg">Seu palpite foi contestado!</p>
        </div>
        <div className="flex gap-3">
          <button onClick={handleAccept}
            className="flex-1 flex items-center justify-center gap-2 p-5 rounded-2xl bg-surface-raised border-2 border-white/5
                       hover:border-white/10 active:scale-[0.98] text-text-primary font-bold
                       transition-all duration-200 touch-target">
            <Hand size={20} />Aceitar
          </button>
          <button onClick={handleQuerApostar}
            className="flex-1 flex items-center justify-center gap-2 p-5 rounded-2xl bg-gradient-to-br from-accent-warning to-accent-warning/90
                       hover:from-accent-warning/90 active:scale-[0.98] text-black font-black text-lg
                       transition-all duration-200 touch-target shadow-xl shadow-accent-warning/30">
            <Swords size={20} />Quer Apostar?
          </button>
        </div>
      </div>
    );
  }

  if (isChallenger && querApostarActive) {
    return (
      <div className="p-5 rounded-2xl bg-surface-card border-2 border-accent-warning/20 space-y-4 animate-scale-in shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-accent-warning/10 flex items-center justify-center"><Swords size={22} className="text-accent-warning" /></div>
          <p className="text-accent-warning font-bold text-lg">Ele quer apostar! Mantem?</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => handleResponse(false)}
            className="flex-1 flex items-center justify-center gap-2 p-5 rounded-2xl bg-surface-raised border-2 border-white/5
                       hover:border-white/10 active:scale-[0.98] text-text-primary font-bold transition-all duration-200 touch-target">
            <Hand size={20} />Desistir
          </button>
          <button onClick={() => handleResponse(true)}
            className="flex-1 flex items-center justify-center gap-2 p-5 rounded-2xl bg-gradient-to-br from-accent-warning to-accent-warning/90
                       hover:from-accent-warning/90 active:scale-[0.98] text-black font-black text-lg
                       transition-all duration-200 touch-target shadow-xl shadow-accent-warning/30">
            <Swords size={20} />Manter Aposta
          </button>
        </div>
      </div>
    );
  }

  if (hasActiveContest && !isMyTurn && !isChallenger) {
    return (
      <div className="flex items-center justify-center gap-3 py-6 px-4 rounded-2xl bg-surface-raised border border-white/5 animate-pulse">
        <div className="w-2 h-2 rounded-full bg-accent-warning animate-pulse" />
        <p className="text-text-muted text-sm font-medium">Outro jogador decidindo...</p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center gap-3 py-6 px-4 rounded-2xl bg-surface-raised/50 border border-white/5">
      <Clock size={18} className="text-text-muted" />
      <p className="text-text-muted text-sm font-medium">Aguardando o turno do proximo jogador...</p>
    </div>
  );
}

export default memo(GuessSection);
