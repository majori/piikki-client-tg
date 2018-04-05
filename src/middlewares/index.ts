import _ from 'lodash';
import auth from './auth';

export default (bot: any) => {
  bot.use(auth);
};
