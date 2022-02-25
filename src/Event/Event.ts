import { Schema, model } from 'mongoose';

export enum EventRecurrenceTypeEnum {
	DAILY = 'DAILY',
	BI_DAILY = 'BI_DAILY',
	WEEKLY = 'WEEKLY',
	BI_WEEKLY = 'BI_WEEKLY',
	MONTHLY = 'MONTHLY',
	BI_MONTHLY = 'BI_MONTHLY',
	YEARLY = 'YEARLY',
	BI_YEARLY = 'BI_YEARLY'
}

export interface IDate {
	/**
	 * @isInt
	 * @minimum 1
	 * @maximum 31
	 */
	day: number;
	/**
	 * @isInt
	 * @minimum 1
	 * @maximum 12
	 */
	month: number;
	/**
	 * @isInt
	 * @minimum 1900
	 * @maximum 2100
	 */
	year: number;
	/**
	 * @isInt
	 * @minimum 0
	 * @maximum 23
	 */
	hour?: number;
	/**
	 * @isInt
	 * @minimum 0
	 * @maximum 59
	 */
	minute?: number;
}
const dateSchema = new Schema<IDate>({
	day: { type: Number, required: true },
	month: { type: Number, required: true },
	year: { type: Number, required: true },
	hour: Number,
	minute: Number
});

export interface IRecurrence {
	type: EventRecurrenceTypeEnum;
	end: IDate;
}
const recurrenceSchema = new Schema<IRecurrence>({
	type: {
		type: String,
		enum: Object.keys(EventRecurrenceTypeEnum),
		required: true
	},
	end: { type: dateSchema, required: true }
});

export interface IEvent {
	name: string;
	startTime: IDate;
	endTime: IDate;
	place: string;
	description: string;
	participantsIds: string[];
	recurrence?: IRecurrence;
}

export interface IEventExtended extends IEvent {
	calendarId: string;
}
const eventSchema = new Schema<IEventExtended>({
	calendarId: { type: String, required: true },
	name: { type: String, required: true },
	startTime: { type: dateSchema, required: true },
	endTime: { type: dateSchema, required: true },
	place: { type: String, required: true },
	description: { type: String, required: true },
	participantsIds: [String],
	recurrence: recurrenceSchema
});

export const Event = model('Event', eventSchema);

export interface IPublicEvent extends IEventExtended {
	id: string;
}
