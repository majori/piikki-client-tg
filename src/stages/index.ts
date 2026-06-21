import _ from 'lodash';
import { Scenes, session } from 'telegraf';
import type { Telegraf } from 'telegraf';
import type { Context } from '../types/bot';
import joinPrivateGroup from './joinPrivateGroup';

export default (bot: Telegraf<Context>) => {
  const stage = new Scenes.Stage<any>([joinPrivateGroup as any]);

  bot.use(session());
  bot.use(stage.middleware() as any);
};
