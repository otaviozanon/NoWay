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

  const hGuess = useCallback(() => { const v = parseInt(guessValue); if (isNaN(v) || v < minGuess) return; getSocket().emit("game:guess", { value: v }); setGuessValue(""); }, [guessValue, minGuess]);
  const hContest = useCallback(() => getSocket().emit("game:contest"), []);
  const hAccept = useCallback(() => getSocket().emit("game:contest:accept"), []);
  const hApostar = useCallback(() => getSocket().emit("game:querApostar"), []);
  const hResp = useCallback((k: boolean) => getSocket().emit("game:querApostar:response", { keep: k }), []);
  const hMosca = useCallback(() => getSocket().emit("game:naMosca"), []);

  if (room.status === "finished") return null;

  if (isMyTurn && !hasActiveContest) {
    return (
      <div className="space-y-3 animate-slide-up">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <input type="number" min={minGuess}
              className="w-full p-5 rounded-2xl bg-surface-card border-2 border-border text-white text-2xl font-mono font-black
                         placeholder:text-text-muted/30 focus:outline-none focus:border-brand/50 transition-all duration-300 touch-target text-center tracking-wider"
              placeholder={`> ${minGuess - 1}`} value={guessValue} onChange={e => setGuessValue(e.target.value)}
              onKeyDown={e => e.key === "Enter" && hGuess()} autoFocus />
          </div>
          <button onClick={hGuess} className="flex items-center gap-2 px-8 py-5 rounded-2xl bg-gradient-to-br from-brand to-brand-dark hover:from-brand-light hover:to-brand active:scale-[0.97] text-black font-black text-lg transition-all duration-200 touch-target shadow-xl shadow-brand/30"><Send size={20} />Palpite</button>
        </div>
        {lastGuess && lastGuess.playerId !== myPlayerId ? (
          <button onClick={hContest} className="w-full flex items-center justify-center gap-3 p-5 rounded-2xl bg-gradient-to-r from-accent-danger to-accent-danger/90 hover:from-accent-danger/90 active:scale-[0.98] text-white font-black text-xl transition-all duration-200 touch-target shadow-xl shadow-accent-danger/30 tracking-wide"><Swords size={24} />Nem Ferrando!</button>
        ) : null}
        {lastGuess && room.ruleSet === "advanced" ? (
          <button onClick={hMosca} className="w-full flex items-center justify-center gap-2 p-4 rounded-2xl bg-surface-card border-2 border-accent-warning/20 hover:bg-accent-warning/5 hover:border-accent-warning/40 active:scale-[0.98] text-accent-warning font-bold text-lg transition-all duration-200 touch-target"><Zap size={20} />Na Mosca!</button>
        ) : null}
      </div>
    );
  }

  if (isChallengedInQuerApostar) {
    return (
      <div className="p-5 rounded-2xl bg-surface-card border-2 border-accent-warning/20 space-y-4 animate-scale-in shadow-lg">
        <div className="flex items-center gap-3"><div className="w-10 h-10 rounded-xl bg-accent-warning/10 flex items-center justify-center"><AlertTriangle size={22} className="text-accent-warning" /></div><p className="text-accent-warning font-bold text-lg">Palpite contestado!</p></div>
        <div className="flex gap-3">
          <button onClick={hAccept} className="flex-1 flex items-center justify-center gap-2 p-5 rounded-2xl bg-surface-raised border-2 border-border hover:border-white/10 active:scale-[0.98] text-text-primary font-bold transition-all duration-200 touch-target"><Hand size={20} />Aceitar</button>
          <button onClick={hApostar} className="flex-1 flex items-center justify-center gap-2 p-5 rounded-2xl bg-gradient-to-br from-accent-warning to-accent-warning/90 hover:from-accent-warning/90 active:scale-[0.98] text-black font-black text-lg transition-all duration-200 touch-target shadow-xl shadow-accent-warning/30"><Swords size={20} />Quer Apostar?</button>
        </div>
      </div>
    );
  }

  if (room.activeContest?.challengerId === myPlayerId && room.activeContest?.querApostar) {
    return (
      <div className="p-5 rounded-2xl bg-surface-card border-2 border-accent-warning/20 space-y-4 animate-scale-in shadow-lg">
        <div className="flex items-center gap-3"><Swords size={22} className="text-accent-warning" /><p className="text-accent-warning font-bold text-lg">Ele quer apostar! Mantem?</p></div>
        <div className="flex gap-3">
          <button onClick={() => hResp(false)} className="flex-1 flex items-center justify-center gap-2 p-5 rounded-2xl bg-surface-raised border-2 border-border hover:border-white/10 active:scale-[0.98] text-text-primary font-bold transition-all duration-200 touch-target"><Hand size={20} />Desistir</button>
          <button onClick={() => hResp(true)} className="flex-1 flex items-center justify-center gap-2 p-5 rounded-2xl bg-gradient-to-br from-accent-warning to-accent-warning/90 active:scale-[0.98] text-black font-black text-lg transition-all duration-200 touch-target shadow-xl shadow-accent-warning/30"><Swords size={20} />Manter Aposta</button>
        </div>
      </div>
    );
  }

  if (hasActiveContest && !isMyTurn) {
    return <div className="flex items-center justify-center gap-3 py-5 px-4 rounded-2xl bg-surface-card border border-border animate-pulse"><div className="w-2 h-2 rounded-full bg-accent-warning animate-pulse" /><p className="text-text-muted text-sm font-medium">Decidindo...</p></div>;
  }

  return <div className="flex items-center justify-center gap-3 py-5 px-4 rounded-2xl bg-surface-card/50 border border-border"><Clock size={18} className="text-text-muted" /><p className="text-text-muted text-sm font-medium">Aguardando proximo jogador...</p></div>;
}

export default memo(GuessSection);
