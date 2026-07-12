"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { connectSocket, getSocket } from "@/lib/socket";
import { setupSocketListeners, useGameStore } from "@/lib/store";
import { Room } from "@/game-engine/types";

function Icon({ d, size = 20 }: { d: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d={d} />
    </svg>
  );
}

const UsersIcon = "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2 M22 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75 M8 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8z";
const LogInIcon = "M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4 M10 17l5-5-5-5 M13.8 12H3";
const ArrowRightIcon = "M5 12h14 M12 5l7 7-7 7";
const Dice1Icon = "M12 12h.01 M7.5 4.5l9 9 M4.5 7.5l9-9 M3 5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5z";
const Dice2Icon = "M10 18h4 M18 12h.01 M15 9l3 3-3 3 M3 5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5z";

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
    <main className="min-h-dvh flex items-center justify-center p-4 bg-surface">
      <div className="w-full max-w-md space-y-8 animate-fade-in">
        <div className="text-center space-y-3">
          <div className="w-20 h-20 mx-auto rounded-2xl bg-brand-glow flex items-center justify-center">
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none" className="text-brand-light">
              <ellipse cx="24" cy="30" rx="18" ry="12" stroke="currentColor" strokeWidth="2" />
              <circle cx="24" cy="16" r="8" stroke="currentColor" strokeWidth="2" />
              <circle cx="20" cy="15" r="1.5" fill="currentColor" />
              <circle cx="28" cy="15" r="1.5" fill="currentColor" />
              <path d="M20 20c0 2 2 3 4 3s4-1 4-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-text-primary">Nem a Pato!</h1>
          <p className="text-text-secondary text-lg">Jogo de blefe e curiosidades</p>
        </div>

        <div className="space-y-4">
          <input
            className="w-full px-5 py-4 rounded-xl bg-surface-raised border border-white/10 text-text-primary placeholder:text-text-muted
                       focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent
                       transition-all duration-200 text-lg touch-target"
            placeholder="Seu nome"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={20}
          />

          <div className="flex gap-3">
            <button
              onClick={() => setRuleSet("basic")}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium
                         transition-all duration-200 touch-target
                         ${ruleSet === "basic"
                           ? "border-brand bg-brand/10 text-brand-light shadow-[0_0_12px_rgba(249,115,22,0.15)]"
                           : "border-white/5 bg-surface-raised text-text-secondary hover:border-white/10 hover:text-text-primary"
                         }`}
            >
              <Icon d={Dice1Icon} size={18} />
              Regras Basicas
            </button>
            <button
              onClick={() => setRuleSet("advanced")}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium
                         transition-all duration-200 touch-target
                         ${ruleSet === "advanced"
                           ? "border-brand bg-brand/10 text-brand-light shadow-[0_0_12px_rgba(249,115,22,0.15)]"
                           : "border-white/5 bg-surface-raised text-text-secondary hover:border-white/10 hover:text-text-primary"
                         }`}
            >
              <Icon d={Dice2Icon} size={18} />
              Regras Avancadas
            </button>
          </div>

          <button
            onClick={handleCreate}
            className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl
                       bg-brand hover:bg-brand/90 active:scale-[0.98]
                       text-black font-semibold text-lg
                       transition-all duration-200 touch-target
                       shadow-lg shadow-brand/25"
          >
            <Icon d={UsersIcon} size={22} />
            Criar Sala
            <Icon d={ArrowRightIcon} size={18} />
          </button>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-white/5" />
            <span className="text-text-muted text-sm">ou entre em uma sala</span>
            <div className="flex-1 h-px bg-white/5" />
          </div>

          <div className="flex gap-3">
            <input
              className="flex-1 px-5 py-4 rounded-xl bg-surface-raised border border-white/10 text-text-primary
                         placeholder:text-text-muted text-center text-lg font-mono tracking-[0.3em] uppercase
                         focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent
                         transition-all duration-200 touch-target"
              placeholder="CODIGO"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value)}
              maxLength={6}
            />
            <button
              onClick={handleJoin}
              className="px-6 py-4 rounded-xl bg-surface-raised hover:bg-surface-card
                         border border-white/10 hover:border-brand/30
                         text-text-primary font-semibold text-lg
                         transition-all duration-200 active:scale-[0.98] touch-target"
            >
              <Icon d={LogInIcon} size={22} />
            </button>
          </div>
        </div>

        {error ? (
          <div className="px-5 py-4 rounded-xl bg-accent-danger/10 border border-accent-danger/20
                          text-accent-danger text-sm text-center animate-slide-up">
            {error}
          </div>
        ) : null}
      </div>
    </main>
  );
}
