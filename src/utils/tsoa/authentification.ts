import * as express from 'express';
import { container } from 'tsyringe';

import { PublicUserType } from '../../User/User';
import { UserService } from '../../User/UserService';
import { getLogger } from '../logging/getLogger';
import { SecurityService } from '../security/SecurityService';

const LOGGER = getLogger('expressAuthentication');

const catchUnauthenticated = (): undefined => {
	LOGGER.info('No authentication');

	return undefined;
};

/**
 * /!\ ONLY FOR TSOA USAGE /!\
 *
 * @param request request object
 * @param securityName name of the security definition
 * @returns authenticated user data
 */
export const expressAuthentication: (
	request: express.Request,
	securityName: string,
	_: unknown
) => Promise<PublicUserType | undefined> = async (request, securityName) => {
	if (securityName === 'token') {
		const authorization = request.headers.authorization?.split(' ');

		if (
			authorization &&
			authorization[0] === 'Bearer' &&
			authorization[1]
		) {
			const token = authorization[1];

			const securityService = container.resolve(SecurityService);
			const userId = securityService.getUserIDFromAccessToken(token);

			if (userId !== null) {
				const userService = container.resolve(UserService);

				return userService
					.getById(userId)
					.then((user) => {
						if (user !== null) {
							LOGGER.info(`${userId} is authenticated`);

							return user;
						}

						throw new Error('The user does not exist');
					})
					.catch(() => {
						return catchUnauthenticated();
					});
			}
		}
	}

	return Promise.resolve(catchUnauthenticated());
};
