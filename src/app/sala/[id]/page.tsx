"use client";

import { useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { getSocket } from "@/lib/socket";
import { useGameStore } from "@/lib/store";

export default function RoomPage() {
  const router = useRouter();
  const params = useParams();
  const { room, myPlayerId } = useGameStore();

  useEffect(() => {
    if (!room) { router.push("/"); return; }
  }, [room, router]);

  useEffect(() => {
    const socket = getSocket();
    function onGameUpdate(updated: ReturnType<typeof useGameStore.getState>["room"]) {
      useGameStore.getState().setRoom(updated);
      if (updated && updated.status === "playing") {
        router.push(`/jogo/${params.id}`);
      }
    }
    socket.on("room:state", onGameUpdate);
    return () => { socket.off("room:state", onGameUpdate); };
  }, []);

  if (!room) return null;

  const isHost = myPlayerId === room.host;
  const canStart = room.players.length >= 2;

  const handleStart = useCallback(() => {
    if (!canStart) return;
    getSocket().emit("game:start");
  }, [canStart]);

  const handleCopyCode = useCallback(() => {
    navigator.clipboard.writeText(room.id).catch(() => {});
  }, [room.id]);

  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-4xl mb-2">🦆</h1>
          <h1 className="text-2xl font-bold">Sala de Espera</h1>
        </div>

        <div className="text-center">
          <p className="text-gray-400 text-sm">Codigo da sala</p>
          <button
            onClick={handleCopyCode}
            className="text-4xl font-mono font-bold text-purple-400 hover:text-purple-300 tracking-widest transition"
          >
            {room.id}
          </button>
          <p className="text-gray-500 text-xs mt-1">Clique para copiar</p>
        </div>

        <div>
          <p className="text-sm text-gray-400 mb-2">
            Jogadores ({room.players.length}/10)
          </p>
          <div className="space-y-2">
            {room.players.map((p) => (
              <div key={p.id} className="flex items-center gap-3 p-3 rounded-lg bg-gray-800">
                <div className={`w-3 h-3 rounded-full ${p.connected ? "bg-green-500" : "bg-yellow-500"}`} />
                <span className="flex-1">
                  {p.name}
                  {p.id === myPlayerId ? <span className="text-gray-500 ml-1">(voce)</span> : null}
                </span>
                {p.id === room.host ? <span className="text-yellow-500 text-xs font-semibold">HOST</span> : null}
              </div>
            ))}
          </div>
        </div>

        {isHost ? (
          <button
            onClick={handleStart}
            disabled={!canStart}
            className={`w-full p-4 rounded-lg font-semibold text-lg transition ${
              canStart ? "bg-green-600 hover:bg-green-500 text-white" : "bg-gray-700 text-gray-500 cursor-not-allowed"
            }`}
          >
            {canStart ? "Iniciar Partida" : "Aguardando jogadores..."}
          </button>
        ) : (
          <p className="text-center text-gray-500 text-sm">
            Aguardando o host iniciar a partida...
          </p>
        )}
      </div>
    </main>
  );
}
