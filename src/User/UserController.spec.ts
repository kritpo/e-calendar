import { MONGO_DUMB_ID, appRequest } from '../setupTest';
import { ISecurityTokens } from '../utils/security/SecurityService';
import { IPublicUser } from './User';

describe('UserController', () => {
	it('with no error', async function () {
		/**
		 * read empty
		 */
		const getAllUsersEmpty = await appRequest.get('/users');
		const getAllUsersEmptyBody = getAllUsersEmpty.body as IPublicUser[];
		getAllUsersEmptyBody.should.be.deep.equal([]);

		/**
		 * register John
		 */
		const registerUserJohn = await appRequest
			.post('/users/register')
			.send({ username: 'John', password: 'P4ssw0rd' });
		const registerUserJohnBody = registerUserJohn.body as IPublicUser;
		registerUserJohnBody.should.haveOwnProperty('id');
		registerUserJohnBody.should.haveOwnProperty('username', 'John');

		const getUserJohn = await appRequest.get(
			`/users/${registerUserJohnBody.id}`
		);
		const getUserJohnBody = getUserJohn.body as IPublicUser;
		getUserJohnBody.should.haveOwnProperty('id');
		getUserJohnBody.should.haveOwnProperty('username', 'John');

		const getAllUsersWithJohn = await appRequest.get('/users');
		const getAllUsersWithJohnBody =
			getAllUsersWithJohn.body as IPublicUser[];
		getAllUsersWithJohnBody.should.be.deep.equal([
			{ id: getUserJohnBody.id, username: 'John' }
		]);

		/**
		 * login John
		 */
		const loginUserJohn = await appRequest
			.post('/users/login')
			.send({ username: 'John', password: 'P4ssw0rd' });
		const loginUserJohnBody = loginUserJohn.body as ISecurityTokens;
		loginUserJohnBody.should.haveOwnProperty('accessToken');
		loginUserJohnBody.accessToken.should.haveOwnProperty('token');
		loginUserJohnBody.accessToken.should.haveOwnProperty('expires');
		loginUserJohnBody.should.haveOwnProperty('refreshToken');
		loginUserJohnBody.refreshToken.should.haveOwnProperty('token');
		loginUserJohnBody.refreshToken.should.haveOwnProperty('expires');

		/**
		 * update John
		 */
		const updateUserJohnWithLoginCredentials = await appRequest
			.put(`/users/${registerUserJohnBody.id}`)
			.set(
				'Authorization',
				`Bearer ${loginUserJohnBody.accessToken.token}`
			)
			.send({ username: 'New John', password: 'New P4ssw0rd' });
		updateUserJohnWithLoginCredentials.statusCode.should.be.equal(204);

		const getAllUsersWithNewJohn = await appRequest.get('/users');
		const getAllUsersWithNewJohnBody =
			getAllUsersWithNewJohn.body as IPublicUser[];
		getAllUsersWithNewJohnBody.should.be.deep.equal([
			{ id: getUserJohnBody.id, username: 'New John' }
		]);

		/**
		 * refresh John token
		 */
		const refreshUserJohn = await appRequest
			.post(`/users/${registerUserJohnBody.id}/refresh`)
			.send({ refreshToken: loginUserJohnBody.refreshToken.token });
		const refreshUserJohnBody = refreshUserJohn.body as ISecurityTokens;
		refreshUserJohnBody.should.haveOwnProperty('accessToken');
		refreshUserJohnBody.accessToken.should.haveOwnProperty('token');
		refreshUserJohnBody.accessToken.should.haveOwnProperty('expires');
		refreshUserJohnBody.should.haveOwnProperty('refreshToken');
		refreshUserJohnBody.refreshToken.should.haveOwnProperty('token');
		refreshUserJohnBody.refreshToken.should.haveOwnProperty('expires');

		/**
		 * update with token update
		 */
		const updateUserJohnWithRefreshCredentials = await appRequest
			.put(`/users/${registerUserJohnBody.id}`)
			.set(
				'Authorization',
				`Bearer ${refreshUserJohnBody.accessToken.token}`
			)
			.send({ username: 'New New John' });
		updateUserJohnWithRefreshCredentials.statusCode.should.be.equal(204);

		const getAllUsersWithNewNewJohn = await appRequest.get('/users');
		const getAllUsersWithNewNewJohnBody =
			getAllUsersWithNewNewJohn.body as IPublicUser[];
		getAllUsersWithNewNewJohnBody.should.be.deep.equal([
			{ id: getUserJohnBody.id, username: 'New New John' }
		]);

		/**
		 * delete John
		 */
		const deleteUserJohn = await appRequest
			.delete(`/users/${registerUserJohnBody.id}`)
			.set(
				'Authorization',
				`Bearer ${refreshUserJohnBody.accessToken.token}`
			);
		deleteUserJohn.statusCode.should.be.equal(204);

		const getAllUsersWithNoUsers = await appRequest.get('/users');
		const getAllUsersWithNoUsersBody =
			getAllUsersWithNoUsers.body as IPublicUser[];
		getAllUsersWithNoUsersBody.should.be.deep.equal([]);

		const getAllUsersNoUser = await appRequest.get('/users');
		const getAllUsersNoUserBody = getAllUsersNoUser.body as IPublicUser[];
		getAllUsersNoUserBody.should.be.deep.equal([]);
	});

	describe('with error', () => {
		describe('on register user', () => {
			it('400: Bad Request (Bad inputs)', async function () {
				const registerUser = await appRequest
					.post('/users/register')
					.send({ dumbField: 'dumbValue' });

				registerUser.statusCode.should.be.equal(400);
			});

			it('409: Conflict (Existing username)', async function () {
				await appRequest
					.post('/users/register')
					.send({ username: 'John', password: 'P4ssw0rd' });

				const registerUser = await appRequest
					.post('/users/register')
					.send({ username: 'John', password: 'P4ssw0rd' });

				registerUser.statusCode.should.be.equal(409);
			});
		});

		describe('on login user', () => {
			beforeEach(async () => {
				await appRequest
					.post('/users/register')
					.send({ username: 'John', password: 'P4ssw0rd' });
			});

			it('400: Bad Request (Bad inputs)', async function () {
				const loginUser = await appRequest
					.post('/users/login')
					.send({ dumbField: 'dumbValue' });

				loginUser.statusCode.should.be.equal(400);
			});

			it('401: Not Authenticated (Wrong credentials)', async function () {
				const loginUser = await appRequest
					.post('/users/login')
					.send({ username: 'John', password: 'Wr0ng P4ssw0rd' });

				loginUser.statusCode.should.be.equal(401);
			});
		});

		describe('and specific user', () => {
			let johnId: string;
			let johnToken: string;
			let janeId: string;

			beforeEach(async () => {
				const johnRegister = await appRequest
					.post('/users/register')
					.send({ username: 'John', password: 'P4ssw0rd' });
				const johnRegisterBody = johnRegister.body as IPublicUser;

				const login = await appRequest
					.post('/users/login')
					.send({ username: 'John', password: 'P4ssw0rd' });
				const loginBody = login.body as ISecurityTokens;

				const janeRegister = await appRequest
					.post('/users/register')
					.send({ username: 'Jane', password: 'P4ssw0rd' });
				const janeRegisterBody = janeRegister.body as IPublicUser;

				johnId = johnRegisterBody.id;
				johnToken = loginBody.accessToken.token;

				janeId = janeRegisterBody.id;
			});

			describe('on refresh token', () => {
				it('400: Bad Request (Bad inputs)', async function () {
					const refreshToken = await appRequest
						.post(`/users/${johnId}/refresh`)
						.send({ dumbField: 'dumbValue' });

					refreshToken.statusCode.should.be.equal(400);
				});

				it('403: Not Authorized (Wrong refresh token)', async function () {
					const refreshToken = await appRequest
						.post(`/users/${johnId}/refresh`)
						.send({ refreshToken: 'WrongToken' });

					refreshToken.statusCode.should.be.equal(403);
				});

				it('404: Not Found (Wrong user)', async function () {
					const refreshToken = await appRequest
						.post(`/users/${MONGO_DUMB_ID}/refresh`)
						.send({ refreshToken: 'token' });

					refreshToken.statusCode.should.be.equal(404);
				});
			});

			describe('on get user', () => {
				it('404: Not Found (Wrong user)', async function () {
					const getUser = await appRequest.get(
						`/users/${MONGO_DUMB_ID}`
					);

					getUser.statusCode.should.be.equal(404);
				});
			});

			describe('on update user', () => {
				it('400: Bad Request (Bad inputs)', async function () {
					const updateUser = await appRequest
						.put(`/users/${johnId}`)
						.set('Authorization', `Bearer ${johnToken}`)
						.send({ dumbField: 'dumbValue' });

					updateUser.statusCode.should.be.equal(400);
				});

				it('401: Not Authenticated (No credentials)', async function () {
					const updateUser = await appRequest
						.put(`/users/${johnId}`)
						.send({ username: 'New Username' });

					updateUser.statusCode.should.be.equal(401);
				});

				it('403: Not Authorized (Wrong user credentials)', async function () {
					const updateUser = await appRequest
						.put(`/users/${janeId}`)
						.set('Authorization', `Bearer ${johnToken}`)
						.send({ username: 'New Username' });

					updateUser.statusCode.should.be.equal(403);
				});

				it('404: Not Found (Wrong user)', async function () {
					const updateUser = await appRequest
						.put(`/users/${MONGO_DUMB_ID}`)
						.set('Authorization', `Bearer ${johnToken}`)
						.send({ username: 'New Username' });

					updateUser.statusCode.should.be.equal(404);
				});

				it('409: Conflict (Existing username)', async function () {
					const updateUser = await appRequest
						.put(`/users/${johnId}`)
						.set('Authorization', `Bearer ${johnToken}`)
						.send({ username: 'Jane' });

					updateUser.statusCode.should.be.equal(409);
				});
			});

			describe('on delete user', () => {
				it('401: Not Authenticated (No credentials)', async function () {
					const deleteUser = await appRequest.delete(
						`/users/${johnId}`
					);

					deleteUser.statusCode.should.be.equal(401);
				});

				it('403: Not Authorized (Wrong user credentials)', async function () {
					const deleteUser = await appRequest
						.delete(`/users/${janeId}`)
						.set('Authorization', `Bearer ${johnToken}`);

					deleteUser.statusCode.should.be.equal(403);
				});

				it('404: Not Found (Wrong user)', async function () {
					const deleteUser = await appRequest
						.delete(`/users/${MONGO_DUMB_ID}`)
						.set('Authorization', `Bearer ${johnToken}`);

					deleteUser.statusCode.should.be.equal(404);
				});
			});
		});
	});
});
