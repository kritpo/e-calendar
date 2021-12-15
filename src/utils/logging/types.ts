/**
 * logging levels
 */
export enum LoggingLevelEnum {
	/**
	 * debugging message for development usage
	 */
	DEBUG,

	/**
	 * informative message
	 */
	INFO,

	/**
	 * warning message for issue which not causes any damages
	 */
	WARN,

	/**
	 * error message for issue which can causes abnormal behavior
	 */
	ERROR,

	/**
	 * fatal message for issue which ends by the crash of the application
	 */
	FATAL
}
