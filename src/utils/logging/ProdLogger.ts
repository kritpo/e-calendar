import { ILogger } from './ILogger';
import { LoggingLevelEnum } from './types';

interface ILogError {
	name: string;
	message: string;
	trace?: string;
}

/**
 * production mode logger
 */
export class ProdLogger implements ILogger {
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

		let error: ILogError | undefined;
		if (level !== LoggingLevelEnum.INFO && err !== undefined) {
			error = {
				name: err.name,
				message: err.message,
				trace: err.stack
			};
		}

		const log = JSON.stringify({
			date,
			origin: this._origin,
			type: LoggingLevelEnum[level],
			message,
			error
		});

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
