import { appRequest } from './setupTest';

describe('app', () => {
	it('remove X-Powered-By', async function () {
		const response = await appRequest.get('/');

		Object.keys(response.headers as object).should.not.contain(
			'X-Powered-By'
		);
	});
});
