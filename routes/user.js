const router = require('express').Router();
const verify = require('./verifyToken');
const database = require('../database');

router.patch('/name', verify, (req, resp) => {
	const { name } = req.body;
	const { username } = req.user;

	database('users')
		.update({ name })
		.where({ username })
		.then(updateCount => {
			if (updateCount > 0) {
				resp.send(`name updated`);
			} else {
				resp.sendStatus(400);
			}
		})
		.catch(e => resp.status(400).json(e));
});

router.patch('/bio', verify, (req, resp) => {
	const { bio } = req.body;
	const { username } = req.user;

	database('users')
		.update({ bio })
		.where({ username })
		.then(updateCount => {
			if (updateCount > 0) {
				resp.send(`bio updated`);
			} else {
				resp.sendStatus(400);
			}
		})
		.catch(e => resp.status(400).json(e));
});

router.patch('/birthdate', verify, (req, resp) => {
	const { birth_date } = req.body;
	const { username } = req.user;

	database('users')
		.update({ birth_date })
		.where({ username })
		.then(updateCount => {
			if (updateCount > 0) {
				resp.send(`birth_date updated`);
			} else {
				resp.sendStatus(400);
			}
		})
		.catch(e => resp.status(400).json(e));
});

module.exports = router;
