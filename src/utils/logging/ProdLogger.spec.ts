import sinon, { SinonStub } from 'sinon';

import { ProdLogger } from './ProdLogger';
import { LoggingLevelEnum } from './types';

describe('ProdLogger', () => {
	let consoleLogStub: SinonStub;
	let processExitStub: SinonStub;
	let dateToISOStringStub: SinonStub;

	beforeEach(() => {
		consoleLogStub = sinon.stub(console, 'log');

		processExitStub = sinon.stub(process, 'exit');

		dateToISOStringStub = sinon.stub(Date.prototype, 'toISOString');
		dateToISOStringStub.returns('DATE');
	});

	afterEach(() => {
		consoleLogStub.restore();
		processExitStub.restore();
		dateToISOStringStub.restore();
	});

	describe('log', () => {
		describe('with error stack', () => {
			it('debug', function () {
				const devLogger = new ProdLogger('test');

				devLogger.log(LoggingLevelEnum.DEBUG, 'dumb_message', {
					name: 'Error',
					message: 'dumb_error',
					stack: 'dumb_trace'
				});

				consoleLogStub.should.have.been.calledWith(
					'{"date":"DATE","origin":"test","type":"DEBUG","message":"dumb_message","error":{"name":"Error","message":"dumb_error","trace":"dumb_trace"}}'
				);
				consoleLogStub.should.have.been.calledOnce();
			});

			it('info', function () {
				const devLogger = new ProdLogger('test');

				devLogger.log(LoggingLevelEnum.INFO, 'dumb_message', {
					name: 'Error',
					message: 'dumb_error',
					stack: 'dumb_trace'
				});

				consoleLogStub.should.have.been.calledWith(
					'{"date":"DATE","origin":"test","type":"INFO","message":"dumb_message"}'
				);
				consoleLogStub.should.have.been.calledOnce();
			});

			it('warn', function () {
				const devLogger = new ProdLogger('test');

				devLogger.log(LoggingLevelEnum.WARN, 'dumb_message', {
					name: 'Error',
					message: 'dumb_error',
					stack: 'dumb_trace'
				});

				consoleLogStub.should.have.been.calledWith(
					'{"date":"DATE","origin":"test","type":"WARN","message":"dumb_message","error":{"name":"Error","message":"dumb_error","trace":"dumb_trace"}}'
				);
				consoleLogStub.should.have.been.calledOnce();
			});

			it('error', function () {
				const devLogger = new ProdLogger('test');

				devLogger.log(LoggingLevelEnum.ERROR, 'dumb_message', {
					name: 'Error',
					message: 'dumb_error',
					stack: 'dumb_trace'
				});

				consoleLogStub.should.have.been.calledWith(
					'{"date":"DATE","origin":"test","type":"ERROR","message":"dumb_message","error":{"name":"Error","message":"dumb_error","trace":"dumb_trace"}}'
				);
				consoleLogStub.should.have.been.calledOnce();
			});

			it('fatal', function () {
				const devLogger = new ProdLogger('test');

				devLogger.log(LoggingLevelEnum.FATAL, 'dumb_message', {
					name: 'Error',
					message: 'dumb_error',
					stack: 'dumb_trace'
				});

				consoleLogStub.should.have.been.calledWith(
					'{"date":"DATE","origin":"test","type":"FATAL","message":"dumb_message","error":{"name":"Error","message":"dumb_error","trace":"dumb_trace"}}'
				);
				consoleLogStub.should.have.been.calledOnce();

				processExitStub.should.have.been.calledWith(1);
				processExitStub.should.have.been.calledOnce();
			});
		});

		describe('with error message only', () => {
			it('debug', function () {
				const devLogger = new ProdLogger('test');

				devLogger.log(LoggingLevelEnum.DEBUG, 'dumb_message', {
					name: 'Error',
					message: 'dumb_error'
				});

				consoleLogStub.should.have.been.calledWith(
					'{"date":"DATE","origin":"test","type":"DEBUG","message":"dumb_message","error":{"name":"Error","message":"dumb_error"}}'
				);
				consoleLogStub.should.have.been.calledOnce();
			});

			it('info', function () {
				const devLogger = new ProdLogger('test');

				devLogger.log(LoggingLevelEnum.INFO, 'dumb_message', {
					name: 'Error',
					message: 'dumb_error'
				});

				consoleLogStub.should.have.been.calledWith(
					'{"date":"DATE","origin":"test","type":"INFO","message":"dumb_message"}'
				);
				consoleLogStub.should.have.been.calledOnce();
			});

			it('warn', function () {
				const devLogger = new ProdLogger('test');

				devLogger.log(LoggingLevelEnum.WARN, 'dumb_message', {
					name: 'Error',
					message: 'dumb_error'
				});

				consoleLogStub.should.have.been.calledWith(
					'{"date":"DATE","origin":"test","type":"WARN","message":"dumb_message","error":{"name":"Error","message":"dumb_error"}}'
				);
				consoleLogStub.should.have.been.calledOnce();
			});

			it('error', function () {
				const devLogger = new ProdLogger('test');

				devLogger.log(LoggingLevelEnum.ERROR, 'dumb_message', {
					name: 'Error',
					message: 'dumb_error'
				});

				consoleLogStub.should.have.been.calledWith(
					'{"date":"DATE","origin":"test","type":"ERROR","message":"dumb_message","error":{"name":"Error","message":"dumb_error"}}'
				);
				consoleLogStub.should.have.been.calledOnce();
			});

			it('fatal', function () {
				const devLogger = new ProdLogger('test');

				devLogger.log(LoggingLevelEnum.FATAL, 'dumb_message', {
					name: 'Error',
					message: 'dumb_error'
				});

				consoleLogStub.should.have.been.calledWith(
					'{"date":"DATE","origin":"test","type":"FATAL","message":"dumb_message","error":{"name":"Error","message":"dumb_error"}}'
				);
				consoleLogStub.should.have.been.calledOnce();

				processExitStub.should.have.been.calledWith(1);
				processExitStub.should.have.been.calledOnce();
			});
		});

		describe('without error', () => {
			it('debug', function () {
				const devLogger = new ProdLogger('test');

				devLogger.log(LoggingLevelEnum.DEBUG, 'dumb_message');

				consoleLogStub.should.have.been.calledWith(
					'{"date":"DATE","origin":"test","type":"DEBUG","message":"dumb_message"}'
				);
				consoleLogStub.should.have.been.calledOnce();
			});

			it('info', function () {
				const devLogger = new ProdLogger('test');

				devLogger.log(LoggingLevelEnum.INFO, 'dumb_message');

				consoleLogStub.should.have.been.calledWith(
					'{"date":"DATE","origin":"test","type":"INFO","message":"dumb_message"}'
				);
				consoleLogStub.should.have.been.calledOnce();
			});

			it('warn', function () {
				const devLogger = new ProdLogger('test');

				devLogger.log(LoggingLevelEnum.WARN, 'dumb_message');

				consoleLogStub.should.have.been.calledWith(
					'{"date":"DATE","origin":"test","type":"WARN","message":"dumb_message"}'
				);
				consoleLogStub.should.have.been.calledOnce();
			});

			it('error', function () {
				const devLogger = new ProdLogger('test');

				devLogger.log(LoggingLevelEnum.ERROR, 'dumb_message');

				consoleLogStub.should.have.been.calledWith(
					'{"date":"DATE","origin":"test","type":"ERROR","message":"dumb_message"}'
				);
				consoleLogStub.should.have.been.calledOnce();
			});

			it('fatal', function () {
				const devLogger = new ProdLogger('test');

				devLogger.log(LoggingLevelEnum.FATAL, 'dumb_message');

				consoleLogStub.should.have.been.calledWith(
					'{"date":"DATE","origin":"test","type":"FATAL","message":"dumb_message"}'
				);
				consoleLogStub.should.have.been.calledOnce();

				processExitStub.should.have.been.calledWith(1);
				processExitStub.should.have.been.calledOnce();
			});
		});
	});

	describe('debug', () => {
		it('with error stack', function () {
			const devLogger = new ProdLogger('test');

			devLogger.debug('dumb_message', {
				name: 'Error',
				message: 'dumb_error',
				stack: 'dumb_trace'
			});

			consoleLogStub.should.have.been.calledWith(
				'{"date":"DATE","origin":"test","type":"DEBUG","message":"dumb_message","error":{"name":"Error","message":"dumb_error","trace":"dumb_trace"}}'
			);
			consoleLogStub.should.have.been.calledOnce();
		});

		it('with error message only', function () {
			const devLogger = new ProdLogger('test');

			devLogger.debug('dumb_message', {
				name: 'Error',
				message: 'dumb_error'
			});

			consoleLogStub.should.have.been.calledWith(
				'{"date":"DATE","origin":"test","type":"DEBUG","message":"dumb_message","error":{"name":"Error","message":"dumb_error"}}'
			);
			consoleLogStub.should.have.been.calledOnce();
		});

		it('without error', function () {
			const devLogger = new ProdLogger('test');

			devLogger.debug('dumb_message');

			consoleLogStub.should.have.been.calledWith(
				'{"date":"DATE","origin":"test","type":"DEBUG","message":"dumb_message"}'
			);
			consoleLogStub.should.have.been.calledOnce();
		});
	});

	it('info', function () {
		const devLogger = new ProdLogger('test');

		devLogger.info('dumb_message');

		consoleLogStub.should.have.been.calledWith(
			'{"date":"DATE","origin":"test","type":"INFO","message":"dumb_message"}'
		);
		consoleLogStub.should.have.been.calledOnce();
	});

	describe('warn', () => {
		it('with error stack', function () {
			const devLogger = new ProdLogger('test');

			devLogger.warn('dumb_message', {
				name: 'Error',
				message: 'dumb_error',
				stack: 'dumb_trace'
			});

			consoleLogStub.should.have.been.calledWith(
				'{"date":"DATE","origin":"test","type":"WARN","message":"dumb_message","error":{"name":"Error","message":"dumb_error","trace":"dumb_trace"}}'
			);
			consoleLogStub.should.have.been.calledOnce();
		});

		it('with error message only', function () {
			const devLogger = new ProdLogger('test');

			devLogger.warn('dumb_message', {
				name: 'Error',
				message: 'dumb_error'
			});

			consoleLogStub.should.have.been.calledWith(
				'{"date":"DATE","origin":"test","type":"WARN","message":"dumb_message","error":{"name":"Error","message":"dumb_error"}}'
			);
			consoleLogStub.should.have.been.calledOnce();
		});

		it('without error', function () {
			const devLogger = new ProdLogger('test');

			devLogger.warn('dumb_message');

			consoleLogStub.should.have.been.calledWith(
				'{"date":"DATE","origin":"test","type":"WARN","message":"dumb_message"}'
			);
			consoleLogStub.should.have.been.calledOnce();
		});
	});

	describe('error', () => {
		it('with error stack', function () {
			const devLogger = new ProdLogger('test');

			devLogger.error('dumb_message', {
				name: 'Error',
				message: 'dumb_error',
				stack: 'dumb_trace'
			});

			consoleLogStub.should.have.been.calledWith(
				'{"date":"DATE","origin":"test","type":"ERROR","message":"dumb_message","error":{"name":"Error","message":"dumb_error","trace":"dumb_trace"}}'
			);
			consoleLogStub.should.have.been.calledOnce();
		});

		it('with error message only', function () {
			const devLogger = new ProdLogger('test');

			devLogger.error('dumb_message', {
				name: 'Error',
				message: 'dumb_error'
			});

			consoleLogStub.should.have.been.calledWith(
				'{"date":"DATE","origin":"test","type":"ERROR","message":"dumb_message","error":{"name":"Error","message":"dumb_error"}}'
			);
			consoleLogStub.should.have.been.calledOnce();
		});

		it('without error', function () {
			const devLogger = new ProdLogger('test');

			devLogger.error('dumb_message');

			consoleLogStub.should.have.been.calledWith(
				'{"date":"DATE","origin":"test","type":"ERROR","message":"dumb_message"}'
			);
			consoleLogStub.should.have.been.calledOnce();
		});
	});

	describe('fatal', () => {
		it('with error stack', function () {
			const devLogger = new ProdLogger('test');

			devLogger.fatal('dumb_message', {
				name: 'Error',
				message: 'dumb_error',
				stack: 'dumb_trace'
			});

			consoleLogStub.should.have.been.calledWith(
				'{"date":"DATE","origin":"test","type":"FATAL","message":"dumb_message","error":{"name":"Error","message":"dumb_error","trace":"dumb_trace"}}'
			);
			consoleLogStub.should.have.been.calledOnce();

			processExitStub.should.have.been.calledWith(1);
			processExitStub.should.have.been.calledOnce();
		});

		it('with error message only', function () {
			const devLogger = new ProdLogger('test');

			devLogger.fatal('dumb_message', {
				name: 'Error',
				message: 'dumb_error'
			});

			consoleLogStub.should.have.been.calledWith(
				'{"date":"DATE","origin":"test","type":"FATAL","message":"dumb_message","error":{"name":"Error","message":"dumb_error"}}'
			);
			consoleLogStub.should.have.been.calledOnce();

			processExitStub.should.have.been.calledWith(1);
			processExitStub.should.have.been.calledOnce();
		});

		it('without error', function () {
			const devLogger = new ProdLogger('test');

			devLogger.fatal('dumb_message');

			consoleLogStub.should.have.been.calledWith(
				'{"date":"DATE","origin":"test","type":"FATAL","message":"dumb_message"}'
			);
			consoleLogStub.should.have.been.calledOnce();

			processExitStub.should.have.been.calledWith(1);
			processExitStub.should.have.been.calledOnce();
		});
	});
});
