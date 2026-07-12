"use client";

import { GameResult } from "@/game-engine/types";
import { calculateScore } from "@/game-engine/scoring";
import { getSocket } from "@/lib/socket";

interface Props {
  result: GameResult;
  ruleSet: "basic" | "advanced";
}

export default function GameResultDisplay({ result, ruleSet }: Props) {
  const sorted = [...result.players].sort((a, b) => calculateScore(a, ruleSet) - calculateScore(b, ruleSet));

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-2">Fim de Jogo!</h2>
        <p className="text-gray-400">O grande perdedor e...</p>
      </div>

      <div className="text-center p-6 rounded-xl bg-red-900/30 border border-red-700">
        <div className="text-6xl mb-3">🦆</div>
        <div className="text-2xl font-bold text-red-400">
          {result.isTie ? "Empate! Multiplos patos!" : result.loser.name}
        </div>
      </div>

      <div className="space-y-2">
        {sorted.map((p) => (
          <div
            key={p.id}
            className={`flex items-center justify-between p-3 rounded-lg ${
              p.id === result.loser.id && !result.isTie ? "bg-red-900/20 border border-red-800" : "bg-gray-800"
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-lg">{p.id === result.loser.id && !result.isTie ? "❌" : "✅"}</span>
              <span className={p.id === result.loser.id && !result.isTie ? "text-red-300" : ""}>{p.name}</span>
            </div>
            <span className="text-gray-400">
              {calculateScore(p, ruleSet)} {ruleSet === "advanced" ? "pts" : "cartas"}
            </span>
          </div>
        ))}
      </div>

      <p className="text-center text-yellow-400 text-sm bg-gray-800 p-3 rounded-lg">
        Tire uma foto do Pato da Mesa! #patodamesa
      </p>

      <button
        onClick={() => getSocket().emit("game:playAgain")}
        className="w-full p-4 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-semibold text-lg transition"
      >
        Nova Partida
      </button>
    </div>
  );
}
