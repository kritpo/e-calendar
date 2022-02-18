/* istanbul ignore file */
import mongoose from 'mongoose';

import { getEnv } from '../getEnv';
import { getLogger } from '../logging/getLogger';

const LOGGER = getLogger('DATABASE');

/**
 * connect to the database
 */
export const dbConnect = (): void => {
	const user = getEnv('MONGODB_USERNAME');
	const pass = getEnv('MONGODB_PASSWORD');
	const host = getEnv('MONGODB_HOST');
	const port = getEnv('MONGODB_PORT');
	const dbName = getEnv('MONGODB_DATABASE');

	const uri = `mongodb://${host}:${port}`;

	mongoose
		.connect(uri, { user, pass, dbName })
		.catch((err) =>
			LOGGER.fatal(
				"Can't connect to the database.",
				err instanceof Error
					? err
					: new Error("Can't connect to the database")
			)
		);
};
