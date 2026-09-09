import type { Position, ProtocolAdapter } from "@rattlr/core";

/**
 * Zest Protocol adapter. Milestone 1 targets Zest's testnet contracts;
 * Milestone 2 switches this to mainnet. See:
 * https://github.com/Zest-Protocol/zest-contracts (v1) and zest-v2-contracts.
 */
export const zestAdapter: ProtocolAdapter = {
  id: "zest",
  async fetchPosition(walletAddress: string): Promise<Position | null> {
    // TODO: call Zest's Clarity contract read-only function (e.g. get-position
    // or equivalent) via @stacks/transactions `fetchCallReadOnlyFunction`,
    // pointed at the testnet/mainnet RPC endpoint from env config, and map
    // the response into the shared Position shape.
    void walletAddress;
    throw new Error("zestAdapter.fetchPosition is not implemented yet");
  },
};
