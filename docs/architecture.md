# Architecture

Rattlr is a read-only monitoring layer built around a polling indexer, a data/subscription
API, an alert-delivery bot, and a public dashboard. It never signs a transaction and never
takes custody of user funds — every component only reads public on-chain state and public
subscription preferences.

## Components

### `@rattlr/core`

Shared types used by every other package: `Position`, `AlertThreshold`, and the
`ProtocolAdapter` interface. Keeping these in one package means the indexer pipeline
doesn't change shape when a second protocol (Granite, Milestone 3) is added — only a new
adapter is written.

### `@rattlr/indexer`

Long-running background poller (`packages/indexer/src/poll.ts`). On a fixed interval
(target: every 60 seconds), it:

1. asks the store which wallets are currently tracked, per protocol,
2. calls each protocol's `ProtocolAdapter.fetchPosition(walletAddress)`,
3. hands the resulting `Position` snapshot to a callback for persistence and
   threshold-crossing evaluation.

A failure fetching one wallet's position is caught and logged per-wallet — it does not
stop the rest of the poll cycle. Each protocol integration (`packages/indexer/src/protocols/`)
implements `ProtocolAdapter` by calling that protocol's Clarity contract via a Stacks
read-only call (`@stacks/transactions` `fetchCallReadOnlyFunction`) and mapping the result
into the shared `Position` shape.

### `@rattlr/api`

Fastify backend (`packages/api`) serving two things:

- **Position data** — `GET /positions/aggregate` (total tracked positions, protocols
  covered, uptime status) and `GET /positions/:walletAddress` (latest snapshot for one
  wallet). There is deliberately no endpoint that lists or enumerates all tracked wallets.
- **Subscription management** — `POST /subscriptions` to create an alert threshold,
  `PATCH /subscriptions/:id` to update a threshold without re-subscribing, reconfirmed via
  the same chat that created it.

### `@rattlr/bot`

Long-running Telegram (Telegraf) and Discord (discord.js) bot (`packages/bot`). Guides a
user through subscribing a wallet address and a health-factor threshold, then sends a
private alert to that user's chat when the indexer detects their tracked position has
crossed it. Alerts are per-user and private — never posted to a shared public channel.

### `@rattlr/dashboard`

Public Next.js app (`apps/dashboard`). No login required. Shows aggregate stats by
default and lets a visitor look up one wallet's position by address — the underlying data
is already public on-chain — but never browses or lists all tracked wallets as a
directory.

## End-to-end flow (intended shape)

```
indexer poll cycle (60s)
  → ProtocolAdapter.fetchPosition(wallet)   [Stacks read-only call]
  → position snapshot persisted              [store]
  → threshold check against AlertThreshold subscriptions
  → crossing detected → bot sends alert       [Telegram / Discord]

dashboard / api
  → GET /positions/aggregate, /positions/:walletAddress   [reads from store]
  → POST /subscriptions, PATCH /subscriptions/:id          [writes to store]
```

**Current status:** the polling loop, per-wallet error isolation, and route shapes exist.
Persistence, the indexer→bot threshold-crossing pipeline, and every protocol adapter's
actual contract call are stubbed pending Milestone 1 build. See the root
[README](../README.md) for the up-to-date package-by-package status.

## Adding a second protocol (Milestone 3: Granite)

Because every protocol integration implements the same `ProtocolAdapter` interface, adding
Granite means:

1. writing `packages/indexer/src/protocols/granite.ts` implementing `fetchPosition`,
2. registering the new adapter alongside `zestAdapter` in the indexer's adapter list,
3. adding `GRANITE_CONTRACT_ADDRESS` / `GRANITE_CONTRACT_NAME` (already present in
   `.env.example`),

with no changes required to `poll.ts`, the API routes, the bot, or the dashboard — they
all operate on the shared `Position` / `ProtocolAdapter` shapes, not protocol-specific
logic.
