"use client";

import { useState, type FormEvent } from "react";
import type { Position } from "@rattlr/core";
import { fetchPosition } from "@/lib/api";

type LookupState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "found"; position: Position }
  | { status: "not-found" }
  | { status: "error"; message: string };

export function WalletLookup() {
  const [walletAddress, setWalletAddress] = useState("");
  const [state, setState] = useState<LookupState>({ status: "idle" });

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!walletAddress.trim()) return;

    setState({ status: "loading" });
    try {
      const position = await fetchPosition(walletAddress.trim());
      setState(position ? { status: "found", position } : { status: "not-found" });
    } catch (err) {
      setState({ status: "error", message: (err as Error).message });
    }
  }

  return (
    <div className="flex w-full flex-col gap-4">
      <form onSubmit={handleSubmit} className="flex w-full gap-2">
        <input
          type="text"
          value={walletAddress}
          onChange={(e) => setWalletAddress(e.target.value)}
          placeholder="Stacks wallet address (e.g. SP...)"
          className="flex-1 rounded-md border border-black/[.08] bg-transparent px-3 py-2 text-sm outline-none focus:border-black/[.3] dark:border-white/[.145] dark:focus:border-white/[.4]"
        />
        <button
          type="submit"
          disabled={state.status === "loading"}
          className="rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background transition-colors hover:bg-[#383838] disabled:opacity-50 dark:hover:bg-[#ccc]"
        >
          {state.status === "loading" ? "Looking up…" : "Look up"}
        </button>
      </form>

      {state.status === "not-found" && (
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          No tracked position found for that address.
        </p>
      )}
      {state.status === "error" && (
        <p className="text-sm text-red-600 dark:text-red-400">{state.message}</p>
      )}
      {state.status === "found" && (
        <dl className="grid grid-cols-2 gap-4 rounded-lg border border-black/[.08] p-4 text-sm dark:border-white/[.145] sm:grid-cols-4">
          <div>
            <dt className="text-zinc-600 dark:text-zinc-400">Protocol</dt>
            <dd className="font-medium">{state.position.protocol}</dd>
          </div>
          <div>
            <dt className="text-zinc-600 dark:text-zinc-400">Health factor</dt>
            <dd className="font-medium">{state.position.healthFactor}</dd>
          </div>
          <div>
            <dt className="text-zinc-600 dark:text-zinc-400">Collateral</dt>
            <dd className="font-medium">{state.position.collateralAmount}</dd>
          </div>
          <div>
            <dt className="text-zinc-600 dark:text-zinc-400">Debt</dt>
            <dd className="font-medium">{state.position.debtAmount}</dd>
          </div>
        </dl>
      )}
    </div>
  );
}
