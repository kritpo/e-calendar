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
import { generateErrorResponse } from '../utils/response/generateErrorResponse';
import { IErrorResponse } from '../utils/response/IErrorResponse';
import { AuthorizationService } from '../utils/security/AuthorizationService';
import { getEventFromRequest } from '../utils/security/getEventFromRequest';
import {
	ISecurityTokens,
	SecurityService
} from '../utils/security/SecurityService';
import { IEvent, IPublicEvent } from './Event';
import { EventService } from './EventService';

interface IGenerateResponseParams {
	notAuthenticatedResponse?: TsoaResponse<401, IErrorResponse> | null;
	notAuthorizedResponse?: TsoaResponse<403, IErrorResponse> | null;
	notFoundResponse?: TsoaResponse<404, IErrorResponse> | null;
	event?: IPublicEvent | null;
	reqEvent?: IPublicEvent | null;
}

interface ITokenBody {
	refreshToken: string;
}

/**
 * events controller
 */
@injectable()
@Response<IErrorResponse>(400, 'Bad Request')
@Response<IErrorResponse>(500, 'Server Internal Error')
@Security('token')
@Route('/events')
export class EventController extends Controller {
	/**
	 * generate response
	 *
	 * @param cb the main response function
	 * @param params the generator params
	 * @param params.notAuthenticatedResponse Not Authenticated
	 * @param params.notAuthorizedResponse Not Authorized
	 * @param params.notFoundResponse Content not found
	 * @param params.event the event to access
	 * @param params.reqEvent the event who access to ressource
	 * @returns the generated response or null if no error response is generated
	 */
	private async _generateResponse<T>(
		cb: () => T | Promise<T>,
		params: IGenerateResponseParams
	): Promise<T> {
		if (
			params.notFoundResponse !== undefined &&
			params.notFoundResponse !== null &&
			(params.event === undefined || params.event === null)
		) {
			return generateErrorResponse<404, T>(
				params.notFoundResponse,
				404,
				'Not Found'
			);
		} else if (
			params.notAuthenticatedResponse !== undefined &&
			params.notAuthenticatedResponse !== null &&
			(params.reqEvent === undefined || params.reqEvent === null)
		) {
			return generateErrorResponse<401, T>(
				params.notAuthenticatedResponse,
				401,
				'Not Authenticated'
			);
		} else if (
			params.notAuthorizedResponse !== undefined &&
			params.notAuthorizedResponse !== null &&
			(params.reqEvent === undefined ||
				params.reqEvent === null ||
				params.event === undefined ||
				params.event === null ||
				!this._authorizationService.isEventSelf(
					params.reqEvent,
					params.event
				))
		) {
			return generateErrorResponse<403, T>(
				params.notAuthorizedResponse,
				403,
				'Not Authorized'
			);
		}

		return await cb();
	}

	/**
	 * create a event controller
	 *
	 * @param _securityService the service which manage security
	 * @param _authorizationService the service which manage authorization
	 * @param _eventService the service which manage events
	 */
	constructor(
		private _securityService: SecurityService,
		private _authorizationService: AuthorizationService,
		private _eventService: EventService
	) {
		super();
	}

	/**
	 * retrieve all events
	 *
	 * @returns List of events
	 */
	@Get('/')
	public async getAllEvents(): Promise<IPublicEvent[]> {
		return this._eventService.getAllEvents();
	}

	/**
	 * register an event
	 *
	 * @param eventBody the event data
	 * @param eventBody.eventname the event eventname
	 * @param eventBody.password the event plain password
	 * @param conflictResponse Conflict
	 * @returns Created event
	 */
	@SuccessResponse('201', 'Created event')
	@Post('/register')
	public async register(
		@Body() eventBody: IEvent,
		@Res() conflictResponse: TsoaResponse<409, IErrorResponse>
	): Promise<IPublicEvent> {
		const event = await this._eventService.getEventByName(eventBody.name);

		if (event !== null) {
			return generateErrorResponse<409, IPublicEvent>(
				conflictResponse,
				409,
				'Conflict'
			);
		}

		this.setStatus(201);

		return this._eventService.insertEvent(
			eventBody.name,
			eventBody.startTime,
			eventBody.endTime,
			eventBody.place,
			eventBody.description,
			eventBody.participants,
			eventBody.recurrence
		);
	}

	/**
	 * login an event
	 *
	 * @param eventBody the event credentials
	 * @param eventBody.name the event eventname
	 * @param notAuthenticatedResponse Not Authenticated
	 * @returns Logged event tokens
	 */
	@Post('/event')
	public async login(
		@Body() eventBody: IEvent,
		@Res() notAuthenticatedResponse: TsoaResponse<401, IErrorResponse>
	): Promise<ISecurityTokens> {
		const reqEvent = await this._eventService.getEventByName(
			eventBody.name
		);

		return this._generateResponse(
			() => {
				if (reqEvent === null) {
					throw new Error('Should not happen');
				}

				return this._securityService.createToken(reqEvent.id);
			},
			{
				notAuthenticatedResponse,
				reqEvent
			}
		);
	}

