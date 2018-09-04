# piikki-client-tg
Telegram client for [piikki](https://github.com/majori/piikki).

# Development
- Install [node.js](https://nodejs.org/en/) v8.* and [Docker](https://www.docker.com/community-edition)
- Run `npm install`
- Create local database with `docker-compose up -d`
- Copy contents of `.env-sample` to new file called `.env`
- Create your bot with [Botfather](https://telegram.me/botfather) and insert the token to `.env` file
- Initialize database with `npm run migrate`
- Run `npm run dev` to start the bot
