import _ from 'lodash';
import * as api from '../api';

export default async (ctx: any) => {
  const user = await api.getUser(ctx.state.username);

  if (_.isEmpty(user.saldos)) {
    ctx.reply('You are not a member in any group.');
  }

  const maxLength = _.maxBy(_.keys(user.saldos), _.size) as any;
  const message = _.map(user.saldos, (saldo, group) => `${_.padStart(group, maxLength)}: ${saldo}`).join('\n');

  ctx.reply(
    '```\n' + message + '\n```',
    { parse_mode: 'Markdown' },
  );
};
