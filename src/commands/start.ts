export default async (ctx: any) => {
  let msg = 'Hello there! You can start by logging into your account with ' +
    '/login `[username]` `[password]` or you can create a new account with ' +
    '/create `[username]` `[password]` command.';

  if (ctx.message.chat.type !== 'private') {
    msg += ' Either way we should do this in the private chat.';
  }

  ctx.reply(
    msg,
    { parse_mode: 'Markdown' },
  );
};
