import * as express from 'express';
import * as jwt from 'jsonwebtoken';
import { container } from 'tsyringe';

import { PublicUserType } from '../../User/User';
import { UserService } from '../../User/UserService';
import { getEnv } from '../getEnv';
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
export const expressAuthentication = (
	request: express.Request,
	securityName: string
): Promise<PublicUserType | undefined> => {
	if (securityName === 'jwt') {
		const authorization = request.headers.authorization?.split(' ');

		if (
			authorization &&
			authorization[0] === 'Bearer' &&
			authorization[1]
		) {
			const token = authorization[1];

			return new Promise((resolve) => {
				const secret = getEnv('JWT_SECRET');

				jwt.verify(token, secret, function (err, token) {
					if (err === null && token !== undefined) {
						const securityService =
							container.resolve(SecurityService);
						const userId = securityService.getUserIDFromAccessToken(
							token.accessToken as string
						);

						if (userId !== null) {
							const userService = container.resolve(UserService);
							userService
								.getById(userId)
								.then((user) => {
									if (user !== null) {
										LOGGER.info(
											`${userId} is authenticated`
										);

										resolve(user);
									} else {
										throw new Error(
											'The user does not exist'
										);
									}
								})
								.catch(() => {
									resolve(catchUnauthenticated());
								});
						}
					}

					resolve(catchUnauthenticated());
				});
			});
		}
	}

	return Promise.resolve(catchUnauthenticated());
};
