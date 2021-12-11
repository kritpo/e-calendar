import { appRequest } from '../setupTest';

// STUB: to replace

describe('SampleController', () => {
	it('getSample', async function () {
		const response = await appRequest.get('/sample/42');

		response.statusCode.should.be.equal(200);
		JSON.stringify(response.body).should.be.equal('{"sample":42}');
	});
});
