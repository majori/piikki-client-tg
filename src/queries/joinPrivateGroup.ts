import Logger from '../logger';

const logger = new Logger(__filename);

const queryHandler = async (ctx: any) => {
  return ctx.scene.enter('joinPrivateGroup');
};

export default queryHandler;
