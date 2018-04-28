import _ from 'lodash';
import * as api from '../api';
import Logger from '../logger';
import { Middleware } from 'types/bot';

const logger = new Logger(__dirname);

const middleware: Middleware = async (ctx: any) => {
  return ctx.scene.enter('joinPrivateGroup');
};

export default middleware;
