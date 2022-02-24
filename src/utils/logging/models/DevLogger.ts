import { checkExistence } from '../../checkExistance';
import { LoggingLevelEnum } from '../types';
import { formatLog } from '../utils/formatLog';
import { AbstractLogger } from './AbstractLogger';

/**
 * development mode logger
 */
export class DevLogger extends AbstractLogger {
	/**
	 * log a message
	 *
	 * @param level log level
	 * @param message log message
	 * @param err log error
	 */
	log(level: LoggingLevelEnum, message: string, err?: Error): void {
		const date = new Date().toISOString();
		const formattedLog = `[${date}] ${this._origin}/${LoggingLevelEnum[level]}: ${message}`;

		let log = formatLog(level, formattedLog);

		if (level !== LoggingLevelEnum.INFO && checkExistence(err)) {
			let formattedError = `[${date}] ${this._origin}/TRACE: ${err.name}`;
			formattedError += checkExistence(err.stack)
				? `\n${err.stack}`
				: `[${err.message}]`;

			log += '\n' + formatLog(LoggingLevelEnum.ERROR, formattedError);
		}

		console.log(log);

		if (level === LoggingLevelEnum.FATAL) {
			process.exit(1);
		}
	}
}
