import { getEnv } from './getEnv';

describe('getEnv', () => {
	afterEach(() => {
		delete process.env.TEST;
	});

	it('with existant env', function () {
		process.env.TEST = '42';

		const env = getEnv('TEST');

		env.should.be.equal('42');
	});

	it('with inexistant env but default value', function () {
		const env = getEnv('TEST', 'dumb_value');

		env.should.be.equal('dumb_value');
	});

	it('with inexistant env without default value', function () {
		const env = getEnv('TEST');

		env.should.be.equal('');
	});
});
