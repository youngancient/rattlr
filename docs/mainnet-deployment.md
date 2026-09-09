# Mainnet Deployment Record

Status: blocked — Milestone 1 (testnet) must complete first. No mainnet deployment
attempted. Do not replace `TODO` fields with guessed values.

## Deployment Summary

Network:

```text
Stacks Mainnet
```

Deployment date:

```text
TODO
```

## Zest Contract

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
TODO — STACKS_RPC_URL (mainnet)
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

## Self-Funded Mainnet Position (Milestone 2)

Required: a real mainnet position opened with the builder's own funds — a small amount
of sBTC as collateral, borrowed against at a modest amount — monitored for at least 7
consecutive days.

Wallet address:

```text
TODO
```

Collateral deposit tx ID:

```text
TODO
```

Borrow tx ID:

```text
TODO
```

7-day monitoring log:

```text
See usage-metrics.md — Mainnet Position Log
```

## Deployment Verification

- [ ] mainnet config references no testnet contract addresses
- [ ] `STACKS_NETWORK=mainnet` confirmed in deployed environment
- [ ] `ZEST_CONTRACT_ADDRESS` / `ZEST_CONTRACT_NAME` point at mainnet
- [ ] indexer polling confirmed against mainnet RPC
- [ ] dashboard live URL reachable without login, showing real mainnet data
- [ ] subscription flow (`POST /subscriptions`, `PATCH /subscriptions/:id`) verified
      against mainnet-tracked wallets
- [ ] bot tokens confirmed production (not shared with testnet deployment)
- [ ] self-funded mainnet position open and actively tracked
- [ ] at least one real mainnet alert fired and logged (see usage-metrics.md)
- [ ] results write-up published disclosing wallet address and transaction IDs
