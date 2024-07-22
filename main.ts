import { webhookCallback } from 'https://deno.land/x/grammy@v1.27.0/mod.ts';

import { bot } from './bot.ts';
import { env } from './config.ts';

if (env.USE_POLLING === '1') {
  bot.start({ allowed_updates: ['message_reaction', 'message'] });
  console.log('Bot started using polling');
} else {
  const handleUpdate = webhookCallback(bot, 'std/http');
  console.log('Webhook setup');

  Deno.serve(async (req) => {
    if (req.method === 'POST') {
      console.log('New POST request');
      const url = new URL(req.url);

      if (url.pathname.slice(1) === bot.token) {
        console.log('New POST request - corrent pathname');
        try {
          return await handleUpdate(req);
        } catch (err) {
          console.error(err);
        }
      }
    }

    return new Response();
  });
}
