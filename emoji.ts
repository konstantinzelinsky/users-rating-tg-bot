import { ReactionTypeEmoji } from 'https://deno.land/x/grammy@v1.27.0/types.ts';
import { Reactions } from 'https://deno.land/x/grammy_emoji@v1.2.0/mod.ts';

export const ratingUpEmojiList: ReactionTypeEmoji['emoji'][] = [
  Reactions.thumbs_up,
  Reactions.handshake,
  Reactions.red_heart,
  Reactions.fire
];
export const ratingDownEmojiList: ReactionTypeEmoji['emoji'][] = [
  Reactions.thumbs_down,
  Reactions.face_vomiting,
  Reactions.pile_of_poo,
  Reactions.clown_face
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
