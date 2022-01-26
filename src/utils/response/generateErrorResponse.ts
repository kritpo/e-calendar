import { HttpStatusCodeLiteral, TsoaResponse } from 'tsoa';

import { IErrorResponse } from './IErrorResponse';

/**
 * generate an error response
 *
 * @param cb the callback
 * @param code the error code
 * @param message the error message
 * @returns the generated error
 */
export const generateErrorResponse = <
	Code extends HttpStatusCodeLiteral,
	Response
>(
	cb: TsoaResponse<Code, IErrorResponse>,
	code: Code,
	message: string
): Response => {
	return cb(code, { message }) as Response;
};
