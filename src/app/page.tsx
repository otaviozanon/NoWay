"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { connectSocket, getSocket } from "@/lib/socket";
import { setupSocketListeners, useGameStore } from "@/lib/store";
import { Room } from "@/game-engine/types";

export default function HomePage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [roomCode, setRoomCode] = useState("");
  const [ruleSet, setRuleSet] = useState<"basic" | "advanced">("advanced");
  const { error, setError } = useGameStore();

  useEffect(() => {
    setupSocketListeners();
    connectSocket();
  }, []);

  useEffect(() => {
    const socket = getSocket();
    function onRoomState(room: Room) {
      router.push(`/sala/${room.id}`);
    }
    socket.on("room:state", onRoomState);
    return () => { socket.off("room:state", onRoomState); };
  }, [router]);

  const handleCreate = useCallback(() => {
    if (!name.trim()) { setError("Digite seu nome"); return; }
    getSocket().emit("room:create", { playerName: name.trim(), ruleSet });
  }, [name, ruleSet, setError]);

  const handleJoin = useCallback(() => {
    if (!name.trim()) { setError("Digite seu nome"); return; }
    if (!roomCode.trim()) { setError("Digite o codigo da sala"); return; }
    getSocket().emit("room:join", { roomId: roomCode.trim().toUpperCase(), playerName: name.trim() });
  }, [name, roomCode, setError]);

  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-5xl font-bold mb-2">🦆</h1>
          <h1 className="text-4xl font-bold">Nem a Pato!</h1>
          <p className="text-gray-400 mt-2">Jogo de blefe e curiosidades</p>
        </div>

        <input
          className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500"
          placeholder="Seu nome"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={20}
        />

        <div className="flex gap-2">
          <button
            onClick={() => setRuleSet("basic")}
            className={`flex-1 p-2 rounded-lg border text-sm font-medium transition ${
              ruleSet === "basic" ? "border-purple-500 bg-purple-500/20 text-purple-300" : "border-gray-700 text-gray-400 hover:border-gray-600"
            }`}
          >
            Regras Basicas
          </button>
          <button
            onClick={() => setRuleSet("advanced")}
            className={`flex-1 p-2 rounded-lg border text-sm font-medium transition ${
              ruleSet === "advanced" ? "border-purple-500 bg-purple-500/20 text-purple-300" : "border-gray-700 text-gray-400 hover:border-gray-600"
            }`}
          >
            Regras Avancadas
          </button>
        </div>

        <button
          onClick={handleCreate}
          className="w-full p-4 rounded-lg bg-purple-600 hover:bg-purple-500 active:bg-purple-700 text-white font-semibold text-lg transition"
        >
          Criar Sala
        </button>

        <div className="flex items-center gap-2">
          <div className="flex-1 border-t border-gray-700" />
          <span className="text-gray-500 text-sm">ou entre em uma sala</span>
          <div className="flex-1 border-t border-gray-700" />
        </div>

        <input
          className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 uppercase tracking-widest text-center text-lg"
          placeholder="Codigo"
          value={roomCode}
          onChange={(e) => setRoomCode(e.target.value)}
          maxLength={6}
        />

        <button
          onClick={handleJoin}
          className="w-full p-4 rounded-lg bg-gray-700 hover:bg-gray-600 active:bg-gray-500 text-white font-semibold text-lg transition"
        >
          Entrar na Sala
        </button>

        {error ? (
          <div className="p-3 rounded-lg bg-red-900/50 border border-red-700 text-red-300 text-sm text-center animate-pulse">
            {error}
          </div>
        ) : null}
      </div>
    </main>
  );
}
