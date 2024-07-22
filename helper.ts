import { Filter } from 'https://deno.land/x/grammy@v1.27.0/filter.ts';

import { bot, BotContext } from './bot.ts';

export const changeUserRating = (
  ctx: Filter<BotContext, 'message_reaction'>,
  messageAuthorUsername: string,
  changeNumber: number
) => {
  if (!ctx.session.usersRating[messageAuthorUsername]) {
    ctx.session.usersRating[messageAuthorUsername] = 0;
  }

  ctx.session.usersRating[messageAuthorUsername] += changeNumber;

  return {
    ratingChangeNumber: changeNumber,
    newRating: ctx.session.usersRating[messageAuthorUsername] ?? 0
  };
};

export const getUserFullname = (
  firstname: string | undefined,
  lastname: string | undefined
) => {
  if (firstname && lastname) {
    return `${firstname} ${lastname}`;
  }

  if (firstname) {
    return firstname;
  }

  if (lastname) {
    return lastname;
  }

  return 'Unknown name';
};

export const getAuthorOfMessageWithReaction = async (
  chatId: number,
  messageId: number,
  { deleteReply }: { deleteReply: boolean }
) => {
  const reply = await bot.api.sendMessage(chatId, 'UsersRating', {
    reply_parameters: {
      message_id: messageId,
      chat_id: chatId
    },
    disable_notification: true
  });

  if (deleteReply) {
    await bot.api.deleteMessage(reply.chat.id, reply.message_id);
  }

  return {
    originalMessageAuthor: reply.reply_to_message?.from,
    replyMessageId: reply.message_id
  };
};
