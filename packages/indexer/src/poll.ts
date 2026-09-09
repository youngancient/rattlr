import type { Position, ProtocolAdapter } from "@rattlr/core";

const POLL_INTERVAL_MS = 60_000;

export interface PollOptions {
  adapters: ProtocolAdapter[];
  /** Returns the wallet addresses currently tracked for a given protocol. */
  getTrackedWallets: (protocol: string) => Promise<string[]>;
  onSnapshot: (position: Position) => Promise<void>;
}

/**
 * Starts the polling loop. This is the long-running background process:
 * once deployed, it keeps running for the lifetime of the indexer service
 * (not something invoked per-request). Returns a stop function.
 */
export function startPolling({ adapters, getTrackedWallets, onSnapshot }: PollOptions): () => void {
  const timer = setInterval(() => {
    void runPollCycle({ adapters, getTrackedWallets, onSnapshot });
  }, POLL_INTERVAL_MS);

  return () => clearInterval(timer);
}

async function runPollCycle({ adapters, getTrackedWallets, onSnapshot }: PollOptions): Promise<void> {
  for (const adapter of adapters) {
    const wallets = await getTrackedWallets(adapter.id);
    for (const wallet of wallets) {
      try {
        const position = await adapter.fetchPosition(wallet);
        if (position) {
          await onSnapshot(position);
        }
      } catch (error) {
        // TODO: replace with real logging/alerting once the indexer is wired up.
        console.error(`[indexer] failed to fetch position for ${wallet} on ${adapter.id}:`, error);
      }
    }
  }
}
