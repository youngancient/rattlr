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
- stored subscriptions (tracked wallet address, protocol, threshold, chat ID, owning
  signing-wallet principal, pending link codes)
- session/auth tokens issued after signature verification
- service availability (indexer uptime, bot uptime, API/dashboard uptime)

Wallet addresses and position data are already public on-chain and are not treated as
secret. Chat IDs and the mapping from a signing wallet to its subscriptions are the
closest thing to sensitive data Rattlr stores.

## 3. Security Goals

1. an alert is only ever sent to the chat linked to the matching active subscription
2. a subscription can only be created, viewed, or edited by the wallet that signed to
   create it — not by browser storage, not by knowing the tracked wallet address
3. no user funds are ever requested or handled; the only signature Rattlr requests is an
   off-chain message signature for subscription auth, never a transaction
4. a compromised bot token cannot expose anything beyond already-public on-chain data
5. an indexer or RPC failure degrades to "no new data," never to silently wrong data
   being displayed as current
6. a pending subscription's link code cannot be used to hijack an unrelated subscription,
   and expires rather than staying valid indefinitely

## 4. Subscription Ownership

Two related but distinct checks apply, replacing the earlier "same chat" model:

- **Management auth:** `POST /subscriptions`, `PATCH /subscriptions/:id`, and any listing
  of a wallet's own subscriptions require a valid signature from the owning wallet
  principal (or a short-lived session token issued after that signature was verified).
  This is the actual authorization boundary — misrouting or spoofing it means someone
  else's alerts could be silently redirected, muted, or read.
- **Chat linking:** a pending subscription's Telegram deep link or Discord `/link <code>`
  is a one-time, short-lived credential that ties a specific chat/channel to a specific
  subscription. It is scoped to linking only — it does not grant management rights over
  the subscription (those stay with the signing wallet), and it must be invalidated after
  first use or after expiry.

The signing wallet is never required to match the wallet whose position is being tracked
— see the [PRD](../artifact/prd.md) §6.2. That's an intentional product decision, not a
gap: Rattlr's trust model doesn't depend on ownership of the tracked address, only on
control of the subscription's own management identity.

## 4a. Signature Replay and Session Handling

A captured signed authentication message must not be replayable to re-authenticate
indefinitely. Mitigation: bind the signed message to a nonce and a short expiry (or issue
a short-lived session token after the first verification, rather than re-verifying a raw
signature on every request), and require a fresh signature once that session expires.
Session tokens, if used, are a new asset to protect against theft (e.g. XSS) — standard
web-session hardening applies (httpOnly storage, short TTL, no token in URLs or logs).

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

- [ ] `POST /subscriptions` / `PATCH /subscriptions/:id` verify a valid signature from
      the owning wallet before applying changes
- [ ] pending link codes (Telegram deep link, Discord `/link` code) expire and are
      single-use
- [ ] session tokens (if used) are short-lived, httpOnly, and never logged
- [ ] bot tokens confirmed absent from git history and CI logs
- [ ] RPC endpoint pinned to a known-good mainnet provider, not user-configurable
- [ ] indexer poll-cycle error handling confirmed not to crash the process on a single
      adapter failure
- [ ] basic rate limiting on public API endpoints

## 10. Non-Goals

Rattlr explicitly does not attempt to provide: transaction execution, custody, fund
recovery, or protection against a protocol's own contract bugs. It is a monitoring and
notification layer only.
