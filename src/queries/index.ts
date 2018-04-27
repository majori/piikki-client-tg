import _ from 'lodash';
import { sessions } from '../middlewares/auth';
import * as api from '../api';
import { CallbackDataTypeEnum } from '../constants/callbackEnum';

import setDefaultGroup from './setDefaultGroup';
import keepDefaultGroup from './keepDefaultGroup';
import joinGroup from './joinGroup';
import joinPrivateGroup from './joinPrivateGroup';
import partGroup from './partGroup';

import Logger from '../logger';

const logger = new Logger(__dirname);

export default (bot: any) => {
  bot.on('callback_query', async (ctx: any) => {
    logger.debug('Callback Query', ctx.callbackQuery);

    if (!ctx.callbackQuery.data) {
      ctx.answerCbQuery();
    }

    const query = _.split(ctx.callbackQuery.data, ';');
    const command = _.first(query);
    const params = _.tail(query);

    ctx.callbackQuery.params = params;

    switch (command) {
      case CallbackDataTypeEnum.setDefaultGroup:
        return setDefaultGroup(ctx);

      case CallbackDataTypeEnum.keepDefaultGroup:
        return keepDefaultGroup(ctx);

      case CallbackDataTypeEnum.joinGroup:
        return joinGroup(ctx);

      case CallbackDataTypeEnum.joinPrivateGroup:
        return joinPrivateGroup(ctx);

      case CallbackDataTypeEnum.partGroup:
        return partGroup(ctx);

      default:
        return ctx.answerCbQuery();
    }
  });

  bot.on('inline_query', (ctx: any) => {
    return ctx.answerInlineQuery([]);
  });
};
