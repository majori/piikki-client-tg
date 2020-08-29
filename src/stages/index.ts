import _ from 'lodash';
import type { Telegraf } from 'telegraf';
import type { Context } from '../types/bot';
import Session from 'telegraf/session';
import Stage from 'telegraf/stage';
import joinPrivateGroup from './joinPrivateGroup';

export default (bot: Telegraf<Context>) => {
  const stage = new Stage();
  stage.register(joinPrivateGroup);

  bot.use(Session());
  bot.use(stage.middleware());
};
