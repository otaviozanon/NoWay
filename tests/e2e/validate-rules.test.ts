import { io } from "socket.io-client";

const URL = "http://localhost:3000";
const delay = (ms: number) => new Promise(r => setTimeout(r, ms));
let passed = 0, failed = 0;

async function test(name: string, fn: () => Promise<void>) {
  try { await fn(); console.log(`  ✅ ${name}`); passed++; }
  catch (e: any) { console.log(`  ❌ ${name}: ${e.message}`); failed++; }
}

function listen(s: any, event: string, timeout = 8000): Promise<any> {
  return new Promise((res, rej) => {
    const t = setTimeout(() => rej(new Error(`Timeout: ${event}`)), timeout);
    s.once(event, (d: any) => { clearTimeout(t); res(d); });
  });
}

async function main() {
  console.log("\n=== VALIDACAO REGRAS ===\n");

  // --- BASIC ---
  const a1 = io(URL), a2 = io(URL);
  let p1Id = "", p2Id = "", roomId = "";
  a1.on("player:id", (id: string) => { p1Id = id; });
  a2.on("player:id", (id: string) => { p2Id = id; });
  await delay(1500);

  console.log("--- BASICAS ---");
  a1.emit("room:create", { playerName: "A", ruleSet: "basic" });
  const rb = await listen(a1, "room:state"); roomId = rb.id;
  a2.emit("room:join", { roomId, playerName: "B" });
  await listen(a2, "room:state"); await delay(400);

  await test("Sala criada", async () => {
    if (rb.players.length !== 1 || rb.status !== "waiting") throw new Error("falha");
  });

  await test("Nao inicia com 1p", async () => {
    const s = io(URL); await delay(500);
    s.emit("room:create", { playerName: "Solo", ruleSet: "basic" });
    await listen(s, "room:state"); await delay(200);
    s.emit("game:start");
    const e = await listen(s, "error");
    if (!e.message.includes("Minimo")) throw new Error(e.message);
    s.disconnect();
  });

  // Now join B
  a2.emit("room:join", { roomId, playerName: "B" });
  await listen(a2, "room:state"); await delay(400);
  a1.emit("game:start");
  await listen(a1, "room:state"); await delay(400);

  await test("Palpite > anterior OK", async () => {
    a1.emit("game:guess", { value: 10 });
    const r = await listen(a1, "room:state");
    if (r.guesses.length !== 1 || r.guesses[0].value !== 10) throw new Error("falha");
  });

  await test("Palpite <= anterior bloqueado", async () => {
    a2.emit("game:guess", { value: 5 });
    const e = await listen(a2, "error");
    if (!e.message.includes("maior")) throw new Error(e.message);
  });

  await test("Palpite grande valido", async () => {
    a2.emit("game:guess", { value: 9999999 });
    await listen(a2, "room:state");
  });

  await test("Contest > resposta → desafiado leva", async () => {
    a1.emit("game:contest");
    const r = await listen(a1, "room:state");
    const bCards = r.players.find((p: any) => p.id === p2Id)?.cards.length;
    if (bCards !== 1) throw new Error(`B tem ${bCards} cartas`);
    if (r.guesses.length !== 0) throw new Error("palpites nao resetados");
  });

  await test("Contest <= resposta → desafiante leva", async () => {
    a1.emit("game:guess", { value: 1 });
    await listen(a1, "room:state"); await delay(200);
    a2.emit("game:contest");
    const r = await listen(a2, "room:state");
    const bCards = r.players.find((p: any) => p.id === p2Id)?.cards.length;
    if (bCards !== 2) throw new Error(`B tem ${bCards} cartas (deveria 2)`);
  });

  await test("Turno errado bloqueado", async () => {
    a2.emit("game:guess", { value: 100 });
    const e = await listen(a2, "error");
    if (!e.message.includes("turno")) throw new Error(e.message);
  });

  await test("Proprio palpite nao pode contestar", async () => {
    a1.emit("game:guess", { value: 5 });
    await listen(a1, "room:state"); await delay(200);
    a1.emit("game:contest");
    const e = await listen(a1, "error");
    if (!e.message.includes("proprio")) throw new Error(e.message);
  });

  await test("Fim de jogo + game:end emitido", async () => {
    for (let i = 1; i <= 8; i++) {
      const cur = a1.id.includes("_") ? a1 : a2;
      cur.emit("game:guess", { value: 5 });
      await listen(cur, "room:state"); await delay(100);
      const other = cur === a1 ? a2 : a1;
      other.emit("game:contest");
      await listen(other, "room:state"); await delay(100);
    }
    const end: any = await new Promise(res => { a1.once("game:end", res); a2.once("game:end", res); });
    if (!end.loser) throw new Error("sem loser");
    if (!end.players) throw new Error("sem players");
  });

  await test("Play again voto", async () => {
    a1.emit("game:playAgain");
    const r = await listen(a1, "room:state");
    if (!r.playAgainVotes || r.playAgainVotes.length < 1) throw new Error("voto falhou");
  });

  a1.disconnect(); a2.disconnect(); await delay(500);

  // --- ADVANCED ---
  console.log("\n--- AVANCADAS ---");
  const b1 = io(URL), b2 = io(URL);
  let b1Id = "", b2Id = "";
  b1.on("player:id", (id: string) => { b1Id = id; });
  b2.on("player:id", (id: string) => { b2Id = id; });
  await delay(1500);

  b1.emit("room:create", { playerName: "C", ruleSet: "advanced" });
  const ra = await listen(b1, "room:state"); const advRoom = ra.id;
  b2.emit("room:join", { roomId: advRoom, playerName: "D" });
  await listen(b2, "room:state"); await delay(400);
  b1.emit("game:start"); await listen(b1, "room:state"); await delay(400);

  await test("Contest cria activeContest", async () => {
    b1.emit("game:guess", { value: 20 });
    await listen(b1, "room:state"); await delay(300);
    b2.emit("game:contest");
    const r = await listen(b2, "room:state");
    if (!r.activeContest) throw new Error("nao criado");
    if (r.activeContest.challengedId !== b1Id) throw new Error("challengedId errado");
  });

  await test("Accept resolve contest", async () => {
    b1.emit("game:contest:accept");
    const r = await listen(b1, "room:state");
    if (r.activeContest) throw new Error("nao removido");
    if (r.guesses.length !== 0) throw new Error("palpites nao resetados");
  });

  await test("Quer Apostar + manter → 2 cartas", async () => {
    b1.emit("game:guess", { value: 30 });
    await listen(b1, "room:state"); await delay(300);
    b2.emit("game:contest");
    await listen(b2, "room:state"); await delay(300);
    b1.emit("game:querApostar");
    const rq = await listen(b1, "room:state");
    if (!rq.activeContest?.querApostar) throw new Error("querApostar nao setado");
    await delay(200);
    b2.emit("game:querApostar:response", { keep: true });
    const rk = await listen(b2, "room:state");
    if (rk.activeContest) throw new Error("contest nao resolvido apos manter");
  });

  await test("Dobrei concede ao dobrar", async () => {
    b1.emit("game:guess", { value: 5 });
    await listen(b1, "room:state"); await delay(300);
    b2.emit("game:guess", { value: 10 });
    const r = await listen(b2, "room:state");
    const d = r.players.find((p: any) => p.id === b2Id);
    if (!d || d.dobreiCards < 1) throw new Error(`dobreiCards=${d?.dobreiCards}`);
  });

  await test("Na Mosca errado → fim de jogo", async () => {
    b1.emit("game:guess", { value: 9999999 });
    await listen(b1, "room:state"); await delay(300);
    b2.emit("game:naMosca");
    const r = await listen(b2, "room:state");
    if (r.status !== "finished") throw new Error(`nao finalizou: ${r.status}`);
  });

  await test("Nome vazio rejeitado", async () => {
    const t = io(URL); await delay(500);
    t.emit("room:create", { playerName: "", ruleSet: "basic" });
    const e = await listen(t, "error");
    if (!e.message.includes("vazio")) throw new Error(e.message);
    t.disconnect();
  });

  await test("Sala invalida rejeitada", async () => {
    const t = io(URL); await delay(500);
    t.emit("room:join", { roomId: "XXXXXX", playerName: "X" });
    const e = await listen(t, "error");
    if (!e.message.includes("nao encontrada")) throw new Error(e.message);
    t.disconnect();
  });

  console.log(`\n=== RESULTADO: ${passed} passaram, ${failed} falharam ===\n`);
  b1.disconnect(); b2.disconnect();
  process.exit(failed > 0 ? 1 : 0);
}

main().catch(e => { console.error("FATAL:", e.message); process.exit(1); });
