const bcrypt = require('bcryptjs');
const request = require('supertest');
const db = require('../data/dbConfig');
const server = require('./server');

const darth = { username: 'Darth Vader', password: '1234' };
const rey = { username: 'Rey', password: '1234' };

// Runs once on test file start
beforeAll(async () => {
	await db.migrate.rollback();
	await db.migrate.latest();
});

// Runs before each individual test
beforeEach(async () => {
	await db('users').truncate();
});

// Runs after all tests are done
afterAll(async () => {
	// Cuts off db connection
	await db.destroy();
});

test('sanity', () => {
	expect(true).toBe(true);
});

describe('server', () => {
	describe('GET/api/users', () => {
		test('responds with 200 ok', async () => {
			const res = await request(server).get('/api/users');
			expect(res.status).toBe(200);
		});

		test('returns correct num of users', async () => {
			let res;
			await db('users').insert(darth);
			res = await request(server).get('/api/users');
			expect(res.body).toHaveLength(1);

			await db('users').insert(rey);
			res = await request(server).get('/api/users');
			expect(res.body).toHaveLength(2);
		});

		test('returns correct user format', async () => {
			await db('users').insert(darth);
			await db('users').insert(rey);

			const res = await request(server).get('/api/users');
			expect(res.body[0]).toMatchObject({ id: 1, ...darth });
			expect(res.body[1]).toMatchObject({ id: 2, ...rey });
		});
	});

	describe('POST/api/auth/register', () => {
		test('responds with newly created user', async () => {
			let res;
			res = await request(server).post('/api/auth/register').send(darth);
			expect(res.body).toMatchObject({
				id: 1,
				password: expect.anything(),
				username: 'Darth Vader',
			});
		});

		test('value of password has changed', async () => {
			const res = await request(server).post('/api/auth/register').send(rey);
			expect(res.body.password).not.toBe(rey.password);
		});
	});
});
