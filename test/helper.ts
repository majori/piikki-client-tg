import sinon from 'sinon';
import TelegrafBot from 'telegraf';
import { Telegraf } from '../src/types/telegraf';
import createBot from '../src/bot';

export const botInfo = {
  id: 123456789,
  is_bot: true,
  first_name: 'test_piikki_tg_bot',
  username: 'test_piikki_tg_bot',
};

export async function createTestableBot() {
  const bot = new TelegrafBot('test_token');

  sinon.stub(bot.telegram, 'getMe').resolves(botInfo);

  return createBot(bot);
}

export function contextBuilder() {
  return {
    state: {
      username: 'user',
    },
    reply: sinon.spy(),
  };
}
