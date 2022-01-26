import { singleton } from 'tsyringe';

import { PublicUserType } from '../../User/User';

/**
 * authorization management service
 */
@singleton()
export class AuthorizationService {
	/**
	 * check if the user is authorized for the User service restrictions
	 *
	 * @param user the user
	 * @param askedUser the user object to verify authorizations
	 * @returns if the user is authorized to do actions on user
	 */
	public isUserSelf(
		user: PublicUserType,
		askedUser: PublicUserType
	): boolean {
		return user.id === askedUser.id;
	}
}
