import * as express from 'express';

import { PublicUserType } from '../../User/User';

/**
 * retrieve the user from the request
 *
 * @param req the request
 * @returns the retrieved user
 */
export const getUserFromRequest = (
	req: express.Request
): PublicUserType | undefined => {
	return (req as { user?: PublicUserType }).user;
};
