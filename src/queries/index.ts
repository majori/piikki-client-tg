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
import type { Telegraf } from 'telegraf';
import { Context } from 'types/bot';

const logger = new Logger(__filename);

export default (bot: Telegraf<Context>) => {
  bot.on('callback_query', async (ctx: Context, next: () => Promise<any>) => {
    logger.debug('Callback Query', ctx.callbackQuery);

    const callbackQuery = ctx.callbackQuery!;

    if (!callbackQuery.data) {
      ctx.answerCbQuery();
    }

    const query = _.split(callbackQuery.data!, ';');
    const command = _.first(query);
    const group = _.tail(query)[0];

    switch (command) {
      case CallbackDataTypeEnum.setDefaultGroup:
        return setDefaultGroup(ctx, group);

      case CallbackDataTypeEnum.keepDefaultGroup:
        return keepDefaultGroup(ctx, group);

      case CallbackDataTypeEnum.joinGroup:
        return joinGroup(ctx, group);

      case CallbackDataTypeEnum.joinPrivateGroup:
        return joinPrivateGroup(ctx);

      case CallbackDataTypeEnum.partGroup:
        return partGroup(ctx, group);

      default:
        return ctx.answerCbQuery();
    }
  });

  bot.on('inline_query', (ctx) => {
    return ctx.answerInlineQuery([]);
  });
};
