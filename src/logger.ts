import * as path from 'path';
import * as _ from 'lodash';
import winston from 'winston';
import config from './config';

export class Logger extends winston.Logger {
  constructor(filePath?: string) {
    const label = filePath
      ? path.basename(filePath)
      : require('../package.json').name;

    super({
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
      this.clear();
    }

    this.setLevelForTransports(config.logging.level);
  }

  private setLevelForTransports(level: string) {
    _.forEach(this.transports, (transport) => {
      transport.level = level;
    });
  }
}

export default Logger;
