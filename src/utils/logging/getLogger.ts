import { getEnv } from '../getEnv';
import { ILogger } from './interfaces/ILogger';
import { DevLogger } from './models/DevLogger';
import { ProdLogger } from './models/ProdLogger';

/**
 * get a logger environment dependent
 *
 * @param origin logger origin
 * @returns logger
 */
export const getLogger = (origin: string): ILogger =>
	getEnv('NODE_ENV') === 'production'
		? new ProdLogger(origin)
		: new DevLogger(origin);
