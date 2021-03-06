import { HydratedDocument, ObjectId } from 'mongoose';

/**
 * retrieve the document id
 *
 * @param document the document to check
 * @returns the retrieved document id
 */
export const getDocumentId = <BaseType>(
	document: HydratedDocument<BaseType>
): ObjectId => {
	return document._id as ObjectId;
};
