/**
 * check if a data exist
 *
 * @param data the data
 * @returns if the data is defined
 */
export const checkExistence = <DataType>(
	data?: DataType | null
): data is DataType => {
	return data !== undefined && data !== null;
};

/**
 * check if a data exist or throw Exception otherwise
 *
 * @param data the data
 * @returns if the data is defined
 */
export const checkExistenceOrShouldNotHappen = <DataType>(
	data?: DataType | null
): data is DataType => {
	const isExist = checkExistence(data);

	if (!isExist) {
		throw new Error('Should Not Happen');
	}

	return isExist;
};
