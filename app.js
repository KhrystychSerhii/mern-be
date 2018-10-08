const express = require('express');
const path = require('path');
const bodyparser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const mongoose = require('mongoose');
const config = require('./config/database');


mongoose.connect(config.database, { useNewUrlParser: true });

// On Connect
mongoose.connection.on('connected', () => {
	console.log('Connected to database', config.database)
});

// On Error
mongoose.connection.on('error', (error) => {
	console.log('Database error', error);
});

const app = express();

const users = require('./routes/users');
const employees = require('./routes/employees');

// Port Number
const port = 2000;

// CORS Middleware
app.use(cors());

// Set Static Folder
// app.use(express.static(path.join(__dirname, 'public')));

// Body Parser Middleware
app.use(bodyparser.json());

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

require('./config/passport')(passport);

app.use('/users', users);
app.use('/employees', employees);

// Index Route
app.get('/', (req, res) => {
	res.send('Invalid Endpoint');
});

// Start Server
app.listen(port, () => {
	console.log('server started on port =', port);
});
