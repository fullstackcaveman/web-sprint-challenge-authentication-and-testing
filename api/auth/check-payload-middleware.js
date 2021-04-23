// const jwt = require('jsonwebtoken');
// const { JWT_SECRET } = require('../secrets'); // use this secret!
const Users = require('../users/users-model');

const checkCredentials = (req, res, next) => {
	const { username, password } = req.body;
	const valid = Boolean(username && password && typeof password === 'string');

	if (valid) {
		next();
	} else {
		res.status(422).json({
			message: 'username and password required',
		});
	}
};

const checkUsernameExists = async (req, res, next) => {
	try {
		const [user] = await Users.findBy({ username: req.body.username });
		if (user) {
			res.status(403).json({ message: 'username taken' });
		} else {
			req.user = user;
			next();
		}
	} catch (err) {
		next(err);
	}
};

module.exports = { checkCredentials, checkUsernameExists };
