import { Player, RuleSet, GameResult } from "./types";

function countPatoPoints(player: Player): number {
  return Math.max(0, player.cards.reduce((sum, c) => sum + c.patoPoints, 0) - player.dobreiCards);
}

export function calculateScore(player: Player, ruleSet: RuleSet): number {
  if (ruleSet === "basic") return player.cards.length;
  return countPatoPoints(player);
}

export function determineLoser(
  players: Player[],
  ruleSet: RuleSet,
): { loser: Player; isTie: boolean } {
  const scores = players.map((p) => ({
    player: p,
    score: calculateScore(p, ruleSet),
  }));
  const maxScore = Math.max(...scores.map((s) => s.score));
  const topScorers = scores.filter((s) => s.score === maxScore);
  if (topScorers.length === 1) return { loser: topScorers[0].player, isTie: false };
  const tiedPlayers = topScorers.map((s) => s.player);
  const { loser: tieLoser } = tiebreaker(tiedPlayers);
  return { loser: tieLoser[0], isTie: tieLoser.length > 1 };
}

export function tiebreaker(tiedPlayers: Player[]): { loser: Player[] } {
  const patoCounts = tiedPlayers.map((p) => ({
    player: p,
    pato: countPatoPoints(p),
  }));
  const maxPato = Math.max(...patoCounts.map((p) => p.pato));
  const stillTied = patoCounts.filter((p) => p.pato === maxPato);
  return { loser: stillTied.map((s) => s.player) };
}

export function buildGameResult(players: Player[], ruleSet: RuleSet): GameResult {
  const { loser, isTie } = determineLoser(players, ruleSet);
  return { players, loser, isTie };
}
