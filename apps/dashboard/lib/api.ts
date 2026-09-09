import type { Position, ProtocolId } from "@rattlr/core";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

export interface AggregateStats {
  totalTracked: number;
  protocolsCovered: ProtocolId[];
  uptimeStatus: string;
}

export async function fetchAggregateStats(): Promise<AggregateStats> {
  const res = await fetch(`${API_URL}/positions/aggregate`);
  if (!res.ok) {
    throw new Error(`Failed to load aggregate stats (${res.status})`);
  }
  return res.json();
}

export async function fetchPosition(walletAddress: string): Promise<Position | null> {
  const res = await fetch(`${API_URL}/positions/${encodeURIComponent(walletAddress)}`);
  if (res.status === 404) {
    return null;
  }
  if (!res.ok) {
    throw new Error(`Failed to look up position (${res.status})`);
  }
  return res.json();
}
