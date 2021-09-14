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

router
	.route('/modify')
	.delete(verify, (req, resp) => {
		const { post_id } = req.body;

		database('posts')
			.where({ post_id })
			.del()
			.then(deleteCount => {
				if (deleteCount > 0) {
					resp.send(`post deleted`);
				} else {
					resp.sendStatus(400);
				}
			})
			.catch(e => resp.status(400).json(e));
	})
	.patch(verify, (req, resp) => {
		const { caption, post_id } = req.body;

		database('posts')
			.update({ caption, created_at: new Date() })
			.where({ post_id })
			.then(updateCount => {
				if (updateCount > 0) {
					resp.send(`caption updated`);
				} else {
					resp.sendStatus(400);
				}
			})
			.catch(e => resp.status(400).json(e));
	});

module.exports = router;
