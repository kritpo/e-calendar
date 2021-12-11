/**
 * retrieve the env variable
 *
 * @param name env variable name
 * @param defaultValue default value if the `name` env variable doesn't exist
 * @returns the env variable
 */
export const getEnv = (name: string, defaultValue?: string): string =>
	process.env[name] ?? defaultValue ?? '';
