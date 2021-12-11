import { AbstractLogger } from './AbstractLogger';
import { LoggingLevelEnum } from './types';

interface ILogError {
	name: string;
	message: string;
	trace?: string;
}

/**
 * production mode logger
 */
export class ProdLogger extends AbstractLogger {
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
}
