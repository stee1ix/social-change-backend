const router = require('express').Router();
const verify = require('./verifyToken');

router.get('/', verify, (req, resp) => {
	resp.json({
		posts: {
			title: 'My first post',
			description:
				'Random data you shouldnt access without being logged in',
		},
		userId: req.userId,
	});
});

module.exports = router;
