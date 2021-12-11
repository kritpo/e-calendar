import path from 'path';

import bodyParser from 'body-parser';
import express from 'express';
import morgan from 'morgan';
import swaggerUi, { SwaggerUiOptions } from 'swagger-ui-express';

import { RegisterRoutes } from './utils/tsoa/routes';

/**
 * swagger-ui-express options to generate API docs from path /public/swagger.json
 */
const SWAGGER_OPTIONS: SwaggerUiOptions = {
	swaggerOptions: {
		url: '/public/swagger.json'
	}
};

/**
 * main express application
 */
export const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(
	morgan(
		'[:date[iso]] :status - :method :url - :res[content-length] o - :response-time ms'
	)
);

app.use((_, response, next) => {
	response.removeHeader('X-Powered-By');

	next();
});

app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/docs', swaggerUi.serve, swaggerUi.setup({}, SWAGGER_OPTIONS));

RegisterRoutes(app);
