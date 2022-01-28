/* istanbul ignore file */
import { Express, Request } from 'express';
import morgan from 'morgan';

import { getLogger } from './getLogger';

const LOGGER = getLogger('REQUEST');

morgan.token<Request>('parameters', (req) => {
	let body = req.body as unknown;

	if (body !== null && typeof body === 'object') {
		let maskedBody = JSON.stringify(body, null, 2);
		maskedBody = maskedBody.replace(
			/"password": ".+",?\n/g,
			'"password": "***"'
		);

		body = JSON.parse(maskedBody);
	}

	const parameters = {
		query: req.query,
		body
	};

	return JSON.stringify(parameters, null, 2);
});

const skipTests = (): boolean => process.env.NODE_ENV === 'test';

const stream = {
	write: (message: string): void => LOGGER.info(message.slice(0, -1))
};

/**
 * register the request logger
 *
 * @param app express application
 */
export const registerRequestLogger = (app: Express): void => {
	app.use(
		morgan('## START ## [:remote-addr] :method :url\n:parameters', {
			immediate: true,
			skip: skipTests,
			stream
		})
	);
	app.use(
		morgan(
			'## END ## [:remote-addr] :status - :method :url - :response-time ms',
			{
				skip: skipTests,
				stream
			}
		)
	);
};
