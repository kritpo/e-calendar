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
import {
	checkExistence,
	checkExistenceOrShouldNotHappen
} from '../utils/checkExistence';
import { generateErrorResponse } from '../utils/response/generateErrorResponse';
import { generateResponse } from '../utils/response/generateResponse';
import { IErrorResponse } from '../utils/response/IErrorResponse';
import { AuthorizationService } from '../utils/security/AuthorizationService';
import { getUserFromRequest } from '../utils/security/getUserFromRequest';
import {
	ISecurityTokens,
	SecurityService
} from '../utils/security/SecurityService';
import { IPublicUser, IUser } from './User';
import { UserService } from './UserService';

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
	public async getAllUsers(): Promise<IPublicUser[]> {
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
	public async registerUser(
		@Body() userBody: IUser,
		@Res() conflictResponse: TsoaResponse<409, IErrorResponse>
	): Promise<IPublicUser> {
		const user = await this._userService.getByUsername(userBody.username);

		if (checkExistence(user)) {
			return generateErrorResponse<409, IPublicUser>(
				conflictResponse,
				409,
				'Conflict'
			);
		}

		this.setStatus(201);

		return this._userService.insert(userBody);
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
	public async loginUser(
		@Body() userBody: IUser,
		@Res() notAuthenticatedResponse: TsoaResponse<401, IErrorResponse>
	): Promise<ISecurityTokens | void> {
		const reqUser = await this._userService.getByUsernameAndPassword(
			userBody.username,
			userBody.password
		);

		return generateResponse(
			() => {
				if (checkExistenceOrShouldNotHappen(reqUser)) {
					return this._securityService.createToken(reqUser.id);
				}
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
	public async refreshUser(
		@Path() userId: string,
		@Body() tokenBody: ITokenBody,
		@Res() notAuthorizedResponse: TsoaResponse<403, IErrorResponse>,
		@Res() notFoundResponse: TsoaResponse<404, IErrorResponse>
	): Promise<ISecurityTokens | void> {
		const user = await this._userService.getById(userId);

		return generateResponse(
			() => {
				if (checkExistenceOrShouldNotHappen(user)) {
					const response =
						this._securityService.updateAccessTokenToken(
							user.id,
							tokenBody.refreshToken
						);

					if (checkExistence(response)) {
						return response;
					}

					return generateErrorResponse<403, ISecurityTokens>(
						notAuthorizedResponse,
						403,
						'Not Authorized'
					);
				}
			},
			{
				notFoundResponse,
				data: user
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
	): Promise<IPublicUser | void> {
		const user = await this._userService.getById(userId);

		return generateResponse(
			() => {
				if (checkExistenceOrShouldNotHappen(user)) {
					return user;
				}
			},
			{
				notFoundResponse,
				data: user
			}
		);
	}

	/**
	 * update the user
	 *
	 * @param userId the user id
	 * @param newUserBody the new user data (all properties are optional)
	 * @param newUserBody.username the user new username
	 * @param newUserBody.password the user new plain password
	 * @param req the express request
	 * @param notAuthenticatedResponse Not Authenticated
	 * @param notAuthorizedResponse Not Authorized
	 * @param notFoundResponse Not Found
	 * @param conflictResponse Conflict
	 * @returns No content
	 */
	@Put('/{userId}')
	public async updateUser(
		@Path() userId: string,
		@Body() newUserBody: Partial<IUser>,
		@Request() req: express.Request,
		@Res() notAuthenticatedResponse: TsoaResponse<401, IErrorResponse>,
		@Res() notAuthorizedResponse: TsoaResponse<403, IErrorResponse>,
		@Res() notFoundResponse: TsoaResponse<404, IErrorResponse>,
		@Res() conflictResponse: TsoaResponse<409, IErrorResponse>
	): Promise<void> {
		if (checkExistence(newUserBody.username)) {
			const tempUser = await this._userService.getByUsername(
				newUserBody.username
			);

			if (checkExistence(tempUser) && tempUser.id !== userId) {
				return generateErrorResponse<409, void>(
					conflictResponse,
					409,
					'Conflict'
				);
			}
		}

		const reqUser = getUserFromRequest(req);
		const user = await this._userService.getById(userId);

		return generateResponse(
			async () => {
				await this._userService.updateById(userId, newUserBody);
			},
			{
				notAuthenticatedResponse,
				notAuthorizedResponse,
				notFoundResponse,
				reqUser,
				data: user
			},
			() => {
				return checkExistenceOrShouldNotHappen(reqUser) &&
					checkExistenceOrShouldNotHappen(user)
					? this._authorizationService.isUserSelf(reqUser, user)
					: false;
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

		return generateResponse(
			async () => {
				await this._userService.deleteById(userId);
			},
			{
				notAuthenticatedResponse,
				notAuthorizedResponse,
				notFoundResponse,
				reqUser,
				data: user
			},
			() => {
				return checkExistenceOrShouldNotHappen(reqUser) &&
					checkExistenceOrShouldNotHappen(user)
					? this._authorizationService.isUserSelf(reqUser, user)
					: false;
			}
		);
	}
}
