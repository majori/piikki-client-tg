import _ from 'lodash';
import * as api from '../api';

export default async (ctx: any) => {
  const user = await api.getUser(ctx.state.username);

  if (_.isEmpty(user.saldos)) {
    ctx.reply('You are not a member in any group.');
    return;
  }

  const maxLength = _.maxBy(_.keys(user.saldos), _.size) as any;
  const saldos = _.map(
    user.saldos,
    (saldo, group) => `${_.padStart(group, maxLength)}: ${saldo}` +
        `${(_.size(user.saldos) !== 1 && group === user.defaultGroup) ? '  (default)' : ''}`,
  );

  ctx.reply(
    '```\n' + saldos.join('\n') + '\n```',
    { parse_mode: 'Markdown' },
  );
};
