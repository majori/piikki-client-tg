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

interface SceneObject {
  state: {
    group: string;
    attemps: number;
  };
  leave(): any;
}

export interface Context extends TelegrafContext<State> {
  callbackQuery?: CallbackQuery;
  scene?: SceneObject;
}

export type Middleware = (ctx: Context, next?: () => Promise<any>) => Promise<any>;

export interface Scene {
  enter(ctx: any): any;
  on(command: string, ctx: any): any;
}
