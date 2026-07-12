"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useGameStore, setupSocketListeners } from "@/lib/store";
import { connectSocket } from "@/lib/socket";
import GameBoard from "@/components/game-board";

export default function GamePage() {
  const router = useRouter();
  const { room } = useGameStore();

  useEffect(() => {
    setupSocketListeners();
    connectSocket();
    if (!room) router.push("/");
  }, [room, router]);

  if (!room) return null;

  return (
    <main className="min-h-screen p-4 max-w-lg mx-auto pb-8">
      <GameBoard />
    </main>
  );
}
