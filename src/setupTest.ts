import 'reflect-metadata';

import './setupEnv';

import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import dirtyChai from 'dirty-chai';
import supertest from 'supertest';

import { Calendar } from './Calendar/Calendar';
import { Event } from './Event/Event';
import { User } from './User/User';
import { app } from './app';
import { dbConnect } from './utils/db/dbConnect';
import { getLogger } from './utils/logging/getLogger';

chai.use(chaiAsPromised);
chai.use(dirtyChai);

const LOGGER = getLogger('setupTest');

/**
 * chai's should command
 */
export const itShould = chai.should();

/**
 * prepared supertest request
 */
export const appRequest = supertest(app);

/**
 * remove all database data
 */
export const dropDatabase = async (): Promise<void> => {
	await Event.deleteMany({});
	await Calendar.deleteMany({});
	await User.deleteMany({});
};

export const mochaHooks = {
	/**
	 * hook to execute at each test
	 *
	 * @param done callback to indicate hook end
	 */
	beforeEach(done: () => void): void {
		dbConnect()
			.then(() => {
				return dropDatabase();
			})
			.then(() => {
				done();
			})
			.catch((err) => {
				LOGGER.error(
					'Error during before each hook',
					err instanceof Error
						? err
						: new Error('Error during before each hook')
				);
			});
	}
};
