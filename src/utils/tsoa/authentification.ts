import * as express from 'express';
import * as jwt from 'jsonwebtoken';

// STUB: to replace

/**
 * /!\ ONLY FOR TSOA USAGE /!\
 *
 * @param {express.Request} request request object
 * @param {string} securityName name of the security definition
 * @param {string[]} scopes requested scopes
 * @returns {Promise<boolean>} connection status
 */
export const expressAuthentication = (
	request: express.Request,
	securityName: string,
	scopes?: string[]
): Promise<boolean> => {
	if (securityName === 'jwt') {
		const authorization = request.headers.authorization?.split(' ');

		if (authorization && authorization[0] === 'Bearer') {
			return new Promise((resolve, reject) => {
				const token = authorization[1];

				if (!token) {
					reject(new Error('No token provided'));
				}

				jwt.verify(token, '[SECRET]', function (err, decoded) {
					if (err) {
						reject(err);
					} else {
						for (const scope of scopes ?? []) {
							if (
								!(decoded?.scopes as string[])?.includes(scope)
							) {
								reject(
									new Error(
										'JWT does not contain required scope.'
									)
								);
							}
						}
						resolve(true);
					}
				});
			});
		}
	}

	return Promise.reject(new Error('No authentication credentials'));
};
