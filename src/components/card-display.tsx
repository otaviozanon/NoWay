"use client";

import { memo } from "react";
import { Card } from "@/game-engine/types";
import { Hash } from "lucide-react";

interface Props { card: Card; questionIndex: number; round: number; }

function CardDisplay({ card, questionIndex, round }: Props) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-surface-card border border-white/5 shadow-lg animate-slide-up">
      <div className="absolute top-0 left-0 w-1.5 h-full bg-brand" />
      <div className="p-6 space-y-4">
        <div className="flex justify-between items-start">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand/10 text-brand-light text-xs font-semibold uppercase tracking-wider">
            <Hash size={12} />{card.theme}
          </span>
          <span className="text-text-muted text-sm font-mono tabular-nums">{round}/10</span>
        </div>
        <p className="text-xl text-text-primary leading-relaxed font-medium">&ldquo;{card.questions[questionIndex].text}&rdquo;</p>
        <div className="flex items-center gap-3 text-xs text-text-muted">
          <span>Pergunta {questionIndex + 1}/6</span>
          <span className="w-1 h-1 rounded-full bg-text-muted" />
          <span>{card.patoPoints} Pontos de Pato</span>
        </div>
      </div>
    </div>
  );
}

export default memo(CardDisplay);
