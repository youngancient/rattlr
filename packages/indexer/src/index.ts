import { startPolling } from "./poll.js";
import { zestAdapter } from "./protocols/zest.js";

// TODO: replace with a real store (e.g. Postgres) once persistence is wired up.
async function getTrackedWallets(_protocol: string): Promise<string[]> {
  void _protocol;
  return [];
}

// TODO: persist snapshots and forward threshold-crossing events to @rattlr/bot.
async function onSnapshot(): Promise<void> {
  // no-op placeholder
}

const stop = startPolling({
  adapters: [zestAdapter],
  getTrackedWallets,
  onSnapshot,
});

console.log("[indexer] polling started (60s interval)");

process.on("SIGINT", () => {
  stop();
  process.exit(0);
});
