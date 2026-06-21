import type { Middleware } from 'types/bot';

const splitArgs = (value: string) => {
  const matches = value.match(/"([^"]*)"|(\S+)/g);

  if (!matches) {
    return [];
  }

  return matches.map((match) =>
    match.startsWith('"') && match.endsWith('"') ? match.slice(1, -1) : match,
  );
};

const middleware: Middleware = async (ctx, next) => {
  const text = ctx.message && 'text' in ctx.message ? ctx.message.text : '';

  if (!text.startsWith('/')) {
    return next();
  }

  const [rawCommand, ...rest] = text.split(' ');
  const [command, bot = ''] = rawCommand.slice(1).split('@');
  const args = rest.join(' ').trim();

  ctx.state.command = {
    text,
    command,
    bot,
    args,
    splitArgs: splitArgs(args),
  };

  return next();
};

export default middleware;
