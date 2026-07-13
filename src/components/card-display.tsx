"use client";

import { memo } from "react";
import { Card } from "@/game-engine/types";
import { Sparkles } from "lucide-react";
import { DuckIcon } from "./duck-icon";

const catColor: Record<string, string> = {
  "ESPORTES RADICAIS": "border-l-red-500",
  "CORPO HUMANO": "border-l-pink-500",
  "CARROS": "border-l-slate-500",
  "ARQUITETURA": "border-l-amber-500",
  "ANIMAIS": "border-l-green-500",
  "ESPACO": "border-l-indigo-500",
  "COMIDA": "border-l-orange-500",
  "BRASIL": "border-l-emerald-500",
  "MUSICA": "border-l-purple-500",
  "OCEANOS": "border-l-cyan-500",
  "CINEMA": "border-l-yellow-500",
  "HISTORIA ANTIGA": "border-l-stone-500",
  "INTERNET": "border-l-sky-500",
  "ESPORTES": "border-l-rose-500",
  "TECNOLOGIA": "border-l-blue-500",
  "DINOSSAUROS": "border-l-lime-500",
  "MEDICINA": "border-l-teal-500",
  "GEOGRAFIA": "border-l-teal-500",
  "CIENCIA": "border-l-violet-500",
};

interface Props {
  card: Card;
  questionIndex: number;
  round: number;
  animationClass?: string;
  cardKey?: string;
}

function CardDisplay({ card, questionIndex, round, animationClass = "animate-card-in", cardKey }: Props) {
  const borderColor = catColor[card.theme] || "border-l-brand";

  return (
    <div key={cardKey ?? card.id}>
      <div className="relative" style={{ perspective: "800px", minHeight: "100px" }}>
        <div
          className="absolute inset-0 animate-card-back-out"
          style={{ backfaceVisibility: "hidden" }}
        >
          <div className="w-full h-full rounded-3xl bg-surface-card border-2 border-border flex items-center justify-center">
            <div className="grid grid-cols-3 gap-3 opacity-20">
              {Array.from({ length: 9 }).map((_, i) => (
                <div key={i} className="w-5 h-6 border border-brand/30 rounded-sm rotate-45" />
              ))}
            </div>
          </div>
        </div>

        <div
          className="animate-card-front-in"
          style={{ backfaceVisibility: "hidden" }}
        >
          <div className={`relative overflow-hidden rounded-3xl bg-surface-card border-2 border-border border-l-4 ${borderColor} shadow-2xl`}>
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand to-brand-light" />
            <div className="relative p-5 space-y-4">
              <div className="flex justify-between items-start">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-raised border border-border text-brand-light text-[11px] font-black uppercase tracking-[0.15em]">
                  <Sparkles size={12} />{card.theme}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-text-muted text-[10px] font-bold uppercase tracking-wider">Rodada</span>
                  <span className="inline-flex items-center justify-center w-9 h-9 rounded-2xl bg-surface-raised border border-border text-brand-light font-black text-lg font-mono animate-float tabular-nums">
                    {round}
                  </span>
                </div>
              </div>
              <p className="text-xl text-text-primary leading-snug font-bold text-balance">{card.questions[questionIndex].text}</p>
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
      </div>
    </div>
  );
}

export default memo(CardDisplay);
