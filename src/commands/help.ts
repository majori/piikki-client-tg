export default async (ctx: any) => {
  ctx.reply(
    '/add `[amount]`\n - Adds saldo to your default group\n' +
    '/sub `[amount]`\n - Subtracts saldo from your default group\n' +
    '/nakki `[amount]`\n - Adds saldo to your default group as \'nakki\'\n' +
    '/saldo\n - Lists your saldos in each group\n' +
    '/login\n - Login to your Piikki account\n' +
    '/setdefault\n - Sets your default group\n' +
    '/join\n - Join to new group',
    { parse_mode: 'Markdown' },
  );
};
