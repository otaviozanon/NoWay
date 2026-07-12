"use client";

import { useState, useCallback, memo } from "react";
import { getSocket } from "@/lib/socket";
import { Room } from "@/game-engine/types";

interface Props {
  room: Room;
  myPlayerId: string | null;
  isMyTurn: boolean;
  hasActiveContest: boolean;
  isChallengedInQuerApostar: boolean;
}

function GuessSection({ room, myPlayerId, isMyTurn, hasActiveContest, isChallengedInQuerApostar }: Props) {
  const [guessValue, setGuessValue] = useState("");
  const lastGuess = room.guesses[room.guesses.length - 1];
  const minGuess = lastGuess ? lastGuess.value + 1 : 1;

  const handleGuess = useCallback(() => {
    const val = parseInt(guessValue);
    if (isNaN(val) || val < minGuess) return;
    getSocket().emit("game:guess", { value: val });
    setGuessValue("");
  }, [guessValue, minGuess]);

  const handleContest = useCallback(() => { getSocket().emit("game:contest"); }, []);
  const handleQuerApostar = useCallback(() => { getSocket().emit("game:querApostar"); }, []);
  const handleApostarResponse = useCallback((keep: boolean) => { getSocket().emit("game:querApostar:response", { keep }); }, []);
  const handleNaMosca = useCallback(() => { getSocket().emit("game:naMosca"); }, []);

  if (room.status === "finished") return null;

  if (isMyTurn && !hasActiveContest) {
    return (
      <div className="space-y-4">
        <div className="flex gap-3">
          <input
            type="number"
            min={minGuess}
            className="flex-1 p-4 rounded-lg bg-gray-800 border border-gray-700 text-white text-xl font-mono"
            placeholder={`Maior que ${minGuess - 1}`}
            value={guessValue}
            onChange={(e) => setGuessValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" ? handleGuess() : null}
            autoFocus
          />
          <button onClick={handleGuess} className="px-8 py-4 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold text-lg transition">
            Palpite
          </button>
        </div>
        {lastGuess && lastGuess.playerId !== myPlayerId ? (
          <button onClick={handleContest} className="w-full p-4 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold text-xl transition">
            Nem a Pato!
          </button>
        ) : null}
        {lastGuess && room.ruleSet === "advanced" ? (
          <button onClick={handleNaMosca} className="w-full p-3 rounded-lg bg-yellow-600 hover:bg-yellow-500 text-white font-semibold transition">
            Na Mosca!
          </button>
        ) : null}
      </div>
    );
  }

  if (isChallengedInQuerApostar) {
    return (
      <div className="p-4 rounded-lg bg-orange-900/50 border border-orange-700 space-y-3">
        <p className="text-orange-300 font-semibold text-lg">Seu palpite foi contestado!</p>
        <div className="flex gap-3">
          <button onClick={() => handleApostarResponse(false)} className="flex-1 p-4 rounded-lg bg-gray-700 hover:bg-gray-600 text-white font-semibold transition">
            Aceitar
          </button>
          <button onClick={handleQuerApostar} className="flex-1 p-4 rounded-lg bg-orange-600 hover:bg-orange-500 text-white font-bold text-lg transition">
            Quer Apostar?
          </button>
        </div>
      </div>
    );
  }

  if (hasActiveContest && !isMyTurn) {
    return <p className="text-center text-gray-400 py-4">Aguardando resposta da aposta...</p>;
  }

  return (
    <p className="text-center text-gray-400 py-4">
      Aguardando o turno de outro jogador...
    </p>
  );
}

export default memo(GuessSection);
