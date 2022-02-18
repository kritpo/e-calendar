import { singleton } from 'tsyringe';

import { IPublicEvent } from '../../Event/Event';
import { IPublicUser } from '../../User/User';

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
	public isUserSelf(user: IPublicUser, askedUser: IPublicUser): boolean {
		return user.id === askedUser.id;
	}

	/**
	 * check if the event is authorized for the Event service restrictions
	 *
	 * @param event the event
	 * @param askedEvent the event object to verify authorizations
	 * @returns if the event is authorized to do actions on event
	 */
	public isEventSelf(event: IPublicEvent, askedEvent: IPublicEvent): boolean {
		return event.id === askedEvent.id;
	}
}
