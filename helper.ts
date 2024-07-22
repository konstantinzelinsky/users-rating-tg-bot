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
  { deleteForwardedMessage }: { deleteForwardedMessage: boolean }
) => {
  const forwardedMessage = await bot.api.forwardMessage(
    chatId,
    chatId,
    messageId
  );

  if (deleteForwardedMessage) {
    await bot.api.deleteMessage(
      forwardedMessage.chat.id,
      forwardedMessage.message_id
    );
  }

  // deno-lint-ignore ban-ts-comment
  // @ts-ignore
  return forwardedMessage.forward_from as {
    id: number;
    is_bot: boolean;
    first_name: string;
    last_name: string;
    username: string;
  };
};
