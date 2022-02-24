import { Schema, model } from 'mongoose';

export enum CalendarTypeEnum {
	PUBLIC = 'PUBLIC',
	SHARED = 'SHARED',
	PRIVATE = 'PRIVATE'
}

export interface ICalendar {
	name: string;
	type: CalendarTypeEnum;
	description: string;
	collaboratorsIds: string[];
}

export interface ICalendarExtended extends ICalendar {
	ownerId: string;
}
const calendarSchema = new Schema<ICalendarExtended>({
	ownerId: { type: String, required: true },
	name: { type: String, required: true },
	type: { type: String, enum: Object.keys(CalendarTypeEnum), required: true },
	description: { type: String, required: true },
	collaboratorsIds: [{ type: String, required: true }]
});

export const Calendar = model('Calendar', calendarSchema);

export interface IPublicCalendar extends ICalendarExtended {
	id: string;
}
