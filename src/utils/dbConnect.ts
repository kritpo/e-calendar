/* istanbul ignore file */
import mongoose from 'mongoose';

import { getEnv } from './getEnv';
import { getLogger } from './logging/getLogger';

const LOGGER = getLogger('DATABASE');

/**
 * connect to the database
 */
export const dbConnect = (): void => {
	const username = getEnv('MONGODB_USERNAME');
	const password = getEnv('MONGODB_PASSWORD');
	const host = getEnv('MONGODB_HOST');
	const port = getEnv('MONGODB_PORT');
	const database = getEnv('MONGODB_DATABASE');

	const uri = `mongodb://${username}:${password}@${host}:${port}/${database}`;

	mongoose
		.connect(uri)
		.catch((err) =>
			LOGGER.fatal(
				"Can't connect to the database.",
				err instanceof Error
					? err
					: new Error("Can't connect to the database")
			)
		);
};
