import { checkExistence } from './checkExistance';

/**
 * retrieve the env variable
 *
 * @param name env variable name
 * @param defaultValue default value if the `name` env variable doesn't exist
 * @returns the env variable
 */
export const getEnv = (name: string, defaultValue?: string): string => {
	const data = process.env[name];

	if (checkExistence(data)) {
		return data;
	}

	if (checkExistence(defaultValue)) {
		return defaultValue;
	}

	throw new Error(`The environment variable ${name} is not defined`);
};
