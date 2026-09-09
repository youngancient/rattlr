import { Client, GatewayIntentBits } from "discord.js";

export function createDiscordBot(): Client {
  const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.DirectMessages] });

  client.once("ready", () => {
    console.log(`[bot:discord] logged in as ${client.user?.tag}`);
  });

  return client;
}

export async function sendDiscordAlert(client: Client, channelId: string, message: string): Promise<void> {
  const channel = await client.channels.fetch(channelId);
  if (channel?.isTextBased() && "send" in channel) {
    await channel.send(message);
  }
}
