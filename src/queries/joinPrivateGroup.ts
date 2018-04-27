import _ from 'lodash';
import * as api from '../api';
import Logger from '../logger';

const logger = new Logger(__dirname);

export default async (ctx: any) => {
  return ctx.answerCbQuery('This group is private!', true);
};
