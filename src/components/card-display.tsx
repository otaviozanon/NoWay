"use client";

import { memo } from "react";
import { Card } from "@/game-engine/types";
import { Hash, Sparkles } from "lucide-react";

interface Props { card: Card; questionIndex: number; round: number; }

function CardDisplay({ card, questionIndex, round }: Props) {
  return (
    <div className="animate-card-in">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-surface-card via-surface-card to-surface-overlay border border-white/5 shadow-2xl">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand via-brand-light to-brand" />
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-brand/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-brand/3 rounded-full blur-2xl" />

        <div className="relative p-6 space-y-5">
          <div className="flex justify-between items-start">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand/10 border border-brand/20 text-brand-light text-xs font-bold uppercase tracking-[0.15em]">
              <Sparkles size={14} className="text-brand-light" />
              {card.theme}
            </span>
            <div className="flex items-center gap-3">
              <span className="text-text-muted text-xs font-mono">Rodada</span>
              <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-surface-raised border border-white/5 text-brand-light font-bold text-lg font-mono animate-float">
                {round}
              </span>
              <span className="text-text-muted text-xs">/10</span>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -left-3 top-0 bottom-0 w-1 rounded-full bg-gradient-to-b from-brand to-transparent" />
            <p className="pl-4 text-xl text-text-primary leading-relaxed font-semibold text-balance">
              {card.questions[questionIndex].text}
            </p>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-text-muted">
              <Hash size={12} />
              <span>Pergunta {questionIndex + 1}</span>
            </div>
            <div className="flex items-center gap-1.5">
              {Array.from({ length: card.patoPoints }).map((_, i) => (
                <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-accent-warning">
                  <path d="M12 2c-3 0-6 5-6 9 0 3 2 6 6 8 4-2 6-5 6-8 0-4-3-9-6-9z" fill="currentColor" opacity="0.3" />
                  <path d="M12 4c-2 0-4 3-4 6 0 2 1.5 4 4 5.5 2.5-1.5 4-3.5 4-5.5 0-3-2-6-4-6z" fill="currentColor" />
                  <circle cx="10" cy="8" r="1" fill="var(--color-surface-card)" />
                  <circle cx="14" cy="8" r="1" fill="var(--color-surface-card)" />
                  <path d="M10 10c0 1 1 1.5 2 1.5s2-.5 2-1.5" stroke="var(--color-surface-card)" strokeWidth="0.5" />
                </svg>
              ))}
            </div>
          </div>

          <div className="w-full h-1.5 rounded-full bg-surface-raised overflow-hidden">
            <div className="h-full rounded-full bg-gradient-to-r from-brand to-brand-light transition-all duration-500 ease-out"
                 style={{ width: `${(round / 10) * 100}%` }} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default memo(CardDisplay);
