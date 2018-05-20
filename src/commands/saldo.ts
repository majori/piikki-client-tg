import _ from 'lodash';
import * as api from '../api';
import messages from '../constants/messages';

import { Middleware } from '../types/bot';

const command: Middleware = async (ctx) => {
  const user = await api.getUser(ctx.state.username);

  if (_.isEmpty(user.saldos)) {
    ctx.reply(messages.notAMemberInAnyGroup);
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

export default command;
