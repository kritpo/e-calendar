import { HydratedDocument, Types } from 'mongoose';
import { injectable, singleton } from 'tsyringe';

import { getDocumentId } from '../utils/db/getDocumentId';
import { getLogger } from '../utils/logging/getLogger';
import {
	Calendar,
	CalendarTypeEnum,
	ICalendarExtended,
	IPublicCalendar
} from './Calendar';

const LOGGER = getLogger('CalendarService');

/**
 * calendar management service
 */
@singleton()
@injectable()
export class CalendarService {
	/**
	 * retrieve the public calendar
	 *
	 * @param calendar the calendar document
	 * @returns the public calendar
	 */
	private _retrievePublicCalendar(
		calendar: HydratedDocument<ICalendarExtended>
	): IPublicCalendar {
		return {
			id: getDocumentId(calendar).toString(),
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
	 * @param name the calendar name
	 * @param type the calendar type
	 * @param description the calendar description
	 * @param collaboratorsIds the calendar collaborators ids
	 * @returns newly created calendar
	 */
	public async insert(
		ownerId: string,
		name: string,
		type: CalendarTypeEnum,
		description: string,
		collaboratorsIds: string[]
	): Promise<IPublicCalendar> {
		const calendarData: ICalendarExtended = {
			ownerId,
			name,
			type,
			description,
			collaboratorsIds:
				type === CalendarTypeEnum.PRIVATE ? [] : collaboratorsIds
		};

		const calendar = new Calendar(calendarData);
		await calendar.save();

		LOGGER.info(`${calendar.name} is created`);

		return this._retrievePublicCalendar(calendar);
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

		return calendars.map((calendar) =>
			this._retrievePublicCalendar(calendar)
		);
	}

	/**
	 * retrieve a specific calendar by its id
	 *
	 * @param calendarId the id of the calendar
	 * @returns the found calendar
	 */
	public async getById(calendarId: string): Promise<IPublicCalendar | null> {
		const calendar = await Calendar.findById(
			new Types.ObjectId(calendarId)
		).exec();

		if (calendar !== null) {
			LOGGER.info(`${calendarId} is retrieved`);

			return this._retrievePublicCalendar(calendar);
		}

		LOGGER.info(`${calendarId} does not exist and its not retrieved`);

		return null;
	}

	/**
	 * update a specific calendar by its id
	 *
	 * @param calendarId the id of the calendar
	 * @param newName the calendar new name
	 * @param newType the calendar new type
	 * @param newDescription the calendar new description
	 * @param newCollaboratorsIds the calendar new collaborators ids
	 * @returns if the update succeed
	 */
	public async updateById(
		calendarId: string,
		newName?: string,
		newType?: CalendarTypeEnum,
		newDescription?: string,
		newCollaboratorsIds?: string[]
	): Promise<boolean> {
		const calendar = await Calendar.findById(
			new Types.ObjectId(calendarId)
		).exec();

		if (calendar === null) {
			LOGGER.info(`${calendarId} does not exist and its not retrieved`);

			return false;
		}

		if (newName !== undefined) {
			calendar.name = newName;
		}

		if (newType !== undefined) {
			calendar.type = newType;
		}

		if (newDescription !== undefined) {
			calendar.description = newDescription;
		}

		calendar.collaboratorsIds =
			calendar.type === CalendarTypeEnum.PRIVATE
				? []
				: newCollaboratorsIds !== undefined
				? newCollaboratorsIds
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
		const calendar = await Calendar.findById(
			new Types.ObjectId(calendarId)
		).exec();

		if (calendar === null) {
			LOGGER.info(`${calendarId} does not exist and its not retrieved`);

			return false;
		}

		await calendar.delete();

		LOGGER.info(`${calendarId} is deleted`);

		return true;
	}
}
