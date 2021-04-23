const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../../config/secrets.js');

const router = require('express').Router();

const Users = require('../users/users-model.js');
const checkCredentials = require('./check-payload-middleware');

router.post('/register', checkCredentials, (req, res, next) => {
	let user = req.body;

	// bcrypting the password before saving
	const rounds = process.env.BCRYPT_ROUNDS || 8; // 2 ^ 8
	const hash = bcrypt.hashSync(user.password, rounds);

	user.password = hash;

	Users.addUser(user)
		.then((saved) => {
			res.status(201).json(saved);
		})
		.catch(next);

	/*
    IMPLEMENT
    You are welcome to build additional middlewares to help with the endpoint's functionality.
    DO NOT EXCEED 2^8 ROUNDS OF HASHING!

    [ ] - 1- In order to register a new account the client must provide `username` and `password`:
      {
        "username": "Captain Marvel", // must not exist already in the `users` table
        "password": "foobar"          // needs to be hashed before it's saved
      }

    [x] - 2- On SUCCESSFUL registration,
      the response body should have `id`, `username` and `password`:
      {
        "id": 1,
        "username": "Captain Marvel",
        "password": "2a$08$jG.wIGR2S4hxuyWNcBf9MuoC4y0dNy7qC/LbmtuFBSdIhWks2LhpG"
      }

    [x] - 3- On FAILED registration due to `username` or `password` missing from the request body,
      the response body should include a string exactly as follows: "username and password required".

    4- On FAILED registration due to the `username` being taken,
      the response body should include a string exactly as follows: "username taken".
  */
});

router.post('/login', checkCredentials, (req, res, next) => {
	let { username, password } = req.body;

	Users.findBy({ username }) // it would be nice to have middleware do this
		.then(([user]) => {
			if (user && bcrypt.compareSync(password, user.password)) {
				const token = createToken(user);

				res.json({ message: `welcome, ${user.username}`, token });
			} else {
				res.status(401).json({ message: 'Invalid Credentials' });
			}
		})
		.catch(next);
	/*
    IMPLEMENT
    You are welcome to build additional middlewares to help with the endpoint's functionality.

    [x] - 1- In order to log into an existing account the client must provide `username` and `password`:
      {
        "username": "Captain Marvel",
        "password": "foobar"
      }

    [x] - 2- On SUCCESSFUL login,
      the response body should have `message` and `token`:
      {
        "message": "welcome, Captain Marvel",
        "token": "eyJhbGciOiJIUzI ... ETC ... vUPjZYDSa46Nwz8"
      }

    [x] - 3- On FAILED login due to `username` or `password` missing from the request body,
      the response body should include a string exactly as follows: "username and password required".

    4- On FAILED login due to `username` not existing in the db, or `password` being incorrect,
      the response body should include a string exactly as follows: "invalid credentials".
  */
});

const createToken = (user) => {
	const payload = {
		subject: user.id,
		username: user.username,
	};

	const options = {
		expiresIn: '24h',
	};

	return jwt.sign(payload, jwtSecret, options);
};

module.exports = router;
