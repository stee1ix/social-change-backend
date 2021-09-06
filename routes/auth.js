const router = require('express').Router();
const bcrypt = require('bcrypt');
const validator = require('validator');
const database = require('../database');

//user register route
router.post('/register', async (req, resp) => {
	const { username, name, email, password, birth_date } = req.body;

	// validations
	if (!username || !name || !email || !password || !birth_date)
		resp.status(400).json('incorrect form submission');

	if (!validator.isEmail(email))
		resp.status(400).json('incorrect email format entered');
	if (!validator.isAlphanumeric(username))
		resp.status(400).json(
			'incorrect username, cannot contain special characters'
		);
	if (!validator.isAlpha(name, 'en-US', { ignore: ' ' }))
		resp.status(400).json('incorrect name format');
	if (!validator.isDate(birth_date))
		resp.status(400).json('incorrect date format');

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
					.catch(e => resp.status(400).json(e));
			}
		})
		.catch(e => console.log(e));
});

//user login route
router.post('/login', async (req, resp) => {
	const { username, password } = req.body;

	// validations
	if (!username || !password)
		resp.status(400).json('incorrect form submission');

	database
		.select('username', 'hash')
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
					resp.status(200).send(`logged in as ${data[0].username}`);
				}
			}
		})
		.catch(e => console.log(e + ' error'));
});

module.exports = router;
