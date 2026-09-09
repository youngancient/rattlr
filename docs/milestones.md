# Milestones

Grant: Stacks Endowment Q3 2026, Getting Started Track — Market Efficiency & Risk. Ask:
$8,000 across 3 milestones, split 20/30/50. Full submission draft:
[`artifact/grant_app.md`](../artifact/grant_app.md).

Each milestone answers a different question rather than being a smaller version of the
next one: Milestone 1 asks whether the system works, Milestone 2 asks whether it's live,
Milestone 3 asks whether anyone besides the builder actually uses it.

## Milestone 1 — 20% / $1,600, Weeks 1–4: Testnet Dashboard + Alert Bot

- Indexer reads position and health-factor data from Zest's testnet contracts via Stacks
  read-only calls, polling on a fixed interval (target: every 60 seconds).
- Public dashboard (a live URL, not a local screenshot) displays current testnet position
  health data, refreshed on the same polling interval.
- Telegram and Discord bot sends a message to a configured chat when a specific wallet's
  position crosses a threshold the user sets in advance (e.g., health factor below 1.2).
- A real testnet position is opened, manually pushed past its configured threshold, and a
  timestamped screenshot of the resulting alert is captured alongside the on-chain
  transaction ID.
- Public GitHub repository with the indexer, bot, and dashboard code, a README with local
  setup steps, and the full list of environment variables needed to run it.
- Demo video, under 5 minutes, screen-recorded, showing the dashboard live and the alert
  firing in real time in response to the testnet transaction above.

## Milestone 2 — 30% / $2,400, Weeks 5–8: Mainnet Deployment and Verified Core

- Indexer, dashboard, and bot deployed against Zest's mainnet contracts, pointed at real
  mainnet position data.
- A real mainnet position opened on Zest using the builder's own funds — a small amount
  of sBTC as collateral, borrowed against at a modest amount — left running under live
  monitoring for at least 7 consecutive days.
- Results write-up disclosing the mainnet position's wallet address and the transaction
  IDs for opening it, so anyone can verify it independently on a block explorer.
- One end-to-end log covering that week: the wallet address, the tracked health-factor
  value at 3 separate timestamps, and one real alert firing, with the alert message
  timestamp and the on-chain block height at that moment.
- Mainnet deployment guide published as a markdown file in the repo, listing exact steps
  (RPC endpoint, contract addresses, environment variables) another developer would need
  to run the project against Zest mainnet themselves.
- Public link to the live mainnet dashboard so anyone can check current uptime and data
  without needing an invite.

## Milestone 3 — 50% / $4,000, Weeks 9–12: Second Protocol and External Validation

- Granite's mainnet contracts added as a second data source in the same indexer and
  dashboard, so both protocols' positions show on one page.
- Dashboard confirmed tracking at least 20 real, currently-open mainnet positions across
  the two protocols combined, with a timestamped snapshot (screenshot or exported data
  file) published showing that count on a specific date.
- Uptime monitor (e.g., UptimeRobot or equivalent) run against the dashboard and bot for
  a continuous 14-day window, with the resulting public uptime report showing at least
  99% availability published.
- At least 2 people who did not work on this project give a real Stacks wallet address
  with an open position on Zest or Granite, subscribe it to the alert bot, and post
  public, dated proof they received a real alert.
- Results write-up covering total alerts fired during the monitoring window, the uptime
  report, what broke or didn't work as expected, and links to both external users' public
  confirmations.
- Final grant update posted in the Endowment's tracking system linking to the repo, the
  live dashboard, the uptime report, the results write-up, and both pieces of external
  proof.

## Success Metrics (all milestones)

- Alert delivery latency from threshold-crossing to message sent.
- Dashboard/bot uptime, target 99%+ over any given monitoring window.
- Number of independently-confirmed external users receiving real alerts.
- Number of positions tracked across supported protocols.
- Zero false negatives on manually-tested threshold crossings during Milestone 1 and 2
  testing.

Live-tracked evidence against these targets: [`usage-metrics.md`](./usage-metrics.md).
