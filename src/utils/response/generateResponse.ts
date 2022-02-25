import { TsoaResponse } from 'tsoa';

import { IPublicUser } from '../../User/User';
import { checkExistence } from '../checkExistence';
import { IErrorResponse } from './IErrorResponse';
import { generateErrorResponse } from './generateErrorResponse';

interface IGenerateResponseParams<DataType> {
	notAuthenticatedResponse?: TsoaResponse<401, IErrorResponse> | null;
	notAuthorizedResponse?: TsoaResponse<403, IErrorResponse> | null;
	notFoundResponse?: TsoaResponse<404, IErrorResponse> | null;
	reqUser?: IPublicUser | null;
	data?: DataType | null;
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
export const generateResponse = async <ReturnType, DataType>(
	cb: () => ReturnType | Promise<ReturnType>,
	params: IGenerateResponseParams<DataType>,
	authorizer?: () => boolean | null
): Promise<ReturnType> => {
	if (
		checkExistence(params.notFoundResponse) &&
		!checkExistence(params.data)
	) {
		return generateErrorResponse<404, ReturnType>(
			params.notFoundResponse,
			404,
			'Not Found'
		);
	} else if (
		checkExistence(params.notAuthenticatedResponse) &&
		!checkExistence(params.reqUser)
	) {
		return generateErrorResponse<401, ReturnType>(
			params.notAuthenticatedResponse,
			401,
			'Not Authenticated'
		);
	} else if (
		checkExistence(params.notAuthorizedResponse) &&
		checkExistence(authorizer) &&
		(!checkExistence(params.reqUser) ||
			!checkExistence(params.data) ||
			!authorizer())
	) {
		return generateErrorResponse<403, ReturnType>(
			params.notAuthorizedResponse,
			403,
			'Not Authorized'
		);
	}

	return await cb();
};
