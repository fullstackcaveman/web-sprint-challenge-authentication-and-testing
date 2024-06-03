exports.seed = function (knex) {
	// Deletes ALL existing entries
	return knex('users')
		.truncate()
		.then(function () {
			// Inserts seed entries
			return knex('users').insert([
				{
					username: 'Test User',
					password: 'lkjagsd;klnasdf olgalm nakjvn',
				},
				{
					username: 'Test User 2',
					password: 'mffdjddmslsdl olgalm nakjvn',
				},
				{
					username: 'Test User 3',
					password: 'kkfhjdfhdhdjcnmch olgalm nakjvn',
				},
			]);
		});
};
