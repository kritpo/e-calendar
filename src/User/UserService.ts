import { HydratedDocument, Types } from 'mongoose';
import { injectable, singleton } from 'tsyringe';

import { AbstractBaseService } from '../Base/BaseService';
import { checkExistence } from '../utils/checkExistence';
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
export class UserService extends AbstractBaseService<IUser, IPublicUser> {
	/**
	 * inject dependencies
	 *
	 * @param _securityService the service which manage security
	 */
	constructor(private _securityService: SecurityService) {
		super();
	}

	/**
	 * retrieve the public user
	 *
	 * @param user the user document
	 * @returns the public user
	 */
	protected _retrievePublicType(user: HydratedDocument<IUser>): IPublicUser {
		return {
			id: getDocumentId(user).toString(),
			username: user.username
		};
	}

	/**
	 * create a new account
	 *
	 * @param userData the user data
	 * @returns newly created account
	 */
	public async insert(userData: IUser): Promise<IPublicUser> {
		userData.password = this._securityService.hashPassword(
			userData.password
		);

		const user = await this._insert(User, userData);

		LOGGER.info(`${user.username} is created`);

		return user;
	}

	/**
	 * retrieve all user
	 *
	 * @returns all users
	 */
	public async getAll(): Promise<IPublicUser[]> {
		const users = await User.find().exec();

		LOGGER.info(`${users.length} users is retrieved`);

		return users.map((user) => this._retrievePublicType(user));
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

		if (checkExistence(user)) {
			LOGGER.info(`${user.username} is retrieved`);

			return this._retrievePublicType(user);
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

		if (checkExistence(user)) {
			LOGGER.info(`${user.username} is retrieved`);

			return this._retrievePublicType(user);
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
		const user = await this._getByIdPublicType(User, userId);

		LOGGER.info(
			checkExistence(user)
				? `${userId} is retrieved`
				: `${userId} does not exist and its not retrieved`
		);

		return user;
	}

	/**
	 * update a specific user by its id
	 *
	 * @param userId the id of the user
	 * @param newUserData the new user data
	 * @returns if the update succeed
	 */
	public async updateById(
		userId: string,
		newUserData: Partial<IUser>
	): Promise<boolean> {
		const user = await User.findById(new Types.ObjectId(userId)).exec();

		if (!checkExistence(user)) {
			LOGGER.info(`${userId} does not exist and its not retrieved`);

			return false;
		}

		if (checkExistence(newUserData.username)) {
			user.username = newUserData.username;
		}

		if (checkExistence(newUserData.password)) {
			const newPassword = this._securityService.hashPassword(
				newUserData.password
			);
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
		const user = await this._getById(User, userId);

		if (!checkExistence(user)) {
			LOGGER.info(`${userId} does not exist and its not retrieved`);

			return false;
		}

		await user.delete();

		LOGGER.info(`${userId} is deleted`);

		return true;
	}
}
