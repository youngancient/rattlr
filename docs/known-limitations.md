# Known Limitations

## Rattlr Is Read-Only and Non-Custodial
Rattlr does not execute liquidations, trades, or any on-chain transaction on a user's
behalf, and does not lend, borrow, or hold any user funds. It can only notify — it cannot
protect a position from liquidation.

## Alert Delivery Is Best-Effort, Not Guaranteed
Delivery depends on the Telegram/Discord APIs, the bot process being online, and the
subscriber's own notification settings. There is no SLA (see the root README's
maintenance plan). A missed or delayed alert is possible.

## Polling Introduces Latency
The indexer reads position data on a fixed interval, target every 60 seconds, not on
every block. A position can cross its threshold and be liquidated within that window
before an alert fires.

## Health-Factor Accuracy Depends on the Source Protocol
Rattlr reads health-factor and position data as computed and exposed by each protocol's
own Clarity contracts. It does not independently re-derive or audit that calculation —
an error or edge case in a protocol's own health-factor logic would be reflected as-is in
Rattlr's data.

## RPC Endpoint Is a Trust Dependency
Position data is only as reliable as the configured Stacks RPC endpoint
(`STACKS_RPC_URL`). A stale, degraded, or misconfigured RPC endpoint can cause incorrect
or delayed data without Rattlr itself being wrong.

## No Historical Data Before Tracking Starts
Rattlr only stores snapshots from the point a wallet is first tracked. It cannot
reconstruct a position's health-factor history before that.

## Protocol Contract Changes Can Break Tracking
If a protocol updates its contracts (as Zest has already done once, moving to V2), the
indexer's parsing logic must be updated to match. Until that happens, tracking for that
protocol can silently produce stale or incorrect data. This is an ongoing maintenance
cost, not a one-time build risk.

## Dashboard Is Lookup-Only by Design
There is no directory or list of all tracked wallets, and no endpoint that enumerates
them. This is intentional (see the PRD), not a missing feature — a visitor must already
know the wallet address they want to look up.

## Single-Instance Services in This Phase
The indexer, API, and bot each run as a single process with no redundancy or failover
during Milestones 1–2. An instance crash or restart is a temporary gap in monitoring
until it recovers.

## Managing an Alert Requires a Wallet
Viewing the dashboard and looking up a position never requires a wallet. Creating or
editing an alert subscription does — a user without a Leather/Xverse wallet available
cannot set up or change an alert, even to track a wallet that isn't their own. This cuts
against the "passive borrower who forgets about the loan" persona in the PRD's target
users, who still has to complete a wallet-connect-and-sign step once at setup.

## Zest's Bitcoin Collateral Vaults Are Out of Scope
Zest's newer product, where BTC is held on L1 and borrowing happens on EVM chains, is
architecturally different from its existing Stacks lending market and is not tracked by
Rattlr.
