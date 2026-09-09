import type { FastifyInstance } from "fastify";

/**
 * Position routes. There is no listing endpoint that enumerates all
 * tracked wallets — only:
 *  - aggregate stats (count, protocols covered, uptime)
 *  - lookup of one wallet's position by address
 */
export async function positionRoutes(app: FastifyInstance): Promise<void> {
  app.get("/positions/aggregate", async () => {
    // TODO: return { totalTracked, protocolsCovered, uptimeStatus } from storage.
    return { totalTracked: 0, protocolsCovered: [], uptimeStatus: "unknown" };
  });

  app.get<{ Params: { walletAddress: string } }>("/positions/:walletAddress", async (request, reply) => {
    // TODO: look up the latest snapshot for this wallet from storage.
    const { walletAddress } = request.params;
    void walletAddress;
    return reply.code(404).send({ error: "not found" });
  });
}