	/**
	 * refresh the event tokens
	 *
	 * @param eventId the event id
	 * @param tokenBody the refresh token
	 * @param tokenBody.refreshToken the refresh token
	 * @param notAuthorizedResponse Not Authorized
	 * @param notFoundResponse Not Found
	 * @returns Event refreshed tokens
	 */
	@Post('/{eventId}/refresh')
	public async refresh(
		@Path() eventId: string,
		@Body() tokenBody: ITokenBody,
		@Res() notAuthorizedResponse: TsoaResponse<403, IErrorResponse>,
		@Res() notFoundResponse: TsoaResponse<404, IErrorResponse>
	): Promise<ISecurityTokens> {
		const event = await this._eventService.getEventById(eventId);

		return this._generateResponse(
			() => {
				if (event !== null) {
					const response =
						this._securityService.updateAccessTokenToken(
							event.id,
							tokenBody.refreshToken
						);

					if (response !== null) {
						return response;
					}

					return generateErrorResponse<403, ISecurityTokens>(
						notAuthorizedResponse,
						403,
						'Not Authorized'
					);
				}

				throw new Error('Should not happen');
			},
			{
				notAuthorizedResponse,
				notFoundResponse,
				event
			}
		);
	}

	/**
	 * retrieve the event
	 *
	 * @param eventId the event id
	 * @param notFoundResponse Content not found
	 * @returns Retrieved event
	 */
	@Get('/{eventId}')
	public async getEvent(
		@Path() eventId: string,
		@Res() notFoundResponse: TsoaResponse<404, IErrorResponse>
	): Promise<IPublicEvent> {
		const event = await this._eventService.getEventById(eventId);

		return this._generateResponse(
			() => {
				if (event === null) {
					throw new Error('Should not happen');
				}

				return event;
			},
			{
				notFoundResponse,
				event
			}
		);
	}

	/**
	 * update the event
	 *
	 * @param eventId the event id
	 * @param eventBody the new event data (all properties are optional)
	 * @param eventBody.name the event new name
	 * @param eventBody.startTime the event new start time
	 * @param eventBody.endTime the event new end time
	 * @param eventBody.place the event new place
	 * @param eventBody.recurrence the event new recurrence
	 * @param eventBody.description the event new description
	 * @param eventBody.particpants the event new participants
	 * @param req the express request
	 * @param notAuthenticatedResponse Not Authenticated
	 * @param notAuthorizedResponse Not Authorized
	 * @param notFoundResponse Not Found
	 * @returns No content
	 */
	@Put('/{eventId}')
	public async updateEvent(
		@Path() eventId: string,
		@Body() eventBody: Partial<IEvent>,
		@Request() req: express.Request,
		@Res() notAuthenticatedResponse: TsoaResponse<401, IErrorResponse>,
		@Res() notAuthorizedResponse: TsoaResponse<403, IErrorResponse>,
		@Res() notFoundResponse: TsoaResponse<404, IErrorResponse>
	): Promise<void> {
		const reqEvent = getEventFromRequest(req);
		const event = await this._eventService.getEventById(eventId);

		return this._generateResponse(
			async () => {
				await this._eventService.updateEventById(
					eventId,
					eventBody.name,
					eventBody.startTime,
					eventBody.endTime,
					eventBody.place,
					eventBody.recurrence,
					eventBody.description,
					eventBody.participants
				);
			},
			{
				notAuthenticatedResponse,
				notAuthorizedResponse,
				notFoundResponse,
				event,
				reqEvent
			}
		);
	}

	/**
	 * delete the event
	 *
	 * @param eventId the event id
	 * @param req the express request
	 * @param notAuthenticatedResponse Not Authenticated
	 * @param notAuthorizedResponse Not Authorized
	 * @param notFoundResponse Not Found
	 * @returns No content
	 */
	@Delete('/{eventId}')
	public async deleteEvent(
		@Path() eventId: string,
		@Request() req: express.Request,
		@Res() notAuthenticatedResponse: TsoaResponse<401, IErrorResponse>,
		@Res() notAuthorizedResponse: TsoaResponse<403, IErrorResponse>,
		@Res() notFoundResponse: TsoaResponse<404, IErrorResponse>
	): Promise<void> {
		const reqEvent = getEventFromRequest(req);
		const event = await this._eventService.getEventById(eventId);

		return this._generateResponse(
			async () => {
				await this._eventService.deleteEventById(eventId);
			},
			{
				notAuthenticatedResponse,
				notAuthorizedResponse,
				notFoundResponse,
				event,
				reqEvent
			}
		);
	}
}
