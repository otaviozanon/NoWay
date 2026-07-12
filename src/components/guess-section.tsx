"use client";

import { useState, useCallback, memo } from "react";
import { getSocket } from "@/lib/socket";
import { Room } from "@/game-engine/types";
import { Send, Swords, Zap, AlertTriangle, Hand } from "lucide-react";

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

  const handleContest = useCallback(() => { getSocket().emit("game:contest"); }, []);
  const handleAcceptContest = useCallback(() => { getSocket().emit("game:contest:accept"); }, []);
  const handleQuerApostar = useCallback(() => { getSocket().emit("game:querApostar"); }, []);
  const handleApostarResponse = useCallback((keep: boolean) => { getSocket().emit("game:querApostar:response", { keep }); }, []);
  const handleNaMosca = useCallback(() => { getSocket().emit("game:naMosca"); }, []);

  const isChallenger = room.activeContest?.challengerId === myPlayerId;
  const querApostarActive = room.activeContest?.querApostar === true;

  if (room.status === "finished") return null;

  if (isMyTurn && !hasActiveContest) {
    return (
      <div className="space-y-4 animate-slide-up">
        <div className="flex gap-3">
          <input type="number" min={minGuess} className="flex-1 p-5 rounded-xl bg-surface-raised border border-white/10 text-white text-2xl font-mono font-bold placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-all duration-200 touch-target" placeholder={`> ${minGuess - 1}`} value={guessValue} onChange={(e) => setGuessValue(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleGuess()} autoFocus />
          <button onClick={handleGuess} className="flex items-center gap-2 px-8 py-5 rounded-xl bg-brand hover:bg-brand/90 active:scale-[0.97] text-black font-bold text-lg transition-all duration-200 touch-target shadow-lg shadow-brand/25"><Send size={20} />Palpite</button>
        </div>
        {lastGuess && lastGuess.playerId !== myPlayerId ? (
          <button onClick={handleContest} className="w-full flex items-center justify-center gap-2 p-5 rounded-xl bg-gradient-to-r from-accent-danger/90 to-accent-danger hover:from-accent-danger hover:to-accent-danger/90 active:scale-[0.98] text-white font-bold text-xl transition-all duration-200 touch-target shadow-lg shadow-accent-danger/25"><Swords size={24} />Nem a Pato!</button>
        ) : null}
        {lastGuess && room.ruleSet === "advanced" ? (
          <button onClick={handleNaMosca} className="w-full flex items-center justify-center gap-2 p-4 rounded-xl bg-surface-raised border border-accent-warning/30 hover:bg-accent-warning/10 hover:border-accent-warning/50 active:scale-[0.98] text-accent-warning font-semibold text-lg transition-all duration-200 touch-target"><Zap size={20} />Na Mosca!</button>
        ) : null}
      </div>
    );
  }

  if (isChallengedInQuerApostar) {
    return (
      <div className="p-5 rounded-xl bg-surface-raised border border-accent-warning/30 space-y-4 animate-scale-in">
        <div className="flex items-center gap-3"><AlertTriangle size={24} className="text-accent-warning" /><p className="text-accent-warning font-semibold text-lg">Seu palpite foi contestado!</p></div>
        <div className="flex gap-3">
          <button onClick={handleAcceptContest} className="flex-1 flex items-center justify-center gap-2 p-4 rounded-xl bg-surface-card border border-white/10 hover:bg-surface-card/80 active:scale-[0.98] text-text-primary font-semibold transition-all duration-200 touch-target"><Hand size={20} />Aceitar</button>
          <button onClick={handleQuerApostar} className="flex-1 flex items-center justify-center gap-2 p-4 rounded-xl bg-accent-warning hover:bg-accent-warning/90 active:scale-[0.98] text-black font-bold text-lg transition-all duration-200 touch-target shadow-lg shadow-accent-warning/25"><Swords size={20} />Quer Apostar?</button>
        </div>
      </div>
    );
  }

  if (isChallenger && querApostarActive) {
    return (
      <div className="p-5 rounded-xl bg-surface-raised border border-accent-warning/30 space-y-4 animate-scale-in">
        <div className="flex items-center gap-3"><AlertTriangle size={24} className="text-accent-warning" /><p className="text-accent-warning font-semibold text-lg">Ele quer apostar! Mantem a contestacao?</p></div>
        <div className="flex gap-3">
          <button onClick={() => handleApostarResponse(false)} className="flex-1 flex items-center justify-center gap-2 p-4 rounded-xl bg-surface-card border border-white/10 hover:bg-surface-card/80 active:scale-[0.98] text-text-primary font-semibold transition-all duration-200 touch-target"><Hand size={20} />Desistir</button>
          <button onClick={() => handleApostarResponse(true)} className="flex-1 flex items-center justify-center gap-2 p-4 rounded-xl bg-accent-warning hover:bg-accent-warning/90 active:scale-[0.98] text-black font-bold text-lg transition-all duration-200 touch-target shadow-lg shadow-accent-warning/25"><Swords size={20} />Manter Aposta</button>
        </div>
      </div>
    );
  }

  if (hasActiveContest && !isMyTurn && !isChallenger) {
    return <p className="text-center text-text-muted py-4 animate-pulse">Aguardando o jogador decidir...</p>;
  }

  return <p className="text-center text-text-muted py-6 text-lg">Aguardando o turno de outro jogador...</p>;
}

export default memo(GuessSection);
