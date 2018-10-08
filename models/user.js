const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('../config/database');

// User Schema
const UserSchema = mongoose.Schema({
	username: {
		type: String,
		required: true
	},
	email: {
		type: String,
		required: true
	},
	password: {
		type: String,
		required: true
	}
});

const User = module.exports = mongoose.model('User', UserSchema);

module.exports.getUserById = (id, callback) => {
		User.findById(id, callback);
};
module.exports.getUserByUsername = (username, callback) => {
	const query = {username: username};
	User.findOne(query, callback);
};
module.exports.getUserByEmail = (email, callback) => {
	const query = {email: email};
	User.findOne(query, callback);
};
module.exports.addUser = (newUser, callback) => {
	bcrypt.genSalt(10, (err, salt) => {
		bcrypt.hash(newUser.password, salt, (err, hash) => {
			// if (err) throw err;
			newUser.password = hash;
			newUser.save(callback);
		});
	});
};
module.exports.comparePassword = (comparedPassword, hash, callback) => {
	bcrypt.compare(comparedPassword, hash, (err, isMatch) => {
		// if (err) throw err;
		if (isMatch) {
			callback(null, true);
		} else {
			callback('Password is not match.', false);
		}
	});
};