import { ReactionTypeEmoji } from 'https://deno.land/x/grammy@v1.27.0/types.ts';

const ratingUpEmojiList: ReactionTypeEmoji['emoji'][] = ['👍', '🔥', '🤝'];
const ratingDownEmojiList: ReactionTypeEmoji['emoji'][] = [
  '👎',
  '🤮',
  '💩',
  '🤡'
];

const hasSomeEmojiFromList = (
  list: ReactionTypeEmoji['emoji'][],
  emoji: ReactionTypeEmoji['emoji'][]
) => {
  return list.some((ratingUpEmoji) => emoji.includes(ratingUpEmoji));
};

export const hasRatingEmoji = (emoji: ReactionTypeEmoji['emoji'][]) => {
  return hasSomeEmojiFromList(
    [...ratingUpEmojiList, ...ratingDownEmojiList],
    emoji
  );
};

export const hasRatingUpEmoji = (emoji: ReactionTypeEmoji['emoji'][]) => {
  return hasSomeEmojiFromList(ratingUpEmojiList, emoji);
};

export const hasRatingDownEmoji = (emoji: ReactionTypeEmoji['emoji'][]) => {
  return hasSomeEmojiFromList(ratingDownEmojiList, emoji);
};
