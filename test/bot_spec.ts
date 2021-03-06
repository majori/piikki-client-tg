import { expect } from 'chai';

import { createTestableBot, botInfo } from './helper';

describe('Bot', () => {
  let bot: any;

  before(async () => {
    bot = await createTestableBot();
  });

  it("will fetch it's name with getMe()", async () => {
    expect(bot.telegram.getMe.called).to.be.true; // tslint:disable-line
    expect(bot.options).to.have.property('username', botInfo.username);
  });
});
