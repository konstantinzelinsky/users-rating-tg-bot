import {
  Bot,
  Context,
  SessionFlavor
} from 'https://deno.land/x/grammy@v1.27.0/mod.ts';
import { session } from 'https://deno.land/x/grammy@v1.27.0/mod.ts';
import { freeStorage } from 'https://deno.land/x/grammy_storages@v2.4.2/free/src/mod.ts';

import { env } from './config.ts';
import { handleUsersRatingByReactionEvent } from './rating.ts';
import { ratingUpEmojiList, ratingDownEmojiList } from './emoji.ts';

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
      usersRating: {}
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

bot.command('help', (ctx) => {
  ctx.reply(
    `Это бот, который реагирует на реакции к сообщениям и изменяет рейтинг его автора\n
Используй следующие реакции для изменения рейтинга:
${ratingUpEmojiList.join(', ')} - повысить рейтинг
${ratingDownEmojiList.join(', ')} - понизить рейтинг\n
Доступные команды:
rating - Посмотреть текущий рейтинг пользователей
help - Посмотреть информацию о боте`
  );
});

bot.on('message_reaction', async (ctx) => {
  await handleUsersRatingByReactionEvent(ctx);
});
