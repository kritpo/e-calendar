import { ILogger } from './ILogger';
import { formatLog } from './formatLog';
import { LoggingLevelEnum } from './types';

/**
 * development mode logger
 */
export class DevLogger implements ILogger {
	/**
	 * create a logger
	 *
	 * @param _origin origin of the logger
	 */
	constructor(private _origin: string) {}

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

		if (level !== LoggingLevelEnum.INFO && err !== undefined) {
			let formattedError = `[${date}] ${this._origin}/TRACE: ${err.name}`;
			formattedError +=
				err.stack !== undefined ? `\n${err.stack}` : `[${err.message}]`;

			log += '\n' + formatLog(LoggingLevelEnum.ERROR, formattedError);
		}

		console.log(log);

		if (level === LoggingLevelEnum.FATAL) {
			process.exit(1);
		}
	}

	/**
	 * log a debug message
	 *
	 * @param message log message
	 * @param err log error
	 */
	debug(message: string, err?: Error): void {
		this.log(LoggingLevelEnum.DEBUG, message, err);
	}

	/**
	 * log a info message
	 *
	 * @param message log message
	 */
	info(message: string): void {
		this.log(LoggingLevelEnum.INFO, message);
	}

	/**
	 * log a warning message
	 *
	 * @param message log message
	 * @param err log error
	 */
	warn(message: string, err?: Error): void {
		this.log(LoggingLevelEnum.WARN, message, err);
	}

	/**
	 * log a error message
	 *
	 * @param message log message
	 * @param err log error
	 */
	error(message: string, err?: Error): void {
		this.log(LoggingLevelEnum.ERROR, message, err);
	}

	/**
	 * log a fatal message
	 *
	 * @param message log message
	 * @param err log error
	 */
	fatal(message: string, err?: Error): void {
		this.log(LoggingLevelEnum.FATAL, message, err);
	}
}
