import * as path from 'path';
import * as _ from 'lodash';
import winston from 'winston';
import config from './config';

export class Logger {
  private logger: winston.Logger;

  constructor(filePath?: string) {
    const label = filePath
      ? path.basename(filePath)
      : require('../package.json').name;

    this.logger = winston.createLogger({
      level: config.logging.level,
      format: winston.format.combine(
        winston.format.label({ label }),
        winston.format.timestamp(),
        winston.format.colorize({ all: true }),
        winston.format.printf(
          ({ label, timestamp, level, message, ...meta }) => {
            const details = _.isEmpty(meta) ? '' : ` ${JSON.stringify(meta)}`;

            return `${timestamp} [${label}] ${level}: ${message}${details}`;
          },
        ),
      ),
      transports: [new winston.transports.Console()],
    });

    // Suppress console messages when testing
    if (config.env.test && process.env.LOG_LEVEL !== 'debug') {
      this.logger.clear();
    }

    this.setLevelForTransports(config.logging.level);
  }

  info(message: string, ...meta: any[]) {
    return this.logger.info(message, ...meta);
  }

  debug(message: string, ...meta: any[]) {
    return this.logger.debug(message, ...meta);
  }

  warn(message: string, ...meta: any[]) {
    return this.logger.warn(message, ...meta);
  }

  error(message: string, ...meta: any[]) {
    return this.logger.error(message, ...meta);
  }

  private setLevelForTransports(level: string) {
    _.forEach(this.logger.transports, (transport) => {
      transport.level = level;
    });
  }
}

export default Logger;
