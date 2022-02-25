import * as express from 'express';
import {
	Body,
	Controller,
	Delete,
	Get,
	Path,
	Post,
	Put,
	Request,
	Res,
	Response,
	Route,
	Security,
	SuccessResponse,
	TsoaResponse
} from 'tsoa';
import { injectable } from 'tsyringe';
import { CalendarService } from '../Calendar/CalendarService';
import { checkExistenceOrShouldNotHappen } from '../utils/checkExistence';
import { generateResponse } from '../utils/response/generateResponse';
import { IErrorResponse } from '../utils/response/IErrorResponse';
import { AuthorizationService } from '../utils/security/AuthorizationService';
import { getUserFromRequest } from '../utils/security/getUserFromRequest';
import { IEvent, IPublicEvent } from './Event';
import { EventService } from './EventService';

/**
 * events controller
 */
@injectable()
@Response<IErrorResponse>(400, 'Bad Request')
@Response<IErrorResponse>(500, 'Server Internal Error')
@Security('token')
@Route('/calendars/{calendarId}/events')
export class EventController extends Controller {
	/**
	 * create a event controller
	 *
	 * @param _authorizationService the service which manage authorization
	 * @param _calendarService the service which manage calendars
	 * @param _eventService the service which manage events
	 */
	constructor(
		private _authorizationService: AuthorizationService,
		private _calendarService: CalendarService,
		private _eventService: EventService
	) {
		super();
	}

	/**
	 * retrieve all events
	 *
	 * @param calendarId the calendar id
	 * @param req the express request
	 * @param notAuthenticatedResponse Not Authenticated
	 * @param notFoundResponse Not Found
	 * @returns List of events
	 */
	@Get('/')
	public async getAllEvents(
		@Path() calendarId: string,
		@Request() req: express.Request,
		@Res() notAuthenticatedResponse: TsoaResponse<401, IErrorResponse>,
		@Res() notFoundResponse: TsoaResponse<404, IErrorResponse>
	): Promise<IPublicEvent[]> {
		const reqUser = getUserFromRequest(req);
		const calendar = await this._calendarService.getById(calendarId);

		return generateResponse(
			async () => {
				return this._eventService.getAll(calendarId);
			},
			{
				notAuthenticatedResponse,
				notFoundResponse,
				reqUser,
				data: calendar
			}
		);
	}

	/**
	 * create an event
	 * accessible for calendar owner and collaborators only
	 *
	 * @param calendarId the calendar id
	 * @param eventBody the event data
	 * @param eventBody.name the event name
	 * @param eventBody.startTime the event start time
	 * @param eventBody.startTime.day the event start time day
	 * @param eventBody.startTime.month the event start time month
	 * @param eventBody.startTime.year the event start time year
	 * @param eventBody.startTime.hour the event start time hour
	 * @param eventBody.startTime.minute the event start time minute
	 * @param eventBody.endTime the event end time
	 * @param eventBody.endTime.day the event end time day
	 * @param eventBody.endTime.month the event end time month
	 * @param eventBody.endTime.year the event end time year
	 * @param eventBody.endTime.hour the event end time hour
	 * @param eventBody.endTime.minute the event end time minute
	 * @param eventBody.place the event place
	 * @param eventBody.description the event description
	 * @param eventBody.participantsIds the event participants ids
	 * @param eventBody.recurrence the event recurrence
	 * @param eventBody.recurrence.type the event recurrence type
	 * @param eventBody.recurrence.end the event recurrence end
	 * @param eventBody.recurrence.end.day the event recurrence end day
	 * @param eventBody.recurrence.end.month the event recurrence end month
	 * @param eventBody.recurrence.end.year the event recurrence end year
	 * @param eventBody.recurrence.end.hour the event recurrence end hour
	 * @param eventBody.recurrence.end.minute the event recurrence end minute
	 * @param req the express request
	 * @param notAuthenticatedResponse Not Authenticated
	 * @param notAuthorizedResponse Not Authorized
	 * @param notFoundResponse Not Found
	 * @returns Created event
	 */
	@SuccessResponse('201', 'Created event')
	@Post('/')
	public async insertEvent(
		@Path() calendarId: string,
		@Body() eventBody: IEvent,
		@Request() req: express.Request,
		@Res() notAuthenticatedResponse: TsoaResponse<401, IErrorResponse>,
		@Res() notAuthorizedResponse: TsoaResponse<403, IErrorResponse>,
		@Res() notFoundResponse: TsoaResponse<404, IErrorResponse>
	): Promise<IPublicEvent | void> {
		const reqUser = getUserFromRequest(req);
		const calendar = await this._calendarService.getById(calendarId);

		return generateResponse(
			() => {
				if (checkExistenceOrShouldNotHappen(reqUser)) {
					return this._eventService.insert(
						reqUser.id,
						calendarId,
						eventBody
					);
				}
			},
			{
				notAuthenticatedResponse,
				notAuthorizedResponse,
				notFoundResponse,
				reqUser,
				data: calendar
			},
			() => {
				return checkExistenceOrShouldNotHappen(reqUser) &&
					checkExistenceOrShouldNotHappen(calendar)
					? this._authorizationService.isCalendarAccessible(
							reqUser,
							calendar
					  )
					: false;
			}
		);
	}

