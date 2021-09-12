const router = require('express').Router();
const verify = require('./verifyToken');
const database = require('../database');
const validator = require('validator');

router.post('/create', verify, (req, resp) => {
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

router.route('/modify').delete(verify, (req, resp) => {
	const { comment_id } = req.body;

	database('comments')
		.where({ comment_id })
		.del()
		.then(deleteCount => {
			resp.status(200).send(`comment deleted`);
		})
		.catch(error => resp.status(400).json(e));
});

module.exports = router;
