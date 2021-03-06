const router = require('express').Router();
const bcrypt = require('bcrypt');
const validator = require('validator');
const database = require('../database');
const jwt = require('jsonwebtoken');
const userModify = require('./user');

//user register route
router.post('/register', async (req, resp) => {
	const { username, name, email, password, birth_date } = req.body;

	console.log({ username, name, email, password, birth_date });

	// validations
	if (!username || !name || !email || !password || !birth_date) {
		resp.status(400).send('incorrect form submission');
		return;
	}

	if (!validator.isEmail(email)) {
		resp.status(400).send('incorrect email format entered');
		return;
	}
	if (!validator.isAlphanumeric(username)) {
		resp.status(400).send(
			'incorrect username format, cannot contain special characters'
		);
		return;
	}
	if (!validator.isAlpha(name, 'en-US', { ignore: ' ' })) {
		resp.status(400).send('incorrect name format');
		return;
	}

	if (!validator.isDate(birth_date)) {
		params;
		resp.status(400).send('incorrect date format');
		return;
	}

	// hashing password
	const salt = await bcrypt.genSalt(10);
	const hashPassword = await bcrypt.hash(password, salt);

	// check if username already exists
	database
		.select('username', 'email')
		.from('users')
		.whereRaw(`username = "${username}" OR email = "${email}"`)
		.then(data => {
			if (data[0]) {
				if (data[0].username === username) {
					resp.status(400).send(data[0].username + ' already exists');
					return;
				} else if (data[0].email === email) {
					resp.status(400).send(data[0].email + ' already exists');
					return;
				}
			} else {
				// write user to DB
				database
					.insert({
						username,
						name,
						email,
						hash: hashPassword,
						birth_date,
						created_at: new Date(),
					})
					.into('users')
					.then(resolve => resp.send(`Registered ${username} in DB`))
					.catch(e => resp.status(400).send(e));
			}
		})
		.catch(e => console.log(e));
});

//user login route
router.post('/login', async (req, resp) => {
	const { username, password } = req.body;

	// validations
	if (!username || !password) {
		resp.status(400).json('incorrect form submission');
		return;
	}

	database
		.select('id', 'username', 'hash')
		.from('users')
		.where({ username })
		.then(async data => {
			if (!data[0]) {
				resp.status(400).send('Username not found');
				return;
			} else {
				const validPass = await bcrypt.compare(password, data[0].hash);
				if (!validPass) {
					resp.status(400).send('Invalid Password');
					return;
				} else {
					//create and assign a token
					const token = jwt.sign(
						{ username: data[0].username },
						process.env.TOKEN_SECRET
					);
					resp.header('auth-token', token).send(data[0].username);
					return;
				}
			}
		})
		.catch(e => console.log(e + ' error'));
});

router.use('/modify', userModify);

//user delte route
// router.delete('/delete', async (req, resp) => {
// 	const { username, password } = req.body;

// 	// validations
// 	if (!username || !password)
// 		resp.status(400).json('incorrect form submission');

// 	database
// 		.select('username', 'hash')
// 		.from('users')
// 		.where({ username })
// 		.then(async data => {
// 			if (!data[0]) {
// 				resp.status(400).send('Username not found');
// 				return;
// 			} else {
// 				const validPass = await bcrypt.compare(password, data[0].hash);
// 				if (!validPass) {
// 					resp.status(400).send('Invalid Password');
// 					return;
// 				} else {
// 					database('users')
// 						.where({ username })
// 						.del()
// 						.then(deleteCount => {
// 							if (deleteCount > 0) {
// 								resp.send(`user ${username} deleted`);
// 							} else {
// 								resp.sendStatus(400);
// 							}
// 						})
// 						.catch(e => resp.status(400).json(e));
// 				}
// 			}
// 		})
// 		.catch(e => console.log(e + ' error'));
// });

module.exports = router;
