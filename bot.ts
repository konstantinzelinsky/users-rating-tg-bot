import {
  Bot,
  Context,
  SessionFlavor
} from 'https://deno.land/x/grammy@v1.27.0/mod.ts';
import { session } from 'https://deno.land/x/grammy@v1.27.0/mod.ts';
import { freeStorage } from 'https://deno.land/x/grammy_storages@v2.4.2/free/src/mod.ts';

import { env } from './config.ts';
import { handleUsersRatingByReactionEvent } from './rating.ts';

interface SessionData {
  usersRating: Record<string, number>;
}

export type BotContext = Context & SessionFlavor<SessionData>;

const apiKey = env['BOT_API_KEY'];
const isCloudStorage = env['CLOUD_STORAGE'] === '1';

if (!apiKey) {
  throw new Error('API key NOT_FOUND');
}

export const bot = new Bot<BotContext>(apiKey);

bot.use(
  session({
    initial: () => ({
      usersRating: {
        konstantinzelinsky: 2,
        marinalvdgs: 3
      }
    }),
    storage: isCloudStorage ? freeStorage(bot.token) : undefined
  })
);

bot.command('rating', (ctx) => {
  ctx.reply(
    `Вот текущий рейтинг пользователей:\n${Object.entries(
      ctx.session.usersRating
    )
      .sort(([, ratingA], [, ratingB]) => ratingB - ratingA)
      .map(([username, rating]) => `@${username}: ${rating}`)
      .join('\n')}`
  );
});

bot.on('message_reaction', async (ctx) => {
  await handleUsersRatingByReactionEvent(ctx);
});
