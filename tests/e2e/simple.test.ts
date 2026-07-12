import { io } from "socket.io-client";
const URL = "http://localhost:3000";
const delay = (ms: number) => new Promise(r => setTimeout(r, ms));

async function test() {
  console.log("=== QUER APOSTAR ===");
  const p1 = io(URL), p2 = io(URL);
  let p1Id = "", p2Id = "";
  p1.on("player:id", (id: string) => { p1Id = id; });
  p2.on("player:id", (id: string) => { p2Id = id; });
  await delay(1500);

  p1.emit("room:create", { playerName: "Alice", ruleSet: "advanced" });
  const r1: any = await new Promise((res, rej) => { const t = setTimeout(() => rej(new Error("t")), 5000); p1.once("room:state", (r: any) => { clearTimeout(t); res(r); }); });
  p2.emit("room:join", { roomId: r1.id, playerName: "Bob" });
  await new Promise((res, rej) => { const t = setTimeout(() => rej(new Error("t")), 5000); p2.once("room:state", () => { clearTimeout(t); res(1); }); });
  await delay(300);
  p1.emit("game:start");
  await new Promise((res, rej) => { const t = setTimeout(() => rej(new Error("t")), 5000); p1.once("room:state", () => { clearTimeout(t); res(1); }); });
  await delay(300);

  // P1 guesses
  p1.emit("game:guess", { value: 10 });
  await new Promise((res, rej) => { const t = setTimeout(() => rej(new Error("t")), 5000); p1.once("room:state", () => { clearTimeout(t); res(1); }); });
  await delay(300);

  // P2 contests
  p2.emit("game:contest");
  const sc: any = await new Promise((res, rej) => { const t = setTimeout(() => rej(new Error("t")), 5000); p2.once("room:state", (r: any) => { clearTimeout(t); res(r); }); });
  console.log(`Contest: active=${!!sc.activeContest}, round=${sc.currentRound}, pid: ${sc.activeContest?.challengedId === p1Id ? "MATCH" : "NO"}`);

  // P1 QUER APOSTAR
  p1.emit("game:querApostar");
  const sq: any = await new Promise((res, rej) => { const t = setTimeout(() => rej(new Error("t")), 5000); p1.once("room:state", (r: any) => { clearTimeout(t); res(r); }); });
  console.log(`QuerApostar: querApostar=${sq.activeContest?.querApostar}, round=${sq.currentRound}`);

  // FLUSH any pending events on p2 before listening
  p2.off("room:state");
  await delay(500);

  // P2 DESISTE (keep: false)
  p2.emit("game:querApostar:response", { keep: false });
  const sr: any = await new Promise((res, rej) => { const t = setTimeout(() => rej(new Error("t")), 5000); p2.once("room:state", (r: any) => { clearTimeout(t); res(r); }); });
  console.log(`Desistiu: round=${sr.currentRound}, activeContest=${!!sr.activeContest}, guesses=${sr.guesses.length}`);

  // P1 guesses again for next test
  await delay(500);
  p1.emit("game:guess", { value: 10 });
  await new Promise((res, rej) => { const t = setTimeout(() => rej(new Error("t")), 5000); p1.once("room:state", () => { clearTimeout(t); res(1); }); });
  await delay(300);

  // P2 contests again
  p2.emit("game:contest");
  const sc2: any = await new Promise((res, rej) => { const t = setTimeout(() => rej(new Error("t")), 5000); p2.once("room:state", (r: any) => { clearTimeout(t); res(r); }); });
  console.log(`\nContest #2: active=${!!sc2.activeContest}`);

  // P1 QUER APOSTAR
  p1.emit("game:querApostar");
  await new Promise((res, rej) => { const t = setTimeout(() => rej(new Error("t")), 5000); p1.once("room:state", () => { clearTimeout(t); res(1); }); });
  await delay(500);
  p2.off("room:state");
  await delay(300);

  // P2 MANTEM (keep: true)
  p2.emit("game:querApostar:response", { keep: true });
  const sr2: any = await new Promise((res, rej) => { const t = setTimeout(() => rej(new Error("t")), 5000); p2.once("room:state", (r: any) => { clearTimeout(t); res(r); }); });
  console.log(`Manteve: round=${sr2.currentRound}, activeContest=${!!sr2.activeContest}, guesses=${sr2.guesses.length}`);
  console.log(`  P1 cards: ${sr2.players.find((p: any) => p.id === p1Id)?.cards.length}`);
  console.log(`  P2 cards: ${sr2.players.find((p: any) => p.id === p2Id)?.cards.length}`);

  console.log("\n✅ DONE");
  p1.disconnect(); p2.disconnect();
  process.exit(0);
}

test().catch((e: any) => { console.error("FAIL:", e.message); process.exit(1); });
