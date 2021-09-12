const router = require('express').Router();
const verify = require('./verifyToken');
const database = require('../database');

router.post('/create', verify, (req, resp) => {
	const { caption, image_path } = req.body;
	const { username } = req.user;

	// validations
	if (!username || !caption || !image_path) {
		resp.status(400).json('Invalid request body');
	}

	// add post to DB
	database
		.insert({ caption, username, image_path, created_at: new Date() })
		.into('posts')
		.then(resolve => resp.send(`${username}'s post added to DB`))
		.catch(e => resp.status(400).json(e));
});

module.exports = router;
