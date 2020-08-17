import 'mocha';
import { expect } from 'chai';

import { createTestableBot, botInfo } from './helper';
import { Telegraf } from '../src/types/telegraf';

describe('Bot', () => {
  let bot: any;

  before(async () => {
    bot = await createTestableBot();
  });

  it("will fetch it's name with getMe()", () => {
    expect(bot.telegram.getMe.called).to.be.true; // tslint:disable-line
    expect(bot.options).to.have.property('username', botInfo.username);
  });
});
