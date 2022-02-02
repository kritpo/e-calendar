import { Types } from 'mongoose';
import { injectable, singleton } from 'tsyringe';

import { getDocumentId } from '../utils/db/getDocumentId';
import { getLogger } from '../utils/logging/getLogger';
import { SecurityService } from '../utils/security/SecurityService';
import { IPublicUser, IUser, User } from './User';

const LOGGER = getLogger('UserService');

/**
 * user management service
 */
@singleton()
@injectable()
export class UserService {
	/**
	 * inject dependencies
	 *
	 * @param _securityService the service which manage security
	 */
	constructor(private _securityService: SecurityService) {}

	/**
	 * create a new account
	 *
	 * @param username the account username
	 * @param plainPassword the account plain password
	 * @returns newly created account
	 */
	public async insertUserByUsernameAndPassword(
		username: string,
		plainPassword: string
	): Promise<IPublicUser> {
		const password = this._securityService.hashPassword(plainPassword);
		const userData: IUser = { username, password };

		const user = new User(userData);
		await user.save();

		LOGGER.info(`${user.username} is created`);

		return { id: getDocumentId(user).toString(), username };
	}

	/**
	 * retrieve all user
	 *
	 * @returns all users
	 */
	public async getAll(): Promise<IPublicUser[]> {
		const users = await User.find().exec();

		LOGGER.info(`${users.length} users is retrieved`);

		return users.map((user) => ({
			id: getDocumentId(user).toString(),
			username: user.username
		}));
	}

	/**
	 * retrieve a specific user by its username
	 *
	 * @param username the username of the user to retrieve
	 * @returns the found user
	 */
	public async getByUsername(username: string): Promise<IPublicUser | null> {
		const userData = { username };

		const users = await User.find(userData).exec();
		const user = users[0];

		if (user !== undefined) {
			LOGGER.info(`${user.username} is retrieved`);

			return { id: getDocumentId(user).toString(), username };
		}

		LOGGER.info(`${username} does not exist and its not retrieved`);

		return null;
	}

	/**
	 * retrieve a specific user by its username and password
	 *
	 * @param username the username of the user to retrieve
	 * @param plainPassword the plain password of the user to retrieve
	 * @returns the found user
	 */
	public async getByUsernameAndPassword(
		username: string,
		plainPassword: string
	): Promise<IPublicUser | null> {
		const password = this._securityService.hashPassword(plainPassword);
		const userData = { username, password };

		const users = await User.find(userData).exec();
		const user = users[0];

		if (user !== undefined) {
			LOGGER.info(`${user.username} is retrieved`);

			return { id: getDocumentId(user).toString(), username };
		}

		LOGGER.info(`${username} does not exist and its not retrieved`);

		return null;
	}

	/**
	 * retrieve a specific user by its id
	 *
	 * @param userId the id of the user
	 * @returns the found user
	 */
	public async getById(userId: string): Promise<IPublicUser | null> {
		const user = await User.findById(new Types.ObjectId(userId)).exec();

		if (user !== null) {
			LOGGER.info(`${userId} is retrieved`);

			return {
				id: getDocumentId(user).toString(),
				username: user.username
			};
		}

		LOGGER.info(`${userId} does not exist and its not retrieved`);

		return null;
	}

	/**
	 * update a specific user by its id
	 *
	 * @param userId the id of the user
	 * @param newUsername the new username
	 * @param plainNewPassword the new password
	 * @returns if the update succeed
	 */
	public async updateById(
		userId: string,
		newUsername?: string,
		plainNewPassword?: string
	): Promise<boolean> {
		const user = await User.findById(new Types.ObjectId(userId)).exec();

		if (user === null) {
			LOGGER.info(`${userId} does not exist and its not retrieved`);

			return false;
		}

		if (newUsername !== undefined) {
			user.username = newUsername;
		}

		if (plainNewPassword !== undefined) {
			const newPassword =
				this._securityService.hashPassword(plainNewPassword);
			user.password = newPassword;
		}

		await user.save();

		LOGGER.info(`${userId} is updated`);

		return true;
	}

	/**
	 * delete a specific user by its id
	 *
	 * @param userId the id of the user
	 * @returns if the deletion succeed
	 */
	public async deleteById(userId: string): Promise<boolean> {
		const user = await User.findById(new Types.ObjectId(userId)).exec();

		if (user === null) {
			LOGGER.info(`${userId} does not exist and its not retrieved`);

			return false;
		}

		await user.delete();

		LOGGER.info(`${userId} is deleted`);

		return true;
	}
}
