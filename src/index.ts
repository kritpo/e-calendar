import 'reflect-metadata';

import dotenv from 'dotenv';

import { app } from './app';
import { getEnv } from './utils/getEnv';
import { getLogger } from './utils/logging/getLogger';

dotenv.config({ path: `/.env.${process.env.NODE_ENV?.toLowerCase() ?? ''}` });
dotenv.config();

/**
 * main logger
 */
const LOGGER = getLogger('E-Calendar');

const PORT = parseInt(getEnv('PORT', '8080'));
app.listen(PORT, () => LOGGER.info(`Server is running on port ${PORT}`));
