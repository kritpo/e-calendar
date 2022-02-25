import 'reflect-metadata';

import './setupEnv';

import { app } from './app';
import { dbConnect } from './utils/db/dbConnect';
import { getEnv } from './utils/getEnv';
import { getLogger } from './utils/logging/getLogger';

const LOGGER = getLogger('E-Calendar');

dbConnect()
	.then(() => {
		const PORT = parseInt(getEnv('PORT', '8080'));
		app.listen(PORT, () =>
			LOGGER.info(`Server is running on port ${PORT}`)
		);
	})
	.catch((err) => {
		LOGGER.fatal(
			'Application could not start correctly',
			err instanceof Error
				? err
				: new Error('Application could not start correctly')
		);
	});
