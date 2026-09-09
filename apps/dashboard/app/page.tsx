import { AggregateStatsPanel } from "./components/aggregate-stats";
import { WalletLookup } from "./components/wallet-lookup";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col items-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex w-full max-w-3xl flex-1 flex-col gap-10 px-6 py-16 sm:px-16">
        <header className="flex flex-col gap-2">
          <h1 className="text-2xl font-semibold tracking-tight">Rattlr</h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Read-only health monitor for Bitcoin-collateralized lending positions on Stacks.
            Look up a wallet below — no login required.
          </p>
        </header>

        <section className="flex flex-col gap-4">
          <h2 className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
            Network stats
          </h2>
          <AggregateStatsPanel />
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
            Look up a position
          </h2>
          <WalletLookup />
        </section>
      </main>
    </div>
  );
}
