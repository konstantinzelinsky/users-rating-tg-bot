import { Filter } from 'https://deno.land/x/grammy@v1.27.0/filter.ts';

import { BotContext } from './bot.ts';
import {
  hasRatingEmoji,
  hasRatingUpEmoji,
  hasRatingDownEmoji
} from './emoji.ts';
import {
  getAuthorOfMessageWithReaction,
  getUserFullname,
  changeUserRating
} from './helper.ts';

export const handleUsersRatingByReactionEvent = async (
  ctx: Filter<BotContext, 'message_reaction'>
) => {
  const { emojiAdded, emojiRemoved, emojiKept } = ctx.reactions();

  if (!hasRatingEmoji([...emojiAdded, ...emojiKept, ...emojiRemoved])) {
    return;
  }

  if (
    (hasRatingUpEmoji(emojiKept) &&
      (hasRatingUpEmoji(emojiAdded) || hasRatingUpEmoji(emojiRemoved))) ||
    (hasRatingDownEmoji(emojiKept) &&
      (hasRatingDownEmoji(emojiAdded) || hasRatingDownEmoji(emojiRemoved))) ||
    (hasRatingUpEmoji(emojiAdded) && hasRatingUpEmoji(emojiRemoved)) ||
    (hasRatingDownEmoji(emojiAdded) && hasRatingDownEmoji(emojiRemoved))
  ) {
    return;
  }

  const reactionAuthor = ctx.messageReaction.user;

  if (!reactionAuthor) {
    return;
  }

  const messageAuthor = await getAuthorOfMessageWithReaction(
    ctx.messageReaction.chat.id,
    ctx.messageReaction.message_id,
    { deleteForwardedMessage: false }
  );

  const reactionAuthorName = getUserFullname(
    reactionAuthor.first_name,
    reactionAuthor.last_name
  );
  const messageAuthorName = getUserFullname(
    messageAuthor.first_name,
    messageAuthor.last_name
  );

  if (messageAuthor.id === reactionAuthor.id) {
    const { newRating } = changeUserRating(ctx, messageAuthor.username, -1);
    ctx.reply(
      `Ха-ха, ${reactionAuthorName} поставил(а) реакцию себе, рейтинг уменьшен. Новый рейтинг ${newRating}`
    );

    return;
  }

  if (messageAuthor.is_bot) {
    ctx.reply(`${reactionAuthorName} поставил(а) реакцию на сообщение бота`);

    return;
  }

  if (
    hasRatingUpEmoji(emojiAdded) &&
    !hasRatingUpEmoji(emojiRemoved) &&
    !hasRatingUpEmoji(emojiKept)
  ) {
    const { newRating } = changeUserRating(ctx, messageAuthor.username, 1);
    ctx.reply(
      `${reactionAuthorName} увеличил(а) рейтинг ${messageAuthorName}. Новый рейтинг ${newRating}`
    );
  }

  if (
    hasRatingUpEmoji(emojiRemoved) &&
    !hasRatingUpEmoji(emojiAdded) &&
    !hasRatingUpEmoji(emojiKept)
  ) {
    const { newRating } = changeUserRating(ctx, messageAuthor.username, -1);
    ctx.reply(
      `${reactionAuthorName} уменьшил(а) рейтинг ${messageAuthorName}. Новый рейтинг ${newRating}`
    );
  }

  if (
    hasRatingDownEmoji(emojiAdded) &&
    !hasRatingDownEmoji(emojiRemoved) &&
    !hasRatingDownEmoji(emojiKept)
  ) {
    const { newRating } = changeUserRating(ctx, messageAuthor.username, -1);
    ctx.reply(
      `${reactionAuthorName} уменьшил(а) рейтинг ${messageAuthorName}. Новый рейтинг ${newRating}`
    );
  }

  if (
    hasRatingDownEmoji(emojiRemoved) &&
    !hasRatingDownEmoji(emojiAdded) &&
    !hasRatingDownEmoji(emojiKept)
  ) {
    const { newRating } = changeUserRating(ctx, messageAuthor.username, 1);
    ctx.reply(
      `${reactionAuthorName} увеличил(а) рейтинг ${messageAuthorName}. Новый рейтинг ${newRating}`
    );
  }
};
