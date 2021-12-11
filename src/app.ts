import path from 'path';

import bodyParser from 'body-parser';
import express from 'express';
import swaggerUi from 'swagger-ui-express';

import { registerRequestLogger } from './utils/logging/registerRequestLogger';
import { RegisterRoutes } from './utils/tsoa/routes';

/**
 * main express application
 */
export const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

registerRequestLogger(app);

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
