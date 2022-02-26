import { HydratedDocument, Model, Types } from 'mongoose';

import { checkExistence } from '../utils/checkExistence';

/**
 * base structure for service
 */
export abstract class AbstractBaseService<BaseType, PublicType> {
	protected abstract _retrievePublicType(
		data: HydratedDocument<BaseType>
	): Promise<PublicType> | PublicType;

	/**
	 * create a new object
	 *
	 * @param model the mongoose model
	 * @param data the data
	 * @returns newly created object
	 */
	protected async _insert(
		model: Model<BaseType>,
		data: BaseType
	): Promise<PublicType> {
		const modelData = new model(data);

		await modelData.save();

		return this._retrievePublicType(modelData);
	}

	/**
	 * retrieve a specific mongoose object by its id
	 *
	 * @param model the mongoose model
	 * @param id the id of the object
	 * @returns the found mongoose object
	 */
	protected async _getById(
		model: Model<BaseType>,
		id: string
	): Promise<HydratedDocument<BaseType> | null> {
		return model.findById(new Types.ObjectId(id)).exec();
	}

	/**
	 * retrieve a specific object by its id
	 *
	 * @param model the mongoose model
	 * @param id the id of the object
	 * @returns the found object
	 */
	protected async _getByIdPublicType(
		model: Model<BaseType>,
		id: string
	): Promise<PublicType | null> {
		const modelData = await this._getById(model, id);

		return checkExistence(modelData)
			? this._retrievePublicType(modelData)
			: null;
	}
}
