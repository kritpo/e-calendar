import { appRequest } from './setupTest';

describe('app', () => {
	it('with generic 404', async function () {
		const res = await appRequest.get('/not_existant_path');
		const resBody = res.body as { message: string };

		res.statusCode.should.be.equal(404);
		resBody.message.should.be.equal('Not Found');
	});
});
