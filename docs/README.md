# Rattlr documentation

This directory is the canonical documentation set for Rattlr's design, build progress,
and Stacks Endowment grant submission. Start with the architecture and limitations
documents for design context, then use the developer guide and deployment records to run
or verify the system.

## Design and scope

- [Architecture](./architecture.md) — components, end-to-end data flow, and how to add a
  second protocol integration.
- [Known limitations](./known-limitations.md) — what Rattlr does not and cannot do,
  stated explicitly.
- [Security and threat model](./security-threat-model.md) — trust boundaries, the
  subscription-ownership authorization path, and the pre-mainnet checklist.

## Build, operate, and reproduce

- [Developer guide](./developer-guide.md) — local setup, the `ProtocolAdapter` pattern,
  and how to add a new protocol.
- [Testnet deployment record](./testnet-deployment.md) — Milestone 1 evidence: contract
  addresses, live URLs, and the testnet alert demonstration.
- [Mainnet deployment record](./mainnet-deployment.md) — deliberately incomplete
  production checklist; `TODO` values are replaced only after real deployment.
- [Demo guide](./demo.md) and [reproduction guide](./reproducibility.md) — the
  Milestone 1 demo-video script and the independent verification procedure referenced in
  Milestones 2 and 3.

## Grant evidence

- [Milestones](./milestones.md) — the grant's milestone deliverables and success
  metrics. Full submission draft: [`artifact/grant_app.md`](../artifact/grant_app.md).
- [Usage metrics](./usage-metrics.md) — the tracked evidence record against Milestone 3's
  adoption targets (20 tracked positions, 99%+ 14-day uptime, 2 external confirmed
  alerts).

The [product requirements document](../artifact/prd.md) has the full problem statement,
goals, non-goals, and functional requirements this documentation set builds on.
