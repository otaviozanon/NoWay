"use client";

import { useState } from "react";
import { BookOpen, X, ChevronRight, Star, Sparkles } from "lucide-react";

export default function RulesModal() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 px-5 py-3 rounded-2xl
                   bg-surface-card border-2 border-white/10 hover:border-brand/40
                   text-text-secondary hover:text-brand-light
                   transition-all duration-300 shadow-xl hover:shadow-brand/10
                   active:scale-95 touch-target group"
      >
        <BookOpen size={18} className="group-hover:scale-110 transition-transform" />
        <span className="text-sm font-bold">Regras</span>
      </button>

      {open ? (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div className="relative w-full max-w-lg max-h-[85vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl
                          bg-surface-raised border-2 border-white/10 shadow-2xl animate-scale-in">
            <div className="sticky top-0 z-10 bg-surface-raised border-b border-white/5 px-6 py-4 flex items-center justify-between rounded-t-3xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-brand/10 border border-brand/20 flex items-center justify-center">
                  <BookOpen size={20} className="text-brand-light" />
                </div>
                <h2 className="text-xl font-black text-text-primary">Manual de Regras</h2>
              </div>
              <button onClick={() => setOpen(false)} className="p-2 rounded-xl hover:bg-surface-card transition-colors touch-target">
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="p-4 rounded-2xl bg-brand/5 border border-brand/20 text-sm text-brand-light font-medium text-center">
                <Sparkles size={16} className="inline mr-1" />
                Versao digital multiplayer. Crie uma sala, compartilhe o codigo e joguem online!
              </div>

              <Section icon={<Sparkles size={14} />} title="Objetivo">
                <p>Uma pergunta aparece na tela com resposta <strong>numerica</strong>. De palpites, blefe e <strong>evite acumular cartas</strong> — quem tiver <strong className="text-accent-danger">mais cartas perde</strong>!</p>
              </Section>

              <Section title="Como Jogar">
                <ol className="list-decimal pl-5 space-y-1.5">
                  <li>O sistema sorteia uma pergunta aleatoria.</li>
                  <li>Voce da um <strong>palpite numerico</strong>.</li>
                  <li>Proximo jogador: <strong>palpite maior</strong> ou <strong className="text-accent-danger">NoWay!</strong> (contestar).</li>
                  <li>Quem contestar e tiver razao <strong>nao recebe a carta</strong>.</li>
                </ol>
              </Section>

              <Section title="NoWay! (Contestacao)">
                <div className="grid grid-cols-2 gap-2 mt-1">
                  <div className="p-3 rounded-xl bg-accent-danger/10 border border-accent-danger/20 text-xs">
                    <strong className="text-accent-danger">Palpite &gt; resposta</strong>
                    <p className="text-text-secondary mt-1">Quem deu o palpite recebe a carta</p>
                  </div>
                  <div className="p-3 rounded-xl bg-accent-success/10 border border-accent-success/20 text-xs">
                    <strong className="text-accent-success">Palpite &le; resposta</strong>
                    <p className="text-text-secondary mt-1">Quem contestou recebe a carta</p>
                  </div>
                </div>
              </Section>

              <Section title="Fim da Partida">
                <p><strong>10 rodadas</strong>. Mais cartas = <strong className="text-accent-danger">perdeu</strong>. Empate desempata por Pontos de Pato.</p>
              </Section>

              <div className="border-t border-white/5 pt-4">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-accent-warning/10 border border-accent-warning/20 flex items-center justify-center">
                    <Star size={16} className="text-accent-warning" />
                  </div>
                  <h3 className="text-lg font-black text-accent-warning">Regras Avancadas</h3>
                </div>

                <Section title="Pontos de Pato">Conta-se pontos de pato nas cartas (2-3 pts) ao inves de quantidade. Empate → desempata por cartas.</Section>
                <Section title="Quer Apostar?">Ao ser contestado, intimide o oponente. Se ele mantiver, quem perder leva <strong className="text-accent-danger">2 cartas</strong>.</Section>
                <Section title="Dobrei!">Palpite &ge; 2x o anterior → ganha Carta Dobrei (anula 1 Ponto de Pato).</Section>
                <Section title="Na Mosca!">Certeza absoluta? Acertou → ninguem ganha carta. Errou → <strong className="text-accent-danger">leva TODAS as cartas</strong>.</Section>
              </div>

              <p className="text-center text-text-muted text-xs pt-2">
                Jogo original por <strong>Rodrigo Rego</strong> &middot; Grok Games<br />Versao digital fan-made
              </p>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

function Section({ title, children, icon }: { title: string; children: React.ReactNode; icon?: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <h3 className="text-xs font-black text-brand-light uppercase tracking-widest flex items-center gap-1.5">
        {icon}<ChevronRight size={12} />{title}
      </h3>
      <div className="text-sm text-text-secondary space-y-1 leading-relaxed">{children}</div>
    </div>
  );
}
