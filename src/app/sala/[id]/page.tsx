"use client";

import { useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { getSocket } from "@/lib/socket";
import { useGameStore } from "@/lib/store";

function Icon({ d, size = 20 }: { d: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d={d} />
    </svg>
  );
}

const CopyIcon = "M8 17.929H6c-1.105 0-2-.912-2-2.036V5.036C4 3.91 4.895 3 6 3h8c1.105 0 2 .911 2 2.036v1.866m-6 .17h8c1.105 0 2 .91 2 2.035v10.857C20 21.09 19.105 22 18 22h-8c-1.105 0-2-.911-2-2.036V9.107c0-1.124.895-2.036 2-2.036z";
const PlayIcon = "M5 3l14 9-14 9V3z";
const UsersIcon = "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2 M22 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75 M8 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8z";
const CrownIcon = "M2 4l3 12h14l3-12-6 7-4-7-4 7-6-7z M2 17l2 4h16l2-4";
const WifiOffIcon = "M1 1l22 22 M16.72 11.06A10.94 10.94 0 0 1 19 12.55 M5 12.55a10.94 10.94 0 0 1 5.17-2.39 M10.71 5.05A16 16 0 0 1 22.58 9 M1.42 9a15.91 15.91 0 0 1 4.7-2.88 M8.53 16.11a6 6 0 0 1 6.95 0 M12 20h.01";

export const dynamic = "force-dynamic";

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
      if (!updated) return;
      useGameStore.getState().setRoom(updated);
      if (updated.status === "playing") {
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
    <main className="min-h-dvh flex items-center justify-center p-4 bg-surface">
      <div className="w-full max-w-md space-y-8 animate-scale-in">
        <div className="text-center space-y-2">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-brand-glow flex items-center justify-center">
            <Icon d={UsersIcon} size={32} />
          </div>
          <h1 className="text-2xl font-bold text-text-primary">Sala de Espera</h1>
        </div>

        <div className="text-center p-6 rounded-xl bg-surface-raised border border-white/5">
          <p className="text-text-muted text-sm mb-2">Codigo da sala</p>
          <button
            onClick={handleCopyCode}
            className="group flex items-center justify-center gap-3 mx-auto
                       text-4xl font-mono font-bold text-brand-light hover:text-brand
                       tracking-[0.3em] transition-all duration-200 touch-target"
          >
            {room.id}
            <Icon d={CopyIcon} size={20} />
          </button>
          <p className="text-text-muted text-xs mt-2">Clique para copiar</p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between px-1">
            <span className="text-sm text-text-secondary flex items-center gap-2">
              <Icon d={UsersIcon} size={16} />
              Jogadores
            </span>
            <span className="text-sm font-mono text-text-muted">{room.players.length}/10</span>
          </div>
          <div className="space-y-2">
            {room.players.map((p, i) => (
              <div
                key={p.id}
                className="flex items-center gap-3 px-5 py-4 rounded-xl bg-surface-raised border border-white/5
                           animate-slide-up transition-all duration-200"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <div className={`shrink-0 w-3 h-3 rounded-full transition-colors ${
                  p.connected ? "bg-accent-success shadow-[0_0_6px_rgba(34,197,94,0.4)]" : "bg-accent-warning"
                }`} />
                <span className="flex-1 text-text-primary font-medium truncate">
                  {p.name}
                  {p.id === myPlayerId ? <span className="text-text-muted ml-2 text-sm">(voce)</span> : null}
                </span>
                {p.id === room.host ? (
                  <span className="flex items-center gap-1 text-accent-warning text-xs font-semibold">
                    <Icon d={CrownIcon} size={14} />
                    HOST
                  </span>
                ) : null}
                {!p.connected ? <Icon d={WifiOffIcon} size={14} /> : null}
              </div>
            ))}
          </div>
        </div>

        {isHost ? (
          <button
            onClick={handleStart}
            disabled={!canStart}
            className={`w-full flex items-center justify-center gap-3 px-6 py-4 rounded-xl font-semibold text-lg
                       transition-all duration-200 touch-target
                       ${canStart
                         ? "bg-accent-success text-white hover:bg-accent-success/90 active:scale-[0.98] shadow-lg shadow-accent-success/25"
                         : "bg-surface-raised text-text-muted cursor-not-allowed border border-white/5"
                       }`}
          >
            <Icon d={PlayIcon} size={22} />
            {canStart ? "Iniciar Partida" : "Aguardando jogadores..."}
          </button>
        ) : (
          <div className="text-center py-6">
            <p className="text-text-muted text-sm animate-pulse">
              Aguardando o host iniciar a partida...
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
