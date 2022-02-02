import * as express from 'express';

import { IPublicUser } from '../../User/User';

/**
 * retrieve the user from the request
 *
 * @param req the request
 * @returns the retrieved user
 */
export const getUserFromRequest = (
	req: express.Request
): IPublicUser | null => {
	return (req as { user?: IPublicUser }).user ?? null;
};
