import crypto from 'crypto';

import sha1 from 'crypto-js/sha1';
import { addMinutes, isAfter, isBefore } from 'date-fns';
import { singleton } from 'tsyringe';

import { getEnv } from '../getEnv';
import { getLogger } from '../logging/getLogger';

const LOGGER = getLogger('SecurityService');

interface IToken {
	token: string;
	expires: Date;
}

export interface ISecurityTokens {
	accessToken: IToken;
	refreshToken: IToken;
}

type SecurityStoreType = Record<string, ISecurityTokens>;

/**
 * security management service
 */
@singleton()
export class SecurityService {
	private _securityStore: SecurityStoreType;

	/**
	 * generate a random token
	 *
	 * @returns the generated token
	 */
	private _generateToken(): string {
		return crypto.randomBytes(20).toString('hex');
	}

	/**
	 * generate a security tokens
	 *
	 * @returns the generated security tokens
	 */
	private _generateSecurityTokens(): ISecurityTokens {
		const now = new Date();

		return {
			accessToken: {
				token: this._generateToken(),
				expires: addMinutes(
					now,
					parseInt(getEnv('ACCESS_TOKEN_EXPIRES_MINUTES'))
				)
			},
			refreshToken: {
				token: this._generateToken(),
				expires: addMinutes(
					now,
					parseInt(getEnv('REFRESH_TOKEN_EXPIRES_MINUTES'))
				)
			}
		};
	}

	/**
	 * create a security manager service
	 */
	constructor() {
		this._securityStore = {};
	}

	/**
	 * get user id from access token
	 *
	 * @param accessToken the access token
	 * @returns the user id or null if not exist
	 */
	public getUserIDFromAccessToken(accessToken: string): string | null {
		const securityData = Object.entries(this._securityStore).filter(
			([, data]) =>
				data.accessToken.token === accessToken &&
				isBefore(new Date(), data.accessToken.expires)
		);

		return securityData.length === 1 ? securityData[0][0] : null;
	}

	/**
	 * create new tokens for the user
	 *
	 * @param userId the user id
	 * @returns the created tokens
	 */
	public createToken(userId: string): ISecurityTokens {
		const securityTokens = this._generateSecurityTokens();

		this._securityStore[userId] = {
			...securityTokens
		};

		LOGGER.info(`${userId} tokens are created`);

		return securityTokens;
	}

	/**
	 * refresh the user access token
	 *
	 * @param userId the user id
	 * @param refreshToken the refresh token associated to the user
	 * @returns the newly created tokens or null if refresh token is wrong
	 */
	public updateAccessTokenToken(
		userId: string,
		refreshToken: string
	): ISecurityTokens | null {
		const token = this._securityStore[userId].refreshToken;

		if (
			token === undefined ||
			token.token !== refreshToken ||
			isAfter(new Date(), token.expires)
		) {
			LOGGER.info(`Wrong refresh token were given for ${userId}`);

			return null;
		}

		const securityTokens = this._generateSecurityTokens();

		this._securityStore[userId] = {
			...securityTokens
		};

		LOGGER.info(`${userId} tokens are renewed`);

		return securityTokens;
	}

	/**
	 * hash a password
	 *
	 * @param password the password to hash
	 * @returns the hashed password
	 */
	public hashPassword(password: string): string {
		const seed = getEnv('SEED', 'e-calendar');

		return sha1(password + seed).toString();
	}
}
