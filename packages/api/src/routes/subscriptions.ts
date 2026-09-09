import type { FastifyInstance } from "fastify";
import type { AlertChannel, ProtocolId } from "@rattlr/core";

interface CreateSubscriptionBody {
  walletAddress: string;
  protocol: ProtocolId;
  healthFactorThreshold: number;
  channel: AlertChannel;
  chatId: string;
}

interface UpdateSubscriptionBody {
  healthFactorThreshold: number;
}

/**
 * Subscription routes. A subscriber can update their threshold at any
 * time without re-subscribing (PATCH below),
 * reconfirmed via the same chat that created the subscription.
 */
export async function subscriptionRoutes(app: FastifyInstance): Promise<void> {
  app.post<{ Body: CreateSubscriptionBody }>("/subscriptions", async (request, reply) => {
    // TODO: persist a new AlertThreshold, keyed by wallet + protocol + channel + chatId.
    void request.body;
    return reply.code(501).send({ error: "not implemented" });
  });

  app.patch<{ Params: { id: string }; Body: UpdateSubscriptionBody }>(
    "/subscriptions/:id",
    async (request, reply) => {
      // TODO: verify the request comes from the same chat that owns this subscription,
      // then update healthFactorThreshold in place (no re-subscription required).
      void request.params;
      void request.body;
      return reply.code(501).send({ error: "not implemented" });
    },
  );
}
