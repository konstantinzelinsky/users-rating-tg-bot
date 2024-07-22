import { bot } from './bot.ts';

bot.start({ allowed_updates: ['message_reaction', 'message'] });
console.log('Bot started using polling');
