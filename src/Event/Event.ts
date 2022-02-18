import { Schema, model } from 'mongoose';

interface IDate {
	day: number;
	month: number;
	year: number;
	hour?: number;
	minute?: number;
}

const dateSchema = new Schema<IDate>({
	day: { type: Number, required: true },
	month: { type: Number, required: true },
	year: { type: Number, required: true },
	hour: { type: Number, required: false },
	minute: { type: Number, required: false }
});

interface IRecurrence {
	endPeriod: IDate;
	periodicity: 'daily' | 'weekly' | 'monthly' | 'yearly';
}

const recurrenceSchema = new Schema<IRecurrence>({
	endPeriod: {
		type: dateSchema,
		required: true
	},
	periodicity: { type: String, required: true }
});

interface IEvent {
	name: string;
	startTime: IDate;
	endTime: IDate;
	place: string;
	recurrence?: IRecurrence;
	description: string;
	// participant: IUser[];
}

const eventSchema = new Schema<IEvent>({
	name: { type: String, required: true },
	startTime: {
		type: dateSchema,
		required: true
	},
	endTime: { type: Schema.Types.ObjectId, ref: 'dateSchema', required: true },
	place: { type: String, required: true },
	recurrence: {
		type: recurrenceSchema,
		required: false
	},
	description: { type: String, required: true }
});

export const Event = model('Event', eventSchema);

export type PublicEventType = { id: string } & IEvent;
