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
import { Telegraf } from 'types/telegraf';
import { Context, CallbackQuery } from 'types/bot';

const logger = new Logger(__dirname);

export default (bot: Telegraf) => {
  bot.on('callback_query', async (ctx: Context, next: () => Promise<any>) => {
    logger.debug('Callback Query', ctx.callbackQuery);

    const callbackQuery = ctx.callbackQuery as CallbackQuery;

    if (!callbackQuery.data) {
      ctx.answerCbQuery();
    }

    const query = _.split(callbackQuery.data as string, ';');
    const command = _.first(query);
    const params = _.tail(query);

    callbackQuery.params = params;

    switch (command) {
      case CallbackDataTypeEnum.setDefaultGroup:
        return setDefaultGroup(ctx, next);

      case CallbackDataTypeEnum.keepDefaultGroup:
        return keepDefaultGroup(ctx, next);

      case CallbackDataTypeEnum.joinGroup:
        return joinGroup(ctx, next);

      case CallbackDataTypeEnum.joinPrivateGroup:
        return joinPrivateGroup(ctx, next);

      case CallbackDataTypeEnum.partGroup:
        return partGroup(ctx, next);

      default:
        return ctx.answerCbQuery();
    }
  });

  bot.on('inline_query', (ctx) => {
    return ctx.answerInlineQuery([]);
  });
};
