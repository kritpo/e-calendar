import { getEnv } from '../getEnv';
import { DevLogger } from './DevLogger';
import { ILogger } from './ILogger';
import { ProdLogger } from './ProdLogger';

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
