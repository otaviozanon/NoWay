"use client";

import { memo } from "react";
import { Card } from "@/game-engine/types";
import { Hash, Sparkles } from "lucide-react";

const categoryColors: Record<string, { bg: string; border: string; text: string; glow: string; bar: string }> = {
  "ESPORTES RADICAIS": { bg: "bg-red-950/30", border: "border-red-500/30", text: "text-red-400", glow: "rgba(239,68,68,0.15)", bar: "from-red-500 to-red-600" },
  "CORPO HUMANO": { bg: "bg-pink-950/30", border: "border-pink-500/30", text: "text-pink-400", glow: "rgba(236,72,153,0.15)", bar: "from-pink-500 to-pink-600" },
  "CARROS": { bg: "bg-slate-800/50", border: "border-slate-500/30", text: "text-slate-400", glow: "rgba(148,163,184,0.15)", bar: "from-slate-500 to-slate-600" },
  "ARQUITETURA": { bg: "bg-amber-950/30", border: "border-amber-500/30", text: "text-amber-400", glow: "rgba(245,158,11,0.15)", bar: "from-amber-500 to-amber-600" },
  "ANIMAIS": { bg: "bg-green-950/30", border: "border-green-500/30", text: "text-green-400", glow: "rgba(34,197,94,0.15)", bar: "from-green-500 to-green-600" },
  "ESPACO": { bg: "bg-indigo-950/30", border: "border-indigo-500/30", text: "text-indigo-400", glow: "rgba(99,102,241,0.15)", bar: "from-indigo-500 to-indigo-600" },
  "COMIDA": { bg: "bg-orange-950/30", border: "border-orange-500/30", text: "text-orange-400", glow: "rgba(249,115,22,0.15)", bar: "from-orange-500 to-orange-600" },
  "DINOSSAUROS": { bg: "bg-lime-950/30", border: "border-lime-500/30", text: "text-lime-400", glow: "rgba(132,204,22,0.15)", bar: "from-lime-500 to-lime-600" },
  "BRASIL": { bg: "bg-emerald-950/30", border: "border-emerald-500/30", text: "text-emerald-400", glow: "rgba(16,185,129,0.15)", bar: "from-emerald-500 to-emerald-600" },
  "MUSICA": { bg: "bg-purple-950/30", border: "border-purple-500/30", text: "text-purple-400", glow: "rgba(168,85,247,0.15)", bar: "from-purple-500 to-purple-600" },
  "OCEANOS": { bg: "bg-cyan-950/30", border: "border-cyan-500/30", text: "text-cyan-400", glow: "rgba(6,182,212,0.15)", bar: "from-cyan-500 to-cyan-600" },
  "CINEMA": { bg: "bg-yellow-950/30", border: "border-yellow-500/30", text: "text-yellow-400", glow: "rgba(234,179,8,0.15)", bar: "from-yellow-500 to-yellow-600" },
  "HISTORIA ANTIGA": { bg: "bg-stone-800/50", border: "border-stone-500/30", text: "text-stone-400", glow: "rgba(168,162,158,0.15)", bar: "from-stone-500 to-stone-600" },
  "INTERNET": { bg: "bg-sky-950/30", border: "border-sky-500/30", text: "text-sky-400", glow: "rgba(14,165,233,0.15)", bar: "from-sky-500 to-sky-600" },
  "ESPORTES": { bg: "bg-rose-950/30", border: "border-rose-500/30", text: "text-rose-400", glow: "rgba(244,63,94,0.15)", bar: "from-rose-500 to-rose-600" },
  "TECNOLOGIA": { bg: "bg-blue-950/30", border: "border-blue-500/30", text: "text-blue-400", glow: "rgba(59,130,246,0.15)", bar: "from-blue-500 to-blue-600" },
};

const defaultColor = { bg: "bg-surface-card", border: "border-white/5", text: "text-brand-light", glow: "rgba(249,115,22,0.1)", bar: "from-brand to-brand-light" };

interface Props { card: Card; questionIndex: number; round: number; }

function CardDisplay({ card, questionIndex, round }: Props) {
  const colors = categoryColors[card.theme] || defaultColor;

  return (
    <div className="animate-card-in" key={card.id}>
      <div className={`relative overflow-hidden rounded-3xl ${colors.bg} border-2 ${colors.border} shadow-2xl`} style={{ boxShadow: `0 20px 60px ${colors.glow}` }}>
        <div className={`absolute inset-0 opacity-5 bg-[radial-gradient(circle_at_30%_20%,${colors.glow.replace('0.15','0.3')},transparent)]`} />
        <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${colors.bar}`} />

        <div className="relative p-7 space-y-5">
          <div className="flex justify-between items-start">
            <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl ${colors.bg} border ${colors.border} ${colors.text} text-xs font-black uppercase tracking-[0.15em]`}>
              <Sparkles size={14} />{card.theme}
            </span>
            <div className="flex items-center gap-2">
              <span className="text-text-muted text-[10px] font-medium uppercase tracking-wider">Rodada</span>
              <span className="inline-flex items-center justify-center w-11 h-11 rounded-2xl bg-surface-raised border border-white/5 text-brand-light font-black text-xl font-mono animate-float tabular-nums">
                {round}
              </span>
            </div>
          </div>

          <p className="text-2xl text-text-primary leading-snug font-bold text-balance">
            {card.questions[questionIndex].text}
          </p>

          <div className="flex items-center justify-between">
            <span className="text-xs text-text-muted">Pergunta {questionIndex + 1}</span>
            <div className="flex items-center gap-1">
              {Array.from({ length: card.patoPoints }).map((_, i) => (
                <svg key={i} width="14" height="14" viewBox="0 0 24 24" className="text-accent-warning">
                  <path d="M12 2c-3 0-6 5-6 9 0 3 2 6 6 8 4-2 6-5 6-8 0-4-3-9-6-9z" fill="currentColor" opacity="0.3" />
                  <path d="M12 4c-2 0-4 3-4 6 0 2 1.5 4 4 5.5 2.5-1.5 4-3.5 4-5.5 0-3-2-6-4-6z" fill="currentColor" />
                </svg>
              ))}
            </div>
          </div>

          <div className="w-full h-1.5 rounded-full bg-surface-raised/50 overflow-hidden">
            <div className={`h-full rounded-full bg-gradient-to-r ${colors.bar} transition-all duration-700 ease-out`}
                 style={{ width: `${(round / 10) * 100}%` }} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default memo(CardDisplay);
