import {
  ContextMessageUpdate as TelegrafContext,
  Middleware as TelegrafMiddleware,
  CallbackQuery as TelegrafCallbackQuery,
} from './telegraf';
import { AsyncResource } from 'async_hooks';

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
  scene?: any;
}

export type Middleware = (ctx: Context, next?: () => Promise<any>) => Promise<any>;

export interface Act {
  enter(ctx: any): any;
  on(command: string, ctx: any): any;
}
