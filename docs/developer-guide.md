# Developer Guide

## Overview

Rattlr is a pnpm monorepo: one shared types package, three backend services, and one
Next.js dashboard. See [`architecture.md`](./architecture.md) for how they fit together.

Repository:

```text
TODO — public repo URL once published
```

## Install

Requires Node.js 20+ and pnpm 9+.

```bash
git clone <repo-url>
cd rattlr
pnpm install
cp .env.example .env   # fill in real values before running any service for real
```

## Running services

Each package/app runs independently in dev mode:

```bash
pnpm dev:indexer      # background poller
pnpm dev:api          # backend on http://localhost:3001
pnpm dev:bot          # Telegram + Discord bot (requires real bot tokens in .env)
pnpm dev:dashboard    # dashboard on http://localhost:3000
```

`pnpm build` builds every package; `pnpm typecheck` type-checks the whole workspace.

The bot process (`packages/bot/src/index.ts`) requires both `TELEGRAM_BOT_TOKEN` and
`DISCORD_BOT_TOKEN` to be set — it exits if either is missing, even for local testing of
one channel only.

## The `ProtocolAdapter` Pattern

Every protocol integration implements the same interface, defined in
`packages/core/src/types.ts`:

```ts
export interface ProtocolAdapter {
  id: ProtocolId;
  fetchPosition(walletAddress: string): Promise<Position | null>;
}
```

The indexer's poll loop (`packages/indexer/src/poll.ts`) only knows about this interface
— it has no protocol-specific logic. This is what lets Milestone 3 add Granite as a
second data source without changing the indexer, API, bot, or dashboard.

## Adding a New Protocol Integration

1. Create `packages/indexer/src/protocols/<protocol>.ts` implementing `ProtocolAdapter`:
   call the protocol's Clarity contract via `fetchCallReadOnlyFunction` from
   `@stacks/transactions`, pointed at the RPC endpoint and contract identifiers from env
   config, and map the response into the shared `Position` shape.
2. Register the new adapter in `packages/indexer/src/index.ts`'s `adapters` array.
3. Add the protocol's contract address/name env vars to `.env.example` and
   `docs/architecture.md`'s environment table (follow the `GRANITE_CONTRACT_ADDRESS` /
   `GRANITE_CONTRACT_NAME` pattern already present).
4. No changes are needed to `poll.ts`, the API routes, the bot, or the dashboard — they
   all operate on `Position` / `ProtocolAdapter`, not protocol-specific fields.

## Error Handling Expectations

`runPollCycle` in `poll.ts` catches and logs a failure per-wallet, per-adapter — one
wallet's failed fetch (RPC timeout, malformed response, etc.) must never stop the rest of
that poll cycle from running. Keep this invariant when touching the poll loop.

## Subscription Ownership

Creating or editing a subscription (`POST /subscriptions`, `PATCH /subscriptions/:id`)
requires a valid signature from the owning wallet — not browser storage, and not
knowledge of the tracked wallet address (see
[`security-threat-model.md`](./security-threat-model.md) §4). This is the one
authorization-sensitive path in an otherwise unauthenticated, read-only system; every
other route (position lookup, aggregate stats) stays open.

Chat linking (a Telegram deep link or a Discord `/link <code>`) is a separate, narrower
credential: it only ties a chat to a pending subscription, it does not grant management
rights over that subscription. Keep those two checks distinct when touching this code —
don't let a valid link code substitute for a valid subscription-management signature.

## Contributing

Bug reports and feature requests go through the public GitHub repo issues (see the root
[README](../README.md)'s maintenance plan). This project is maintained solo,
best-effort, faster on anything affecting core monitoring accuracy or alert delivery.
