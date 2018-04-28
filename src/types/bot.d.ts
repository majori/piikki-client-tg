import {
  ContextMessageUpdate as TelegrafContext,
  Middleware as TelegrafMiddleware,
  CallbackQuery as TelegrafCallbackQuery,
} from './telegraf';

export interface CommandParts {
  text: string;
  command: string;
  bot: string;
  args: string;
  splitArgs: string[];
}

export interface State {
  username: string;
  command: CommandParts;
}

interface CallbackQuery extends TelegrafCallbackQuery {
  params?: any;
}

export interface Context extends TelegrafContext<State> {
  callbackQuery?: CallbackQuery;
}

export type Middleware = (ctx: Context, next: () => Promise<any>) => Promise<any>;
