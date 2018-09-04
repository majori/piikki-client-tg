import _ from 'lodash';
import { Telegraf } from 'types/telegraf';
import session from 'telegraf/session';
import Stage from 'telegraf/stage';
import joinPrivateGroup from './joinPrivateGroup';

export default (bot: Telegraf) => {

  const stage = new Stage();
  stage.register(joinPrivateGroup);

  bot.use(session());
  bot.use(stage.middleware());

};
