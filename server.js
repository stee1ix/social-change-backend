const express = require('express');

const app = express();

// middlewares
app.use(express.json());

// import routes
const authRoute = require('./routes/auth');

// route middlewares
app.use('/api/user', authRoute);

// root route
app.get('/', (req, resp) => {
	resp.send('Welcome to root');
});

//server listen
app.listen(process.env.PORT || 5000, () => {
	console.log('server is running');
});
