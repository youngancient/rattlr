# Architecture

Rattlr is a read-only monitoring layer built around a polling indexer, a data/subscription
API, an alert-delivery bot, and a public dashboard. It never signs an on-chain transaction
and never takes custody of user funds — every component only reads public on-chain state
and public subscription preferences. The one signature Rattlr does request is an off-chain
message signature, used only to authenticate subscription management (see "Wallet-signature
auth" below), never to authorize a transaction.

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
  Never requires authentication.
- **Subscription management** — `POST /subscriptions` to create a subscription (starts
  **pending**, returns a Telegram deep link or Discord setup code), `PATCH
  /subscriptions/:id` to update a threshold, and a listing endpoint for a signed-in
  wallet's own subscriptions. All three require wallet-signature auth.

### Wallet-signature auth

Subscription creation and management are gated by an off-chain signed message (Leather /
Xverse), not a username/password account. The signing wallet's principal is the durable
key a subscriber's subscriptions are looked up by — not browser storage, and not the
wallet address being tracked. This means:

- reconnecting the same wallet on any device recovers the same list of subscriptions,
- the wallet used to sign never has to match the wallet whose position is being watched,
- viewing the dashboard, looking up a position, and receiving alerts never require a
  signature — only creating or editing a subscription does.

### `@rattlr/bot`

Long-running Telegram (Telegraf) and Discord (discord.js) bot (`packages/bot`). Its role
is confirmation and delivery, not first-time setup: a subscription is created on the
dashboard (see below), and the bot's job is to link a chat/channel to that pending
subscription (via a deep link on Telegram, a `/link <code>` command on Discord) and then
send a private alert to that chat when the indexer detects the tracked position has
crossed the threshold. Once linked, a `/threshold` command in that chat can update the
threshold directly, since each chat is linked to at most one active subscription. Alerts
are per-user and private — never posted to a shared public channel.

### `@rattlr/dashboard`

Public Next.js app (`apps/dashboard`). No login required to view — aggregate stats and
wallet lookup are fully public. Creating or managing an alert subscription requires
connecting a wallet and signing a message (see "Wallet-signature auth" above); the
dashboard never browses or lists all tracked wallets as a directory.

## End-to-end flow (intended shape)

```
subscription creation (dashboard)
  → connect wallet, sign message              [wallet-signature auth]
  → POST /subscriptions                        [creates pending subscription]
  → deep link (Telegram) or setup code (Discord) returned
  → user confirms in bot                       [pending → active, chat linked]

indexer poll cycle (60s)
  → ProtocolAdapter.fetchPosition(wallet)   [Stacks read-only call]
  → position snapshot persisted              [store]
  → threshold check against active AlertThreshold subscriptions
  → crossing detected → bot sends alert       [Telegram / Discord]

dashboard / api
  → GET /positions/aggregate, /positions/:walletAddress   [reads from store, no auth]
  → PATCH /subscriptions/:id, or /threshold in the linked chat  [update, requires auth]
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
