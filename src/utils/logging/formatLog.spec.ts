import { formatLog } from './formatLog';
import { LoggingLevelEnum } from './types';

describe('formatLog', () => {
	it('debug', function () {
		const log = formatLog(LoggingLevelEnum.DEBUG, 'dumb_message');

		log.should.be.equal('\x1b[34mdumb_message\x1b[0m');
	});

	it('info', function () {
		const log = formatLog(LoggingLevelEnum.INFO, 'dumb_message');

		log.should.be.equal('\x1b[32mdumb_message\x1b[0m');
	});

	it('warn', function () {
		const log = formatLog(LoggingLevelEnum.WARN, 'dumb_message');

		log.should.be.equal('\x1b[33mdumb_message\x1b[0m');
	});

	it('error', function () {
		const log = formatLog(LoggingLevelEnum.ERROR, 'dumb_message');

		log.should.be.equal('\x1b[31mdumb_message\x1b[0m');
	});

	it('fatal', function () {
		const log = formatLog(LoggingLevelEnum.FATAL, 'dumb_message');

		log.should.be.equal('\x1b[35mdumb_message\x1b[0m');
	});
});
