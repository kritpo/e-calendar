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
): IPublicUser | undefined => {
	return (req as { user?: IPublicUser }).user;
};
