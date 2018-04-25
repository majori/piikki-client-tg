import _ from 'lodash';
import * as api from '../api';
import { CallbackDataTypeEnum } from '../constants/callbackEnum';

export const setDefault = async (ctx: any) => {
  const { username, saldos, defaultGroup } = await api.getUser(ctx.state.username);

  if (_.size(saldos) === 1) {
    // User already has a default group
    if (defaultGroup) {
      ctx.reply(
        `Your default group is already set to *${defaultGroup}* and its your only group, you are good to go!`,
        { parse_mode: 'Markdown' },
      );

      // User has only one group, but the default group isn't it
    } else {
      const groupName = _.keys(saldos)[0];
      await api.setDefaultGroup(username, groupName);
      ctx.reply(
        `I've set your default group to *${groupName}*, since its your only group.`,
        { parse_mode: 'Markdown' },
      );
    }
    return;
  }

  const groups = _.chain(saldos)
    .keys()
    .map((group) => ({
      text: group,
      callback_data: _.join([CallbackDataTypeEnum.setDefaultGroup, group], ';'),
    }))
    .value();

  if (_.isEmpty(groups)) {
    ctx.reply('You are not a member in any group yet. You can join groups with /join');
    return;
  }

  if (ctx.message.chat.type !== 'private') {
    ctx.reply('Let\'s continue in the private chat.');
  }

  ctx.telegram.sendMessage(ctx.message.from.id, 'Pick one of the following groups as a default one', {
    reply_markup: {
      inline_keyboard: _.chunk(groups, 2),
    },
  });
};

export const joinGroup = async (ctx: any) => {
  const { username, saldos } = await api.getUser(ctx.state.username);

  const available = _.map(await api.getGroups(), (group: Group) => _.pick(group, ['name', 'private']));
  const old = _.keys(saldos).map((group) => ({ name: group }));

  const groups = _.chain(available)
    .differenceBy(old, 'name')
    .map((group) => ({
      text: (group.private ? '🔒 ' : '') + group.name,
      callback_data: _.join([
        group.private ? CallbackDataTypeEnum.joinPrivateGroup : CallbackDataTypeEnum.joinGroup,
        group.name,
      ], ';'),
    }))
    .value();

  if (_.isEmpty(groups)) {
    ctx.reply('It seems that you are already a member in every possible group!');
    return;
  }

  if (ctx.message.chat.type !== 'private') {
    ctx.reply('Let\'s continue in the private chat.');
  }
  ctx.telegram.sendMessage(ctx.message.from.id, 'Join one of the following groups', {
    reply_markup: {
      inline_keyboard: _.chunk(groups, 2),
    },
  });
};

export const partGroup = async (ctx: any) => {
  const { username, saldos } = await api.getUser(ctx.state.username);

  const groupNames = _.keys(saldos);

  const groups = _.chain(groupNames)
    .map((group) => ({
      text: group,
      callback_data: _.join([CallbackDataTypeEnum.partGroup, group], ';'),
    }))
    .value();

  if (_.isEmpty(groups)) {
    ctx.reply('It seems that you aren\'t a member of any group!');
    return;
  }

  ctx.telegram.sendMessage(ctx.message.from.id, 'Choose the group you wish to part', {
    reply_markup: {
      inline_keyboard: _.chunk(groups, 2),
    },
  });
};
