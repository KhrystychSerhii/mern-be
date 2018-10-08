const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');

const User = require('../models/user');



// Register
router.post('/register', (req, res, next) => {
	let newUser = new User({
		email: req.body.email,
		username: req.body.username,
		password: req.body.password
	});
	User.addUser(newUser, (error, user) => {
		if (error) {
			res.json({success: false, msg: 'Fail to register user.', error});
		} else {
			res.json({success: true, msg: 'User created', user: {
				id: user._id,
				email: user.email,
				username: user.username
			} });
		}
	});
});

// Authenticate
router.post('/authenticate', (req, res, next) => {
	const { email, password } = req.body;

	User.getUserByEmail(email, (err, user) => {
		if (err) throw err;
		if (!user) return res.json({ success: false, msg: 'User not found' });

		User.comparePassword(password, user.password, (err, isMatch) => {
			if (err) throw err;
			if (!isMatch) return res.json({ success: false, msg: 'Invalid password' });

			if (isMatch) {
				const token = jwt.sign(user.toJSON(), config.secret, {
					expiresIn: 604800 // 1 week
				});

				res.json({
					success: true,
					token: `JWT ${token}`,
					user: {
						id: user._id,
						username: user.username,
						email: user.email
					}
				});
			};
		});
	});
});

// Profile
router.get('/profile', passport.authenticate('jwt', {session: false}), (req, res, next) => {
	const { username, email } = req.user;
	res.json({success: true, user: { username, email }});
});

// Validate
router.get('/validate', (req, res, next) => {
	res.send('Validate');
});

module.exports = router;