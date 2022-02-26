import { HydratedDocument, Types } from 'mongoose';
import { injectable, singleton } from 'tsyringe';

import { AbstractBaseService } from '../Base/BaseService';
import { EventService } from '../Event/EventService';
import { checkExistence } from '../utils/checkExistence';
import { getDocumentId } from '../utils/db/getDocumentId';
import { getLogger } from '../utils/logging/getLogger';
import {
	Calendar,
	CalendarTypeEnum,
	ICalendar,
	ICalendarExtended,
	IPublicCalendar
} from './Calendar';

const LOGGER = getLogger('CalendarService');

/**
 * calendar management service
 */
@singleton()
@injectable()
export class CalendarService extends AbstractBaseService<
	ICalendarExtended,
	IPublicCalendar
> {
	/**
	 * inject dependencies
	 *
	 * @param _eventService the service which manage event
	 */
	constructor(private _eventService: EventService) {
		super();
	}

	/**
	 * retrieve the public calendar
	 *
	 * @param calendar the calendar document
	 * @returns the public calendar
	 */
	protected async _retrievePublicType(
		calendar: HydratedDocument<ICalendarExtended>
	): Promise<IPublicCalendar> {
		const calendarId = getDocumentId(calendar).toString();
		const events = await this._eventService.getAll(calendarId);

		return {
			id: calendarId,
			eventsIds: events.map((event) => event.id),
			ownerId: calendar.ownerId,
			name: calendar.name,
			type: calendar.type,
			description: calendar.description,
			collaboratorsIds: calendar.collaboratorsIds
		};
	}

	/**
	 * create a new calendar
	 *
	 * @param ownerId the owner id
	 * @param calendarData the calendar data
	 * @returns newly created calendar
	 */
	public async insert(
		ownerId: string,
		calendarData: ICalendar
	): Promise<IPublicCalendar> {
		const calendarExtendedData: ICalendarExtended = {
			...calendarData,
			ownerId,
			collaboratorsIds:
				calendarData.type === CalendarTypeEnum.PRIVATE
					? []
					: [...new Set(calendarData.collaboratorsIds)]
		};

		const calendar = await this._insert(Calendar, calendarExtendedData);

		LOGGER.info(`${calendar.name} is created`);

		return calendar;
	}

	/**
	 * retrieve all calendars
	 *
	 * @param userId the user id
	 * @returns all calendars
	 */
	public async getAll(userId: string): Promise<IPublicCalendar[]> {
		const calendars = await Calendar.find({
			$or: [
				{ type: CalendarTypeEnum.PUBLIC },
				{ ownerId: userId },
				{ collaboratorsIds: userId }
			]
		}).exec();

		LOGGER.info(`${calendars.length} calendars is retrieved`);

		return Promise.all(
			calendars.map(
				async (calendar) => await this._retrievePublicType(calendar)
			)
		);
	}

	/**
	 * retrieve a specific calendar by its id
	 *
	 * @param calendarId the id of the calendar
	 * @returns the found calendar
	 */
	public async getById(calendarId: string): Promise<IPublicCalendar | null> {
		const calendar = await this._getByIdPublicType(Calendar, calendarId);

		LOGGER.info(
			checkExistence(calendar)
				? `${calendarId} is retrieved`
				: `${calendarId} does not exist and its not retrieved`
		);

		return calendar;
	}

	/**
	 * update a specific calendar by its id
	 *
	 * @param calendarId the id of the calendar
	 * @param newCalendarData the calendar new data
	 * @returns if the update succeed
	 */
	public async updateById(
		calendarId: string,
		newCalendarData: Partial<ICalendar>
	): Promise<boolean> {
		const calendar = await Calendar.findById(
			new Types.ObjectId(calendarId)
		).exec();

		if (!checkExistence(calendar)) {
			LOGGER.info(`${calendarId} does not exist and its not retrieved`);

			return false;
		}

		if (checkExistence(newCalendarData.name)) {
			calendar.name = newCalendarData.name;
		}

		if (checkExistence(newCalendarData.type)) {
			calendar.type = newCalendarData.type;
		}

		if (checkExistence(newCalendarData.description)) {
			calendar.description = newCalendarData.description;
		}

		calendar.collaboratorsIds =
			calendar.type === CalendarTypeEnum.PRIVATE
				? []
				: checkExistence(newCalendarData.collaboratorsIds)
				? [...new Set(newCalendarData.collaboratorsIds)]
				: calendar.collaboratorsIds;

		await calendar.save();

		LOGGER.info(`${calendarId} is updated`);

		return true;
	}

	/**
	 * delete a specific calendar by its id
	 *
	 * @param calendarId the id of the calendar
	 * @returns if the deletion succeed
	 */
	public async deleteById(calendarId: string): Promise<boolean> {
		const calendar = await this._getById(Calendar, calendarId);

		if (!checkExistence(calendar)) {
			LOGGER.info(`${calendarId} does not exist and its not retrieved`);

			return false;
		}

		const events = await this._eventService.getAll(calendarId);
		await Promise.all(
			events.map(async (event) => {
				return this._eventService.deleteById(calendarId, event.id);
			})
		);

		await calendar.delete();

		LOGGER.info(`${calendarId} is deleted`);

		return true;
	}
}
