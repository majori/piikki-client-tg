import _ from 'lodash';
import Logger from '../logger';
import { Middleware } from 'types/bot';

const logger = new Logger(__filename);

const queryHandler: Middleware = async (ctx: any) => {
  return ctx.scene.enter('joinPrivateGroup');
};

export default queryHandler;
