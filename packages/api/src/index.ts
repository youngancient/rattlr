import Fastify from "fastify";
import { positionRoutes } from "./routes/positions.js";
import { subscriptionRoutes } from "./routes/subscriptions.js";

const app = Fastify({ logger: true });

app.get("/health", async () => ({ status: "ok" }));

await app.register(positionRoutes);
await app.register(subscriptionRoutes);

const port = Number(process.env.PORT ?? 3001);
await app.listen({ port, host: "0.0.0.0" });
