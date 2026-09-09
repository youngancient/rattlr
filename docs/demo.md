# Milestone 1 Demo Guide

Target: a single screen-recorded video, under 5 minutes, showing the dashboard live and
an alert firing in real time in response to a real testnet transaction.

## Demo Goal

Show:

> An independent, read-only dashboard tracks a real testnet lending position's health
> factor, and a bot sends a private alert the moment that position crosses a
> user-configured risk threshold — without Rattlr ever touching the user's funds or
> signing anything on their behalf.

## Setup (before recording)

1. Have a real Zest testnet position already open under a wallet Rattlr is tracking.
2. Have the dashboard deployed and reachable at a live URL.
3. Have a demo Stacks wallet (Leather/Xverse) ready to connect and sign with — this is the
   wallet that will *manage* the alert, separate from the position wallet being tracked.
4. Have the Telegram and/or Discord bot already linked to that subscription with a known
   threshold (e.g., health factor below 1.2).
4. Have a way to push the position closer to liquidation on testnet (e.g., a further
   borrow, or a simulated price move) queued and ready.

## Dashboard Walkthrough

Show, live at the public URL, not a local screenshot:

- aggregate stats (total tracked positions, protocols covered)
- wallet lookup: paste the demo wallet address, show its current health factor,
  collateral, and debt

## Subscription Walkthrough

Show, briefly, starting on the dashboard:

- connect a wallet and sign the authentication message (make clear on camera this is a
  message signature, not a transaction or fund approval)
- enter the tracked wallet address and threshold, submit
- the resulting Telegram deep link / Discord setup code
- tapping the link (or running `/link <code>`) and confirming in the bot
- the subscription now showing as active in the dashboard's "my alerts" view

## Triggering the Alert

1. Submit the queued testnet transaction that pushes the position past its threshold.
2. Note the transaction ID on screen or in the video description.
3. Wait for the indexer's next poll cycle (target ≤60s) to pick up the change.
4. Show the alert message arriving in the subscribed Telegram/Discord chat, with a
   visible timestamp.

## On-Chain Evidence

Show, or list in the video description:

```text
Testnet wallet address: TODO
Threshold configured: TODO
Transaction ID (position pushed past threshold): TODO
Alert message timestamp: TODO
```

## Demo Narration

> Rattlr reads this position's health factor directly from Zest's testnet contracts, on
> a fixed polling interval. The only signature it ever asks for is an off-chain message,
> used solely to manage your alert subscription — it never asks for transaction approval
> and never holds any funds. It only watches public on-chain state and warns the wallet
> owner before a liquidation happens, not after.

## Final Video

```text
TODO — link once published
```
