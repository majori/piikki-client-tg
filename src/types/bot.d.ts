import type { Context as TelegrafContext, MiddlewareFn } from 'telegraf';

export interface CommandParts {
  text: string;
  command: string;
  bot: string;
  args: string;
  splitArgs: string[];
}

export interface State {
  username?: string;
  command?: CommandParts;
}

export interface Context extends TelegrafContext {
  scene?: any;
  session?: any;
  state: any;
}

export type Middleware = MiddlewareFn<Context>;

export interface Scene {
  enter(ctx: any): any;
  on(command: string, ctx: any): any;
}
