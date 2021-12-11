import { container } from 'tsyringe';

import { IocContainer } from '@tsoa/runtime';

/**
 * /!\ ONLY FOR TSOA USAGE /!\
 */
export const iocContainer: IocContainer = {
	/**
	 *	/!\ ONLY FOR TSOA USAGE /!\
	 *
	 * @param controller controller to use as reference
	 * @param controller.prototype object prototype
	 * @returns the resolved object
	 */
	get: <T>(controller: { prototype: T }): T =>
		container.resolve<T>(controller as never)
};
