import { LoggingLevelEnum } from '../types';

/**
 * format log depending on the level
 *
 * @param level log level
 * @param message log message
 * @returns formatted log message
 */
export const formatLog = (level: LoggingLevelEnum, message: string): string => {
	let color = '';

	switch (level) {
		case LoggingLevelEnum.DEBUG:
			// blue
			color = '\x1b[34m';
			break;
		case LoggingLevelEnum.INFO:
			// green
			color = '\x1b[32m';
			break;
		case LoggingLevelEnum.WARN:
			// yellow
			color = '\x1b[33m';
			break;
		case LoggingLevelEnum.ERROR:
			// red
			color = '\x1b[31m';
			break;
		case LoggingLevelEnum.FATAL:
			// magenta
			color = '\x1b[35m';
			break;
	}

	return `${color}${message}\x1b[0m`;
};
