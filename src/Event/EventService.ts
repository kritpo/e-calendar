import { HydratedDocument, Types } from 'mongoose';
import { injectable, singleton } from 'tsyringe';

import { getDocumentId } from '../utils/db/getDocumentId';
import { getLogger } from '../utils/logging/getLogger';
import {
	Event,
	IDate,
	IEventExtended,
	IPublicEvent,
	IRecurrence
} from './Event';

const LOGGER = getLogger('EventService');

/**
 * event management service
 */
@singleton()
@injectable()
export class EventService {
	/**
	 * retrieve the public event
	 *
	 * @param event the event document
	 * @returns the public event
	 */
	private _retrievePublicEvent(
		event: HydratedDocument<IEventExtended>
	): IPublicEvent {
		return {
			id: getDocumentId(event).toString(),
			calendarId: event.calendarId,
			name: event.name,
			startTime: event.startTime,
			endTime: event.endTime,
			place: event.place,
			description: event.description,
			participantsIds: event.participantsIds,
			recurrence: event.recurrence
		};
	}

	/**
	 * create a new event
	 *
	 * @param userId the user id
	 * @param calendarId the calendar id
	 * @param name the event name
	 * @param startTime the event start time
	 * @param endTime the event end time
	 * @param place the event place
	 * @param description the event description
	 * @param participantsIds the event participants ids
	 * @param recurrence the event recurrence
	 * @returns newly created event
	 */
	public async insert(
		userId: string,
		calendarId: string,
		name: string,
		startTime: IDate,
		endTime: IDate,
		place: string,
		description: string,
		participantsIds: string[],
		recurrence?: IRecurrence
	): Promise<IPublicEvent> {
		const eventData: IEventExtended = {
			calendarId,
			name,
			startTime,
			endTime,
			place,
			description,
			participantsIds: [...new Set([userId, ...participantsIds])],
			recurrence
		};

		const event = new Event(eventData);
		await event.save();

		LOGGER.info(`${event.name} is created`);

		return this._retrievePublicEvent(event);
	}

	/**
	 * retrieve all events
	 *
	 * @param calendarId the calendar id
	 * @returns all events
	 */
	public async getAll(calendarId: string): Promise<IPublicEvent[]> {
		const events = await Event.find({ calendarId }).exec();

		LOGGER.info(`${events.length} events are retrieved`);

		return events.map((event) => this._retrievePublicEvent(event));
	}

	/**
	 * retrieve a specific event by its id
	 *
	 * @param calendarId the calendar id
	 * @param eventId the id of the event
	 * @returns the found event
	 */
	public async getById(
		calendarId: string,
		eventId: string
	): Promise<IPublicEvent | null> {
		const event = await Event.findById(new Types.ObjectId(eventId)).exec();

		if (event !== null && event.calendarId === calendarId) {
			LOGGER.info(`${eventId} is retrieved`);

			return this._retrievePublicEvent(event);
		}

		LOGGER.info(`${eventId} does not exist and its not retrieved`);

		return null;
	}

	/**
	 * update a specific event by its id
	 *
	 * @param userId the user id
	 * @param calendarId the calendar id
	 * @param eventId the event id
	 * @param newName the event new name
	 * @param newStartTime the event new start time
	 * @param newEndTime the event new end time
	 * @param newPlace the event new place
	 * @param newDescription the event new description
	 * @param newParticipantsIds the event new participants ids
	 * @param newRecurrence the event new recurrence
	 * @returns if the update succeed
	 */
	public async updateById(
		userId: string,
		calendarId: string,
		eventId: string,
		newName?: string,
		newStartTime?: IDate,
		newEndTime?: IDate,
		newPlace?: string,
		newDescription?: string,
		newParticipantsIds?: string[],
		newRecurrence?: IRecurrence
	): Promise<boolean> {
		const event = await Event.findById(new Types.ObjectId(eventId)).exec();

		if (event === null || event.calendarId !== calendarId) {
			LOGGER.info(`${eventId} does not exist and its not retrieved`);

			return false;
		}

		if (newName !== undefined) {
			event.name = newName;
		}

		if (newStartTime !== undefined) {
			event.startTime = newStartTime;
		}

		if (newEndTime !== undefined) {
			event.endTime = newEndTime;
		}

		if (newPlace !== undefined) {
			event.place = newPlace;
		}

		if (newDescription !== undefined) {
			event.description = newDescription;
		}

		if (newParticipantsIds !== undefined) {
			event.participantsIds = [
				...new Set([userId, ...newParticipantsIds])
			];
		}

		if (newRecurrence !== undefined) {
			event.recurrence = newRecurrence;
		}

		await event.save();

		LOGGER.info(`${eventId} is updated`);

		return true;
	}

	/**
	 * delete a specific event by its id
	 *
	 * @param calendarId the calendar id
	 * @param eventId the id of the event
	 * @returns if the deletion succeed
	 */
	public async deleteById(
		calendarId: string,
		eventId: string
	): Promise<boolean> {
		const event = await Event.findById(new Types.ObjectId(eventId)).exec();

		if (event === null || event.calendarId !== calendarId) {
			LOGGER.info(`${eventId} does not exist and its not retrieved`);

			return false;
		}

		await event.delete();

		LOGGER.info(`${eventId} is deleted`);

		return true;
	}
}
