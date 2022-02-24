import { TsoaResponse } from 'tsoa';

import { IPublicUser } from '../../User/User';
import { IErrorResponse } from './IErrorResponse';
import { generateErrorResponse } from './generateErrorResponse';

interface IGenerateResponseParams<T> {
	notAuthenticatedResponse?: TsoaResponse<401, IErrorResponse> | null;
	notAuthorizedResponse?: TsoaResponse<403, IErrorResponse> | null;
	notFoundResponse?: TsoaResponse<404, IErrorResponse> | null;
	reqUser?: IPublicUser | null;
	data?: T | null;
}

/**
 * generate response
 *
 * @param cb the main response function
 * @param params the generator params
 * @param params.notAuthenticatedResponse Not Authenticated
 * @param params.notAuthorizedResponse Not Authorized
 * @param params.notFoundResponse Content not found
 * @param params.reqUser the user who access to ressource
 * @param params.data the data to access
 * @param authorizer the authorization check callback
 * @returns the generated response or null if no error response is generated
 */
export const generateResponse = async <T, U>(
	cb: () => T | Promise<T>,
	params: IGenerateResponseParams<U>,
	authorizer?: (user: IPublicUser, data: U) => boolean | null
): Promise<T> => {
	if (
		params.notFoundResponse !== undefined &&
		params.notFoundResponse !== null &&
		(params.data === undefined || params.data === null)
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
		authorizer !== undefined &&
		authorizer !== null &&
		(params.reqUser === undefined ||
			params.reqUser === null ||
			params.data === undefined ||
			params.data === null ||
			!authorizer(params.reqUser, params.data))
	) {
		return generateErrorResponse<403, T>(
			params.notAuthorizedResponse,
			403,
			'Not Authorized'
		);
	}

	return await cb();
};
