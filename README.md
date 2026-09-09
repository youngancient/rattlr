# Rattlr

An sBTC Lending Position Health Monitor & Alert System on the Stacks blockchain.

Rattlr is a public dashboard and alert bot that tracks the health of Bitcoin-collateralized
lending positions on Stacks and warns holders before they're liquidated, not after. It reads
position and health-factor data directly from lending protocol contracts (starting with
[Zest](https://www.zestprotocol.com/), then [Granite](https://www.graniteprotocol.com/)) and
pushes real-time alerts through Telegram and Discord when a position crosses a threshold the
user sets.

> **Status: pre-build scaffold.** This repo currently contains project structure, shared
> types, and stubbed integrations — not a working system. A [Stacks Endowment](https://stacks.org/endowment)
> grant application for this project is pending approval; implementation begins once funding
> is confirmed. Nothing in this repo runs against real testnet/mainnet data yet.

## Why

sBTC lending on Stacks is active and growing, but there's no independent way for a borrower to
monitor their position outside a given protocol's own interface. Today, a borrower either
checks manually, or doesn't check at all and finds out their position was liquidated after the
fact. Rattlr closes that gap: a read-only, non-custodial monitoring layer that borrowers,
lending protocols, and other Stacks builders can rely on.

Rattlr does not execute liquidations, trades, or any on-chain transaction on a user's behalf,
and does not lend, borrow, or hold any user funds.

## Architecture

| Package | Path | Role |
|---|---|---|
| `@rattlr/core` | `packages/core` | Shared types (`Position`, `AlertThreshold`, `ProtocolAdapter`) used by every other package, so protocol integrations share one data model. |
| `@rattlr/indexer` | `packages/indexer` | Long-running background poller. Reads position/health-factor data from a protocol's Clarity contracts via Stacks read-only calls, on a fixed interval (target: every 60s). |
| `@rattlr/api` | `packages/api` | Backend serving dashboard data and managing alert-threshold subscriptions. |
| `@rattlr/bot` | `packages/bot` | Long-running Telegram + Discord bot. Sends a private alert to a subscriber when their tracked position crosses their configured threshold. |
| `@rattlr/dashboard` | `apps/dashboard` | Public Next.js dashboard. No login required to view. Shows aggregate stats by default; a specific position can be looked up by wallet address. There is no public directory listing all tracked wallets. |

The indexer and bot are background services (not request/response servers) — once deployed,
they're expected to run continuously. The api and dashboard are conventional web
server/frontend.

```
rattlr/
  apps/
    dashboard/        # Next.js public dashboard
  packages/
    core/              # shared types + ProtocolAdapter interface
    indexer/           # Stacks read-only call polling (background worker)
    api/                # Fastify backend: aggregate stats, wallet lookup, subscriptions
    bot/                # Telegram + Discord alert delivery (background worker)
  .env.example
```

## Design decisions

- **Alert thresholds are adjustable at any time**, without re-subscribing (`PATCH /subscriptions/:id`
  in `@rattlr/api`, reconfirmed via the same chat that created the subscription).
- **The dashboard is lookup-only.** It shows aggregate stats (total tracked positions,
  protocols covered, uptime) by default, and lets anyone look up one wallet's position by
  address — position data is already public on-chain — but never enumerates or browses all
  tracked wallets as a directory.

## Getting started

Requires Node.js 20+ and [pnpm](https://pnpm.io/) 9+.

```bash
pnpm install
cp .env.example .env   # fill in real values before running any service for real
```

Each package/app runs independently in dev mode:

```bash
pnpm dev:indexer      # background poller (currently a no-op stub, see packages/indexer)
pnpm dev:api          # backend on http://localhost:3001
pnpm dev:bot          # Telegram + Discord bot (requires real bot tokens in .env)
pnpm dev:dashboard    # dashboard on http://localhost:3000
```

`pnpm build` builds every package; `pnpm typecheck` type-checks the whole workspace.

### Environment variables

See [`.env.example`](./.env.example) for the full list. At a glance:

| Variable | Used by | Purpose |
|---|---|---|
| `STACKS_NETWORK`, `STACKS_RPC_URL` | indexer | Which Stacks network/RPC endpoint to read contract state from. |
| `ZEST_CONTRACT_ADDRESS`, `ZEST_CONTRACT_NAME` | indexer | Zest's Clarity contract identifiers (testnet for Milestone 1, mainnet for Milestone 2). |
| `GRANITE_CONTRACT_ADDRESS`, `GRANITE_CONTRACT_NAME` | indexer | Granite's Clarity contract identifiers (Milestone 3). |
| `TELEGRAM_BOT_TOKEN`, `DISCORD_BOT_TOKEN` | bot | Bot credentials for alert delivery. |
| `NEXT_PUBLIC_API_URL` | dashboard | Where the dashboard fetches data from. |

## Roadmap

1. **Testnet dashboard + alert bot** — indexer and dashboard against Zest testnet, working
   Telegram/Discord alerts, one real testnet alert demonstrated end to end.
2. **Mainnet deployment** — same system redeployed against Zest mainnet, one real self-funded
   position monitored for 7+ days, public deployment guide.
3. **Second protocol + external validation** — Granite added, 20+ real tracked positions,
   14-day uptime report, at least 2 external users confirming a real alert.

## License

[MIT](./LICENSE)
