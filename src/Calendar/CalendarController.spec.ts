import { IPublicUser } from '../User/User';
import { MONGO_DUMB_ID, appRequest } from '../setupTest';
import { ISecurityTokens } from '../utils/security/SecurityService';
import { IPublicCalendar } from './Calendar';

describe('CalendarController', () => {
	let johnId: string;
	let johnToken: string;
	let janeId: string;
	let janeToken: string;

	beforeEach(async () => {
		const johnRegister = await appRequest
			.post('/users/register')
			.send({ username: 'John', password: 'P4ssw0rd' });
		const johnRegisterBody = johnRegister.body as IPublicUser;

		const johnLogin = await appRequest
			.post('/users/login')
			.send({ username: 'John', password: 'P4ssw0rd' });
		const johnLoginBody = johnLogin.body as ISecurityTokens;

		const janeRegister = await appRequest
			.post('/users/register')
			.send({ username: 'Jane', password: 'P4ssw0rd' });
		const janeRegisterBody = janeRegister.body as IPublicUser;

		const janeLogin = await appRequest
			.post('/users/login')
			.send({ username: 'Jane', password: 'P4ssw0rd' });
		const janeLoginBody = janeLogin.body as ISecurityTokens;

		johnId = johnRegisterBody.id;
		johnToken = johnLoginBody.accessToken.token;

		janeId = janeRegisterBody.id;
		janeToken = janeLoginBody.accessToken.token;
	});

	it('with no error', async function () {
		/**
		 * get all
		 */
		const getAllCalendarsEmpty = await appRequest
			.get('/calendars')
			.set('Authorization', `Bearer ${johnToken}`);
		const getAllCalendarsEmptyBody =
			getAllCalendarsEmpty.body as IPublicCalendar[];
		getAllCalendarsEmptyBody.should.be.deep.equal([]);

		/**
		 * create calendars
		 */
		const createCalendarPublic = await appRequest
			.post('/calendars')
			.set('Authorization', `Bearer ${johnToken}`)
			.send({
				name: 'My Public Calendar',
				type: 'PUBLIC',
				description: 'Public',
				collaboratorsIds: [janeId]
			});
		const createCalendarPublicBody =
			createCalendarPublic.body as IPublicCalendar;
		createCalendarPublicBody.should.haveOwnProperty('id');
		createCalendarPublicBody.should.haveOwnProperty('ownerId', johnId);
		createCalendarPublicBody.should.haveOwnProperty('eventsIds');
		createCalendarPublicBody.eventsIds.should.be.deep.equal([]);
		createCalendarPublicBody.should.haveOwnProperty(
			'name',
			'My Public Calendar'
		);
		createCalendarPublicBody.should.haveOwnProperty('type', 'PUBLIC');
		createCalendarPublicBody.should.haveOwnProperty(
			'description',
			'Public'
		);
		createCalendarPublicBody.should.haveOwnProperty('collaboratorsIds');
		createCalendarPublicBody.collaboratorsIds.should.be.deep.equal([
			janeId
		]);

		const getCalendarPublicWithJohn = await appRequest
			.get(`/calendars/${createCalendarPublicBody.id}`)
			.set('Authorization', `Bearer ${johnToken}`);
		const getCalendarPublicWithJohnBody =
			getCalendarPublicWithJohn.body as IPublicCalendar;
		getCalendarPublicWithJohnBody.should.haveOwnProperty('id');
		getCalendarPublicWithJohnBody.should.haveOwnProperty('ownerId', johnId);
		getCalendarPublicWithJohnBody.should.haveOwnProperty('eventsIds');
		getCalendarPublicWithJohnBody.eventsIds.should.be.deep.equal([]);
		getCalendarPublicWithJohnBody.should.haveOwnProperty(
			'name',
			'My Public Calendar'
		);
		getCalendarPublicWithJohnBody.should.haveOwnProperty('type', 'PUBLIC');
		getCalendarPublicWithJohnBody.should.haveOwnProperty(
			'description',
			'Public'
		);
		getCalendarPublicWithJohnBody.should.haveOwnProperty(
			'collaboratorsIds'
		);
		getCalendarPublicWithJohnBody.collaboratorsIds.should.be.deep.equal([
			janeId
		]);

		const getCalendarPublicWithJane = await appRequest
			.get(`/calendars/${createCalendarPublicBody.id}`)
			.set('Authorization', `Bearer ${janeToken}`);
		const getCalendarPublicWithJaneBody =
			getCalendarPublicWithJane.body as IPublicCalendar;
		getCalendarPublicWithJaneBody.should.haveOwnProperty('id');
		getCalendarPublicWithJaneBody.should.haveOwnProperty('ownerId', johnId);
		getCalendarPublicWithJaneBody.should.haveOwnProperty('eventsIds');
		getCalendarPublicWithJaneBody.eventsIds.should.be.deep.equal([]);
		getCalendarPublicWithJaneBody.should.haveOwnProperty(
			'name',
			'My Public Calendar'
		);
		getCalendarPublicWithJaneBody.should.haveOwnProperty('type', 'PUBLIC');
		getCalendarPublicWithJaneBody.should.haveOwnProperty(
			'description',
			'Public'
		);
		getCalendarPublicWithJaneBody.should.haveOwnProperty(
			'collaboratorsIds'
		);
		getCalendarPublicWithJaneBody.collaboratorsIds.should.be.deep.equal([
			janeId
		]);

		const createCalendarShared = await appRequest
			.post('/calendars')
			.set('Authorization', `Bearer ${johnToken}`)
			.send({
				name: 'My Shared Calendar',
				type: 'SHARED',
				description: 'Shared',
				collaboratorsIds: [janeId]
			});
		const createCalendarSharedBody =
			createCalendarShared.body as IPublicCalendar;
		createCalendarSharedBody.should.haveOwnProperty('id');
		createCalendarSharedBody.should.haveOwnProperty('ownerId', johnId);
		createCalendarSharedBody.should.haveOwnProperty('eventsIds');
		createCalendarSharedBody.eventsIds.should.be.deep.equal([]);
		createCalendarSharedBody.should.haveOwnProperty(
			'name',
			'My Shared Calendar'
		);
		createCalendarSharedBody.should.haveOwnProperty('type', 'SHARED');
		createCalendarSharedBody.should.haveOwnProperty(
			'description',
			'Shared'
		);
		createCalendarSharedBody.should.haveOwnProperty('collaboratorsIds');
		createCalendarSharedBody.collaboratorsIds.should.be.deep.equal([
			janeId
		]);

		const getCalendarSharedWithJohn = await appRequest
			.get(`/calendars/${createCalendarSharedBody.id}`)
			.set('Authorization', `Bearer ${johnToken}`);
		const getCalendarSharedWithJohnBody =
			getCalendarSharedWithJohn.body as IPublicCalendar;
		getCalendarSharedWithJohnBody.should.haveOwnProperty('id');
		getCalendarSharedWithJohnBody.should.haveOwnProperty('ownerId', johnId);
		getCalendarSharedWithJohnBody.should.haveOwnProperty('eventsIds');
		getCalendarSharedWithJohnBody.eventsIds.should.be.deep.equal([]);
		getCalendarSharedWithJohnBody.should.haveOwnProperty(
			'name',
			'My Shared Calendar'
		);
		getCalendarSharedWithJohnBody.should.haveOwnProperty('type', 'SHARED');
		getCalendarSharedWithJohnBody.should.haveOwnProperty(
			'description',
			'Shared'
		);
		getCalendarSharedWithJohnBody.should.haveOwnProperty(
			'collaboratorsIds'
		);
		getCalendarSharedWithJohnBody.collaboratorsIds.should.be.deep.equal([
			janeId
		]);

		const getCalendarSharedWithJane = await appRequest
			.get(`/calendars/${createCalendarSharedBody.id}`)
			.set('Authorization', `Bearer ${janeToken}`);
		const getCalendarSharedWithJaneBody =
			getCalendarSharedWithJane.body as IPublicCalendar;
		getCalendarSharedWithJaneBody.should.haveOwnProperty('id');
		getCalendarSharedWithJaneBody.should.haveOwnProperty('ownerId', johnId);
		getCalendarSharedWithJaneBody.should.haveOwnProperty('eventsIds');
		getCalendarSharedWithJaneBody.eventsIds.should.be.deep.equal([]);
		getCalendarSharedWithJaneBody.should.haveOwnProperty(
			'name',
			'My Shared Calendar'
		);
		getCalendarSharedWithJaneBody.should.haveOwnProperty('type', 'SHARED');
		getCalendarSharedWithJaneBody.should.haveOwnProperty(
			'description',
			'Shared'
		);
		getCalendarSharedWithJaneBody.should.haveOwnProperty(
			'collaboratorsIds'
		);
		getCalendarSharedWithJaneBody.collaboratorsIds.should.be.deep.equal([
			janeId
		]);

		const createCalendarPrivate = await appRequest
			.post('/calendars')
			.set('Authorization', `Bearer ${johnToken}`)
			.send({
				name: 'My Private Calendar',
				type: 'PRIVATE',
				description: 'Private',
				collaboratorsIds: [janeId]
			});
		const createCalendarPrivateBody =
			createCalendarPrivate.body as IPublicCalendar;
		createCalendarPrivateBody.should.haveOwnProperty('id');
		createCalendarPrivateBody.should.haveOwnProperty('ownerId', johnId);
		createCalendarPrivateBody.should.haveOwnProperty('eventsIds');
		createCalendarPrivateBody.eventsIds.should.be.deep.equal([]);
		createCalendarPrivateBody.should.haveOwnProperty(
			'name',
			'My Private Calendar'
		);
		createCalendarPrivateBody.should.haveOwnProperty('type', 'PRIVATE');
		createCalendarPrivateBody.should.haveOwnProperty(
			'description',
			'Private'
		);
		createCalendarPrivateBody.should.haveOwnProperty('collaboratorsIds');
		createCalendarPrivateBody.collaboratorsIds.should.be.deep.equal([]);

		const getCalendarPrivate = await appRequest
			.get(`/calendars/${createCalendarPrivateBody.id}`)
			.set('Authorization', `Bearer ${johnToken}`);
		const getCalendarPrivateBody =
			getCalendarPrivate.body as IPublicCalendar;
		getCalendarPrivateBody.should.haveOwnProperty('id');
		getCalendarPrivateBody.should.haveOwnProperty('ownerId', johnId);
		getCalendarPrivateBody.should.haveOwnProperty('eventsIds');
		getCalendarPrivateBody.eventsIds.should.be.deep.equal([]);
		getCalendarPrivateBody.should.haveOwnProperty(
			'name',
			'My Private Calendar'
		);
		getCalendarPrivateBody.should.haveOwnProperty('type', 'PRIVATE');
		getCalendarPrivateBody.should.haveOwnProperty('description', 'Private');
		getCalendarPrivateBody.should.haveOwnProperty('collaboratorsIds');
		getCalendarPrivateBody.collaboratorsIds.should.be.deep.equal([]);

		const getAllCalendarsWithCalendarsAndJohn = await appRequest
			.get('/calendars')
			.set('Authorization', `Bearer ${johnToken}`);
		const getAllCalendarsWithCalendarsAndJohnBody =
			getAllCalendarsWithCalendarsAndJohn.body as IPublicCalendar[];
		getAllCalendarsWithCalendarsAndJohnBody.should.be.deep.equal([
			{
				id: getCalendarPublicWithJohnBody.id,
				ownerId: johnId,
				eventsIds: [],
				name: 'My Public Calendar',
				type: 'PUBLIC',
				description: 'Public',
				collaboratorsIds: [janeId]
			},
			{
				id: getCalendarSharedWithJohnBody.id,
				ownerId: johnId,
				eventsIds: [],
				name: 'My Shared Calendar',
				type: 'SHARED',
				description: 'Shared',
				collaboratorsIds: [janeId]
			},
			{
				id: getCalendarPrivateBody.id,
				ownerId: johnId,
				eventsIds: [],
				name: 'My Private Calendar',
				type: 'PRIVATE',
				description: 'Private',
				collaboratorsIds: []
			}
		]);

		const getAllCalendarsWithCalendarsAndJane = await appRequest
			.get('/calendars')
			.set('Authorization', `Bearer ${janeToken}`);
		const getAllCalendarsWithCalendarsAndJaneBody =
			getAllCalendarsWithCalendarsAndJane.body as IPublicCalendar[];
		getAllCalendarsWithCalendarsAndJaneBody.should.be.deep.equal([
			{
				id: getCalendarPublicWithJohnBody.id,
				ownerId: johnId,
				eventsIds: [],
				name: 'My Public Calendar',
				type: 'PUBLIC',
				description: 'Public',
				collaboratorsIds: [janeId]
			},
			{
				id: getCalendarSharedWithJohnBody.id,
				ownerId: johnId,
				eventsIds: [],
				name: 'My Shared Calendar',
				type: 'SHARED',
				description: 'Shared',
				collaboratorsIds: [janeId]
			}
		]);

		/**
		 * update calendars
		 */
		const updateCalendarPublicToPrivate = await appRequest
			.put(`/calendars/${getCalendarPublicWithJohnBody.id}`)
			.set('Authorization', `Bearer ${johnToken}`)
			.send({
				name: 'My New Private Calendar',
				type: 'PRIVATE',
				description: 'New Private',
				collaboratorsIds: [janeId]
			});
		updateCalendarPublicToPrivate.statusCode.should.be.equal(204);

		const updateCalendarShared = await appRequest
			.put(`/calendars/${getCalendarSharedWithJohnBody.id}`)
			.set('Authorization', `Bearer ${johnToken}`)
			.send({
				name: 'My New Shared Calendar'
			});
		updateCalendarShared.statusCode.should.be.equal(204);

		const updateCalendarPrivateToPublic = await appRequest
			.put(`/calendars/${getCalendarPrivateBody.id}`)
			.set('Authorization', `Bearer ${johnToken}`)
			.send({
				name: 'My New Public Calendar',
				type: 'PUBLIC',
				description: 'New Public',
				collaboratorsIds: [janeId]
			});
		updateCalendarPrivateToPublic.statusCode.should.be.equal(204);

		const getAllCalendarsWithNewCalendarsAndJohn = await appRequest
			.get('/calendars')
			.set('Authorization', `Bearer ${johnToken}`);
		const getAllCalendarsWithNewCalendarsAndJohnBody =
			getAllCalendarsWithNewCalendarsAndJohn.body as IPublicCalendar[];
		getAllCalendarsWithNewCalendarsAndJohnBody.should.be.deep.equal([
			{
				id: getCalendarPublicWithJohnBody.id,
				ownerId: johnId,
				eventsIds: [],
				name: 'My New Private Calendar',
				type: 'PRIVATE',
				description: 'New Private',
				collaboratorsIds: []
			},
			{
				id: getCalendarSharedWithJohnBody.id,
				ownerId: johnId,
				eventsIds: [],
				name: 'My New Shared Calendar',
				type: 'SHARED',
				description: 'Shared',
				collaboratorsIds: [janeId]
			},
			{
				id: getCalendarPrivateBody.id,
				ownerId: johnId,
				eventsIds: [],
				name: 'My New Public Calendar',
				type: 'PUBLIC',
				description: 'New Public',
				collaboratorsIds: [janeId]
			}
		]);

		const getAllCalendarsWithNewCalendarsAndJane = await appRequest
			.get('/calendars')
			.set('Authorization', `Bearer ${janeToken}`);
		const getAllCalendarsWithNewCalendarsAndJaneBody =
			getAllCalendarsWithNewCalendarsAndJane.body as IPublicCalendar[];
		getAllCalendarsWithNewCalendarsAndJaneBody.should.be.deep.equal([
			{
				id: getCalendarSharedWithJohnBody.id,
				ownerId: johnId,
				eventsIds: [],
				name: 'My New Shared Calendar',
				type: 'SHARED',
				description: 'Shared',
				collaboratorsIds: [janeId]
			},
			{
				id: getCalendarPrivateBody.id,
				ownerId: johnId,
				eventsIds: [],
				name: 'My New Public Calendar',
				type: 'PUBLIC',
				description: 'New Public',
				collaboratorsIds: [janeId]
			}
		]);

		/**
		 * delete calendars
		 */
		const deleteCalendarPublic = await appRequest
			.delete(`/calendars/${getCalendarPublicWithJohnBody.id}`)
			.set('Authorization', `Bearer ${johnToken}`);
		deleteCalendarPublic.statusCode.should.be.equal(204);

		const deleteCalendarShared = await appRequest
			.delete(`/calendars/${getCalendarSharedWithJohnBody.id}`)
			.set('Authorization', `Bearer ${johnToken}`);
		deleteCalendarShared.statusCode.should.be.equal(204);

		const deleteCalendarPrivate = await appRequest
			.delete(`/calendars/${getCalendarPrivateBody.id}`)
			.set('Authorization', `Bearer ${johnToken}`);
		deleteCalendarPrivate.statusCode.should.be.equal(204);

		const getAllCalendarsWithNoCalendarsAndJohn = await appRequest
			.get('/calendars')
			.set('Authorization', `Bearer ${johnToken}`);
		const getAllCalendarsWithNoCalendarsAndJohnBody =
			getAllCalendarsWithNoCalendarsAndJohn.body as IPublicCalendar[];
		getAllCalendarsWithNoCalendarsAndJohnBody.should.be.deep.equal([]);

		const getAllCalendarsWithNoCalendarsAndJane = await appRequest
			.get('/calendars')
			.set('Authorization', `Bearer ${janeToken}`);
		const getAllCalendarsWithNoCalendarsAndJaneBody =
			getAllCalendarsWithNoCalendarsAndJane.body as IPublicCalendar[];
		getAllCalendarsWithNoCalendarsAndJaneBody.should.be.deep.equal([]);
	});

	describe('with error', () => {
		describe('on get all calendars', () => {
			it('401: Not Authenticated (No credentials)', async function () {
				const getAllCalendars = await appRequest.get('/calendars');

				getAllCalendars.statusCode.should.be.equal(401);
			});
		});

		describe('on create calendar', () => {
			it('400: Bad Request (Bad inputs)', async function () {
				const createCalendar = await appRequest
					.post('/calendars')
					.set('Authorization', `Bearer ${johnToken}`)
					.send({ dumbField: 'dumbValue' });

				createCalendar.statusCode.should.be.equal(400);
			});

			it('401: Not Authenticated (No credentials)', async function () {
				const createCalendar = await appRequest
					.post('/calendars')
					.send({
						name: 'My Public Calendar',
						type: 'PUBLIC',
						description: 'Public',
						collaboratorsIds: [janeId]
					});

				createCalendar.statusCode.should.be.equal(401);
			});
		});

		describe('and specific calendar', () => {
			let calendarId: string;

			beforeEach(async () => {
				const createCalendar = await appRequest
					.post('/calendars')
					.set('Authorization', `Bearer ${johnToken}`)
					.send({
						name: 'My Private Calendar',
						type: 'PRIVATE',
						description: 'Private',
						collaboratorsIds: []
					});
				const createCalendarBody =
					createCalendar.body as IPublicCalendar;

				calendarId = createCalendarBody.id;
			});

			describe('on get calendar', () => {
				it('401: Not Authenticated (No credentials)', async function () {
					const getCalendar = await appRequest.get(
						`/calendars/${calendarId}`
					);

					getCalendar.statusCode.should.be.equal(401);
				});

				it('403: Not Authorized (Wrong user credentials)', async function () {
					const getCalendar = await appRequest
						.get(`/calendars/${calendarId}`)
						.set('Authorization', `Bearer ${janeToken}`);

					getCalendar.statusCode.should.be.equal(403);
				});

				it('404: Not Found (Wrong calendar)', async function () {
					const getCalendar = await appRequest
						.get(`/calendars/${MONGO_DUMB_ID}`)
						.set('Authorization', `Bearer ${johnToken}`);

					getCalendar.statusCode.should.be.equal(404);
				});
			});

			describe('on update calendar', () => {
				it('400: Bad Request (Bad inputs)', async function () {
					const updateCalendar = await appRequest
						.put(`/calendars/${calendarId}`)
						.set('Authorization', `Bearer ${johnToken}`)
						.send({ dumbField: 'dumbValue' });

					updateCalendar.statusCode.should.be.equal(400);
				});

				it('401: Not Authenticated (No credentials)', async function () {
					const updateCalendar = await appRequest
						.put(`/calendars/${calendarId}`)
						.send({ name: 'New Name' });

					updateCalendar.statusCode.should.be.equal(401);
				});

				it('403: Not Authorized (Wrong user credentials)', async function () {
					const updateCalendar = await appRequest
						.put(`/calendars/${calendarId}`)
						.set('Authorization', `Bearer ${janeToken}`)
						.send({ name: 'New Name' });

					updateCalendar.statusCode.should.be.equal(403);
				});

				it('404: Not Found (Wrong calendar)', async function () {
					const updateCalendar = await appRequest
						.put(`/calendars/${MONGO_DUMB_ID}`)
						.set('Authorization', `Bearer ${johnToken}`)
						.send({ name: 'New Name' });

					updateCalendar.statusCode.should.be.equal(404);
				});
			});

			describe('on delete calendar', () => {
				it('401: Not Authenticated (No credentials)', async function () {
					const deleteCalendar = await appRequest.delete(
						`/calendars/${calendarId}`
					);

					deleteCalendar.statusCode.should.be.equal(401);
				});

				it('403: Not Authorized (Wrong user credentials)', async function () {
					const deleteCalendar = await appRequest
						.delete(`/calendars/${calendarId}`)
						.set('Authorization', `Bearer ${janeToken}`);

					deleteCalendar.statusCode.should.be.equal(403);
				});

				it('404: Not Found (Wrong calendar)', async function () {
					const deleteCalendar = await appRequest
						.delete(`/calendars/${MONGO_DUMB_ID}`)
						.set('Authorization', `Bearer ${johnToken}`);

					deleteCalendar.statusCode.should.be.equal(404);
				});
			});
		});
	});
});
