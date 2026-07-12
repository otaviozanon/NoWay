"use client";

import { memo } from "react";
import { Card } from "@/game-engine/types";
import { Sparkles } from "lucide-react";
import { DuckIcon } from "./duck-icon";

const catColor: Record<string, string> = {
  "ESPORTES RADICAIS": "border-l-red-500/20",
  "CORPO HUMANO": "border-l-pink-500/20",
  "CARROS": "border-l-slate-500/20",
  "ARQUITETURA": "border-l-amber-500/20",
  "ANIMAIS": "border-l-green-500/20",
  "ESPACO": "border-l-indigo-500/20",
  "COMIDA": "border-l-orange-500/20",
  "BRASIL": "border-l-emerald-500/20",
  "MUSICA": "border-l-purple-500/20",
  "OCEANOS": "border-l-cyan-500/20",
  "CINEMA": "border-l-yellow-500/20",
  "HISTORIA ANTIGA": "border-l-stone-500/20",
  "INTERNET": "border-l-sky-500/20",
  "ESPORTES": "border-l-rose-500/20",
  "TECNOLOGIA": "border-l-blue-500/20",
  "DINOSSAUROS": "border-l-lime-500/20",
  "MEDICINA": "border-l-teal-500/20",
  "GEOGRAFIA": "border-l-teal-500/20",
  "CIENCIA": "border-l-violet-500/20",
};

interface Props { card: Card; questionIndex: number; round: number; }

function CardDisplay({ card, questionIndex, round }: Props) {
  const borderL = catColor[card.theme] || "border-l-brand/20";

  return (
    <div className="animate-card-in" key={card.id}>
      <div className={`relative overflow-hidden rounded-3xl bg-surface-card border-2 border-border ${borderL} shadow-2xl`}>
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand to-brand-light" />
        <div className="relative p-7 space-y-5">
          <div className="flex justify-between items-start">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-surface-raised border border-border text-brand-light text-xs font-black uppercase tracking-[0.15em]">
              <Sparkles size={14} />{card.theme}
            </span>
            <div className="flex items-center gap-2">
              <span className="text-text-muted text-[10px] font-bold uppercase tracking-wider">Rodada</span>
              <span className="inline-flex items-center justify-center w-11 h-11 rounded-2xl bg-surface-raised border border-border text-brand-light font-black text-xl font-mono animate-float tabular-nums">
                {round}
              </span>
            </div>
          </div>
          <p className="text-2xl text-text-primary leading-snug font-bold text-balance">{card.questions[questionIndex].text}</p>
          <div className="flex items-center justify-between">
            <span className="text-xs text-text-muted">Pergunta {questionIndex + 1}</span>
            <div className="flex items-center gap-1 text-accent-warning">
              {Array.from({ length: card.patoPoints }).map((_, i) => (
                <DuckIcon key={i} size={18} />
              ))}
            </div>
          </div>
          <div className="w-full h-1 rounded-full bg-surface-raised overflow-hidden">
            <div className="h-full rounded-full bg-gradient-to-r from-brand to-brand-light transition-all duration-700 ease-out"
                 style={{ width: `${(round / 10) * 100}%` }} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default memo(CardDisplay);