	/**
	 * retrieve the event
	 * accessible for calendar owner, collaborators and event participants only
	 *
	 * @param calendarId the calendar id
	 * @param eventId the event id
	 * @param req the express request
	 * @param notAuthenticatedResponse Not Authenticated
	 * @param notAuthorizedResponse Not Authorized
	 * @param notFoundResponse Not Found
	 * @returns Retrieved event
	 */
	@Get('/{eventId}')
	public async getEvent(
		@Path() calendarId: string,
		@Path() eventId: string,
		@Request() req: express.Request,
		@Res() notAuthenticatedResponse: TsoaResponse<401, IErrorResponse>,
		@Res() notAuthorizedResponse: TsoaResponse<403, IErrorResponse>,
		@Res() notFoundResponse: TsoaResponse<404, IErrorResponse>
	): Promise<IPublicEvent | void> {
		const reqUser = getUserFromRequest(req);
		const calendar = await this._calendarService.getById(calendarId);
		const event = await this._eventService.getById(calendarId, eventId);

		return generateResponse(
			() => {
				if (checkExistenceOrShouldNotHappen(event)) {
					return event;
				}
			},
			{
				notAuthenticatedResponse,
				notAuthorizedResponse,
				notFoundResponse,
				reqUser,
				data: calendar && event
			},
			() => {
				return checkExistenceOrShouldNotHappen(reqUser) &&
					checkExistenceOrShouldNotHappen(calendar) &&
					checkExistenceOrShouldNotHappen(event)
					? this._authorizationService.isEventAccessible(
							reqUser,
							calendar,
							event
					  )
					: false;
			}
		);
	}

	/**
	 * update the event
	 * accessible for calendar owner and collaborators only
	 *
	 * @param calendarId the calendar id
	 * @param eventId the event id
	 * @param newEventBody the event data
	 * @param newEventBody.name the event name
	 * @param newEventBody.startTime the event start time
	 * @param newEventBody.startTime.day the event start time day
	 * @param newEventBody.startTime.month the event start time month
	 * @param newEventBody.startTime.year the event start time year
	 * @param newEventBody.startTime.hour the event start time hour
	 * @param newEventBody.startTime.minute the event start time minute
	 * @param newEventBody.endTime the event end time
	 * @param newEventBody.endTime.day the event end time day
	 * @param newEventBody.endTime.month the event end time month
	 * @param newEventBody.endTime.year the event end time year
	 * @param newEventBody.endTime.hour the event end time hour
	 * @param newEventBody.endTime.minute the event end time minute
	 * @param newEventBody.place the event place
	 * @param newEventBody.description the event description
	 * @param newEventBody.participantsIds the event participants ids
	 * @param newEventBody.recurrence the event recurrence
	 * @param newEventBody.recurrence.type the event recurrence type
	 * @param newEventBody.recurrence.end the event recurrence end
	 * @param newEventBody.recurrence.end.day the event recurrence end day
	 * @param newEventBody.recurrence.end.month the event recurrence end month
	 * @param newEventBody.recurrence.end.year the event recurrence end year
	 * @param newEventBody.recurrence.end.hour the event recurrence end hour
	 * @param newEventBody.recurrence.end.minute the event recurrence end minute
	 * @param req the express request
	 * @param notAuthenticatedResponse Not Authenticated
	 * @param notAuthorizedResponse Not Authorized
	 * @param notFoundResponse Not Found
	 * @returns No content
	 */
	@Put('/{eventId}')
	public async updateEvent(
		@Path() calendarId: string,
		@Path() eventId: string,
		@Body() newEventBody: Partial<IEvent>,
		@Request() req: express.Request,
		@Res() notAuthenticatedResponse: TsoaResponse<401, IErrorResponse>,
		@Res() notAuthorizedResponse: TsoaResponse<403, IErrorResponse>,
		@Res() notFoundResponse: TsoaResponse<404, IErrorResponse>
	): Promise<void> {
		const reqUser = getUserFromRequest(req);
		const calendar = await this._calendarService.getById(calendarId);
		const event = await this._eventService.getById(calendarId, eventId);

		return generateResponse(
			async () => {
				if (checkExistenceOrShouldNotHappen(reqUser)) {
					await this._eventService.updateById(
						reqUser.id,
						calendarId,
						eventId,
						newEventBody
					);
				}
			},
			{
				notAuthenticatedResponse,
				notAuthorizedResponse,
				notFoundResponse,
				reqUser,
				data: calendar && event
			},
			() => {
				return checkExistenceOrShouldNotHappen(reqUser) &&
					checkExistenceOrShouldNotHappen(calendar)
					? this._authorizationService.isCalendarAccessible(
							reqUser,
							calendar
					  )
					: false;
			}
		);
	}

	/**
	 * delete the event
	 * accessible for calendar owner and collaborators only
	 *
	 * @param calendarId the calendar id
	 * @param eventId the event id
	 * @param req the express request
	 * @param notAuthenticatedResponse Not Authenticated
	 * @param notAuthorizedResponse Not Authorized
	 * @param notFoundResponse Not Found
	 * @returns No content
	 */
	@Delete('/{eventId}')
	public async deleteEvent(
		@Path() calendarId: string,
		@Path() eventId: string,
		@Request() req: express.Request,
		@Res() notAuthenticatedResponse: TsoaResponse<401, IErrorResponse>,
		@Res() notAuthorizedResponse: TsoaResponse<403, IErrorResponse>,
		@Res() notFoundResponse: TsoaResponse<404, IErrorResponse>
	): Promise<void> {
		const reqUser = getUserFromRequest(req);
		const calendar = await this._calendarService.getById(calendarId);
		const event = await this._eventService.getById(calendarId, eventId);

		return generateResponse(
			async () => {
				await this._eventService.deleteById(calendarId, eventId);
			},
			{
				notAuthenticatedResponse,
				notAuthorizedResponse,
				notFoundResponse,
				reqUser,
				data: calendar && event
			},
			() => {
				return checkExistenceOrShouldNotHappen(reqUser) &&
					checkExistenceOrShouldNotHappen(calendar)
					? this._authorizationService.isCalendarAccessible(
							reqUser,
							calendar
					  )
					: false;
			}
		);
	}
}
