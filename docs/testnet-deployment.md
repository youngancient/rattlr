# Testnet Deployment Record

Status: not yet deployed — Milestone 1 has not started. Do not replace `TODO` fields with
guessed values.

## Deployment Summary

Network:

```text
Stacks Testnet
```

Deployment date:

```text
TODO
```

## Zest Contract (Milestone 1 target)

Contract address:

```text
TODO — ZEST_CONTRACT_ADDRESS
```

Contract name:

```text
TODO — ZEST_CONTRACT_NAME
```

RPC endpoint:

```text
https://api.testnet.hiro.so
```

## Live Services

Dashboard URL:

```text
TODO
```

API URL:

```text
TODO
```

Telegram bot:

```text
TODO — @handle
```

Discord bot:

```text
TODO — invite link
```

## Testnet Alert Demonstration

Required by Milestone 1: a real testnet position, manually pushed past a configured
threshold, with a timestamped alert screenshot and the on-chain transaction ID.

Wallet address:

```text
TODO
```

Threshold configured:

```text
TODO (e.g. health factor below 1.2)
```

Transaction ID (position pushed past threshold):

```text
TODO
```

Alert screenshot:

```text
TODO
```

See [`usage-metrics.md`](./usage-metrics.md) for the full testnet alert log.

## Deployment Verification

- [ ] indexer polling against testnet RPC, 60s interval confirmed
- [ ] `ZEST_CONTRACT_ADDRESS` / `ZEST_CONTRACT_NAME` point at testnet, not mainnet
- [ ] dashboard live URL reachable without login for viewing/lookup
- [ ] aggregate stats endpoint returns real (non-zero) data
- [ ] wallet lookup returns real position data for a tracked wallet
- [ ] wallet-signature auth required before `POST /subscriptions` succeeds
- [ ] Telegram deep link lands in the bot and activates a pending subscription on confirm
- [ ] Discord `/link <code>` activates a pending subscription on confirm
- [ ] threshold crossing triggers a real alert in both channels
- [ ] `/threshold` in a linked chat and `PATCH /subscriptions/:id` from the dashboard
      both update a threshold without re-linking
