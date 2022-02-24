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
	TsoaResponse
} from 'tsoa';
import { injectable } from 'tsyringe';
import { IPublicUser } from '../User/User';
import { generateResponse } from '../utils/response/generateResponse';
import { IErrorResponse } from '../utils/response/IErrorResponse';
import { AuthorizationService } from '../utils/security/AuthorizationService';
import { getUserFromRequest } from '../utils/security/getUserFromRequest';
import { ICalendar, IPublicCalendar } from './Calendar';
import { CalendarService } from './CalendarService';

/**
 * calendars controller
 */
@injectable()
@Response<IErrorResponse>(400, 'Bad Request')
@Response<IErrorResponse>(500, 'Server Internal Error')
@Security('token')
@Route('/calendars')
export class CalendarController extends Controller {
	/**
	 * create a calendar controller
	 *
	 * @param _authorizationService the service which manage authorization
	 * @param _calendarService the service which manage calendars
	 */
	constructor(
		private _authorizationService: AuthorizationService,
		private _calendarService: CalendarService
	) {
		super();
	}

	/**
	 * retrieve all calendars
	 *
	 * @param req the express request
	 * @param notAuthenticatedResponse Not Authenticated
	 * @returns List of calendars
	 */
	@Get('/')
	public async getAll(
		@Request() req: express.Request,
		@Res() notAuthenticatedResponse: TsoaResponse<401, IErrorResponse>
	): Promise<IPublicCalendar[]> {
		const reqUser = getUserFromRequest(req);

		return generateResponse(
			async () => {
				if (reqUser === null) {
					throw new Error('Should not happen');
				}

				return this._calendarService.getAllCalendars(reqUser.id);
			},
			{
				notAuthenticatedResponse,
				reqUser
			}
		);
	}

	/**
	 * create a calendar
	 *
	 * @param calendarBody the calendar data
	 * @param calendarBody.name the calendar name
	 * @param calendarBody.type the calendar type
	 * @param calendarBody.description the calendar description
	 * @param calendarBody.collaboratorsIds the calendar collaborators ids (not for private)
	 * @param req the express request
	 * @param notAuthenticatedResponse Not Authenticated
	 * @returns Created calendar
	 */
	@Post('/')
	public async insertCalendar(
		@Body() calendarBody: ICalendar,
		@Request() req: express.Request,
		@Res() notAuthenticatedResponse: TsoaResponse<401, IErrorResponse>
	): Promise<IPublicCalendar> {
		const reqUser = getUserFromRequest(req);

		return generateResponse(
			async () => {
				if (reqUser === null) {
					throw new Error('Should not happen');
				}

				return this._calendarService.insertCalendar(
					reqUser.id,
					calendarBody.name,
					calendarBody.type,
					calendarBody.description,
					calendarBody.collaboratorsIds
				);
			},
			{
				notAuthenticatedResponse,
				reqUser
			}
		);
	}

	/**
	 * retrieve the calendar
	 * accessible for calendar owner and collaborators only
	 *
	 * @param calendarId the calendar id
	 * @param req the express request
	 * @param notAuthenticatedResponse Not Authenticated
	 * @param notAuthorizedResponse Not Authorized
	 * @param notFoundResponse Not Found
	 * @returns Retrieved calendar
	 */
	@Get('/{calendarId}')
	public async getCalendar(
		@Path() calendarId: string,
		@Request() req: express.Request,
		@Res() notAuthenticatedResponse: TsoaResponse<401, IErrorResponse>,
		@Res() notAuthorizedResponse: TsoaResponse<403, IErrorResponse>,
		@Res() notFoundResponse: TsoaResponse<404, IErrorResponse>
	): Promise<IPublicCalendar> {
		const reqUser = getUserFromRequest(req);
		const calendar = await this._calendarService.getCalendarById(
			calendarId
		);

		return generateResponse(
			() => {
				if (calendar === null) {
					throw new Error('Should not happen');
				}

				return calendar;
			},
			{
				notAuthenticatedResponse,
				notAuthorizedResponse,
				notFoundResponse,
				reqUser,
				data: calendar
			},
			(user: IPublicUser, data: IPublicCalendar) => {
				return this._authorizationService.isCalendarAccessible(
					user,
					data
				);
			}
		);
	}

	/**
	 * update the calendar
	 * accessible for calendar owner and collaborators only
	 *
	 * @param calendarId the calendar id
	 * @param newCalendarBody the new calendar data (all properties are optional)
	 * @param newCalendarBody.name the new calendar name
	 * @param newCalendarBody.type the new calendar type
	 * @param newCalendarBody.description the new calendar description
	 * @param newCalendarBody.collaboratorsIds the new calendar collaborators ids (not for private)
	 * @param req the express request
	 * @param notAuthenticatedResponse Not Authenticated
	 * @param notAuthorizedResponse Not Authorized
	 * @param notFoundResponse Not Found
	 * @returns No content
	 */
	@Put('/{calendarId}')
	public async updateCalendar(
		@Path() calendarId: string,
		@Body() newCalendarBody: Partial<ICalendar>,
		@Request() req: express.Request,
		@Res() notAuthenticatedResponse: TsoaResponse<401, IErrorResponse>,
		@Res() notAuthorizedResponse: TsoaResponse<403, IErrorResponse>,
		@Res() notFoundResponse: TsoaResponse<404, IErrorResponse>
	): Promise<void> {
		const reqUser = getUserFromRequest(req);
		const calendar = await this._calendarService.getCalendarById(
			calendarId
		);

		return generateResponse(
			async () => {
				await this._calendarService.updateCalendarById(
					calendarId,
					newCalendarBody.name,
					newCalendarBody.type,
					newCalendarBody.description,
					newCalendarBody.collaboratorsIds
				);
			},
			{
				notAuthenticatedResponse,
				notAuthorizedResponse,
				notFoundResponse,
				reqUser,
				data: calendar
			},
			(user: IPublicUser, data: IPublicCalendar) => {
				return this._authorizationService.isCalendarAccessible(
					user,
					data
				);
			}
		);
	}

	/**
	 * delete the calendar
	 * accessible for calendar owner only
	 *
	 * @param calendarId the calendar id
	 * @param req the express request
	 * @param notAuthenticatedResponse Not Authenticated
	 * @param notAuthorizedResponse Not Authorized
	 * @param notFoundResponse Not Found
	 * @returns No content
	 */
	@Delete('/{calendarId}')
	public async deleteCalendar(
		@Path() calendarId: string,
		@Request() req: express.Request,
		@Res() notAuthenticatedResponse: TsoaResponse<401, IErrorResponse>,
		@Res() notAuthorizedResponse: TsoaResponse<403, IErrorResponse>,
		@Res() notFoundResponse: TsoaResponse<404, IErrorResponse>
	): Promise<void> {
		const reqUser = getUserFromRequest(req);
		const calendar = await this._calendarService.getCalendarById(
			calendarId
		);

		return generateResponse(
			async () => {
				await this._calendarService.deleteCalendarById(calendarId);
			},
			{
				notAuthenticatedResponse,
				notAuthorizedResponse,
				notFoundResponse,
				reqUser,
				data: calendar
			},
			(user: IPublicUser, data: IPublicCalendar) => {
				return this._authorizationService.isCalendarOwned(user, data);
			}
		);
	}
}
