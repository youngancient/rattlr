# @rattlr/dashboard

Public Next.js dashboard for Rattlr. Shows aggregate stats and lets anyone look up a single
wallet's lending position by address — no login, no directory of tracked wallets.

See the [repo root README](../../README.md) for the full project architecture. Run from the
repo root with:

```bash
pnpm dev:dashboard
```

Requires `@rattlr/api` running locally (`pnpm dev:api`) and `NEXT_PUBLIC_API_URL` set — see
[`.env.example`](../../.env.example).
