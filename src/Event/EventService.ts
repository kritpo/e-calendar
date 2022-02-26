import { HydratedDocument, Types } from 'mongoose';
import { injectable, singleton } from 'tsyringe';

import { AbstractBaseService } from '../Base/BaseService';
import { IPublicCalendar } from '../Calendar/Calendar';
import { checkExistence } from '../utils/checkExistence';
import { getDocumentId } from '../utils/db/getDocumentId';
import { getLogger } from '../utils/logging/getLogger';
import {
	Event,
	IDate,
	IEvent,
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
export class EventService extends AbstractBaseService<
	IEventExtended,
	IPublicEvent
> {
	/**
	 * retrieve the public date
	 *
	 * @param date the date document
	 * @returns the public date
	 */
	private _retrievePublicDate(date: IDate): IDate {
		return {
			day: date.day,
			month: date.month,
			year: date.year,
			hour: date.hour,
			minute: date.minute
		};
	}

	/**
	 * retrieve the public recurrence
	 *
	 * @param recurrence the recurrence document
	 * @returns the public recurrence
	 */
	private _retrievePublicRecurrence(
		recurrence?: IRecurrence
	): IRecurrence | undefined {
		return checkExistence(recurrence)
			? {
					type: recurrence.type,
					end: this._retrievePublicDate(recurrence.end)
			  }
			: recurrence;
	}

	/**
	 * retrieve the public event
	 *
	 * @param event the event document
	 * @returns the public event
	 */
	protected _retrievePublicType(
		event: HydratedDocument<IEventExtended>
	): IPublicEvent {
		return {
			id: getDocumentId(event).toString(),
			calendarId: event.calendarId,
			name: event.name,
			startTime: this._retrievePublicDate(event.startTime),
			endTime: this._retrievePublicDate(event.endTime),
			place: event.place,
			description: event.description,
			participantsIds: event.participantsIds,
			recurrence: this._retrievePublicRecurrence(event.recurrence)
		};
	}

	/**
	 * create a new event
	 *
	 * @param calendar the calendar
	 * @param eventData the event data
	 * @returns newly created event
	 */
	public async insert(
		calendar: IPublicCalendar,
		eventData: IEvent
	): Promise<IPublicEvent> {
		const eventExtendedData: IEventExtended = {
			...eventData,
			calendarId: calendar.id,
			participantsIds: [
				...new Set([
					calendar.ownerId,
					...calendar.collaboratorsIds,
					...eventData.participantsIds
				])
			]
		};

		const event = await this._insert(Event, eventExtendedData);

		LOGGER.info(`${event.name} is created`);

		return event;
	}

	/**
	 * retrieve all events
	 *
	 * @param calendarId the calendar id
	 * @param userId the user id
	 * @returns all events
	 */
	public async getAll(
		calendarId: string,
		userId?: string
	): Promise<IPublicEvent[]> {
		const events = await Event.find({
			calendarId,
			participantsIds: userId
		}).exec();

		LOGGER.info(`${events.length} events are retrieved`);

		return events.map((event) => this._retrievePublicType(event));
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
		const event = await this._getByIdPublicType(Event, eventId);
		const isCorrect =
			checkExistence(event) && event.calendarId === calendarId;

		LOGGER.info(
			isCorrect
				? `${eventId} is retrieved`
				: `${eventId} does not exist and its not retrieved`
		);

		return isCorrect ? event : null;
	}

	/**
	 * update a specific event by its id
	 *
	 * @param calendar the calendar
	 * @param eventId the event id
	 * @param newEventData the event new data
	 * @returns if the update succeed
	 */
	public async updateById(
		calendar: IPublicCalendar,
		eventId: string,
		newEventData: Partial<IEvent>
	): Promise<boolean> {
		const event = await Event.findById(new Types.ObjectId(eventId)).exec();

		if (!checkExistence(event) || event.calendarId !== calendar.id) {
			LOGGER.info(`${eventId} does not exist and its not retrieved`);

			return false;
		}

		if (checkExistence(newEventData.name)) {
			event.name = newEventData.name;
		}

		if (checkExistence(newEventData.startTime)) {
			event.startTime = newEventData.startTime;
		}

		if (checkExistence(newEventData.endTime)) {
			event.endTime = newEventData.endTime;
		}

		if (checkExistence(newEventData.place)) {
			event.place = newEventData.place;
		}

		if (checkExistence(newEventData.description)) {
			event.description = newEventData.description;
		}

		if (checkExistence(newEventData.participantsIds)) {
			event.participantsIds = [
				...new Set([
					calendar.ownerId,
					...calendar.collaboratorsIds,
					...newEventData.participantsIds
				])
			];
		}

		if (checkExistence(newEventData.recurrence)) {
			event.recurrence = newEventData.recurrence;
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
		const event = await this._getById(Event, eventId);

		if (!checkExistence(event) || event.calendarId !== calendarId) {
			LOGGER.info(`${eventId} does not exist and its not retrieved`);

			return false;
		}

		await event.delete();

		LOGGER.info(`${eventId} is deleted`);

		return true;
	}
}
