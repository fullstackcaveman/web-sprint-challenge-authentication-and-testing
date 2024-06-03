const db = require('../../data/dbConfig');

function getAll() {
	return db('users');
}

async function addUser(user) {
	const [id] = await db('users').insert(user);
	return findById(id);
}

function findBy(filter) {
	return db('users as u')
		.select('u.id', 'u.username', 'u.password')
		.where(filter);
}

function findById(id) {
	return db('users as u')
		.select('u.id', 'u.username', 'u.password')
		.where('u.id', id)
		.first();
}

module.exports = { getAll, addUser, findBy, findById };
