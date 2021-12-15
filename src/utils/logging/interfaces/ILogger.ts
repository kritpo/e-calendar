import { LoggingLevelEnum } from '../types';

/**
 * generic logger structure
 */
export interface ILogger {
	log(level: LoggingLevelEnum, message: string, err?: Error): void;

	debug(message: string, err?: Error): void;

	info(message: string): void;

	warn(message: string, err?: Error): void;

	error(message: string, err?: Error): void;

	fatal(message: string, err?: Error): void;
}
