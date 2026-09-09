# Reproducing a Rattlr Flow

Status: no live deployment yet — this procedure applies once Milestone 1 (testnet) or
Milestone 2 (mainnet) is live. Used both as an internal verification checklist and as the
independent-reproduction evidence referenced in Milestone 2 and 3.

## Prerequisites

- a Stacks wallet with an open position on Zest (testnet for early verification, mainnet
  once Milestone 2 is live) — the position being tracked
- a Stacks wallet to connect and sign with for subscription management (can be the same
  wallet as above, or a different one — Rattlr doesn't require them to match)
- a Telegram or Discord account
- access to the live Rattlr dashboard URL

Repository:

```text
TODO — public repo URL once published
```

Live dashboard:

```text
TODO
```

Live API:

```text
TODO
```

## Verify Position Data Independently

1. Open the live dashboard.
2. Paste your wallet address into the lookup field.
3. Note the displayed collateral, debt, and health factor.
4. Independently call the same Zest contract's read-only function yourself (directly via
   the Stacks API, or a block explorer's contract-call interface) using the contract
   address/name published in [`testnet-deployment.md`](./testnet-deployment.md) or
   [`mainnet-deployment.md`](./mainnet-deployment.md).
5. Confirm the two values match.

## Subscribe and Receive a Real Alert

1. On the dashboard, connect a wallet and sign the authentication message.
2. Enter the tracked wallet address and a threshold above its current health factor, so
   it will trigger on the next real change (or use a testnet position you can
   deliberately move). Submit.
3. Follow the returned Telegram deep link or Discord `/link <code>`, and confirm in the
   bot to activate the subscription.
4. Wait for a poll cycle (target ≤60s after the threshold-crossing transaction confirms).
5. Confirm you receive a private alert message in the linked chat — not a shared public
   channel.
6. Update your threshold either via `/threshold` in the linked chat, or by reconnecting
   your wallet on the dashboard and editing it from the "my alerts" view. Confirm it
   applies without needing to re-link the chat.
7. Reconnect the same management wallet from a different browser/device and confirm the
   same subscription is visible there too.

## Verification Checklist

- [ ] dashboard-displayed health factor matches an independent read-only contract call
- [ ] wallet lookup works for a wallet not previously looked up by the tester
- [ ] no login or wallet connection was required to view dashboard data or look up a
      position — only to create or manage a subscription
- [ ] subscription creation required a wallet signature, not just a form submission
- [ ] the tracked wallet and the signing (management) wallet were deliberately different,
      and tracking still worked
- [ ] chat linking (deep link / `/link <code>`) succeeded and activated the subscription
- [ ] alert received matches the actual threshold-crossing event (correct wallet,
      correct health factor, plausible timestamp relative to the on-chain transaction)
- [ ] alert was private to the linked chat, not posted publicly
- [ ] threshold update applied without needing to re-link the chat
- [ ] the subscription was recoverable by reconnecting the same wallet from a different
      device/browser

## Tester Evidence

Tester:

```text
TODO
```

Affiliation (team / non-team):

```text
TODO
```

Date:

```text
TODO
```

Written feedback:

```text
TODO
```
