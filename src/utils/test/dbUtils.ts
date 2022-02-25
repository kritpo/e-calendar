import { Calendar } from '../../Calendar/Calendar';
import { Event } from '../../Event/Event';
import { User } from '../../User/User';

/**
 * remove all database data
 */
export const dropDatabase = async (): Promise<void> => {
	await Event.deleteMany({});
	await Calendar.deleteMany({});
	await User.deleteMany({});
};
