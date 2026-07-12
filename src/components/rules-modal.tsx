"use client";

import { useState } from "react";
import { BookOpen, X, ChevronRight, Star } from "lucide-react";

export default function RulesModal() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-5 right-5 z-40 flex items-center gap-2 px-4 py-3 rounded-xl
                   bg-surface-raised border border-white/10 hover:border-brand/30
                   text-text-secondary hover:text-brand-light
                   transition-all duration-200 shadow-lg touch-target"
      >
        <BookOpen size={18} />
        <span className="text-sm font-medium">Regras</span>
      </button>

      {open ? (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60" onClick={() => setOpen(false)} />
          <div className="relative w-full max-w-lg max-h-[85vh] overflow-y-auto rounded-t-2xl sm:rounded-2xl
                          bg-surface-raised border border-white/10 shadow-2xl animate-slide-up p-6 space-y-6">
            <div className="flex items-center justify-between sticky top-0 bg-surface-raised pb-3 border-b border-white/5">
              <div className="flex items-center gap-2">
                <BookOpen size={20} className="text-brand-light" />
                <h2 className="text-xl font-bold text-text-primary">Manual de Regras</h2>
              </div>
              <button onClick={() => setOpen(false)} className="p-2 rounded-lg hover:bg-surface-card transition-colors touch-target">
                <X size={20} />
              </button>
            </div>

            <div className="p-3 rounded-lg bg-brand/10 border border-brand/20 text-sm text-brand-light">
              Esta e uma versao digital e multiplayer do jogo. Crie uma sala, compartilhe o codigo com seus amigos e joguem online!
            </div>

            <Section title="Objetivo do Jogo">
              <p>Em cada rodada, uma pergunta aparece na tela. As respostas sempre sao um <strong>numero</strong>.</p>
              <p>No final da partida, o jogador com <strong className="text-accent-danger">mais cartas e o perdedor</strong>. Todos os outros vencem!</p>
            </Section>

            <Section title="Como Jogar">
              <ol className="list-decimal pl-5 space-y-2">
                <li>O sistema embaralha as cartas automaticamente e sorteia uma pergunta.</li>
                <li>O jogador da vez da um <strong>palpite numerico</strong>.</li>
                <li>O proximo jogador escolhe: <strong>dar um palpite maior</strong> ou clicar em <strong>NoWay!</strong> para contestar.</li>
                <li>Os palpites continuam ate alguem contestar.</li>
              </ol>
            </Section>

            <Section title="NoWay! (Contestacao)">
              <p>Ao contestar, a resposta correta e revelada:</p>
              <div className="grid grid-cols-2 gap-3 mt-2">
                <div className="p-3 rounded-lg bg-accent-danger/10 border border-accent-danger/20 text-sm">
                  <strong className="text-accent-danger">Palpite &gt; resposta</strong>
                  <p className="text-text-secondary mt-1">Quem deu o palpite <strong>recebe a carta</strong></p>
                </div>
                <div className="p-3 rounded-lg bg-accent-success/10 border border-accent-success/20 text-sm">
                  <strong className="text-accent-success">Palpite &le; resposta</strong>
                  <p className="text-text-secondary mt-1">Quem contestou <strong>recebe a carta</strong></p>
                </div>
              </div>
              <p className="mt-2 text-sm text-text-muted">Quem contestou sera o primeiro a jogar na proxima rodada.</p>
            </Section>

            <Section title="Fim da Partida">
              <p>Apos <strong>10 rodadas</strong>, quem tiver mais cartas e o <strong className="text-accent-danger">grande perdedor</strong>.</p>
              <p>Empate: desempata por <strong>Pontos de Pato</strong> (icone nas cartas).</p>
              <div className="mt-2 p-3 rounded-lg bg-accent-warning/10 border border-accent-warning/20 text-sm text-accent-warning">
                Tire um print do <strong>&quot;Pato da Mesa&quot;</strong> e poste com <span className="font-mono">#patodamesa</span>
              </div>
            </Section>

            <div className="border-t border-white/5 pt-4">
              <div className="flex items-center gap-2 mb-4">
                <Star size={18} className="text-accent-warning" />
                <h3 className="text-lg font-bold text-accent-warning">Regras Avancadas</h3>
                <span className="text-xs text-text-muted ml-auto">ative ao criar a sala</span>
              </div>

              <Section title="Pontos de Pato">
                <p>Ao inves de contar quantidade de cartas, o sistema conta os <strong>Pontos de Pato</strong>. Cada carta vale 2 ou 3 pontos.</p>
                <p>Empate: desempata por quantidade de cartas.</p>
              </Section>

              <Section title="Quer Apostar?">
                <p>Quando seu palpite for contestado, voce pode intimidar o oponente:</p>
                <ul className="list-disc pl-5 space-y-1 mt-1">
                  <li><strong>Aceitar:</strong> resolucao normal</li>
                  <li><strong>Quer Apostar?:</strong> se o desafiante mantiver a contestacao, quem perder recebe <strong className="text-accent-danger">2 cartas</strong> (a da rodada + a proxima da pilha)</li>
                </ul>
              </Section>

              <Section title="Dobrei!">
                <p>Se seu palpite for pelo menos <strong>o dobro</strong> do palpite anterior, voce ganha uma <strong>Carta Dobrei</strong> automaticamente.</p>
                <p>Cada Carta Dobrei anula <strong>1 Ponto de Pato</strong> na contagem final. O sistema mostra quantas voce tem ao lado do seu nome.</p>
              </Section>

              <Section title="Na Mosca!">
                <p>Se voce tem certeza que o palpite anterior e <strong>exatamente</strong> a resposta:</p>
                <ul className="list-disc pl-5 space-y-1 mt-1">
                  <li><strong className="text-accent-success">Acertou:</strong> ninguem recebe carta nesta rodada</li>
                  <li><strong className="text-accent-danger">Errou:</strong> voce recebe TODAS as cartas restantes e perde a partida</li>
                </ul>
              </Section>
            </div>

            <div className="border-t border-white/5 pt-4">
              <Section title="Dicas">
                <ul className="list-disc pl-5 space-y-1">
                  <li>Crie uma sala e compartilhe o <strong>codigo de 6 digitos</strong> com seus amigos.</li>
                  <li>De <strong>2 a 10 jogadores</strong> por sala.</li>
                  <li>Escolha entre <strong>Regras Basicas</strong> ou <strong>Avancadas</strong> ao criar a sala.</li>
                  <li>Cada partida dura exatamente <strong>10 rodadas</strong>.</li>
                  <li>As cartas ja usadas nao se repetem na mesma partida.</li>
                </ul>
              </Section>
            </div>

            <p className="text-center text-text-muted text-xs pt-2">
              Jogo original criado por <strong>Rodrigo Rego</strong> &middot; Editora Grok Games
              <br />Versao digital fan-made
            </p>
          </div>
        </div>
      ) : null}
    </>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-brand-light uppercase tracking-wider mb-2 flex items-center gap-1">
        <ChevronRight size={14} />{title}
      </h3>
      <div className="text-sm text-text-secondary space-y-1 leading-relaxed">{children}</div>
    </div>
  );
}
