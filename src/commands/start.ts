export default async (ctx: any) => {
  ctx.reply(
    'Hello there! You can start by logging into your account with ' +
    '/login `[username]` `[password]` command.',
    { parse_mode: 'Markdown' },
  );
};
