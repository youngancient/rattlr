import { createTelegramBot } from "./telegram.js";
import { createDiscordBot } from "./discord.js";

const telegramToken = process.env.TELEGRAM_BOT_TOKEN;
const discordToken = process.env.DISCORD_BOT_TOKEN;

if (!telegramToken || !discordToken) {
  console.warn("[bot] TELEGRAM_BOT_TOKEN or DISCORD_BOT_TOKEN missing; see .env.example");
  process.exit(1);
}

const telegramBot = createTelegramBot(telegramToken);
const discordBot = createDiscordBot();

// TODO: subscribe to threshold-crossing events from @rattlr/indexer (once that
// pipeline exists) and call sendTelegramAlert / sendDiscordAlert here.

await telegramBot.launch();
await discordBot.login(discordToken);

console.log("[bot] telegram + discord bots started");

process.once("SIGINT", () => {
  telegramBot.stop("SIGINT");
  discordBot.destroy();
});
