import * as express from 'express';

import { IPublicEvent } from '../../Event/Event';

/**
 * retrieve the event from the request
 *
 * @param req the request
 * @returns the retrieved event
 */
export const getEventFromRequest = (
	req: express.Request
): IPublicEvent | null => {
	return (req as { event?: IPublicEvent }).event ?? null;
};
