const knex = require('knex');

// connect to DB
const database = knex({
	client: 'mysql',
	connection: {
		host: '127.0.0.1',
		user: 'root',
		password: '',
		database: 'socialchange',
	},
});

// check DB connectivity
database
	.raw('SELECT id FROM users')
	.then(() => console.log('MySQL connected '))
	.catch(e => {
		console.log('MySQL not connected');
		console.error(e);
	});

module.exports = database;
