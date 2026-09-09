# Security and Threat Model

Status: pre-build scaffold, no live deployment yet.

## 1. Scope

This document covers:

- the indexer's read-only contract calls
- the API's position and subscription endpoints
- the Telegram/Discord bot
- the public dashboard

Rattlr never signs a transaction, never requests wallet approval, and never takes custody
of a user's funds or private keys. It is fundamentally lower-risk than a protocol that
holds deposits, because there is no router, no vault, and no user-controlled balance
inside Rattlr's own infrastructure.

## 2. Assets to Protect

- `STACKS_RPC_URL` / protocol contract address configuration (indexer's source of truth)
- `TELEGRAM_BOT_TOKEN`, `DISCORD_BOT_TOKEN`
- stored subscriptions (wallet address, protocol, threshold, chat ID)
- service availability (indexer uptime, bot uptime, API/dashboard uptime)

Wallet addresses and position data are already public on-chain and are not treated as
secret. Chat IDs are the closest thing to sensitive data Rattlr stores, since they map a
public wallet to a specific private chat.

## 3. Security Goals

1. an alert is only ever sent to the chat that created (or was reconfirmed on) the
   matching subscription
2. a subscription's threshold cannot be changed by anyone other than the chat that owns it
3. no user funds, wallet signatures, or private keys are ever requested or handled
4. a compromised bot token cannot expose anything beyond already-public on-chain data
5. an indexer or RPC failure degrades to "no new data," never to silently wrong data
   being displayed as current

## 4. Subscription Ownership

`PATCH /subscriptions/:id` (`packages/api/src/routes/subscriptions.ts`) must verify the
request originates from the same chat that owns the subscription before applying a
threshold change, per the PRD's "reconfirmed via the same chat" requirement. This is the
one place in Rattlr closest to an authorization boundary, since misrouting a threshold
update means a subscriber's alerts could be silently redirected or muted.

## 5. RPC Trust

The indexer trusts the configured `STACKS_RPC_URL` to return accurate contract state.
Rattlr does not currently cross-check multiple RPC providers or independently verify
responses. A malicious or compromised RPC endpoint could serve incorrect health-factor
data. Mitigation for now is operational: pin a known-good RPC provider in deployment
config, don't accept RPC URLs from user input.

## 6. Bot Token Compromise

If a Telegram or Discord bot token leaks, an attacker could message any subscriber
through Rattlr's bot identity. It could not access wallet funds or private keys, since
Rattlr never holds either. Mitigation: tokens live only in environment variables, never
committed (`.env` is gitignored), and are rotated immediately on suspected compromise.

## 7. False Negatives (Missed Alerts)

The most consequential failure mode, since it directly fails the user who relied on the
alert. Root causes to guard against:

- RPC failure or timeout during a poll cycle (mitigated by per-wallet error isolation in
  `poll.ts`, which prevents one failure from blocking other wallets in the same cycle)
- an unhandled protocol contract layout change
- indexer process crash or restart gap
- Telegram/Discord API outage or bot process downtime

There is no formal SLA (see the root README's maintenance plan) — this is a best-effort
system, disclosed as such to users, with incidents posted to the dashboard and Rattlr's X
account per the PRD's status-communication plan.

## 8. Denial of Service on Rattlr's Own Infrastructure

The API and dashboard are the only request/response surfaces exposed to arbitrary
traffic. Neither executes privileged actions on excessive input beyond normal rate
limiting and input validation on wallet-address lookups and subscription payloads —
standard web-service hardening, not a bespoke risk given the read-only design.

## 9. Pre-Mainnet Checklist

To be completed before Milestone 2 (mainnet deployment):

- [ ] `PATCH /subscriptions/:id` verifies chat ownership before applying changes
- [ ] bot tokens confirmed absent from git history and CI logs
- [ ] RPC endpoint pinned to a known-good mainnet provider, not user-configurable
- [ ] indexer poll-cycle error handling confirmed not to crash the process on a single
      adapter failure
- [ ] basic rate limiting on public API endpoints

## 10. Non-Goals

Rattlr explicitly does not attempt to provide: transaction execution, custody, fund
recovery, or protection against a protocol's own contract bugs. It is a monitoring and
notification layer only.
