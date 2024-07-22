import { load } from 'https://deno.land/std@0.224.0/dotenv/mod.ts';

const fileEnv = await load();

export const env = {
  BOT_API_KEY: fileEnv.BOT_API_KEY ?? Deno.env.get('BOT_API_KEY'),
  CLOUD_STORAGE: fileEnv.CLOUD_STORAGE ?? Deno.env.get('CLOUD_STORAGE')
};
