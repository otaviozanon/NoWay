"use client";

import { useState, useCallback, memo } from "react";
import { getSocket } from "@/lib/socket";
import { Room } from "@/game-engine/types";
import { Send, Swords, Zap, AlertTriangle, Hand, Clock } from "lucide-react";

function fmt(n: string): string {
  const num = parseInt(n.replace(/\D/g, ""));
  if (isNaN(num)) return "";
  return num.toLocaleString("pt-BR");
}

function unfmt(s: string): string {
  return s.replace(/\D/g, "");
}

interface Props { room: Room; myPlayerId: string | null; isMyTurn: boolean; hasActiveContest: boolean; isChallengedInQuerApostar: boolean; }

function GuessSection({ room, myPlayerId, isMyTurn, hasActiveContest, isChallengedInQuerApostar }: Props) {
  const [raw, setRaw] = useState("");
  const lastGuess = room.guesses[room.guesses.length - 1];
  const minGuess = lastGuess ? lastGuess.value + 1 : 1;

  const display = raw ? fmt(raw) : "";
  const parsed = parseInt(raw);

  const hGuess = useCallback(() => {
    if (isNaN(parsed) || parsed < minGuess) return;
    getSocket().emit("game:guess", { value: parsed });
    setRaw("");
  }, [parsed, minGuess]);

  const hContest = useCallback(() => getSocket().emit("game:contest"), []);
  const hAccept = useCallback(() => getSocket().emit("game:contest:accept"), []);
  const hApostar = useCallback(() => getSocket().emit("game:querApostar"), []);
  const hResp = useCallback((k: boolean) => getSocket().emit("game:querApostar:response", { keep: k }), []);
  const hMosca = useCallback(() => getSocket().emit("game:naMosca"), []);

  const querApostarActive = room.activeContest?.querApostar === true;

  if (room.status === "finished") return null;

  if (isMyTurn && !hasActiveContest && !querApostarActive) {
    return (
      <div className="space-y-2.5 animate-slide-up">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <input type="text" inputMode="numeric"
              className="w-full p-4 rounded-2xl bg-surface-card border-2 border-border text-white text-xl font-mono font-black
                         placeholder:text-text-muted/30 focus:outline-none focus:border-brand/50 transition-all duration-300 touch-target text-center tracking-wider"
              placeholder={`> ${minGuess.toLocaleString("pt-BR")}`}
              value={display}
              onChange={e => setRaw(unfmt(e.target.value))}
              onKeyDown={e => e.key === "Enter" && hGuess()}
              autoFocus />
          </div>
          <button onClick={hGuess} className="flex items-center gap-2 px-7 py-4 rounded-2xl bg-gradient-to-br from-brand to-brand-dark hover:from-brand-light hover:to-brand active:scale-[0.97] text-black font-black text-lg transition-all duration-200 touch-target shadow-xl shadow-brand/30"><Send size={20} />Palpite</button>
        </div>
        {lastGuess && lastGuess.playerId !== myPlayerId ? (
          <button onClick={hContest} className="w-full flex items-center justify-center gap-3 p-4 rounded-2xl bg-gradient-to-r from-accent-danger to-accent-danger/90 hover:from-accent-danger/90 active:scale-[0.98] text-white font-black text-lg transition-all duration-200 touch-target shadow-xl shadow-accent-danger/30 tracking-wide"><Swords size={20} />Nem Ferrando!</button>
        ) : null}
        {lastGuess && room.ruleSet === "advanced" ? (
          <button onClick={hMosca} className="w-full flex items-center justify-center gap-2 p-3 rounded-2xl bg-surface-card border-2 border-accent-warning/20 hover:bg-accent-warning/5 hover:border-accent-warning/40 active:scale-[0.98] text-accent-warning font-bold text-base transition-all duration-200 touch-target"><Zap size={18} />Na Mosca!</button>
        ) : null}
      </div>
    );
  }

  if (isChallengedInQuerApostar) {
    return (
      <div className="p-4 rounded-2xl bg-surface-card border-2 border-accent-warning/20 space-y-3 animate-scale-in shadow-lg">
        <div className="flex items-center gap-2"><div className="w-8 h-8 rounded-xl bg-accent-warning/10 flex items-center justify-center"><AlertTriangle size={18} className="text-accent-warning" /></div><p className="text-accent-warning font-bold text-base">Palpite contestado!</p></div>
        <div className="flex gap-2">
          <button onClick={hAccept} className="flex-1 flex items-center justify-center gap-2 p-4 rounded-2xl bg-surface-raised border-2 border-border hover:border-white/10 active:scale-[0.98] text-text-primary font-bold transition-all duration-200 touch-target"><Hand size={18} />Aceitar</button>
          <button onClick={hApostar} className="flex-1 flex items-center justify-center gap-2 p-4 rounded-2xl bg-gradient-to-br from-accent-warning to-accent-warning/90 hover:from-accent-warning/90 active:scale-[0.98] text-black font-black text-base transition-all duration-200 touch-target shadow-xl shadow-accent-warning/30"><Swords size={18} />Quer Apostar?</button>
        </div>
      </div>
    );
  }

  if (room.activeContest?.challengerId === myPlayerId && room.activeContest?.querApostar) {
    return (
      <div className="p-4 rounded-2xl bg-surface-card border-2 border-accent-warning/20 space-y-3 animate-scale-in shadow-lg">
        <div className="flex items-center gap-2"><Swords size={18} className="text-accent-warning" /><p className="text-accent-warning font-bold text-base">Ele quer apostar! Mantem?</p></div>
        <div className="flex gap-2">
          <button onClick={() => hResp(false)} className="flex-1 flex items-center justify-center gap-2 p-4 rounded-2xl bg-surface-raised border-2 border-border hover:border-white/10 active:scale-[0.98] text-text-primary font-bold transition-all duration-200 touch-target"><Hand size={18} />Desistir</button>
          <button onClick={() => hResp(true)} className="flex-1 flex items-center justify-center gap-2 p-4 rounded-2xl bg-gradient-to-br from-accent-warning to-accent-warning/90 active:scale-[0.98] text-black font-black text-base transition-all duration-200 touch-target shadow-xl shadow-accent-warning/30"><Swords size={18} />Manter Aposta</button>
        </div>
      </div>
    );
  }

  if (hasActiveContest && !isMyTurn) {
    return <div className="flex items-center justify-center gap-2 py-4 px-3 rounded-2xl bg-surface-card border border-border animate-pulse"><div className="w-2 h-2 rounded-full bg-accent-warning animate-pulse" /><p className="text-text-muted text-sm font-medium">Decidindo...</p></div>;
  }

  return <div className="flex items-center justify-center gap-2 py-4 px-3 rounded-2xl bg-surface-card/50 border border-border"><Clock size={16} className="text-text-muted" /><p className="text-text-muted text-sm font-medium">Aguardando proximo jogador...</p></div>;
}

export default memo(GuessSection);

