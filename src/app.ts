import path from 'path';

import bodyParser from 'body-parser';
import express, { NextFunction, Response } from 'express';
import swaggerUi from 'swagger-ui-express';
import { ValidateError } from 'tsoa';

import {
	registerRequestLogger,
	registerRequestParamsLogger
} from './utils/logging/registerRequestLogger';
import { RegisterRoutes } from './utils/tsoa/routes';

/**
 * main express application
 */
export const app = express();

registerRequestLogger(app);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

registerRequestParamsLogger(app);

app.use((_, response, next) => {
	response.removeHeader('X-Powered-By');

	next();
});

app.use('/public', express.static(path.join(__dirname, 'public')));
app.use(
	'/docs',
	swaggerUi.serve,
	swaggerUi.setup(
		{},
		{
			swaggerOptions: {
				url: '/public/swagger.json'
			}
		}
	)
);

RegisterRoutes(app);

app.use((_, res) => {
	res.status(404).send({
		message: 'Not Found'
	});
});

app.use((err: unknown, _: unknown, res: Response, next: NextFunction) => {
	if (err instanceof ValidateError) {
		res.status(400).json({
			message: 'Bad Request'
		});

		return;
	}

	if (err instanceof Error) {
		res.status(500).json({
			message: 'Internal Server Error'
		});

		return;
	}

	next();
});
