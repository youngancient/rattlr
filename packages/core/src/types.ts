export type ProtocolId = "zest" | "granite";

export type AlertChannel = "telegram" | "discord";

/**
 * A single point-in-time snapshot of a lending position, as read from a
 * protocol's Clarity contracts via a Stacks read-only call.
 */
export interface Position {
  protocol: ProtocolId;
  walletAddress: string;
  /** Base units (e.g. sats), kept as a string to avoid float precision loss. */
  collateralAmount: string;
  /** Base units of the borrowed asset, kept as a string to avoid float precision loss. */
  debtAmount: string;
  healthFactor: number;
  timestamp: string;
  blockHeight: number;
}

/** A user's configured alert subscription for one wallet + protocol pair. */
export interface AlertThreshold {
  id: string;
  walletAddress: string;
  protocol: ProtocolId;
  healthFactorThreshold: number;
  channel: AlertChannel;
  chatId: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Common interface every protocol integration (Zest, Granite, ...) implements,
 * so the indexer pipeline doesn't change shape when a second protocol is added.
 */
export interface ProtocolAdapter {
  id: ProtocolId;
  fetchPosition(walletAddress: string): Promise<Position | null>;
}
