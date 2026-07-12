"use client";

import { memo } from "react";
import { Card } from "@/game-engine/types";
import { Sparkles } from "lucide-react";

const categoryColors: Record<string, { bg: string; border: string; text: string; glow: string }> = {
  "ESPORTES RADICAIS": { bg: "bg-red-950/40", border: "border-red-500/20", text: "text-red-400", glow: "rgba(239,68,68,0.1)" },
  "CORPO HUMANO": { bg: "bg-pink-950/40", border: "border-pink-500/20", text: "text-pink-400", glow: "rgba(236,72,153,0.1)" },
  "CARROS": { bg: "bg-slate-900/40", border: "border-slate-500/20", text: "text-slate-400", glow: "rgba(148,163,184,0.1)" },
  "ARQUITETURA": { bg: "bg-amber-950/40", border: "border-amber-500/20", text: "text-amber-400", glow: "rgba(245,158,11,0.1)" },
  "ANIMAIS": { bg: "bg-green-950/40", border: "border-green-500/20", text: "text-green-400", glow: "rgba(34,197,94,0.1)" },
  "ESPACO": { bg: "bg-indigo-950/40", border: "border-indigo-500/20", text: "text-indigo-400", glow: "rgba(99,102,241,0.1)" },
  "COMIDA": { bg: "bg-orange-950/40", border: "border-orange-500/20", text: "text-orange-400", glow: "rgba(249,115,22,0.1)" },
  "BRASIL": { bg: "bg-emerald-950/40", border: "border-emerald-500/20", text: "text-emerald-400", glow: "rgba(16,185,129,0.1)" },
  "MUSICA": { bg: "bg-purple-950/40", border: "border-purple-500/20", text: "text-purple-400", glow: "rgba(168,85,247,0.1)" },
  "OCEANOS": { bg: "bg-cyan-950/40", border: "border-cyan-500/20", text: "text-cyan-400", glow: "rgba(6,182,212,0.1)" },
  "CINEMA": { bg: "bg-yellow-950/40", border: "border-yellow-500/20", text: "text-yellow-400", glow: "rgba(234,179,8,0.1)" },
};

const def = { bg: "bg-surface-card", border: "border-brand/20", text: "text-brand-light", glow: "rgba(245,158,11,0.08)" };

interface Props { card: Card; questionIndex: number; round: number; }

function CardDisplay({ card, questionIndex, round }: Props) {
  const c = categoryColors[card.theme] || def;

  return (
    <div className="animate-card-in" key={card.id}>
      <div className={`relative overflow-hidden rounded-3xl ${c.bg} border-2 ${c.border} shadow-2xl`}
           style={{ boxShadow: `0 20px 60px ${c.glow}` }}>
        <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${c.border.includes('brand') ? 'from-brand to-brand-light' : `from-current to-current`}`} />
        <div className="relative p-7 space-y-5">
          <div className="flex justify-between items-start">
            <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl ${c.bg} border ${c.border} ${c.text} text-xs font-black uppercase tracking-[0.15em]`}>
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
            <div className="flex items-center gap-1">
              {Array.from({ length: card.patoPoints }).map((_, i) => (
                <svg key={i} width="14" height="14" viewBox="0 0 24 24" className="text-accent-warning"><path d="M12 2c-3 0-6 5-6 9 0 3 2 6 6 8 4-2 6-5 6-8 0-4-3-9-6-9z" fill="currentColor" opacity="0.3" /><path d="M12 4c-2 0-4 3-4 6 0 2 1.5 4 4 5.5 2.5-1.5 4-3.5 4-5.5 0-3-2-6-4-6z" fill="currentColor" /></svg>
              ))}
            </div>
          </div>
          <div className="w-full h-1 rounded-full bg-surface-raised overflow-hidden">
            <div className={`h-full rounded-full bg-gradient-to-r from-brand to-brand-light transition-all duration-700 ease-out`} style={{ width: `${(round / 10) * 100}%` }} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default memo(CardDisplay);
