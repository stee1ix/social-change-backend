const express = require('express')
const knex = require('knex')
const validator = require('validator')

const database = knex({
	client: 'mysql',
	connection: {
		host: '127.0.0.1',
		user: 'root',
		password: '',
		database: 'socialchange'
	}
})

// check database connectivity
database.raw("SELECT username FROM users WHERE username = 'stee1ix'")
	.then(() => console.log("MySQL connected "))
	.catch((e) => {
	    console.log("MySQL not connected")
	    console.error(e)
	})

const app = express()

// middlewares
app.use(express.json())

// root route
app.get('/', (req, resp) => {
	resp.send('Welcome to root')
})

//user register route
app.post('/register', (req, resp) => {
	const { Username, name, email, password } = req.body;

	if (!Username || !name || !email || !password) {
		resp.status(400).json('incorrect form submission')
	}

	if (!validator.isEmail(email)) resp.status(400).json('incorrect email format entered')

	database.insert({ Username, name, email, password })
		.into('users')
		.then(resolve => resp.send(`Registered ${Username} in DB`))
		.catch(e => resp.status(400).json(e))
})

//server listen
app.listen(process.env.PORT || 5000, () => {
	console.log('server is running')
})
