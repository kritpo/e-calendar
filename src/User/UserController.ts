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
	Route,
	Security,
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
import { IUser, PublicUserType } from './User';
import { UserService } from './UserService';

interface ITokenBody {
	refreshToken: string;
}

/**
 * users controller
 */
@injectable()
@Route('/users')
export class UserController extends Controller {
	/**
	 * generate response
	 *
	 * @param cb the main response function
	 * @param notAuthenticatedResponse Not authenticated
	 * @param notAuthorizedResponse Not authorized
	 * @param notFoundResponse Content not found
	 * @param user the user to access
	 * @param reqUser the user who access to ressource
	 * @returns the generated response or null if no error response is generated
	 */
	private async _generateResponse<T>(
		cb: () => T | Promise<T>,
		notAuthenticatedResponse: TsoaResponse<401, IErrorResponse>,
		notAuthorizedResponse: TsoaResponse<403, IErrorResponse>,
		notFoundResponse: TsoaResponse<404, IErrorResponse>,
		user: PublicUserType | null,
		reqUser?: PublicUserType
	): Promise<T> {
		if (user === null) {
			return generateErrorResponse<404, T>(
				notFoundResponse,
				404,
				'Not found'
			);
		} else if (reqUser === undefined) {
			return generateErrorResponse<401, T>(
				notAuthenticatedResponse,
				401,
				'Not authenticated'
			);
		} else if (this._authorizationService.isUserSelf(reqUser, user)) {
			return generateErrorResponse<403, T>(
				notAuthorizedResponse,
				403,
				'Not authorized'
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
	@Security('jwt')
	@Get('/')
	public async getAll(): Promise<PublicUserType[]> {
		return this._userService.getAll();
	}

	/**
	 * register the user
	 *
	 * @param userBody the user data
	 * @param userBody.username the user username
	 * @param userBody.password the user plain password
	 * @returns Created user data
	 */
	@Security('jwt')
	@Post('/register')
	public async register(@Body() userBody: IUser): Promise<PublicUserType> {
		this.setStatus(201);

		return this._userService.insertUserByUsernameAndPassword(
			userBody.username,
			userBody.password
		);
	}

	/**
	 * login the user
	 *
	 * @param userBody the user data
	 * @param userBody.username the user username
	 * @param userBody.password the user plain password
	 * @returns Logged user tokens or null if the action failed
	 */
	@Security('jwt')
	@Post('/login')
	public async login(
		@Body() userBody: IUser
	): Promise<ISecurityTokens | null> {
		const user = await this._userService.getByUsernameAndPassword(
			userBody.username,
			userBody.password
		);

		if (user === null) {
			return null;
		}

		return this._securityService.createToken(user.id);
	}

	/**
	 * refresh the user access
	 *
	 * @param userId the user id
	 * @param tokenBody the token data
	 * @param tokenBody.refreshToken the refresh token
	 * @param req the express request
	 * @param notAuthenticatedResponse Not authenticated
	 * @param notAuthorizedResponse Not authorized
	 * @param notFoundResponse Content not found
	 * @returns Refreshed user new tokens
	 */
	@Security('jwt')
	@Post('/{userId}/refresh')
	public async refresh(
		@Path() userId: string,
		@Body() tokenBody: ITokenBody,
		@Request() req: express.Request,
		@Res() notAuthenticatedResponse: TsoaResponse<401, IErrorResponse>,
		@Res() notAuthorizedResponse: TsoaResponse<403, IErrorResponse>,
		@Res() notFoundResponse: TsoaResponse<404, IErrorResponse>
	): Promise<ISecurityTokens> {
		const reqUser = getUserFromRequest(req);
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
				}

				throw new Error('Should not happen');
			},
			notAuthenticatedResponse,
			notAuthorizedResponse,
			notFoundResponse,
			user,
			reqUser
		);
	}

	/**
	 * retrieve a single user
	 *
	 * @param userId the user id
	 * @param notFoundResponse Content not found
	 * @returns Retrieved user data
	 */
	@Get('/{userId}')
	public async getUser(
		@Path() userId: string,
		@Res() notFoundResponse: TsoaResponse<404, IErrorResponse>
	): Promise<PublicUserType> {
		const user = await this._userService.getById(userId);

		if (user === null) {
			return generateErrorResponse<404, PublicUserType>(
				notFoundResponse,
				404,
				'Not found'
			);
		}

		return user;
	}

	/**
	 * update a single user
	 *
	 * @param userId the user id
	 * @param userBody the new user data
	 * @param userBody.username the new user username
	 * @param userBody.password the new user plain password
	 * @param req the express request
	 * @param notAuthenticatedResponse Not authenticated
	 * @param notAuthorizedResponse Not authorized
	 * @param notFoundResponse Content not found
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
			notAuthenticatedResponse,
			notAuthorizedResponse,
			notFoundResponse,
			user,
			reqUser
		);
	}

	/**
	 * delete a single user
	 *
	 * @param userId the user id
	 * @param req the express request
	 * @param notAuthenticatedResponse Not authenticated
	 * @param notAuthorizedResponse Not authorized
	 * @param notFoundResponse Content not found
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
			notAuthenticatedResponse,
			notAuthorizedResponse,
			notFoundResponse,
			user,
			reqUser
		);
	}
}
