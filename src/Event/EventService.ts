import { Types } from 'mongoose';
import { injectable, singleton } from 'tsyringe';

import { getDocumentId } from '../utils/getDocumentId';
import { getLogger } from '../utils/logging/getLogger';
import { SecurityService } from '../utils/security/SecurityService';
import { Event, PublicEventType } from './Event';

const LOGGER = getLogger('UserService');

/**
 * event management service
 */
@singleton()
@injectable()
export class EventService {
	/**
	 * inject dependencies
	 *
	 * @param _securityService the service which manage security
	 */
	constructor(private _securityService: SecurityService) {}

	/**
	 * retrieve a specific event by its id
	 *
	 * @param eventId the id of the event
	 * @returns the found event
	 */
	public async getById(eventId: string): Promise<PublicEventType | null> {
		const event = await Event.findById(new Types.ObjectId(eventId)).exec();

		if (event !== null) {
			LOGGER.info(`${eventId} is retrieved`);

			return {
				id: getDocumentId(event).toString(),
				name: event.name,
				startTime: event.startTime,
				endTime: event.endTime,
				place: event.place,
				description: event.description
			};
		}

		LOGGER.info(`${eventId} does not exist and its not retrieved`);

		return null;
	}
}
