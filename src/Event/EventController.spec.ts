import { IPublicCalendar } from '../Calendar/Calendar';
import { IPublicUser } from '../User/User';
import { MONGO_DUMB_ID, appRequest } from '../setupTest';
import { ISecurityTokens } from '../utils/security/SecurityService';
import { IPublicEvent } from './Event';

describe('EventController', () => {
	let johnId: string;
	let johnToken: string;
	let janeId: string;
	let janeToken: string;
	let calendarId: string;

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

		const createCalendar = await appRequest
			.post('/calendars')
			.set('Authorization', `Bearer ${johnToken}`)
			.send({
				name: 'My Private Calendar',
				type: 'PRIVATE',
				description: 'Private',
				collaboratorsIds: []
			});
		const createCalendarBody = createCalendar.body as IPublicCalendar;

		calendarId = createCalendarBody.id;
	});

	it('with no error', async function () {
		/**
		 * get all
		 */
		const getAllEventsEmpty = await appRequest
			.get(`/calendars/${calendarId}/events`)
			.set('Authorization', `Bearer ${johnToken}`);
		const getAllEventsEmptyBody = getAllEventsEmpty.body as IPublicEvent[];
		getAllEventsEmptyBody.should.be.deep.equal([]);

		/**
		 * create events
		 */
		const createEventDuo = await appRequest
			.post(`/calendars/${calendarId}/events`)
			.set('Authorization', `Bearer ${johnToken}`)
			.send({
				name: 'My Duo Event',
				startTime: {
					day: 1,
					month: 1,
					year: 2022
				},
				endTime: {
					day: 1,
					month: 1,
					year: 2022
				},
				place: 'Place',
				description: 'Duo',
				participantsIds: [janeId]
			});
		const createEventDuoBody = createEventDuo.body as IPublicEvent;
		createEventDuoBody.should.haveOwnProperty('id');
		createEventDuoBody.should.haveOwnProperty('calendarId', calendarId);
		createEventDuoBody.should.haveOwnProperty('name', 'My Duo Event');
		createEventDuoBody.should.haveOwnProperty('startTime');
		createEventDuoBody.startTime.should.be.deep.equal({
			day: 1,
			month: 1,
			year: 2022
		});
		createEventDuoBody.should.haveOwnProperty('endTime');
		createEventDuoBody.endTime.should.be.deep.equal({
			day: 1,
			month: 1,
			year: 2022
		});
		createEventDuoBody.should.haveOwnProperty('place', 'Place');
		createEventDuoBody.should.haveOwnProperty('description', 'Duo');
		createEventDuoBody.should.haveOwnProperty('participantsIds');
		createEventDuoBody.participantsIds.should.be.deep.equal([
			johnId,
			janeId
		]);

		const getEventDuoWithJohn = await appRequest
			.get(`/calendars/${calendarId}/events/${createEventDuoBody.id}`)
			.set('Authorization', `Bearer ${johnToken}`);
		const getEventDuoWithJohnBody =
			getEventDuoWithJohn.body as IPublicEvent;
		getEventDuoWithJohnBody.should.haveOwnProperty('id');
		getEventDuoWithJohnBody.should.haveOwnProperty(
			'calendarId',
			calendarId
		);
		getEventDuoWithJohnBody.should.haveOwnProperty('name', 'My Duo Event');
		getEventDuoWithJohnBody.should.haveOwnProperty('startTime');
		getEventDuoWithJohnBody.startTime.should.be.deep.equal({
			day: 1,
			month: 1,
			year: 2022
		});
		getEventDuoWithJohnBody.should.haveOwnProperty('endTime');
		getEventDuoWithJohnBody.endTime.should.be.deep.equal({
			day: 1,
			month: 1,
			year: 2022
		});
		getEventDuoWithJohnBody.should.haveOwnProperty('place', 'Place');
		getEventDuoWithJohnBody.should.haveOwnProperty('description', 'Duo');
		getEventDuoWithJohnBody.should.haveOwnProperty('participantsIds');
		getEventDuoWithJohnBody.participantsIds.should.be.deep.equal([
			johnId,
			janeId
		]);

		const getEventDuoWithJane = await appRequest
			.get(`/calendars/${calendarId}/events/${createEventDuoBody.id}`)
			.set('Authorization', `Bearer ${johnToken}`);
		const getEventDuoWithJaneBody =
			getEventDuoWithJane.body as IPublicEvent;
		getEventDuoWithJaneBody.should.haveOwnProperty('id');
		getEventDuoWithJaneBody.should.haveOwnProperty(
			'calendarId',
			calendarId
		);
		getEventDuoWithJaneBody.should.haveOwnProperty('name', 'My Duo Event');
		getEventDuoWithJaneBody.should.haveOwnProperty('startTime');
		getEventDuoWithJaneBody.startTime.should.be.deep.equal({
			day: 1,
			month: 1,
			year: 2022
		});
		getEventDuoWithJaneBody.should.haveOwnProperty('endTime');
		getEventDuoWithJaneBody.endTime.should.be.deep.equal({
			day: 1,
			month: 1,
			year: 2022
		});
		getEventDuoWithJaneBody.should.haveOwnProperty('place', 'Place');
		getEventDuoWithJaneBody.should.haveOwnProperty('description', 'Duo');
		getEventDuoWithJaneBody.should.haveOwnProperty('participantsIds');
		getEventDuoWithJaneBody.participantsIds.should.be.deep.equal([
			johnId,
			janeId
		]);

		const createEventSolo = await appRequest
			.post(`/calendars/${calendarId}/events`)
			.set('Authorization', `Bearer ${johnToken}`)
			.send({
				name: 'My Solo Event',
				startTime: {
					day: 1,
					month: 1,
					year: 2022
				},
				endTime: {
					day: 1,
					month: 1,
					year: 2022
				},
				place: 'Place',
				description: 'Solo',
				participantsIds: []
			});
		const createEventSoloBody = createEventSolo.body as IPublicEvent;
		createEventSoloBody.should.haveOwnProperty('id');
		createEventSoloBody.should.haveOwnProperty('calendarId', calendarId);
		createEventSoloBody.should.haveOwnProperty('name', 'My Solo Event');
		createEventSoloBody.should.haveOwnProperty('startTime');
		createEventSoloBody.startTime.should.be.deep.equal({
			day: 1,
			month: 1,
			year: 2022
		});
		createEventSoloBody.should.haveOwnProperty('endTime');
		createEventSoloBody.endTime.should.be.deep.equal({
			day: 1,
			month: 1,
			year: 2022
		});
		createEventSoloBody.should.haveOwnProperty('place', 'Place');
		createEventSoloBody.should.haveOwnProperty('description', 'Solo');
		createEventSoloBody.should.haveOwnProperty('participantsIds');
		createEventSoloBody.participantsIds.should.be.deep.equal([johnId]);

		const getEventSolo = await appRequest
			.get(`/calendars/${calendarId}/events/${createEventSoloBody.id}`)
			.set('Authorization', `Bearer ${johnToken}`);
		const getEventSoloBody = getEventSolo.body as IPublicEvent;
		getEventSoloBody.should.haveOwnProperty('id');
		getEventSoloBody.should.haveOwnProperty('calendarId', calendarId);
		getEventSoloBody.should.haveOwnProperty('name', 'My Solo Event');
		getEventSoloBody.should.haveOwnProperty('startTime');
		getEventSoloBody.startTime.should.be.deep.equal({
			day: 1,
			month: 1,
			year: 2022
		});
		getEventSoloBody.should.haveOwnProperty('endTime');
		getEventSoloBody.endTime.should.be.deep.equal({
			day: 1,
			month: 1,
			year: 2022
		});
		getEventSoloBody.should.haveOwnProperty('place', 'Place');
		getEventSoloBody.should.haveOwnProperty('description', 'Solo');
		getEventSoloBody.should.haveOwnProperty('participantsIds');
		getEventSoloBody.participantsIds.should.be.deep.equal([johnId]);

		const getAllEventsWithEventsAndJohn = await appRequest
			.get(`/calendars/${calendarId}/events`)
			.set('Authorization', `Bearer ${johnToken}`);
		const getAllEventsWithEventsAndJohnBody =
			getAllEventsWithEventsAndJohn.body as IPublicEvent[];
		getAllEventsWithEventsAndJohnBody.should.be.deep.equal([
			{
				id: getEventDuoWithJohnBody.id,
				calendarId: calendarId,
				name: 'My Duo Event',
				startTime: {
					day: 1,
					month: 1,
					year: 2022
				},
				endTime: {
					day: 1,
					month: 1,
					year: 2022
				},
				place: 'Place',
				description: 'Duo',
				participantsIds: [johnId, janeId]
			},
			{
				id: getEventSoloBody.id,
				calendarId: calendarId,
				name: 'My Solo Event',
				startTime: {
					day: 1,
					month: 1,
					year: 2022
				},
				endTime: {
					day: 1,
					month: 1,
					year: 2022
				},
				place: 'Place',
				description: 'Solo',
				participantsIds: [johnId]
			}
		]);

		const getAllEventsWithEventsAndJane = await appRequest
			.get(`/calendars/${calendarId}/events`)
			.set('Authorization', `Bearer ${janeToken}`);
		const getAllEventsWithEventsAndJaneBody =
			getAllEventsWithEventsAndJane.body as IPublicEvent[];
		getAllEventsWithEventsAndJaneBody.should.be.deep.equal([
			{
				id: getEventDuoWithJohnBody.id,
				calendarId: calendarId,
				name: 'My Duo Event',
				startTime: {
					day: 1,
					month: 1,
					year: 2022
				},
				endTime: {
					day: 1,
					month: 1,
					year: 2022
				},
				place: 'Place',
				description: 'Duo',
				participantsIds: [johnId, janeId]
			}
		]);

		/**
		 * update events
		 */
		const updateEventDuoToSolo = await appRequest
			.put(
				`/calendars/${calendarId}/events/${getEventDuoWithJohnBody.id}`
			)
			.set('Authorization', `Bearer ${johnToken}`)
			.send({
				name: 'My New Solo Event',
				startTime: {
					day: 1,
					month: 1,
					year: 2022
				},
				endTime: {
					day: 1,
					month: 1,
					year: 2022
				},
				place: 'Place',
				description: 'New Solo',
				participantsIds: []
			});
		updateEventDuoToSolo.statusCode.should.be.equal(204);

		const updateEventSolo = await appRequest
			.put(`/calendars/${calendarId}/events/${getEventSoloBody.id}`)
			.set('Authorization', `Bearer ${johnToken}`)
			.send({
				name: 'My New Solo Event'
			});
		updateEventSolo.statusCode.should.be.equal(204);

		const getAllEventsWithNewEventsAndJohn = await appRequest
			.get(`/calendars/${calendarId}/events`)
			.set('Authorization', `Bearer ${johnToken}`);
		const getAllEventsWithNewEventsAndJohnBody =
			getAllEventsWithNewEventsAndJohn.body as IPublicEvent[];
		getAllEventsWithNewEventsAndJohnBody.should.be.deep.equal([
			{
				id: getEventDuoWithJohnBody.id,
				calendarId: calendarId,
				name: 'My New Solo Event',
				startTime: {
					day: 1,
					month: 1,
					year: 2022
				},
				endTime: {
					day: 1,
					month: 1,
					year: 2022
				},
				place: 'Place',
				description: 'New Solo',
				participantsIds: [johnId]
			},
			{
				id: getEventSoloBody.id,
				calendarId: calendarId,
				name: 'My New Solo Event',
				startTime: {
					day: 1,
					month: 1,
					year: 2022
				},
				endTime: {
					day: 1,
					month: 1,
					year: 2022
				},
				place: 'Place',
				description: 'Solo',
				participantsIds: [johnId]
			}
		]);

		const getAllEventsWithNewEventsAndJane = await appRequest
			.get(`/calendars/${calendarId}/events`)
			.set('Authorization', `Bearer ${janeToken}`);
		const getAllEventsWithNewEventsAndJaneBody =
			getAllEventsWithNewEventsAndJane.body as IPublicEvent[];
		getAllEventsWithNewEventsAndJaneBody.should.be.deep.equal([]);

		/**
		 * delete events
		 */
		const deleteEventDuo = await appRequest
			.delete(
				`/calendars/${calendarId}/events/${getEventDuoWithJohnBody.id}`
			)
			.set('Authorization', `Bearer ${johnToken}`);
		deleteEventDuo.statusCode.should.be.equal(204);

		const deleteEventSolo = await appRequest
			.delete(`/calendars/${calendarId}/events/${getEventSoloBody.id}`)
			.set('Authorization', `Bearer ${johnToken}`);
		deleteEventSolo.statusCode.should.be.equal(204);

		const getAllEventsWithNoEventsAndJohn = await appRequest
			.get(`/calendars/${calendarId}/events`)
			.set('Authorization', `Bearer ${johnToken}`);
		const getAllEventsWithNoEventsAndJohnBody =
			getAllEventsWithNoEventsAndJohn.body as IPublicEvent[];
		getAllEventsWithNoEventsAndJohnBody.should.be.deep.equal([]);

		const getAllEventsWithNoEventsAndJane = await appRequest
			.get(`/calendars/${calendarId}/events`)
			.set('Authorization', `Bearer ${janeToken}`);
		const getAllEventsWithNoEventsAndJaneBody =
			getAllEventsWithNoEventsAndJane.body as IPublicEvent[];
		getAllEventsWithNoEventsAndJaneBody.should.be.deep.equal([]);
	});

	describe('with error', () => {
		describe('on get all events', () => {
			it('401: Not Authenticated (No credentials)', async function () {
				const getAllEvents = await appRequest.get(
					`/calendars/${calendarId}/events`
				);

				getAllEvents.statusCode.should.be.equal(401);
			});

			it('404: Not Found (Wrong calendar)', async function () {
				const getAllEvents = await appRequest
					.get(`/calendars/${MONGO_DUMB_ID}/events`)
					.set('Authorization', `Bearer ${johnToken}`);

				getAllEvents.statusCode.should.be.equal(404);
			});
		});

		describe('on create event', () => {
			it('400: Bad Request (Bad inputs)', async function () {
				const createEvent = await appRequest
					.post(`/calendars/${calendarId}/events`)
					.set('Authorization', `Bearer ${johnToken}`)
					.send({ dumbField: 'dumbValue' });

				createEvent.statusCode.should.be.equal(400);
			});

			it('401: Not Authenticated (No credentials)', async function () {
				const createEvent = await appRequest
					.post(`/calendars/${calendarId}/events`)
					.send({
						name: 'My Solo Event',
						startTime: {
							day: 1,
							month: 1,
							year: 2022
						},
						endTime: {
							day: 1,
							month: 1,
							year: 2022
						},
						place: 'Place',
						description: 'Solo',
						participantsIds: []
					});

				createEvent.statusCode.should.be.equal(401);
			});

			it('403: Not Authorized (Wrong user credentials)', async function () {
				const createEvent = await appRequest
					.post(`/calendars/${calendarId}/events`)
					.set('Authorization', `Bearer ${janeToken}`)
					.send({
						name: 'My Solo Event',
						startTime: {
							day: 1,
							month: 1,
							year: 2022
						},
						endTime: {
							day: 1,
							month: 1,
							year: 2022
						},
						place: 'Place',
						description: 'Solo',
						participantsIds: []
					});

				createEvent.statusCode.should.be.equal(403);
			});

			it('404: Not Found (Wrong calendar)', async function () {
				const createEvent = await appRequest
					.post(`/calendars/${MONGO_DUMB_ID}/events`)
					.set('Authorization', `Bearer ${johnToken}`)
					.send({
						name: 'My Solo Event',
						startTime: {
							day: 1,
							month: 1,
							year: 2022
						},
						endTime: {
							day: 1,
							month: 1,
							year: 2022
						},
						place: 'Place',
						description: 'Solo',
						participantsIds: []
					});

				createEvent.statusCode.should.be.equal(404);
			});
		});

		describe('and specific event', () => {
			let eventId: string;

			beforeEach(async () => {
				const createEvent = await appRequest
					.post(`/calendars/${calendarId}/events`)
					.set('Authorization', `Bearer ${johnToken}`)
					.send({
						name: 'My Solo Event',
						startTime: {
							day: 1,
							month: 1,
							year: 2022
						},
						endTime: {
							day: 1,
							month: 1,
							year: 2022
						},
						place: 'Place',
						description: 'Solo',
						participantsIds: []
					});
				const createEventBody = createEvent.body as IPublicEvent;

				eventId = createEventBody.id;
			});

			describe('on get event', () => {
				it('401: Not Authenticated (No credentials)', async function () {
					const getEvent = await appRequest.get(
						`/calendars/${calendarId}/events/${eventId}`
					);

					getEvent.statusCode.should.be.equal(401);
				});

				it('403: Not Authorized (Wrong user credentials)', async function () {
					const getEvent = await appRequest
						.get(`/calendars/${calendarId}/events/${eventId}`)
						.set('Authorization', `Bearer ${janeToken}`);

					getEvent.statusCode.should.be.equal(403);
				});

				it('404: Not Found (Wrong calendar or event)', async function () {
					const getEventWrongCalendar = await appRequest
						.get(`/calendars/${MONGO_DUMB_ID}/events/${eventId}`)
						.set('Authorization', `Bearer ${johnToken}`);

					getEventWrongCalendar.statusCode.should.be.equal(404);

					const getEventWrongEvent = await appRequest
						.get(`/calendars/${calendarId}/events/${MONGO_DUMB_ID}`)
						.set('Authorization', `Bearer ${johnToken}`);

					getEventWrongEvent.statusCode.should.be.equal(404);
				});
			});

			describe('on update event', () => {
				it('400: Bad Request (Bad inputs)', async function () {
					const updateEvent = await appRequest
						.put(`/calendars/${calendarId}/events/${eventId}`)
						.set('Authorization', `Bearer ${johnToken}`)
						.send({ dumbField: 'dumbValue' });

					updateEvent.statusCode.should.be.equal(400);
				});

				it('401: Not Authenticated (No credentials)', async function () {
					const updateEvent = await appRequest
						.put(`/calendars/${calendarId}/events/${eventId}`)
						.send({ name: 'New Name' });

					updateEvent.statusCode.should.be.equal(401);
				});

				it('403: Not Authorized (Wrong user credentials)', async function () {
					const updateEvent = await appRequest
						.put(`/calendars/${calendarId}/events/${eventId}`)
						.set('Authorization', `Bearer ${janeToken}`)
						.send({ name: 'New Name' });

					updateEvent.statusCode.should.be.equal(403);
				});

				it('404: Not Found (Wrong calendar or event)', async function () {
					const updateEventWrongCalendar = await appRequest
						.put(`/calendars/${MONGO_DUMB_ID}/events/${eventId}`)
						.set('Authorization', `Bearer ${johnToken}`)
						.send({ name: 'New Name' });

					updateEventWrongCalendar.statusCode.should.be.equal(404);

					const updateEventWrongEvent = await appRequest
						.put(`/calendars/${calendarId}/events/${MONGO_DUMB_ID}`)
						.set('Authorization', `Bearer ${johnToken}`)
						.send({ name: 'New Name' });

					updateEventWrongEvent.statusCode.should.be.equal(404);
				});
			});

			describe('on delete event', () => {
				it('401: Not Authenticated (No credentials)', async function () {
					const deleteEvent = await appRequest.delete(
						`/calendars/${calendarId}/events/${eventId}`
					);

					deleteEvent.statusCode.should.be.equal(401);
				});

				it('403: Not Authorized (Wrong user credentials)', async function () {
					const deleteEvent = await appRequest
						.delete(`/calendars/${calendarId}/events/${eventId}`)
						.set('Authorization', `Bearer ${janeToken}`);

					deleteEvent.statusCode.should.be.equal(403);
				});

				it('404: Not Found (Wrong calendar or event)', async function () {
					const deleteEventWrongCalendar = await appRequest
						.delete(`/calendars/${MONGO_DUMB_ID}/events/${eventId}`)
						.set('Authorization', `Bearer ${johnToken}`);

					deleteEventWrongCalendar.statusCode.should.be.equal(404);

					const deleteEventWrongEvent = await appRequest
						.delete(
							`/calendars/${calendarId}/events/${MONGO_DUMB_ID}`
						)
						.set('Authorization', `Bearer ${johnToken}`);

					deleteEventWrongEvent.statusCode.should.be.equal(404);
				});
			});
		});
	});
});
