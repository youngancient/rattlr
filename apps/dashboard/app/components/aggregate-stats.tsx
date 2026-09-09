"use client";

import { useEffect, useState } from "react";
import { fetchAggregateStats, type AggregateStats } from "@/lib/api";

export function AggregateStatsPanel() {
  const [stats, setStats] = useState<AggregateStats | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAggregateStats().then(setStats).catch((err: Error) => setError(err.message));
  }, []);

  if (error) {
    return <p className="text-sm text-red-600 dark:text-red-400">{error}</p>;
  }

  const items = [
    { label: "Tracked positions", value: stats?.totalTracked ?? "—" },
    { label: "Protocols covered", value: stats?.protocolsCovered.length ?? "—" },
    { label: "Uptime", value: stats?.uptimeStatus ?? "—" },
  ];

  return (
    <dl className="grid w-full grid-cols-1 gap-4 sm:grid-cols-3">
      {items.map((item) => (
        <div
          key={item.label}
          className="rounded-lg border border-black/[.08] p-4 dark:border-white/[.145]"
        >
          <dt className="text-sm text-zinc-600 dark:text-zinc-400">{item.label}</dt>
          <dd className="mt-1 text-2xl font-semibold">{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}
