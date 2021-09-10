const express = require('express');
require('dotenv').config();

const app = express();

// import routes
const authRoute = require('./routes/auth');
const postRoute = require('./routes/posts');

// middlewares
app.use(express.json());

// route middlewares
app.use('/api/user', authRoute);
app.use('/api/posts', postRoute);

// root route
app.get('/', (req, resp) => {
	resp.send('Welcome to root');
});

//server listen
app.listen(process.env.PORT || 5000, () => {
	console.log('server is running');
});
