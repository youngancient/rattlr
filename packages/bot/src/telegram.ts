import { Telegraf } from "telegraf";

export function createTelegramBot(token: string): Telegraf {
  const bot = new Telegraf(token);

  bot.start((ctx) => {
    // TODO: guide the user through subscribing a wallet address + threshold.
    ctx.reply("Welcome to Rattlr. Subscribe a wallet to get liquidation-risk alerts.");
  });

  return bot;
}

export async function sendTelegramAlert(bot: Telegraf, chatId: string, message: string): Promise<void> {
  await bot.telegram.sendMessage(chatId, message);
}
