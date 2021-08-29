const express = require('express');

const app = express();

app.get('/', (req, resp) => {
	resp.send('Welcome to root');
});

app.listen(process.env.PORT || 5000, () => {
	console.log('server is running');
});
