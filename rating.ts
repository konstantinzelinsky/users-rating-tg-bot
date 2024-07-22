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

  let increaseRatingCount = 0;
  let decreaseRatingCount = 0;

  if (
    hasRatingUpEmoji(emojiAdded) &&
    !hasRatingUpEmoji(emojiRemoved) &&
    !hasRatingUpEmoji(emojiKept)
  ) {
    increaseRatingCount += 1;
  }

  if (
    hasRatingDownEmoji(emojiRemoved) &&
    !hasRatingDownEmoji(emojiAdded) &&
    !hasRatingDownEmoji(emojiKept)
  ) {
    increaseRatingCount += 1;
  }

  if (
    hasRatingUpEmoji(emojiRemoved) &&
    !hasRatingUpEmoji(emojiAdded) &&
    !hasRatingUpEmoji(emojiKept)
  ) {
    decreaseRatingCount += 1;
  }

  if (
    hasRatingDownEmoji(emojiAdded) &&
    !hasRatingDownEmoji(emojiRemoved) &&
    !hasRatingDownEmoji(emojiKept)
  ) {
    decreaseRatingCount += 1;
  }

  if (ctx.session.previousBotMessageId) {
    await ctx.api.deleteMessage(ctx.chatId, ctx.session.previousBotMessageId);
  }

  const { originalMessageAuthor: messageAuthor, replyMessageId } =
    await getAuthorOfMessageWithReaction(
      ctx.messageReaction.chat.id,
      ctx.messageReaction.message_id,
      { deleteReply: false }
    );

  ctx.session.previousBotMessageId = replyMessageId;

  if (!messageAuthor || !messageAuthor.username) {
    console.log('Original message author not found');

    return;
  }

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
    await ctx.api.editMessageText(
      ctx.chatId,
      replyMessageId,
      `Ха-ха, ${reactionAuthorName} поставил(а) реакцию себе, рейтинг уменьшен. Новый рейтинг ${newRating}`
    );

    return;
  }

  if (messageAuthor.is_bot) {
    await ctx.api.editMessageText(
      ctx.chatId,
      replyMessageId,
      `${reactionAuthorName} поставил(а) реакцию на сообщение бота`
    );

    return;
  }

  if (increaseRatingCount) {
    const { newRating } = changeUserRating(
      ctx,
      messageAuthor.username,
      increaseRatingCount
    );
    await ctx.api.editMessageText(
      ctx.chatId,
      replyMessageId,
      `${reactionAuthorName} увеличил(а) рейтинг ${messageAuthorName}. Новый рейтинг ${newRating}`
    );
  }

  if (decreaseRatingCount) {
    const { newRating } = changeUserRating(
      ctx,
      messageAuthor.username,
      -decreaseRatingCount
    );
    await ctx.api.editMessageText(
      ctx.chatId,
      replyMessageId,
      `${reactionAuthorName} уменьшил(а) рейтинг ${messageAuthorName}. Новый рейтинг ${newRating}`
    );
  }
};
