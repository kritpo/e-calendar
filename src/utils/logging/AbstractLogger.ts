import { ILogger } from './ILogger';
import { LoggingLevelEnum } from './types';

/**
 * logger base
 */
export abstract class AbstractLogger implements ILogger {
	/**
	 * create a logger
	 *
	 * @param _origin origin of the logger
	 */
	constructor(protected _origin: string) {}

	abstract log(level: LoggingLevelEnum, message: string, err?: Error): void;

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
