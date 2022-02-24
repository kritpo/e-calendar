import { singleton } from 'tsyringe';

import { IPublicCalendar } from '../../Calendar/Calendar';
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
	 * check if the user is authorized for the Calendar service restrictions
	 *
	 * @param user the user
	 * @param askedCalendar the calendar object to verify authorizations
	 * @returns if the user is authorized to do actions on calendar
	 */
	public isCalendarOwned(
		user: IPublicUser,
		askedCalendar: IPublicCalendar
	): boolean {
		return user.id === askedCalendar.ownerId;
	}

	/**
	 * check if the user is authorized for the Calendar service restrictions
	 *
	 * @param user the user
	 * @param askedCalendar the calendar object to verify authorizations
	 * @returns if the user is authorized to do actions on calendar
	 */
	public isCalendarAccessible(
		user: IPublicUser,
		askedCalendar: IPublicCalendar
	): boolean {
		return (
			this.isCalendarOwned(user, askedCalendar) ||
			new Set(askedCalendar.collaboratorsIds).has(user.id)
		);
	}

	/**
	 * check if the user is authorized for the Event service restrictions
	 *
	 * @param user the user
	 * @param askedCalendar the calendar object to verify authorizations
	 * @param askedEvent the event object to verify authorizations
	 * @returns if the user is authorized to do actions on event
	 */
	public isEventAccessible(
		user: IPublicUser,
		askedCalendar: IPublicCalendar,
		askedEvent: IPublicEvent
	): boolean {
		return (
			this.isCalendarAccessible(user, askedCalendar) ||
			new Set(askedEvent.participantsIds).has(user.id)
		);
	}
}
