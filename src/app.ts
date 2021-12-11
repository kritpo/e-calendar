import path from 'path';

import bodyParser from 'body-parser';
import express from 'express';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';

import { RegisterRoutes } from './utils/tsoa/routes';

/**
 * main express application
 */
export const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(
	morgan(
		'[:date[iso]] :status - :method :url - :res[content-length] o - :response-time ms',
		{
			/* eslint-disable jsdoc/require-jsdoc */
			skip: () => process.env.NODE_ENV === 'test'
		}
	)
);

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
