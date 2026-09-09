# Reproducing a Rattlr Flow

Status: no live deployment yet — this procedure applies once Milestone 1 (testnet) or
Milestone 2 (mainnet) is live. Used both as an internal verification checklist and as the
independent-reproduction evidence referenced in Milestone 2 and 3.

## Prerequisites

- a Stacks wallet with an open position on Zest (testnet for early verification, mainnet
  once Milestone 2 is live)
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

1. Message the Telegram or Discord bot.
2. Provide your wallet address and a threshold above your position's current health
   factor, so it will trigger on the next real change (or use a testnet position you can
   deliberately move).
3. Wait for a poll cycle (target ≤60s after the threshold-crossing transaction confirms).
4. Confirm you receive a private alert message in the chat you subscribed from — not a
   shared public channel.
5. Update your threshold via the bot and confirm it applies without needing to
   re-subscribe.

## Verification Checklist

- [ ] dashboard-displayed health factor matches an independent read-only contract call
- [ ] wallet lookup works for a wallet not previously looked up by the tester
- [ ] no login or wallet connection was required to view dashboard data
- [ ] subscription created successfully via Telegram or Discord
- [ ] alert received matches the actual threshold-crossing event (correct wallet,
      correct health factor, plausible timestamp relative to the on-chain transaction)
- [ ] alert was private to the subscribing chat, not posted publicly
- [ ] threshold update applied without needing to re-subscribe

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
