import sinon, { SinonStub } from 'sinon';

import { DevLogger } from './DevLogger';
import * as formatLog from './formatLog';
import { LoggingLevelEnum } from './types';

describe('DevLogger', () => {
	let consoleLogStub: SinonStub;
	let processExitStub: SinonStub;
	let dateToISOStringStub: SinonStub;
	let formatLogStub: SinonStub;

	beforeEach(() => {
		consoleLogStub = sinon.stub(console, 'log');

		processExitStub = sinon.stub(process, 'exit');

		dateToISOStringStub = sinon.stub(Date.prototype, 'toISOString');
		dateToISOStringStub.returns('DATE');

		formatLogStub = sinon.stub(formatLog, 'formatLog');
		formatLogStub
			.withArgs(LoggingLevelEnum.DEBUG, '[DATE] test/DEBUG: dumb_message')
			.returns('DEBUG: dumb_message');
		formatLogStub
			.withArgs(LoggingLevelEnum.INFO, '[DATE] test/INFO: dumb_message')
			.returns('INFO: dumb_message');
		formatLogStub
			.withArgs(LoggingLevelEnum.WARN, '[DATE] test/WARN: dumb_message')
			.returns('WARN: dumb_message');
		formatLogStub
			.withArgs(LoggingLevelEnum.ERROR, '[DATE] test/ERROR: dumb_message')
			.returns('ERROR: dumb_message');
		formatLogStub
			.withArgs(LoggingLevelEnum.FATAL, '[DATE] test/FATAL: dumb_message')
			.returns('FATAL: dumb_message');
		formatLogStub
			.withArgs(
				LoggingLevelEnum.ERROR,
				'[DATE] test/TRACE: Error[dumb_error]'
			)
			.returns('ERROR: dumb_error');
		formatLogStub
			.withArgs(
				LoggingLevelEnum.ERROR,
				'[DATE] test/TRACE: Error\ndumb_trace'
			)
			.returns('ERROR: dumb_trace');
	});

	afterEach(() => {
		consoleLogStub.restore();
		processExitStub.restore();
		dateToISOStringStub.restore();
		formatLogStub.restore();
	});

	describe('log', () => {
		describe('with error stack', () => {
			it('debug', function () {
				const devLogger = new DevLogger('test');

				devLogger.log(LoggingLevelEnum.DEBUG, 'dumb_message', {
					name: 'Error',
					message: 'dumb_error',
					stack: 'dumb_trace'
				});

				consoleLogStub.should.have.been.calledWith(
					'DEBUG: dumb_message\nERROR: dumb_trace'
				);
				consoleLogStub.should.have.been.calledOnce();
			});

			it('info', function () {
				const devLogger = new DevLogger('test');

				devLogger.log(LoggingLevelEnum.INFO, 'dumb_message', {
					name: 'Error',
					message: 'dumb_error',
					stack: 'dumb_trace'
				});

				consoleLogStub.should.have.been.calledWith(
					'INFO: dumb_message'
				);
				consoleLogStub.should.have.been.calledOnce();
			});

			it('warn', function () {
				const devLogger = new DevLogger('test');

				devLogger.log(LoggingLevelEnum.WARN, 'dumb_message', {
					name: 'Error',
					message: 'dumb_error',
					stack: 'dumb_trace'
				});

				consoleLogStub.should.have.been.calledWith(
					'WARN: dumb_message\nERROR: dumb_trace'
				);
				consoleLogStub.should.have.been.calledOnce();
			});

			it('error', function () {
				const devLogger = new DevLogger('test');

				devLogger.log(LoggingLevelEnum.ERROR, 'dumb_message', {
					name: 'Error',
					message: 'dumb_error',
					stack: 'dumb_trace'
				});

				consoleLogStub.should.have.been.calledWith(
					'ERROR: dumb_message\nERROR: dumb_trace'
				);
				consoleLogStub.should.have.been.calledOnce();
			});

			it('fatal', function () {
				const devLogger = new DevLogger('test');

				devLogger.log(LoggingLevelEnum.FATAL, 'dumb_message', {
					name: 'Error',
					message: 'dumb_error',
					stack: 'dumb_trace'
				});

				consoleLogStub.should.have.been.calledWith(
					'FATAL: dumb_message\nERROR: dumb_trace'
				);
				consoleLogStub.should.have.been.calledOnce();

				processExitStub.should.have.been.calledWith(1);
				processExitStub.should.have.been.calledOnce();
			});
		});

		describe('with error message only', () => {
			it('debug', function () {
				const devLogger = new DevLogger('test');

				devLogger.log(LoggingLevelEnum.DEBUG, 'dumb_message', {
					name: 'Error',
					message: 'dumb_error'
				});

				consoleLogStub.should.have.been.calledWith(
					'DEBUG: dumb_message\nERROR: dumb_error'
				);
				consoleLogStub.should.have.been.calledOnce();
			});

			it('info', function () {
				const devLogger = new DevLogger('test');

				devLogger.log(LoggingLevelEnum.INFO, 'dumb_message', {
					name: 'Error',
					message: 'dumb_error'
				});

				consoleLogStub.should.have.been.calledWith(
					'INFO: dumb_message'
				);
				consoleLogStub.should.have.been.calledOnce();
			});

			it('warn', function () {
				const devLogger = new DevLogger('test');

				devLogger.log(LoggingLevelEnum.WARN, 'dumb_message', {
					name: 'Error',
					message: 'dumb_error'
				});

				consoleLogStub.should.have.been.calledWith(
					'WARN: dumb_message\nERROR: dumb_error'
				);
				consoleLogStub.should.have.been.calledOnce();
			});

			it('error', function () {
				const devLogger = new DevLogger('test');

				devLogger.log(LoggingLevelEnum.ERROR, 'dumb_message', {
					name: 'Error',
					message: 'dumb_error'
				});

				consoleLogStub.should.have.been.calledWith(
					'ERROR: dumb_message\nERROR: dumb_error'
				);
				consoleLogStub.should.have.been.calledOnce();
			});

			it('fatal', function () {
				const devLogger = new DevLogger('test');

				devLogger.log(LoggingLevelEnum.FATAL, 'dumb_message', {
					name: 'Error',
					message: 'dumb_error'
				});

				consoleLogStub.should.have.been.calledWith(
					'FATAL: dumb_message\nERROR: dumb_error'
				);
				consoleLogStub.should.have.been.calledOnce();

				processExitStub.should.have.been.calledWith(1);
				processExitStub.should.have.been.calledOnce();
			});
		});

		describe('without error', () => {
			it('debug', function () {
				const devLogger = new DevLogger('test');

				devLogger.log(LoggingLevelEnum.DEBUG, 'dumb_message');

				consoleLogStub.should.have.been.calledWith(
					'DEBUG: dumb_message'
				);
				consoleLogStub.should.have.been.calledOnce();
			});

			it('info', function () {
				const devLogger = new DevLogger('test');

				devLogger.log(LoggingLevelEnum.INFO, 'dumb_message');

				consoleLogStub.should.have.been.calledWith(
					'INFO: dumb_message'
				);
				consoleLogStub.should.have.been.calledOnce();
			});

			it('warn', function () {
				const devLogger = new DevLogger('test');

				devLogger.log(LoggingLevelEnum.WARN, 'dumb_message');

				consoleLogStub.should.have.been.calledWith(
					'WARN: dumb_message'
				);
				consoleLogStub.should.have.been.calledOnce();
			});

			it('error', function () {
				const devLogger = new DevLogger('test');

				devLogger.log(LoggingLevelEnum.ERROR, 'dumb_message');

				consoleLogStub.should.have.been.calledWith(
					'ERROR: dumb_message'
				);
				consoleLogStub.should.have.been.calledOnce();
			});

			it('fatal', function () {
				const devLogger = new DevLogger('test');

				devLogger.log(LoggingLevelEnum.FATAL, 'dumb_message');

				consoleLogStub.should.have.been.calledWith(
					'FATAL: dumb_message'
				);
				consoleLogStub.should.have.been.calledOnce();

				processExitStub.should.have.been.calledWith(1);
				processExitStub.should.have.been.calledOnce();
			});
		});
	});

	describe('debug', () => {
		it('with error stack', function () {
			const devLogger = new DevLogger('test');

			devLogger.debug('dumb_message', {
				name: 'Error',
				message: 'dumb_error',
				stack: 'dumb_trace'
			});

			consoleLogStub.should.have.been.calledWith(
				'DEBUG: dumb_message\nERROR: dumb_trace'
			);
			consoleLogStub.should.have.been.calledOnce();
		});

		it('with error message only', function () {
			const devLogger = new DevLogger('test');

			devLogger.debug('dumb_message', {
				name: 'Error',
				message: 'dumb_error'
			});

			consoleLogStub.should.have.been.calledWith(
				'DEBUG: dumb_message\nERROR: dumb_error'
			);
			consoleLogStub.should.have.been.calledOnce();
		});

		it('without error', function () {
			const devLogger = new DevLogger('test');

			devLogger.debug('dumb_message');

			consoleLogStub.should.have.been.calledWith('DEBUG: dumb_message');
			consoleLogStub.should.have.been.calledOnce();
		});
	});

	it('info', function () {
		const devLogger = new DevLogger('test');

		devLogger.info('dumb_message');

		consoleLogStub.should.have.been.calledWith('INFO: dumb_message');
		consoleLogStub.should.have.been.calledOnce();
	});

	describe('warn', () => {
		it('with error stack', function () {
			const devLogger = new DevLogger('test');

			devLogger.warn('dumb_message', {
				name: 'Error',
				message: 'dumb_error',
				stack: 'dumb_trace'
			});

			consoleLogStub.should.have.been.calledWith(
				'WARN: dumb_message\nERROR: dumb_trace'
			);
			consoleLogStub.should.have.been.calledOnce();
		});

		it('with error message only', function () {
			const devLogger = new DevLogger('test');

			devLogger.warn('dumb_message', {
				name: 'Error',
				message: 'dumb_error'
			});

			consoleLogStub.should.have.been.calledWith(
				'WARN: dumb_message\nERROR: dumb_error'
			);
			consoleLogStub.should.have.been.calledOnce();
		});

		it('without error', function () {
			const devLogger = new DevLogger('test');

			devLogger.warn('dumb_message');

			consoleLogStub.should.have.been.calledWith('WARN: dumb_message');
			consoleLogStub.should.have.been.calledOnce();
		});
	});

	describe('error', () => {
		it('with error stack', function () {
			const devLogger = new DevLogger('test');

			devLogger.error('dumb_message', {
				name: 'Error',
				message: 'dumb_error',
				stack: 'dumb_trace'
			});

			consoleLogStub.should.have.been.calledWith(
				'ERROR: dumb_message\nERROR: dumb_trace'
			);
			consoleLogStub.should.have.been.calledOnce();
		});

		it('with error message only', function () {
			const devLogger = new DevLogger('test');

			devLogger.error('dumb_message', {
				name: 'Error',
				message: 'dumb_error'
			});

			consoleLogStub.should.have.been.calledWith(
				'ERROR: dumb_message\nERROR: dumb_error'
			);
			consoleLogStub.should.have.been.calledOnce();
		});

		it('without error', function () {
			const devLogger = new DevLogger('test');

			devLogger.error('dumb_message');

			consoleLogStub.should.have.been.calledWith('ERROR: dumb_message');
			consoleLogStub.should.have.been.calledOnce();
		});
	});

	describe('fatal', () => {
		it('with error stack', function () {
			const devLogger = new DevLogger('test');

			devLogger.fatal('dumb_message', {
				name: 'Error',
				message: 'dumb_error',
				stack: 'dumb_trace'
			});

			consoleLogStub.should.have.been.calledWith(
				'FATAL: dumb_message\nERROR: dumb_trace'
			);
			consoleLogStub.should.have.been.calledOnce();

			processExitStub.should.have.been.calledWith(1);
			processExitStub.should.have.been.calledOnce();
		});

		it('with error message only', function () {
			const devLogger = new DevLogger('test');

			devLogger.fatal('dumb_message', {
				name: 'Error',
				message: 'dumb_error'
			});

			consoleLogStub.should.have.been.calledWith(
				'FATAL: dumb_message\nERROR: dumb_error'
			);
			consoleLogStub.should.have.been.calledOnce();

			processExitStub.should.have.been.calledWith(1);
			processExitStub.should.have.been.calledOnce();
		});

		it('without error', function () {
			const devLogger = new DevLogger('test');

			devLogger.fatal('dumb_message');

			consoleLogStub.should.have.been.calledWith('FATAL: dumb_message');
			consoleLogStub.should.have.been.calledOnce();

			processExitStub.should.have.been.calledWith(1);
			processExitStub.should.have.been.calledOnce();
		});
	});
});
