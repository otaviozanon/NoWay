"use client";

import { Card } from "@/game-engine/types";

interface Props {
  card: Card;
  questionIndex: number;
  round: number;
}

export default function CardDisplay({ card, questionIndex, round }: Props) {
  return (
    <div className="bg-gray-800 rounded-xl p-6 border-l-4 border-purple-500">
      <div className="flex justify-between items-start mb-4">
        <span className="text-purple-400 text-sm font-semibold uppercase tracking-wide">
          {card.theme}
        </span>
        <span className="text-gray-500 text-sm">Rodada {round}/10</span>
      </div>
      <p className="text-xl text-white leading-relaxed">
        &ldquo;{card.questions[questionIndex].text}&rdquo;
      </p>
      <div className="mt-3 text-gray-500 text-xs">
        Pergunta {questionIndex + 1}/6 &middot; {card.patoPoints} Pontos de Pato
      </div>
    </div>
  );
}
