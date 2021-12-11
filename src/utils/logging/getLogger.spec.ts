import { getLogger } from './getLogger';
import { DevLogger } from './models/DevLogger';
import { ProdLogger } from './models/ProdLogger';

describe('getLogger', () => {
	let currentNodeEnv: string | undefined;

	beforeEach(() => {
		currentNodeEnv = process.env.NODE_ENV;
	});

	afterEach(() => {
		if (currentNodeEnv !== undefined) {
			process.env.NODE_ENV = currentNodeEnv;
		} else {
			delete process.env.NODE_ENV;
		}
	});

	it('production environment', function () {
		process.env.NODE_ENV = 'production';

		const logger = getLogger('');

		logger.should.have.been.instanceOf(ProdLogger);
	});

	it('not production environment', function () {
		process.env.NODE_ENV = 'development';

		const logger = getLogger('');

		logger.should.have.been.instanceOf(DevLogger);
	});
});
