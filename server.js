const express = require('express');
const knex = require('knex');
const validator = require('validator');
const Joi = require('joi');

const database = knex({
	client: 'mysql',
	connection: {
		host: '127.0.0.1',
		user: 'root',
		password: '',
		database: 'socialchange',
	},
});

// check database connectivity
database
	.raw("SELECT username FROM users WHERE username = 'stee1ix'")
	.then(() => console.log('MySQL connected '))
	.catch(e => {
		console.log('MySQL not connected');
		console.error(e);
	});

const app = express();

// middlewares
app.use(express.json());

// root route
app.get('/', (req, resp) => {
	resp.send('Welcome to root');
});

//user register route
app.post('/register', (req, resp) => {
	const { username, name, email, hash, birth_date } = req.body;

	if (!username || !name || !email || !hash || !birth_date) {
		resp.status(400).json('incorrect form submission');
	}

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

	database
		.insert({
			username,
			name,
			email,
			hash,
			birth_date,
			created_at: new Date(),
		})
		.into('users')
		.then(resolve => resp.send(`Registered ${username} in DB`))
		.catch(e => resp.status(400).json(e));
});

//server listen
app.listen(process.env.PORT || 5000, () => {
	console.log('server is running');
});
