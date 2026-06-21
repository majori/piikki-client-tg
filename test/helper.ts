import sinon from 'sinon';
import { Telegraf as TelegrafBot } from 'telegraf';
import createBot from '../src/bot';

export const botInfo = {
  id: 123456789,
  is_bot: true,
  first_name: 'test_piikki_tg_bot',
  username: 'test_piikki_tg_bot',
  can_join_groups: true,
  can_read_all_group_messages: false,
  supports_inline_queries: false,
} as const;

export async function createTestableBot() {
  const bot = new TelegrafBot('test_token');

  sinon.stub(bot.telegram, 'getMe').resolves(botInfo);

  return createBot(bot as any);
}

export function contextBuilder() {
  return {
    state: {
      username: 'user',
    },
    reply: sinon.spy(),
  };
}
