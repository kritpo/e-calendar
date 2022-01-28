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
import { getUserFromRequest } from '../utils/security/getUserFromRequest';
import {
	ISecurityTokens,
	SecurityService
} from '../utils/security/SecurityService';
import { IPublicUser, IUser } from './User';
import { UserService } from './UserService';

interface IGenerateResponseParams {
	notAuthenticatedResponse?: TsoaResponse<401, IErrorResponse> | null;
	notAuthorizedResponse?: TsoaResponse<403, IErrorResponse> | null;
	notFoundResponse?: TsoaResponse<404, IErrorResponse> | null;
	user?: IPublicUser | null;
	reqUser?: IPublicUser | null;
}

interface ITokenBody {
	refreshToken: string;
}

/**
 * users controller
 */
@injectable()
@Response<IErrorResponse>(400, 'Bad Request')
@Response<IErrorResponse>(500, 'Server Internal Error')
@Security('token')
@Route('/users')
export class UserController extends Controller {
	/**
	 * generate response
	 *
	 * @param cb the main response function
	 * @param params the generator params
	 * @param params.notAuthenticatedResponse Not Authenticated
	 * @param params.notAuthorizedResponse Not Authorized
	 * @param params.notFoundResponse Content not found
	 * @param params.user the user to access
	 * @param params.reqUser the user who access to ressource
	 * @returns the generated response or null if no error response is generated
	 */
	private async _generateResponse<T>(
		cb: () => T | Promise<T>,
		params: IGenerateResponseParams
	): Promise<T> {
		if (
			params.notFoundResponse !== undefined &&
			params.notFoundResponse !== null &&
			(params.user === undefined || params.user === null)
		) {
			return generateErrorResponse<404, T>(
				params.notFoundResponse,
				404,
				'Not Found'
			);
		} else if (
			params.notAuthenticatedResponse !== undefined &&
			params.notAuthenticatedResponse !== null &&
			(params.reqUser === undefined || params.reqUser === null)
		) {
			return generateErrorResponse<401, T>(
				params.notAuthenticatedResponse,
				401,
				'Not Authenticated'
			);
		} else if (
			params.notAuthorizedResponse !== undefined &&
			params.notAuthorizedResponse !== null &&
			(params.reqUser === undefined ||
				params.reqUser === null ||
				params.user === undefined ||
				params.user === null ||
				!this._authorizationService.isUserSelf(
					params.reqUser,
					params.user
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
	 * create a user controller
	 *
	 * @param _securityService the service which manage security
	 * @param _authorizationService the service which manage authorization
	 * @param _userService the service which manage users
	 */
	constructor(
		private _securityService: SecurityService,
		private _authorizationService: AuthorizationService,
		private _userService: UserService
	) {
		super();
	}

	/**
	 * retrieve all users
	 *
	 * @returns List of users
	 */
	@Get('/')
	public async getAll(): Promise<IPublicUser[]> {
		return this._userService.getAll();
	}

	/**
	 * register an user
	 *
	 * @param userBody the user data
	 * @param userBody.username the user username
	 * @param userBody.password the user plain password
	 * @param conflictResponse Conflict
	 * @returns Created user
	 */
	@SuccessResponse('201', 'Created user')
	@Post('/register')
	public async register(
		@Body() userBody: IUser,
		@Res() conflictResponse: TsoaResponse<409, IErrorResponse>
	): Promise<IPublicUser> {
		const user = await this._userService.getByUsername(userBody.username);

		if (user !== null) {
			return generateErrorResponse<409, IPublicUser>(
				conflictResponse,
				409,
				'Conflict'
			);
		}

		this.setStatus(201);

		return this._userService.insertUserByUsernameAndPassword(
			userBody.username,
			userBody.password
		);
	}

	/**
	 * login an user
	 *
	 * @param userBody the user credentials
	 * @param userBody.username the user username
	 * @param userBody.password the user plain password
	 * @param notAuthenticatedResponse Not Authenticated
	 * @returns Logged user tokens
	 */
	@Post('/login')
	public async login(
		@Body() userBody: IUser,
		@Res() notAuthenticatedResponse: TsoaResponse<401, IErrorResponse>
	): Promise<ISecurityTokens> {
		const reqUser = await this._userService.getByUsernameAndPassword(
			userBody.username,
			userBody.password
		);

		return this._generateResponse(
			() => {
				if (reqUser === null) {
					throw new Error('Should not happen');
				}

				return this._securityService.createToken(reqUser.id);
			},
			{
				notAuthenticatedResponse,
				reqUser
			}
		);
	}

	/**
	 * refresh the user tokens
	 *
	 * @param userId the user id
	 * @param tokenBody the refresh token
	 * @param tokenBody.refreshToken the refresh token
	 * @param notAuthorizedResponse Not Authorized
	 * @param notFoundResponse Not Found
	 * @returns User refreshed tokens
	 */
	@Post('/{userId}/refresh')
	public async refresh(
		@Path() userId: string,
		@Body() tokenBody: ITokenBody,
		@Res() notAuthorizedResponse: TsoaResponse<403, IErrorResponse>,
		@Res() notFoundResponse: TsoaResponse<404, IErrorResponse>
	): Promise<ISecurityTokens> {
		const user = await this._userService.getById(userId);

		return this._generateResponse(
			() => {
				if (user !== null) {
					const response =
						this._securityService.updateAccessTokenToken(
							user.id,
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
				user
			}
		);
	}

	/**
	 * retrieve the user
	 *
	 * @param userId the user id
	 * @param notFoundResponse Content not found
	 * @returns Retrieved user
	 */
	@Get('/{userId}')
	public async getUser(
		@Path() userId: string,
		@Res() notFoundResponse: TsoaResponse<404, IErrorResponse>
	): Promise<IPublicUser> {
		const user = await this._userService.getById(userId);

		return this._generateResponse(
			() => {
				if (user === null) {
					throw new Error('Should not happen');
				}

				return user;
			},
			{
				notFoundResponse,
				user
			}
		);
	}

	/**
	 * update the user
	 *
	 * @param userId the user id
	 * @param userBody the new user data (all properties are optional)
	 * @param userBody.username the user new username
	 * @param userBody.password the user new plain password
	 * @param req the express request
	 * @param notAuthenticatedResponse Not Authenticated
	 * @param notAuthorizedResponse Not Authorized
	 * @param notFoundResponse Not Found
	 * @returns No content
	 */
	@Put('/{userId}')
	public async updateUser(
		@Path() userId: string,
		@Body() userBody: Partial<IUser>,
		@Request() req: express.Request,
		@Res() notAuthenticatedResponse: TsoaResponse<401, IErrorResponse>,
		@Res() notAuthorizedResponse: TsoaResponse<403, IErrorResponse>,
		@Res() notFoundResponse: TsoaResponse<404, IErrorResponse>
	): Promise<void> {
		const reqUser = getUserFromRequest(req);
		const user = await this._userService.getById(userId);

		return this._generateResponse(
			async () => {
				await this._userService.updateById(
					userId,
					userBody.username,
					userBody.password
				);
			},
			{
				notAuthenticatedResponse,
				notAuthorizedResponse,
				notFoundResponse,
				user,
				reqUser
			}
		);
	}

	/**
	 * delete the user
	 *
	 * @param userId the user id
	 * @param req the express request
	 * @param notAuthenticatedResponse Not Authenticated
	 * @param notAuthorizedResponse Not Authorized
	 * @param notFoundResponse Not Found
	 * @returns No content
	 */
	@Delete('/{userId}')
	public async deleteUser(
		@Path() userId: string,
		@Request() req: express.Request,
		@Res() notAuthenticatedResponse: TsoaResponse<401, IErrorResponse>,
		@Res() notAuthorizedResponse: TsoaResponse<403, IErrorResponse>,
		@Res() notFoundResponse: TsoaResponse<404, IErrorResponse>
	): Promise<void> {
		const reqUser = getUserFromRequest(req);
		const user = await this._userService.getById(userId);

		return this._generateResponse(
			async () => {
				await this._userService.deleteById(userId);
			},
			{
				notAuthenticatedResponse,
				notAuthorizedResponse,
				notFoundResponse,
				user,
				reqUser
			}
		);
	}
}
