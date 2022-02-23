import { Types } from 'mongoose';
import { injectable, singleton } from 'tsyringe';

import { IUser } from '../User/User';
import { getDocumentId } from '../utils/db/getDocumentId';
import { getLogger } from '../utils/logging/getLogger';
import { Event, IDate, IEvent, IPublicEvent, IRecurrence } from './Event';

const LOGGER = getLogger('EventService');

/**
 * event management service
 */
@singleton()
@injectable()
export class EventService {
	/**
	 * retrieve all events
	 *
	 * @returns all events
	 */
	public async getAllEvents(): Promise<IPublicEvent[]> {
		const events = await Event.find().exec();
		LOGGER.info(`${events.length} events are retrieved`);

		return events.map((event) => ({
			id: getDocumentId(event).toString(),
			name: event.name,
			startTime: event.startTime,
			endTime: event.endTime,
			place: event.place,
			recurrence: event.recurrence,
			description: event.description,
			participants: event.participants
		}));
	}

	/**
	 * retrieve a specific event by its id
	 *
	 * @param eventId the id of the event
	 * @returns the found event
	 */
	public async getEventById(eventId: string): Promise<IPublicEvent | null> {
		const event = await Event.findById(new Types.ObjectId(eventId)).exec();

		if (event !== null) {
			LOGGER.info(`${eventId} is retrieved`);

			return {
				id: getDocumentId(event).toString(),
				name: event.name,
				startTime: event.startTime,
				endTime: event.endTime,
				place: event.place,
				recurrence: event.recurrence,
				description: event.description,
				participants: event.participants
			};
		}

		LOGGER.info(`${eventId} does not exist and its not retrieved`);
		return null;
	}

	/**
	 * retrieve a specific event by its event name
	 *
	 * @param name the name of the event to retrieve
	 * @returns the found user
	 */
	public async getEventByName(name: string): Promise<IPublicEvent | null> {
		const eventData = { name };

		const events = await Event.find(eventData).exec();
		const event = events[0];

		if (event !== undefined) {
			LOGGER.info(`${event.name} is retrieved`);

			return {
				id: getDocumentId(event).toString(),
				name: event.name,
				startTime: event.startTime,
				endTime: event.endTime,
				place: event.place,
				recurrence: event.recurrence,
				description: event.description,
				participants: event.participants
			};
		}

		LOGGER.info(`${name} does not exist and its not retrieved`);
		return null;
	}

	/**
	 * create a new event
	 *
	 * @param name the event name
	 * @param startTime the event start time
	 * @param endTime the event end time
	 * @param place the event place
	 * @param description the event description
	 * @param participants the event participant
	 * @param recurrence the event recurrence
	 * @returns newly created event
	 */
	public async insertEvent(
		name: string,
		startTime: IDate,
		endTime: IDate,
		place: string,
		description: string,
		participants: IUser[],
		recurrence?: IRecurrence
	): Promise<IPublicEvent> {
		const eventData: IEvent = {
			name,
			startTime,
			endTime,
			place,
			recurrence,
			description,
			participants
		};

		const event = new Event(eventData);
		await event.save();

		LOGGER.info(`${event.name} is created`);

		return {
			id: getDocumentId(event).toString(),
			name: event.name,
			startTime: event.startTime,
			endTime: event.endTime,
			place: event.place,
			recurrence: event.recurrence,
			description: event.description,
			participants: event.participants
		};
	}

	/**
	 * update a specific event by its id
	 *
	 * @param eventId the id of the event
	 * @param newName the new name
	 * @param newStartTime the new start time
	 * @param newEndTime the new end time
	 * @param newPlace the new place
	 * @param newRecurrence the new recurrence
	 * @param newDescription the new description
	 * @param newParticipants the new participants
	 * @returns if the update succeed
	 */
	public async updateEventById(
		eventId: string,
		newName?: string,
		newStartTime?: IDate,
		newEndTime?: IDate,
		newPlace?: string,
		newRecurrence?: IRecurrence,
		newDescription?: string,
		newParticipants?: IUser[]
	): Promise<boolean> {
		const event = await Event.findById(new Types.ObjectId(eventId)).exec();

		if (event === null) {
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

		if (newRecurrence !== undefined) {
			event.recurrence = newRecurrence;
		}

		if (newDescription !== undefined) {
			event.description = newDescription;
		}

		if (newParticipants !== undefined) {
			event.participants = newParticipants;
		}

		await event.save();

		LOGGER.info(`${eventId} is updated`);

		return true;
	}

	/**
	 * delete a specific event by its id
	 *
	 * @param eventId the id of the event
	 * @returns if the deletion succeed
	 */
	public async deleteEventById(eventId: string): Promise<boolean> {
		const event = await Event.findById(new Types.ObjectId(eventId)).exec();

		if (event === null) {
			LOGGER.info(`${eventId} does not exist and its not retrieved`);

			return false;
		}

		await event.delete();

		LOGGER.info(`${eventId} is deleted`);

		return true;
	}
}
