const router = require('express').Router();
const verify = require('./verifyToken');
const database = require('../database');
const validator = require('validator');

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

router.post('/comment', verify, (req, resp) => {
	const { message, post_id } = req.body;
	const { username } = req.user;

	// validations
	if (!username || !message || !post_id) {
		resp.status(400).json('Invalid request body');
	}

	if (!validator.isInt(post_id.toString())) {
		resp.status(400).json('incorrect post_id format');
	}

	// add comment to DB
	database
		.insert({ message, post_id, username, created_at: new Date() })
		.into('comments')
		.then(resolve =>
			resp.send(`${username}'s comment added to post_id ${post_id}`)
		)
		.catch(e => resp.status(400).json(e));
});

module.exports = router;
